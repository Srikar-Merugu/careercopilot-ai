import logging
import random
from typing import Optional, List

from backend.app.core.config import settings

logger = logging.getLogger(__name__)


class CoverLetterGenerator:

    def __init__(self):
        self._use_openai = bool(settings.OPENAI_API_KEY)

    async def generate(
        self, company: str, role: str,
        job_description: Optional[str] = None,
        tone: str = "professional",
        skills: Optional[List[str]] = None,
        experience: Optional[str] = None,
    ) -> str:
        if self._use_openai:
            return await self._openai_generate(company, role, job_description, tone, skills, experience)
        return self._mock_generate(company, role, job_description, tone, skills, experience)

    async def _openai_generate(
        self, company: str, role: str,
        job_description: Optional[str], tone: str,
        skills: Optional[List[str]], experience: Optional[str],
    ) -> str:
        try:
            import openai
            openai.api_key = settings.OPENAI_API_KEY
            prompt = (
                f"Write a {tone} cover letter for a {role} position at {company}."
            )
            if job_description:
                prompt += f"\nJob Description: {job_description[:1500]}"
            if skills:
                prompt += f"\nKey Skills: {', '.join(skills)}"
            if experience:
                prompt += f"\nExperience: {experience}"

            response = await openai.ChatCompletion.acreate(
                model=settings.AI_CHAT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a professional cover letter writer. Write concise, impactful cover letters that get interviews."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=800,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI cover letter generation failed: {e}")
            return self._mock_generate(company, role, job_description, tone, skills, experience)

    def _mock_generate(
        self, company: str, role: str,
        job_description: Optional[str] = None,
        tone: str = "professional",
        skills: Optional[List[str]] = None,
        experience: Optional[str] = None,
    ) -> str:
        templates = [
            self._template_standard,
            self._template_concise,
            self._template_impact,
        ]
        template = random.choice(templates)
        return template(company, role, skills)

    def _template_standard(self, company: str, role: str, skills: Optional[List[str]] = None) -> str:
        skill_str = ", ".join(skills[:4]) if skills else "relevant technical and soft skills"
        return f"""Dear Hiring Manager,

I am writing to express my strong interest in the {role} position at {company}. With a proven track record of delivering high-impact results and deep expertise in {skill_str}, I am confident I can make immediate contributions to your team.

Throughout my career, I have focused on building scalable solutions and driving measurable outcomes. My experience aligns closely with the requirements of this role, and I am particularly drawn to {company}'s reputation for innovation and excellence.

I would welcome the opportunity to discuss how my background and skills can contribute to {company}'s continued success. Thank you for your time and consideration.

Best regards,
[Your Name]"""

    def _template_concise(self, company: str, role: str, skills: Optional[List[str]] = None) -> str:
        skill_str = ", ".join(skills[:3]) if skills else "relevant skills"
        return f"""Hi Team at {company},

I'm excited to apply for the {role} position. I bring strong experience in {skill_str}, and I'm confident I can hit the ground running.

{company} is doing incredible work, and I'd love to contribute. I'd appreciate the opportunity to discuss how I can add value to your team.

Thanks for your consideration.

Best,
[Your Name]"""

    def _template_impact(self, company: str, role: str, skills: Optional[List[str]] = None) -> str:
        skill_str = ", ".join(skills[:4]) if skills else "relevant technical skills"
        return f"""Dear {company} Recruiting Team,

I am thrilled to apply for the {role} role. I've been following {company}'s work and am genuinely excited about the opportunity to contribute to your mission.

My expertise in {skill_str} has enabled me to deliver results like:
- Driving measurable improvements in system performance and reliability
- Leading cross-functional initiatives that reduced delivery time by 30%
- Building products used by millions of users

I am eager to bring this experience to {company} and would love to chat about how I can help achieve your goals.

Best regards,
[Your Name]"""

    async def regenerate(self, original: str, feedback: Optional[str] = None) -> str:
        if feedback:
            return f"{original}\n\n[Revised based on feedback: {feedback}]\n\nUpdated version with improvements..."
        return original


cover_letter_generator = CoverLetterGenerator()
