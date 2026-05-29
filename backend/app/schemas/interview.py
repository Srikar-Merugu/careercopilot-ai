from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID


class InterviewStartRequest(BaseModel):
    role: str
    company: Optional[str] = None
    interview_type: str = "technical"
    skills: Optional[List[str]] = None
    experience_level: Optional[str] = None


class InterviewResponse(BaseModel):
    id: UUID
    role: str
    company: Optional[str]
    interview_type: str
    status: str
    overall_score: Optional[float]
    duration_minutes: Optional[int]
    question_count: Optional[int]
    created_at: datetime
    completed_at: Optional[datetime]


class QuestionResponse(BaseModel):
    id: UUID
    question: str
    category: Optional[str]
    order_num: int
    interview_id: UUID


class AnswerSubmit(BaseModel):
    interview_id: UUID
    question_id: UUID
    answer: str


class AnswerFeedback(BaseModel):
    question_id: UUID
    score: float
    feedback: str
    next_question: Optional[QuestionResponse] = None


class InterviewFeedbackResponse(BaseModel):
    id: UUID
    interview_id: UUID
    communication_score: float
    technical_score: float
    confidence_score: float
    clarity_score: float
    problem_solving_score: float
    behavioral_score: float
    overall_score: float
    strengths: List[str]
    weaknesses: List[str]
    ai_feedback: str
    recommendations: List[str]
    filler_word_count: int
    created_at: datetime


class InterviewDetail(BaseModel):
    interview: InterviewResponse
    questions: List[Dict[str, Any]]
    feedback: Optional[InterviewFeedbackResponse] = None


class InterviewHistoryResponse(BaseModel):
    interviews: List[InterviewResponse]
    total: int
    average_score: float
    interviews_by_type: Dict[str, int]


class CodingChallenge(BaseModel):
    title: str
    description: str
    difficulty: str
    language: str
    starter_code: str
    test_cases: List[Dict[str, Any]]


class CodingSubmission(BaseModel):
    challenge_id: str
    language: str
    code: str
    question: str


class CodingResult(BaseModel):
    passed: bool
    score: float
    feedback: str
    test_results: List[Dict[str, Any]]
    suggestions: List[str]


class GenerateQuestionRequest(BaseModel):
    role: str
    company: Optional[str] = None
    interview_type: str = "technical"
    previous_answers: Optional[List[str]] = None
    skills: Optional[List[str]] = None


class GenerateQuestionResponse(BaseModel):
    question: str
    category: str
    difficulty: str
    expected_points: List[str]
