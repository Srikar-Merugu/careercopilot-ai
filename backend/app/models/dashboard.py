import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, Boolean, DateTime, JSON, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from backend.app.db.session import Base
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


class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True)
    job_title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    salary_range = Column(String(100), nullable=True)
    status = Column(SAEnum(ApplicationStatus), nullable=False, default=ApplicationStatus.SAVED)
    notes = Column(Text, nullable=True)
    interview_date = Column(DateTime, nullable=True)
    apply_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    type = Column(SAEnum(NotificationType), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=True)
    meta_data = Column("metadata", JSON, nullable=True, default=dict)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True, unique=True)
    plan = Column(SAEnum(SubscriptionPlan), nullable=False, default=SubscriptionPlan.FREE)
    status = Column(SAEnum(SubscriptionStatus), nullable=False, default=SubscriptionStatus.TRIAL)
    renewal_date = Column(DateTime, nullable=True)
    features_used = Column(JSON, nullable=True, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    activity_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    meta_data = Column("metadata", JSON, nullable=True, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
