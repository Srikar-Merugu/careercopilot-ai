import logging
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query, Body

from backend.app.schemas.automation import (
    AutoApplyRequest, AutoApplyBulkRequest, AutoApplicationResponse,
    CoverLetterGenerateRequest, CoverLetterResponse, CoverLetterUpdate,
    AutomationQueueItem, AutomationAnalytics, QueueStatusResponse,
    AutomationSettings,
)
from backend.app.automation.queues.queue_manager import queue_manager
from backend.app.automation.workers.apply_worker import apply_worker
from backend.app.automation.ai_generation.cover_letter import cover_letter_generator
from backend.app.automation.utils.browser import browser_manager

logger = logging.getLogger(__name__)

router = APIRouter()

MOCK_USER_ID = "mock_jwt_token_for_career_copilot_frontend"

_cover_letters_store: List[Dict[str, Any]] = []
_auto_applications_store: List[Dict[str, Any]] = []


@router.post("/apply", response_model=dict)
async def auto_apply(payload: AutoApplyRequest):
    user_id = payload.user_id or MOCK_USER_ID
    item_id = await queue_manager.enqueue({
        "user_id": user_id,
        "job_id": payload.job_id,
        "job_title": payload.job_title,
        "company": payload.company,
        "platform": payload.platform or "generic",
        "job_url": payload.job_url,
        "cover_letter_id": payload.cover_letter_id,
        "generate_cover_letter": True,
        **(payload.preferences or {}),
    })
    return {"ok": True, "queue_id": item_id, "message": "Application queued"}


@router.post("/apply/bulk", response_model=dict)
async def auto_apply_bulk(payload: AutoApplyBulkRequest):
    user_id = payload.user_id or MOCK_USER_ID
    items = []
    for job in payload.jobs:
        items.append({
            "user_id": user_id,
            "job_id": job.get("job_id"),
            "job_title": job.get("job_title"),
            "company": job.get("company"),
            "platform": job.get("platform", "generic"),
            "job_url": job.get("job_url"),
            "generate_cover_letter": True,
            **(payload.preferences or {}),
        })
    ids = await queue_manager.enqueue_bulk(items)
    return {"ok": True, "queue_ids": ids, "count": len(ids), "message": f"{len(ids)} applications queued"}


@router.get("/applications", response_model=List[AutoApplicationResponse])
async def list_applications(user_id: str = MOCK_USER_ID):
    apps = [a for a in _auto_applications_store if a["user_id"] == user_id]
    return sorted(apps, key=lambda x: x.get("created_at", datetime.min), reverse=True)


@router.get("/applications/{application_id}", response_model=AutoApplicationResponse)
async def get_application(application_id: str):
    for app in _auto_applications_store:
        if app["id"] == application_id:
            return app
    raise HTTPException(status_code=404, detail="Application not found")


@router.get("/queue", response_model=List[AutomationQueueItem])
async def get_queue(user_id: str = MOCK_USER_ID):
    items = await queue_manager.get_user_queue(user_id)
    return sorted(items, key=lambda x: x.get("created_at", datetime.min), reverse=True)


@router.get("/queue/status", response_model=QueueStatusResponse)
async def get_queue_status():
    status = await queue_manager.get_queue_status()
    return QueueStatusResponse(**status)


@router.post("/queue/cancel/{item_id}", response_model=dict)
async def cancel_application(item_id: str):
    await queue_manager.cancel(item_id)
    return {"ok": True, "message": "Application cancelled"}


@router.post("/cover-letter/generate", response_model=CoverLetterResponse)
async def generate_cover_letter(payload: CoverLetterGenerateRequest):
    user_id = payload.user_id or MOCK_USER_ID
    content = await cover_letter_generator.generate(
        company=payload.company,
        role=payload.role,
        job_description=payload.job_description,
        tone=payload.tone or "professional",
        skills=payload.skills,
        experience=payload.experience,
    )
    letter = {
        "id": str(UUID(int=len(_cover_letters_store) + 1)),
        "user_id": user_id,
        "company": payload.company,
        "role": payload.role,
        "content": content,
        "tone": payload.tone or "professional",
        "is_template": False,
        "ai_generated": True,
        "created_at": datetime.utcnow(),
    }
    _cover_letters_store.append(letter)
    return letter


@router.get("/cover-letters", response_model=List[CoverLetterResponse])
async def list_cover_letters(user_id: str = MOCK_USER_ID):
    return [l for l in _cover_letters_store if l["user_id"] == user_id]


@router.get("/cover-letters/{letter_id}", response_model=CoverLetterResponse)
async def get_cover_letter(letter_id: str):
    for letter in _cover_letters_store:
        if str(letter["id"]) == letter_id:
            return letter
    raise HTTPException(status_code=404, detail="Cover letter not found")


@router.patch("/cover-letters/{letter_id}", response_model=CoverLetterResponse)
async def update_cover_letter(letter_id: str, payload: CoverLetterUpdate):
    for letter in _cover_letters_store:
        if str(letter["id"]) == letter_id:
            if payload.content:
                letter["content"] = payload.content
            if payload.tone:
                letter["tone"] = payload.tone
            if payload.is_template is not None:
                letter["is_template"] = payload.is_template
            return letter
    raise HTTPException(status_code=404, detail="Cover letter not found")


@router.get("/analytics", response_model=AutomationAnalytics)
async def get_automation_analytics(user_id: str = MOCK_USER_ID):
    apps = [a for a in _auto_applications_store if a["user_id"] == user_id]
    total = len(apps)
    submitted = sum(1 for a in apps if a.get("status") == "submitted")
    failed = sum(1 for a in apps if a.get("status") == "failed")
    pending = sum(1 for a in apps if a.get("status") in ("pending", "queued"))
    interviews = sum(1 for a in apps if a.get("status") == "interview")
    offers = sum(1 for a in apps if a.get("status") == "offer")
    today = datetime.utcnow().date()
    today_count = sum(1 for a in apps if a.get("created_at", datetime.min).date() == today)
    scores = [a.get("match_score", 0) for a in apps if a.get("match_score")]
    avg_score = sum(scores) / len(scores) if scores else 0

    platform_names = set(a.get("platform", "unknown") for a in apps)
    platform_breakdown = [
        {"platform": p, "count": sum(1 for a in apps if a.get("platform") == p)}
        for p in platform_names
    ]

    recent = sorted(apps, key=lambda x: x.get("created_at", datetime.min), reverse=True)[:10]

    return AutomationAnalytics(
        total_applications=total,
        today_applications=today_count,
        success_rate=(submitted / total * 100) if total > 0 else 0,
        failed_count=failed,
        pending_count=pending,
        interview_count=interviews,
        offer_count=offers,
        average_match_score=avg_score,
        daily_applications=[],
        platform_breakdown=platform_breakdown,
        recent_applications=recent,
    )


@router.get("/settings", response_model=AutomationSettings)
async def get_automation_settings():
    return AutomationSettings()


@router.post("/settings", response_model=AutomationSettings)
async def update_automation_settings(payload: AutomationSettings):
    return payload


@router.post("/worker/start", response_model=dict)
async def start_worker():
    await apply_worker.start()
    return {"ok": True, "message": "Worker started"}


@router.post("/worker/stop", response_model=dict)
async def stop_worker():
    await apply_worker.stop()
    return {"ok": True, "message": "Worker stopped"}


@router.get("/browser/status", response_model=dict)
async def browser_status():
    return {"browser_connected": browser_manager._browser is not None}
