import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from beanie import PydanticObjectId

from backend.app.schemas.automation import (
    AutoApplyRequest, AutoApplyBulkRequest, AutoApplicationResponse,
    CoverLetterGenerateRequest, CoverLetterResponse, CoverLetterUpdate,
    AutomationQueueItem as QueueItemSchema, AutomationAnalytics, QueueStatusResponse,
    AutomationSettings as AutomationSettingsSchema, PipelineStartResponse,
    PlatformAuthRequest, PlatformAuthResponse,
)
from backend.app.models.automation import (
    AutoApplication, CoverLetter, AutomationQueueItem,
    AutomationPipeline, AutomationSettings, AutomationSession,
    ApplicationStatus, AutomationQueueStatus,
)
from backend.app.automation.workers.apply_worker import apply_worker
from backend.app.automation.ai_generation.cover_letter import cover_letter_generator
from backend.app.automation.utils.browser import browser_manager
from backend.app.automation.engine import automation_engine
from backend.app.automation.notifications import automation_notifier
from backend.app.services.semantic_matching_service import semantic_matching_service
from backend.app.services.job_providers.mock_provider import INDIAN_ROLE_TEMPLATES
from backend.app.core.security import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()

# Keep references to background tasks to prevent garbage collection
_background_tasks = set()


