import logging
import random
from typing import List, Optional
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

from backend.app.core.config import settings
from backend.app.telegram_bot.services.auth_service import telegram_auth_service
from backend.app.telegram_bot.services.job_service import telegram_job_service

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


class NotificationEngine:

    def __init__(self):
        self._scheduler = scheduler
        self._bot_app = None

    def set_bot_app(self, bot_app):
        self._bot_app = bot_app

    async def start(self):
        if not self._scheduler.running:
            self._schedule_jobs()
            self._scheduler.start()
            logger.info("Notification engine started.")

    async def stop(self):
        if self._scheduler.running:
            self._scheduler.shutdown(wait=False)
            logger.info("Notification engine stopped.")

    def _schedule_jobs(self):
        self._scheduler.add_job(
            self._send_daily_job_alerts,
            CronTrigger(hour=8, minute=0, timezone="Asia/Kolkata"),
            id="daily_job_alerts",
            replace_existing=True,
        )
        self._scheduler.add_job(
            self._send_daily_job_alerts,
            CronTrigger(hour=18, minute=0, timezone="Asia/Kolkata"),
            id="evening_job_alerts",
            replace_existing=True,
        )
        self._scheduler.add_job(
            self._send_trending_alerts,
            CronTrigger(day_of_week="mon", hour=9, minute=0, timezone="Asia/Kolkata"),
            id="weekly_trending",
            replace_existing=True,
        )
        self._scheduler.add_job(
            self._send_career_tips,
            IntervalTrigger(hours=12),
            id="career_tips",
            replace_existing=True,
        )
        self._scheduler.add_job(
            self._cleanup_old_alerts,
            CronTrigger(day=1, hour=3, minute=0),
            id="cleanup_alerts",
            replace_existing=True,
        )

    async def _send_daily_job_alerts(self):
        if not self._bot_app:
            logger.warning("Bot app not set. Skipping daily alerts.")
            return

        users = await telegram_auth_service.get_active_users()
        for user in users:
            if not user.get("notifications_enabled"):
                continue
            prefs = user.get("preferences", {})
            if not prefs.get("daily_alerts", True):
                continue

            try:
                jobs = telegram_job_service.get_recommended_jobs(user["user_id"], limit=3)
                if not jobs:
                    continue

                lines = [
                    "🌅 *Your Daily Job Alerts* ☕\n",
                    "Here are today's top AI\\-matched opportunities:\n",
                ]
                for job in jobs:
                    from backend.app.telegram_bot.utils.formatting import build_job_card, format_score
                    lines.append(build_job_card(job))
                    lines.append("")

                lines.append("Use /myjobs to see the full list\\!")

                await self._bot_app.bot.send_message(
                    chat_id=user["telegram_id"],
                    text="\n".join(lines),
                    parse_mode="MarkdownV2",
                )
                await telegram_auth_service.log_activity(
                    user["user_id"], "daily_job_alert",
                    {"jobs_count": len(jobs)}
                )
            except Exception as e:
                logger.error(f"Failed to send daily alert to {user['telegram_id']}: {e}")

    async def _send_trending_alerts(self):
        if not self._bot_app:
            return

        users = await telegram_auth_service.get_active_users()
        for user in users:
            if not user.get("notifications_enabled"):
                continue
            prefs = user.get("preferences", {})
            if not prefs.get("trending_alerts", True):
                continue

            try:
                jobs = telegram_job_service.get_trending_jobs(limit=3)
                lines = [
                    "🔥 *Trending Jobs This Week*\n",
                ]
                for job in jobs:
                    from backend.app.telegram_bot.utils.formatting import build_job_card
                    lines.append(build_job_card(job))
                    lines.append("")

                await self._bot_app.bot.send_message(
                    chat_id=user["telegram_id"],
                    text="\n".join(lines),
                    parse_mode="MarkdownV2",
                )
                await telegram_auth_service.log_activity(
                    user["user_id"], "trending_alert",
                    {"jobs_count": len(jobs)}
                )
            except Exception as e:
                logger.error(f"Failed to send trending alert: {e}")

    async def _send_career_tips(self):
        if not self._bot_app:
            return

        users = await telegram_auth_service.get_active_users()
        from backend.app.telegram_bot.utils.formatting import build_career_tip

        for user in users:
            if not user.get("notifications_enabled"):
                continue

            try:
                tip = build_career_tip()
                await self._bot_app.bot.send_message(
                    chat_id=user["telegram_id"],
                    text=tip,
                    parse_mode="MarkdownV2",
                )
            except Exception as e:
                logger.error(f"Failed to send career tip: {e}")

    async def _cleanup_old_alerts(self):
        logger.info("Notification cleanup job running.")
        pass

    async def send_instant_match(self, user_id: str, job: dict):
        if not self._bot_app:
            return

        user = await telegram_auth_service.get_user_by_user_id(user_id)
        if not user or not user.get("notifications_enabled"):
            return

        from backend.app.telegram_bot.utils.formatting import build_job_card
        from backend.app.telegram_bot.keyboards.inline import job_action_keyboard

        lines = [
            "🎯 *Instant Match\\!*\n",
            build_job_card(job),
        ]
        try:
            await self._bot_app.bot.send_message(
                chat_id=user["telegram_id"],
                text="\n".join(lines),
                parse_mode="MarkdownV2",
                reply_markup=job_action_keyboard(job["id"]),
            )
            await telegram_auth_service.log_activity(user_id, "instant_match_alert", {"job_id": job["id"]})
        except Exception as e:
            logger.error(f"Failed to send instant match: {e}")

    async def send_interview_reminder(self, user_id: str, title: str = "Interview Tomorrow"):
        if not self._bot_app:
            return

        user = await telegram_auth_service.get_user_by_user_id(user_id)
        if not user or not user.get("notifications_enabled"):
            return

        try:
            await self._bot_app.bot.send_message(
                chat_id=user["telegram_id"],
                text=f"⏰ *Interview Reminder*\n\n{title}\n\nUse /interviewprep to practice\\!",
                parse_mode="MarkdownV2",
            )
        except Exception as e:
            logger.error(f"Failed to send interview reminder: {e}")

    async def send_broadcast(self, message: str):
        if not self._bot_app:
            return
        users = await telegram_auth_service.get_active_users()
        for user in users:
            try:
                await self._bot_app.bot.send_message(
                    chat_id=user["telegram_id"],
                    text=message,
                    parse_mode="MarkdownV2",
                )
            except Exception as e:
                logger.error(f"Broadcast failed for {user['telegram_id']}: {e}")


notification_engine = NotificationEngine()
