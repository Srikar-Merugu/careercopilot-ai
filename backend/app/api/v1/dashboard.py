import logging
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query, Body

from backend.app.schemas.dashboard import (
    ApplicationCreate, ApplicationUpdate, ApplicationResponse,
    NotificationResponse, SubscriptionResponse, SubscriptionUpdate,
    ActivityLogResponse, DashboardAnalytics, ProfileUpdate, ProfileResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter()

MOCK_USER_ID = "mock_jwt_token_for_career_copilot_frontend"


@router.get("/analytics", response_model=DashboardAnalytics)
async def get_dashboard_analytics(user_id: str = Query(MOCK_USER_ID)):
    return DashboardAnalytics(
        total_applications=24,
        active_applications=12,
        interviews_scheduled=3,
        offers_received=1,
        saved_jobs_count=18,
        avg_match_score=78.4,
        interview_readiness=72.0,
        ats_score=85.0,
        weekly_growth=12.5,
        applications_by_status={
            "saved": 8, "applied": 6, "interview": 3,
            "offer": 1, "rejected": 4, "withdrawn": 2
        },
        recent_activity=[
            ActivityLogResponse(
                id=UUID(int=1), activity_type="application_update",
                description="Applied to Senior Engineer at Google",
                created_at=datetime.utcnow(),
            ),
            ActivityLogResponse(
                id=UUID(int=2), activity_type="ai_match",
                description="AI matched you with 3 new positions",
                created_at=datetime.utcnow(),
            ),
            ActivityLogResponse(
                id=UUID(int=3), activity_type="interview",
                description="Interview scheduled with Stripe on Friday",
                created_at=datetime.utcnow(),
            ),
            ActivityLogResponse(
                id=UUID(int=4), activity_type="resume_analysis",
                description="Resume ATS score updated to 85%",
                created_at=datetime.utcnow(),
            ),
            ActivityLogResponse(
                id=UUID(int=5), activity_type="skill_gap",
                description="New skill gap analysis available",
                created_at=datetime.utcnow(),
            ),
        ]
    )


@router.get("/applications", response_model=List[ApplicationResponse])
async def list_applications(
    user_id: str = Query(MOCK_USER_ID),
    status: Optional[str] = Query(None),
):
    mock_apps = [
        ApplicationResponse(
            id=UUID(int=i), job_id=UUID(int=i), job_title=title, company=comp,
            location=loc, salary_range=sal, status=stat, notes=None,
            interview_date=dt, apply_url=None, created_at=datetime.utcnow(), updated_at=datetime.utcnow(),
        )
        for i, (title, comp, loc, sal, stat, dt) in enumerate([
            ("Senior Frontend Engineer", "Google", "Mountain View, CA", "$180k-$220k", "applied", None),
            ("Staff Backend Engineer", "Stripe", "San Francisco, CA", "$200k-$250k", "interview", datetime(2026, 6, 5, 14, 0)),
            ("AI Research Engineer", "OpenAI", "San Francisco, CA", "$220k-$300k", "interview", datetime(2026, 6, 10, 11, 0)),
            ("Full Stack Developer", "Vercel", "Remote", "$160k-$200k", "applied", None),
            ("Product Engineer", "Linear", "Remote", "$170k-$210k", "saved", None),
            ("Software Engineer", "Notion", "New York, NY", "$175k-$215k", "offer", None),
            ("DevOps Lead", "Datadog", "Remote", "$185k-$230k", "rejected", None),
            ("ML Platform Engineer", "Netflix", "Los Gatos, CA", "$250k-$350k", "saved", None),
            ("React Native Developer", "Spotify", "New York, NY", "$160k-$195k", "applied", None),
            ("Engineering Manager", "GitHub", "Remote", "$200k-$260k", "interview", datetime(2026, 6, 15, 13, 0)),
        ])
    ]
    if status:
        mock_apps = [a for a in mock_apps if a.status == status]
    return mock_apps


@router.post("/applications", response_model=ApplicationResponse)
async def create_application(app: ApplicationCreate, user_id: str = Body(MOCK_USER_ID)):
    return ApplicationResponse(
        id=UUID(int=99), job_id=app.job_id, job_title=app.job_title,
        company=app.company, location=app.location, salary_range=app.salary_range,
        status=app.status, notes=app.notes, interview_date=None,
        apply_url=app.apply_url, created_at=datetime.utcnow(), updated_at=datetime.utcnow(),
    )


@router.patch("/applications/{app_id}", response_model=ApplicationResponse)
async def update_application(app_id: UUID, update: ApplicationUpdate):
    return ApplicationResponse(
        id=app_id, job_id=None, job_title="Updated Position", company="Company",
        status=update.status or "applied", notes=update.notes, interview_date=update.interview_date,
        created_at=datetime.utcnow(), updated_at=datetime.utcnow(),
    )


@router.delete("/applications/{app_id}")
async def delete_application(app_id: UUID):
    return {"success": True, "message": "Application removed"}


@router.get("/notifications", response_model=List[NotificationResponse])
async def list_notifications(user_id: str = Query(MOCK_USER_ID), unread_only: bool = Query(False)):
    all_notifications = [
        NotificationResponse(
            id=UUID(int=i), type=t, title=title, content=content,
            metadata=None, is_read=read, created_at=datetime.utcnow(),
        )
        for i, (t, title, content, read) in enumerate([
            ("ai_recommendation", "New AI Match: Senior Engineer at Google", "Your profile matches 92% with this position", False),
            ("interview_reminder", "Interview Tomorrow: Stripe @ 2PM", "Prepare for your technical interview with Stripe", False),
            ("application_update", "Application Status Update: Notion", "Your application has moved to offer stage", False),
            ("job_alert", "3 New Remote Positions Available", "AI found matching positions based on your profile", True),
            ("career_insight", "Weekly Career Insight: Skill Growth", "Your top skill to develop this week: System Design", True),
            ("resume_analysis", "Resume Analysis Complete", "Your ATS score improved to 87%", True),
            ("system", "Welcome to CareerCopilot Pro", "Your Pro plan features are now active", False),
        ])
    ]
    if unread_only:
        all_notifications = [n for n in all_notifications if not n.is_read]
    return all_notifications


@router.patch("/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: UUID):
    return {"success": True}


@router.patch("/notifications/read-all")
async def mark_all_notifications_read(user_id: str = Body(MOCK_USER_ID)):
    return {"success": True, "message": "All notifications marked as read"}


@router.get("/subscription", response_model=SubscriptionResponse)
async def get_subscription(user_id: str = Query(MOCK_USER_ID)):
    return SubscriptionResponse(
        id=UUID(int=1), plan="pro", status="active", renewal_date=datetime(2026, 7, 15),
        features_used={"ai_matches": 142, "resume_analyses": 8, "saved_jobs": 18},
        created_at=datetime.utcnow(),
    )


@router.post("/subscription/upgrade", response_model=SubscriptionResponse)
async def upgrade_subscription(update: SubscriptionUpdate, user_id: str = Body(MOCK_USER_ID)):
    return SubscriptionResponse(
        id=UUID(int=1), plan=update.plan, status="active",
        renewal_date=datetime(2026, 7, 15), features_used={}, created_at=datetime.utcnow(),
    )


@router.get("/activity", response_model=List[ActivityLogResponse])
async def get_activity_log(user_id: str = Query(MOCK_USER_ID), limit: int = Query(20, ge=1, le=100)):
    activities = [
        ActivityLogResponse(id=UUID(int=i), activity_type=t, description=d, metadata=None, created_at=datetime.utcnow())
        for i, (t, d) in enumerate([
            ("application_update", "Applied to Senior Frontend Engineer at Google"),
            ("ai_match", "AI match score calculated: 92% for Staff Engineer at Stripe"),
            ("interview", "Interview confirmed with Stripe on June 5th at 2:00 PM"),
            ("resume_analysis", "Resume ATS re-scored: 87% (+2% improvement)"),
            ("skill_gap", "Skill gap analysis completed: 5 missing skills identified"),
            ("application_update", "Application status changed to 'Offer' for Notion"),
            ("ai_recommendation", "3 new AI recommendations generated for your profile"),
            ("saved_job", "Saved job: ML Platform Engineer at Netflix"),
            ("interview", "Interview preparation materials generated for Stripe"),
            ("career_insight", "Weekly career insight report is now available"),
            ("application_update", "Rejected from DevOps Lead at Datadog"),
            ("ai_match", "Batch match completed: 15 jobs analyzed against your resume"),
            ("subscription", "Upgraded to CareerCopilot Pro plan"),
            ("profile_update", "Profile skills updated: added System Design, Kubernetes"),
            ("notification", "AI recommendation: Consider learning LangChain"),
        ])
    ]
    return activities[:limit]


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(user_id: str = Query(MOCK_USER_ID)):
    return ProfileResponse(
        id=user_id, name="Alex Chen", email="alex@example.com",
        headline="Senior Full Stack Engineer", bio="Building the future of AI-powered career development",
        skills=["Python", "TypeScript", "React", "Next.js", "FastAPI", "Docker", "AWS", "PostgreSQL"],
        preferred_roles=["Senior Engineer", "Staff Engineer", "Tech Lead"],
        locations=["San Francisco, CA", "Remote", "New York, NY"],
        experience_level="senior", onboarding_complete=True,
    )


@router.patch("/profile", response_model=ProfileResponse)
async def update_profile(update: ProfileUpdate, user_id: str = Body(MOCK_USER_ID)):
    return ProfileResponse(
        id=user_id, name=update.name or "Alex Chen", email="alex@example.com",
        headline=update.headline or "Senior Full Stack Engineer",
        bio=update.bio or "Building the future of AI-powered career development",
        skills=update.skills or ["Python", "TypeScript", "React"],
        preferred_roles=update.preferred_roles or [],
        locations=update.locations or [],
        experience_level=update.experience_level or "senior",
        onboarding_complete=True,
    )
