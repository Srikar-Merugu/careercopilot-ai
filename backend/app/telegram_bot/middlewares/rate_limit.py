import time
import logging
from typing import Dict
from telegram import Update
from telegram.ext import BaseHandler

logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHandler):
    def __init__(self):
        super().__init__(self._callback)
        self._user_timestamps: Dict[str, float] = {}
        self._rate_limit = 1.0
        self._burst = 3

    async def _callback(self, update: Update, context):
        return

    async def collect_additional_context(self, context):
        pass

    async def handle_update(self, update, application, check_result, context):
        user_id = None
        if update.effective_user:
            user_id = str(update.effective_user.id)

        if user_id:
            now = time.time()
            last = self._user_timestamps.get(user_id, 0)
            if now - last < self._rate_limit:
                logger.debug(f"Rate limit hit for user {user_id}")
                return
            self._user_timestamps[user_id] = now

        return await super().handle_update(update, application, check_result, context)
