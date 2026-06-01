import uuid
from datetime import datetime
from beanie import Document
from pydantic import Field


class Job(Document):
    source: str = Field(...)
    source_id: str | None = Field(default=None)
    title: str = Field(...)
    company: str = Field(...)
    company_logo: str | None = Field(default=None)
    location: str | None = Field(default=None)
    salary_min: int | None = Field(default=None)
    salary_max: int | None = Field(default=None)
    salary_currency: str = Field(default="USD")
    description: str | None = Field(default=None)
    requirements: str | None = Field(default=None)
    required_skills: list | None = Field(default=[])
    experience_required: str | None = Field(default=None)
    job_type: str | None = Field(default=None)
    remote_type: str | None = Field(default=None)
    apply_url: str | None = Field(default=None)
    category: str | None = Field(default=None)
    posted_at: datetime | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "jobs"


class SavedJob(Document):
    user_id: str = Field(..., index=True)
    job_id: str = Field(...)
    saved_at: datetime = Field(default_factory=datetime.utcnow)
    notes: str | None = Field(default=None)

    class Settings:
        name = "saved_jobs"


class JobMatch(Document):
    user_id: str = Field(..., index=True)
    job_id: str = Field(...)
    match_score: float | None = Field(default=None)
    missing_skills: list | None = Field(default=[])
    matched_skills: list | None = Field(default=[])
    strengths: list | None = Field(default=[])
    ai_feedback: str | None = Field(default=None)
    embedding_distance: float | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "job_matches"
