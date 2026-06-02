import logging
from typing import List, Optional, Dict, Any
from uuid import uuid4
from datetime import datetime, timedelta

from backend.app.services.embeddings_service import embeddings_service
from backend.app.services.semantic_matching_service import semantic_matching_service
from backend.app.services.vector_search_service import vector_search_service

logger = logging.getLogger(__name__)

TRENDING_SKILLS = [
    "Generative AI", "LangChain", "Vector Databases", "RAG Systems", "AI Agents",
    "TypeScript", "React Server Components", "Next.js 15", "Python 3.14", "FastAPI",
    "Kubernetes", "AWS Lambda", "Terraform", "CI/CD Pipelines", "GitHub Actions",
    "System Design", "Microservices", "GraphQL", "WebSockets", "gRPC",
    "Machine Learning", "Deep Learning", "Computer Vision", "NLP", "LLM Fine-tuning",
    "Cybersecurity", "Blockchain", "Cloud Architecture", "Edge Computing", "DevSecOps",
]

TRENDING_COMPANIES = [
    "OpenAI", "Anthropic", "Google DeepMind", "Meta AI", "Microsoft AI",
    "Stripe", "Vercel", "Supabase", "Linear", "Notion",
    "Datadog", "GitHub", "Netflix", "Apple", "Tesla",
    "Shopify", "Airbnb", "Uber", "Spotify", "Plaid",
]

COURSE_RECOMMENDATIONS = [
    {"title": "Generative AI with LLMs", "provider": "DeepLearning.AI", "url": "https://deeplearning.ai", "duration": "8 weeks"},
    {"title": "LangChain for LLM Application Development", "provider": "LangChain", "url": "https://langchain.com", "duration": "4 weeks"},
    {"title": "System Design Interview", "provider": "Grokking", "url": "https://educative.io", "duration": "12 weeks"},
    {"title": "AWS Solutions Architect", "provider": "AWS Training", "url": "https://aws.amazon.com/training", "duration": "16 weeks"},
    {"title": "React & Next.js Mastery", "provider": "Vercel", "url": "https://nextjs.org", "duration": "8 weeks"},
    {"title": "Kubernetes Administrator (CKA)", "provider": "CNCF", "url": "https://cncf.io", "duration": "12 weeks"},
    {"title": "Machine Learning Specialization", "provider": "Stanford/Coursera", "url": "https://coursera.org", "duration": "12 weeks"},
    {"title": "Full Stack TypeScript", "provider": "TypeScript", "url": "https://typescriptlang.org", "duration": "8 weeks"},
    {"title": "Data Engineering with Python", "provider": "DataCamp", "url": "https://datacamp.com", "duration": "10 weeks"},
    {"title": "DevOps & Cloud Engineering", "provider": "A Cloud Guru", "url": "https://acloudguru.com", "duration": "16 weeks"},
]


