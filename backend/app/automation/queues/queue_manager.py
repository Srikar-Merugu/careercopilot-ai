import logging
import asyncio
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from uuid import uuid4

logger = logging.getLogger(__name__)

_queue: Dict[str, Dict[str, Any]] = {}
_queue_order: List[str] = []
_processing = False
_daily_counts: Dict[str, int] = {}
_daily_limit = 50


class AutomationQueueManager:

    async def enqueue(self, job_data: Dict[str, Any]) -> str:
        item_id = str(uuid4())
        _queue[item_id] = {
            "id": item_id,
            "status": "queued",
            "retry_count": 0,
            "max_retries": 3,
            "priority": job_data.get("priority", 0),
            "created_at": datetime.utcnow(),
            "scheduled_for": job_data.get("scheduled_for"),
            **job_data,
        }
        _queue_order.append(item_id)
        _queue_order.sort(key=lambda x: (
            -_queue[x].get("priority", 0),
            _queue[x].get("created_at", datetime.utcnow())
        ))
        logger.info(f"Enqueued job {job_data.get('job_id')} as {item_id}")
        return item_id

    async def enqueue_bulk(self, jobs: List[Dict[str, Any]]) -> List[str]:
        ids = []
        for job in jobs:
            item_id = await self.enqueue(job)
            ids.append(item_id)
        return ids

    async def dequeue(self) -> Optional[Dict[str, Any]]:
        for item_id in _queue_order:
            item = _queue[item_id]
            if item["status"] == "queued":
                item["status"] = "processing"
                item["started_at"] = datetime.utcnow()
                return item
        return None

    async def mark_completed(self, item_id: str, result: Dict[str, Any] = None):
        if item_id in _queue:
            _queue[item_id]["status"] = "completed"
            _queue[item_id]["completed_at"] = datetime.utcnow()
            _queue[item_id]["result"] = result

    async def mark_failed(self, item_id: str, error: str):
        if item_id in _queue:
            item = _queue[item_id]
            item["retry_count"] += 1
            if item["retry_count"] >= item["max_retries"]:
                item["status"] = "failed"
                item["error_message"] = error
            else:
                item["status"] = "retrying"
                item["error_message"] = error

    async def cancel(self, item_id: str):
        if item_id in _queue:
            _queue[item_id]["status"] = "cancelled"

    async def get_status(self, item_id: str) -> Optional[Dict[str, Any]]:
        return _queue.get(item_id)

    async def get_queue_status(self) -> Dict[str, int]:
        statuses = {"queued": 0, "processing": 0, "completed": 0, "failed": 0, "retrying": 0, "total": 0}
        for item in _queue.values():
            s = item.get("status", "queued")
            if s in statuses:
                statuses[s] += 1
            statuses["total"] += 1
        return statuses

    async def get_user_queue(self, user_id: str) -> List[Dict[str, Any]]:
        return [
            item for item in _queue.values()
            if item.get("user_id") == user_id
        ]

    async def get_pending_count(self) -> int:
        return sum(1 for item in _queue.values() if item["status"] in ("queued", "retrying"))

    async def check_daily_limit(self, user_id: str) -> bool:
        today = datetime.utcnow().date()
        key = f"{user_id}:{today}"
        count = _daily_counts.get(key, 0)
        return count < _daily_limit

    async def increment_daily_count(self, user_id: str):
        today = datetime.utcnow().date()
        key = f"{user_id}:{today}"
        _daily_counts[key] = _daily_counts.get(key, 0) + 1

    async def clear_queue(self):
        _queue.clear()
        _queue_order.clear()

    async def get_all_items(self) -> List[Dict[str, Any]]:
        return list(_queue.values())


queue_manager = AutomationQueueManager()
