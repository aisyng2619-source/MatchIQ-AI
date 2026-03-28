"""
MatchIQ AI - Main FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health, match, players
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="MatchIQ AI",
    description="AI-Powered Cricket Tactical Decision Intelligence System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# NOTE: health includes /health, /generate-recommendation, and /simulation-state at root
app.include_router(health.router, tags=["Health"])
app.include_router(match.router, prefix="/match", tags=["Match"])
app.include_router(players.router, prefix="/player-insight", tags=["Players"])

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🏏 MatchIQ AI Backend Starting...")
    print("📊 Loading tactical intelligence data...")
    print("✅ Backend ready for tactical decisions!")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("🛑 MatchIQ AI Backend Shutting Down...")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
