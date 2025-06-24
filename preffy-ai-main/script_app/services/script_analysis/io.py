import json
import asyncio
import itertools
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Literal

class SpeechActAnalysisElement(BaseModel):
    index: int = Field(
        ..., description="Index of the sentence in the script"
    )
    speech_act: Literal["representatives", "directives", "commissives", "expressives", "declaratives"] = Field(
        ..., 
        description=(
            "Speech act type. One of: "
            "representatives (to commit the speaker to something's being the case, to the truth of the expressed proposition), "
            "directives (attempts by the speaker to get the hearer to do something), "
            "commissives (commit the speaker to some future course of action), "
            "expressives (express the psychological state specified in the sincerity condition about a state of affairs specified in the propositional content), "
            "declaratives (brings about the correspondence between the propositional content and reality)"
        )
    )
    

class SpeechActAnalysisOutput(BaseModel):
    output: List[SpeechActAnalysisElement] = Field(
        ..., description="List of classified speech acts"
    )
    
    


class FillerWordAnalysisElement(BaseModel):
    indexes: List[int] = Field(
        ..., description="List of indices of sentences where the filler word is found"
    )
    filler_word: str = Field(
        ..., description="Filler word found in the sentence"
    )


class FillerWordAnalysisOutput(BaseModel):
    output: List[FillerWordAnalysisElement] = Field(
        ..., description="List of filler words found in the script"
    )