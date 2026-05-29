from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID


class EmbeddingRequest(BaseModel):
    text: str
    embedding_type: str
    source_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class EmbeddingResponse(BaseModel):
    vector_id: str
    dimensions: int
    embedding_type: str
    source_id: Optional[str] = None


class MatchRequest(BaseModel):
    resume_id: Optional[UUID] = None
    job_id: Optional[UUID] = None
    resume_text: Optional[str] = None
    job_text: Optional[str] = None


class MatchResult(BaseModel):
    match_score: float
    confidence_score: float
    skill_similarity: float
    experience_alignment: float
    semantic_relevance: float
    industry_fit: float
    matched_skills: List[str]
    missing_skills: List[str]
    recommendation: str
    strengths: List[str]
    weaknesses: List[str]


class SkillGap(BaseModel):
    skill: str
    importance_level: str
    estimated_learning_time: str
    learning_resources: List[str]
    relevance_score: float


class SkillGapAnalysis(BaseModel):
    current_skills: List[str]
    missing_skills: List[SkillGap]
    strengths: List[str]
    weak_areas: List[str]
    overall_readiness: float
    recommended_path: List[str]


class CareerInsightResponse(BaseModel):
    id: UUID
    strengths: List[str]
    weaknesses: List[str]
    missing_skills: List[str]
    recommendations: List[str]
    career_paths: List[Dict[str, Any]]
    ai_summary: str
    confidence_score: float
    created_at: datetime
    updated_at: datetime


class RecommendationItem(BaseModel):
    id: UUID
    recommendation_type: str
    title: str
    content: Optional[str]
    source: Optional[str]
    relevance_score: float
    metadata: Optional[Dict[str, Any]]
    is_read: bool
    created_at: datetime


class RecommendationFeed(BaseModel):
    recommendations: List[RecommendationItem]
    total: int
    has_more: bool


class SemanticSimilarityRequest(BaseModel):
    text_a: str
    text_b: str


class SemanticSimilarityResponse(BaseModel):
    similarity_score: float
    confidence: float


class CareerGoalRequest(BaseModel):
    target_role: str
    target_industry: Optional[str] = None
    experience_level: Optional[str] = None


class CareerRoadmapResponse(BaseModel):
    current_role_readiness: float
    gap_analysis: List[SkillGap]
    recommended_courses: List[Dict[str, Any]]
    certifications: List[str]
    timeline_months: int
    roadmap_steps: List[Dict[str, Any]]


class JobsForMatching(BaseModel):
    job_id: UUID
    title: str
    description: str
    skills: List[str]


class BatchMatchRequest(BaseModel):
    jobs: List[JobsForMatching]
    resume_text: str
    user_skills: List[str]
    top_k: int = 20


class BatchMatchResult(BaseModel):
    matches: List[Dict[str, Any]]
    total_matched: int
    average_score: float
