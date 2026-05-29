import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, JSON, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from backend.app.db.session import Base
import enum


class AlertType(str, enum.Enum):
    DAILY_JOBS = "daily_jobs"
    INSTANT_MATCH = "instant_match"
    TRENDING = "trending"
    AI_RECOMMENDATION = "ai_recommendation"
    INTERVIEW_REMINDER = "interview_reminder"
    APPLICATION_UPDATE = "application_update"
    RESUME_ANALYSIS = "resume_analysis"


class TelegramUser(Base):
    __tablename__ = "telegram_users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, unique=True, index=True)
    telegram_id = Column(String(255), nullable=False, unique=True, index=True)
    telegram_username = Column(String(255), nullable=True)
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    notifications_enabled = Column(Boolean, default=True, nullable=False)
    preferences = Column(JSON, default=dict, nullable=True)
    last_interaction = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class TelegramAlert(Base):
    __tablename__ = "telegram_alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    alert_type = Column(SAEnum(AlertType), nullable=False)
    title = Column(String(500), nullable=False)
    message = Column(Text, nullable=False)
    meta_data = Column("metadata", JSON, default=dict, nullable=True)
    is_sent = Column(Boolean, default=False, nullable=False)
    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class BotActivity(Base):
    __tablename__ = "bot_activity"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    action = Column(String(255), nullable=False)
    meta_data = Column("metadata", JSON, default=dict, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
