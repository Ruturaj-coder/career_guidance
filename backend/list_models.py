import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Configure the API
genai.configure(api_key=api_key)

# List available models
try:
    models = genai.list_models()
    print("Available models:")
    for model in models:
        print(f"- {model.name}: {model.supported_generation_methods}")
except Exception as e:
    print(f"Error listing models: {str(e)}") 