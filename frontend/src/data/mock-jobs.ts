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

const INDIAN_COMPANIES = [
  { name: "Google India", domain: "google.com/careers" },
  { name: "Microsoft India", domain: "microsoft.com/careers" },
  { name: "Amazon India", domain: "amazon.jobs/location/bangalore-india" },
  { name: "Swiggy", domain: "swiggy.com/careers" },
  { name: "Zomato", domain: "zomato.com/careers" },
  { name: "Razorpay", domain: "razorpay.com/careers" },
  { name: "Flipkart", domain: "flipkart.com/careers" },
  { name: "Meesho", domain: "meesho.com/careers" },
  { name: "Zepto", domain: "zeptonow.com/careers" },
  { name: "Infosys", domain: "infosys.com/careers" },
  { name: "TCS", domain: "tcs.com/careers" },
  { name: "Accenture India", domain: "accenture.com/in-en/careers" },
  { name: "Deloitte India", domain: "deloitte.com/in/careers" },
  { name: "PhonePe", domain: "phonepe.com/careers" },
  { name: "CRED", domain: "cred.club/careers" },
  { name: "Groww", domain: "groww.in/careers" },
  { name: "Upstox", domain: "upstox.com/careers" },
  { name: "Zerodha", domain: "zerodha.com/careers" },
  { name: "BharatPe", domain: "bharatpe.com/careers" },
  { name: "Paytm", domain: "paytm.com/careers" },
  { name: "Ola", domain: "olacabs.com/careers" },
  { name: "Rapido", domain: "rapido.bike/careers" },
  { name: "Oyo", domain: "oyorooms.com/careers" },
  { name: "Nykaa", domain: "nykaa.com/careers" },
  { name: "Urban Company", domain: "urbancompany.com/careers" },
  { name: "Unacademy", domain: "unacademy.com/careers" },
  { name: "BYJU'S", domain: "byjus.com/careers" },
  { name: "Dream11", domain: "dream11.com/careers" },
  { name: "ShareChat", domain: "sharechat.com/careers" },
  { name: "InMobi", domain: "inmobi.com/careers" },
  { name: "Freshworks", domain: "freshworks.com/careers" },
  { name: "Chargebee", domain: "chargebee.com/careers" },
  { name: "Postman India", domain: "postman.com/company/careers" },
  { name: "BrowserStack", domain: "browserstack.com/careers" },
  { name: "Hasura", domain: "hasura.io/careers" },
  { name: "Appsmith", domain: "appsmith.com/careers" },
  { name: "Druva", domain: "druva.com/careers" },
  { name: "Whatfix", domain: "whatfix.com/careers" },
  { name: "Uniphore", domain: "uniphore.com/careers" },
  { name: "Yellow.ai", domain: "yellow.ai/careers" },
  { name: "Mad Street Den", domain: "madstreetden.com/careers" },
  { name: "Cure.fit", domain: "curefit.com/careers" },
  { name: "Licious", domain: "licious.com/careers" },
  { name: "Moglix", domain: "moglix.com/careers" },
  { name: "Zetwerk", domain: "zetwerk.com/careers" },
  { name: "Navan", domain: "navan.com/careers" },
  { name: "Slice", domain: "sliceit.com/careers" },
  { name: "Jupiter", domain: "jupiter.money/careers" },
  { name: "Navadhan", domain: "navadhan.com/careers" },
  { name: "CoinSwitch", domain: "coinswitch.co/careers" },
  { name: "Khatabook", domain: "khatabook.com/careers" },
  { name: "OkCredit", domain: "okcredit.in/careers" },
  { name: "Porter", domain: "porter.in/careers" },
  { name: "Shadowfax", domain: "shadowfax.in/careers" },
  { name: "Dunzo", domain: "dunzo.com/careers" },
  { name: "Amazon Pay India", domain: "amazon.jobs/location/hyderabad-india" },
  { name: "Google Hyderabad", domain: "google.com/careers" },
  { name: "Microsoft Hyderabad", domain: "microsoft.com/careers" },
  { name: "Salesforce India", domain: "salesforce.com/company/careers" },
  { name: "Adobe India", domain: "adobe.com/careers" },
  { name: "Intel India", domain: "intel.com/careers" },
  { name: "IBM India", domain: "ibm.com/in-en/employment" },
  { name: "Oracle India", domain: "oracle.com/careers" },
  { name: "Cisco India", domain: "cisco.com/careers" },
  { name: "VMware India", domain: "vmware.com/careers" },
  { name: "SAP India", domain: "sap.com/careers" },
  { name: "Goldman Sachs India", domain: "goldmansachs.com/careers" },
  { name: "JPMorgan India", domain: "jpmorgan.com/global/careers" },
  { name: "Walmart India", domain: "walmart.com/careers" },
  { name: "Uber India", domain: "uber.com/us/en/careers" },
  { name: "Meta India", domain: "metacareers.com" },
  { name: "Apple India", domain: "apple.com/careers/in" },
  { name: "Netflix India", domain: "netflix.com/jobs" },
  { name: "Twitter India", domain: "twitter.com/careers" },
  { name: "LinkedIn India", domain: "linkedin.com/company/linkedin/careers" },
  { name: "PayPal India", domain: "paypal.com/careers" },
  { name: "Spotify India", domain: "spotify.com/careers" },
  { name: "Stripe India", domain: "stripe.com/jobs" },
  { name: "Shopify India", domain: "shopify.com/careers" },
  { name: "Atlassian India", domain: "atlassian.com/company/careers" },
  { name: "HubSpot India", domain: "hubspot.com/careers" },
  { name: "Twilio India", domain: "twilio.com/company/careers" },
  { name: "Datadog India", domain: "datadoghq.com/careers" },
  { name: "Snowflake India", domain: "snowflake.com/careers" },
  { name: "Confluent India", domain: "confluent.io/careers" },
  { name: "MongoDB India", domain: "mongodb.com/careers" },
  { name: "Elastic India", domain: "elastic.co/careers" },
  { name: "Cloudflare India", domain: "cloudflare.com/careers" },
  { name: "GitHub India", domain: "github.com/about/careers" },
  { name: "GitLab India", domain: "about.gitlab.com/jobs" },
  { name: "Vercel India", domain: "vercel.com/careers" },
  { name: "Pine Labs", domain: "pinelabs.com/careers" },
  { name: "Razorpay X", domain: "razorpay.com/careers" },
  { name: "Cashfree", domain: "cashfree.com/careers" },
  { name: "PayU India", domain: "payu.com/careers" },
  { name: "BillDesk", domain: "billdesk.com/careers" },
  { name: "Zeta", domain: "zeta.tech/careers" },
  { name: "Juspay", domain: "juspay.in/careers" },
  { name: "Setu", domain: "setu.io/careers" },
  { name: "Signzy", domain: "signzy.com/careers" },
  { name: "BankBazaar", domain: "bankbazaar.com/careers" },
  { name: "PolicyBazaar", domain: "policybazaar.com/careers" },
  { name: "Acko", domain: "acko.com/careers" },
  { name: "Ditto Insurance", domain: "dittoinsurance.com/careers" },
  { name: "FamPay", domain: "fampay.in/careers" },
  { name: "Yelo", domain: "yelo.com/careers" },
  { name: "Jar", domain: "jar.app/careers" },
  { name: "Kuvera", domain: "kuvera.in/careers" },
  { name: "Smallcase", domain: "smallcase.com/careers" },
  { name: "Vested", domain: "vested.com/careers" },
  { name: "Wright Research", domain: "wrightresearch.com/careers" },
];

