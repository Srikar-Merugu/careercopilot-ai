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

function matchScore(userSkills: string[], jobSkills: string[]): number {
  if (!jobSkills.length) return 50;
  const us = new Set(userSkills.map((s) => s.toLowerCase()));
  const matched = jobSkills.filter((s) => us.has(s.toLowerCase()));
  return Math.round((matched.length / Math.max(jobSkills.length, 1)) * 100);
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
      console.warn("Job search API failed, using fallback mock data:", e);
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

    const userSkillsStr = typeof window !== "undefined" ? localStorage.getItem("cc_user_skills") : null;
    const userSkills = userSkillsStr ? JSON.parse(userSkillsStr) as string[] : [];

    return {
      jobs: result.jobs.map((j) => {
        const job = mockJobToJobData(j);
        return job;
      }),
      total: result.total,
      page,
      per_page: perPage,
      total_pages: result.total_pages,
    };
  },

  async getMatch(jobId: string): Promise<MatchResponse> {
    try {
      const response = await apiClient.get<MatchResponse>(`/jobs/${jobId}/match`);
      return response.data;
    } catch (e) {
      const userSkillsStr = typeof window !== "undefined" ? localStorage.getItem("cc_user_skills") : null;
      const userSkills = userSkillsStr ? JSON.parse(userSkillsStr) as string[] : [];
      const allJobs = searchMockJobs("", {}, 1, 500);
      const job = allJobs.jobs.find((j) => j.id === jobId);
      const score = job ? matchScore(userSkills, job.required_skills) : 50;
      const matched = job?.required_skills.filter((s) => userSkills.some((us) => s.toLowerCase().includes(us.toLowerCase()) || us.toLowerCase().includes(s.toLowerCase()))) || [];
      const missing = job?.required_skills.filter((s) => !matched.includes(s)) || [];
      return {
        success: true,
        data: {
          job_id: jobId,
          match_score: score,
          matched_skills: matched,
          missing_skills: missing,
          strengths: job?.required_skills.slice(0, 3) || [],
          ai_feedback: matched.length > 0
            ? `Your profile matches ${matched.length} of ${job?.required_skills.length || 0} required skills, giving you a ${score}% compatibility score.`
            : "Upload your resume for a personalized AI match analysis.",
        },
      };
    }
  },

  async saveJob(jobId: string): Promise<void> {
    try {
      await apiClient.post(`/jobs/save/${jobId}`);
    } catch (e) {
      const saved = JSON.parse(localStorage.getItem("cc_saved_jobs") || "[]");
      if (!saved.includes(jobId)) {
        saved.push(jobId);
        localStorage.setItem("cc_saved_jobs", JSON.stringify(saved));
      }
    }
  },

  async unsaveJob(jobId: string): Promise<void> {
    try {
      await apiClient.delete(`/jobs/save/${jobId}`);
    } catch (e) {
      const saved = JSON.parse(localStorage.getItem("cc_saved_jobs") || "[]");
      localStorage.setItem("cc_saved_jobs", JSON.stringify(saved.filter((id: string) => id !== jobId)));
    }
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
      }).filter(Boolean);
      return { success: true, data };
    }
  },

  async getRecommendations(): Promise<RecommendationsResponse> {
    try {
      const response = await apiClient.get<RecommendationsResponse>("/jobs/recommendations");
      return response.data;
    } catch (e) {
      const userSkillsStr = typeof window !== "undefined" ? localStorage.getItem("cc_user_skills") : null;
      const userSkills = userSkillsStr ? JSON.parse(userSkillsStr) as string[] : [];
      const allJobs = searchMockJobs("", {}, 1, 500);
      const scored = allJobs.jobs.map((j) => ({
        job: mockJobToJobData(j),
        match: {
          job_id: j.id,
          match_score: matchScore(userSkills, j.required_skills),
          matched_skills: j.required_skills.filter((s) => userSkills.some((us) => s.toLowerCase().includes(us.toLowerCase()))),
          missing_skills: [],
          strengths: [],
          ai_feedback: "",
        },
      }));
      scored.sort((a, b) => b.match.match_score - a.match.match_score);
      return {
        matched_jobs: scored.slice(0, 10),
        trending_jobs: scored.slice(0, 10),
        similar_jobs: scored.slice(0, 10),
        recommended_skills: ["TypeScript", "React", "Python", "Docker", "AWS", "GraphQL", "Next.js", "Kubernetes"],
      };
    }
  },
};
