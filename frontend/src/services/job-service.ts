import { apiClient } from "./api-client";
import { JobData, JobMatch, SavedJobItem, JobWithMatch } from "@/store/job-store";
import { searchMockJobs, MockJob } from "@/data/mock-jobs";

interface SearchResponse {
  jobs: JobData[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

interface MatchResponse {
  success: boolean;
  data: JobMatch;
}

interface SavedListResponse {
  success: boolean;
  data: SavedJobItem[];
}

interface RecommendationsResponse {
  matched_jobs: JobWithMatch[];
  trending_jobs: JobWithMatch[];
  similar_jobs: JobWithMatch[];
  recommended_skills: string[];
}

const FALLBACK_SKILLS = ["JavaScript", "Python", "React", "TypeScript", "Node.js", "HTML", "CSS", "Git"];

function getUserSkills(): string[] {
  if (typeof window === "undefined") return FALLBACK_SKILLS;
  try {
    const fromJobStore = localStorage.getItem("cc_user_skills");
    if (fromJobStore) {
      const parsed = JSON.parse(fromJobStore);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const fromResumeStore = localStorage.getItem("resume_store_state");
    if (fromResumeStore) {
      const state = JSON.parse(fromResumeStore);
      const analysis = state?.state?.currentAnalysis;
      if (analysis?.parsed_skills?.length) return analysis.parsed_skills;
    }
  } catch {}
  return FALLBACK_SKILLS;
}

function getUserExperience(): string {
  if (typeof window === "undefined") return "";
  try {
    const exp = localStorage.getItem("cc_user_experience");
    if (exp) {
      const parsed = JSON.parse(exp);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((e: any) => `${e.title} at ${e.company} (${e.duration})`).join(", ");
      }
    }
  } catch {}
  return "";
}

function normalizeSkill(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9+#.]/g, "");
}

function calculateMatchScore(userSkills: string[], jobSkills: string[]): {
  score: number;
  matched: string[];
  missing: string[];
  overlap: number;
} {
  if (!jobSkills.length) return { score: 50, matched: [], missing: [], overlap: 0 };
  if (!userSkills.length) return { score: 20, matched: [], missing: jobSkills, overlap: 0 };

  const normalizedUser = userSkills.map(normalizeSkill);
  const normalizedJob = jobSkills.map(normalizeSkill);

  const matched: string[] = [];
  const missing: string[] = [];

  for (let i = 0; i < jobSkills.length; i++) {
    const js = normalizedJob[i];
    let found = false;
    for (const us of normalizedUser) {
      if (us === js || us.includes(js) || js.includes(us)) {
        found = true;
        break;
      }
    }
    if (found) {
      matched.push(jobSkills[i]);
    } else {
      missing.push(jobSkills[i]);
    }
  }

  const overlap = matched.length;
  const rawScore = (overlap / Math.max(jobSkills.length, 1)) * 100;

  const bonus = Math.min(overlap * 3, 15);
  const finalScore = Math.min(Math.round(rawScore + bonus), 100);

  return { score: finalScore, matched, missing, overlap };
}

function generateFeedback(
  score: number,
  matched: string[],
  missing: string[],
  title: string,
  company: string
): string {
  if (matched.length === 0) {
    return `Upload your resume to see how your skills match this ${title} role at ${company}.`;
  }
  const scoreLabel = score >= 80 ? "Excellent" : score >= 60 ? "Strong" : score >= 40 ? "Good" : "Fair";
  const matchedText = matched.slice(0, 5).join(", ");
  const missingText = missing.slice(0, 5).join(", ");
  let feedback = `${scoreLabel} match! Your profile matches ${matched.length} of ${matched.length + missing.length} required skills`;
  if (matched.length > 0) feedback += ` including ${matchedText}`;
  if (missing.length > 0) feedback += `. Skills to develop: ${missingText}`;
  if (score >= 80) feedback += `. You're a top candidate for this role!`;
  else if (score >= 60) feedback += `. With a few skill upgrades, you'd be an ideal fit.`;
  else feedback += `. Consider building the missing skills to improve your chances.`;
  return feedback;
}

function mockJobToJobData(m: MockJob): JobData {
  return {
    id: m.id,
    source: m.source,
    title: m.title,
    company: m.company,
    location: m.location,
    salary_min: m.salary_min,
    salary_max: m.salary_max,
    salary_currency: m.salary_currency,
    description: m.description,
    requirements: m.requirements,
    required_skills: m.required_skills,
    experience_required: m.experience_required,
    job_type: m.job_type,
    remote_type: m.remote_type,
    apply_url: m.apply_url,
    category: m.category,
    posted_at: m.posted_at,
    created_at: m.created_at,
  };
}

const userSkillsCache = { skills: getUserSkills(), experience: getUserExperience() };

function getMatchDataForJob(job: MockJob, userSkills: string[]): { score: number; matched: string[]; missing: string[] } {
  const allText = `${job.title} ${job.description} ${job.required_skills.join(" ")} ${job.category}`.toLowerCase();
  const inferredSkills: string[] = [];
  const knownTech = [
    "react", "angular", "vue", "next.js", "node.js", "express", "django", "flask", "fastapi",
    "python", "java", "javascript", "typescript", "go", "rust", "c++", "c#", "ruby", "php", "scala",
    "kotlin", "swift", "sql", "postgresql", "mysql", "mongodb", "redis", "graphql", "docker",
    "kubernetes", "aws", "gcp", "azure", "terraform", "jenkins", "git", "linux", "html", "css",
    "tailwind", "bootstrap", "sass", "redux", "jest", "cypress", "pytorch", "tensorflow",
    "machine learning", "deep learning", "nlp", "computer vision", "data science", "pandas",
    "numpy", "scikit-learn", "tableau", "power bi", "spark", "kafka", "airflow",
  ];
  for (const tech of knownTech) {
    if (allText.includes(tech)) {
      inferredSkills.push(tech);
    }
  }
  const combinedSkills = [...new Set([...job.required_skills, ...inferredSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1))])];
  return calculateMatchScore(userSkills, combinedSkills);
}

