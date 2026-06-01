import uuid
from datetime import datetime
from beanie import Document
from pydantic import Field
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


class Interview(Document):
    user_id: str = Field(..., index=True)
    role: str = Field(...)
    company: str | None = Field(default=None)
    interview_type: InterviewType = Field(...)
    status: InterviewStatus = Field(default=InterviewStatus.IN_PROGRESS)
    overall_score: float | None = Field(default=None)
    duration_minutes: int | None = Field(default=None)
    question_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: datetime | None = Field(default=None)

    class Settings:
        name = "interviews"


class InterviewQuestion(Document):
    interview_id: str = Field(..., index=True)
    question: str = Field(...)
    answer: str | None = Field(default=None)
    score: float | None = Field(default=None)
    feedback: str | None = Field(default=None)
    category: str | None = Field(default=None)
    order_num: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "interview_questions"


class InterviewFeedback(Document):
    interview_id: str = Field(..., index=True, unique=True)
    communication_score: float | None = Field(default=None)
    technical_score: float | None = Field(default=None)
    confidence_score: float | None = Field(default=None)
    clarity_score: float | None = Field(default=None)
    problem_solving_score: float | None = Field(default=None)
    behavioral_score: float | None = Field(default=None)
    strengths: list = Field(default=[])
    weaknesses: list = Field(default=[])
    ai_feedback: str | None = Field(default=None)
    recommendations: list = Field(default=[])
    filler_word_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "interview_feedback"
