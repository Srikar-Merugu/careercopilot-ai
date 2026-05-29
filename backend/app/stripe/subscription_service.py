import logging
import stripe
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import uuid4

from backend.app.core.config import settings

logger = logging.getLogger(__name__)

stripe.api_key = settings.STRIPE_SECRET_KEY

PLANS = {
    "free": {
        "id": "free",
        "name": "Free",
        "price_monthly": 0,
        "price_yearly": 0,
        "stripe_price_id_monthly": "",
        "stripe_price_id_yearly": "",
        "features": {
            "ai_analyses": 3,
            "job_searches": 10,
            "resume_analyses": 1,
            "saved_jobs": 20,
            "interview_prep": False,
            "auto_apply": False,
            "telegram_premium": False,
            "ai_chat": False,
            "team_members": 1,
        },
    },
    "pro": {
        "id": "pro",
        "name": "Pro",
        "price_monthly": 999,
        "price_yearly": 9990,
        "stripe_price_id_monthly": "price_pro_monthly",
        "stripe_price_id_yearly": "price_pro_yearly",
        "features": {
            "ai_analyses": 50,
            "job_searches": 200,
            "resume_analyses": 10,
            "saved_jobs": 100,
            "interview_prep": True,
            "auto_apply": False,
            "telegram_premium": True,
            "ai_chat": True,
            "team_members": 3,
        },
    },
    "premium": {
        "id": "premium",
        "name": "Premium",
        "price_monthly": 2499,
        "price_yearly": 24990,
        "stripe_price_id_monthly": "price_premium_monthly",
        "stripe_price_id_yearly": "price_premium_yearly",
        "features": {
            "ai_analyses": -1,
            "job_searches": -1,
            "resume_analyses": -1,
            "saved_jobs": -1,
            "interview_prep": True,
            "auto_apply": True,
            "telegram_premium": True,
            "ai_chat": True,
            "team_members": 10,
        },
    },
}

_subscriptions: Dict[str, Dict[str, Any]] = {}
_usage: Dict[str, Dict[str, int]] = {}


class SubscriptionService:

    async def get_plan(self, plan_id: str) -> Optional[Dict[str, Any]]:
        return PLANS.get(plan_id)

    async def get_all_plans(self) -> Dict[str, Any]:
        return PLANS

    async def get_subscription(self, user_id: str) -> Dict[str, Any]:
        if user_id not in _subscriptions:
            _subscriptions[user_id] = {
                "user_id": user_id,
                "plan_id": "free",
                "status": "active",
                "billing_cycle": "monthly",
                "current_period_start": datetime.utcnow(),
                "current_period_end": datetime.utcnow(),
                "cancel_at_period_end": False,
                "stripe_customer_id": None,
                "stripe_subscription_id": None,
                "created_at": datetime.utcnow(),
            }
        return _subscriptions[user_id]

    async def upgrade(self, user_id: str, plan_id: str, billing_cycle: str = "monthly") -> Dict[str, Any]:
        plan = await self.get_plan(plan_id)
        if not plan:
            raise ValueError(f"Invalid plan: {plan_id}")
        sub = await self.get_subscription(user_id)
        sub["plan_id"] = plan_id
        sub["billing_cycle"] = billing_cycle
        sub["status"] = "active"
        sub["current_period_start"] = datetime.utcnow()
        logger.info(f"User {user_id} upgraded to {plan_id}")
        return sub

    async def downgrade(self, user_id: str, plan_id: str) -> Dict[str, Any]:
        return await self.upgrade(user_id, plan_id)

    async def cancel(self, user_id: str) -> Dict[str, Any]:
        sub = await self.get_subscription(user_id)
        sub["cancel_at_period_end"] = True
        logger.info(f"User {user_id} scheduled cancellation")
        return sub

    async def get_usage(self, user_id: str, feature: str) -> int:
        return _usage.get(user_id, {}).get(feature, 0)

    async def increment_usage(self, user_id: str, feature: str, count: int = 1) -> int:
        if user_id not in _usage:
            _usage[user_id] = {}
        _usage[user_id][feature] = _usage[user_id].get(feature, 0) + count
        return _usage[user_id][feature]

    async def check_feature_access(self, user_id: str, feature: str) -> bool:
        sub = await self.get_subscription(user_id)
        plan = await self.get_plan(sub["plan_id"])
        if not plan:
            return False
        return plan["features"].get(feature, False)

    async def check_usage_limit(self, user_id: str, feature: str) -> bool:
        sub = await self.get_subscription(user_id)
        plan = await self.get_plan(sub["plan_id"])
        if not plan:
            return False
        limit = plan["features"].get(feature, 0)
        if limit == -1:
            return True
        current = await self.get_usage(user_id, feature)
        return current < limit or current == 0

    async def can_access(self, user_id: str, feature: str) -> bool:
        has_feature = await self.check_feature_access(user_id, feature)
        if not has_feature:
            return False
        if feature in ("ai_analyses", "job_searches", "resume_analyses"):
            return await self.check_usage_limit(user_id, feature)
        return True

    async def create_checkout_session(self, user_id: str, plan_id: str, billing_cycle: str = "monthly") -> str:
        plan = await self.get_plan(plan_id)
        if not plan:
            raise ValueError(f"Invalid plan: {plan_id}")
        price_id = plan[f"stripe_price_id_{billing_cycle}"]
        if not price_id:
            return "mock_checkout_session_id"
        try:
            session = stripe.checkout.Session.create(
                mode="subscription",
                payment_method_types=["card"],
                line_items=[{"price": price_id, "quantity": 1}],
                success_url=f"https://careercopilot.ai/dashboard/billing?success=true",
                cancel_url=f"https://careercopilot.ai/dashboard/billing?canceled=true",
                metadata={"user_id": user_id},
            )
            return session.id
        except Exception as e:
            logger.error(f"Stripe session creation failed: {e}")
            return "mock_checkout_session_id"

    async def handle_webhook(self, payload: bytes, sig_header: str) -> bool:
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
            if event.type == "checkout.session.completed":
                session = event.data.object
                user_id = session.metadata.get("user_id")
                if user_id:
                    await self.upgrade(user_id, "premium")
            elif event.type == "customer.subscription.deleted":
                sub_obj = event.data.object
                user_id = sub_obj.metadata.get("user_id")
                if user_id:
                    sub = await self.get_subscription(user_id)
                    sub["plan_id"] = "free"
                    sub["status"] = "cancelled"
            return True
        except stripe.error.SignatureVerificationError:
            logger.error("Invalid Stripe webhook signature")
            return False
        except Exception as e:
            logger.error(f"Webhook processing failed: {e}")
            return False

    async def get_all_subscriptions(self) -> list:
        return list(_subscriptions.values())


subscription_service = SubscriptionService()
