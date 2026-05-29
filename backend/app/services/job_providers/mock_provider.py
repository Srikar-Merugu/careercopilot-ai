import random
from datetime import datetime, timedelta
from typing import Optional
from backend.app.services.job_providers.base import BaseJobProvider, JobData, SearchFilters, SearchResult


ROLE_TEMPLATES = [
    {
        "title": "Senior Frontend Engineer",
        "company": "TechVista Inc",
        "skills": ["React", "TypeScript", "Next.js", "TailwindCSS", "GraphQL", "Storybook", "Jest"],
        "min_salary": 130000,
        "max_salary": 180000,
        "experience": "5-7 years",
        "remote": "remote",
    },
    {
        "title": "Backend Engineer",
        "company": "DataFlow Systems",
        "skills": ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"],
        "min_salary": 120000,
        "max_salary": 170000,
        "experience": "3-5 years",
        "remote": "hybrid",
    },
    {
        "title": "Full Stack Developer",
        "company": "NovaTech Solutions",
        "skills": ["React", "Node.js", "TypeScript", "MongoDB", "Express", "Docker", "AWS"],
        "min_salary": 110000,
        "max_salary": 160000,
        "experience": "3-5 years",
        "remote": "remote",
    },
    {
        "title": "AI/ML Engineer",
        "company": "CognitiCore AI",
        "skills": ["Python", "TensorFlow", "PyTorch", "NLP", "LangChain", "OpenAI", "RAG", "Vector Databases"],
        "min_salary": 150000,
        "max_salary": 220000,
        "experience": "4-7 years",
        "remote": "remote",
    },
    {
        "title": "DevOps Engineer",
        "company": "CloudBridge Infrastructure",
        "skills": ["Docker", "Kubernetes", "Terraform", "AWS", "CI/CD", "Linux", "Prometheus", "Grafana"],
        "min_salary": 125000,
        "max_salary": 175000,
        "experience": "4-6 years",
        "remote": "hybrid",
    },
    {
        "title": "Data Analyst",
        "company": "InsightLab Analytics",
        "skills": ["SQL", "Python", "Tableau", "Power BI", "Excel", "Statistics", "Pandas", "NumPy"],
        "min_salary": 85000,
        "max_salary": 130000,
        "experience": "2-4 years",
        "remote": "remote",
    },
    {
        "title": "UI/UX Designer",
        "company": "PixelPerfect Studio",
        "skills": ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems", "CSS", "HTML"],
        "min_salary": 95000,
        "max_salary": 145000,
        "experience": "3-5 years",
        "remote": "hybrid",
    },
    {
        "title": "Product Manager",
        "company": "GrowthHarbor",
        "skills": ["Product Strategy", "Roadmapping", "A/B Testing", "Analytics", "Agile", "JIRA", "SQL"],
        "min_salary": 120000,
        "max_salary": 175000,
        "experience": "5-7 years",
        "remote": "on-site",
    },
    {
        "title": "Mobile Developer (React Native)",
        "company": "AppForge Mobile",
        "skills": ["React Native", "TypeScript", "iOS", "Android", "Redux", "Firebase", "Expo"],
        "min_salary": 110000,
        "max_salary": 160000,
        "experience": "3-5 years",
        "remote": "remote",
    },
    {
        "title": "Data Engineer",
        "company": "StreamLine Data",
        "skills": ["Python", "Spark", "Airflow", "Snowflake", "dbt", "AWS", "Kafka", "SQL"],
        "min_salary": 130000,
        "max_salary": 185000,
        "experience": "4-6 years",
        "remote": "hybrid",
    },
    {
        "title": "Frontend Developer",
        "company": "WebCraft Digital",
        "skills": ["JavaScript", "React", "CSS", "HTML", "TypeScript", "Webpack", "REST APIs"],
        "min_salary": 90000,
        "max_salary": 140000,
        "experience": "2-4 years",
        "remote": "on-site",
    },
    {
        "title": "Solutions Architect",
        "company": "EnterpriseScale Inc",
        "skills": ["System Design", "AWS", "Microservices", "Docker", "Kubernetes", "Python", "Java", "Leadership"],
        "min_salary": 160000,
        "max_salary": 230000,
        "experience": "7-10 years",
        "remote": "hybrid",
    },
    {
        "title": "Cybersecurity Engineer",
        "company": "SecureShield Corp",
        "skills": ["Penetration Testing", "Network Security", "Python", "AWS Security", "IAM", "Compliance", "SIEM"],
        "min_salary": 130000,
        "max_salary": 190000,
        "experience": "4-7 years",
        "remote": "on-site",
    },
    {
        "title": "Junior Software Engineer",
        "company": "CodeLaunch Startups",
        "skills": ["JavaScript", "Python", "React", "Git", "SQL", "HTML", "CSS"],
        "min_salary": 70000,
        "max_salary": 100000,
        "experience": "0-2 years",
        "remote": "on-site",
    },
    {
        "title": "Technical Writer",
        "company": "DocuCraft AI",
        "skills": ["Technical Writing", "Documentation", "API Documentation", "Markdown", "Git", "Developer Tools"],
        "min_salary": 80000,
        "max_salary": 120000,
        "experience": "2-4 years",
        "remote": "remote",
    },
]

