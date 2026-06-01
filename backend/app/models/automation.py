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


class AutomationQueue(Document):
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
