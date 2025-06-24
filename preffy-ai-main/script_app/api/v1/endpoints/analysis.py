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
    FillerWordAnalysisResponse
)
from ....services.script_analysis import (
    speech_act,
    filler_word
)
from ....services.script_analysis.io import (
    SpeechActAnalysisOutput,
    SpeechActAnalysisElement
)
from ....utils.transcript_utils import (
    get_video_information
)

log = logger.get_logger(__name__)

router = APIRouter(
    prefix="/analysis",
    tags=["analysis"]
)

@router.post(
    "/speech_act",
    response_model=SpeechActAnalysisResponse,
    summary="발표 스크립트 화행 분석",
)
async def get_speech_act_analysis(
    request: BaseScriptRequest
):
    request_data = get_video_information(request.project_id)  
    
    output = await speech_act.SpeechActAnalyzer().get_speech_act(
        script=request_data['script'],
        metadata=request_data['metadata']
    )

    return SpeechActAnalysisResponse(
        results=output.output,
        metadata=request_data['metadata']
    )
    

@router.post(
    "/filler_word",
    response_model=FillerWordAnalysisResponse,
    summary="발표 스크립트 필러 단어 피드백",
)
async def get_filler_word_feedback(
    request: BaseScriptRequest
):
    request_data = get_video_information(request.project_id)
    
    output = await filler_word.FillerWordAnalyzer().get_filler_word(
        script=request_data['script'],
        metadata=request_data['metadata']
    )

    return FillerWordAnalysisResponse(
        results=output.output,
        metadata=request_data['metadata']
    )