import asyncio
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

client: AsyncIOMotorClient | None = None


async def init_db():
    global client
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        await client.admin.command("ping")
        logger.info("MongoDB connection established successfully.")

        await init_beanie(
            database=client[settings.MONGODB_DB],
            document_models=[
                "backend.app.models.user.UserModel",
                "backend.app.models.resume.Resume",
                "backend.app.models.resume.ResumeAnalysis",
                "backend.app.models.job.Job",
                "backend.app.models.job.SavedJob",
                "backend.app.models.job.JobMatch",
                "backend.app.models.ai.Embedding",
                "backend.app.models.ai.CareerInsight",
                "backend.app.models.ai.Recommendation",
                "backend.app.models.dashboard.Application",
                "backend.app.models.dashboard.Notification",
                "backend.app.models.dashboard.Subscription",
                "backend.app.models.dashboard.ActivityLog",
                "backend.app.models.interview.Interview",
                "backend.app.models.interview.InterviewQuestion",
                "backend.app.models.interview.InterviewFeedback",
                "backend.app.models.telegram.TelegramUser",
                "backend.app.models.telegram.TelegramAlert",
                "backend.app.models.telegram.BotActivity",
                "backend.app.models.automation.AutoApplication",
                "backend.app.models.automation.CoverLetter",
                "backend.app.models.automation.AutomationQueueItem",
                "backend.app.models.automation.AutomationSession",
                "backend.app.models.automation.AutomationPipeline",
                "backend.app.models.automation.AutomationSettings",
            ],
        )
        logger.info("Beanie document models registered successfully.")
        return True
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        client = None
        return False


async def close_db():
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed.")


async def get_db_health() -> bool:
    if not client:
        return False
    try:
        await client.admin.command("ping")
        return True
    except Exception:
        return False
