import logging
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime
from uuid import uuid4

from backend.app.automation.providers import get_provider
from backend.app.automation.utils.browser import browser_manager
from backend.app.automation.queues.queue_manager import queue_manager
from backend.app.automation.ai_generation.cover_letter import cover_letter_generator

logger = logging.getLogger(__name__)

_application_store: Dict[str, Dict[str, Any]] = {}


class ApplyWorker:

    def __init__(self):
        self._running = False

    async def start(self):
        self._running = True
        asyncio.create_task(self._process_loop())
        logger.info("Apply worker started.")

    async def stop(self):
        self._running = False
        logger.info("Apply worker stopped.")

    async def _process_loop(self):
        while self._running:
            try:
                item = await queue_manager.dequeue()
                if item:
                    asyncio.create_task(self._process_application(item))
                else:
                    await asyncio.sleep(2)
            except Exception as e:
                logger.error(f"Worker loop error: {e}")
                await asyncio.sleep(5)

    async def _process_application(self, item: Dict[str, Any]):
        job_id = item.get("job_id", "unknown")
        user_id = item.get("user_id", "unknown")
        platform = item.get("platform", "generic")
        job_url = item.get("job_url", "")

        logger.info(f"Processing application: {job_id} on {platform}")

        try:
            if not await queue_manager.check_daily_limit(user_id):
                await queue_manager.mark_failed(item["id"], "Daily limit reached")
                return

            await self._log_application(user_id, job_id, "applying", platform)

            provider = get_provider(platform)

            if not job_url:
                await queue_manager.mark_failed(item["id"], "No job URL provided")
                await self._log_application(user_id, job_id, "failed", platform, error="No job URL")
                return

            context = await browser_manager.create_context()
            page = await browser_manager.create_page(context)

            try:
                cover_letter = ""
                if item.get("generate_cover_letter", True):
                    cover_letter = await cover_letter_generator.generate(
                        company=item.get("company", ""),
                        role=item.get("job_title", ""),
                        skills=item.get("skills"),
                    )

                application_data = {
                    "name": item.get("candidate_name", "John Doe"),
                    "email": item.get("candidate_email", ""),
                    "phone": item.get("candidate_phone", ""),
                    "linkedin": item.get("candidate_linkedin", ""),
                    "portfolio": item.get("candidate_portfolio", ""),
                    "skills": item.get("skills", []),
                    "experience_years": item.get("experience_years", "5"),
                    "current_role": item.get("current_role", "Software Engineer"),
                    "current_company": item.get("current_company", ""),
                    "location": item.get("location", "Bangalore"),
                    "expected_salary": item.get("expected_salary", "25"),
                    "notice_period": item.get("notice_period", "30 days"),
                    "cover_letter": cover_letter,
                    "resume_path": item.get("resume_path", ""),
                    "education": item.get("education", "Bachelor's in Computer Science"),
                }

                result = await provider.apply(page, job_url, application_data)

                if result.get("success"):
                    await queue_manager.mark_completed(item["id"], result)
                    await queue_manager.increment_daily_count(user_id)
                    await self._log_application(user_id, job_id, "submitted", platform)
                    logger.info(f"Application submitted: {job_id}")
                else:
                    await queue_manager.mark_failed(item["id"], result.get("error", "Unknown error"))
                    await self._log_application(user_id, job_id, "failed", platform, error=result.get("error"))

            finally:
                try:
                    await page.close()
                    await context.close()
                except Exception:
                    pass

        except Exception as e:
            logger.error(f"Application processing failed for {job_id}: {e}")
            await queue_manager.mark_failed(item["id"], str(e))
            await self._log_application(user_id, job_id, "failed", platform, error=str(e))

    async def _log_application(
        self, user_id: str, job_id: str, status: str,
        platform: str, error: Optional[str] = None
    ):
        app_id = str(uuid4())
        _application_store[app_id] = {
            "id": app_id,
            "user_id": user_id,
            "job_id": job_id,
            "status": status,
            "platform": platform,
            "error_message": error,
            "created_at": datetime.utcnow(),
        }

    async def get_applications(self, user_id: str) -> list:
        return [a for a in _application_store.values() if a["user_id"] == user_id]

    async def get_analytics(self, user_id: str) -> Dict[str, Any]:
        apps = [a for a in _application_store.values() if a["user_id"] == user_id]
        total = len(apps)
        submitted = sum(1 for a in apps if a["status"] == "submitted")
        failed = sum(1 for a in apps if a["status"] == "failed")
        today = datetime.utcnow().date()
        today_count = sum(1 for a in apps if a["created_at"].date() == today)
        return {
            "total_applications": total,
            "today_applications": today_count,
            "success_rate": (submitted / total * 100) if total > 0 else 0,
            "failed_count": failed,
            "submitted_count": submitted,
        }


apply_worker = ApplyWorker()
