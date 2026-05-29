import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.security import get_current_user
from backend.app.db.session import get_db
from backend.app.models.job import Job, SavedJob, JobMatch
from backend.app.schemas.job import (
    JobResponse, JobSearchParams, JobSearchResponse,
    JobWithMatchResponse, JobMatchResponse,
    SavedJobResponse, JobRecommendationResponse,
)
from backend.app.services.job_providers.base import SearchFilters
from backend.app.services.job_providers.mock_provider import mock_provider
from backend.app.services.job_providers.adzuna_provider import AdzunaJobProvider
from backend.app.services.ai_matching_service import ai_matching_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/jobs", tags=["job-search"])

adzuna_provider = AdzunaJobProvider()


def get_providers():
    providers = [mock_provider]
    if adzuna_provider.enabled:
        providers.append(adzuna_provider)
    return providers


@router.get("/search", response_model=JobSearchResponse)
async def search_jobs(
    query: str = Query("", description="Search query"),
    location: Optional[str] = Query(None),
    remote_type: Optional[str] = Query(None),
    salary_min: Optional[int] = Query(None),
    salary_max: Optional[int] = Query(None),
    experience: Optional[str] = Query(None),
    job_type: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    sort_by: str = Query("match_score"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=50),
    match_min: Optional[float] = Query(None),
    days_ago: Optional[int] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    filters = SearchFilters(
        query=query or "",
        location=location,
        remote_type=remote_type,
        salary_min=salary_min,
        salary_max=salary_max,
        experience=experience,
        job_type=job_type,
        category=category,
        page=page,
        per_page=per_page,
    )

    all_jobs = []
    total = 0
    for provider in get_providers():
        result = provider.search(filters)
        all_jobs.extend(result.jobs)
        total += result.total

    jobs_response = []
    for jd in all_jobs:
        job_dict = {
            "id": jd.source_id,
            "source": jd.source,
            "title": jd.title,
            "company": jd.company,
            "company_logo": jd.company_logo,
            "location": jd.location,
            "salary_min": jd.salary_min,
            "salary_max": jd.salary_max,
            "salary_currency": jd.salary_currency,
            "description": jd.description,
            "requirements": jd.requirements,
            "required_skills": jd.required_skills or [],
            "experience_required": jd.experience_required,
            "job_type": jd.job_type,
            "remote_type": jd.remote_type,
            "apply_url": jd.apply_url,
            "category": jd.category,
            "posted_at": jd.posted_at,
            "created_at": jd.posted_at or __import__("datetime").datetime.utcnow(),
        }
        jobs_response.append(JobResponse(**job_dict))

    if sort_by == "date":
        jobs_response.sort(key=lambda j: j.posted_at or j.created_at, reverse=True)
    elif sort_by == "salary_high":
        jobs_response.sort(key=lambda j: j.salary_max or 0, reverse=True)
    elif sort_by == "salary_low":
        jobs_response.sort(key=lambda j: j.salary_min or 0)

    if days_ago:
        from datetime import datetime, timedelta
        cutoff = datetime.utcnow() - timedelta(days=days_ago)
        jobs_response = [j for j in jobs_response if j.posted_at and j.posted_at >= cutoff]

    total = len(jobs_response)
    total_pages = max(1, (total + per_page - 1) // per_page)

    return JobSearchResponse(
        jobs=jobs_response,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.get("/{job_id}/match")
async def get_job_match(
    job_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    job = None
    job_data = None
    for provider in get_providers():
        job_data = provider.get_by_id(job_id)
        if job_data:
            break

    if not job_data:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        job_skills = job.required_skills or []
        job_desc = job.description or ""
        job_title = job.title
    else:
        job_skills = job_data.required_skills or []
        job_desc = job_data.description or ""
        job_title = job_data.title

    user_skills = current_user.get("skills", [
        "JavaScript", "React", "TypeScript", "Node.js", "Python",
        "PostgreSQL", "Docker", "AWS", "Git",
    ])
    user_experience = current_user.get("experience", [])
    user_projects = current_user.get("projects", [])
    ats_score = current_user.get("ats_score", None)

    match_result = ai_matching_service.calculate_match(
        job_skills=job_skills,
        job_description=job_desc,
        job_title=job_title,
        user_skills=user_skills,
        user_experience=user_experience,
        user_projects=user_projects,
        ats_score=ats_score,
    )

    return {
        "success": True,
        "data": {
            "job_id": job_id,
            "match_score": match_result.match_score,
            "missing_skills": match_result.missing_skills,
            "matched_skills": match_result.matched_skills,
            "strengths": match_result.strengths,
            "ai_feedback": match_result.ai_feedback,
        },
    }


@router.post("/save/{job_id}")
async def save_job(
    job_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = current_user.get("id")
    existing = db.query(SavedJob).filter(
        SavedJob.user_id == user_id,
        SavedJob.job_id == job_id,
    ).first()

    if existing:
        return {"success": True, "message": "Job already saved", "saved": True}

    saved = SavedJob(user_id=user_id, job_id=job_id)
    db.add(saved)
    db.commit()

    return {"success": True, "message": "Job saved successfully", "saved": True}


@router.delete("/save/{job_id}")
async def unsave_job(
    job_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = current_user.get("id")
    saved = db.query(SavedJob).filter(
        SavedJob.user_id == user_id,
        SavedJob.job_id == job_id,
    ).first()

    if saved:
        db.delete(saved)
        db.commit()

    return {"success": True, "message": "Job unsaved", "saved": False}


@router.get("/saved/list")
async def list_saved_jobs(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = current_user.get("id")
    saved = (
        db.query(SavedJob)
        .filter(SavedJob.user_id == user_id)
        .order_by(desc(SavedJob.saved_at))
        .all()
    )

    result = []
    for s in saved:
        job = db.query(Job).filter(Job.id == s.job_id).first()
        if job:
            result.append({
                "id": s.id,
                "job_id": s.job_id,
                "job": {
                    "id": job.id,
                    "source": job.source,
                    "title": job.title,
                    "company": job.company,
                    "location": job.location,
                    "salary_min": job.salary_min,
                    "salary_max": job.salary_max,
                    "apply_url": job.apply_url,
                },
                "saved_at": s.saved_at.isoformat() if s.saved_at else None,
            })
        else:
            db.delete(s)
            db.commit()

    return {"success": True, "data": result}


@router.get("/recommendations", response_model=JobRecommendationResponse)
async def get_recommendations(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_skills = current_user.get("skills", [
        "JavaScript", "React", "TypeScript", "Python", "Node.js",
    ])

    search_filters = SearchFilters(query="", page=1, per_page=50)
    results = mock_provider.search(search_filters)

    matched = []
    for jd in results.jobs[:30]:
        match = ai_matching_service.calculate_match(
            job_skills=jd.required_skills or [],
            job_description=jd.description or "",
            job_title=jd.title,
            user_skills=user_skills,
            ats_score=80,
        )
        matched.append({
            "job": {
                "id": jd.source_id,
                "source": jd.source,
                "title": jd.title,
                "company": jd.company,
                "location": jd.location,
                "salary_min": jd.salary_min,
                "salary_max": jd.salary_max,
                "salary_currency": jd.salary_currency,
                "description": jd.description,
                "required_skills": jd.required_skills or [],
                "experience_required": jd.experience_required,
                "job_type": jd.job_type,
                "remote_type": jd.remote_type,
                "apply_url": jd.apply_url,
                "posted_at": jd.posted_at,
            },
            "match": {
                "match_score": match.match_score,
                "missing_skills": match.missing_skills,
                "matched_skills": match.matched_skills,
                "strengths": match.strengths,
                "ai_feedback": match.ai_feedback,
            },
        })

    matched.sort(key=lambda m: m["match"]["match_score"], reverse=True)

    trending = sorted(matched, key=lambda m: m["match"]["match_score"] * 0.7 + 30, reverse=True)[:10]
    similar = matched[:10]

    all_job_skills = set()
    for jd in results.jobs:
        for s in (jd.required_skills or []):
            all_job_skills.add(s)

    recommended_skills = [s for s in all_job_skills if s.lower() not in [us.lower() for us in user_skills]][:10]

    return JobRecommendationResponse(
        matched_jobs=[JobWithMatchResponse(**m) for m in matched[:10]],
        trending_jobs=[JobWithMatchResponse(**m) for m in trending],
        similar_jobs=[JobWithMatchResponse(**m) for m in similar],
        recommended_skills=recommended_skills,
    )
