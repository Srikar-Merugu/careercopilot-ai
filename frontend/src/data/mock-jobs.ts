export interface MockJob {
  id: string;
  source: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  description: string;
  requirements: string;
  required_skills: string[];
  experience_required: string;
  job_type: string;
  remote_type: string;
  apply_url: string;
  category: string;
  posted_at: string;
  created_at: string;
}

const companies = [
  "Google", "Meta", "Apple", "Amazon", "Microsoft", "Netflix", "Stripe", "Shopify",
  "Spotify", "Airbnb", "Uber", "Twitter", "Notion", "Figma", "Vercel", "Linear",
  "Datadog", "MongoDB", "GitHub", "GitLab", "DigitalOcean", "Cloudflare",
  "Atlassian", "HubSpot", "Intercom", "Twilio", "Salesforce", "Adobe",
  "Coinbase", "Robinhood", "Palantir", "Snowflake", "Databricks", "Confluent",
  "Canva", "Webflow", "Supabase", "Railway", "Replit", "CodeSandbox",
  "Clerk", "Cal.com", "Dub.co", "Plausible", "Sentry", "PostHog",
];

const locations = [
  "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA",
  "Boston, MA", "Chicago, IL", "Denver, CO", "Los Angeles, CA",
  "Portland, OR", "Atlanta, GA", "Miami, FL", "Dallas, TX",
  "Remote - US", "Remote - Global", "San Jose, CA", "Toronto, Canada",
  "London, UK", "Berlin, Germany", "Amsterdam, Netherlands", "Singapore",
];