COMPANIES = [
    "TechVista Inc", "DataFlow Systems", "NovaTech Solutions", "CognitiCore AI",
    "CloudBridge Infrastructure", "InsightLab Analytics", "PixelPerfect Studio",
    "GrowthHarbor", "AppForge Mobile", "StreamLine Data", "WebCraft Digital",
    "EnterpriseScale Inc", "SecureShield Corp", "CodeLaunch Startups", "DocuCraft AI",
    "QuantumByte Labs", "NexGen Software", "Apex Digital Solutions", "Vertex AI",
    "StratoCloud Services", "BrightPath Analytics", "BlueCore Systems",
]

LOCATIONS = [
    "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA",
    "Boston, MA", "Chicago, IL", "Denver, CO", "Los Angeles, CA",
    "Portland, OR", "Atlanta, GA", "Miami, FL", "Dallas, TX",
    "Remote - US", "Remote - Global", "San Jose, CA", "Toronto, Canada",
]

JOB_TYPES = ["full_time", "contract", "part_time"]
REMOTE_TYPES = ["remote", "hybrid", "on-site"]
CATEGORIES = [
    "Engineering", "Design", "Product", "Data", "DevOps",
    "Security", "AI/ML", "Mobile", "Management", "Support",
]


class MockJobProvider(BaseJobProvider):
    def __init__(self):
        self._jobs = self._generate_jobs(500)

    @property
    def name(self) -> str:
        return "mock"

    def search(self, filters: SearchFilters) -> SearchResult:
        filtered = self._jobs[:]

        if filters.query:
            q = filters.query.lower()
            filtered = [
                j for j in filtered
                if q in j.title.lower() or q in j.company.lower()
                or q in " ".join(j.required_skills or []).lower()
                or (j.description and q in j.description.lower())
            ]

        if filters.location:
            loc = filters.location.lower()
            filtered = [j for j in filtered if j.location and loc in j.location.lower()]

        if filters.remote_type:
            filtered = [j for j in filtered if j.remote_type == filters.remote_type]

        if filters.salary_min:
            filtered = [j for j in filtered if j.salary_max and j.salary_max >= filters.salary_min]

        if filters.salary_max:
            filtered = [j for j in filtered if j.salary_min and j.salary_min <= filters.salary_max]

        if filters.experience:
            filtered = [j for j in filtered if j.experience_required == filters.experience]

        if filters.job_type:
            filtered = [j for j in filtered if j.job_type == filters.job_type]

        if filters.category:
            cat = filters.category.lower()
            filtered = [j for j in filtered if j.category and cat in j.category.lower()]

        total = len(filtered)
        start = (filters.page - 1) * filters.per_page
        end = start + filters.per_page
        page_jobs = filtered[start:end]

        return SearchResult(
            jobs=page_jobs,
            total=total,
            page=filters.page,
            per_page=filters.per_page,
        )

    def get_by_id(self, source_id: str) -> Optional[JobData]:
        for j in self._jobs:
            if j.source_id == source_id:
                return j
        return None

    def _generate_jobs(self, count: int) -> list[JobData]:
        jobs = []
        for i in range(count):
            template = random.choice(ROLE_TEMPLATES)
            company = template["company"] if random.random() < 0.7 else random.choice(COMPANIES)
            location = random.choice(LOCATIONS)
            remote = random.choice(REMOTE_TYPES)
            job_type = random.choice(JOB_TYPES)
            category = random.choice(CATEGORIES)

            salary_min = template["min_salary"] + random.randint(-20000, 20000)
            salary_max = template["max_salary"] + random.randint(-20000, 20000)
            salary_min = max(salary_min, 30000)
            salary_max = max(salary_max, salary_min + 10000)

            days_ago = random.randint(0, 60)
            posted = datetime.utcnow() - timedelta(days=days_ago)

            desc = (
                f"We are looking for a talented {template['title']} to join {company}. "
                f"In this role, you will design, build, and maintain cutting-edge solutions "
                f"that impact millions of users. You'll work with a world-class team using "
                f"modern technologies and agile methodologies.\n\n"
                f"Key Responsibilities:\n"
                f"- Design and implement scalable solutions\n"
                f"- Collaborate with cross-functional teams\n"
                f"- Mentor junior team members\n"
                f"- Contribute to technical architecture decisions\n\n"
                f"Required Skills:\n"
                f"- {', '.join(template['skills'][:5])}\n"
                f"- {template['experience']} of professional experience\n"
                f"- Strong problem-solving and communication skills"
            )

            jobs.append(JobData(
                source="mock",
                source_id=f"mock_{i:05d}",
                title=template["title"],
                company=company,
                company_logo=None,
                location=location,
                salary_min=salary_min,
                salary_max=salary_max,
                salary_currency="USD",
                description=desc,
                requirements=desc[:300],
                required_skills=template["skills"][:],
                experience_required=template["experience"],
                job_type=job_type,
                remote_type=remote,
                apply_url=f"https://careercopilot.ai/apply/{company.lower().replace(' ', '-')}/{template['title'].lower().replace(' ', '-')}",
                category=category,
                posted_at=posted,
            ))

        return jobs


mock_provider = MockJobProvider()
