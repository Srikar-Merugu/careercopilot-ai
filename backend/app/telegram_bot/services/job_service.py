import logging
import random
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

MOCK_JOBS = [
    {
        "id": "job_001", "title": "Frontend Developer", "company": "Swiggy",
        "location": "Bangalore, India", "salary": "₹12LPA",
        "description": "Build and maintain React-based web applications for India's largest food delivery platform.",
        "skills": ["React", "TypeScript", "CSS", "Redux", "GraphQL"],
        "match_score": 0.92, "missing_skills": ["Docker"],
        "type": "full-time", "remote": False, "url": "https://careercopilot.ai/jobs/001",
        "posted": "2 days ago"
    },
    {
        "id": "job_002", "title": "Senior AI Engineer", "company": "Google",
        "location": "Bangalore, India", "salary": "₹45LPA",
        "description": "Design and deploy large-scale ML systems for Google's search and recommendation engines.",
        "skills": ["Python", "TensorFlow", "PyTorch", "Kubernetes", "MLOps"],
        "match_score": 0.85, "missing_skills": ["Kubernetes"],
        "type": "full-time", "remote": False, "url": "https://careercopilot.ai/jobs/002",
        "posted": "1 week ago"
    },
    {
        "id": "job_003", "title": "Full Stack Developer", "company": "Razorpay",
        "location": "Remote, India", "salary": "₹20LPA",
        "description": "Build payment infrastructure APIs and dashboards using modern web technologies.",
        "skills": ["Node.js", "React", "PostgreSQL", "AWS", "Docker"],
        "match_score": 0.88, "missing_skills": ["AWS"],
        "type": "full-time", "remote": True, "url": "https://careercopilot.ai/jobs/003",
        "posted": "3 days ago"
    },
    {
        "id": "job_004", "title": "Data Scientist", "company": "Amazon",
        "location": "Hyderabad, India", "salary": "₹35LPA",
        "description": "Analyze customer behavior data to drive product recommendations and business decisions.",
        "skills": ["Python", "SQL", "Machine Learning", "Statistics", "Spark"],
        "match_score": 0.78, "missing_skills": ["Spark", "SQL"],
        "type": "full-time", "remote": False, "url": "https://careercopilot.ai/jobs/004",
        "posted": "5 days ago"
    },
    {
        "id": "job_005", "title": "Backend Engineer", "company": "Flipkart",
        "location": "Bangalore, India", "salary": "₹25LPA",
        "description": "Design scalable microservices for India's largest e-commerce marketplace.",
        "skills": ["Java", "Spring Boot", "Kafka", "Redis", "Microservices"],
        "match_score": 0.82, "missing_skills": ["Kafka"],
        "type": "full-time", "remote": False, "url": "https://careercopilot.ai/jobs/005",
        "posted": "1 day ago"
    },
    {
        "id": "job_006", "title": "React Native Developer", "company": "CRED",
        "location": "Remote, India", "salary": "₹18LPA",
        "description": "Build cross-platform mobile experiences for India's premium credit management platform.",
        "skills": ["React Native", "TypeScript", "Redux", "Firebase", "iOS", "Android"],
        "match_score": 0.90, "missing_skills": [],
        "type": "full-time", "remote": True, "url": "https://careercopilot.ai/jobs/006",
        "posted": "4 days ago"
    },
    {
        "id": "job_007", "title": "DevOps Engineer", "company": "Zomato",
        "location": "Gurgaon, India", "salary": "₹22LPA",
        "description": "Manage cloud infrastructure and CI/CD pipelines for food delivery platform.",
        "skills": ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Linux"],
        "match_score": 0.75, "missing_skills": ["Terraform", "Jenkins"],
        "type": "full-time", "remote": False, "url": "https://careercopilot.ai/jobs/007",
        "posted": "6 days ago"
    },
    {
        "id": "job_008", "title": "Product Manager (Tech)", "company": "Microsoft",
        "location": "Hyderabad, India", "salary": "₹40LPA",
        "description": "Drive product strategy for Azure AI services used by millions of developers worldwide.",
        "skills": ["Product Strategy", "Agile", "Data Analysis", "Technical Writing", "User Research"],
        "match_score": 0.70, "missing_skills": ["Data Analysis"],
        "type": "full-time", "remote": False, "url": "https://careercopilot.ai/jobs/008",
        "posted": "1 week ago"
    },
    {
        "id": "job_009", "title": "ML Engineer", "company": "Uber",
        "location": "Bangalore, India", "salary": "₹38LPA",
        "description": "Build ML models for pricing optimization and route prediction at global scale.",
        "skills": ["Python", "TensorFlow", "ML Pipelines", "Spark", "SQL", "AB Testing"],
        "match_score": 0.87, "missing_skills": [],
        "type": "full-time", "remote": False, "url": "https://careercopilot.ai/jobs/009",
        "posted": "3 days ago"
    },
    {
        "id": "job_010", "title": "Cybersecurity Analyst", "company": "CrowdStrike",
        "location": "Remote, India", "salary": "₹28LPA",
        "description": "Analyze and respond to security threats for Fortune 500 clients.",
        "skills": ["Network Security", "Incident Response", "Python", "SIEM", "Cloud Security"],
        "match_score": 0.72, "missing_skills": ["SIEM", "Cloud Security"],
        "type": "full-time", "remote": True, "url": "https://careercopilot.ai/jobs/010",
        "posted": "2 days ago"
    },
    {
        "id": "job_011", "title": "iOS Developer", "company": "PhonePe",
        "location": "Bangalore, India", "salary": "₹24LPA",
        "description": "Build and optimize India's leading UPI payment app for iOS users.",
        "skills": ["Swift", "UIKit", "Core Data", "Combine", "CI/CD"],
        "match_score": 0.84, "missing_skills": ["Combine"],
        "type": "full-time", "remote": False, "url": "https://careercopilot.ai/jobs/011",
        "posted": "1 week ago"
    },
    {
        "id": "job_012", "title": "Cloud Architect", "company": "Oracle",
        "location": "Remote, India", "salary": "₹50LPA",
        "description": "Design multi-cloud architectures for enterprise clients migrating to OCI.",
        "skills": ["AWS", "Azure", "GCP", "OCI", "Terraform", "Kubernetes"],
        "match_score": 0.68, "missing_skills": ["OCI", "Azure"],
        "type": "contract", "remote": True, "url": "https://careercopilot.ai/jobs/012",
        "posted": "2 weeks ago"
    },
    {
        "id": "job_013", "title": "Technical Writer", "company": "Stripe",
        "location": "Remote, India", "salary": "₹15LPA",
        "description": "Write developer documentation for Stripe's payment APIs.",
        "skills": ["Technical Writing", "API Documentation", "Markdown", "Developer Tools", "Git"],
        "match_score": 0.80, "missing_skills": [],
        "type": "full-time", "remote": True, "url": "https://careercopilot.ai/jobs/013",
        "posted": "5 days ago"
    },
    {
        "id": "job_014", "title": "QA Automation Engineer", "company": "Myntra",
        "location": "Bangalore, India", "salary": "₹16LPA",
        "description": "Build automated testing frameworks for India's largest fashion e-commerce platform.",
        "skills": ["Selenium", "Python", "Pytest", "Cypress", "API Testing"],
        "match_score": 0.76, "missing_skills": ["Cypress"],
        "type": "full-time", "remote": False, "url": "https://careercopilot.ai/jobs/014",
        "posted": "3 days ago"
    },
    {
        "id": "job_015", "title": "Site Reliability Engineer", "company": "Netflix",
        "location": "Remote, India", "salary": "₹55LPA",
        "description": "Ensure 99.99% uptime for Netflix's global streaming infrastructure.",
        "skills": ["AWS", "Kubernetes", "Prometheus", "Grafana", "Terraform", "Go"],
        "match_score": 0.81, "missing_skills": ["Go"],
        "type": "full-time", "remote": True, "url": "https://careercopilot.ai/jobs/015",
        "posted": "1 week ago"
    },
    {
        "id": "job_016", "title": "Blockchain Developer", "company": "Coinbase",
        "location": "Remote, India", "salary": "₹42LPA",
        "description": "Build decentralized applications and smart contracts on Ethereum and Solana.",
        "skills": ["Solidity", "Ethereum", "Web3.js", "TypeScript", "Smart Contracts"],
        "match_score": 0.65, "missing_skills": ["Solidity", "Web3.js"],
        "type": "full-time", "remote": True, "url": "https://careercopilot.ai/jobs/016",
        "posted": "2 weeks ago"
    },
    {
        "id": "job_017", "title": "UX Designer", "company": "Adobe",
        "location": "Remote, India", "salary": "₹30LPA",
        "description": "Design intuitive creative tools used by millions of designers worldwide.",
        "skills": ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing"],
        "match_score": 0.73, "missing_skills": ["Design Systems"],
        "type": "full-time", "remote": True, "url": "https://careercopilot.ai/jobs/017",
        "posted": "4 days ago"
    },
    {
        "id": "job_018", "title": "Data Engineer", "company": "Spotify",
        "location": "Remote, India", "salary": "₹32LPA",
        "description": "Build data pipelines powering personalized music recommendations for 500M+ users.",
        "skills": ["Python", "Spark", "Airflow", "SQL", "Kafka", "Snowflake"],
        "match_score": 0.83, "missing_skills": [],
        "type": "full-time", "remote": True, "url": "https://careercopilot.ai/jobs/018",
        "posted": "2 days ago"
    },
    {
        "id": "job_019", "title": "Engineering Manager", "company": "LinkedIn",
        "location": "Bangalore, India", "salary": "₹60LPA",
        "description": "Lead a team of 15+ engineers building LinkedIn's talent marketplace.",
        "skills": ["Leadership", "System Design", "Agile", "Mentoring", "Technical Strategy"],
        "match_score": 0.77, "missing_skills": [],
        "type": "full-time", "remote": False, "url": "https://careercopilot.ai/jobs/019",
        "posted": "1 week ago"
    },
    {
        "id": "job_020", "title": "AI Research Scientist", "company": "DeepMind",
        "location": "Remote, India", "salary": "₹80LPA",
        "description": "Push the boundaries of artificial intelligence through fundamental research.",
        "skills": ["Deep Learning", "Reinforcement Learning", "Python", "JAX", "Research Publications"],
        "match_score": 0.62, "missing_skills": ["JAX", "Reinforcement Learning"],
        "type": "full-time", "remote": True, "url": "https://careercopilot.ai/jobs/020",
        "posted": "2 weeks ago"
    },
]