@router.post("/apply", response_model=dict)
async def auto_apply(
    payload: AutoApplyRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("id", payload.user_id)
    await AutoApplication(
        user_id=user_id,
        job_id=payload.job_id,
        job_title=payload.job_title,
        company=payload.company,
        platform=payload.platform or "generic",
        job_url=payload.job_url,
        status=ApplicationStatus.PENDING,
        match_score=payload.preferences.get("match_score") if payload.preferences else None,
    ).insert()

    await AutomationQueueItem(
        user_id=user_id,
        job_id=payload.job_id,
        job_title=payload.job_title,
        company=payload.company,
        platform=payload.platform or "generic",
        job_url=payload.job_url,
        meta_data=payload.preferences or {},
    ).insert()

    return {"ok": True, "message": "Application queued"}


@router.post("/apply/bulk", response_model=dict)
async def auto_apply_bulk(
    payload: AutoApplyBulkRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("id", payload.user_id)
    count = 0
    for job in payload.jobs:
        await AutoApplication(
            user_id=user_id,
            job_id=job.get("job_id", ""),
            job_title=job.get("job_title"),
            company=job.get("company"),
            platform=job.get("platform", "generic"),
            job_url=job.get("job_url"),
            match_score=job.get("match_score"),
            status=ApplicationStatus.PENDING,
        ).insert()

        await AutomationQueueItem(
            user_id=user_id,
            job_id=job.get("job_id", ""),
            job_title=job.get("job_title"),
            company=job.get("company"),
            platform=job.get("platform", "generic"),
            job_url=job.get("job_url"),
            meta_data=payload.preferences or {},
        ).insert()
        count += 1

    return {"ok": True, "count": count, "message": f"{count} applications queued"}


@router.get("/applications", response_model=List[AutoApplicationResponse])
async def list_applications(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    apps = await AutoApplication.find(
        AutoApplication.user_id == user_id
    ).sort(-AutoApplication.created_at).to_list()
    return apps


@router.get("/applications/{application_id}", response_model=AutoApplicationResponse)
async def get_application(application_id: str):
    app = await AutoApplication.get(PydanticObjectId(application_id))
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.get("/queue", response_model=List[QueueItemSchema])
async def get_queue(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    items = await AutomationQueueItem.find(
        AutomationQueueItem.user_id == user_id
    ).sort(-AutomationQueueItem.created_at).to_list()
    return items


@router.get("/queue/status", response_model=QueueStatusResponse)
async def get_queue_status():
    queued = await AutomationQueueItem.find(AutomationQueueItem.status == AutomationQueueStatus.QUEUED).count()
    processing = await AutomationQueueItem.find(AutomationQueueItem.status == AutomationQueueStatus.PROCESSING).count()
    completed = await AutomationQueueItem.find(AutomationQueueItem.status == AutomationQueueStatus.COMPLETED).count()
    failed = await AutomationQueueItem.find(AutomationQueueItem.status == AutomationQueueStatus.FAILED).count()
    retrying = await AutomationQueueItem.find(AutomationQueueItem.status == AutomationQueueStatus.RETRYING).count()
    total = await AutomationQueueItem.find_all().count()

    return QueueStatusResponse(
        queued=queued, processing=processing, completed=completed,
        failed=failed, retrying=retrying, total=total,
    )


@router.post("/queue/cancel/{item_id}", response_model=dict)
async def cancel_application(item_id: str):
    item = await AutomationQueueItem.get(PydanticObjectId(item_id))
    if not item:
        raise HTTPException(status_code=404, detail="Queue item not found")
    item.status = AutomationQueueStatus.CANCELLED
    await item.save()
    return {"ok": True, "message": "Application cancelled"}


@router.post("/cover-letter/generate", response_model=CoverLetterResponse)
async def generate_cover_letter(
    payload: CoverLetterGenerateRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("id", payload.user_id)
    content = await cover_letter_generator.generate(
        company=payload.company,
        role=payload.role,
        job_description=payload.job_description,
        tone=payload.tone or "professional",
        skills=payload.skills,
        experience=payload.experience,
    )
    letter = await CoverLetter(
        user_id=user_id,
        company=payload.company,
        role=payload.role,
        content=content,
        tone=payload.tone or "professional",
        ai_generated=True,
    ).insert()
    return letter


@router.get("/cover-letters", response_model=List[CoverLetterResponse])
async def list_cover_letters(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return await CoverLetter.find(
        CoverLetter.user_id == user_id
    ).sort(-CoverLetter.created_at).to_list()


@router.get("/cover-letters/{letter_id}", response_model=CoverLetterResponse)
async def get_cover_letter(letter_id: str):
    letter = await CoverLetter.get(PydanticObjectId(letter_id))
    if not letter:
        raise HTTPException(status_code=404, detail="Cover letter not found")
    return letter


@router.patch("/cover-letters/{letter_id}", response_model=CoverLetterResponse)
async def update_cover_letter(letter_id: str, payload: CoverLetterUpdate):
    letter = await CoverLetter.get(PydanticObjectId(letter_id))
    if not letter:
        raise HTTPException(status_code=404, detail="Cover letter not found")
    if payload.content:
        letter.content = payload.content
    if payload.tone:
        letter.tone = payload.tone
    if payload.is_template is not None:
        letter.is_template = payload.is_template
    await letter.save()
    return letter


@router.get("/analytics", response_model=AutomationAnalytics)
async def get_automation_analytics(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    all_apps = await AutoApplication.find(
        AutoApplication.user_id == user_id
    ).sort(-AutoApplication.created_at).to_list()

    total = len(all_apps)
    submitted = sum(1 for a in all_apps if a.status in (ApplicationStatus.SUBMITTED, ApplicationStatus.INTERVIEW, ApplicationStatus.OFFER))
    failed = sum(1 for a in all_apps if a.status == ApplicationStatus.FAILED)
    pending = sum(1 for a in all_apps if a.status in (ApplicationStatus.PENDING, ApplicationStatus.APPLYING))
    interviews = sum(1 for a in all_apps if a.status == ApplicationStatus.INTERVIEW)
    offers = sum(1 for a in all_apps if a.status == ApplicationStatus.OFFER)
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_count = sum(1 for a in all_apps if a.created_at >= today_start)
    scores = [a.match_score for a in all_apps if a.match_score is not None]
    avg_score = sum(scores) / len(scores) if scores else 0

    platforms = {}
    for a in all_apps:
        p = a.platform or "unknown"
        platforms[p] = platforms.get(p, 0) + 1
    platform_breakdown = [{"platform": p, "count": c} for p, c in platforms.items()]

    daily_map = {}
    for a in all_apps:
        d = a.created_at.date().isoformat()
        daily_map[d] = daily_map.get(d, 0) + 1
    daily_applications = [{"date": d, "count": c} for d, c in sorted(daily_map.items())]

    recent = all_apps[:10]

    return AutomationAnalytics(
        total_applications=total,
        today_applications=today_count,
        success_rate=(submitted / total * 100) if total > 0 else 0,
        failed_count=failed,
        pending_count=pending,
        interview_count=interviews,
        offer_count=offers,
        average_match_score=avg_score,
        daily_applications=daily_applications,
        platform_breakdown=platform_breakdown,
        recent_applications=recent,
    )


@router.get("/settings", response_model=AutomationSettingsSchema)
async def get_automation_settings(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    settings = await AutomationSettings.find_one(AutomationSettings.user_id == user_id)
    if not settings:
        settings = await AutomationSettings(user_id=user_id).insert()
    return settings


@router.post("/settings", response_model=AutomationSettingsSchema)
async def update_automation_settings(
    payload: AutomationSettingsSchema,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("id")
    settings = await AutomationSettings.find_one(AutomationSettings.user_id == user_id)
    if not settings:
        settings = AutomationSettings(user_id=user_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        if field != "user_id":
            setattr(settings, field, value)
    settings.updated_at = datetime.utcnow()
    await settings.save()
    return settings


@router.get("/pipeline/stream")
async def stream_pipeline(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")

    async def event_generator():
        import json
        import asyncio
        while True:
            pipeline = await AutomationPipeline.find(
                AutomationPipeline.user_id == user_id
            ).sort(-AutomationPipeline.created_at).limit(1).first_or_none()

            if pipeline:
                data = {
                    "pipeline_id": str(pipeline.id),
                    "status": pipeline.status,
                    "phase": pipeline.current_phase,
                    "jobs_scanned": pipeline.jobs_scanned,
                    "jobs_matched": pipeline.jobs_matched,
                    "jobs_queued": pipeline.jobs_queued,
                    "error_message": pipeline.error_message,
                }
                yield f"data: {json.dumps(data)}\n\n"

                if pipeline.status in ["completed", "failed", "interrupted"]:
                    break
            else:
                yield f"data: {json.dumps({'status': 'idle', 'phase': ''})}\n\n"
                break

            await asyncio.sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/pipeline/start", response_model=PipelineStartResponse)
async def start_automation_pipeline(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")

    existing = await AutomationPipeline.find_one(
        AutomationPipeline.user_id == user_id,
        AutomationPipeline.status == "running",
    )
    if existing:
        return PipelineStartResponse(
            ok=False,
            message="Pipeline already running",
            pipeline_id=str(existing.id),
        )

    settings = await AutomationSettings.find_one(AutomationSettings.user_id == user_id)
    if not settings:
        settings = await AutomationSettings(user_id=user_id).insert()

    pipeline = await automation_engine.start_pipeline(user_id)

    await automation_notifier.pipeline_started(user_id, str(pipeline.id))

    import asyncio
    task = asyncio.create_task(_run_pipeline(pipeline, settings, user_id))
    _background_tasks.add(task)
    task.add_done_callback(_background_tasks.discard)

    return PipelineStartResponse(
        ok=True,
        message="Automation pipeline started",
        pipeline_id=str(pipeline.id),
    )


async def _run_pipeline(pipeline: AutomationPipeline, settings: AutomationSettings, user_id: str):
    pipeline_id = str(pipeline.id)
    try:
        await automation_engine.update_phase(pipeline_id, phase="initializing")

        # 1. Resume-Based User Understanding
        from backend.app.services.profiler import ai_profiler
        career_profile = await ai_profiler.create_profile(user_id)
        logger.info(f"Loaded AI profile for user {user_id}: {career_profile.get('experience_level')} level, skills: {len(career_profile.get('skills', []))}")

        await automation_engine.update_phase(pipeline_id, phase="searching_jobs")

        import asyncio
        from backend.app.services.job_providers.base import SearchFilters
        from backend.app.services.job_crawler import job_crawler

        # Build search query based on preferred roles or profile target roles
        search_query = " ".join(settings.preferred_roles) if settings.preferred_roles else (career_profile.get("role_preferences") and career_profile.get("role_preferences")[0] or "software engineer")
        location_query = settings.preferred_locations[0] if settings.preferred_locations else None

        filters = SearchFilters(
            query=search_query,
            location=location_query,
            page=1,
            per_page=50,
        )

        # 2. Real Job Search Engine
        all_jobs = await job_crawler.crawl_jobs(filters, settings.platforms or ["linkedin", "naukri", "wellfound", "internshala"])

        await automation_engine.update_phase(
            pipeline_id, phase="matching_jobs", jobs_scanned=len(all_jobs),
        )

        user_skills = career_profile.get("skills", [])
        resume_text = ""
        resume = None
        try:
            from backend.app.models.resume import Resume
            resume = await Resume.find(Resume.user_id == user_id).sort(-Resume.created_at).limit(1).first_or_none()
            if resume:
                resume_text = resume.parsed_text or ""
        except Exception as e:
            logger.warning(f"Could not load resume document text: {e}")

        # 3. Smart Job Filtering
        filtered_jobs = []
        for job in all_jobs:
            # Filter blacklisted companies
            if job.company and any(bc.lower() in job.company.lower() for bc in (settings.excluded_companies or [])):
                logger.info(f"Filtered out blacklisted company job: {job.title} at {job.company}")
                continue

            # Filter remote opening preference
            if settings.remote_only and job.remote_type != "remote":
                logger.info(f"Filtered out non-remote job: {job.title} at {job.company}")
                continue

            # Filter duplicates
            existing = await AutoApplication.find_one(
                AutoApplication.user_id == user_id,
                AutoApplication.job_url == job.apply_url,
            )
            if existing:
                logger.info(f"Filtered out duplicate job application: {job.title} at {job.company}")
                continue

            filtered_jobs.append(job)

        jobs_dict = [
            {
                "id": j.source_id,
                "title": j.title,
                "company": j.company,
                "description": j.description or "",
                "skills": j.required_skills or [],
                "location": j.location or "",
                "salary": f"{j.salary_min}-{j.salary_max}" if j.salary_min else None,
            }
            for j in filtered_jobs if j.required_skills
        ]

        matched_jobs_list = []
        if jobs_dict and resume_text:
            try:
                matched_results = semantic_matching_service.batch_match(
                    resume_text=resume_text,
                    user_skills=user_skills,
                    jobs=jobs_dict,
                    top_k=settings.daily_limit,
                    resume_title=getattr(resume, "job_title", None) if resume else None,
                )
                for mr in matched_results:
                    score = mr["match_score"]
                    if score >= settings.min_match_score:
                        original = next(
                            (j for j in filtered_jobs if j.source_id == mr["job_id"]),
                            None,
                        )
                        if original:
                            matched_jobs_list.append((original, score))
            except Exception as e:
                logger.warning(f"Semantic batch match failed, using simple filter: {e}")

        # Fallback keyword match if semantic is empty or failed
        if not matched_jobs_list:
            for job in filtered_jobs:
                if not job.required_skills:
                    continue
                match_count = sum(
                    1 for s in job.required_skills
                    if any(s.lower() in (us.lower()) for us in user_skills)
                )
                match_pct = (match_count / len(job.required_skills)) * 100 if job.required_skills else 0
                if match_pct >= settings.min_match_score:
                    matched_jobs_list.append((job, match_pct))

        await automation_engine.update_phase(
            pipeline_id, phase="queuing_applications", jobs_matched=len(matched_jobs_list),
        )

        from backend.app.automation.ai_generation.cover_letter import cover_letter_generator
        queue_count = 0
        for job, match_pct in matched_jobs_list[:settings.daily_limit]:
            try:
                await automation_engine.update_phase(pipeline_id, phase="cover_letter_generation")
                cover_letter_content = ""
                if settings.auto_generate_cover_letter:
                    cover_letter_content = await cover_letter_generator.generate(
                        company=job.company or "",
                        role=job.title or "",
                        skills=job.required_skills,
                    )

                cl = None
                if cover_letter_content:
                    cl = await CoverLetter(
                        user_id=user_id,
                        company=job.company or "",
                        role=job.title or "",
                        content=cover_letter_content,
                        ai_generated=True,
                    ).insert()

                platform_used = job.source or "generic"

                app = await AutoApplication(
                    user_id=user_id,
                    job_id=job.source_id,
                    job_title=job.title,
                    company=job.company,
                    platform=platform_used,
                    job_url=job.apply_url or "",
                    status=ApplicationStatus.PENDING,
                    match_score=match_pct,
                    cover_letter_id=str(cl.id) if cl else None,
                ).insert()

                await AutomationQueueItem(
                    user_id=user_id,
                    job_id=job.source_id,
                    job_title=job.title,
                    company=job.company,
                    platform=platform_used,
                    job_url=job.apply_url or "",
                    meta_data={
                        "candidate_name": getattr(resume, "parsed_name", "Candidate"),
                        "skills": job.required_skills,
                        "cover_letter": cover_letter_content,
                        "resume_path": getattr(resume, "file_url", ""),
                    }
                ).insert()
                queue_count += 1

                await automation_notifier.application_submitted(
                    user_id, job.title, job.company or "", str(app.id),
                )
            except Exception as e:
                logger.error(f"Failed to queue job {job.source_id}: {e}")

            if queue_count >= settings.daily_limit:
                break

        await automation_engine.complete_pipeline(
            pipeline_id, jobs_queued=queue_count,
        )

        await automation_notifier.pipeline_completed(
            user_id, pipeline_id,
            jobs_scanned=len(all_jobs),
            jobs_matched=len(matched_jobs_list),
            jobs_queued=queue_count,
        )

        if apply_worker and hasattr(apply_worker, '_running') and not apply_worker._running:
            await apply_worker.start()

    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        await automation_engine.fail_pipeline(pipeline_id, str(e))
        await automation_notifier.pipeline_failed(user_id, pipeline_id, str(e))


@router.get("/pipeline/status", response_model=PipelineStartResponse)
async def get_pipeline_status(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    pipeline = await AutomationPipeline.find(
        AutomationPipeline.user_id == user_id,
    ).sort(-AutomationPipeline.created_at).limit(1).first_or_none()

    if not pipeline:
        return PipelineStartResponse(ok=False, message="No pipeline found", pipeline_id="")

    return PipelineStartResponse(
        ok=pipeline.status == "completed",
        message=pipeline.current_phase or pipeline.status,
        pipeline_id=str(pipeline.id),
        status=pipeline.status,
        jobs_scanned=pipeline.jobs_scanned,
        jobs_matched=pipeline.jobs_matched,
        jobs_queued=pipeline.jobs_queued,
    )


@router.get("/stats", response_model=dict)
async def get_quick_stats(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    today_count = await AutoApplication.find(
        AutoApplication.user_id == user_id,
        AutoApplication.created_at >= today_start,
    ).count()

    total_count = await AutoApplication.find(AutoApplication.user_id == user_id).count()
    failed_count = await AutoApplication.find(
        AutoApplication.user_id == user_id,
        AutoApplication.status == ApplicationStatus.FAILED,
    ).count()

    queue_count = await AutomationQueueItem.find(
        AutomationQueueItem.user_id == user_id,
        AutomationQueueItem.status == AutomationQueueStatus.QUEUED,
    ).count()

    submitted = await AutoApplication.find(
        AutoApplication.user_id == user_id,
        AutoApplication.status == ApplicationStatus.SUBMITTED,
    ).count()

    success_rate = (submitted / total_count * 100) if total_count > 0 else 0

    return {
        "today_applications": today_count,
        "total_applications": total_count,
        "success_rate": round(success_rate, 1),
        "failed_count": failed_count,
        "queue_count": queue_count,
    }


@router.post("/platforms/auth", response_model=PlatformAuthResponse)
async def platform_auth(
    payload: PlatformAuthRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("id")
    platform = payload.platform.lower()

    existing = await AutomationSession.find_one(
        AutomationSession.user_id == user_id,
        AutomationSession.platform == platform,
    )

    if existing:
        existing.session_data = payload.session_data
        existing.cookies = payload.cookies
        existing.is_active = True
        existing.last_used = datetime.utcnow()
        await existing.save()
        session = existing
    else:
        session = await AutomationSession(
            user_id=user_id,
            platform=platform,
            session_data=payload.session_data,
            cookies=payload.cookies,
            is_active=True,
        ).insert()

    await automation_notifier.platform_connected(user_id, platform)
    logger.info(f"Platform auth saved: {platform} for user {user_id}")

    return PlatformAuthResponse(
        ok=True,
        message=f"{platform.capitalize()} authentication saved successfully",
        platform=platform,
        connected=True,
    )


@router.get("/platforms/status", response_model=dict)
async def platform_status(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")

    pipeline = await AutomationPipeline.find(
        AutomationPipeline.user_id == user_id,
    ).sort(-AutomationPipeline.created_at).limit(1).first_or_none()

    pipeline_active = pipeline is not None and pipeline.status == "running"

    platform_connections = {}
    for platform in ["linkedin", "naukri", "wellfound", "internshala", "indeed", "foundit"]:
        session = await AutomationSession.find_one(
            AutomationSession.user_id == user_id,
            AutomationSession.platform == platform,
            AutomationSession.is_active == True,
        )
        if session:
            platform_connections[platform] = {
                "connected": True,
                "status": "connected",
                "last_used": session.last_used.isoformat() if session.last_used else None,
            }
        else:
            platform_connections[platform] = {
                "connected": False,
                "status": "auth_required",
            }

    platform_connections["browser_connected"] = browser_manager._browser is not None
    platform_connections["worker_running"] = getattr(apply_worker, '_running', False)
    platform_connections["pipeline_active"] = pipeline_active

    return platform_connections
