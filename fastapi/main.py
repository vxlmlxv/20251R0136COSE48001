from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import uuid
import json
from typing import List, Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Preffy AI Analysis API",
    description="AI-powered video analysis for presentation improvement",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8081", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class AnalysisRequest(BaseModel):
    video_url: str
    project_id: str
    analysis_type: str = "full"

class AnalysisResponse(BaseModel):
    project_id: str
    status: str
    progress: int
    message: str

class ScriptSegment(BaseModel):
    start: float
    end: float
    text: str
    speech_act: str
    confidence: float

class PostureEvent(BaseModel):
    action_name: str
    start_frame: int
    end_frame: int
    duration_seconds: float
    confidence: float

# Mock analysis functions (replace with your actual AI models)
def analyze_speech(video_path: str) -> List[ScriptSegment]:
    """Mock speech analysis - replace with your actual implementation"""
    return [
        ScriptSegment(
            start=0.0,
            end=5.0,
            text="Welcome to today's presentation",
            speech_act="representatives",
            confidence=0.95
        ),
        ScriptSegment(
            start=5.0,
            end=10.0,
            text="Let's begin with our main topic",
            speech_act="directives",
            confidence=0.92
        )
    ]

def analyze_posture(video_path: str) -> List[PostureEvent]:
    """Mock posture analysis - replace with your actual implementation"""
    return [
        PostureEvent(
            action_name="slouching",
            start_frame=150,
            end_frame=300,
            duration_seconds=5.0,
            confidence=0.85
        ),
        PostureEvent(
            action_name="self_touching",
            start_frame=450,
            end_frame=520,
            duration_seconds=2.3,
            confidence=0.78
        )
    ]

def generate_suggestions(script_segments: List[ScriptSegment], posture_events: List[PostureEvent]) -> List[Dict]:
    """Generate improvement suggestions based on analysis"""
    suggestions = []
    
    # Script suggestions
    for segment in script_segments:
        if segment.confidence < 0.9:
            suggestions.append({
                "type": "modify",
                "section_id": f"segment_{segment.start}",
                "original_text": segment.text,
                "suggested_text": f"Consider rephrasing: {segment.text}",
                "explanation": "This segment could be clearer for better audience engagement"
            })
    
    # Posture suggestions
    for event in posture_events:
        suggestions.append({
            "type": "improve",
            "section_id": f"posture_{event.start_frame}",
            "original_text": "",
            "suggested_text": f"Improve {event.action_name} at {event.duration_seconds:.1f}s",
            "explanation": f"Detected {event.action_name} behavior that may distract from your message"
        })
    
    return suggestions

# In-memory storage for demo (use database in production)
analysis_results = {}

@app.get("/")
async def root():
    return {"message": "Preffy AI Analysis API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "fastapi"}

@app.post("/analyze", response_model=AnalysisResponse)
async def start_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """Start video analysis process"""
    try:
        project_id = request.project_id
        
        # Initialize analysis status
        analysis_results[project_id] = {
            "status": "processing",
            "progress": 0,
            "script_segments": [],
            "posture_events": [],
            "suggestions": []
        }
        
        # Start background analysis
        background_tasks.add_task(process_video_analysis, request.video_url, project_id)
        
        return AnalysisResponse(
            project_id=project_id,
            status="processing",
            progress=0,
            message="Analysis started successfully"
        )
    
    except Exception as e:
        logger.error(f"Error starting analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def process_video_analysis(video_url: str, project_id: str):
    """Background task to process video analysis"""
    try:
        # Update progress
        analysis_results[project_id]["progress"] = 25
        analysis_results[project_id]["status"] = "analyzing_speech"
        
        # Mock video download and processing
        # In production, download video from video_url
        video_path = f"/tmp/video_{project_id}.mp4"
        
        # Analyze speech
        script_segments = analyze_speech(video_path)
        analysis_results[project_id]["script_segments"] = [seg.dict() for seg in script_segments]
        analysis_results[project_id]["progress"] = 50
        
        # Analyze posture
        analysis_results[project_id]["status"] = "analyzing_posture"
        posture_events = analyze_posture(video_path)
        analysis_results[project_id]["posture_events"] = [event.dict() for event in posture_events]
        analysis_results[project_id]["progress"] = 75
        
        # Generate suggestions
        analysis_results[project_id]["status"] = "generating_suggestions"
        suggestions = generate_suggestions(script_segments, posture_events)
        analysis_results[project_id]["suggestions"] = suggestions
        
        # Complete
        analysis_results[project_id]["status"] = "completed"
        analysis_results[project_id]["progress"] = 100
        
        logger.info(f"Analysis completed for project {project_id}")
        
    except Exception as e:
        logger.error(f"Error in analysis: {e}")
        analysis_results[project_id]["status"] = "failed"
        analysis_results[project_id]["message"] = str(e)

@app.get("/analysis/{project_id}/status")
async def get_analysis_status(project_id: str):
    """Get analysis status and progress"""
    if project_id not in analysis_results:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    result = analysis_results[project_id]
    return {
        "project_id": project_id,
        "status": result["status"],
        "progress": result["progress"]
    }

@app.get("/analysis/{project_id}/script-segments")
async def get_script_segments(project_id: str):
    """Get analyzed script segments"""
    if project_id not in analysis_results:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return analysis_results[project_id]["script_segments"]

@app.get("/analysis/{project_id}/posture-events")
async def get_posture_events(project_id: str):
    """Get posture analysis results"""
    if project_id not in analysis_results:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return analysis_results[project_id]["posture_events"]

@app.get("/analysis/{project_id}/suggestions")
async def get_suggestions(project_id: str):
    """Get improvement suggestions"""
    if project_id not in analysis_results:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return analysis_results[project_id]["suggestions"]

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload video file for analysis"""
    try:
        # Create uploads directory if it doesn't exist
        os.makedirs("/app/uploads", exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = f"/app/uploads/{unique_filename}"
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return {
            "filename": unique_filename,
            "original_filename": file.filename,
            "file_path": file_path,
            "file_size": len(content)
        }
    
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