export const jobService = {
  async search(params: Record<string, string | number>): Promise<SearchResponse> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          queryParams.set(key, String(value));
        }
      });
      const response = await apiClient.get<SearchResponse>(
        `/jobs/search?${queryParams.toString()}`
      );
      if (response.data?.jobs?.length) {
        return response.data;
      }
    } catch (e) {
      console.warn("Job search API fell back to local data:");
    }

    const query = String(params.query || "");
    const page = Number(params.page) || 1;
    const perPage = Number(params.per_page) || 20;
    const sortBy = String(params.sort_by || "match_score");
    const result = searchMockJobs(query, {
      location: String(params.location || ""),
      remote_type: String(params.remote_type || ""),
      salary_min: Number(params.salary_min) || 0,
      salary_max: Number(params.salary_max) || 0,
      experience: String(params.experience || ""),
      job_type: String(params.job_type || ""),
      category: String(params.category || ""),
      sort_by: sortBy,
      days_ago: Number(params.days_ago) || 0,
    }, page, perPage);

    return {
      jobs: result.jobs.map((j) => mockJobToJobData(j)),
      total: result.total,
      page,
      per_page: perPage,
      total_pages: result.total_pages,
    };
  },

  async getJob(jobId: string): Promise<{ success: boolean; data: JobData }> {
    try {
      const response = await apiClient.get<{ success: boolean; data: JobData }>(`/jobs/${jobId}`);
      return response.data;
    } catch (e) {
      const allJobs = searchMockJobs("", {}, 1, 500);
      const job = allJobs.jobs.find((j) => j.id === jobId);
      if (!job) throw new Error("Job not found");
      return { success: true, data: mockJobToJobData(job) };
    }
  },

  async getMatch(jobId: string): Promise<MatchResponse> {
    try {
      const response = await apiClient.get<MatchResponse>(`/jobs/${jobId}/match`);
      return response.data;
    } catch (e) {
      const userSkills = getUserSkills();
      const allJobs = searchMockJobs("", {}, 1, 500);
      const job = allJobs.jobs.find((j) => j.id === jobId);
      if (!job) {
        return { success: true, data: { job_id: jobId, match_score: 0, matched_skills: [], missing_skills: [], strengths: [], ai_feedback: "Job not found." } };
      }
      const { score, matched, missing } = getMatchDataForJob(job, userSkills);
      return {
        success: true,
        data: {
          job_id: jobId,
          match_score: score,
          matched_skills: matched,
          missing_skills: missing,
          strengths: matched.slice(0, 3),
          ai_feedback: generateFeedback(score, matched, missing, job.title, job.company),
        },
      };
    }
  },

  async saveJob(jobId: string): Promise<void> {
    await apiClient.post(`/jobs/save/${jobId}`);
  },

  async unsaveJob(jobId: string): Promise<void> {
    await apiClient.delete(`/jobs/save/${jobId}`);
  },

  async listSaved(): Promise<SavedListResponse> {
    try {
      const response = await apiClient.get<SavedListResponse>("/jobs/saved/list");
      return response.data;
    } catch (e) {
      const savedIds = JSON.parse(localStorage.getItem("cc_saved_jobs") || "[]");
      const allJobs = searchMockJobs("", {}, 1, 500);
      const data = savedIds.map((id: string) => {
        const job = allJobs.jobs.find((j) => j.id === id);
        return job ? {
          id,
          job_id: id,
          job: mockJobToJobData(job),
          saved_at: new Date().toISOString(),
        } : null;
      }).filter(Boolean) as SavedJobItem[];
      return { success: true, data };
    }
  },

  async getRecommendations(): Promise<RecommendationsResponse> {
    try {
      const response = await apiClient.get<RecommendationsResponse>("/jobs/recommendations");
      return response.data;
    } catch (e) {
      const userSkills = getUserSkills();
      const allJobs = searchMockJobs("", {}, 1, 500);
      const scored = allJobs.jobs.map((j) => {
        const { score, matched, missing } = getMatchDataForJob(j, userSkills);
        return {
          job: mockJobToJobData(j),
          match: {
            job_id: j.id,
            match_score: score,
            matched_skills: matched,
            missing_skills: missing,
            strengths: matched.slice(0, 3),
            ai_feedback: generateFeedback(score, matched, missing, j.title, j.company),
          },
        };
      });
      scored.sort((a, b) => b.match.match_score - a.match.match_score);
      return {
        matched_jobs: scored.slice(0, 10),
        trending_jobs: scored.slice(0, 10),
        similar_jobs: scored.slice(0, 10),
        recommended_skills: [...new Set(scored.slice(0, 20).flatMap((s) => s.match.missing_skills))].slice(0, 10),
      };
    }
  },
};
