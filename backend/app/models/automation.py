import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, Boolean, DateTime, JSON, Integer, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from backend.app.db.session import Base
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


class AutoApplication(Base):
    __tablename__ = "auto_applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    job_id = Column(String(255), nullable=False)
    job_title = Column(String(500), nullable=True)
    company = Column(String(500), nullable=True)
    platform = Column(String(100), nullable=True)
    job_url = Column(Text, nullable=True)
    status = Column(SAEnum(ApplicationStatus), nullable=False, default=ApplicationStatus.PENDING)
    cover_letter_id = Column(UUID(as_uuid=True), nullable=True)
    ats_score = Column(Float, nullable=True)
    match_score = Column(Float, nullable=True)
    applied_at = Column(DateTime, nullable=True)
    automation_log = Column(JSON, default=list, nullable=True)
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    company = Column(String(500), nullable=False)
    role = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    tone = Column(String(50), default="professional")
    is_template = Column(Boolean, default=False)
    ai_generated = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class AutomationQueue(Base):
    __tablename__ = "automation_queue"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    job_id = Column(String(255), nullable=False)
    job_title = Column(String(500), nullable=True)
    company = Column(String(500), nullable=True)
    platform = Column(String(100), nullable=True)
    job_url = Column(Text, nullable=True)
    priority = Column(Integer, default=0, nullable=False)
    status = Column(SAEnum(AutomationQueueStatus), nullable=False, default=AutomationQueueStatus.QUEUED)
    retry_count = Column(Integer, default=0, nullable=False)
    max_retries = Column(Integer, default=3, nullable=False)
    scheduled_for = Column(DateTime, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    meta_data = Column("metadata", JSON, default=dict, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class AutomationSession(Base):
    __tablename__ = "automation_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    platform = Column(String(100), nullable=False)
    session_data = Column(JSON, default=dict, nullable=True)
    cookies = Column(JSON, default=dict, nullable=True)
    is_active = Column(Boolean, default=True)
    last_used = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=True)