const roleTemplates = [
  {
    title: "Frontend Engineer",
    category: "Engineering",
    skills: ["React", "TypeScript", "Next.js", "CSS", "HTML", "Jest", "GraphQL"],
    min: 120000, max: 180000, exp: "3-5 years",
  },
  {
    title: "Senior Frontend Engineer",
    category: "Engineering",
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "GraphQL", "Storybook", "Jest", "System Design"],
    min: 160000, max: 230000, exp: "5-7 years",
  },
  {
    title: "Backend Engineer",
    category: "Engineering",
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"],
    min: 130000, max: 190000, exp: "3-5 years",
  },
  {
    title: "Senior Backend Engineer",
    category: "Engineering",
    skills: ["Python", "Go", "PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes", "AWS", "Microservices"],
    min: 170000, max: 240000, exp: "5-8 years",
  },
  {
    title: "Full Stack Developer",
    category: "Engineering",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "Express", "Docker", "AWS"],
    min: 120000, max: 170000, exp: "3-5 years",
  },
  {
    title: "Senior Full Stack Engineer",
    category: "Engineering",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS", "System Design", "GraphQL"],
    min: 160000, max: 220000, exp: "5-7 years",
  },
  {
    title: "React Developer",
    category: "Engineering",
    skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Redux", "Jest"],
    min: 100000, max: 150000, exp: "2-4 years",
  },
  {
    title: "Next.js Developer",
    category: "Engineering",
    skills: ["Next.js", "React", "TypeScript", "TailwindCSS", "Vercel", "PostgreSQL"],
    min: 110000, max: 160000, exp: "2-5 years",
  },
  {
    title: "AI Engineer",
    category: "AI/ML",
    skills: ["Python", "TensorFlow", "PyTorch", "NLP", "LangChain", "OpenAI", "RAG", "Vector Databases"],
    min: 150000, max: 220000, exp: "3-6 years",
  },
  {
    title: "Senior AI/ML Engineer",
    category: "AI/ML",
    skills: ["Python", "PyTorch", "TensorFlow", "MLOps", "Kubernetes", "AWS", "NLP", "Computer Vision"],
    min: 190000, max: 280000, exp: "5-8 years",
  },
  {
    title: "Machine Learning Engineer",
    category: "AI/ML",
    skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "SQL", "Docker", "AWS"],
    min: 140000, max: 200000, exp: "3-6 years",
  },
  {
    title: "Data Scientist",
    category: "Data",
    skills: ["Python", "SQL", "Statistics", "Machine Learning", "Pandas", "NumPy", "Tableau"],
    min: 120000, max: 180000, exp: "3-5 years",
  },
  {
    title: "Data Analyst",
    category: "Data",
    skills: ["SQL", "Python", "Tableau", "Power BI", "Excel", "Statistics", "Pandas"],
    min: 80000, max: 130000, exp: "2-4 years",
  },
  {
    title: "Data Engineer",
    category: "Data",
    skills: ["Python", "Spark", "Airflow", "Snowflake", "dbt", "AWS", "Kafka", "SQL"],
    min: 130000, max: 190000, exp: "3-6 years",
  },
  {
    title: "DevOps Engineer",
    category: "DevOps",
    skills: ["Docker", "Kubernetes", "Terraform", "AWS", "CI/CD", "Linux", "Prometheus", "Grafana"],
    min: 130000, max: 180000, exp: "3-6 years",
  },
  {
    title: "Senior DevOps Engineer",
    category: "DevOps",
    skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Helm", "ArgoCD", "Prometheus", "Linux"],
    min: 170000, max: 230000, exp: "5-8 years",
  },
  {
    title: "Platform Engineer",
    category: "DevOps",
    skills: ["Kubernetes", "Go", "Terraform", "AWS", "Docker", "CI/CD", "Linux"],
    min: 150000, max: 210000, exp: "4-7 years",
  },
  {
    title: "Cloud Architect",
    category: "DevOps",
    skills: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "System Design", "Networking"],
    min: 180000, max: 260000, exp: "7-10 years",
  },
  {
    title: "iOS Developer",
    category: "Mobile",
    skills: ["Swift", "SwiftUI", "UIKit", "Xcode", "Core Data", "Firebase", "REST APIs"],
    min: 120000, max: 180000, exp: "3-5 years",
  },
  {
    title: "Android Developer",
    category: "Mobile",
    skills: ["Kotlin", "Java", "Android SDK", "Jetpack Compose", "Firebase", "REST APIs"],
    min: 110000, max: 170000, exp: "3-5 years",
  },
  {
    title: "React Native Developer",
    category: "Mobile",
    skills: ["React Native", "TypeScript", "iOS", "Android", "Redux", "Firebase", "Expo"],
    min: 110000, max: 160000, exp: "2-5 years",
  },
  {
    title: "UI/UX Designer",
    category: "Design",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems", "CSS", "HTML"],
    min: 90000, max: 145000, exp: "3-5 years",
  },
  {
    title: "Senior Product Designer",
    category: "Design",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping", "Interaction Design", "Leadership"],
    min: 140000, max: 200000, exp: "5-8 years",
  },
  {
    title: "Product Manager",
    category: "Product",
    skills: ["Product Strategy", "Roadmapping", "A/B Testing", "Analytics", "Agile", "JIRA", "SQL"],
    min: 130000, max: 190000, exp: "4-7 years",
  },
  {
    title: "Technical Product Manager",
    category: "Product",
    skills: ["Product Strategy", "API Design", "Analytics", "Agile", "SQL", "System Design", "Leadership"],
    min: 150000, max: 210000, exp: "5-8 years",
  },
  {
    title: "Engineering Manager",
    category: "Management",
    skills: ["Leadership", "System Design", "Agile", "Coaching", "Project Management", "Technical Strategy"],
    min: 180000, max: 260000, exp: "7-10 years",
  },
  {
    title: "Staff Software Engineer",
    category: "Engineering",
    skills: ["System Design", "Distributed Systems", "Leadership", "Go", "Python", "Kubernetes", "Microservices"],
    min: 200000, max: 300000, exp: "8-12 years",
  },
  {
    title: "Principal Engineer",
    category: "Engineering",
    skills: ["System Design", "Architecture", "Leadership", "Distributed Systems", "Strategy"],
    min: 250000, max: 400000, exp: "10-15 years",
  },
  {
    title: "Security Engineer",
    category: "Security",
    skills: ["Penetration Testing", "Network Security", "Python", "AWS Security", "IAM", "Compliance", "SIEM"],
    min: 130000, max: 200000, exp: "4-7 years",
  },
  {
    title: "Site Reliability Engineer",
    category: "DevOps",
    skills: ["Kubernetes", "Go", "Python", "AWS", "Observability", "Prometheus", "Incident Response"],
    min: 150000, max: 220000, exp: "4-7 years",
  },
  {
    title: "Python Developer",
    category: "Engineering",
    skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Docker", "REST APIs", "Git"],
    min: 100000, max: 150000, exp: "2-5 years",
  },
  {
    title: "Go Developer",
    category: "Engineering",
    skills: ["Go", "PostgreSQL", "Docker", "Kubernetes", "gRPC", "REST APIs", "AWS"],
    min: 120000, max: 180000, exp: "3-5 years",
  },
  {
    title: "Rust Developer",
    category: "Engineering",
    skills: ["Rust", "Systems Programming", "Concurrency", "WebAssembly", "CLI Tools", "Linux"],
    min: 130000, max: 200000, exp: "3-6 years",
  },
  {
    title: "Solutions Architect",
    category: "Engineering",
    skills: ["System Design", "AWS", "Microservices", "Docker", "Kubernetes", "Python", "Leadership"],
    min: 170000, max: 250000, exp: "7-10 years",
  },
  {
    title: "Junior Software Engineer",
    category: "Engineering",
    skills: ["JavaScript", "Python", "React", "Git", "SQL", "HTML", "CSS"],
    min: 70000, max: 110000, exp: "0-2 years",
  },
  {
    title: "Software Engineer Intern",
    category: "Engineering",
    skills: ["Programming", "Problem Solving", "Communication", "Git"],
    min: 40000, max: 70000, exp: "0-1 years",
  },
  {
    title: "Technical Writer",
    category: "Support",
    skills: ["Technical Writing", "Documentation", "API Documentation", "Markdown", "Git"],
    min: 80000, max: 130000, exp: "2-4 years",
  },
  {
    title: "Developer Advocate",
    category: "Support",
    skills: ["Public Speaking", "Technical Writing", "Community", "DevTools", "Social Media", "Content Creation"],
    min: 120000, max: 180000, exp: "3-6 years",
  },
  {
    title: "Blockchain Developer",
    category: "Engineering",
    skills: ["Solidity", "Ethereum", "Web3", "JavaScript", "Smart Contracts", "Rust"],
    min: 140000, max: 220000, exp: "3-6 years",
  },
  {
    title: "QA Engineer",
    category: "Engineering",
    skills: ["Testing", "Cypress", "Playwright", "Jest", "CI/CD", "Python", "Selenium"],
    min: 90000, max: 140000, exp: "2-5 years",
  },
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(d: number): string {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
}

