import logging
import re
from typing import List, Optional, Dict, Any, Tuple
from uuid import UUID

from backend.app.core.config import settings
from backend.app.services.embeddings_service import embeddings_service
from backend.app.services.vector_search_service import vector_search_service

logger = logging.getLogger(__name__)

COMMON_SKILLS = [
    "python", "javascript", "typescript", "java", "c++", "go", "rust", "react", "angular", "vue",
    "node.js", "next.js", "fastapi", "flask", "django", "express", "sql", "postgresql", "mongodb",
    "redis", "docker", "kubernetes", "aws", "gcp", "azure", "terraform", "ansible", "git",
    "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch",
    "scikit-learn", "data science", "data analysis", "tableau", "power bi", "excel",
    "communication", "leadership", "team management", "agile", "scrum", "project management",
    "api", "rest", "graphql", "microservices", "system design", "architecture",
    "testing", "ci/cd", "devops", "linux", "bash", "shell scripting",
    "html", "css", "sass", "tailwind", "bootstrap", "mui", "shadcn",
    "redux", "zustand", "react query", "tanstack", "framer motion",
    "swift", "kotlin", "flutter", "react native", "mobile development",
    "blockchain", "solidity", "web3", "smart contracts",
    "cybersecurity", "network security", "penetration testing",
    "product management", "product strategy", "roadmap planning",
    "ui/ux design", "figma", "sketch", "adobe xd", "user research",
    "sap", "oracle", "salesforce", "erp", "crm",
    "ruby", "rails", "php", "laravel", "c#", ".net", "asp.net",
    "elasticsearch", "kibana", "logstash", "datadog", "prometheus",
    "kafka", "rabbitmq", "pulsar", "message queues",
    "grpc", "websocket", "socket.io", "event-driven",
    "oop", "solid", "design patterns", "clean code", "tdd",
    "supabase", "firebase", "appwrite", "backand",
    "openai", "langchain", "llm", "generative ai", "rag",
    "faiss", "chromadb", "pinecone", "vector database",
    "pandas", "numpy", "matplotlib", "seaborn", "plotly"
]

INDUSTRY_KEYWORDS = {
    "fintech": ["finance", "banking", "payment", "trading", "blockchain", "crypto", "risk"],
    "healthtech": ["healthcare", "medical", "biotech", "pharma", "clinical", "health"],
    "edtech": ["education", "learning", "course", "student", "academic", "teaching"],
    "ecommerce": ["retail", "shop", "product", "inventory", "cart", "checkout", "marketplace"],
    "saas": ["subscription", "multi-tenant", "cloud", "billing", "tenant"],
    "ai-ml": ["machine learning", "deep learning", "nlp", "computer vision", "neural", "llm"],
    "cybersecurity": ["security", "threat", "vulnerability", "encryption", "compliance"],
    "gaming": ["game", "unity", "unreal", "player", "multiplayer", "gaming"]
}

MAX_MOCK_MATCHES = 500


class SemanticMatchResult:
    def __init__(
        self,
        match_score: float,
        confidence_score: float,
        skill_similarity: float,
        experience_alignment: float,
        semantic_relevance: float,
        industry_fit: float,
        matched_skills: List[str],
        missing_skills: List[str],
        recommendation: str = "",
        strengths: Optional[List[str]] = None,
        weaknesses: Optional[List[str]] = None
    ):
        self.match_score = match_score
        self.confidence_score = confidence_score
        self.skill_similarity = skill_similarity
        self.experience_alignment = experience_alignment
        self.semantic_relevance = semantic_relevance
        self.industry_fit = industry_fit
        self.matched_skills = matched_skills
        self.missing_skills = missing_skills
        self.recommendation = recommendation
        self.strengths = strengths or []
        self.weaknesses = weaknesses or []


