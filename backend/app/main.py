from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import career_guidance

app = FastAPI(
    title="Career Guidance API",
    description="API for the Career Guidance feature of the Personalized Learning Platform",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    career_guidance.router,
    prefix="/uccha-shiksha/career-guidance",
    tags=["Career Guidance"]
) 