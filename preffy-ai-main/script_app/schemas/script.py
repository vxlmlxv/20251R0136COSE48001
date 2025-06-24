from pydantic import BaseModel, Field
from typing import Dict, List, Any, Literal

from ..core.element import (
    ScriptSentence
)
from ..services.script_analysis.io import (
    SpeechActAnalysisElement,
    FillerWordAnalysisElement
)
from ..services.script_feedback.io import (
    FeedbackOutput,
    FeedbackElement
)


class BaseScriptRequest(BaseModel):
    project_id: str = Field(default='dummy_video', description="Unique video identifier")


class SpeechActAnalysisResponse(BaseModel):
    results: List[SpeechActAnalysisElement] = Field(
        ...,
        description="화행 분석 결과 리스트(문장 인덱스, 화행 유형 등)",
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="기본 정보(예: 세션 ID, Formality, Target Audience 등)",
    )


class FillerWordAnalysisResponse(BaseModel):
    results: List[FillerWordAnalysisElement] = Field(
        ...,
        description="필러 단어 분석 결과 리스트(문장 인덱스, 필러 단어 등)",
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="기본 정보(예: 세션 ID, Formality, Target Audience 등)",
    )
    
    
class FeedbackResponse(BaseModel):
    results: List[FeedbackElement] = Field(
        ...,
        description="피드백 결과 리스트(문장 인덱스, 피드백 내용 등)",
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="기본 정보(예: 세션 ID, Formality, Target Audience 등)",
    )
    
    
class ScriptRegisterRequest(BaseModel):
    project_id: str = Field(
        default="test_video", 
        description="Unique video identifier"
    )
    video_url: str = Field(
        default="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        description="URL of the video to download"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="기본 정보(예: 세션 ID, Formality, Target Audience 등)",
        examples=[
            {
                "project_id": "test_video",
                "formality": "formal",
                "target_audience": "general public",
            }
        ]
    )