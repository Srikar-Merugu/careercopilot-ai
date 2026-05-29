from pydantic import BaseModel, Field
from typing import Dict, Optional

class HealthCheckSchema(BaseModel):
    status: str = Field(..., example="healthy")
    environment: str = Field(..., example="development")
    version: str = Field(..., example="1.0.0")
    database: str = Field(..., example="connected")
    details: Optional[Dict[str, str]] = Field(default=None)