class RecommendationsService:
    def __init__(self):
        self._user_sessions: Dict[str, Dict[str, Any]] = {}

    def generate_recommendations(
        self,
        user_id: str,
        skills: Optional[List[str]] = None,
        search_history: Optional[List[str]] = None,
        saved_jobs: Optional[List[Dict[str, Any]]] = None,
        resume_text: Optional[str] = None,
        limit: int = 20
    ) -> Dict[str, Any]:
        session = self._get_or_create_session(user_id, skills, search_history)

        job_recommendations = self._recommend_jobs(session, saved_jobs)
        skill_recommendations = self._recommend_skills(session, skills)
        company_recommendations = self._recommend_companies(session)
        course_recommendations = self._recommend_courses(session, skills)
        trending = self._get_trending_insights(session)
        interview_prep = self._recommend_interview_prep(session)

        all_recommendations = []

        for rec in job_recommendations:
            all_recommendations.append({**rec, "recommendation_type": "job"})
        for rec in skill_recommendations:
            all_recommendations.append({**rec, "recommendation_type": "skill"})
        for rec in company_recommendations:
            all_recommendations.append({**rec, "recommendation_type": "company"})
        for rec in course_recommendations:
            all_recommendations.append({**rec, "recommendation_type": "course"})
        for rec in trending:
            all_recommendations.append({**rec, "recommendation_type": "trending"})
        for rec in interview_prep:
            all_recommendations.append({**rec, "recommendation_type": "interview"})

        all_recommendations.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)

        result = {
            "recommendations": [
                {
                    "id": str(uuid4()),
                    "title": r.get("title", ""),
                    "content": r.get("content", ""),
                    "recommendation_type": r.get("recommendation_type", "general"),
                    "source": r.get("source", "AI Engine"),
                    "relevance_score": r.get("relevance_score", 0.5),
                    "metadata": r.get("metadata", {}),
                    "is_read": False,
                    "created_at": (datetime.utcnow()).isoformat(),
                }
                for r in all_recommendations[:limit]
            ],
            "total": min(len(all_recommendations), limit),
            "has_more": len(all_recommendations) > limit
        }

        return result

    def get_trending_skills(self) -> List[Dict[str, Any]]:
        skill_trends = {
            "Generative AI": (97, "+58%"), "LangChain": (94, "+52%"), "Vector Databases": (89, "+45%"),
            "RAG Systems": (92, "+48%"), "AI Agents": (95, "+55%"), "TypeScript": (91, "+32%"),
            "React Server Components": (85, "+38%"), "Next.js 15": (88, "+35%"), "Python 3.14": (87, "+28%"),
            "FastAPI": (84, "+30%"), "Kubernetes": (86, "+25%"), "AWS Lambda": (82, "+22%"),
            "Terraform": (80, "+24%"), "CI/CD Pipelines": (79, "+20%"), "GitHub Actions": (78, "+22%"),
            "System Design": (83, "+26%"), "Microservices": (77, "+18%"), "GraphQL": (76, "+20%"),
            "Machine Learning": (85, "+30%"), "Deep Learning": (82, "+28%"), "NLP": (81, "+32%"),
            "LLM Fine-tuning": (90, "+50%"), "Cloud Architecture": (84, "+24%"), "DevSecOps": (79, "+26%"),
        }
        selected = [s for s in TRENDING_SKILLS if s in skill_trends][:10]
        return [
            {"skill": skill, "trending_score": score, "growth": growth}
            for skill in selected
            for score, growth in [skill_trends.get(skill, (80, "+20%"))]
        ]

    def _get_or_create_session(
        self,
        user_id: str,
        skills: Optional[List[str]] = None,
        search_history: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        if user_id not in self._user_sessions:
            self._user_sessions[user_id] = {
                "user_id": user_id,
                "skills": skills or [],
                "search_history": search_history or [],
                "created_at": datetime.utcnow(),
                "semantic_profile": None
            }
        session = self._user_sessions[user_id]
        if skills:
            session["skills"] = skills
        if search_history:
            session["search_history"].extend(search_history)
            session["search_history"] = list(set(session["search_history"]))
        return session

    def _recommend_jobs(self, session: Dict[str, Any], saved_jobs: Optional[List[Dict[str, Any]]] = None) -> List[Dict[str, Any]]:
        skills = [s.lower() for s in session.get("skills", [])]
        if not skills:
            return [
                {"title": "Explore Software Engineering Roles", "content": "Start by adding your skills to get personalized job recommendations", "relevance_score": 0.7}
            ]

        role_skill_map = {
            "Full Stack Developer": ["react", "node.js", "typescript", "python", "javascript", "postgresql", "html", "css"],
            "Frontend Engineer": ["react", "typescript", "javascript", "vue", "angular", "html", "css", "next.js"],
            "Backend Engineer": ["python", "node.js", "java", "go", "postgresql", "mongodb", "redis", "fastapi"],
            "DevOps Engineer": ["docker", "kubernetes", "aws", "terraform", "ci/cd", "linux", "python"],
            "ML Engineer": ["python", "machine learning", "tensorflow", "pytorch", "nlp", "sql", "docker"],
            "Cloud Architect": ["aws", "gcp", "azure", "docker", "kubernetes", "terraform", "system design"],
            "Data Scientist": ["python", "sql", "machine learning", "statistics", "visualization", "pandas"],
            "Engineering Manager": ["leadership", "project management", "system design", "agile"],
        }

        recommendations = []
        for title, req_skills in role_skill_map.items():
            matched = sum(1 for s in req_skills if s in skills)
            score = round(matched / len(req_skills), 2) if req_skills else 0.5
            if score > 0:
                recommendations.append({
                    "title": title,
                    "content": f"AI-matched {title} role — {matched}/{len(req_skills)} skill overlap",
                    "source": "AI Semantic Match",
                    "relevance_score": score,
                    "metadata": {"role": title, "match_type": "semantic", "matched_skills": matched, "total_skills": len(req_skills)}
                })

        recommendations.sort(key=lambda x: x["relevance_score"], reverse=True)
        return recommendations[:6]

    def _recommend_skills(self, session: Dict[str, Any], skills: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        current_skills = set(s.lower() for s in (skills or session.get("skills", [])))

        trending = self.get_trending_skills()
        recommendations = []
        for item in trending:
            skill = item["skill"]
            if skill.lower() not in current_skills:
                recommendations.append({
                    "title": f"Learn {skill}",
                    "content": f"Trending skill with {item['growth']} growth. Companies are actively hiring for this.",
                    "source": "Market Trends",
                    "relevance_score": item["trending_score"] / 100,
                    "metadata": {"skill": skill, "growth": item["growth"], "trending_score": item["trending_score"]}
                })

        return recommendations[:5]

    def _recommend_companies(self, session: Dict[str, Any]) -> List[Dict[str, Any]]:
        skills = [s.lower() for s in session.get("skills", [])]
        company_relevance = {
            "Vercel": ["react", "next.js", "javascript", "typescript"],
            "Supabase": ["postgresql", "react", "typescript", "node.js"],
            "Stripe": ["python", "java", "go", "rust", "node.js"],
            "GitHub": ["git", "ci/cd", "actions", "python", "javascript"],
            "Netflix": ["java", "spring", "aws", "microservices", "system design"],
            "Datadog": ["python", "go", "docker", "kubernetes", "monitoring"],
            "OpenAI": ["python", "machine learning", "deep learning", "go"],
            "Microsoft AI": ["python", "c#", "azure", "machine learning", "typescript"],
            "Shopify": ["ruby", "react", "typescript", "go", "graphql"],
            "Plaid": ["python", "go", "typescript", "node.js", "postgresql"],
        }
        scored = []
        for company, req_skills in company_relevance.items():
            matched = sum(1 for s in req_skills if s in skills)
            score = round(0.5 + (matched / len(req_skills)) * 0.4 if req_skills else 0.5, 2)
            if score > 0.5:
                scored.append((company, score))
        scored.sort(key=lambda x: x[1], reverse=True)
        selected = scored[:6] if scored else [(c, 0.6) for c in TRENDING_COMPANIES[:6]]
        return [
            {
                "title": f"Follow {company}",
                "content": f"Top tech company actively hiring. Your skills align well with their tech stack.",
                "source": "Company Insights",
                "relevance_score": score,
                "metadata": {"company": company}
            }
            for company, score in selected
        ]

    def _recommend_courses(self, session: Dict[str, Any], skills: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        current_skills = set(s.lower() for s in (skills or session.get("skills", [])))

        course_skill_map = {
            "Generative AI with LLMs": "machine learning",
            "LangChain for LLM Application Development": "python",
            "System Design Interview": "system design",
            "AWS Solutions Architect": "aws",
            "React & Next.js Mastery": "react",
            "Kubernetes Administrator (CKA)": "kubernetes",
            "Machine Learning Specialization": "machine learning",
            "Full Stack TypeScript": "typescript",
            "Data Engineering with Python": "python",
            "DevOps & Cloud Engineering": "docker",
        }

        recommendations = []
        for course in COURSE_RECOMMENDATIONS:
            required_skill = course_skill_map.get(course["title"], "").lower()
            has_skill = any(s in current_skills for s in [required_skill]) if required_skill else False
            score = 0.5 if not has_skill else 0.8
            if not has_skill:
                recommendations.append({
                    "title": course["title"],
                    "content": f"Recommended course by {course['provider']}. Duration: {course['duration']}.",
                    "source": course["provider"],
                    "relevance_score": score,
                    "metadata": {"course": course["title"], "provider": course["provider"], "duration": course["duration"]}
                })

        return recommendations[:4]

    def _get_trending_insights(self, session: Dict[str, Any]) -> List[Dict[str, Any]]:
        insights = [
            {"title": "AI Engineers in High Demand", "content": "Companies are offering 30%+ salary premium for AI engineering roles", "source": "Market Intelligence", "relevance_score": 0.92},
            {"title": "TypeScript Adoption Reaches 89%", "content": "TypeScript is now the most adopted technology in startups", "source": "State of JS 2026", "relevance_score": 0.88},
            {"title": "Remote Work Stabilizes at 35%", "content": "Hybrid work model becomes standard for tech companies", "source": "Workplace Trends", "relevance_score": 0.78},
            {"title": "System Design Interviews Evolve", "content": "AI system design becomes core interview topic for senior roles", "source": "Interview Trends", "relevance_score": 0.85},
        ]
        return insights

    def _recommend_interview_prep(self, session: Dict[str, Any]) -> List[Dict[str, Any]]:
        return [
            {
                "title": "AI System Design Interview Prep",
                "content": "Learn to design AI-powered systems with our curated resources",
                "source": "Interview Prep",
                "relevance_score": 0.86,
                "metadata": {"topic": "AI System Design", "difficulty": "Advanced"}
            },
            {
                "title": "Behavioral Interview Mastery",
                "content": "Master STAR method and leadership principles for FAANG interviews",
                "source": "Interview Prep",
                "relevance_score": 0.82,
                "metadata": {"topic": "Behavioral", "difficulty": "All Levels"}
            },
            {
                "title": "Coding Challenge Practice",
                "content": "LeetCode-style problems with AI-powered hints and solutions",
                "source": "Interview Prep",
                "relevance_score": 0.79,
                "metadata": {"topic": "Algorithms", "difficulty": "Medium"}
            },
        ]

    def clear_session(self, user_id: str):
        if user_id in self._user_sessions:
            del self._user_sessions[user_id]


recommendations_service = RecommendationsService()
