import json
import asyncio
import itertools
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Literal, Optional

# class FeedbackItem(BaseModel):
#     index: int = Field(
#         ..., description="Index of the sentence in the script to be revised"
#     )
#     suggestion: str = Field(
#         ..., description="Suggested revision for the sentence"
#     )
#     reason: str = Field(
#         ..., description="Reason for the suggested revision"
#     )


class FeedbackDetail(BaseModel):
    audience_and_formality_feedback: Optional[str] = Field(
        ..., description="청중과 격식에 대한 피드백"
    )
    delivery_feedback: Optional[str] = Field(
        ..., description="전달 방식에 대한 피드백"
    )
    clarity_feedback: Optional[str] = Field(
        ..., description="명확성에 대한 피드백"
    )
    revise_suggestion: Optional[str] = Field(
        ..., description="최종적으로 문제가 있는 부분이 수정된 문장",
    )

class FeedbackElement(BaseModel):
    index: int = Field(
        ..., description="문장의 인덱스 (숫자)"
    )
    need_feedback: bool = Field(
        ..., description="피드백이 필요한지 여부 (True/False)"
    )
    feedback_detail: Optional[FeedbackDetail] = Field(
        ..., description="피드백 내용"
    )

class FeedbackOutput(BaseModel):
    output: List[FeedbackElement] = Field(
        ..., description="스크립트 전체 피드백 리스트"
    )