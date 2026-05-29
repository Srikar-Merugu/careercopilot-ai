import logging
from typing import Optional, List
from uuid import UUID
from fastapi import APIRouter, HTTPException, Query, Request
from telegram import Update

from backend.app.core.config import settings
from backend.app.schemas.telegram import (
    TelegramConnectRequest, TelegramUserResponse, TelegramAlertCreate,
    TelegramAlertResponse, SendAlertRequest,
    SyncProfileRequest, TelegramSettingsUpdate, TelegramStatsResponse,
)
from backend.app.telegram_bot.services.auth_service import telegram_auth_service
from backend.app.telegram_bot.services.job_service import telegram_job_service
from backend.app.telegram_bot.services.resume_service import telegram_resume_service
from backend.app.services.notification_engine import notification_engine

logger = logging.getLogger(__name__)

router = APIRouter()

MOCK_USER_ID = "mock_jwt_token_for_career_copilot_frontend"


@router.post("/webhook")
async def telegram_webhook(request: Request):
    secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token")
    if settings.TELEGRAM_WEBHOOK_SECRET_TOKEN and secret != settings.TELEGRAM_WEBHOOK_SECRET_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid secret token")
    try:
        body = await request.json()
        update = Update.de_json(body, None)
        if update and notification_engine._bot_app:
            await notification_engine._bot_app.process_update(update)
        return {"ok": True}
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")


@router.post("/connect", response_model=TelegramUserResponse)
async def connect_telegram(payload: TelegramConnectRequest):
    user_id = payload.user_id or MOCK_USER_ID
    user = await telegram_auth_service.get_or_create_user(
        telegram_id=payload.telegram_id,
        username=payload.telegram_username,
        first_name=payload.first_name,
        last_name=payload.last_name,
    )
    return user


@router.get("/users", response_model=List[TelegramUserResponse])
async def list_telegram_users():
    return await telegram_auth_service.get_active_users()


@router.get("/users/{telegram_id}", response_model=TelegramUserResponse)
async def get_telegram_user(telegram_id: str):
    user = await telegram_auth_service.get_user_by_telegram_id(telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/users/{telegram_id}/settings", response_model=TelegramUserResponse)
async def update_telegram_settings(telegram_id: str, payload: TelegramSettingsUpdate):
    user = await telegram_auth_service.get_user_by_telegram_id(telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if payload.notifications_enabled is not None:
        current = await telegram_auth_service.toggle_notifications(telegram_id)
        user["notifications_enabled"] = current
    if payload.preferences:
        await telegram_auth_service.update_preferences(telegram_id, payload.preferences)
        user["preferences"].update(payload.preferences)
    return user


@router.post("/alerts", response_model=dict)
async def send_alert(payload: SendAlertRequest):
    user = await telegram_auth_service.get_user_by_telegram_id(payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not connected")
    try:
        await notification_engine.send_instant_match(payload.user_id, payload.jobs[0] if payload.jobs else {})
        return {"ok": True, "message": "Alert sent"}
    except Exception as e:
        logger.error(f"Failed to send alert: {e}")
        raise HTTPException(status_code=500, detail="Failed to send alert")


@router.post("/sync/profile", response_model=dict)
async def sync_profile(payload: SyncProfileRequest):
    user_id = payload.user_id or MOCK_USER_ID
    user = await telegram_auth_service.get_user_by_user_id(user_id)
    if user:
        await telegram_auth_service.log_activity(
            user_id, "profile_synced",
            {"ats_score": payload.ats_score, "saved_jobs": len(payload.saved_jobs or [])}
        )
    return {"ok": True, "synced": True}


@router.get("/activity", response_model=List[dict])
async def get_bot_activity(limit: int = Query(20, ge=1, le=100)):
    return await telegram_auth_service.get_recent_activity(limit)


@router.get("/stats", response_model=TelegramStatsResponse)
async def get_telegram_stats():
    total = await telegram_auth_service.get_user_count()
    active = await telegram_auth_service.get_active_user_count()
    alerts = await telegram_auth_service.get_total_alerts_sent()
    return TelegramStatsResponse(
        total_users=total,
        active_users=active,
        total_alerts_sent=alerts,
        jobs_synced=0,
        resumes_analyzed=0,
    )


@router.post("/broadcast", response_model=dict)
async def broadcast_message(message: str = Query(..., min_length=1)):
    await notification_engine.send_broadcast(message)
    return {"ok": True, "message": "Broadcast sent to all active users"}


@router.get("/jobs/recommended", response_model=List[dict])
async def get_recommended_jobs(user_id: str = MOCK_USER_ID, limit: int = Query(5, ge=1, le=20)):
    return telegram_job_service.get_recommended_jobs(user_id, limit)


@router.get("/jobs/saved", response_model=List[dict])
async def get_saved_jobs(user_id: str = MOCK_USER_ID):
    return telegram_job_service.get_saved_jobs(user_id)


@router.get("/resume/{user_id}", response_model=dict)
async def get_resume_analysis(user_id: str):
    analysis = telegram_resume_service.get_analysis(user_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="No resume analysis found")
    return analysis
