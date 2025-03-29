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

class UserSkills(BaseModel):
    current_skills: List[str]
    target_role: str
    experience_level: str
    location: str
    
class SalaryRequest(BaseModel):
    role: str
    location: str
    experience_years: int
    skills: List[str]

class NetworkingRequest(BaseModel):
    user_name: str
    target_contact_role: str
    shared_interests: List[str]
    purpose: str
    platform: str  # "linkedin" or "email"

class PortfolioRequest(BaseModel):
    target_role: str
    current_skills: List[str]
    experience_level: str
    interests: List[str]

class StressManagementRequest(BaseModel):
    current_situation: str
    stress_factors: List[str]
    previous_strategies: Optional[List[str]]

class ConfidenceRequest(BaseModel):
    query: str
    context: str
    past_experiences: Optional[List[str]]

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

@router.post("/mentor/skills-gap")
async def analyze_skills_gap(skills: UserSkills):
    try:
        logger.info(f"Analyzing skills gap for target role: {skills.target_role}")
        
        prompt = f"""As a career mentor, analyze the skills gap for this situation:
        Current Skills: {', '.join(skills.current_skills)}
        Target Role: {skills.target_role}
        Experience Level: {skills.experience_level}
        Location: {skills.location}

        Please provide:
        1. Missing Critical Skills: List the most important skills they need to develop
        2. Skill Development Priority: Order the missing skills by importance
        3. Learning Resources: Suggest specific resources for each missing skill
        4. Timeline: Estimated time to acquire each skill
        5. Practice Projects: Suggest real-world projects to build these skills"""
        
        response = model.generate_content(prompt)
        return {"analysis": response.text if hasattr(response, 'text') else str(response)}
    except Exception as e:
        logger.error(f"Error in skills gap analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mentor/salary-benchmark")
async def get_salary_benchmark(request: SalaryRequest):
    try:
        logger.info(f"Getting salary benchmark for {request.role} in {request.location}")
        
        prompt = f"""As a career mentor with market insights, provide detailed salary information for:
        Role: {request.role}
        Location: {request.location}
        Experience: {request.experience_years} years
        Skills: {', '.join(request.skills)}

        Please provide:
        1. Salary Range: Entry, Mid, Senior levels
        2. Market Demand: Current job market demand in the region
        3. Compensation Factors: Key factors affecting salary
        4. Industry Variations: How salary varies by industry
        5. Future Outlook: Salary growth potential
        6. Negotiation Tips: Key points for salary negotiation"""
        
        response = model.generate_content(prompt)
        return {"benchmark": response.text if hasattr(response, 'text') else str(response)}
    except Exception as e:
        logger.error(f"Error in salary benchmarking: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mentor/portfolio-guidance")
async def get_portfolio_guidance(request: PortfolioRequest):
    try:
        logger.info(f"Generating portfolio guidance for {request.target_role}")
        
        prompt = f"""As a career mentor, suggest portfolio projects for:
        Target Role: {request.target_role}
        Current Skills: {', '.join(request.current_skills)}
        Experience Level: {request.experience_level}
        Interests: {', '.join(request.interests)}

        Please provide:
        1. Project Ideas: 3-5 portfolio project suggestions
        2. Technical Stack: Recommended technologies for each project
        3. Learning Outcomes: Skills demonstrated by each project
        4. Implementation Steps: High-level implementation guide
        5. Portfolio Presentation: How to present these projects effectively
        6. Industry Relevance: Why these projects matter to employers"""
        
        response = model.generate_content(prompt)
        return {"guidance": response.text if hasattr(response, 'text') else str(response)}
    except Exception as e:
        logger.error(f"Error in portfolio guidance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mentor/networking-script")
async def generate_networking_script(request: NetworkingRequest):
    try:
        logger.info(f"Generating networking script for {request.platform}")
        
        prompt = f"""As a career mentor, create a personalized {request.platform} outreach message for:
        User Name: {request.user_name}
        Target Contact Role: {request.target_contact_role}
        Shared Interests: {', '.join(request.shared_interests)}
        Purpose: {request.purpose}

        Please provide:
        1. Outreach Message: Professional and personalized
        2. Follow-up Templates: 2-3 follow-up message variations
        3. Key Points: What makes this outreach effective
        4. Customization Tips: How to adapt for different scenarios
        5. Best Practices: Platform-specific etiquette tips"""
        
        response = model.generate_content(prompt)
        return {"script": response.text if hasattr(response, 'text') else str(response)}
    except Exception as e:
        logger.error(f"Error in networking script generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mentor/confidence-building")
async def build_confidence(request: ConfidenceRequest):
    try:
        logger.info("Processing confidence building request")
        
        prompt = f"""As a supportive career mentor, help build confidence by addressing:
        Query: {request.query}
        Context: {request.context}
        Past Experiences: {', '.join(request.past_experiences) if request.past_experiences else 'Not provided'}

        Please provide:
        1. Reframing: Transform negative self-talk into positive perspectives
        2. Evidence: Point out past successes and transferable skills
        3. Action Steps: Specific actions to build confidence
        4. Affirmations: Personalized professional affirmations
        5. Success Stories: Relevant examples of others overcoming similar doubts"""
        
        response = model.generate_content(prompt)
        return {"guidance": response.text if hasattr(response, 'text') else str(response)}
    except Exception as e:
        logger.error(f"Error in confidence building: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mentor/stress-management")
async def manage_stress(request: StressManagementRequest):
    try:
        logger.info("Processing stress management request")
        
        prompt = f"""As a career mentor with expertise in stress management, provide strategies for:
        Current Situation: {request.current_situation}
        Stress Factors: {', '.join(request.stress_factors)}
        Previous Strategies: {', '.join(request.previous_strategies) if request.previous_strategies else 'None mentioned'}

        Please provide:
        1. Immediate Actions: Quick stress relief techniques
        2. Long-term Strategies: Sustainable stress management practices
        3. Professional Impact: How to maintain performance under stress
        4. Boundary Setting: Professional boundary-setting techniques
        5. Support Systems: How to build and utilize support networks
        6. Warning Signs: How to recognize and prevent burnout"""
        
        response = model.generate_content(prompt)
        return {"strategies": response.text if hasattr(response, 'text') else str(response)}
    except Exception as e:
        logger.error(f"Error in stress management: {str(e)}")
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