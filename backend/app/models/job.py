import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, Float, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from backend.app.db.session import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    source = Column(String(50), nullable=False)
    source_id = Column(String(255), nullable=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    company_logo = Column(String(512), nullable=True)
    location = Column(String(255), nullable=True)
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    salary_currency = Column(String(10), default="USD")
    description = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    required_skills = Column(JSON, nullable=True)
    experience_required = Column(String(50), nullable=True)
    job_type = Column(String(50), nullable=True)
    remote_type = Column(String(50), nullable=True)
    apply_url = Column(String(512), nullable=True)
    category = Column(String(100), nullable=True)
    posted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    saved_by = relationship("SavedJob", back_populates="job", cascade="all, delete-orphan")
    matches = relationship("JobMatch", back_populates="job", cascade="all, delete-orphan")


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    job_id = Column(String, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    saved_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)

    job = relationship("Job", back_populates="saved_by")


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    job_id = Column(String, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    match_score = Column(Float, nullable=True)
    missing_skills = Column(JSON, nullable=True)
    matched_skills = Column(JSON, nullable=True)
    strengths = Column(JSON, nullable=True)
    ai_feedback = Column(Text, nullable=True)
    embedding_distance = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="matches")
