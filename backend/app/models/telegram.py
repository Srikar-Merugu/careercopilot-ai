import uuid
from datetime import datetime
from beanie import Document
from pydantic import Field
import enum


class AlertType(str, enum.Enum):
    DAILY_JOBS = "daily_jobs"
    INSTANT_MATCH = "instant_match"
    TRENDING = "trending"
    AI_RECOMMENDATION = "ai_recommendation"
    INTERVIEW_REMINDER = "interview_reminder"
    APPLICATION_UPDATE = "application_update"
    RESUME_ANALYSIS = "resume_analysis"


class TelegramUser(Document):
    user_id: str = Field(..., index=True, unique=True)
    telegram_id: str = Field(..., index=True, unique=True)
    telegram_username: str | None = Field(default=None)
    first_name: str | None = Field(default=None)
    last_name: str | None = Field(default=None)
    is_active: bool = Field(default=True)
    notifications_enabled: bool = Field(default=True)
    preferences: dict = Field(default={})
    last_interaction: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "telegram_users"


class TelegramAlert(Document):
    user_id: str = Field(..., index=True)
    alert_type: AlertType = Field(...)
    title: str = Field(...)
    message: str = Field(...)
    meta_data: dict = Field(default={})
    is_sent: bool = Field(default=False)
    sent_at: datetime | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "telegram_alerts"


class BotActivity(Document):
    user_id: str = Field(..., index=True)
    action: str = Field(...)
    meta_data: dict = Field(default={})
    ip_address: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "bot_activity"
