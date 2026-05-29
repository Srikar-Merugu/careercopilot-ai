import { apiClient } from "./api-client";

export interface MatchResult {
  match_score: number;
  confidence_score: number;
  skill_similarity: number;
  experience_alignment: number;
  semantic_relevance: number;
  industry_fit: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendation: string;
  strengths: string[];
  weaknesses: string[];
}

export interface SkillGapItem {
  skill: string;
  importance_level: string;
  estimated_learning_time: string;
  learning_resources: string[];
  relevance_score: number;
}

export interface SkillGapAnalysis {
  current_skills: string[];
  missing_skills: SkillGapItem[];
  strengths: string[];
  weak_areas: string[];
  overall_readiness: number;
  recommended_path: string[];
}

export interface CareerInsight {
  id: string;
  strengths: string[];
  weaknesses: string[];
  missing_skills: string[];
  recommendations: string[];
  career_paths: CareerPath[];
  ai_summary: string;
  confidence_score: number;
}

export interface CareerPath {
  role: string;
  match: number;
  growth: string;
}

export interface RecommendationItem {
  id: string;
  recommendation_type: string;
  title: string;
  content: string | null;
  source: string | null;
  relevance_score: number;
  metadata: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface RecommendationFeed {
  recommendations: RecommendationItem[];
  total: number;
  has_more: boolean;
}

export interface SimilarityResult {
  similarity_score: number;
  confidence: number;
}

export interface CareerRoadmap {
  current_role_readiness: number;
  gap_analysis: SkillGapItem[];
  recommended_courses: CourseItem[];
  certifications: string[];
  timeline_months: number;
  roadmap_steps: RoadmapStep[];
}

export interface CourseItem {
  skill: string;
  name: string;
  duration: string;
  importance: string;
}

export interface RoadmapStep {
  month: number;
  focus: string;
  action: string;
  duration: string;
  importance: string;
}

export interface BatchMatchResult {
  matches: JobMatchItem[];
  total_matched: number;
  average_score: number;
}

export interface JobMatchItem {
  job_id: string;
  title: string;
  company: string;
  location: string;
  salary: number | null;
  match_score: number;
  confidence_score: number;
  skill_similarity: number;
  experience_alignment: number;
  semantic_relevance: number;
  industry_fit: number;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

export const aiService = {
  async semanticMatch(resumeText: string, jobText: string): Promise<MatchResult> {
    const { data } = await apiClient.post("/ai/match/semantic", {
      resume_text: resumeText,
      job_text: jobText,
    });
    return data;
  },

  async batchMatch(
    jobs: { job_id: string; title: string; description: string; skills: string[] }[],
    resumeText: string,
    userSkills: string[],
    topK: number = 20
  ): Promise<BatchMatchResult> {
    const { data } = await apiClient.post("/ai/match/batch", {
      jobs,
      resume_text: resumeText,
      user_skills: userSkills,
      top_k: topK,
    });
    return data;
  },

  async calculateSimilarity(textA: string, textB: string): Promise<SimilarityResult> {
    const { data } = await apiClient.post("/ai/similarity", {
      text_a: textA,
      text_b: textB,
    });
    return data;
  },

  async analyzeCareer(
    skills: string[],
    experience: string = "",
    education: string = ""
  ): Promise<CareerInsight> {
    const { data } = await apiClient.post("/ai/career/insights", {
      skills,
      experience,
      education,
    });
    return data;
  },

  async analyzeSkillGap(
    currentSkills: string[],
    targetRole: string
  ): Promise<SkillGapAnalysis> {
    const { data } = await apiClient.post("/ai/career/skill-gap", {
      current_skills: currentSkills,
      target_role: targetRole,
    });
    return data;
  },

  async generateRoadmap(
    skills: string[],
    targetRole: string,
    targetIndustry?: string,
    experienceLevel?: string
  ): Promise<CareerRoadmap> {
    const { data } = await apiClient.post("/ai/career/roadmap", {
      skills,
      target_role: targetRole,
      target_industry: targetIndustry,
      experience_level: experienceLevel,
    });
    return data;
  },

  async getRecommendations(
    userId: string,
    skills?: string[],
    searchHistory?: string[],
    savedJobs?: any[],
    resumeText?: string,
    limit: number = 20
  ): Promise<RecommendationFeed> {
    const { data } = await apiClient.post("/ai/recommendations", {
      user_id: userId,
      skills,
      search_history: searchHistory,
      saved_jobs: savedJobs,
      resume_text: resumeText,
      limit,
    });
    return data;
  },

  async getTrendingSkills(): Promise<{ skills: { skill: string; trending_score: number; growth: string }[]; total: number }> {
    const { data } = await apiClient.get("/ai/trending/skills");
    return data;
  },

  async vectorSearch(
    query: string,
    k: number = 10,
    filterType?: string
  ): Promise<{ results: { id: string; score: number; metadata: any }[]; total: number }> {
    const { data } = await apiClient.get("/ai/vector-search", {
      params: { query, k, filter_type: filterType },
    });
    return data;
  },

  async generateEmbeddings(texts: { text: string; embedding_type: string; source_id?: string }[]) {
    const { data } = await apiClient.post("/ai/embeddings/generate", texts);
    return data;
  },
};
