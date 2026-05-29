import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, Integer, Boolean, DateTime, JSON, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from backend.app.db.session import Base
import enum


class InterviewType(str, enum.Enum):
    HR = "hr"
    TECHNICAL = "technical"
    CODING = "coding"
    BEHAVIORAL = "behavioral"
    SYSTEM_DESIGN = "system_design"
    AI_ENGINEER = "ai_engineer"
    FRONTEND = "frontend"
    BACKEND = "backend"
    DATA_ANALYST = "data_analyst"


class InterviewStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    role = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    interview_type = Column(SAEnum(InterviewType), nullable=False)
    status = Column(SAEnum(InterviewStatus), nullable=False, default=InterviewStatus.IN_PROGRESS)
    overall_score = Column(Float, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    question_count = Column(Integer, nullable=True, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interview_id = Column(UUID(as_uuid=True), ForeignKey("interviews.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)
    score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    order_num = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    interview = relationship("Interview", backref="questions")


class InterviewFeedback(Base):
    __tablename__ = "interview_feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interview_id = Column(UUID(as_uuid=True), ForeignKey("interviews.id", ondelete="CASCADE"), nullable=False, unique=True)
    communication_score = Column(Float, nullable=True)
    technical_score = Column(Float, nullable=True)
    confidence_score = Column(Float, nullable=True)
    clarity_score = Column(Float, nullable=True)
    problem_solving_score = Column(Float, nullable=True)
    behavioral_score = Column(Float, nullable=True)
    strengths = Column(JSON, nullable=True, default=list)
    weaknesses = Column(JSON, nullable=True, default=list)
    ai_feedback = Column(Text, nullable=True)
    recommendations = Column(JSON, nullable=True, default=list)
    filler_word_count = Column(Integer, nullable=True, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    interview = relationship("Interview", backref="feedback")
