import { create } from "zustand";
import { CareerInsight, SkillGapAnalysis, CareerRoadmap, RecommendationFeed, MatchResult, JobMatchItem } from "@/services/ai-service";

export interface AIState {
  careerInsight: CareerInsight | null;
  skillGap: SkillGapAnalysis | null;
  careerRoadmap: CareerRoadmap | null;
  recommendations: RecommendationFeed | null;
  matchResults: MatchResult | null;
  batchMatches: JobMatchItem[];
  trendingSkills: { skill: string; trending_score: number; growth: string }[];
  isLoading: boolean;
  error: string | null;
  activeTab: "insights" | "skill-gap" | "roadmap" | "recommendations" | "matching";

  setCareerInsight: (insight: CareerInsight | null) => void;
  setSkillGap: (gap: SkillGapAnalysis | null) => void;
  setCareerRoadmap: (roadmap: CareerRoadmap | null) => void;
  setRecommendations: (recs: RecommendationFeed | null) => void;
  setMatchResults: (match: MatchResult | null) => void;
  setBatchMatches: (matches: JobMatchItem[]) => void;
  setTrendingSkills: (skills: { skill: string; trending_score: number; growth: string }[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: "insights" | "skill-gap" | "roadmap" | "recommendations" | "matching") => void;
  reset: () => void;
}

const initialState = {
  careerInsight: null,
  skillGap: null,
  careerRoadmap: null,
  recommendations: null,
  matchResults: null,
  batchMatches: [],
  trendingSkills: [],
  isLoading: false,
  error: null,
  activeTab: "insights" as const,
};

export const useAIStore = create<AIState>((set) => ({
  ...initialState,

  setCareerInsight: (insight) => set({ careerInsight: insight }),
  setSkillGap: (gap) => set({ skillGap: gap }),
  setCareerRoadmap: (roadmap) => set({ careerRoadmap: roadmap }),
  setRecommendations: (recs) => set({ recommendations: recs }),
  setMatchResults: (match) => set({ matchResults: match }),
  setBatchMatches: (matches) => set({ batchMatches: matches }),
  setTrendingSkills: (skills) => set({ trendingSkills: skills }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  reset: () => set(initialState),
}));
