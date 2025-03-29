from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from datetime import datetime
import os
from dotenv import load_dotenv
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.error("GEMINI_API_KEY not found in environment variables")
    raise Exception("GEMINI_API_KEY not configured")

# Configure Gemini API
try:
    genai.configure(api_key=api_key)
    
    # Try to load available models
    available_models = []
    try:
        models = genai.list_models()
        available_models = [model.name for model in models]
        logger.info(f"Available models: {available_models}")
    except Exception as e:
        logger.warning(f"Could not list available models: {str(e)}")
    
    # Configure safety settings
    generation_config = {
        "temperature": 0.7,
        "top_p": 1,
        "top_k": 1,
        "max_output_tokens": 2048,
    }

    # Try these models that are available in the user's region
    model_variants = [
        "models/gemini-1.5-pro", 
        "models/gemini-1.5-flash",
        "models/gemini-2.0-flash",
        "models/gemini-1.5-pro-latest",
        "models/gemini-1.5-flash-latest"
    ]
    
    # Initialize with a default
    model = None
    model_used = None
    
    # Try each model until one works
    for model_name in model_variants:
        try:
            logger.info(f"Trying to initialize model: {model_name}")
            model = genai.GenerativeModel(model_name=model_name,
                                        generation_config=generation_config)
            # Test the model
            test_response = model.generate_content("Hello")
            if hasattr(test_response, 'text'):
                model_used = model_name
                logger.info(f"Successfully initialized model: {model_name}")
                break
        except Exception as e:
            logger.warning(f"Failed to initialize model {model_name}: {str(e)}")
    
    if not model:
        logger.error("Could not initialize any Gemini model")
        raise Exception("No available Gemini models could be initialized")
        
except Exception as e:
    logger.error(f"Failed to configure Gemini API: {str(e)}")
    raise Exception(f"Gemini API configuration failed: {str(e)}")

router = APIRouter()

# Pydantic models for request/response validation
class MentorQuery(BaseModel):
    query: str

class RoadmapRequest(BaseModel):
    career_field: str
    experience_level: str
    interests: List[str]

class CounselingSession(BaseModel):
    counselor_id: str
    session_type: str  # "chat" or "video"
    preferred_date: str
    preferred_time: str
    user_id: str

# In-memory storage for counseling sessions
counseling_sessions = []

@router.post("/mentor")
async def get_career_advice(query: MentorQuery):
    try:
        logger.info(f"Received mentor query: {query.query}")
        
        # Validate API configuration
        if not model:
            raise HTTPException(status_code=500, detail="AI model not available")
            
        # Create prompt with safety guidelines
        prompt = f"""As a career mentor, please provide professional advice for the following query. 
        Focus on providing constructive, practical guidance while maintaining professionalism: 
        {query.query}"""
        
        # Generate response with error handling
        try:
            response = model.generate_content(prompt)
            if hasattr(response, 'text'):
                logger.info("Successfully generated career advice")
                return {"response": response.text}
            else:
                # If response doesn't have text attribute, try to access it another way
                logger.warning("Response doesn't have text attribute")
                response_dict = response.to_dict()
                logger.info(f"Response structure: {json.dumps(response_dict, default=str)}")
                
                # Try to extract text from different response formats
                if 'candidates' in response_dict and response_dict['candidates']:
                    if 'content' in response_dict['candidates'][0]:
                        content = response_dict['candidates'][0]['content']
                        if 'parts' in content and content['parts']:
                            return {"response": content['parts'][0]['text']}
                
                return {"response": "I received your question, but I'm having trouble formatting my response. Please try again."}
            
        except Exception as api_error:
            logger.error(f"Gemini API error: {str(api_error)}")
            return {"response": "I apologize, but I'm having trouble generating a response right now. Please try again in a moment."}
        
    except Exception as e:
        logger.error(f"Error in get_career_advice: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/roadmap")
async def generate_roadmap(request: RoadmapRequest):
    try:
        logger.info(f"Generating roadmap for career field: {request.career_field}")
        
        # Validate API configuration
        if not model:
            raise HTTPException(status_code=500, detail="AI model not available")
            
        prompt = f"""Create a detailed career roadmap for someone interested in {request.career_field} 
        with {request.experience_level} experience level and interests in {', '.join(request.interests)}.
        Please format the response as a clear, step-by-step guide with the following sections:
        1. Educational Requirements
        2. Essential Skills
        3. Career Progression Steps
        4. Timeline Recommendations
        5. Additional Resources"""
        
        try:
            response = model.generate_content(prompt)
            if hasattr(response, 'text'):
                logger.info("Successfully generated career roadmap")
                return {"roadmap": response.text}
            else:
                # If response doesn't have text attribute, try to access it another way
                logger.warning("Response doesn't have text attribute")
                response_dict = response.to_dict()
                
                # Try to extract text from different response formats
                if 'candidates' in response_dict and response_dict['candidates']:
                    if 'content' in response_dict['candidates'][0]:
                        content = response_dict['candidates'][0]['content']
                        if 'parts' in content and content['parts']:
                            return {"roadmap": content['parts'][0]['text']}
                
                return {"roadmap": "I received your roadmap request, but I'm having trouble formatting my response. Please try again."}
            
        except Exception as api_error:
            logger.error(f"Gemini API error: {str(api_error)}")
            return {"roadmap": "I apologize, but I'm having trouble generating a roadmap right now. Please try again in a moment."}
        
    except Exception as e:
        logger.error(f"Error in generate_roadmap: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/schedule")
async def schedule_counseling(session: CounselingSession):
    try:
        logger.info(f"Scheduling counseling session for user: {session.user_id}")
        
        session_dict = session.dict()
        session_dict["id"] = len(counseling_sessions) + 1
        session_dict["status"] = "scheduled"
        
        if session.session_type == "video":
            session_dict["meeting_link"] = f"https://meet.google.com/placeholder-{session_dict['id']}"
        
        counseling_sessions.append(session_dict)
        
        logger.info(f"Successfully scheduled session with ID: {session_dict['id']}")
        return session_dict
        
    except Exception as e:
        logger.error(f"Error in schedule_counseling: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/success-stories")
async def get_success_stories():
    try:
        logger.info("Fetching success stories")
        stories = [
            {
                "id": 1,
                "name": "John Doe",
                "field": "Software Engineering",
                "story": "Started as a self-taught programmer and now leads a development team at a major tech company."
            },
            {
                "id": 2,
                "name": "Jane Smith",
                "field": "Data Science",
                "story": "Transitioned from marketing to data science through online courses and determination."
            }
        ]
        logger.info("Successfully fetched success stories")
        return stories
        
    except Exception as e:
        logger.error(f"Error in get_success_stories: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@router.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "api_key_configured": bool(api_key),
        "model_initialized": bool(model),
        "model_used": model_used
    } 