_saved_jobs: dict = {}


class TelegramJobService:

    def search_jobs(
        self, role: Optional[str] = None, remote_only: bool = False,
        page: int = 0, per_page: int = 5
    ) -> dict:
        jobs = MOCK_JOBS
        if role:
            role_lower = role.lower()
            jobs = [j for j in jobs if role_lower in j["title"].lower() or role_lower in j["skills"]]
        if remote_only:
            jobs = [j for j in jobs if j.get("remote")]
        start = page * per_page
        end = start + per_page
        total = len(jobs)
        return {
            "jobs": jobs[start:end],
            "total": total,
            "page": page,
            "total_pages": max(1, (total + per_page - 1) // per_page),
        }

    def get_recommended_jobs(self, user_id: str, limit: int = 5) -> list:
        random.shuffle(MOCK_JOBS)
        return sorted(MOCK_JOBS[:limit], key=lambda j: j["match_score"], reverse=True)

    def get_trending_jobs(self, limit: int = 5) -> list:
        return MOCK_JOBS[:limit]

    def get_remote_jobs(self, limit: int = 5) -> list:
        remote = [j for j in MOCK_JOBS if j.get("remote")]
        return remote[:limit]

    def get_job_by_id(self, job_id: str) -> Optional[dict]:
        for j in MOCK_JOBS:
            if j["id"] == job_id:
                return j
        return None

    def save_job(self, user_id: str, job_id: str) -> bool:
        if user_id not in _saved_jobs:
            _saved_jobs[user_id] = set()
        _saved_jobs[user_id].add(job_id)
        return True

    def unsave_job(self, user_id: str, job_id: str) -> bool:
        if user_id in _saved_jobs:
            _saved_jobs[user_id].discard(job_id)
            return True
        return False

    def get_saved_jobs(self, user_id: str) -> list:
        job_ids = _saved_jobs.get(user_id, set())
        return [j for j in MOCK_JOBS if j["id"] in job_ids]

    def is_job_saved(self, user_id: str, job_id: str) -> bool:
        return job_id in _saved_jobs.get(user_id, set())


telegram_job_service = TelegramJobService()
