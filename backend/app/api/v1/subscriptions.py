import logging
from typing import List
from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel

from backend.app.stripe.subscription_service import subscription_service, PLANS
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()

MOCK_USER_ID = "mock_jwt_token_for_career_copilot_frontend"


class UpgradeRequest(BaseModel):
    plan_id: str
    billing_cycle: str = "monthly"


@router.get("/plans")
async def get_plans():
    return PLANS


@router.get("/subscription")
async def get_subscription(user_id: str = MOCK_USER_ID):
    return await subscription_service.get_subscription(user_id)


@router.post("/upgrade")
async def upgrade(payload: UpgradeRequest, user_id: str = MOCK_USER_ID):
    try:
        result = await subscription_service.upgrade(user_id, payload.plan_id, payload.billing_cycle)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/downgrade")
async def downgrade(payload: UpgradeRequest, user_id: str = MOCK_USER_ID):
    try:
        result = await subscription_service.downgrade(user_id, payload.plan_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/cancel")
async def cancel_subscription(user_id: str = MOCK_USER_ID):
    return await subscription_service.cancel(user_id)


@router.post("/create-checkout")
async def create_checkout(payload: UpgradeRequest, user_id: str = MOCK_USER_ID):
    try:
        session_id = await subscription_service.create_checkout_session(
            user_id, payload.plan_id, payload.billing_cycle
        )
        return {"session_id": session_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    success = await subscription_service.handle_webhook(payload, stripe_signature or "")
    if not success:
        raise HTTPException(status_code=400, detail="Webhook verification failed")
    return {"ok": True}


@router.get("/usage")
async def get_usage(feature: str, user_id: str = MOCK_USER_ID):
    current = await subscription_service.get_usage(user_id, feature)
    sub = await subscription_service.get_subscription(user_id)
    plan = await subscription_service.get_plan(sub["plan_id"])
    limit = plan["features"].get(feature, 0) if plan else 0
    return {"feature": feature, "used": current, "limit": limit, "remaining": limit - current if limit > 0 else -1}


@router.post("/check-access")
async def check_access(feature: str, user_id: str = MOCK_USER_ID):
    allowed = await subscription_service.can_access(user_id, feature)
    if not allowed:
        sub = await subscription_service.get_subscription(user_id)
        plan = await subscription_service.get_plan(sub["plan_id"])
        limit = plan["features"].get(feature, 0) if plan else 0
        current = await subscription_service.get_usage(user_id, feature)
        raise HTTPException(
            status_code=403,
            detail={"allowed": False, "plan": sub["plan_id"], "limit": limit, "used": current}
        )
    return {"allowed": True}
