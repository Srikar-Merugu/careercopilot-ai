import logging
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Body

from backend.app.schemas.ai import (
    EmbeddingRequest, EmbeddingResponse,
    MatchRequest, MatchResult,
    SkillGapAnalysis,
    CareerInsightResponse,
    RecommendationFeed,
    SemanticSimilarityRequest, SemanticSimilarityResponse,
    CareerRoadmapResponse,
    BatchMatchRequest, BatchMatchResult,
)
from backend.app.services.embeddings_service import embeddings_service
from backend.app.services.vector_search_service import vector_search_service
from backend.app.services.semantic_matching_service import semantic_matching_service
from backend.app.services.career_analysis_service import career_analysis_service
from backend.app.services.recommendations_service import recommendations_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/embeddings/generate", response_model=List[EmbeddingResponse])
async def generate_embeddings(requests: List[EmbeddingRequest]):
    try:
        texts = [r.text for r in requests]
        vectors = embeddings_service.generate_embeddings(texts)

        responses = []
        for i, req in enumerate(requests):
            vector_id = f"vec_{req.embedding_type}_{hash(req.text) % 1000000}"
            responses.append(EmbeddingResponse(
                vector_id=vector_id,
                dimensions=embeddings_service.dimensions,
                embedding_type=req.embedding_type,
                source_id=req.source_id,
            ))

        for i, req in enumerate(requests):
            vector_search_service.add_vectors(
                vectors=[vectors[i]],
                ids=[f"{req.embedding_type}_{req.source_id or 'anon'}_{i}"],
                metadata_list=[{
                    "embedding_type": req.embedding_type,
                    "source_id": req.source_id,
                    "text_preview": req.text[:100],
                    "_vector": vectors[i],
                }]
            )

        return responses
    except Exception as e:
        logger.error(f"Embedding generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Embedding generation failed: {str(e)}")


