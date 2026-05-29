import logging
from typing import Optional, Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)

_sessions: Dict[str, Dict[str, Any]] = {}


class AutomationSessionManager:

    async def save_session(self, user_id: str, platform: str, session_data: dict, cookies: dict = None):
        key = f"{user_id}:{platform}"
        _sessions[key] = {
            "user_id": user_id,
            "platform": platform,
            "session_data": session_data,
            "cookies": cookies or {},
            "is_active": True,
            "last_used": datetime.utcnow(),
            "created_at": datetime.utcnow(),
        }
        logger.info(f"Session saved for {user_id} on {platform}")

    async def get_session(self, user_id: str, platform: str) -> Optional[Dict[str, Any]]:
        key = f"{user_id}:{platform}"
        session = _sessions.get(key)
        if session:
            session["last_used"] = datetime.utcnow()
        return session

    async def delete_session(self, user_id: str, platform: str):
        key = f"{user_id}:{platform}"
        if key in _sessions:
            del _sessions[key]
            logger.info(f"Session deleted for {user_id} on {platform}")

    async def is_session_valid(self, user_id: str, platform: str) -> bool:
        session = await self.get_session(user_id, platform)
        if not session:
            return False
        return session.get("is_active", False)

    async def get_all_sessions(self, user_id: str) -> list:
        return [
            v for k, v in _sessions.items()
            if v["user_id"] == user_id
        ]


session_manager = AutomationSessionManager()
