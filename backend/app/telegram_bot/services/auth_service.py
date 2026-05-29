import logging
from typing import Optional
from uuid import uuid4
from datetime import datetime

from backend.app.core.config import settings
from backend.app.models.telegram import TelegramUser, AlertType, BotActivity
from backend.app.telegram_bot.utils.formatting import escape_markdown

logger = logging.getLogger(__name__)

_in_memory_users: dict = {}
_in_memory_activities: list = []


class TelegramAuthService:

    async def get_or_create_user(
        self, telegram_id: str, username: Optional[str] = None,
        first_name: Optional[str] = None, last_name: Optional[str] = None
    ) -> dict:
        if telegram_id in _in_memory_users:
            user = _in_memory_users[telegram_id]
            user["last_interaction"] = datetime.utcnow()
            return user

        user_id = str(uuid4())
        user = {
            "id": user_id,
            "user_id": user_id,
            "telegram_id": telegram_id,
            "telegram_username": username,
            "first_name": first_name,
            "last_name": last_name,
            "is_active": True,
            "notifications_enabled": True,
            "preferences": {
                "daily_alerts": True,
                "instant_matches": True,
                "trending_alerts": True,
                "interview_reminders": True,
            },
            "last_interaction": datetime.utcnow(),
            "created_at": datetime.utcnow(),
        }
        _in_memory_users[telegram_id] = user
        await self.log_activity(user_id, "user_registered", {
            "telegram_username": username,
            "first_name": first_name,
        })
        logger.info(f"New Telegram user registered: {telegram_id}")
        return user

    async def get_user_by_telegram_id(self, telegram_id: str) -> Optional[dict]:
        return _in_memory_users.get(telegram_id)

    async def get_user_by_user_id(self, user_id: str) -> Optional[dict]:
        for u in _in_memory_users.values():
            if u["user_id"] == user_id:
                return u
        return None

    async def update_user(self, telegram_id: str, updates: dict) -> Optional[dict]:
        user = _in_memory_users.get(telegram_id)
        if not user:
            return None
        user.update(updates)
        user["updated_at"] = datetime.utcnow()
        return user

    async def toggle_notifications(self, telegram_id: str) -> bool:
        user = _in_memory_users.get(telegram_id)
        if not user:
            return False
        user["notifications_enabled"] = not user["notifications_enabled"]
        user["updated_at"] = datetime.utcnow()
        return user["notifications_enabled"]

    async def update_preferences(self, telegram_id: str, preferences: dict) -> bool:
        user = _in_memory_users.get(telegram_id)
        if not user:
            return False
        current = user.get("preferences", {})
        current.update(preferences)
        user["preferences"] = current
        user["updated_at"] = datetime.utcnow()
        return True

    async def get_active_users(self) -> list:
        return [u for u in _in_memory_users.values() if u.get("is_active")]

    async def get_user_count(self) -> int:
        return len(_in_memory_users)

    async def get_active_user_count(self) -> int:
        return sum(1 for u in _in_memory_users.values() if u.get("is_active"))

    async def log_activity(self, user_id: str, action: str, metadata: dict = None):
        activity = {
            "id": str(uuid4()),
            "user_id": user_id,
            "action": action,
            "metadata": metadata or {},
            "created_at": datetime.utcnow(),
        }
        _in_memory_activities.append(activity)
        logger.debug(f"Bot activity: {user_id} -> {action}")

    async def get_recent_activity(self, limit: int = 50) -> list:
        return sorted(
            _in_memory_activities,
            key=lambda x: x["created_at"],
            reverse=True
        )[:limit]

    async def get_total_alerts_sent(self) -> int:
        return sum(1 for a in _in_memory_activities if a["action"] in (
            "alert_sent", "daily_job_alert", "instant_match_alert"
        ))


telegram_auth_service = TelegramAuthService()