function generateDescription(template: typeof roleTemplates[0], company: string): string {
  return `We are looking for a talented ${template.title} to join ${company}. In this role, you will design, build, and maintain cutting-edge solutions that impact millions of users. You'll work with a world-class team using modern technologies and agile methodologies.

Key Responsibilities:
- Design and implement scalable solutions using ${template.skills.slice(0, 3).join(", ")}
- Collaborate with cross-functional teams to define technical requirements
- Mentor junior team members and contribute to code reviews
- Drive technical architecture decisions and best practices

Requirements:
- ${template.exp} of professional software development experience
- Deep expertise in ${template.skills.slice(0, 2).join(" and ")}
- Experience with ${template.skills.slice(2, 4).join(", ")}
- Strong problem-solving and communication skills
- Bachelor's degree in Computer Science or related field (or equivalent experience)

Benefits:
- Competitive salary and equity package
- Comprehensive health, dental, and vision insurance
- 401(k) matching program
- Unlimited PTO policy
- Remote-first work culture
- Annual learning & development budget
- Home office setup stipend`;
}

const jobTypes = ["full_time", "contract", "part_time"] as const;
const remoteTypes = ["remote", "hybrid", "on-site"] as const;

export function generateMockJobs(count: number = 250): MockJob[] {
  const jobs: MockJob[] = [];
  for (let i = 0; i < count; i++) {
    const template = roleTemplates[i % roleTemplates.length];
    const company = pick(companies);
    const location = pick(locations);
    const remote = pick(remoteTypes);
    const jobType = pick(jobTypes);
    const postedDays = Math.floor(Math.random() * 45);
    const salaryMin = template.min + Math.floor(Math.random() * 20000) * (Math.random() > 0.5 ? 1 : -1);
    const salaryMax = template.max + Math.floor(Math.random() * 20000) * (Math.random() > 0.5 ? 1 : -1);
    const clampedMin = Math.max(salaryMin, 30000);
    const clampedMax = Math.max(salaryMax, clampedMin + 5000);
    const postedAt = daysAgo(postedDays);
    const desc = generateDescription(template, company);
    jobs.push({
      id: `mock_job_${i}`,
      source: "mock",
      title: template.title,
      company,
      location,
      salary_min: clampedMin,
      salary_max: clampedMax,
      salary_currency: "USD",
      description: desc,
      requirements: desc.slice(0, 500),
      required_skills: [...template.skills],
      experience_required: template.exp,
      job_type: jobType,
      remote_type: remote,
      apply_url: `https://${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/careers/apply`,
      category: template.category,
      posted_at: postedAt,
      created_at: postedAt,
    });
  }
  return jobs;
}

