"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { aiService } from "@/services/ai-service";
import { useAIStore } from "@/store/ai-store";

export function useCareerInsight(skills: string[], experience: string = "", education: string = "") {
  const { setCareerInsight } = useAIStore();

  return useQuery({
    queryKey: ["ai", "career-insight", skills, experience, education],
    queryFn: async () => {
      const data = await aiService.analyzeCareer(skills, experience, education);
      setCareerInsight(data);
      return data;
    },
    enabled: skills.length > 0,
    staleTime: 300000,
  });
}

export function useSkillGap(currentSkills: string[], targetRole: string) {
  const { setSkillGap } = useAIStore();

  return useQuery({
    queryKey: ["ai", "skill-gap", currentSkills, targetRole],
    queryFn: async () => {
      const data = await aiService.analyzeSkillGap(currentSkills, targetRole);
      setSkillGap(data);
      return data;
    },
    enabled: currentSkills.length > 0 && targetRole.length > 0,
    staleTime: 300000,
  });
}

export function useCareerRoadmap(
  skills: string[],
  targetRole: string,
  targetIndustry?: string,
  experienceLevel?: string
) {
  const { setCareerRoadmap } = useAIStore();

  return useQuery({
    queryKey: ["ai", "roadmap", skills, targetRole, targetIndustry, experienceLevel],
    queryFn: async () => {
      const data = await aiService.generateRoadmap(skills, targetRole, targetIndustry, experienceLevel);
      setCareerRoadmap(data);
      return data;
    },
    enabled: skills.length > 0 && targetRole.length > 0,
    staleTime: 300000,
  });
}

export function useRecommendations(
  userId: string,
  skills?: string[],
  searchHistory?: string[],
  savedJobs?: any[],
  resumeText?: string,
  limit: number = 20
) {
  const { setRecommendations } = useAIStore();

  return useQuery({
    queryKey: ["ai", "recommendations", userId, skills, limit],
    queryFn: async () => {
      const data = await aiService.getRecommendations(
        userId, skills, searchHistory, savedJobs, resumeText, limit
      );
      setRecommendations(data);
      return data;
    },
    enabled: userId.length > 0,
    staleTime: 120000,
  });
}

export function useTrendingSkills() {
  const { setTrendingSkills } = useAIStore();

  return useQuery({
    queryKey: ["ai", "trending"],
    queryFn: async () => {
      const data = await aiService.getTrendingSkills();
      setTrendingSkills(data.skills);
      return data;
    },
    staleTime: 600000,
  });
}

export function useSemanticMatch() {
  const { setMatchResults } = useAIStore();

  return useMutation({
    mutationFn: async ({ resumeText, jobText }: { resumeText: string; jobText: string }) => {
      const data = await aiService.semanticMatch(resumeText, jobText);
      setMatchResults(data);
      return data;
    },
  });
}

export function useBatchMatch() {
  const { setBatchMatches } = useAIStore();

  return useMutation({
    mutationFn: async ({
      jobs, resumeText, userSkills, topK = 20
    }: {
      jobs: { job_id: string; title: string; description: string; skills: string[] }[];
      resumeText: string;
      userSkills: string[];
      topK?: number;
    }) => {
      const data = await aiService.batchMatch(jobs, resumeText, userSkills, topK);
      setBatchMatches(data.matches);
      return data;
    },
  });
}
