import logging
from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from backend.app.core.config import settings
from backend.app.core.logging import setup_logging
from backend.app.core.exceptions import register_exception_handlers
from backend.app.core.monitoring import MetricsMiddleware, APM_METRICS
from backend.app.middleware.cors import setup_cors
from backend.app.middleware.security import setup_security_headers
from backend.app.middleware.rate_limit import RateLimitMiddleware, FeatureAccessMiddleware
from backend.app.api.router import api_router

logger = logging.getLogger(__name__)

# Initialize system loggers
setup_logging()

# Instantiate FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="CareerCopilot AI platform backend services.",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
)

# Register CORS middleware first
setup_cors(app)

# Register security headers
setup_security_headers(app)

# Rate limiting (per-IP, 60 req/min)
app.add_middleware(RateLimitMiddleware, requests_per_minute=60)

# Feature access control for premium features
app.add_middleware(FeatureAccessMiddleware)

# Request metrics and monitoring
app.add_middleware(MetricsMiddleware)

# Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Trusted hosts
if settings.ENVIRONMENT == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=[
            "careercopilot.ai",
            "www.careercopilot.ai",
            "api.careercopilot.ai",
            "*.onrender.com",
            "*.vercel.app",
            "localhost",
        ],
    )

# Setup centralized exception mappings
register_exception_handlers(app)

# Mount API sub-routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}.",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
    }


@app.get("/metrics")
async def metrics():
    return APM_METRICS


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT != "production",
        workers=4 if settings.ENVIRONMENT == "production" else 1,
        limit_concurrency=100,
        timeout_keep_alive=30,
    )
