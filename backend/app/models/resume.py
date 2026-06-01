import uuid
from datetime import datetime
from beanie import Document
from pydantic import Field


class Resume(Document):
    user_id: str = Field(..., index=True)
    file_name: str = Field(...)
    file_type: str = Field(...)
    file_size: int = Field(...)
    file_url: str = Field(...)
    parsed_text: str | None = Field(default=None)
    ats_score: float | None = Field(default=None)
    status: str = Field(default="uploaded")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "resumes"


class ResumeAnalysis(Document):
    resume_id: str = Field(..., index=True, unique=True)

    parsed_name: str | None = Field(default=None)
    parsed_email: str | None = Field(default=None)
    parsed_phone: str | None = Field(default=None)
    parsed_skills: list | None = Field(default=[])
    parsed_experience: list | None = Field(default=[])
    parsed_projects: list | None = Field(default=[])
    parsed_education: list | None = Field(default=[])
    parsed_certifications: list | None = Field(default=[])
    parsed_achievements: list | None = Field(default=[])

    ats_score: float | None = Field(default=None)
    ats_breakdown: dict | None = Field(default={})

    strengths: list | None = Field(default=[])
    weaknesses: list | None = Field(default=[])
    missing_skills: list | None = Field(default=[])
    recommended_roles: list | None = Field(default=[])
    career_suggestions: str | None = Field(default="")
    optimization_tips: list | None = Field(default=[])

    ai_feedback: str | None = Field(default="")
    ai_raw_response: str | None = Field(default="")

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "resume_analysis"
