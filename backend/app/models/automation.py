import uuid
from datetime import datetime
from beanie import Document
from pydantic import Field
import enum


class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    APPLYING = "applying"
    SUBMITTED = "submitted"
    FAILED = "failed"
    SKIPPED = "skipped"
    INTERVIEW = "interview"
    OFFER = "offer"
    REJECTED = "rejected"


class AutomationQueueStatus(str, enum.Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"
    CANCELLED = "cancelled"


class AutoApplication(Document):
    user_id: str = Field(..., index=True)
    job_id: str = Field(...)
    job_title: str | None = Field(default=None)
    company: str | None = Field(default=None)
    platform: str | None = Field(default=None)
    job_url: str | None = Field(default=None)
    status: ApplicationStatus = Field(default=ApplicationStatus.PENDING)
    cover_letter_id: str | None = Field(default=None)
    ats_score: float | None = Field(default=None)
    match_score: float | None = Field(default=None)
    applied_at: datetime | None = Field(default=None)
    automation_log: list = Field(default=[])
    error_message: str | None = Field(default=None)
    retry_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "auto_applications"


class CoverLetter(Document):
    user_id: str = Field(..., index=True)
    company: str = Field(...)
    role: str = Field(...)
    content: str = Field(...)
    tone: str = Field(default="professional")
    is_template: bool = Field(default=False)
    ai_generated: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "cover_letters"


class AutomationQueueItem(Document):
    user_id: str = Field(..., index=True)
    job_id: str = Field(...)
    job_title: str | None = Field(default=None)
    company: str | None = Field(default=None)
    platform: str | None = Field(default=None)
    job_url: str | None = Field(default=None)
    priority: int = Field(default=0)
    status: AutomationQueueStatus = Field(default=AutomationQueueStatus.QUEUED)
    retry_count: int = Field(default=0)
    max_retries: int = Field(default=3)
    scheduled_for: datetime | None = Field(default=None)
    started_at: datetime | None = Field(default=None)
    completed_at: datetime | None = Field(default=None)
    error_message: str | None = Field(default=None)
    meta_data: dict = Field(default={})
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "automation_queue"


class AutomationSession(Document):
    user_id: str = Field(..., index=True)
    platform: str = Field(...)
    session_data: dict = Field(default={})
    cookies: dict = Field(default={})
    is_active: bool = Field(default=True)
    last_used: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime | None = Field(default=None)

    class Settings:
        name = "automation_sessions"


class AutomationPipeline(Document):
    user_id: str = Field(..., index=True)
    status: str = Field(default="idle")
    started_at: datetime | None = Field(default=None)
    completed_at: datetime | None = Field(default=None)
    jobs_scanned: int = Field(default=0)
    jobs_matched: int = Field(default=0)
    jobs_queued: int = Field(default=0)
    current_phase: str = Field(default="")
    error_message: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "automation_pipelines"


class AutomationSettings(Document):
    user_id: str = Field(..., index=True, unique=True)
    daily_limit: int = Field(default=50)
    min_match_score: float = Field(default=70.0)
    preferred_roles: list[str] = Field(default=[])
    preferred_locations: list[str] = Field(default=[])
    remote_only: bool = Field(default=False)
    max_salary: float | None = Field(default=None)
    min_salary: float | None = Field(default=None)
    excluded_companies: list[str] = Field(default=[])
    platforms: list[str] = Field(default=["linkedin", "naukri", "wellfound", "internshala"])
    auto_generate_cover_letter: bool = Field(default=True)
    require_confirmation: bool = Field(default=False)
    automation_aggressiveness: str = Field(default="balanced")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "automation_settings"
