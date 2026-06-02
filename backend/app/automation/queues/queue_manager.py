import logging
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from beanie import PydanticObjectId

from backend.app.models.automation import AutomationQueueItem, AutomationQueueStatus

logger = logging.getLogger(__name__)


class AutomationQueueManager:

    async def enqueue(self, job_data: Dict[str, Any]) -> str:
        item = await AutomationQueueItem(
            user_id=job_data.get("user_id", ""),
            job_id=job_data.get("job_id", ""),
            job_title=job_data.get("job_title"),
            company=job_data.get("company"),
            platform=job_data.get("platform", "generic"),
            job_url=job_data.get("job_url"),
            priority=job_data.get("priority", 0),
            max_retries=job_data.get("max_retries", 3),
            meta_data=job_data.get("meta_data", {}),
        ).insert()
        logger.info(f"Enqueued job {job_data.get('job_id')} as {item.id}")
        return str(item.id)

    async def enqueue_bulk(self, jobs: List[Dict[str, Any]]) -> List[str]:
        ids = []
        for job in jobs:
            item_id = await self.enqueue(job)
            ids.append(item_id)
        return ids

    async def dequeue(self) -> Optional[Dict[str, Any]]:
        item = await AutomationQueueItem.find(
            AutomationQueueItem.status == AutomationQueueStatus.QUEUED,
        ).sort(
            +AutomationQueueItem.priority,
            +AutomationQueueItem.created_at,
        ).limit(1).first_or_none()

        if item:
            item.status = AutomationQueueStatus.PROCESSING
            item.started_at = datetime.utcnow()
            await item.save()
            return item.model_dump()
        return None

    async def mark_completed(self, item_id: str, result: Dict[str, Any] = None):
        try:
            item = await AutomationQueueItem.get(PydanticObjectId(item_id))
            if item:
                item.status = AutomationQueueStatus.COMPLETED
                item.completed_at = datetime.utcnow()
                await item.save()
        except Exception as e:
            logger.error(f"Failed to mark completed {item_id}: {e}")

    async def mark_failed(self, item_id: str, error: str):
        try:
            item = await AutomationQueueItem.get(PydanticObjectId(item_id))
            if item:
                item.retry_count += 1
                if item.retry_count >= item.max_retries:
                    item.status = AutomationQueueStatus.FAILED
                    item.error_message = error
                else:
                    item.status = AutomationQueueStatus.RETRYING
                    item.error_message = error
                await item.save()
        except Exception as e:
            logger.error(f"Failed to mark failed {item_id}: {e}")

    async def cancel(self, item_id: str):
        try:
            item = await AutomationQueueItem.get(PydanticObjectId(item_id))
            if item:
                item.status = AutomationQueueStatus.CANCELLED
                await item.save()
        except Exception as e:
            logger.error(f"Failed to cancel {item_id}: {e}")

    async def get_status(self, item_id: str) -> Optional[Dict[str, Any]]:
        try:
            item = await AutomationQueueItem.get(PydanticObjectId(item_id))
            return item.model_dump() if item else None
        except Exception:
            return None

    async def get_queue_status(self) -> Dict[str, int]:
        statuses = {"queued": 0, "processing": 0, "completed": 0, "failed": 0, "retrying": 0, "total": 0}
        pipeline = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]
        try:
            results = await AutomationQueueItem.aggregate(pipeline).to_list()
            for r in results:
                s = r.get("_id", "queued")
                if s in statuses:
                    statuses[s] = r.get("count", 0)
                statuses["total"] += r.get("count", 0)
        except Exception as e:
            logger.error(f"Failed to get queue status: {e}")
        return statuses

    async def get_user_queue(self, user_id: str) -> List[Dict[str, Any]]:
        items = await AutomationQueueItem.find(
            AutomationQueueItem.user_id == user_id
        ).sort(-AutomationQueueItem.created_at).to_list()
        return [i.model_dump() for i in items]

    async def get_pending_count(self) -> int:
        return await AutomationQueueItem.find(
            AutomationQueueItem.status == AutomationQueueStatus.QUEUED
        ).count()

    async def check_daily_limit(self, user_id: str) -> bool:
        from backend.app.models.automation import AutomationSettings
        settings = await AutomationSettings.find_one(AutomationSettings.user_id == user_id)
        limit = settings.daily_limit if settings else 50
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        count = await AutomationQueueItem.find(
            AutomationQueueItem.user_id == user_id,
            AutomationQueueItem.created_at >= today,
            AutomationQueueItem.status == AutomationQueueStatus.COMPLETED,
        ).count()
        return count < limit

    async def increment_daily_count(self, user_id: str):
        pass

    async def clear_queue(self):
        await AutomationQueueItem.delete_all()

    async def get_all_items(self) -> List[Dict[str, Any]]:
        items = await AutomationQueueItem.find_all().sort(-AutomationQueueItem.created_at).to_list()
        return [i.model_dump() for i in items]


queue_manager = AutomationQueueManager()
