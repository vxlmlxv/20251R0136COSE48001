from pathlib import Path
from pydantic import BaseSettings
from typing import Optional, ClassVar
import os

# Environment Variables
ENV_PATH = Path(__file__).resolve().parent.parent.parent / "deploy" / "env" / "dev.env"


class Settings(BaseSettings):
    # Prompt Versions
    SPEECH_ACT_PROMPT_VERSION: ClassVar[str] = "1.0"
    FILLER_WORD_PROMPT_VERSION: ClassVar[str] = "1.0"
    PARAPHRASE_PROMPT_VERSION: ClassVar[str] = "1.0"
    
    # Project Paths
    ROOT_DIR: Path = Path(__file__).resolve().parent.parent
    
    # Project Configuration
    DEBUG: bool = False
    PROJECT_NAME: Optional[str] = "Preffy"
    PROJECT_DESCRIPTION: Optional[str] = "API for providing presentation feedback"
    PROJECT_VERSION: Optional[str] = "0.1.0"
    
    # OpenAI API Configuration
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL_NAME: Optional[str] = os.getenv("OPENAI_MODEL_NAME", "gpt-4.1-mini")
    
    # Google API Configuration
    GOOGLE_API_KEY: Optional[str] = os.getenv("GOOGLE_API_KEY")

    class Config:
        env_file = ENV_PATH
        case_sensitive = True


settings = Settings()