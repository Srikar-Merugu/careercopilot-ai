import json
import logging
import re
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

        if resume_text:
            result.skills = self._extract_skills_simple(resume_text)
        else:
            result.skills = [
                "JavaScript", "TypeScript", "React", "Node.js",
                "Python", "PostgreSQL", "Docker", "AWS",
                "Git", "CI/CD", "REST APIs",
            ]

        result.experience = self._extract_experience_simple(resume_text)
        if not result.experience:
            result.experience = []

        result.projects = self._extract_projects_simple(resume_text)
        if not result.projects:
            result.projects = []

        result.education = self._extract_education_simple(resume_text)
        if not result.education:
            result.education = []

        result.certifications = self._extract_certifications_simple(resume_text)
        if not result.certifications:
            result.certifications = []

        result.achievements = self._extract_achievements_simple(resume_text)
        if not result.achievements:
            result.achievements = []

        skill_count = len(result.skills)
        has_experience = len(result.experience) > 0
        has_projects = len(result.projects) > 0
        has_education = len(result.education) > 0

        base_score = 50.0
        skill_score = min(skill_count * 3.0, 25.0)
        exp_score = 10.0 if has_experience else 0.0
        proj_score = 8.0 if has_projects else 0.0
        edu_score = 7.0 if has_education else 0.0
        result.ats_score = round(min(base_score + skill_score + exp_score + proj_score + edu_score, 100.0), 1)

        result.ats_breakdown = {
            "keyword_optimization": round(min(skill_count * 5, 90), 1),
            "formatting": 70.0,
            "role_relevance": round(min(50 + skill_count * 2, 90), 1),
            "skill_coverage": round(min(skill_count * 4, 85), 1),
            "readability": 75.0,
            "project_quality": 65.0,
        }

        result.strengths = self._generate_strengths(result.skills, result.experience)
        result.weaknesses = self._generate_weaknesses(result.skills, result.experience)

        result.missing_skills = self._detect_missing_skills(result.skills)
        result.recommended_roles = self._generate_recommended_roles(result.skills, result.experience)

        exp_years = self._estimate_experience_years(result.experience, resume_text)
        career_path = result.recommended_roles[0]["title"] if result.recommended_roles else "Software Engineer"
        result.career_suggestions = (
            f"Based on your profile with {skill_count} identified skills and "
            f"{'over ' + str(exp_years) + ' years of experience' if exp_years else 'emerging experience'}, "
            f"you are well-positioned for {career_path} roles. "
            f"To accelerate growth, focus on filling the {len(result.missing_skills)} market gaps identified below. "
            f"Strengthening your profile in these areas could significantly increase your interview conversion rate."
        )

        result.optimization_tips = self._generate_optimization_tips(result.skills, result.weaknesses)

        top_strength = result.strengths[0] if result.strengths else "technical expertise"
        top_gap = result.missing_skills[0] if result.missing_skills else "advanced technologies"
        result.ai_feedback = (
            f"Your resume shows {top_strength.lower()}. "
            f"With an ATS score of {result.ats_score}/100, there is opportunity to improve keyword coverage "
            f"and add more quantifiable achievements. Developing {top_gap} would significantly strengthen your profile. "
            f"Consider restructuring experience sections to highlight measurable outcomes."
        )

        return result

    @staticmethod
    def _extract_experience_simple(text: str) -> list[dict]:
        if not text:
            return []
        experiences = []
        lines = text.split("\n")
        current_entry = {}

        for line in lines:
            line = line.strip()
            if not line:
                continue

            title_patterns = [
                r'(senior|lead|principal|staff|junior|associate|intern)\s+\w+\s+(engineer|developer|architect|manager|analyst|designer)',
                r'\w+\s+(engineer|developer|architect|manager)',
                r'\w+\s+intern',
            ]
            for pattern in title_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match and not current_entry.get("title"):
                    current_entry["title"] = match.group(0).title()
                    company_match = re.search(r'(?:at|@|//)\s+([A-Z][A-Za-z0-9\s.]+)', line)
                    if company_match:
                        current_entry["company"] = company_match.group(1).strip()
                    break

            if re.search(r'\d{4}\s*[-–to]+\s*\d{4}|present|current', line, re.IGNORECASE):
                current_entry["duration"] = line.strip()
                if current_entry.get("title"):
                    current_entry["description"] = line.strip()
                    experiences.append(current_entry)
                    current_entry = {}

        if current_entry.get("title") and current_entry not in experiences:
            experiences.append(current_entry)

        return experiences[:6]

    @staticmethod
    def _extract_projects_simple(text: str) -> list[dict]:
        if not text:
            return []
        projects = []
        in_project_section = False
        current_project = {}

        for line in text.split("\n"):
            line = line.strip()
            if not line:
                continue
            if re.search(r'project|portfolio|work\s+sample', line, re.IGNORECASE) and not in_project_section:
                in_project_section = True
                continue
            if in_project_section and re.search(r'education|certification|skill', line, re.IGNORECASE):
                break
            if in_project_section:
                tech_match = re.findall(r'(React|Node|Python|Docker|AWS|TypeScript|JavaScript|Go|Rust|Kubernetes|TensorFlow|PyTorch)', line, re.IGNORECASE)
                if tech_match:
                    if current_project:
                        current_project["technologies"] = list(set(current_project.get("technologies", []) + tech_match))
                    current_project["name"] = line[:60]
                    projects.append(current_project)
                    current_project = {"technologies": tech_match}

        return projects[:4]

    @staticmethod
    def _extract_education_simple(text: str) -> list[dict]:
        if not text:
            return []
        education = []
        for line in text.split("\n"):
            line = line.strip()
            degree_match = re.search(r'(B\.?S\.?|M\.?S\.?|B\.?Tech|M\.?Tech|PhD|Bachelor|Master|Doctorate|Bachelors|Masters)\s*(?:of|in|\.)?\s*(\w+(?:\s+\w+)?)', line, re.IGNORECASE)
            if degree_match:
                edu_entry = {"degree": line.strip(), "institution": "", "year": ""}
                inst_match = re.search(r'(?:at|,|–|-)\s*([A-Z][A-Za-z\s.]+(?:University|College|Institute|School|IIT|NIT))', line)
                if inst_match:
                    edu_entry["institution"] = inst_match.group(1).strip()
                year_match = re.search(r'(19|20)\d{2}', line)
                if year_match:
                    edu_entry["year"] = year_match.group(0)
                education.append(edu_entry)
        return education[:2]

    @staticmethod
    def _extract_certifications_simple(text: str) -> list[str]:
        if not text:
            return []
        certs = []
        for line in text.split("\n"):
            line = line.strip()
            if not line:
                continue
            if re.search(r'(certified|certification|certificate|AWS\s*Certified|Google\s*Cloud|Azure\s*|PMP|CKA|CKAD|SCJP|OCP)', line, re.IGNORECASE):
                certs.append(line[:100])
        return certs[:4]

    @staticmethod
    def _extract_achievements_simple(text: str) -> list[str]:
        if not text:
            return []
        achievements = []
        for line in text.split("\n"):
            line = line.strip()
            if not line:
                continue
            if re.search(r'(achieved|increased|decreased|reduced|improved|led|managed|delivered|launched|%|\$|award|win|patent|published)', line, re.IGNORECASE):
                if len(line) > 20:
                    achievements.append(line[:120])
        return achievements[:4]

    @staticmethod
    def _generate_strengths(skills: list[str], experience: list[dict]) -> list[str]:
        strengths = []
        skill_set = set(s.lower() for s in skills)

        has_frontend = any(s in skill_set for s in ["react", "vue", "angular", "next.js", "html", "css", "typescript"])
        has_backend = any(s in skill_set for s in ["python", "node.js", "java", "go", "rust", "fastapi", "django", "flask"])
        has_devops = any(s in skill_set for s in ["docker", "kubernetes", "aws", "gcp", "azure", "terraform", "ci/cd"])
        has_data = any(s in skill_set for s in ["machine learning", "deep learning", "tensorflow", "pytorch", "sql", "python"])
        has_db = any(s in skill_set for s in ["sql", "postgresql", "mongodb", "redis", "mysql"])

        if has_frontend:
            strengths.append(f"Frontend development expertise with {len(skills)} modern technologies")
        if has_backend:
            strengths.append("Backend engineering capabilities across multiple languages")
        if has_devops:
            strengths.append("Cloud infrastructure and DevOps automation skills")
        if has_data:
            strengths.append("Data-driven development and analytical capabilities")
        if has_db:
            strengths.append("Database design and data management proficiency")
        if experience:
            strengths.append(f"Professional experience at {len(experience)} organizations")
        if len(skills) >= 8:
            strengths.append("Broad technical skill set across the full stack")

        if not strengths:
            strengths.append("Technical foundation with active skill development")

        return strengths[:5]

    @staticmethod
    def _generate_weaknesses(skills: list[str], experience: list[dict]) -> list[str]:
        weaknesses = []
        skill_set = set(s.lower() for s in skills)

        if not any(s in skill_set for s in ["docker", "kubernetes", "aws", "gcp"]):
            weaknesses.append("Cloud infrastructure experience could be expanded")
        if not any(s in skill_set for s in ["testing", "ci/cd", "devops"]):
            weaknesses.append("DevOps and CI/CD pipeline knowledge needs development")
        if not any(s in skill_set for s in ["system design", "architecture", "microservices"]):
            weaknesses.append("System design skills would benefit from more documented experience")
        if not any(s in skill_set for s in ["machine learning", "ai", "data science", "nlp"]):
            weaknesses.append("AI/ML capabilities not represented in current skill set")
        if not any(s in skill_set for s in ["leadership", "management", "mentoring"]):
            weaknesses.append("Leadership and team management experience not clearly shown")
        if len(skills) < 5:
            weaknesses.append("Limited technology diversity - consider expanding your tech stack")

        if not weaknesses:
            weaknesses.append("Profile appears well-rounded. Focus on deepening expertise in specialized areas.")

        return weaknesses[:4]

    @staticmethod
    def _detect_missing_skills(skills: list[str]) -> list[str]:
        skill_set = set(s.lower() for s in skills)
        market_skills = [
            "Kubernetes", "TypeScript", "AWS", "System Design",
            "Docker", "GraphQL", "Redis", "Machine Learning",
            "CI/CD", "Terraform", "Python", "React",
            "Microservices", "API Design", "Testing",
        ]
        missing = []
        for ms in market_skills:
            if ms.lower() not in skill_set:
                missing.append(ms)
            if len(missing) >= 8:
                break
        return missing if missing else ["Cloud-native architecture", "AI/ML integration"]

    @staticmethod
    def _generate_recommended_roles(skills: list[str], experience: list[dict]) -> list[dict]:
        skill_set = set(s.lower() for s in skills)
        roles = []

        role_defs = [
            ("Full Stack Developer", ["react", "node.js", "python", "typescript", "javascript", "html", "css", "postgresql", "mongodb"], 92),
            ("Frontend Engineer", ["react", "vue", "angular", "typescript", "javascript", "html", "css", "next.js"], 90),
            ("Backend Engineer", ["python", "node.js", "java", "go", "rust", "postgresql", "mongodb", "redis", "fastapi", "django"], 88),
            ("DevOps Engineer", ["docker", "kubernetes", "aws", "gcp", "terraform", "ci/cd", "linux", "python"], 85),
            ("Data Engineer", ["python", "sql", "postgresql", "mongodb", "spark", "kafka", "airflow", "aws"], 82),
            ("ML Engineer", ["python", "machine learning", "tensorflow", "pytorch", "nlp", "sql", "docker"], 80),
        ]

        for title, req_skills, base_match in role_defs:
            matched = sum(1 for s in req_skills if s in skill_set)
            pct = min(int((matched / len(req_skills)) * 100) + 5, 98)
            if matched > 0:
                roles.append({"title": title, "match_percentage": pct, "reason": f"{matched}/{len(req_skills)} skill match"})

        roles.sort(key=lambda x: x["match_percentage"], reverse=True)
        return roles[:5] if roles else [{"title": "Software Engineer", "match_percentage": 75, "reason": "General technical skills alignment"}]

    @staticmethod
    def _estimate_experience_years(experience: list[dict], resume_text: str) -> int:
        total_years = 0
        for exp in experience:
            duration = exp.get("duration", "")
            nums = re.findall(r'\d{4}', duration)
            if len(nums) >= 2:
                try:
                    total_years += int(nums[-1]) - int(nums[0])
                except (ValueError, IndexError):
                    pass
            elif re.search(r'\d+\+?\s*years?', duration, re.IGNORECASE):
                year_match = re.search(r'(\d+)', duration)
                if year_match:
                    total_years += int(year_match.group(1))

        if total_years == 0 and resume_text:
            year_matches = re.findall(r'(\d+)\+?\s*years?', resume_text, re.IGNORECASE)
            if year_matches:
                total_years = max(int(y) for y in year_matches)

        return max(total_years, 1)

    @staticmethod
    def _generate_optimization_tips(skills: list[str], weaknesses: list[str]) -> list[str]:
        tips = [
            "Add quantifiable metrics to each role (e.g., 'Improved performance by 40%')",
            "Include a professional summary section at the top of your resume",
            "List specific technology versions and proficiency levels",
            "Add links to GitHub, portfolio, and professional profiles",
        ]
        for w in weaknesses:
            if "cloud" in w.lower():
                tips.append("Obtain cloud certifications (AWS, Azure, GCP)")
            elif "devops" in w.lower() or "ci/cd" in w.lower():
                tips.append("Document CI/CD pipeline implementations with specific tools")
            elif "system design" in w.lower():
                tips.append("Add architecture diagrams or system design projects")
            elif "ai" in w.lower() or "ml" in w.lower():
                tips.append("Complete an AI/ML certification and add relevant projects")
            elif "leadership" in w.lower():
                tips.append("Highlight mentoring, team leadership, and cross-functional collaboration")

        return tips[:6]

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
