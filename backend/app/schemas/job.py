from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class JobResponse(BaseModel):
    id: str
    source: str
    title: str
    company: str
    company_logo: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "USD"
    description: Optional[str] = None
    requirements: Optional[str] = None
    required_skills: Optional[list[str]] = None
    experience_required: Optional[str] = None
    job_type: Optional[str] = None
    remote_type: Optional[str] = None
    apply_url: Optional[str] = None
    category: Optional[str] = None
    posted_at: Optional[datetime] = None
    created_at: datetime


class JobSearchParams(BaseModel):
    query: Optional[str] = ""
    location: Optional[str] = None
    remote_type: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    experience: Optional[str] = None
    job_type: Optional[str] = None
    category: Optional[str] = None
    sort_by: Optional[str] = "match_score"
    page: int = 1
    per_page: int = 20
    match_min: Optional[float] = None
    days_ago: Optional[int] = None


class JobSearchResponse(BaseModel):
    jobs: list[JobResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


class JobMatchResponse(BaseModel):
    job_id: str
    match_score: float
    missing_skills: list[str]
    matched_skills: list[str]
    strengths: list[str]
    ai_feedback: str


class JobWithMatchResponse(BaseModel):
    job: JobResponse
    match: Optional[JobMatchResponse] = None


class SavedJobResponse(BaseModel):
    id: str
    job_id: str
    job: JobResponse
    saved_at: datetime


class JobRecommendationResponse(BaseModel):
    matched_jobs: list[JobWithMatchResponse]
    trending_jobs: list[JobWithMatchResponse]
    similar_jobs: list[JobWithMatchResponse]
    recommended_skills: list[str]
