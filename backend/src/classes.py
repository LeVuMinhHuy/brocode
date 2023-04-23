from enum import Enum
from pydantic import BaseModel
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

@dataclass
class ModelData:
    model: str
    gpu_device: int = 0

@dataclass
class GenerationData:
    model_data: ModelData
    prompt: str
