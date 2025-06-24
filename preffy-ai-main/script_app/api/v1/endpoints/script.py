import asyncio
from datetime import datetime

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from starlite import Response, status_codes

from ....schemas.script import (
    ScriptRegisterRequest
)

from ....core import config, logger
from ....services.transcript.whisper import (
    transcribe_single_mp4
)
from ....utils.transcript_utils import (
    download_video,
    save_video_information,
    # transcription_to_script_sentences
)

from .analysis import (
    router as analysis_router
)
from .feedback import (
    router as feedback_router
)

log = logger.get_logger(__name__)

router = APIRouter(
    prefix="/script",
    # tags=["script"]
)
router.include_router(
    analysis_router,
    # prefix="/analysis",
    tags=["analysis"]
)
router.include_router(
    feedback_router,
    # prefix="/feedback",
    tags=["feedback"]
)


@router.post("", response_class=JSONResponse)
async def register_script(request: ScriptRegisterRequest):
    try:
        temp_file_path = await download_video(request.video_url)
        log.info(f"Video downloaded for project_id={request.project_id} at {temp_file_path}")
        
        script = transcribe_single_mp4(temp_file_path, language='ko')
        log.info(f"Transcription completed for project_id={request.project_id}")
        
        # transcription_script = transcription_to_script_sentences(transcription)
        
        save_video_information(request.project_id, temp_file_path, metadata=request.metadata, script=script)
        
        return {"success": True, "project_id": request.project_id, "temp_file_path": temp_file_path}
    
    except Exception as e:
        log.error(f"Failed to download video: {e}")
        raise HTTPException(status_code=500, detail="Failed to download video")