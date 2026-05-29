from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class TelegramConnectRequest(BaseModel):
    user_id: str
    telegram_id: str
    telegram_username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class TelegramUserResponse(BaseModel):
    id: UUID
    user_id: str
    telegram_id: str
    telegram_username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool
    notifications_enabled: bool
    preferences: Optional[Dict[str, Any]] = None
    last_interaction: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class TelegramAlertCreate(BaseModel):
    user_id: str
    alert_type: str
    title: str
    message: str
    meta_data: Optional[Dict[str, Any]] = None


class TelegramAlertResponse(BaseModel):
    id: UUID
    user_id: str
    alert_type: str
    title: str
    message: str
    meta_data: Optional[Dict[str, Any]] = None
    is_sent: bool
    sent_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BotActivityResponse(BaseModel):
    id: UUID
    user_id: str
    action: str
    meta_data: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SendAlertRequest(BaseModel):
    user_id: str
    chat_id: str
    alert_type: str
    title: str
    message: str
    jobs: Optional[List[Dict[str, Any]]] = None


class SyncProfileRequest(BaseModel):
    user_id: str
    ats_score: Optional[float] = None
    saved_jobs: Optional[List[str]] = None
    interview_count: Optional[int] = None


class TelegramSettingsUpdate(BaseModel):
    notifications_enabled: Optional[bool] = None
    preferences: Optional[Dict[str, Any]] = None


class TelegramStatsResponse(BaseModel):
    total_users: int
    active_users: int
    total_alerts_sent: int
    jobs_synced: int
    resumes_analyzed: int
