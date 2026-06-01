import random
from datetime import datetime, timedelta
from typing import Optional
from backend.app.services.job_providers.base import BaseJobProvider, JobData, SearchFilters, SearchResult


INDIAN_ROLE_TEMPLATES = [
    {"title": "Senior Frontend Engineer", "company": "Swiggy", "skills": ["React", "TypeScript", "Next.js", "TailwindCSS", "GraphQL", "Jest"], "min_salary": 2500000, "max_salary": 4500000, "experience": "5-7 years", "remote": "hybrid"},
    {"title": "Backend Engineer", "company": "Razorpay", "skills": ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"], "min_salary": 2000000, "max_salary": 4000000, "experience": "3-5 years", "remote": "hybrid"},
    {"title": "Full Stack Developer", "company": "Flipkart", "skills": ["React", "Node.js", "TypeScript", "MongoDB", "Express", "Docker", "AWS"], "min_salary": 1800000, "max_salary": 3500000, "experience": "3-5 years", "remote": "on-site"},
    {"title": "AI/ML Engineer", "company": "Zerodha", "skills": ["Python", "TensorFlow", "PyTorch", "NLP", "LangChain", "RAG", "Vector Databases"], "min_salary": 3000000, "max_salary": 6000000, "experience": "4-7 years", "remote": "remote"},
    {"title": "DevOps Engineer", "company": "BrowserStack", "skills": ["Docker", "Kubernetes", "Terraform", "AWS", "CI/CD", "Linux", "Prometheus"], "min_salary": 2000000, "max_salary": 4000000, "experience": "4-6 years", "remote": "remote"},
    {"title": "Data Analyst", "company": "CRED", "skills": ["SQL", "Python", "Tableau", "Power BI", "Excel", "Statistics", "Pandas"], "min_salary": 1200000, "max_salary": 2500000, "experience": "2-4 years", "remote": "hybrid"},
    {"title": "UI/UX Designer", "company": "Zomato", "skills": ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems", "CSS"], "min_salary": 1500000, "max_salary": 3000000, "experience": "3-5 years", "remote": "on-site"},
    {"title": "Product Manager", "company": "Ola", "skills": ["Product Strategy", "Roadmapping", "A/B Testing", "Analytics", "Agile", "JIRA", "SQL"], "min_salary": 2500000, "max_salary": 5000000, "experience": "5-7 years", "remote": "on-site"},
    {"title": "Mobile Developer (React Native)", "company": "PhonePe", "skills": ["React Native", "TypeScript", "iOS", "Android", "Redux", "Firebase", "Expo"], "min_salary": 1800000, "max_salary": 3500000, "experience": "3-5 years", "remote": "hybrid"},
    {"title": "Data Engineer", "company": "Dream11", "skills": ["Python", "Spark", "Airflow", "Snowflake", "dbt", "AWS", "Kafka", "SQL"], "min_salary": 2200000, "max_salary": 4500000, "experience": "4-6 years", "remote": "remote"},
    {"title": "Frontend Developer", "company": "Myntra", "skills": ["JavaScript", "React", "CSS", "HTML", "TypeScript", "Webpack", "REST APIs"], "min_salary": 1200000, "max_salary": 2500000, "experience": "2-4 years", "remote": "on-site"},
    {"title": "Solutions Architect", "company": "Infosys", "skills": ["System Design", "AWS", "Microservices", "Docker", "Kubernetes", "Python", "Java"], "min_salary": 3000000, "max_salary": 5500000, "experience": "7-10 years", "remote": "hybrid"},
    {"title": "SDE I", "company": "Google India", "skills": ["Java", "Python", "Data Structures", "Algorithms", "System Design", "SQL", "Docker"], "min_salary": 3500000, "max_salary": 6000000, "experience": "0-2 years", "remote": "on-site"},
    {"title": "SDE II", "company": "Microsoft India", "skills": ["C++", "C#", "Python", "Azure", "Kubernetes", "Microservices", "SQL"], "min_salary": 4000000, "max_salary": 7000000, "experience": "3-5 years", "remote": "hybrid"},
    {"title": "Software Engineer", "company": "TCS Digital", "skills": ["Java", "Spring Boot", "Microservices", "SQL", "Angular", "Docker", "AWS"], "min_salary": 800000, "max_salary": 1800000, "experience": "2-5 years", "remote": "on-site"},
    {"title": "Software Developer", "company": "Wipro", "skills": ["Python", "Django", "PostgreSQL", "React", "Docker", "Git", "AWS"], "min_salary": 600000, "max_salary": 1500000, "experience": "1-3 years", "remote": "on-site"},
    {"title": "Senior Software Engineer", "company": "Paytm", "skills": ["Java", "Spring Boot", "Kafka", "Redis", "MySQL", "Docker", "Kubernetes"], "min_salary": 2500000, "max_salary": 4500000, "experience": "5-8 years", "remote": "on-site"},
    {"title": "Data Scientist", "company": "Tata Consultancy Services", "skills": ["Python", "Machine Learning", "Statistics", "SQL", "TensorFlow", "Deep Learning", "NLP"], "min_salary": 1500000, "max_salary": 3500000, "experience": "3-6 years", "remote": "hybrid"},
    {"title": "React Developer", "company": "Urban Company", "skills": ["React", "TypeScript", "Redux", "JavaScript", "CSS", "HTML", "REST APIs", "Git"], "min_salary": 1400000, "max_salary": 2800000, "experience": "2-4 years", "remote": "remote"},
    {"title": "Node.js Backend Developer", "company": "ShareChat", "skills": ["Node.js", "Express", "PostgreSQL", "Redis", "MongoDB", "Docker", "AWS"], "min_salary": 1600000, "max_salary": 3200000, "experience": "3-5 years", "remote": "remote"},
    {"title": "Junior Software Engineer", "company": "HackerRank", "skills": ["JavaScript", "Python", "React", "Git", "SQL", "HTML", "CSS"], "min_salary": 700000, "max_salary": 1400000, "experience": "0-2 years", "remote": "remote"},
    {"title": "Python Developer", "company": "Juspay", "skills": ["Python", "Django", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS"], "min_salary": 1200000, "max_salary": 2500000, "experience": "2-4 years", "remote": "hybrid"},
    {"title": "Technical Writer", "company": "Postman", "skills": ["Technical Writing", "Documentation", "API Documentation", "Markdown", "Git"], "min_salary": 1000000, "max_salary": 2000000, "experience": "2-4 years", "remote": "remote"},
    {"title": "QA Engineer", "company": "BrowserStack", "skills": ["Selenium", "Python", "Automation Testing", "Cypress", "API Testing", "Postman", "Git"], "min_salary": 800000, "max_salary": 1800000, "experience": "2-4 years", "remote": "hybrid"},
    {"title": "Machine Learning Engineer", "company": "Observe.ai", "skills": ["Python", "TensorFlow", "PyTorch", "MLOps", "Docker", "Kubernetes", "AWS", "MLflow"], "min_salary": 2500000, "max_salary": 5000000, "experience": "3-6 years", "remote": "remote"},
    {"title": "Cybersecurity Engineer", "company": "Quick Heal", "skills": ["Penetration Testing", "Network Security", "Python", "AWS Security", "IAM", "Compliance"], "min_salary": 1800000, "max_salary": 3500000, "experience": "4-7 years", "remote": "on-site"},
    {"title": "Engineering Manager", "company": "Razorpay", "skills": ["Engineering Management", "System Design", "Microservices", "Java", "Python", "Leadership", "Agile"], "min_salary": 5000000, "max_salary": 8000000, "experience": "8-12 years", "remote": "on-site"},
    {"title": "Technical Lead", "company": "Gojek India", "skills": ["System Design", "Java", "Kotlin", "Microservices", "Docker", "Kubernetes", "Leadership"], "min_salary": 3500000, "max_salary": 6000000, "experience": "6-9 years", "remote": "hybrid"},
    {"title": "Software Development Intern", "company": "Practo", "skills": ["Python", "JavaScript", "React", "SQL", "Git", "HTML", "CSS"], "min_salary": 300000, "max_salary": 600000, "experience": "0-1 years", "remote": "on-site"},
    {"title": "Cloud Architect", "company": "Zeta", "skills": ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "Microservices", "System Design"], "min_salary": 4000000, "max_salary": 7000000, "experience": "7-12 years", "remote": "hybrid"},
]

INDIAN_COMPANIES = [
    "Google India", "Microsoft India", "Amazon India", "Flipkart", "Swiggy", "Zomato",
    "Razorpay", "CRED", "Zerodha", "PhonePe", "Paytm", "Ola", "Uber India",
    "Myntra", "Nykaa", "Urban Company", "ShareChat", "Dream11", "BrowserStack",
    "Postman", "HackerRank", "TCS Digital", "Infosys", "Wipro", "HCL Tech",
    "Tech Mahindra", "LTI Mindtree", "Persistent Systems", "Zeta", "Groww",
    "Upstox", "BharatPe", "Meesho", "Unacademy", "BYJU'S", "Practo",
    "Freshworks", "Chargebee", "Whatfix", "Observe.ai", "Juspay", "Hasura",
]

INDIAN_CITIES = [
    "Bangalore", "Hyderabad", "Chennai", "Mumbai", "Pune", "Delhi", "Gurgaon",
    "Noida", "Kolkata", "Ahmedabad", "Jaipur", "Chandigarh", "Indore",
    "Kochi", "Coimbatore", "Thiruvananthapuram", "Visakhapatnam", "Nagpur",
]

INDIAN_REMOTE_CITIES = [
    "Remote - India", "Bangalore", "Hyderabad", "Chennai", "Mumbai", "Pune",
    "Delhi", "Gurgaon", "Noida",
]

APPLY_URL_PREFIXES = [
    "https://www.linkedin.com/jobs/view",
    "https://www.naukri.com/job",
    "https://wellfound.com/jobs",
    "https://internshala.com/internship",
    "https://instahyre.com/job",
    "https://cutshort.com/job",
    "https://hasjob.co/job",
    "https://www.freshersworld.com/jobs",
    "https://www.timesjobs.com/job",
    "https://www.monsterindia.com/job",
]

JOB_TYPES = ["full_time", "contract", "internship"]
REMOTE_TYPES = ["remote", "hybrid", "on-site"]
CATEGORIES = ["Engineering", "Design", "Product", "Data", "DevOps", "Security", "AI/ML", "Mobile", "Management"]


class MockJobProvider(BaseJobProvider):
    def __init__(self):
        self._jobs = self._generate_jobs(300)

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
            template = random.choice(INDIAN_ROLE_TEMPLATES)
            company = template["company"] if random.random() < 0.7 else random.choice(INDIAN_COMPANIES)
            location = random.choice(INDIAN_CITIES)
            if template.get("remote") == "remote":
                location = "Remote - India"
            elif template.get("remote") == "hybrid":
                location = random.choice(INDIAN_REMOTE_CITIES)
            remote = template.get("remote", random.choice(REMOTE_TYPES))
            job_type = random.choice(JOB_TYPES)
            category = random.choice(CATEGORIES)

            salary_min = template["min_salary"] + random.randint(-300000, 300000)
            salary_max = template["max_salary"] + random.randint(-300000, 300000)
            salary_min = max(salary_min, 200000)
            salary_max = max(salary_max, salary_min + 100000)

            days_ago = random.randint(0, 30)
            posted = datetime.utcnow() - timedelta(days=days_ago)

            apply_id = random.randint(100000, 999999)
            apply_url = f"{random.choice(APPLY_URL_PREFIXES)}/{apply_id}"

            desc = (
                f"We are looking for a talented {template['title']} to join {company}. "
                f"In this role, you will design, build, and maintain cutting-edge solutions "
                f"that impact millions of users across India. You'll work with a world-class team "
                f"using modern technologies and agile methodologies.\n\n"
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
                salary_currency="INR",
                description=desc,
                requirements=desc[:300],
                required_skills=template["skills"][:],
                experience_required=template["experience"],
                job_type=job_type,
                remote_type=remote,
                apply_url=apply_url,
                category=category,
                posted_at=posted,
            ))

        return jobs


mock_provider = MockJobProvider()
