import uuid
from datetime import datetime
from beanie import Document
from pydantic import Field
import enum


class EmbeddingType(str, enum.Enum):
    RESUME_FULL = "resume_full"
    RESUME_SKILLS = "resume_skills"
    RESUME_EXPERIENCE = "resume_experience"
    RESUME_PROJECTS = "resume_projects"
    RESUME_SUMMARY = "resume_summary"
    JOB_DESCRIPTION = "job_description"
    JOB_SKILLS = "job_skills"
    JOB_TITLE = "job_title"


class Embedding(Document):
    user_id: str = Field(..., index=True)
    vector_id: str = Field(..., index=True)
    embedding_type: str = Field(...)
    source_id: str | None = Field(default=None, index=True)
    dimensions: int = Field(default=1536)
    meta_data: dict = Field(default={})
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "embeddings"


class CareerInsight(Document):
    user_id: str = Field(..., index=True)
    resume_id: str | None = Field(default=None)
    strengths: list = Field(default=[])
    weaknesses: list = Field(default=[])
    missing_skills: list = Field(default=[])
    recommendations: list = Field(default=[])
    career_paths: list = Field(default=[])
    ai_summary: str | None = Field(default=None)
    confidence_score: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "career_insights"


class Recommendation(Document):
    user_id: str = Field(..., index=True)
    recommendation_type: str = Field(...)
    title: str = Field(...)
    content: str | None = Field(default=None)
    source: str | None = Field(default=None)
    relevance_score: float = Field(default=0.0)
    meta_data: dict = Field(default={})
    is_read: bool = Field(default=False)
    is_dismissed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "recommendations"
