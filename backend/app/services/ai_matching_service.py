import logging
import re
from typing import Optional
from backend.app.core.config import settings

logger = logging.getLogger(__name__)


class MatchResult:
    def __init__(self):
        self.match_score: float = 0.0
        self.missing_skills: list[str] = []
        self.matched_skills: list[str] = []
        self.strengths: list[str] = []
        self.ai_feedback: str = ""


class AIMatchingService:
    def __init__(self):
        self.openai_key = settings.OPENAI_API_KEY

    def calculate_match(
        self,
        job_skills: list[str],
        job_description: str,
        job_title: str,
        user_skills: list[str],
        user_experience: list[dict] | None = None,
        user_projects: list[dict] | None = None,
        ats_score: float | None = None,
    ) -> MatchResult:
        result = MatchResult()

        if self.openai_key:
            try:
                return self._match_with_ai(
                    job_skills, job_description, job_title,
                    user_skills, user_experience, user_projects, ats_score,
                )
            except Exception as e:
                logger.warning(f"AI matching failed, using local: {e}")

        return self._match_local(
            job_skills, job_description, job_title,
            user_skills, ats_score,
        )

    def _match_with_ai(
        self, job_skills, job_desc, job_title,
        user_skills, user_exp, user_projects, ats_score,
    ) -> MatchResult:
        import openai
        openai.api_key = self.openai_key

        prompt = f"""You are an expert technical recruiter and career coach. Analyze how well this candidate matches this job.

Job Title: {job_title}
Job Skills Required: {', '.join(job_skills)}
Job Description: {job_desc[:2000]}

Candidate Skills: {', '.join(user_skills)}
Candidate ATS Score: {ats_score or 'N/A'}

Return ONLY valid JSON with this exact structure:
{{
  "match_score": <number 0-100>,
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "ai_feedback": "Short paragraph about the match quality"
}}"""

        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert job matcher. Return only valid JSON."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            max_tokens=1000,
        )

        content = response.choices[0].message.content.strip()
        import json
        if content.startswith("```"):
            content = content.strip("`")
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()

        try:
            data = json.loads(content)
            result = MatchResult()
            result.match_score = min(max(float(data.get("match_score", 0)), 0), 100)
            result.matched_skills = data.get("matched_skills", [])
            result.missing_skills = data.get("missing_skills", [])
            result.strengths = data.get("strengths", [])
            result.ai_feedback = data.get("ai_feedback", "")
            return result
        except json.JSONDecodeError:
            return self._match_local(job_skills, job_desc, job_title, user_skills, ats_score)

    def _match_local(
        self,
        job_skills: list[str],
        job_description: str,
        job_title: str,
        user_skills: list[str],
        ats_score: float | None = None,
    ) -> MatchResult:
        result = MatchResult()

        user_skills_lower = [s.lower().strip() for s in user_skills]
        job_skills_lower = [s.lower().strip() for s in job_skills]

        matched = []
        missing = []
        for js in job_skills_lower:
            if any(js == us or js in us or us in js for us in user_skills_lower):
                matched.append(js)
            else:
                missing.append(js)

        matched_originals = []
        for ms in matched:
            for s in job_skills:
                if s.lower().strip() == ms:
                    matched_originals.append(s)
                    break
            else:
                matched_originals.append(ms)

        missing_originals = []
        for ms in missing:
            for s in job_skills:
                if s.lower().strip() == ms:
                    missing_originals.append(s)
                    break
            else:
                missing_originals.append(ms)

        skill_coverage = len(matched) / max(len(job_skills), 1) * 100

        title_keywords = re.findall(r'\w+', job_title.lower())
        title_overlap = 0
        for tk in title_keywords:
            if any(tk in us or us in tk for us in user_skills_lower):
                title_overlap += 1

        title_score = min(title_overlap / max(len(title_keywords), 1) * 100, 100)

        ats_boost = (ats_score or 50) * 0.15

        base_score = skill_coverage * 0.55 + title_score * 0.20 + ats_boost
        result.match_score = min(max(base_score, 0), 100)

        result.matched_skills = matched_originals
        result.missing_skills = missing_originals

        if result.match_score >= 75:
            result.strengths = [
                f"Strong alignment with required skills ({len(matched)}/{len(job_skills)} matched)",
                f"Solid technical foundation for this role",
                f"Experience profile matches role expectations",
            ]
            result.ai_feedback = f"Great match! Your skills align strongly with this {job_title} role. You have {len(matched)} of {len(job_skills)} key skills."
        elif result.match_score >= 50:
            result.strengths = [
                f"Moderate alignment with required skills ({len(matched)}/{len(job_skills)} matched)",
                f"Transferable skills that can be leveraged",
            ]
            result.ai_feedback = f"Good potential for this {job_title} role. Consider developing {len(missing)} missing skills to strengthen your application."
        else:
            result.strengths = [
                "Some transferable skills identified",
                "Opportunity to pivot with targeted skill development",
            ]
            result.ai_feedback = f"This {job_title} role requires different expertise. However, your existing skills provide a foundation for transitioning with focused upskilling in {', '.join(missing_originals[:3])}."

        return result


ai_matching_service = AIMatchingService()