const INDIAN_CITIES = [
  "Hyderabad, Telangana",
  "Bangalore, Karnataka",
  "Pune, Maharashtra",
  "Chennai, Tamil Nadu",
  "Mumbai, Maharashtra",
  "Gurgaon, Haryana",
  "Noida, Uttar Pradesh",
  "Delhi, India",
  "Kolkata, West Bengal",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Chandigarh, India",
  "Thiruvananthapuram, Kerala",
  "Coimbatore, Tamil Nadu",
  "Indore, Madhya Pradesh",
  "Bhubaneswar, Odisha",
  "Remote - India",
  "Remote - Bangalore",
  "Remote - Hyderabad",
  "Remote - India (Anywhere)",
];

const ROLE_TEMPLATES = [
  { title: "Frontend Engineer", category: "Engineering", skills: ["React", "TypeScript", "Next.js", "CSS", "HTML", "Jest", "GraphQL"], min: 1200000, max: 2500000, exp: "2-5 years" },
  { title: "Senior Frontend Engineer", category: "Engineering", skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "GraphQL", "Storybook", "Jest", "System Design"], min: 2200000, max: 4500000, exp: "5-8 years" },
  { title: "Backend Engineer", category: "Engineering", skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS"], min: 1400000, max: 3000000, exp: "3-5 years" },
  { title: "Senior Backend Engineer", category: "Engineering", skills: ["Python", "Go", "PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes", "AWS", "Microservices"], min: 2500000, max: 5000000, exp: "5-8 years" },
  { title: "Full Stack Developer", category: "Engineering", skills: ["React", "Node.js", "TypeScript", "MongoDB", "Express", "Docker", "AWS"], min: 1200000, max: 2800000, exp: "2-5 years" },
  { title: "Senior Full Stack Engineer", category: "Engineering", skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS", "System Design", "GraphQL"], min: 2400000, max: 4800000, exp: "5-8 years" },
  { title: "React Developer", category: "Engineering", skills: ["React", "JavaScript", "TypeScript", "Redux", "CSS", "HTML", "Jest"], min: 1000000, max: 2200000, exp: "1-4 years" },
  { title: "Next.js Developer", category: "Engineering", skills: ["Next.js", "React", "TypeScript", "TailwindCSS", "Vercel", "PostgreSQL"], min: 1200000, max: 2500000, exp: "2-5 years" },
  { title: "Node.js Developer", category: "Engineering", skills: ["Node.js", "Express", "TypeScript", "MongoDB", "PostgreSQL", "Redis", "Docker"], min: 1200000, max: 2500000, exp: "2-5 years" },
  { title: "Python Developer", category: "Engineering", skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Docker", "REST APIs", "Pandas"], min: 1000000, max: 2200000, exp: "1-4 years" },
  { title: "Java Developer", category: "Engineering", skills: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "Docker", "Kubernetes", "AWS"], min: 1200000, max: 2800000, exp: "3-6 years" },
  { title: "Go Developer", category: "Engineering", skills: ["Go", "PostgreSQL", "Docker", "Kubernetes", "gRPC", "REST APIs", "AWS"], min: 1500000, max: 3500000, exp: "3-6 years" },
  { title: "AI Engineer", category: "AI/ML", skills: ["Python", "TensorFlow", "PyTorch", "NLP", "LangChain", "OpenAI", "RAG", "Vector Databases"], min: 1800000, max: 4000000, exp: "3-6 years" },
  { title: "Senior AI/ML Engineer", category: "AI/ML", skills: ["Python", "PyTorch", "TensorFlow", "MLOps", "Kubernetes", "AWS", "NLP", "Computer Vision"], min: 2800000, max: 5500000, exp: "5-8 years" },
  { title: "Machine Learning Engineer", category: "AI/ML", skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "SQL", "Docker", "AWS"], min: 1500000, max: 3500000, exp: "3-6 years" },
  { title: "Data Scientist", category: "Data", skills: ["Python", "SQL", "Statistics", "Machine Learning", "Pandas", "NumPy", "Tableau"], min: 1400000, max: 3200000, exp: "3-5 years" },
  { title: "Data Analyst", category: "Data", skills: ["SQL", "Python", "Tableau", "Power BI", "Excel", "Statistics", "Pandas"], min: 700000, max: 1500000, exp: "1-4 years" },
  { title: "Senior Data Analyst", category: "Data", skills: ["SQL", "Python", "Tableau", "Statistics", "A/B Testing", "Experimental Design", "Big Data"], min: 1500000, max: 3000000, exp: "4-7 years" },
  { title: "Data Engineer", category: "Data", skills: ["Python", "Spark", "Airflow", "Snowflake", "dbt", "AWS", "Kafka", "SQL"], min: 1500000, max: 3500000, exp: "3-6 years" },
  { title: "DevOps Engineer", category: "DevOps", skills: ["Docker", "Kubernetes", "Terraform", "AWS", "CI/CD", "Linux", "Prometheus", "Grafana"], min: 1400000, max: 3000000, exp: "3-6 years" },
  { title: "Senior DevOps Engineer", category: "DevOps", skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Helm", "ArgoCD", "Prometheus", "Linux"], min: 2400000, max: 4800000, exp: "5-8 years" },
  { title: "Platform Engineer", category: "DevOps", skills: ["Kubernetes", "Go", "Terraform", "AWS", "Docker", "CI/CD", "Linux"], min: 1800000, max: 3800000, exp: "4-7 years" },
  { title: "Cloud Engineer", category: "DevOps", skills: ["AWS", "Azure", "GCP", "Terraform", "Docker", "Kubernetes", "Linux"], min: 1200000, max: 2800000, exp: "2-5 years" },
  { title: "Cloud Architect", category: "DevOps", skills: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "System Design", "Networking"], min: 3000000, max: 6000000, exp: "8-12 years" },
  { title: "iOS Developer", category: "Mobile", skills: ["Swift", "SwiftUI", "UIKit", "Xcode", "Core Data", "Firebase", "REST APIs"], min: 1400000, max: 3000000, exp: "2-5 years" },
  { title: "Android Developer", category: "Mobile", skills: ["Kotlin", "Java", "Android SDK", "Jetpack Compose", "Firebase", "REST APIs"], min: 1200000, max: 2800000, exp: "2-5 years" },
  { title: "React Native Developer", category: "Mobile", skills: ["React Native", "TypeScript", "iOS", "Android", "Redux", "Firebase", "Expo"], min: 1200000, max: 2600000, exp: "2-5 years" },
  { title: "Flutter Developer", category: "Mobile", skills: ["Flutter", "Dart", "Firebase", "REST APIs", "Git", "iOS", "Android"], min: 1000000, max: 2200000, exp: "1-4 years" },
  { title: "UI/UX Designer", category: "Design", skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems", "CSS", "HTML"], min: 800000, max: 2000000, exp: "2-5 years" },
  { title: "Senior Product Designer", category: "Design", skills: ["Figma", "Design Systems", "User Research", "Prototyping", "Interaction Design", "Leadership"], min: 2000000, max: 4000000, exp: "5-8 years" },
  { title: "Product Manager", category: "Product", skills: ["Product Strategy", "Roadmapping", "A/B Testing", "Analytics", "Agile", "JIRA", "SQL"], min: 1800000, max: 4000000, exp: "4-7 years" },
  { title: "Technical Product Manager", category: "Product", skills: ["Product Strategy", "API Design", "Analytics", "Agile", "SQL", "System Design", "Leadership"], min: 2200000, max: 5000000, exp: "5-8 years" },
  { title: "Associate Product Manager", category: "Product", skills: ["Product Thinking", "Analytics", "SQL", "User Research", "Communication", "Agile"], min: 1000000, max: 2000000, exp: "1-3 years" },
  { title: "Engineering Manager", category: "Management", skills: ["Leadership", "System Design", "Agile", "Coaching", "Project Management", "Technical Strategy"], min: 3500000, max: 7000000, exp: "8-12 years" },
  { title: "Staff Software Engineer", category: "Engineering", skills: ["System Design", "Distributed Systems", "Leadership", "Go", "Python", "Kubernetes", "Microservices"], min: 4000000, max: 8000000, exp: "9-15 years" },
  { title: "Principal Engineer", category: "Engineering", skills: ["System Design", "Architecture", "Leadership", "Distributed Systems", "Strategy"], min: 5000000, max: 10000000, exp: "12-18 years" },
  { title: "Security Engineer", category: "Security", skills: ["Penetration Testing", "Network Security", "Python", "AWS Security", "IAM", "Compliance", "SIEM"], min: 1500000, max: 3500000, exp: "3-6 years" },
  { title: "Site Reliability Engineer", category: "DevOps", skills: ["Kubernetes", "Go", "Python", "AWS", "Observability", "Prometheus", "Incident Response"], min: 2000000, max: 4500000, exp: "4-8 years" },
  { title: "QA Engineer", category: "Engineering", skills: ["Testing", "Cypress", "Playwright", "Jest", "CI/CD", "Python", "Selenium"], min: 700000, max: 1800000, exp: "1-4 years" },
  { title: "SDET", category: "Engineering", skills: ["Python", "Java", "Selenium", "Appium", "Cypress", "CI/CD", "Automation"], min: 1200000, max: 2800000, exp: "3-6 years" },
  { title: "Technical Writer", category: "Support", skills: ["Technical Writing", "Documentation", "API Documentation", "Markdown", "Git"], min: 600000, max: 1500000, exp: "1-4 years" },
  { title: "Developer Advocate", category: "Support", skills: ["Public Speaking", "Technical Writing", "Community", "DevTools", "Social Media", "Content Creation"], min: 1800000, max: 3500000, exp: "4-7 years" },
  { title: "Blockchain Developer", category: "Engineering", skills: ["Solidity", "Ethereum", "Web3", "JavaScript", "Smart Contracts", "Rust"], min: 2000000, max: 5000000, exp: "3-6 years" },
  { title: "Solutions Architect", category: "Engineering", skills: ["System Design", "AWS", "Microservices", "Docker", "Kubernetes", "Python", "Leadership"], min: 3500000, max: 7000000, exp: "8-12 years" },
  { title: "Junior Software Engineer", category: "Engineering", skills: ["JavaScript", "Python", "React", "Git", "SQL", "HTML", "CSS"], min: 500000, max: 1200000, exp: "0-2 years" },
  { title: "Software Engineer Intern", category: "Engineering", skills: ["Programming", "Problem Solving", "Communication", "Git"], min: 200000, max: 500000, exp: "0-1 years" },
  { title: "SDE 1", category: "Engineering", skills: ["Data Structures", "Algorithms", "Java", "Python", "SQL", "Git", "Problem Solving"], min: 1200000, max: 2500000, exp: "1-3 years" },
  { title: "SDE 2", category: "Engineering", skills: ["System Design", "Distributed Systems", "Java", "Python", "Docker", "SQL", "Microservices"], min: 2500000, max: 4500000, exp: "3-6 years" },
  { title: "SDE 3", category: "Engineering", skills: ["System Design", "Architecture", "Distributed Systems", "Leadership", "Java", "Python", "Kubernetes"], min: 4000000, max: 7000000, exp: "6-10 years" },
  { title: "Database Engineer", category: "Engineering", skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra", "SQL", "Performance Tuning"], min: 1500000, max: 3500000, exp: "3-6 years" },
  { title: "DevSecOps Engineer", category: "Security", skills: ["Kubernetes", "Docker", "Terraform", "AWS", "Security", "Compliance", "CI/CD", "Python"], min: 1800000, max: 4000000, exp: "4-7 years" },
  { title: "Machine Learning Ops Engineer", category: "AI/ML", skills: ["Python", "MLflow", "Kubernetes", "Docker", "AWS", "CI/CD", "TensorFlow", "PyTorch"], min: 2000000, max: 4500000, exp: "4-7 years" },
  { title: "NLP Engineer", category: "AI/ML", skills: ["Python", "NLP", "Transformers", "PyTorch", "LangChain", "OpenAI", "BERT", "GPT"], min: 1800000, max: 4000000, exp: "3-6 years" },
  { title: "Computer Vision Engineer", category: "AI/ML", skills: ["Python", "Computer Vision", "OpenCV", "PyTorch", "TensorFlow", "Deep Learning", "Image Processing"], min: 1800000, max: 4000000, exp: "3-6 years" },
  { title: "Growth Engineer", category: "Engineering", skills: ["JavaScript", "Python", "SQL", "A/B Testing", "Analytics", "Growth Hacking", "Experimentation"], min: 1500000, max: 3500000, exp: "3-6 years" },
  { title: "Backend Intern", category: "Engineering", skills: ["Python", "Django", "SQL", "Git", "REST APIs", "Problem Solving"], min: 200000, max: 500000, exp: "0-1 years" },
  { title: "Frontend Intern", category: "Engineering", skills: ["React", "JavaScript", "CSS", "HTML", "Git", "TypeScript"], min: 200000, max: 500000, exp: "0-1 years" },
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(d: number): string {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
}

function generateDescription(template: typeof ROLE_TEMPLATES[0], company: string): string {
  return `We are looking for a talented ${template.title} to join ${company} in India. You will design, build, and maintain cutting-edge solutions that impact millions of users across the country. Work with a world-class team using modern technologies and agile methodologies.

Key Responsibilities:
- Design and implement scalable solutions using ${template.skills.slice(0, 3).join(", ")}
- Collaborate with cross-functional teams across our India offices
- Mentor junior team members and contribute to code reviews
- Drive technical architecture decisions and best practices

Requirements:
- ${template.exp} of professional software development experience
- Deep expertise in ${template.skills.slice(0, 2).join(" and ")}
- Experience with ${template.skills.slice(2, 4).join(", ")}
- Strong problem-solving and communication skills
- Bachelor's degree in Computer Science or related field (or equivalent experience)

Benefits:
- Competitive salary with ESOPs/RSUs
- Comprehensive health insurance for you and your family
- Provident Fund contributions
- Flexible work hours
- Remote/hybrid work options
- Annual learning & development budget
- Free meals and snacks at office
- Gym/wellness reimbursement`;
}

const jobTypes = ["full_time", "contract", "part_time"] as const;
const remoteTypes = ["remote", "hybrid", "on-site"] as const;

function getCompany(): { name: string; domain: string } {
  return pick(INDIAN_COMPANIES);
}

function getLocation(): string {
  return pick(INDIAN_CITIES);
}

function getApplyUrl(companyName: string, title: string, domain: string): string {
  const name = companyName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const role = title.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const encodedRole = encodeURIComponent(title);
  const encodedCompany = encodeURIComponent(companyName);

  const templates = [
    `https://www.linkedin.com/jobs/search/?keywords=${encodedRole}&location=India`,
    `https://www.naukri.com/${role}-jobs-in-india`,
    `https://internshala.com/internships/${role}-internship`,
    `https://wellfound.com/company/${name}/jobs`,
    `https://www.instahyre.com/jobs/${role}/`,
    `https://cutshort.io/jobs?q=${encodedRole}`,
    `https://hasjob.co/search?q=${encodedRole}`,
    `https://www.freshersworld.com/jobs/${role}`,
    `https://www.timesjobs.com/candidate/job-search.html?searchText=${encodedRole}`,
    `https://www.monsterindia.com/search/${role}-jobs`,
  ];

  return pick(templates);
}

let cachedJobs: MockJob[] | null = null;

export function getCachedJobs(): MockJob[] {
  if (!cachedJobs) {
    cachedJobs = generateMockJobs();
  }
  return cachedJobs;
}

export function clearCache(): void {
  cachedJobs = null;
}

export function generateMockJobs(count: number = 350): MockJob[] {
  const jobs: MockJob[] = [];
  const usedTitles = new Set<string>();

  for (let i = 0; i < count; i++) {
    const template = ROLE_TEMPLATES[i % ROLE_TEMPLATES.length];
    const company = getCompany();
    const location = getLocation();
    const remote = pick(remoteTypes);
    const jobType = pick(jobTypes);
    const postedDays = Math.floor(Math.random() * 45);

    const salaryVariation = () => Math.floor(Math.random() * 600000) * (Math.random() > 0.5 ? 1 : -1);
    const salaryMin = Math.max(template.min + salaryVariation(), 200000);
    const salaryMax = Math.max(salaryMin + 300000 + Math.floor(Math.random() * 1500000), salaryMin + 300000);

    const postedAt = daysAgo(postedDays);
    const desc = generateDescription(template, company.name);

    const title = usedTitles.has(template.title + company.name)
      ? template.title + ` (${location.split(",")[0]})`
      : template.title;
    usedTitles.add(template.title + company.name);

    jobs.push({
      id: `indian_job_${i}`,
      source: "indian",
      title,
      company: company.name,
      location,
      salary_min: salaryMin,
      salary_max: salaryMax,
      salary_currency: "INR",
      description: desc,
      requirements: desc.slice(0, 500),
      required_skills: [...template.skills],
      experience_required: template.exp,
      job_type: jobType,
      remote_type: remote,
      apply_url: getApplyUrl(company.name, template.title, company.domain),
      category: template.category,
      posted_at: postedAt,
      created_at: postedAt,
    });
  }
  return jobs;
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
        j.category.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
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
