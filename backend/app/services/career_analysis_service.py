import logging
import re
from typing import List, Optional, Dict, Any, Tuple
from uuid import UUID

from backend.app.core.config import settings
from backend.app.services.embeddings_service import embeddings_service

logger = logging.getLogger(__name__)

INDUSTRY_ROLES = {
    "frontend": ["frontend developer", "frontend engineer", "ui developer", "react developer", "vue developer", "angular developer"],
    "backend": ["backend developer", "backend engineer", "api developer", "server engineer", "database engineer"],
    "fullstack": ["fullstack developer", "fullstack engineer", "full stack developer", "full stack engineer", "software engineer"],
    "devops": ["devops engineer", "site reliability engineer", "platform engineer", "cloud engineer"],
    "data": ["data scientist", "data engineer", "data analyst", "ml engineer", "ai engineer"],
    "mobile": ["mobile developer", "ios developer", "android developer", "react native developer"],
    "security": ["security engineer", "cybersecurity analyst", "security architect"],
    "product": ["product manager", "product owner", "technical product manager"],
    "design": ["ux designer", "ui designer", "product designer", "graphic designer"],
    "management": ["engineering manager", "tech lead", "cto", "vp engineering"],
}

LEARNING_RESOURCES = {
    "aws": ["AWS Certified Solutions Architect", "A Cloud Guru", "AWS docs"],
    "docker": ["Docker Deep Dive by Nigel Poulton", "Docker docs", "Play with Docker"],
    "kubernetes": ["CKA Certification", "Kubernetes in Action", "Kube Academy"],
    "python": ["Python Crash Course", "Real Python", "LeetCode Python"],
    "machine learning": ["Andrew Ng ML Course", "Fast.ai", "Hands-On ML"],
    "deep learning": ["Deep Learning Specialization", "Fast.ai Deep Learning", "d2l.ai"],
    "react": ["React Docs Beta", "Epic React by Kent C. Dodds", "React TypeScript Cheatsheet"],
    "typescript": ["TypeScript Handbook", "TypeScript Deep Dive", "Total TypeScript"],
    "node.js": ["Node.js Design Patterns", "The Node.js Master Class", "Node.js docs"],
    "sql": ["SQL for Data Analysis", "LeetCode SQL", "PostgreSQL docs"],
    "mongodb": ["MongoDB University", "Mongoose docs", "MongoDB docs"],
    "graphql": ["How to GraphQL", "Apollo GraphQL docs", "GraphQL by Example"],
    "system design": ["Grokking System Design", "System Design Interview", "DDIA"],
    "testing": ["Testing JavaScript by Kent C. Dodds", "Clean Code in Python", "Testing Python"],
    "ci/cd": ["Jenkins docs", "GitHub Actions docs", "GitLab CI docs"],
    "docker": ["Docker docs", "Docker Deep Dive", "Play with Docker"],
    "kubernetes": ["Kubernetes docs", "Kubernetes in Action", "CKAD Prep"],
    "terraform": ["Terraform docs", "Terraform Up & Running", "HashiCorp Learn"],
    "linux": ["Linux Journey", "Linux Academy", "The Linux Command Line"],
    "git": ["Pro Git Book", "GitHub Skills", "Learn Git Branching"],
}

ESTIMATED_LEARNING_TIME = {
    "beginner": "2-4 weeks",
    "intermediate": "4-8 weeks",
    "advanced": "8-16 weeks",
}

SKILL_IMPORTANCE = {
    "python": "critical",
    "javascript": "critical",
    "typescript": "high",
    "react": "high",
    "sql": "critical",
    "docker": "high",
    "kubernetes": "high",
    "aws": "high",
    "machine learning": "medium",
    "system design": "high",
    "testing": "medium",
    "git": "critical",
    "linux": "high",
    "api": "high",
    "ci/cd": "medium",
}


