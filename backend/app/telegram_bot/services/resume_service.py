import logging
import random
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)


class TelegramResumeService:

    def __init__(self):
        self._resumes: dict = {}

    async def process_resume(self, user_id: str, file_name: str, file_content: bytes) -> Dict[str, Any]:
        file_ext = file_name.split(".")[-1].lower() if "." in file_name else ""
        if file_ext not in ("pdf", "docx", "doc"):
            return {"error": "Unsupported format. Please upload a PDF or DOCX file."}

        if len(file_content) > 10 * 1024 * 1024:
            return {"error": "File too large. Maximum size is 10MB."}

        analysis = await self._analyze_resume(user_id, file_name)
        self._resumes[user_id] = analysis
        return analysis

    async def _analyze_resume(self, user_id: str, file_name: str) -> Dict[str, Any]:
        candidates = [
            {
                "ats_score": random.randint(65, 92),
                "strengths": random.sample([
                    "Strong technical background in full-stack development",
                    "Clear career progression with increasing responsibility",
                    "Excellent use of metrics and quantifiable achievements",
                    "Relevant certifications and continuous learning demonstrated",
                    "Well-structured and ATS-optimized formatting",
                ], k=random.randint(2, 3)),
                "missing_skills": random.sample([
                    "Docker", "Kubernetes", "TypeScript", "AWS", "GraphQL",
                    "CI/CD Pipelines", "Terraform", "System Design",
                ], k=random.randint(1, 3)),
                "recommended_roles": random.sample([
                    "Senior Frontend Engineer", "Full Stack Developer",
                    "Technical Lead", "Solutions Architect", "DevOps Engineer",
                ], k=random.randint(2, 3)),
                "improvement_tips": [
                    "Add a professional summary at the top",
                    "Quantify achievements with specific metrics",
                    "Include relevant keywords from target job descriptions",
                    "List technical skills in a dedicated section",
                    "Remove outdated technologies (e.g., jQuery, Flash)",
                ],
                "file_name": file_name,
                "word_count": random.randint(400, 800),
                "readability_score": round(random.uniform(7.0, 9.5), 1),
            }
            for _ in range(1)
        ][0]
        return analysis

    def get_analysis(self, user_id: str) -> Optional[Dict[str, Any]]:
        return self._resumes.get(user_id)

    def has_resume(self, user_id: str) -> bool:
        return user_id in self._resumes


telegram_resume_service = TelegramResumeService()
