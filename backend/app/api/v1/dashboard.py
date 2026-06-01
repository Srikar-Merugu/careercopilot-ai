import logging
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query

from backend.app.schemas.dashboard import (
    ApplicationCreate, ApplicationUpdate, ApplicationResponse,
    NotificationResponse, SubscriptionResponse, SubscriptionUpdate,
    ActivityLogResponse, DashboardAnalytics, ProfileUpdate, ProfileResponse,
)
from backend.app.models.dashboard import (
    Application, Notification, Subscription, ActivityLog,
    ApplicationStatus,
)
from backend.app.models.job import SavedJob, JobMatch
from backend.app.models.user import UserModel
from backend.app.models.resume import ResumeAnalysis
from backend.app.core.security import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()


def _get_user_id(current_user: dict) -> str:
    return current_user.get("id") or current_user.get("_id", "")


@router.get("/analytics", response_model=DashboardAnalytics)
async def get_dashboard_analytics(current_user: dict = Depends(get_current_user)):
    user_id = _get_user_id(current_user)

    apps = await Application.find(Application.user_id == user_id).to_list()
    by_status: dict[str, int] = {}
    for s in ApplicationStatus:
        by_status[s.value] = 0
    for a in apps:
        by_status[a.status.value] = by_status.get(a.status.value, 0) + 1

    total = len(apps)
    active = by_status.get("applied", 0) + by_status.get("interview", 0)
    interviews = by_status.get("interview", 0)
    offers = by_status.get("offer", 0)

    saved_count = await SavedJob.find(SavedJob.user_id == user_id).count()

    matches = await JobMatch.find(JobMatch.user_id == user_id).to_list()
    avg_match = 0.0
    if matches:
        scores = [m.match_score for m in matches if m.match_score is not None]
        if scores:
            avg_match = sum(scores) / len(scores)

    user = await UserModel.get(user_id)
    ats = user.ats_score if user and user.ats_score is not None else 0.0

    analyses = await ResumeAnalysis.find(
        {"user_id": user_id}
    ).sort(-ResumeAnalysis.created_at).limit(1).to_list()
    interview_readiness = 0.0
    if analyses and analyses[0].ats_score is not None:
        interview_readiness = min(analyses[0].ats_score * 1.0, 100.0)

    weekly_growth = 0.0

    recent = (
        await ActivityLog.find(ActivityLog.user_id == user_id)
        .sort(-ActivityLog.created_at)
        .limit(5)
        .to_list()
    )

    return DashboardAnalytics(
        total_applications=total,
        active_applications=active,
        interviews_scheduled=interviews,
        offers_received=offers,
        saved_jobs_count=saved_count,
        avg_match_score=round(avg_match, 1),
        interview_readiness=round(interview_readiness, 1),
        ats_score=round(ats, 1),
        weekly_growth=round(weekly_growth, 1),
        applications_by_status=by_status,
        recent_activity=[
            ActivityLogResponse(
                id=str(a.id),
                activity_type=a.activity_type,
                description=a.description,
                metadata=a.meta_data,
                created_at=a.created_at,
            )
            for a in recent
        ],
    )


@router.get("/applications", response_model=List[ApplicationResponse])
async def list_applications(
    current_user: dict = Depends(get_current_user),
    status: Optional[str] = Query(None),
):
    user_id = _get_user_id(current_user)
    query = Application.find(Application.user_id == user_id)
    if status:
        query = query.find(Application.status == status)
    apps = await query.sort(-Application.updated_at).to_list()
    return [
        ApplicationResponse(
            id=str(a.id),
            job_id=str(a.job_id) if a.job_id else None,
            job_title=a.job_title,
            company=a.company,
            location=a.location,
            salary_range=a.salary_range,
            status=a.status.value,
            notes=a.notes,
            interview_date=a.interview_date,
            apply_url=a.apply_url,
            created_at=a.created_at,
            updated_at=a.updated_at,
        )
        for a in apps
    ]


