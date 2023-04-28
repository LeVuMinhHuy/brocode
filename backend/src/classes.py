import os

from enum import Enum
from pydantic import BaseModel, BaseSettings
from dataclasses import dataclass

class Settings(BaseSettings):
    BASE_URL = "http://localhost:8000"
    USE_NGROK = os.environ.get("USE_NGROK", "False") == "True"

class Language(str, Enum):
    python = "python"
    rust = "rust"

class Code(BaseModel):
    data: str
    language: Language
    #temperature: float = 0.8
    #max_new_tokens: int = 70
    #top_p: float = 0.9
    #top_k: int = 0

@dataclass
class ModelData:
    model_generate: str
    model_summarize: str
    #temperature: float
    #max_new_tokens: int
    #top_p: float
    #top_k: int

#@dataclass
#class GenerationData:
#    model_data: ModelData
