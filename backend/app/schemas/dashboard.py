from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID


class ApplicationCreate(BaseModel):
    job_id: Optional[UUID] = None
    job_title: str
    company: str
    location: Optional[str] = None
    salary_range: Optional[str] = None
    status: str = "saved"
    notes: Optional[str] = None
    apply_url: Optional[str] = None


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    interview_date: Optional[datetime] = None


class ApplicationResponse(BaseModel):
    id: UUID
    job_id: Optional[UUID]
    job_title: str
    company: str
    location: Optional[str]
    salary_range: Optional[str]
    status: str
    notes: Optional[str]
    interview_date: Optional[datetime]
    apply_url: Optional[str]
    created_at: datetime
    updated_at: datetime


class NotificationResponse(BaseModel):
    id: UUID
    type: str
    title: str
    content: Optional[str]
    metadata: Optional[Dict[str, Any]]
    is_read: bool
    created_at: datetime


class SubscriptionResponse(BaseModel):
    id: UUID
    plan: str
    status: str
    renewal_date: Optional[datetime]
    features_used: Optional[Dict[str, Any]]
    created_at: datetime


class SubscriptionUpdate(BaseModel):
    plan: str


class ActivityLogResponse(BaseModel):
    id: UUID
    activity_type: str
    description: Optional[str]
    metadata: Optional[Dict[str, Any]]
    created_at: datetime


class DashboardAnalytics(BaseModel):
    total_applications: int
    active_applications: int
    interviews_scheduled: int
    offers_received: int
    saved_jobs_count: int
    avg_match_score: float
    interview_readiness: float
    ats_score: float
    weekly_growth: float
    applications_by_status: Dict[str, int]
    recent_activity: List[ActivityLogResponse]


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    preferred_roles: Optional[List[str]] = None
    locations: Optional[List[str]] = None
    experience_level: Optional[str] = None


class ProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    headline: Optional[str]
    bio: Optional[str]
    skills: List[str]
    preferred_roles: List[str]
    locations: List[str]
    experience_level: Optional[str]
    onboarding_complete: bool