@router.post("/match/semantic", response_model=MatchResult)
async def semantic_match(request: MatchRequest):
    try:
        resume_text = request.resume_text or ""
        job_text = request.job_text or ""

        if not resume_text or not job_text:
            raise HTTPException(status_code=400, detail="Both resume_text and job_text are required")

        result = semantic_matching_service.match_resume_to_job(
            resume_text=resume_text,
            job_text=job_text,
        )

        return MatchResult(
            match_score=result.match_score,
            confidence_score=result.confidence_score,
            skill_similarity=result.skill_similarity,
            experience_alignment=result.experience_alignment,
            semantic_relevance=result.semantic_relevance,
            industry_fit=result.industry_fit,
            matched_skills=result.matched_skills,
            missing_skills=result.missing_skills,
            recommendation=result.recommendation,
            strengths=result.strengths,
            weaknesses=result.weaknesses,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Semantic match failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Semantic matching failed: {str(e)}")


@router.post("/match/batch", response_model=BatchMatchResult)
async def batch_match(request: BatchMatchRequest):
    try:
        jobs_data = [
            {
                "id": str(j.job_id),
                "title": j.title,
                "description": j.description,
                "skills": j.skills,
            }
            for j in request.jobs
        ]

        results = semantic_matching_service.batch_match(
            resume_text=request.resume_text,
            user_skills=request.user_skills,
            jobs=jobs_data,
            top_k=request.top_k,
        )

        if not results:
            return BatchMatchResult(matches=[], total_matched=0, average_score=0.0)

        avg_score = sum(r["match_score"] for r in results) / len(results)

        return BatchMatchResult(
            matches=results,
            total_matched=len(results),
            average_score=round(avg_score, 1),
        )
    except Exception as e:
        logger.error(f"Batch match failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch matching failed: {str(e)}")


@router.post("/similarity", response_model=SemanticSimilarityResponse)
async def calculate_similarity(request: SemanticSimilarityRequest):
    try:
        emb_a = embeddings_service.generate_embedding(request.text_a[:2000])
        emb_b = embeddings_service.generate_embedding(request.text_b[:2000])

        import numpy as np
        a = np.array(emb_a)
        b = np.array(emb_b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)

        if norm_a == 0 or norm_b == 0:
            similarity = 0.5
        else:
            similarity = float(np.dot(a, b) / (norm_a * norm_b))
            similarity = max(0.0, min(1.0, (similarity + 1) / 2))

        return SemanticSimilarityResponse(
            similarity_score=round(similarity * 100, 1),
            confidence=round(0.85 if embeddings_service.provider != "mock" else 0.5, 2),
        )
    except Exception as e:
        logger.error(f"Similarity calculation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Similarity calculation failed: {str(e)}")


@router.post("/career/insights", response_model=CareerInsightResponse)
async def analyze_career(
    skills: List[str] = Body(...),
    experience: str = Body(""),
    education: str = Body(""),
):
    try:
        analysis = career_analysis_service.analyze_career_profile(
            skills=skills,
            experience=experience,
            education=education,
        )

        return CareerInsightResponse(
            id=UUID(int=0),
            strengths=analysis["strengths"],
            weaknesses=analysis["weaknesses"],
            missing_skills=[m["skill"] for m in analysis["missing_skills"]],
            recommendations=analysis["recommendations"],
            career_paths=analysis["career_paths"],
            ai_summary=analysis["ai_summary"],
            confidence_score=analysis["confidence_score"],
            created_at=None,
            updated_at=None,
        )
    except Exception as e:
        logger.error(f"Career analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Career analysis failed: {str(e)}")


@router.post("/career/skill-gap", response_model=SkillGapAnalysis)
async def analyze_skill_gap(
    current_skills: List[str] = Body(...),
    target_role: str = Body(...),
):
    try:
        analysis = career_analysis_service.skill_gap_analysis(
            current_skills=current_skills,
            target_role=target_role,
        )
        return SkillGapAnalysis(**analysis)
    except Exception as e:
        logger.error(f"Skill gap analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Skill gap analysis failed: {str(e)}")


@router.post("/career/roadmap", response_model=CareerRoadmapResponse)
async def generate_roadmap(
    skills: List[str] = Body(...),
    target_role: str = Body(...),
    target_industry: Optional[str] = Body(None),
    experience_level: Optional[str] = Body(None),
):
    try:
        roadmap = career_analysis_service.generate_career_roadmap(
            skills=skills,
            target_role=target_role,
            target_industry=target_industry,
            experience_level=experience_level,
        )
        return CareerRoadmapResponse(**roadmap)
    except Exception as e:
        logger.error(f"Roadmap generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Roadmap generation failed: {str(e)}")


@router.post("/recommendations", response_model=RecommendationFeed)
async def get_recommendations(
    user_id: str = Body(..., embed=True),
    skills: Optional[List[str]] = Body(None),
    search_history: Optional[List[str]] = Body(None),
    saved_jobs: Optional[List[dict]] = Body(None),
    resume_text: Optional[str] = Body(None),
    limit: int = Query(20, ge=1, le=50),
):
    try:
        result = recommendations_service.generate_recommendations(
            user_id=user_id,
            skills=skills,
            search_history=search_history,
            saved_jobs=saved_jobs,
            resume_text=resume_text,
            limit=limit,
        )
        return RecommendationFeed(**result)
    except Exception as e:
        logger.error(f"Recommendation generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Recommendation generation failed: {str(e)}")


@router.get("/trending/skills")
async def get_trending_skills():
    try:
        skills = recommendations_service.get_trending_skills()
        return {"skills": skills, "total": len(skills)}
    except Exception as e:
        logger.error(f"Trending skills fetch failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Trending skills fetch failed: {str(e)}")


@router.get("/vector-search")
async def vector_search(
    query: str = Query(...),
    k: int = Query(10, ge=1, le=100),
    filter_type: Optional[str] = Query(None),
):
    try:
        query_vector = embeddings_service.generate_embedding(query)
        results = vector_search_service.search(
            query_vector=query_vector,
            k=k,
            filter_type=filter_type,
        )
        return {
            "results": [
                {
                    "id": r.id,
                    "score": r.score,
                    "metadata": r.metadata,
                }
                for r in results
            ],
            "total": len(results),
        }
    except Exception as e:
        logger.error(f"Vector search failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Vector search failed: {str(e)}")
