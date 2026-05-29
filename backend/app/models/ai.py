import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, Integer, Boolean, DateTime, JSON, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from backend.app.db.session import Base
import enum


class EmbeddingType(str, enum.Enum):
    RESUME_FULL = "resume_full"
    RESUME_SKILLS = "resume_skills"
    RESUME_EXPERIENCE = "resume_experience"
    RESUME_PROJECTS = "resume_projects"
    RESUME_SUMMARY = "resume_summary"
    JOB_DESCRIPTION = "job_description"
    JOB_SKILLS = "job_skills"
    JOB_TITLE = "job_title"


class Embedding(Base):
    __tablename__ = "embeddings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    vector_id = Column(String(255), nullable=False, index=True)
    embedding_type = Column(SAEnum(EmbeddingType), nullable=False)
    source_id = Column(String(255), nullable=True, index=True)
    dimensions = Column(Integer, nullable=False, default=1536)
    meta_data = Column("metadata", JSON, nullable=True, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class CareerInsight(Base):
    __tablename__ = "career_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=True)
    strengths = Column(JSON, nullable=True, default=list)
    weaknesses = Column(JSON, nullable=True, default=list)
    missing_skills = Column(JSON, nullable=True, default=list)
    recommendations = Column(JSON, nullable=True, default=list)
    career_paths = Column(JSON, nullable=True, default=list)
    ai_summary = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=True, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    recommendation_type = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=True)
    source = Column(String(100), nullable=True)
    relevance_score = Column(Float, nullable=True, default=0.0)
    meta_data = Column("metadata", JSON, nullable=True, default=dict)
    is_read = Column(Boolean, default=False)
    is_dismissed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
