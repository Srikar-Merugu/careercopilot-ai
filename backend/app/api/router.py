from fastapi import APIRouter
from backend.app.api.v1 import health, auth, users, resume, jobs, ai, dashboard, interviews, telegram, automation, subscriptions, admin

api_router = APIRouter()

# Mount API routers
api_router.include_router(health.router, prefix="/health", tags=["system-diagnostics"])
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["user-management"])
api_router.include_router(resume.router, prefix="/resume", tags=["resume-analysis"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["job-search"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai-semantic-engine"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard-workspace"])
api_router.include_router(interviews.router, prefix="/interviews", tags=["interview-preparation"])
api_router.include_router(telegram.router, prefix="/telegram", tags=["telegram-bot"])
api_router.include_router(automation.router, prefix="/automation", tags=["auto-apply"])
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin-panel"])