class SemanticMatchingService:
    def __init__(self):
        self._embedding_cache: Dict[str, List[float]] = {}

    def match_resume_to_job(
        self,
        resume_text: str,
        job_text: str,
        resume_skills: Optional[List[str]] = None,
        job_skills: Optional[List[str]] = None,
        resume_title: Optional[str] = None,
        job_title: Optional[str] = None
    ) -> SemanticMatchResult:
        skills_resume = resume_skills or self._extract_skills(resume_text)
        skills_job = job_skills or self._extract_skills(job_text)

        matched_skills, missing_skills = self._compare_skills(skills_resume, skills_job)

        skill_similarity = self._calculate_skill_overlap(skills_resume, skills_job)
        title_similarity = self._calculate_title_similarity(resume_title, job_title)
        industry_fit = self._calculate_industry_fit(resume_text, job_text)

        semantic_relevance = self._calculate_semantic_similarity(resume_text, job_text)

        experience_alignment = self._calculate_experience_alignment(resume_text, job_text)

        weights = {
            "skill_similarity": 0.35,
            "semantic_relevance": 0.25,
            "title_similarity": 0.15,
            "experience_alignment": 0.15,
            "industry_fit": 0.10
        }

        match_score = (
            weights["skill_similarity"] * skill_similarity +
            weights["semantic_relevance"] * semantic_relevance +
            weights["title_similarity"] * title_similarity +
            weights["experience_alignment"] * experience_alignment +
            weights["industry_fit"] * industry_fit
        ) * 100

        match_score = max(0, min(100, match_score))

        has_real_skills = bool(resume_skills) or bool(
            s for s in COMMON_SKILLS if s.lower() in resume_text.lower()
        )
        ai_available = bool(settings.OPENAI_API_KEY)
        confidence_base = 0.6 if has_real_skills else 0.3
        confidence_boost = 0.3 if ai_available else 0.0
        confidence_score = min(1.0, confidence_base + confidence_boost)

        strengths = self._identify_strengths(skills_resume, matched_skills)
        weaknesses = self._identify_weaknesses(missing_skills)

        recommendation = self._generate_recommendation(match_score, matched_skills, missing_skills, job_title)

        return SemanticMatchResult(
            match_score=round(match_score, 1),
            confidence_score=round(confidence_score, 2),
            skill_similarity=round(skill_similarity * 100, 1),
            experience_alignment=round(experience_alignment * 100, 1),
            semantic_relevance=round(semantic_relevance * 100, 1),
            industry_fit=round(industry_fit * 100, 1),
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            recommendation=recommendation,
            strengths=strengths,
            weaknesses=weaknesses
        )

    def batch_match(
        self,
        resume_text: str,
        user_skills: List[str],
        jobs: List[Dict[str, Any]],
        top_k: int = 20,
        resume_title: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        results = []
        for job in jobs[:MAX_MOCK_MATCHES]:
            try:
                match = self.match_resume_to_job(
                    resume_text=resume_text,
                    job_text=job.get("description", ""),
                    resume_skills=user_skills,
                    job_skills=job.get("skills", []),
                    resume_title=resume_title,
                    job_title=job.get("title", "")
                )
                results.append({
                    "job_id": str(job.get("id", "")),
                    "title": job.get("title", ""),
                    "company": job.get("company", ""),
                    "location": job.get("location", ""),
                    "salary": job.get("salary"),
                    "match_score": match.match_score,
                    "confidence_score": match.confidence_score,
                    "skill_similarity": match.skill_similarity,
                    "experience_alignment": match.experience_alignment,
                    "semantic_relevance": match.semantic_relevance,
                    "industry_fit": match.industry_fit,
                    "matched_skills": match.matched_skills,
                    "missing_skills": match.missing_skills,
                    "strengths": match.strengths,
                    "weaknesses": match.weaknesses,
                    "recommendation": match.recommendation
                })
            except Exception as e:
                logger.error(f"Match error for job {job.get('id')}: {e}")
                continue

        results.sort(key=lambda x: x["match_score"], reverse=True)
        return results[:top_k]

    def _extract_skills(self, text: str) -> List[str]:
        if not text:
            return []
        text_lower = text.lower()
        found = []
        for skill in COMMON_SKILLS:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found.append(skill)
        return list(set(found))

    def _compare_skills(self, resume_skills: List[str], job_skills: List[str]) -> Tuple[List[str], List[str]]:
        if not job_skills:
            return [], []
        resume_set = set(s.lower() for s in resume_skills)
        job_set = set(s.lower() for s in job_skills)
        matched = [s for s in job_skills if s.lower() in resume_set]
        missing = [s for s in job_skills if s.lower() not in resume_set]
        return matched, missing

    def _calculate_skill_overlap(self, skills_a: List[str], skills_b: List[str]) -> float:
        if not skills_a or not skills_b:
            return 0.0
        set_a = set(s.lower() for s in skills_a)
        set_b = set(s.lower() for s in skills_b)
        if not set_b:
            return 0.0
        intersection = set_a & set_b
        jaccard = len(intersection) / len(set_b)
        return min(1.0, jaccard)

    def _calculate_title_similarity(self, title_a: Optional[str], title_b: Optional[str]) -> float:
        if not title_a or not title_b:
            return 0.5
        a_words = set(title_a.lower().split())
        b_words = set(title_b.lower().split())
        if not a_words or not b_words:
            return 0.5
        intersection = a_words & b_words
        union = a_words | b_words
        return len(intersection) / len(union) if union else 0.5

    def _calculate_industry_fit(self, resume_text: str, job_text: str) -> float:
        if not resume_text or not job_text:
            return 0.5
        resume_lower = resume_text.lower()
        job_lower = job_text.lower()
        max_score = 0.0
        for industry, keywords in INDUSTRY_KEYWORDS.items():
            resume_score = sum(1 for kw in keywords if kw in resume_lower) / len(keywords)
            job_score = sum(1 for kw in keywords if kw in job_lower) / len(keywords)
            if resume_score > 0 and job_score > 0:
                score = (resume_score + job_score) / 2
                max_score = max(max_score, score)
        return max(max_score, 0.5)

    def _calculate_semantic_similarity(self, text_a: str, text_b: str) -> float:
        try:
            emb_a = embeddings_service.generate_embedding(text_a[:2000])
            emb_b = embeddings_service.generate_embedding(text_b[:2000])
            import numpy as np
            a = np.array(emb_a)
            b = np.array(emb_b)
            norm_a = np.linalg.norm(a)
            norm_b = np.linalg.norm(b)
            if norm_a == 0 or norm_b == 0:
                return 0.5
            similarity = float(np.dot(a, b) / (norm_a * norm_b))
            return max(0.0, min(1.0, (similarity + 1) / 2))
        except Exception as e:
            logger.error(f"Semantic similarity error: {e}")
            return 0.5

    def _calculate_experience_alignment(self, resume_text: str, job_text: str) -> float:
        year_pattern = r'(\d+)\+?\s*(?:years?|yrs?)'
        resume_years = re.findall(year_pattern, resume_text.lower())
        job_years = re.findall(year_pattern, job_text.lower())

        if not resume_years and not job_years:
            return 0.7

        if not resume_years:
            return 0.4

        resume_exp = max(int(y) for y in resume_years) if resume_years else 0

        if job_years:
            job_exp = max(int(y) for y in job_years)
            if resume_exp >= job_exp:
                return 1.0
            elif resume_exp >= job_exp * 0.7:
                return 0.8
            elif resume_exp >= job_exp * 0.5:
                return 0.6
            else:
                return 0.3
        return 0.7

    def _identify_strengths(self, skills: List[str], matched_skills: List[str]) -> List[str]:
        strengths = []
        if matched_skills:
            strengths.append(f"Strong match in {len(matched_skills)} key skill areas")
        if len(skills) >= 10:
            strengths.append("Broad and diverse technical skill set")
        if any(s in ["machine learning", "deep learning", "nlp"] for s in skills):
            strengths.append("Advanced AI/ML capabilities")
        if any(s in ["leadership", "project management", "team management"] for s in skills):
            strengths.append("Strong leadership and management background")
        if any(s in ["docker", "kubernetes", "aws", "gcp"] for s in skills):
            strengths.append("Cloud-native and DevOps expertise")
        if not strengths:
            strengths.append("Foundational skills in relevant technologies")
        return strengths

    def _identify_weaknesses(self, missing_skills: List[str]) -> List[str]:
        weaknesses = []
        for skill in missing_skills[:5]:
            weaknesses.append(f"Missing: {skill}")
        if len(missing_skills) > 5:
            weaknesses.append(f"Gap in {len(missing_skills)} required skill areas")
        if not weaknesses:
            weaknesses.append("No significant skill gaps detected")
        return weaknesses

    def _generate_recommendation(
        self,
        match_score: float,
        matched_skills: List[str],
        missing_skills: List[str],
        job_title: Optional[str]
    ) -> str:
        if match_score >= 85:
            return f"Excellent fit! Your profile strongly aligns with this {'role' if not job_title else job_title}. Consider applying immediately."
        elif match_score >= 70:
            tips = []
            if missing_skills:
                tips.append(f"Consider acquiring {', '.join(missing_skills[:3])}")
            base = f"Strong match for {'this role' if not job_title else job_title}. "
            if tips:
                base += "To improve: " + "; ".join(tips) + "."
            return base
        elif match_score >= 50:
            return f"Moderate match. Your profile has some relevant skills but {'missing ' + ', '.join(missing_skills[:4]) if missing_skills else 'could benefit from additional experience'}."
        else:
            return f"This role may not be the best fit based on your current profile. Consider focusing on roles that better align with your skills in {', '.join(matched_skills[:4]) if matched_skills else 'your area'}."


semantic_matching_service = SemanticMatchingService()
