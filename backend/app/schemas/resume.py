from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ResumeUploadResponse(BaseModel):
    id: str
    file_name: str
    file_type: str
    file_size: int
    file_url: str
    status: str
    created_at: datetime


class ResumeListResponse(BaseModel):
    id: str
    file_name: str
    file_type: str
    file_size: int
    ats_score: Optional[float] = None
    status: str
    created_at: datetime


class ATSBreakdown(BaseModel):
    keyword_optimization: float = 0
    formatting: float = 0
    role_relevance: float = 0
    skill_coverage: float = 0
    readability: float = 0
    project_quality: float = 0


class ResumeAnalysisResponse(BaseModel):
    id: str
    resume_id: str

    parsed_name: Optional[str] = None
    parsed_email: Optional[str] = None
    parsed_phone: Optional[str] = None
    parsed_skills: Optional[list[str]] = None
    parsed_experience: Optional[list[dict]] = None
    parsed_projects: Optional[list[dict]] = None
    parsed_education: Optional[list[dict]] = None
    parsed_certifications: Optional[list[str]] = None
    parsed_achievements: Optional[list[str]] = None

    ats_score: Optional[float] = None
    ats_breakdown: Optional[ATSBreakdown] = None

    strengths: Optional[list[str]] = None
    weaknesses: Optional[list[str]] = None
    missing_skills: Optional[list[str]] = None
    recommended_roles: Optional[list[dict]] = None
    career_suggestions: Optional[str] = None
    optimization_tips: Optional[list[str]] = None

    ai_feedback: Optional[str] = None
    created_at: datetime


class ResumeDetailResponse(BaseModel):
    resume: ResumeListResponse
    analysis: Optional[ResumeAnalysisResponse] = None


class ResumeUploadResponse(BaseModel):
    id: str
    file_name: str
    file_type: str
    file_size: int
    file_url: str
    status: str
    created_at: datetime


class ErrorResponse(BaseModel):
    success: bool = False
    error: dict


class SuccessResponse(BaseModel):
    success: bool = True
    data: dict
