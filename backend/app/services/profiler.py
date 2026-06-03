import logging
from typing import Dict, Any, Optional
from backend.app.models.resume import ResumeAnalysis
from backend.app.services.embeddings_service import embeddings_service

logger = logging.getLogger(__name__)

class AIProfiler:
    async def create_profile(self, user_id: str, analysis: Optional[ResumeAnalysis] = None) -> Dict[str, Any]:
        if not analysis:
            from backend.app.models.resume import Resume
            resumes = await Resume.find(Resume.user_id == user_id).sort(-Resume.created_at).to_list()
            for r in resumes:
                analysis = await ResumeAnalysis.find_one(ResumeAnalysis.resume_id == str(r.id))
                if analysis:
                    break

        if not analysis:
            return {
                "skills": [],
                "role_preferences": [],
                "experience_level": "mid",
                "salary_expectation": "",
                "preferred_locations": [],
                "semantic_embedding": {},
                "target_roles": []
            }

        # Extrapolate experience level based on experience text
        experience_texts = []
        for exp in (analysis.parsed_experience or []):
            if isinstance(exp, dict):
                experience_texts.append(f"{exp.get('title', '')} {exp.get('description', '')}")
            else:
                experience_texts.append(str(exp))
        experience_text = " ".join(experience_texts)

        experience_level = "mid"
        if any(keyword in experience_text.lower() for keyword in ["senior", "lead", "architect", "manager", "director", "sr.", "principal"]):
            experience_level = "senior"
        elif any(keyword in experience_text.lower() for keyword in ["junior", "jr.", "intern", "associate", "entry"]):
            experience_level = "junior"

        skills = analysis.parsed_skills or []
        target_roles = analysis.recommended_roles or []
        
        role_preferences = []
        for r in target_roles:
            if isinstance(r, dict) and "title" in r:
                role_preferences.append(r["title"])
            else:
                role_preferences.append(str(r))

        profile_text = f"Skills: {', '.join(skills)}. Target roles: {', '.join(role_preferences)}. Suggestions: {analysis.career_suggestions or ''}"
        try:
            embedding = embeddings_service.generate_embedding(profile_text[:2000])
        except Exception as e:
            logger.warning(f"Failed to generate embedding for AI profile: {e}")
            embedding = []

        return {
            "skills": skills,
            "role_preferences": role_preferences,
            "experience_level": experience_level,
            "salary_expectation": "",
            "preferred_locations": [],
            "semantic_embedding": {"vector": embedding},
            "target_roles": role_preferences
        }

ai_profiler = AIProfiler()
