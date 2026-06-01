import uuid
from datetime import datetime
from beanie import Document
from pydantic import Field
import enum


class ApplicationStatus(str, enum.Enum):
    SAVED = "saved"
    APPLIED = "applied"
    INTERVIEW = "interview"
    OFFER = "offer"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class NotificationType(str, enum.Enum):
    JOB_ALERT = "job_alert"
    AI_RECOMMENDATION = "ai_recommendation"
    INTERVIEW_REMINDER = "interview_reminder"
    APPLICATION_UPDATE = "application_update"
    RESUME_ANALYSIS = "resume_analysis"
    CAREER_INSIGHT = "career_insight"
    SYSTEM = "system"


class SubscriptionPlan(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    PREMIUM = "premium"


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    TRIAL = "trial"


class Application(Document):
    user_id: str = Field(..., index=True)
    job_id: str | None = Field(default=None)
    job_title: str = Field(...)
    company: str = Field(...)
    location: str | None = Field(default=None)
    salary_range: str | None = Field(default=None)
    status: ApplicationStatus = Field(default=ApplicationStatus.SAVED)
    notes: str | None = Field(default=None)
    interview_date: datetime | None = Field(default=None)
    apply_url: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "applications"


class Notification(Document):
    user_id: str = Field(..., index=True)
    type: NotificationType = Field(...)
    title: str = Field(...)
    content: str | None = Field(default=None)
    meta_data: dict = Field(default={})
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "notifications"


class Subscription(Document):
    user_id: str = Field(..., index=True, unique=True)
    plan: SubscriptionPlan = Field(default=SubscriptionPlan.FREE)
    status: SubscriptionStatus = Field(default=SubscriptionStatus.TRIAL)
    renewal_date: datetime | None = Field(default=None)
    features_used: dict = Field(default={})
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "subscriptions"


class ActivityLog(Document):
    user_id: str = Field(..., index=True)
    activity_type: str = Field(...)
    description: str | None = Field(default=None)
    meta_data: dict = Field(default={})
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "activity_logs"