let cachedJobs: MockJob[] | null = null;

function getCachedJobs(): MockJob[] {
  if (!cachedJobs) {
    cachedJobs = generateMockJobs();
  }
  return cachedJobs;
}

export function searchMockJobs(
  query: string,
  filters: {
    location?: string;
    remote_type?: string;
    salary_min?: number;
    salary_max?: number;
    experience?: string;
    job_type?: string;
    category?: string;
    sort_by?: string;
    days_ago?: number;
  } = {},
  page: number = 1,
  perPage: number = 20
): { jobs: MockJob[]; total: number; total_pages: number } {
  const allJobs = getCachedJobs();
  let filtered = allJobs;

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.required_skills.some((s) => s.toLowerCase().includes(q)) ||
        j.description.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q)
    );
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    filtered = filtered.filter((j) => j.location.toLowerCase().includes(loc));
  }
  if (filters.remote_type) {
    filtered = filtered.filter((j) => j.remote_type === filters.remote_type);
  }
  if (filters.salary_min) {
    filtered = filtered.filter((j) => j.salary_max >= filters.salary_min!);
  }
  if (filters.salary_max) {
    filtered = filtered.filter((j) => j.salary_min <= filters.salary_max!);
  }
  if (filters.experience) {
    filtered = filtered.filter((j) => j.experience_required === filters.experience);
  }
  if (filters.job_type) {
    filtered = filtered.filter((j) => j.job_type === filters.job_type);
  }
  if (filters.category) {
    const cat = filters.category.toLowerCase();
    filtered = filtered.filter((j) => j.category.toLowerCase().includes(cat));
  }
  if (filters.days_ago) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - filters.days_ago);
    filtered = filtered.filter((j) => new Date(j.posted_at) >= cutoff);
  }

  if (filters.sort_by === "salary_high") {
    filtered.sort((a, b) => b.salary_max - a.salary_max);
  } else if (filters.sort_by === "salary_low") {
    filtered.sort((a, b) => a.salary_min - b.salary_min);
  } else if (filters.sort_by === "date") {
    filtered.sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime());
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageJobs = filtered.slice(start, start + perPage);

  return { jobs: pageJobs, total, total_pages: totalPages };
}
