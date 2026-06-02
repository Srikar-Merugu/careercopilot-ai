import logging
from typing import Optional, Dict, Any
from datetime import datetime
from beanie import PydanticObjectId

from backend.app.models.automation import AutomationPipeline

logger = logging.getLogger(__name__)


class AutomationEngine:

    _active_pipelines: Dict[str, AutomationPipeline] = {}
    _worker_running: bool = False

    async def initialize(self):
        interrupted = await AutomationPipeline.find(
            AutomationPipeline.status == "running",
        ).to_list()
        for pipeline in interrupted:
            pipeline.status = "interrupted"
            pipeline.error_message = (
                "Server restarted while pipeline was running. "
                "Click 'Start Automation' to resume."
            )
            await pipeline.save()
            logger.info(f"Marked pipeline {pipeline.id} as interrupted (server restart)")
        if interrupted:
            logger.warning(f"Recovered {len(interrupted)} interrupted pipeline(s)")
        else:
            logger.info("No interrupted pipelines to recover")

    async def start_pipeline(self, user_id: str) -> AutomationPipeline:
        existing = await AutomationPipeline.find_one(
            AutomationPipeline.user_id == user_id,
            AutomationPipeline.status == "running",
        )
        if existing:
            return existing

        pipeline = await AutomationPipeline(
            user_id=user_id,
            status="running",
            started_at=datetime.utcnow(),
            current_phase="initializing",
        ).insert()

        self._active_pipelines[str(pipeline.id)] = pipeline
        return pipeline

    async def update_phase(self, pipeline_id: str, phase: str, **extra):
        pipeline = await AutomationPipeline.get(PydanticObjectId(pipeline_id))
        if pipeline:
            pipeline.current_phase = phase
            for k, v in extra.items():
                setattr(pipeline, k, v)
            await pipeline.save()
            if str(pipeline.id) in self._active_pipelines:
                self._active_pipelines[str(pipeline.id)] = pipeline

    async def complete_pipeline(self, pipeline_id: str, **extra):
        pipeline = await AutomationPipeline.get(PydanticObjectId(pipeline_id))
        if pipeline:
            pipeline.status = "completed"
            pipeline.completed_at = datetime.utcnow()
            pipeline.current_phase = "completed"
            for k, v in extra.items():
                setattr(pipeline, k, v)
            await pipeline.save()
            self._active_pipelines.pop(str(pipeline.id), None)

    async def fail_pipeline(self, pipeline_id: str, error: str):
        pipeline = await AutomationPipeline.get(PydanticObjectId(pipeline_id))
        if pipeline:
            pipeline.status = "failed"
            pipeline.error_message = error
            pipeline.current_phase = "error"
            await pipeline.save()
            self._active_pipelines.pop(str(pipeline.id), None)

    async def get_pipeline(self, user_id: str) -> Optional[AutomationPipeline]:
        return await AutomationPipeline.find(
            AutomationPipeline.user_id == user_id,
        ).sort(-AutomationPipeline.created_at).limit(1).first_or_none()

    async def is_running(self, user_id: str) -> bool:
        pipeline = await AutomationPipeline.find_one(
            AutomationPipeline.user_id == user_id,
            AutomationPipeline.status == "running",
        )
        return pipeline is not None


automation_engine = AutomationEngine()
