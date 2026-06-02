import logging
from typing import Optional
from datetime import datetime

from backend.app.models.dashboard import Notification, NotificationType

logger = logging.getLogger(__name__)


class AutomationNotifier:

    async def pipeline_started(self, user_id: str, pipeline_id: str):
        await Notification(
            user_id=user_id,
            type=NotificationType.SYSTEM,
            title="Automation Pipeline Started",
            content="Your automation pipeline has started. The system is now scanning and matching jobs.",
            meta_data={"pipeline_id": pipeline_id, "event": "pipeline_started"},
        ).insert()
        logger.info(f"Notification created: pipeline started for user {user_id}")

    async def pipeline_completed(
        self,
        user_id: str,
        pipeline_id: str,
        jobs_scanned: int,
        jobs_matched: int,
        jobs_queued: int,
    ):
        await Notification(
            user_id=user_id,
            type=NotificationType.APPLICATION_UPDATE,
            title="Automation Pipeline Completed",
            content=(
                f"Pipeline finished. Scanned {jobs_scanned} jobs, "
                f"matched {jobs_matched}, queued {jobs_queued} applications."
            ),
            meta_data={
                "pipeline_id": pipeline_id,
                "event": "pipeline_completed",
                "jobs_scanned": jobs_scanned,
                "jobs_matched": jobs_matched,
                "jobs_queued": jobs_queued,
            },
        ).insert()
        logger.info(f"Notification created: pipeline completed for user {user_id}")

    async def pipeline_failed(self, user_id: str, pipeline_id: str, error: str):
        await Notification(
            user_id=user_id,
            type=NotificationType.SYSTEM,
            title="Automation Pipeline Failed",
            content=f"Pipeline encountered an error: {error}",
            meta_data={
                "pipeline_id": pipeline_id,
                "event": "pipeline_failed",
                "error": error,
            },
        ).insert()
        logger.info(f"Notification created: pipeline failed for user {user_id}")

    async def application_submitted(
        self,
        user_id: str,
        job_title: str,
        company: str,
        application_id: str,
    ):
        await Notification(
            user_id=user_id,
            type=NotificationType.APPLICATION_UPDATE,
            title="Application Submitted",
            content=f"Auto-applied to {job_title} at {company}",
            meta_data={
                "application_id": application_id,
                "event": "application_submitted",
                "job_title": job_title,
                "company": company,
            },
        ).insert()

    async def platform_connected(self, user_id: str, platform: str):
        await Notification(
            user_id=user_id,
            type=NotificationType.SYSTEM,
            title=f"{platform.capitalize()} Connected",
            content=f"Your {platform.capitalize()} account has been linked for auto-apply.",
            meta_data={"platform": platform, "event": "platform_connected"},
        ).insert()

    async def daily_limit_reached(self, user_id: str):
        await Notification(
            user_id=user_id,
            type=NotificationType.SYSTEM,
            title="Daily Application Limit Reached",
            content="You've reached your daily auto-apply limit. It will reset tomorrow.",
            meta_data={"event": "daily_limit_reached"},
        ).insert()


automation_notifier = AutomationNotifier()
