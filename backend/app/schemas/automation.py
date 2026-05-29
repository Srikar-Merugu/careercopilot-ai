from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class AutoApplyRequest(BaseModel):
    user_id: str
    job_id: str
    job_title: Optional[str] = None
    company: Optional[str] = None
    platform: Optional[str] = None
    job_url: Optional[str] = None
    cover_letter_id: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None


class AutoApplyBulkRequest(BaseModel):
    user_id: str
    jobs: List[Dict[str, Any]]
    preferences: Optional[Dict[str, Any]] = None


class AutoApplicationResponse(BaseModel):
    id: UUID
    user_id: str
    job_id: str
    job_title: Optional[str] = None
    company: Optional[str] = None
    platform: Optional[str] = None
    job_url: Optional[str] = None
    status: str
    cover_letter_id: Optional[UUID] = None
    match_score: Optional[float] = None
    applied_at: Optional[datetime] = None
    automation_log: Optional[List[Dict]] = None
    error_message: Optional[str] = None
    retry_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class CoverLetterGenerateRequest(BaseModel):
    user_id: str
    company: str
    role: str
    job_description: Optional[str] = None
    tone: Optional[str] = "professional"
    skills: Optional[List[str]] = None
    experience: Optional[str] = None


class CoverLetterResponse(BaseModel):
    id: UUID
    user_id: str
    company: str
    role: str
    content: str
    tone: Optional[str] = "professional"
    is_template: bool
    ai_generated: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CoverLetterUpdate(BaseModel):
    content: Optional[str] = None
    tone: Optional[str] = None
    is_template: Optional[bool] = None


class AutomationQueueItem(BaseModel):
    id: UUID
    user_id: str
    job_id: str
    job_title: Optional[str] = None
    company: Optional[str] = None
    platform: Optional[str] = None
    job_url: Optional[str] = None
    priority: int
    status: str
    retry_count: int
    max_retries: int
    scheduled_for: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AutomationAnalytics(BaseModel):
    total_applications: int
    today_applications: int
    success_rate: float
    failed_count: int
    pending_count: int
    interview_count: int
    offer_count: int
    average_match_score: float
    daily_applications: List[Dict[str, Any]]
    platform_breakdown: List[Dict[str, Any]]
    recent_applications: List[AutoApplicationResponse]


class QueueStatusResponse(BaseModel):
    queued: int
    processing: int
    completed: int
    failed: int
    retrying: int
    total: int


class AutomationSettings(BaseModel):
    daily_limit: int = 50
    min_match_score: float = 0.7
    preferred_roles: Optional[List[str]] = None
    preferred_locations: Optional[List[str]] = None
    remote_only: bool = False
    max_salary: Optional[float] = None
    min_salary: Optional[float] = None
    experience_level: Optional[str] = None
    platforms: Optional[List[str]] = None
    auto_generate_cover_letter: bool = True
    require_confirmation: bool = True


class AutomationLogEntry(BaseModel):
    timestamp: datetime
    level: str
    message: str
    details: Optional[Dict[str, Any]] = None
