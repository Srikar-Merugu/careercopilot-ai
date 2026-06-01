from fastapi import APIRouter
from backend.app.schemas.health import HealthCheckSchema
from backend.app.db.session import get_db_health
from backend.app.core.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("", response_model=HealthCheckSchema)
async def check_health():
    db_status = "connected" if await get_db_health() else "disconnected"

    return HealthCheckSchema(
        status="healthy" if db_status == "connected" else "degraded",
        environment=settings.ENVIRONMENT,
        version="1.0.0",
        database=db_status,
        details={
            "api_name": settings.PROJECT_NAME,
            "logging_level": settings.LOG_LEVEL,
        },
    )
