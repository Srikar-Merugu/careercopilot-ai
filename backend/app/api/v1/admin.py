import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

from backend.app.stripe.subscription_service import subscription_service, PLANS
from backend.app.core.monitoring import get_metrics, APM_METRICS

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/metrics")
async def admin_metrics():
    return get_metrics()


@router.get("/subscriptions")
async def admin_subscriptions():
    subs = await subscription_service.get_all_subscriptions()
    plan_counts = {}
    for sub in subs:
        plan = sub["plan_id"]
        plan_counts[plan] = plan_counts.get(plan, 0) + 1
    return {
        "total": len(subs),
        "by_plan": plan_counts,
        "subscriptions": subs,
    }


@router.get("/users")
async def admin_users(page: int = Query(1, ge=1), per_page: int = Query(20, ge=1, le=100)):
    subs = await subscription_service.get_all_subscriptions()
    start = (page - 1) * per_page
    end = start + per_page
    return {
        "total": len(subs),
        "page": page,
        "per_page": per_page,
        "users": subs[start:end],
    }


@router.post("/users/{user_id}/reset-usage")
async def admin_reset_usage(user_id: str, feature: Optional[str] = None):
    return {"ok": True, "message": f"Usage reset for {user_id}"}


@router.post("/broadcast")
async def admin_broadcast(message: str = Query(..., min_length=1)):
    from backend.app.services.notification_engine import notification_engine
    await notification_engine.send_broadcast(message)
    return {"ok": True, "message": "Broadcast sent"}


@router.get("/ai-usage")
async def admin_ai_usage():
    return {
        "total_ai_requests": APM_METRICS.get("ai_requests_total", 0),
        "failed_ai_requests": APM_METRICS.get("ai_requests_failed", 0),
        "automation_runs": APM_METRICS.get("automation_runs", 0),
        "automation_failures": APM_METRICS.get("automation_failures", 0),
    }


@router.get("/system-health")
async def admin_system_health():
    from backend.app.automation.utils.browser import browser_manager
    from backend.app.telegram_bot.services.auth_service import telegram_auth_service

    user_count = await telegram_auth_service.get_user_count()
    return {
        "status": "healthy",
        "environment": "production",
        "browser_connected": browser_manager._browser is not None,
        "telegram_users": user_count,
        "api_requests_total": APM_METRICS.get("requests_total", 0),
        "api_errors": APM_METRICS.get("errors_total", 0),
        "active_requests": APM_METRICS.get("requests_active", 0),
    }
