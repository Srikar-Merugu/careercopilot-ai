import json
import logging
from typing import Optional
from backend.app.core.config import settings

logger = logging.getLogger(__name__)


class AIAnalysisResult:
    def __init__(self):
        self.skills: list[str] = []
        self.experience: list[dict] = []
        self.projects: list[dict] = []
        self.education: list[dict] = []
        self.certifications: list[str] = []
        self.achievements: list[str] = []
        self.ats_score: float = 0.0
        self.ats_breakdown: dict = {}
        self.strengths: list[str] = []
        self.weaknesses: list[str] = []
        self.missing_skills: list[str] = []
        self.recommended_roles: list[dict] = []
        self.career_suggestions: str = ""
        self.optimization_tips: list[str] = []
        self.ai_feedback: str = ""


class AIAnalyzerService:
    def __init__(self):
        self.openai_key = settings.OPENAI_API_KEY
        self.openrouter_key = settings.OPENROUTER_API_KEY
        self.use_ai = bool(self.openai_key or self.openrouter_key)

    def _build_prompt(self, resume_text: str) -> str:
        return f"""You are a world-class senior technical recruiter and AI career coach. Analyze the following resume and return a JSON object with exactly this structure. Be thorough, insightful, and specific.

Resume Text:
```
{resume_text[:15000]}
```

Return valid JSON only (no markdown, no code fences):
{{
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {{"title": "Job Title", "company": "Company Name", "duration": "Time Period", "description": "Brief summary"}}
  ],
  "projects": [
    {{"name": "Project Name", "description": "Brief description", "technologies": ["tech1", "tech2"]}}
  ],
  "education": [
    {{"degree": "Degree Name", "institution": "Institution Name", "year": "Year"}}
  ],
  "certifications": ["cert1", "cert2"],
  "achievements": ["achievement1", "achievement2"],
  "ats_score": <number 0-100>,
  "ats_breakdown": {{
    "keyword_optimization": <number 0-100>,
    "formatting": <number 0-100>,
    "role_relevance": <number 0-100>,
    "skill_coverage": <number 0-100>,
    "readability": <number 0-100>,
    "project_quality": <number 0-100>
  }},
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "missing_skills": ["missing_skill1", "missing_skill2", ...],
  "recommended_roles": [
    {{"title": "Role Name", "match_percentage": <number 0-100>, "reason": "Why this role fits"}}
  ],
  "career_suggestions": "Detailed career path suggestion paragraph...",
  "optimization_tips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "ai_feedback": "Overall assessment of the resume quality and potential..."
}}"""

    def analyze(self, resume_text: str) -> AIAnalysisResult:
        result = AIAnalysisResult()

        if self.use_ai and self.openai_key:
            try:
                return self._analyze_with_openai(resume_text)
            except Exception as e:
                logger.error(f"OpenAI analysis failed: {str(e)}")
        elif self.use_ai and self.openrouter_key:
            try:
                return self._analyze_with_openrouter(resume_text)
            except Exception as e:
                logger.error(f"OpenRouter analysis failed: {str(e)}")

        return self._analyze_mock(resume_text)

    def _analyze_with_openai(self, resume_text: str) -> AIAnalysisResult:
        import openai
        openai.api_key = self.openai_key
        prompt = self._build_prompt(resume_text)

        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert resume analyst and career coach. Return only valid JSON."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=4000,
        )

        content = response.choices[0].message.content.strip()
        return self._parse_ai_response(content)

    def _analyze_with_openrouter(self, resume_text: str) -> AIAnalysisResult:
        import openai
        openai.api_key = self.openrouter_key
        openai.base_url = "https://openrouter.ai/api/v1"

        prompt = self._build_prompt(resume_text)
        response = openai.chat.completions.create(
            model="openai/gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert resume analyst and career coach. Return only valid JSON."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=4000,
        )

        content = response.choices[0].message.content.strip()
        return self._parse_ai_response(content)

    def _parse_ai_response(self, content: str) -> AIAnalysisResult:
        result = AIAnalysisResult()
        if content.startswith("```"):
            content = content.strip("`")
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()

        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            logger.error("AI response is not valid JSON, using mock analysis")
            return self._analyze_mock("")

        result.skills = data.get("skills", [])
        result.experience = data.get("experience", [])
        result.projects = data.get("projects", [])
        result.education = data.get("education", [])
        result.certifications = data.get("certifications", [])
        result.achievements = data.get("achievements", [])
        result.ats_score = min(max(float(data.get("ats_score", 0)), 0), 100)
        result.ats_breakdown = data.get("ats_breakdown", {})
        result.strengths = data.get("strengths", [])
        result.weaknesses = data.get("weaknesses", [])
        result.missing_skills = data.get("missing_skills", [])
        result.recommended_roles = data.get("recommended_roles", [])
        result.career_suggestions = data.get("career_suggestions", "")
        result.optimization_tips = data.get("optimization_tips", [])
        result.ai_feedback = data.get("ai_feedback", "")

        return result

    def _analyze_mock(self, resume_text: str = "") -> AIAnalysisResult:
        result = AIAnalysisResult()

        result.skills = [
            "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
            "Python", "FastAPI", "PostgreSQL", "Docker", "AWS",
            "Git", "CI/CD", "REST APIs", "GraphQL", "TailwindCSS"
        ] if not resume_text else self._extract_skills_simple(resume_text)

        result.experience = [
            {"title": "Senior Software Engineer", "company": "Tech Corp", "duration": "2021-Present", "description": "Led full-stack development of cloud-native applications serving 100K+ users."},
            {"title": "Software Engineer", "company": "StartupXYZ", "duration": "2019-2021", "description": "Built and deployed microservices architecture reducing latency by 40%."},
            {"title": "Junior Developer", "company": "WebAgency", "duration": "2017-2019", "description": "Developed responsive web applications using React and Node.js."},
        ]

        result.projects = [
            {"name": "AI-Powered Analytics Dashboard", "description": "Real-time analytics platform with ML-driven insights", "technologies": ["React", "Python", "TensorFlow"]},
            {"name": "E-Commerce Microservices", "description": "Scalable e-commerce backend with 12 microservices", "technologies": ["Node.js", "Docker", "Kubernetes"]},
            {"name": "DevOps Automation Suite", "description": "CI/CD pipeline automation reducing deployment time by 60%", "technologies": ["GitHub Actions", "Terraform", "AWS"]},
        ]

        result.education = [
            {"degree": "B.S. Computer Science", "institution": "University of Technology", "year": "2017"},
        ]

        result.certifications = ["AWS Certified Solutions Architect", "Google Cloud Professional"]
        result.achievements = ["Led team to win internal hackathon 2023", "Published technical article with 50K+ views"]

        result.ats_score = 78.5
        result.ats_breakdown = {
            "keyword_optimization": 72.0,
            "formatting": 85.0,
            "role_relevance": 80.0,
            "skill_coverage": 75.0,
            "readability": 82.0,
            "project_quality": 70.0,
        }

        result.strengths = [
            "Strong full-stack development experience with modern frameworks",
            "Cloud-native architecture expertise with AWS and Docker",
            "Proven track record of leading technical projects",
            "Excellent combination of frontend and backend skills",
        ]

        result.weaknesses = [
            "Missing quantifiable metrics in some role descriptions",
            "Limited open-source contributions visible",
            "Could strengthen system design knowledge documentation",
        ]

        result.missing_skills = [
            "Kubernetes", "Redis", "GraphQL", "Machine Learning", "System Design"
        ]

        result.recommended_roles = [
            {"title": "Full Stack Developer", "match_percentage": 92, "reason": "Strong alignment with React, Node.js, and cloud experience"},
            {"title": "Senior Frontend Engineer", "match_percentage": 85, "reason": "Deep React/TypeScript expertise with UI/UX sensibility"},
            {"title": "DevOps Engineer", "match_percentage": 72, "reason": "CI/CD and Docker proficiency with cloud deployment skills"},
            {"title": "Backend Engineer", "match_percentage": 78, "reason": "Solid Node.js and Python backend development background"},
            {"title": "AI Engineer", "match_percentage": 65, "reason": "Python foundation suitable for transitioning into AI/ML"},
        ]

        result.career_suggestions = (
            "Based on your strong full-stack foundation, consider specializing in cloud-native architecture or AI engineering. "
            "Your experience with React, Node.js, and Python positions you well for a staff engineering role. "
            "To accelerate growth, focus on deepening your system design knowledge and contributing to open-source projects. "
            "Learning Kubernetes and machine learning fundamentals would open senior architect or AI engineering paths."
        )

        result.optimization_tips = [
            "Add quantifiable metrics to each role (e.g., 'Improved performance by 40%')",
            "Include a professional summary section at the top",
            "List specific technologies with proficiency levels",
            "Add links to GitHub, portfolio, and LinkedIn profiles",
            "Tailor your resume keywords to match target job descriptions",
        ]

        result.ai_feedback = (
            "This resume demonstrates solid technical competency with modern web technologies. "
            "The ATS score of 78/100 indicates good optimization, with room for improvement in keyword coverage and project descriptions. "
            "Adding more measurable outcomes and domain-specific certifications would significantly strengthen the profile."
        )

        return result

    @staticmethod
    def _extract_skills_simple(text: str) -> list[str]:
        common_skills = [
            "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#",
            "React", "Angular", "Vue", "Next.js", "Node.js", "Django", "Flask", "FastAPI",
            "Spring", "PostgreSQL", "MongoDB", "Redis", "MySQL", "Docker", "Kubernetes",
            "AWS", "GCP", "Azure", "CI/CD", "Git", "GraphQL", "REST", "TailwindCSS",
            "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "NLP",
            "HTML", "CSS", "SASS", "Redux", "Zustand", "Framer Motion",
        ]
        found = []
        text_lower = text.lower()
        for skill in common_skills:
            if skill.lower() in text_lower:
                found.append(skill)
        return found if found else [
            "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
            "Python", "FastAPI", "PostgreSQL", "Docker", "AWS",
        ]


ai_analyzer = AIAnalyzerService()
