import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.db.session import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(10), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_url = Column(String(512), nullable=False)
    parsed_text = Column(Text, nullable=True)
    ats_score = Column(Float, nullable=True)
    status = Column(String(20), default="uploaded")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    analysis = relationship("ResumeAnalysis", back_populates="resume", uselist=False, cascade="all, delete-orphan")


class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, unique=True)

    parsed_name = Column(String(255), nullable=True)
    parsed_email = Column(String(255), nullable=True)
    parsed_phone = Column(String(50), nullable=True)
    parsed_skills = Column(JSON, nullable=True)
    parsed_experience = Column(JSON, nullable=True)
    parsed_projects = Column(JSON, nullable=True)
    parsed_education = Column(JSON, nullable=True)
    parsed_certifications = Column(JSON, nullable=True)
    parsed_achievements = Column(JSON, nullable=True)

    ats_score = Column(Float, nullable=True)
    ats_breakdown = Column(JSON, nullable=True)

    strengths = Column(JSON, nullable=True)
    weaknesses = Column(JSON, nullable=True)
    missing_skills = Column(JSON, nullable=True)
    recommended_roles = Column(JSON, nullable=True)
    career_suggestions = Column(Text, nullable=True)
    optimization_tips = Column(JSON, nullable=True)

    ai_feedback = Column(Text, nullable=True)
    ai_raw_response = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    resume = relationship("Resume", back_populates="analysis")
