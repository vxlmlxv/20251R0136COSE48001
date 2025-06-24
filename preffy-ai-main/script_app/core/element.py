from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ScriptSentence(BaseModel):
    index: int = Field(
        ..., description="스크립트 내 문장의 인덱스입니다."
    )
    speaker: str = Field(
        "발표자", description="해당 문장을 말한 화자입니다."
    )
    content: str = Field(
        ..., description="실제 문장 텍스트입니다."
    )
    timestamp: Optional[str] = Field(
        None, description="문장의 타임스탬프(선택적)입니다."
    )