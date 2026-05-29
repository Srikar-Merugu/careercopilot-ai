from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.schemas.health import HealthCheckSchema
from backend.app.db.session import get_db, SessionLocal
from backend.app.core.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("", response_model=HealthCheckSchema)
async def check_health(db: Session = Depends(get_db)):
    """Health check endpoint to verify API and DB status"""
    db_status = "connected"
    
    try:
        # Perform quick select ping
        db.execute(text("SELECT 1"))
    except Exception as e:
        logger.error(f"Database connection check failed: {str(e)}")
        db_status = "disconnected"

    return HealthCheckSchema(
        status="healthy" if db_status == "connected" else "degraded",
        environment=settings.ENVIRONMENT,
        version="1.0.0",
        database=db_status,
        details={
            "api_name": settings.PROJECT_NAME,
            "logging_level": settings.LOG_LEVEL
        }
    )
