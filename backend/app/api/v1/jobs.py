import logging
from typing import Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query, status
from backend.app.core.security import get_current_user
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
router = APIRouter(tags=["job-search"])

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
    total_before_pagination = 0
    for provider in get_providers():
        try:
            result = provider.search(filters)
            all_jobs.extend(result.jobs)
            total_before_pagination += result.total
        except Exception as e:
            logger.warning(f"Provider {provider.name} search failed: {e}")

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
            "created_at": jd.posted_at or datetime.utcnow(),
        }
        jobs_response.append(JobResponse(**job_dict))

    if sort_by == "date":
        jobs_response.sort(key=lambda j: j.posted_at or j.created_at, reverse=True)
    elif sort_by == "salary_high":
        jobs_response.sort(key=lambda j: j.salary_max or 0, reverse=True)
    elif sort_by == "salary_low":
        jobs_response.sort(key=lambda j: j.salary_min or 0)

    if days_ago:
        cutoff = datetime.utcnow() - timedelta(days=days_ago)
        jobs_response = [j for j in jobs_response if j.posted_at and j.posted_at >= cutoff]

    total = len(jobs_response)
    total_pages = max(1, (total_before_pagination + per_page - 1) // per_page)

    return JobSearchResponse(
        jobs=jobs_response,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.get("/{job_id}")
async def get_job(
    job_id: str,
    current_user: dict = Depends(get_current_user),
):
    job_data = None
    for provider in get_providers():
        job_data = provider.get_by_id(job_id)
        if job_data:
            break

    if not job_data:
        job = await Job.find_one(Job.id == job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        job_dict = {
            "id": str(job.id),
            "source": job.source,
            "title": job.title,
            "company": job.company,
            "company_logo": job.company_logo,
            "location": job.location,
            "salary_min": job.salary_min,
            "salary_max": job.salary_max,
            "salary_currency": job.salary_currency,
            "description": job.description,
            "requirements": job.requirements,
            "required_skills": job.required_skills or [],
            "experience_required": job.experience_required,
            "job_type": job.job_type,
            "remote_type": job.remote_type,
            "apply_url": job.apply_url,
            "category": job.category,
            "posted_at": job.posted_at,
            "created_at": job.created_at,
        }
        return {"success": True, "data": JobResponse(**job_dict)}

    return {"success": True, "data": JobResponse(
        id=job_data.source_id,
        source=job_data.source,
        title=job_data.title,
        company=job_data.company,
        company_logo=job_data.company_logo,
        location=job_data.location,
        salary_min=job_data.salary_min,
        salary_max=job_data.salary_max,
        salary_currency=job_data.salary_currency,
        description=job_data.description,
        requirements=job_data.requirements,
        required_skills=job_data.required_skills or [],
        experience_required=job_data.experience_required,
        job_type=job_data.job_type,
        remote_type=job_data.remote_type,
        apply_url=job_data.apply_url,
        category=job_data.category,
        posted_at=job_data.posted_at,
        created_at=job_data.posted_at or datetime.utcnow(),
    )}


@router.get("/{job_id}/match")
async def get_job_match(
    job_id: str,
    current_user: dict = Depends(get_current_user),
):
    job = None
    job_data = None
    for provider in get_providers():
        job_data = provider.get_by_id(job_id)
        if job_data:
            break

    if not job_data:
        job = await Job.find_one(Job.id == job_id)
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
):
    user_id = current_user.get("id")
    existing = await SavedJob.find_one(SavedJob.user_id == user_id, SavedJob.job_id == job_id)

    if existing:
        return {"success": True, "message": "Job already saved", "saved": True}

    saved = SavedJob(user_id=user_id, job_id=job_id)
    await saved.insert()

    return {"success": True, "message": "Job saved successfully", "saved": True}


@router.delete("/save/{job_id}")
async def unsave_job(
    job_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("id")
    saved = await SavedJob.find_one(SavedJob.user_id == user_id, SavedJob.job_id == job_id)

    if saved:
        await saved.delete()

    return {"success": True, "message": "Job unsaved", "saved": False}


@router.get("/saved/list")
async def list_saved_jobs(
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("id")
    saved = await SavedJob.find(SavedJob.user_id == user_id).sort(-SavedJob.saved_at).to_list()

    result = []
    for s in saved:
        job = await Job.find_one(Job.id == s.job_id)
        if job:
            result.append({
                "id": str(s.id),
                "job_id": s.job_id,
                "job": {
                    "id": str(job.id),
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
            await s.delete()

    return {"success": True, "data": result}


@router.get("/recommendations", response_model=JobRecommendationResponse)
async def get_recommendations(
    current_user: dict = Depends(get_current_user),
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
