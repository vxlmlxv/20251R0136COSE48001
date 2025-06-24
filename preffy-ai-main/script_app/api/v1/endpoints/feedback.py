import asyncio
from datetime import datetime

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from starlite import Response, status_codes

from ....core import config, logger
from ....schemas.script import (
    BaseScriptRequest,
    SpeechActAnalysisResponse,
    FillerWordAnalysisResponse,
    FeedbackResponse
)
from ....utils.transcript_utils import (
    get_video_information
)
from ....services.script_feedback import (
    all_in_one
)


log = logger.get_logger(__name__)

router = APIRouter(
    prefix="/feedback",
    tags=["feedback"]
)

@router.post(
    "",
    response_model=FeedbackResponse,
    summary="발표 스크립트 피드백",
)
async def get_feedback(
    request: BaseScriptRequest
):
    request_data = get_video_information(request.project_id)
    
    output = await all_in_one.Feedback().get_feedback(
        script=request_data['script'],
        metadata=request_data['metadata']
    )

    return FeedbackResponse(
        results=output.output,
        metadata=request_data['metadata']
    )