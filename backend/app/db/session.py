from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Base class for SQLAlchemy ORM models
Base = declarative_base()

try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,  # Check connection viability before running queries
        pool_size=10,
        max_overflow=20
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    logger.info("SQLAlchemy database engine initialized successfully.")
except Exception as e:
    logger.error(f"SQLAlchemy initialization failed: {str(e)}")
    # We create a dummy/mock setup for clean startup if connection string is missing during initial build
    engine = None
    SessionLocal = None

def get_db():
    """Dependency generator for database sessions in endpoints"""
    if SessionLocal is None:
        raise RuntimeError("Database engine not initialized. Verify DATABASE_URL.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