class CareerAnalysisService:
    def __init__(self):
        self._analysis_cache: Dict[str, Any] = {}

    def analyze_career_profile(self, skills: List[str], experience: str, education: str) -> Dict[str, Any]:
        skill_set = set(s.lower() for s in skills)
        all_skills = [s.lower() for s in skills]

        mapped_roles = self._map_roles(all_skills)
        role_readiness = self._calculate_role_readiness(all_skills, mapped_roles)
        strengths = self._analyze_strengths(all_skills)
        weaknesses = self._analyze_weaknesses(all_skills)
        career_paths = self._generate_career_paths(all_skills, experience)
        missing_skills = self._detect_market_gaps(all_skills)
        recommendations = self._generate_career_recommendations(all_skills, strengths, weaknesses)

        confidence = self._calculate_confidence(all_skills)

        return {
            "strengths": strengths,
            "weaknesses": weaknesses,
            "missing_skills": missing_skills,
            "recommendations": recommendations,
            "career_paths": career_paths,
            "role_readiness": role_readiness,
            "confidence_score": confidence,
            "ai_summary": self._generate_summary(strengths, career_paths, recommendations)
        }

    def skill_gap_analysis(self, current_skills: List[str], target_role: str) -> Dict[str, Any]:
        current_set = set(s.lower() for s in current_skills)

        role_skills = self._get_skills_for_role(target_role)

        missing = [s for s in role_skills if s.lower() not in current_set]

        gap_items = []
        for skill in missing:
            importance = SKILL_IMPORTANCE.get(skill.lower(), "medium")
            learning_time = self._estimate_learning_time(skill, current_skills)
            resources = LEARNING_RESOURCES.get(skill.lower(), [f"Learn {skill} online"])
            gap_items.append({
                "skill": skill,
                "importance_level": importance,
                "estimated_learning_time": learning_time,
                "learning_resources": resources,
                "relevance_score": self._calculate_skill_relevance(skill, target_role)
            })

        gap_items.sort(key=lambda x: {"critical": 0, "high": 1, "medium": 2, "low": 3}.get(x["importance_level"], 3))

        match_count = len([s for s in role_skills if s.lower() in current_set])
        total_count = len(role_skills)
        readiness = (match_count / total_count * 100) if total_count > 0 else 0

        recommended_path = []
        for item in gap_items[:5]:
            recommended_path.append(f"Learn {item['skill']} ({item['estimated_learning_time']})")

        if not recommended_path:
            recommended_path.append(f"Your skillset is well-aligned for {target_role} roles")

        strengths = [s for s in current_skills if s.lower() in role_skills]
        weak_areas = [s for s in current_skills if s.lower() not in role_skills]

        return {
            "current_skills": current_skills,
            "missing_skills": gap_items,
            "strengths": strengths if strengths else current_skills,
            "weak_areas": weak_areas,
            "overall_readiness": round(readiness, 1),
            "recommended_path": recommended_path
        }

    def generate_career_roadmap(self, skills: List[str], target_role: str, target_industry: Optional[str] = None, experience_level: Optional[str] = None) -> Dict[str, Any]:
        gap_analysis = self.skill_gap_analysis(skills, target_role)
        role_skills = self._get_skills_for_role(target_role)

        current_set = set(s.lower() for s in skills)
        match_count = len([s for s in role_skills if s.lower() in current_set])
        total_count = len(role_skills)
        readiness = (match_count / total_count * 100) if total_count > 0 else 0

        timeline = self._estimate_timeline(gap_analysis["missing_skills"], experience_level)

        certifications = self._get_certifications(gap_analysis["missing_skills"])

        courses = []
        for item in gap_analysis["missing_skills"][:6]:
            resources = item.get("learning_resources", [f"Learn {item['skill']}"])
            for r in resources[:2]:
                courses.append({
                    "skill": item["skill"],
                    "name": r,
                    "duration": item["estimated_learning_time"],
                    "importance": item["importance_level"]
                })

        roadmap_steps = []
        month = 0
        for item in gap_analysis["missing_skills"][:8]:
            month += 1
            roadmap_steps.append({
                "month": month,
                "focus": f"Master {item['skill']}",
                "action": f"Study {item['skill']} through {', '.join(item['learning_resources'][:2])}",
                "duration": item["estimated_learning_time"],
                "importance": item["importance_level"]
            })

        return {
            "current_role_readiness": round(readiness, 1),
            "gap_analysis": gap_analysis["missing_skills"],
            "recommended_courses": courses,
            "certifications": certifications,
            "timeline_months": timeline,
            "roadmap_steps": roadmap_steps
        }

    def _map_roles(self, skills: List[str]) -> List[Dict[str, Any]]:
        skill_set = set(skills)
        mapped = []
        for category, roles in INDUSTRY_ROLES.items():
            score = 0
            for role in roles:
                role_words = set(role.split())
                overlap = len(skill_set & role_words)
                if overlap > 0:
                    score += overlap
            if score > 0:
                mapped.append({"category": category, "score": score, "roles": roles})
        mapped.sort(key=lambda x: x["score"], reverse=True)
        return mapped

    def _calculate_role_readiness(self, skills: List[str], mapped_roles: List[Dict[str, Any]]) -> Dict[str, float]:
        readiness = {}
        for role in mapped_roles[:5]:
            role_name = role["category"]
            total_role_skills = len(self._get_skills_for_role(role_name))
            if total_role_skills > 0:
                match = len([s for s in skills if s.lower() in [rs.lower() for rs in self._get_skills_for_role(role_name)]])
                readiness[role_name] = round((match / total_role_skills) * 100, 1)
            else:
                readiness[role_name] = 0
        return readiness

    def _analyze_strengths(self, skills: List[str]) -> List[str]:
        strengths = []
        skill_set = set(skills)

        if any(s in skill_set for s in ["python", "javascript", "typescript"]):
            strengths.append("Strong programming fundamentals across multiple languages")

        if any(s in skill_set for s in ["react", "vue", "angular", "next.js"]):
            strengths.append("Modern frontend framework expertise")

        if any(s in skill_set for s in ["docker", "kubernetes", "aws", "gcp", "terraform"]):
            strengths.append("Cloud infrastructure and DevOps capabilities")

        if any(s in skill_set for s in ["machine learning", "deep learning", "nlp", "tensorflow", "pytorch"]):
            strengths.append("AI and machine learning engineering skills")

        if any(s in skill_set for s in ["sql", "mongodb", "redis", "postgresql"]):
            strengths.append("Database design and data management proficiency")

        if any(s in skill_set for s in ["leadership", "project management", "product management"]):
            strengths.append("Strategic leadership and product thinking")

        if not strengths:
            strengths.append("Foundational technical skills with growth potential")

        return strengths

    def _analyze_weaknesses(self, skills: List[str]) -> List[str]:
        weaknesses = []
        skill_set = set(skills)

        if not any(s in skill_set for s in ["docker", "kubernetes", "aws", "gcp"]):
            weaknesses.append("Limited cloud infrastructure experience")
        if not any(s in skill_set for s in ["testing", "ci/cd", "devops"]):
            weaknesses.append("Missing DevOps and CI/CD pipeline knowledge")
        if not any(s in skill_set for s in ["system design", "architecture", "microservices"]):
            weaknesses.append("System design and architecture skills need development")
        if not any(s in skill_set for s in ["machine learning", "ai", "data science"]):
            weaknesses.append("AI/ML capabilities could strengthen your profile")
        if not any(s in skill_set for s in ["communication", "leadership", "product management"]):
            weaknesses.append("Soft skills and leadership experience not clearly represented")

        return weaknesses

    def _detect_market_gaps(self, skills: List[str]) -> List[Dict[str, Any]]:
        skill_set = set(s.lower() for s in skills)
        gaps = []

        trending_skills = [
            ("generative ai", "critical", "4-8 weeks", "Growing demand across all tech roles"),
            ("langchain", "high", "4-6 weeks", "Key framework for LLM applications"),
            ("vector databases", "medium", "2-4 weeks", "Emerging technology for AI search"),
            ("kubernetes", "high", "8-12 weeks", "Standard for container orchestration"),
            ("typescript", "critical", "4-6 weeks", "Industry standard for web development"),
            ("aws", "high", "8-16 weeks", "Dominant cloud platform"),
            ("system design", "high", "8-12 weeks", "Critical for senior roles"),
            ("ci/cd", "medium", "2-4 weeks", "Essential for modern development"),
            ("graphql", "medium", "2-4 weeks", "Modern API technology"),
            ("react native", "medium", "4-8 weeks", "Cross-platform mobile development"),
        ]

        for skill, importance, time, reason in trending_skills:
            if skill not in skill_set:
                gaps.append({
                    "skill": skill,
                    "importance_level": importance,
                    "estimated_learning_time": time,
                    "reason": reason,
                    "learning_resources": LEARNING_RESOURCES.get(skill, [f"Learn {skill}"])
                })

        return gaps[:8]

    def _generate_career_paths(self, skills: List[str], experience: str) -> List[Dict[str, Any]]:
        skill_set = set(skills)
        paths = []
        exp_years = 0
        year_match = re.search(r'(\d+)', experience)
        if year_match:
            exp_years = int(year_match.group(1))

        if any(s in skill_set for s in ["react", "vue", "angular", "javascript", "typescript", "html", "css"]):
            if exp_years >= 5:
                paths.append({"role": "Lead Frontend Engineer", "match": 90, "growth": "Engineering Manager / Director of Engineering"})
                paths.append({"role": "Staff Frontend Engineer", "match": 85, "growth": "Principal Architect"})
            elif exp_years >= 3:
                paths.append({"role": "Senior Frontend Engineer", "match": 88, "growth": "Lead Frontend Engineer"})
                paths.append({"role": "Full Stack Developer", "match": 75, "growth": "Senior Full Stack"})
            else:
                paths.append({"role": "Frontend Engineer", "match": 92, "growth": "Senior Frontend"})
                paths.append({"role": "JavaScript Developer", "match": 85, "growth": "Full Stack"})

        if any(s in skill_set for s in ["python", "fastapi", "flask", "django", "sql", "postgresql"]):
            if exp_years >= 5:
                paths.append({"role": "Staff Backend Engineer", "match": 87, "growth": "Principal Engineer / Architect"})
                paths.append({"role": "Backend Tech Lead", "match": 82, "growth": "Engineering Manager"})
            elif exp_years >= 3:
                paths.append({"role": "Senior Backend Engineer", "match": 85, "growth": "Staff Backend Engineer"})
                paths.append({"role": "Python Developer", "match": 90, "growth": "Senior Python Developer"})
            else:
                paths.append({"role": "Backend Engineer", "match": 88, "growth": "Senior Backend"})
                paths.append({"role": "API Developer", "match": 80, "growth": "Backend Engineer"})

        if any(s in skill_set for s in ["machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "data science"]):
            if exp_years >= 4:
                paths.append({"role": "Senior ML Engineer", "match": 85, "growth": "ML Architect / AI Director"})
                paths.append({"role": "AI Research Engineer", "match": 75, "growth": "Principal AI Scientist"})
            else:
                paths.append({"role": "Machine Learning Engineer", "match": 88, "growth": "Senior ML Engineer"})
                paths.append({"role": "Data Scientist", "match": 82, "growth": "Senior Data Scientist"})

        if any(s in skill_set for s in ["docker", "kubernetes", "aws", "gcp", "terraform", "ci/cd"]):
            if exp_years >= 4:
                paths.append({"role": "Senior DevOps Engineer", "match": 86, "growth": "Platform Engineering Lead"})
                paths.append({"role": "Cloud Architect", "match": 78, "growth": "Principal Cloud Architect"})
            else:
                paths.append({"role": "DevOps Engineer", "match": 90, "growth": "Senior DevOps"})
                paths.append({"role": "Cloud Engineer", "match": 82, "growth": "Cloud Architect"})

        if any(s in skill_set for s in ["leadership", "product management", "project management", "agile", "scrum"]):
            paths.append({"role": "Technical Product Manager", "match": 80, "growth": "Director of Product"})
            paths.append({"role": "Engineering Manager", "match": 75, "growth": "VP of Engineering"})

        if not paths:
            paths.append({"role": "Junior Developer", "match": 85, "growth": "Mid-Level Developer"})
            paths.append({"role": "Software Engineer", "match": 80, "growth": "Senior Software Engineer"})

        return paths[:6]

    def _generate_career_recommendations(self, skills: List[str], strengths: List[str], weaknesses: List[str]) -> List[str]:
        recommendations = []
        skill_set = set(skills)

        if not any(s in skill_set for s in ["system design", "architecture", "microservices"]):
            recommendations.append("Take a System Design course to prepare for senior-level interviews")

        if not any(s in skill_set for s in ["docker", "kubernetes", "aws"]):
            recommendations.append("Learn cloud-native technologies (Docker, Kubernetes, AWS) to increase marketability")

        if not any(s in skill_set for s in ["testing", "tdd", "ci/cd"]):
            recommendations.append("Implement testing practices and CI/CD pipelines in your projects")

        if any(s in skill_set for s in ["react", "vue", "angular"]) and "typescript" not in skill_set:
            recommendations.append("Migrate to TypeScript to align with industry standards")

        if not any(s in skill_set for s in ["machine learning", "ai", "data science"]):
            recommendations.append("Explore AI/ML fundamentals to future-proof your career")

        if not any(s in skill_set for s in ["communication", "leadership", "mentoring"]):
            recommendations.append("Develop mentoring and technical communication skills for career growth")

        if not any(s in skill_set for s in ["graphql", "grpc", "websocket"]):
            recommendations.append("Learn modern API technologies (GraphQL, WebSockets)")

        recommendations.append("Build a portfolio of open-source contributions to demonstrate expertise")
        recommendations.append("Network with industry professionals and attend tech conferences")
        recommendations.append("Consider obtaining relevant certifications for your target role")

        return recommendations[:8]

    def _calculate_confidence(self, skills: List[str]) -> float:
        if len(skills) >= 15:
            return 0.92
        elif len(skills) >= 10:
            return 0.85
        elif len(skills) >= 5:
            return 0.72
        else:
            return 0.55

    def _generate_summary(self, strengths: List[str], career_paths: List[Dict[str, Any]], recommendations: List[str]) -> str:
        strength_text = strengths[0] if strengths else "Developing technical profile"
        path_text = career_paths[0]["role"] if career_paths else "software engineering"
        rec_text = recommendations[0] if recommendations else "Continue building your skills"

        return (
            f"Career Analysis: {strength_text}. "
            f"Best-fit role: {path_text}. "
            f"Recommendation: {rec_text}. "
            f"Your profile shows potential for growth in the tech industry with focused skill development."
        )

    def _get_skills_for_role(self, role: str) -> List[str]:
        role = role.lower()
        role_skills_map = {
            "frontend": ["javascript", "typescript", "react", "html", "css", "git", "api", "testing", "system design"],
            "backend": ["python", "java", "sql", "postgresql", "docker", "git", "api", "system design", "testing", "linux"],
            "fullstack": ["javascript", "typescript", "react", "python", "sql", "docker", "git", "api", "system design", "testing"],
            "devops": ["docker", "kubernetes", "aws", "terraform", "linux", "python", "ci/cd", "git", "monitoring", "networking"],
            "data": ["python", "sql", "machine learning", "statistics", "pandas", "numpy", "visualization", "git"],
            "ml engineer": ["python", "machine learning", "deep learning", "sql", "docker", "git", "nlp", "computer vision", "data pipelines"],
            "mobile": ["swift", "kotlin", "react native", "flutter", "git", "api", "testing", "ui/ux"],
            "security": ["networking", "linux", "python", "cryptography", "security tools", "cloud security", "compliance"],
            "product manager": ["communication", "leadership", "analytics", "user research", "agile", "product strategy", "data analysis"],
            "engineering manager": ["leadership", "communication", "system design", "agile", "project management", "mentoring", "technical strategy"],
        }
        role_clean = role.replace(" ", "")
        for key, skills in role_skills_map.items():
            if key in role or key in role_clean:
                return skills
        return ["programming", "problem solving", "communication", "git", "api"]

    def _estimate_learning_time(self, skill: str, current_skills: List[str]) -> str:
        related_skills = {
            "docker": ["linux", "bash"],
            "kubernetes": ["docker", "linux"],
            "aws": ["linux", "networking"],
            "typescript": ["javascript"],
            "react": ["javascript", "html", "css"],
            "python": [],
            "machine learning": ["python", "statistics"],
            "system design": [],
        }
        prereqs = related_skills.get(skill.lower(), [])
        has_prereqs = any(p.lower() in [s.lower() for s in current_skills] for p in prereqs)

        importance = SKILL_IMPORTANCE.get(skill.lower(), "medium")
        if importance == "critical":
            return "4-8 weeks" if has_prereqs else "8-12 weeks"
        elif importance == "high":
            return "3-6 weeks" if has_prereqs else "6-10 weeks"
        else:
            return "2-4 weeks" if has_prereqs else "4-8 weeks"

    def _calculate_skill_relevance(self, skill: str, target_role: str) -> float:
        role_skills = self._get_skills_for_role(target_role)
        if skill.lower() in [s.lower() for s in role_skills]:
            return 0.95
        importance = SKILL_IMPORTANCE.get(skill.lower(), "medium")
        return {"critical": 0.9, "high": 0.7, "medium": 0.5, "low": 0.3}.get(importance, 0.5)

    def _estimate_timeline(self, missing_skills: List[Dict[str, Any]], experience_level: Optional[str] = None) -> int:
        base_months = sum({
            "critical": 3, "high": 2, "medium": 1, "low": 0.5
        }.get(item.get("importance_level", "medium"), 1) for item in missing_skills[:8])
        if experience_level and experience_level.lower() == "senior":
            base_months *= 1.3
        return max(3, int(base_months))

    def _get_certifications(self, missing_skills: List[Dict[str, Any]]) -> List[str]:
        cert_map = {
            "aws": "AWS Certified Solutions Architect",
            "kubernetes": "Certified Kubernetes Administrator (CKA)",
            "docker": "Docker Certified Associate",
            "python": "Python Institute Certified",
            "machine learning": "TensorFlow Developer Certificate",
            "deep learning": "Deep Learning Specialization (Coursera)",
            "typescript": "Microsoft Certified: Azure Developer Associate",
            "system design": "System Design Interview Certification",
            "terraform": "HashiCorp Certified: Terraform Associate",
            "google cloud": "Google Cloud Professional Architect",
            "azure": "Microsoft Azure Solutions Architect",
        }
        certs = []
        for item in missing_skills:
            skill = item.get("skill", "").lower()
            if skill in cert_map and cert_map[skill] not in certs:
                certs.append(cert_map[skill])
        return certs[:5]

    def clear_cache(self):
        self._analysis_cache.clear()


career_analysis_service = CareerAnalysisService()