@router.post("/applications", response_model=ApplicationResponse)
async def create_application(
    app: ApplicationCreate,
    current_user: dict = Depends(get_current_user),
):
    user_id = _get_user_id(current_user)
    doc = Application(
        user_id=user_id,
        job_id=app.job_id,
        job_title=app.job_title,
        company=app.company,
        location=app.location,
        salary_range=app.salary_range,
        status=app.status,
        notes=app.notes,
        apply_url=app.apply_url,
    )
    await doc.insert()
    return ApplicationResponse(
        id=str(doc.id),
        job_id=str(doc.job_id) if doc.job_id else None,
        job_title=doc.job_title,
        company=doc.company,
        location=doc.location,
        salary_range=doc.salary_range,
        status=doc.status.value,
        notes=doc.notes,
        interview_date=doc.interview_date,
        apply_url=doc.apply_url,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


@router.patch("/applications/{app_id}", response_model=ApplicationResponse)
async def update_application(
    app_id: str,
    update: ApplicationUpdate,
    current_user: dict = Depends(get_current_user),
):
    user_id = _get_user_id(current_user)
    doc = await Application.find_one(
        Application.id == app_id,
        Application.user_id == user_id,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Application not found")

    if update.status is not None:
        doc.status = update.status
    if update.notes is not None:
        doc.notes = update.notes
    if update.interview_date is not None:
        doc.interview_date = update.interview_date
    doc.updated_at = datetime.utcnow()
    await doc.save()

    return ApplicationResponse(
        id=str(doc.id),
        job_id=str(doc.job_id) if doc.job_id else None,
        job_title=doc.job_title,
        company=doc.company,
        location=doc.location,
        salary_range=doc.salary_range,
        status=doc.status.value,
        notes=doc.notes,
        interview_date=doc.interview_date,
        apply_url=doc.apply_url,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


@router.delete("/applications/{app_id}")
async def delete_application(
    app_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = _get_user_id(current_user)
    doc = await Application.find_one(
        Application.id == app_id,
        Application.user_id == user_id,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Application not found")
    await doc.delete()
    return {"success": True, "message": "Application removed"}


@router.get("/notifications", response_model=List[NotificationResponse])
async def list_notifications(
    current_user: dict = Depends(get_current_user),
    unread_only: bool = Query(False),
):
    user_id = _get_user_id(current_user)
    query = Notification.find(Notification.user_id == user_id)
    if unread_only:
        query = query.find(Notification.is_read == False)
    notifs = await query.sort(-Notification.created_at).to_list()
    return [
        NotificationResponse(
            id=str(n.id),
            type=n.type.value if hasattr(n.type, "value") else str(n.type),
            title=n.title,
            content=n.content,
            metadata=n.meta_data,
            is_read=n.is_read,
            created_at=n.created_at,
        )
        for n in notifs
    ]


@router.patch("/notifications/{notif_id}/read")
async def mark_notification_read(
    notif_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = _get_user_id(current_user)
    doc = await Notification.find_one(
        Notification.id == notif_id,
        Notification.user_id == user_id,
    )
    if doc:
        doc.is_read = True
        await doc.save()
    return {"success": True}


@router.patch("/notifications/read-all")
async def mark_all_notifications_read(
    current_user: dict = Depends(get_current_user),
):
    user_id = _get_user_id(current_user)
    await Notification.find(
        Notification.user_id == user_id,
        Notification.is_read == False,
    ).update({"$set": {"is_read": True}})
    return {"success": True, "message": "All notifications marked as read"}


@router.get("/subscription", response_model=SubscriptionResponse)
async def get_subscription(current_user: dict = Depends(get_current_user)):
    user_id = _get_user_id(current_user)
    sub = await Subscription.find_one(Subscription.user_id == user_id)
    if not sub:
        return SubscriptionResponse(
            id="",
            plan="free",
            status="active",
            renewal_date=None,
            features_used={},
            created_at=datetime.utcnow(),
        )
    return SubscriptionResponse(
        id=str(sub.id),
        plan=sub.plan.value if hasattr(sub.plan, "value") else str(sub.plan),
        status=sub.status.value if hasattr(sub.status, "value") else str(sub.status),
        renewal_date=sub.renewal_date,
        features_used=sub.features_used,
        created_at=sub.created_at,
    )


@router.post("/subscription/upgrade", response_model=SubscriptionResponse)
async def upgrade_subscription(
    update: SubscriptionUpdate,
    current_user: dict = Depends(get_current_user),
):
    user_id = _get_user_id(current_user)
    sub = await Subscription.find_one(Subscription.user_id == user_id)
    if sub:
        sub.plan = update.plan
        sub.updated_at = datetime.utcnow()
        await sub.save()
    else:
        sub = Subscription(
            user_id=user_id,
            plan=update.plan,
            status="active",
        )
        await sub.insert()
    return SubscriptionResponse(
        id=str(sub.id),
        plan=sub.plan.value if hasattr(sub.plan, "value") else str(sub.plan),
        status=sub.status.value if hasattr(sub.status, "value") else str(sub.status),
        renewal_date=sub.renewal_date,
        features_used=sub.features_used,
        created_at=sub.created_at,
    )


@router.get("/activity", response_model=List[ActivityLogResponse])
async def get_activity_log(
    current_user: dict = Depends(get_current_user),
    limit: int = Query(20, ge=1, le=100),
):
    user_id = _get_user_id(current_user)
    activities = (
        await ActivityLog.find(ActivityLog.user_id == user_id)
        .sort(-ActivityLog.created_at)
        .limit(limit)
        .to_list()
    )
    return [
        ActivityLogResponse(
            id=str(a.id),
            activity_type=a.activity_type,
            description=a.description,
            metadata=a.meta_data,
            created_at=a.created_at,
        )
        for a in activities
    ]


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    user_id = _get_user_id(current_user)
    user = await UserModel.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return ProfileResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        headline=user.headline,
        bio=user.bio,
        skills=user.skills,
        preferred_roles=user.preferred_roles,
        locations=user.locations,
        experience_level=user.experience_level,
        onboarding_complete=user.onboarding_complete,
    )


@router.patch("/profile", response_model=ProfileResponse)
async def update_profile(
    update: ProfileUpdate,
    current_user: dict = Depends(get_current_user),
):
    user_id = _get_user_id(current_user)
    user = await UserModel.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if update.name is not None:
        user.name = update.name
    if update.headline is not None:
        user.headline = update.headline
    if update.bio is not None:
        user.bio = update.bio
    if update.skills is not None:
        user.skills = update.skills
    if update.preferred_roles is not None:
        user.preferred_roles = update.preferred_roles
    if update.locations is not None:
        user.locations = update.locations
    if update.experience_level is not None:
        user.experience_level = update.experience_level
    await user.save()

    return ProfileResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        headline=user.headline,
        bio=user.bio,
        skills=user.skills,
        preferred_roles=user.preferred_roles,
        locations=user.locations,
        experience_level=user.experience_level,
        onboarding_complete=user.onboarding_complete,
    )
