"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  Briefcase,
  Shield,
  Zap,
  Lightbulb,
  ChevronRight,
  Award,
  BarChart3,
  Globe,
  Layers,
} from "lucide-react";
import { useCareerInsight, useRecommendations, useTrendingSkills } from "@/hooks/use-ai";
import { useAIStore } from "@/store/ai-store";
import { useResumeStore } from "@/store/resume-store";
import { CareerRadarChart } from "@/components/ai/career-radar-chart";
import { SkillGapAnalyzer } from "@/components/ai/skill-gap-analyzer";
import { RecommendationFeed } from "@/components/ai/recommendation-feed";
import { TrendingSkills } from "@/components/ai/trending-skills";
import { CareerPathCard } from "@/components/ai/career-path-card";

const tabs = [
  { id: "insights" as const, label: "Career Insights", icon: Brain },
  { id: "skill-gap" as const, label: "Skill Gap", icon: Target },
  { id: "roadmap" as const, label: "Roadmap", icon: TrendingUp },
  { id: "recommendations" as const, label: "AI Recommendations", icon: Sparkles },
  { id: "matching" as const, label: "Semantic Match", icon: BarChart3 },
];

export default function CareerInsightsPage() {
  const {
    careerInsight, recommendations,
    trendingSkills, isLoading, activeTab, setActiveTab,
  } = useAIStore();
  const { currentAnalysis } = useResumeStore();

  const latestAnalysis = currentAnalysis;
  const userSkills = useMemo(() => {
    if (latestAnalysis?.parsed_skills?.length) return latestAnalysis.parsed_skills;
    return ["Python", "JavaScript", "React", "TypeScript", "SQL"];
  }, [latestAnalysis]);

  const userExperience = latestAnalysis?.parsed_experience?.map(e => `${e.title} at ${e.company} (${e.duration})`).join(". ") || "5 years of software engineering";
  const userEducation = latestAnalysis?.parsed_education?.map(e => `${e.degree} at ${e.institution}`).join(". ") || "Bachelor's in Computer Science";
  const userId = typeof window !== "undefined" ? localStorage.getItem("cc_user_id") || "default-user" : "default-user";

  const { isLoading: insightLoading } = useCareerInsight(userSkills, userExperience, userEducation);
  const { isLoading: recsLoading } = useRecommendations(userId, userSkills);
  const { isLoading: trendingLoading } = useTrendingSkills();

  return (
    <div className="min-h-screen space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Brain className="h-6 w-6 text-primary" />
            AI Career Intelligence
          </h1>
          <p className="text-sm text-[#a0aec0] mt-1">
            Semantic matching · Vector search · AI-powered insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-medium text-primary">
              {careerInsight ? `${Math.round(careerInsight.confidence_score * 100)}% AI Confidence` : "AI Engine Ready"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all relative ${
                isActive
                  ? "text-white bg-white/5 border-t border-l border-r border-white/10"
                  : "text-[#a0aec0] hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "insights" && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Top Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Strengths", value: careerInsight?.strengths.length || 0, icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { label: "Weak Areas", value: careerInsight?.weaknesses.length || 0, icon: Shield, color: "text-amber-400", bg: "bg-amber-500/10" },
                { label: "Missing Skills", value: careerInsight?.missing_skills.length || 0, icon: Target, color: "text-rose-400", bg: "bg-rose-500/10" },
                { label: "Career Paths", value: careerInsight?.career_paths.length || 0, icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
              ].map((stat, i) => {
                const StatIcon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-panel rounded-xl p-4 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#a0aec0] font-medium">{stat.label}</span>
                      <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                        <StatIcon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </motion.div>
                );
              })}
            </div>

            {isLoading || insightLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm text-[#a0aec0]">AI analyzing your career profile...</p>
                </div>
              </div>
            ) : careerInsight ? (
              <>
                {/* AI Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel rounded-xl p-6 border border-white/10 bg-gradient-to-r from-primary/5 to-cyan-500/5 backdrop-blur-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">AI Career Analysis</h3>
                      <p className="text-sm text-[#a0aec0] leading-relaxed">{careerInsight.ai_summary}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Main Analysis Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Strengths & Weaknesses */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Strengths */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel rounded-xl p-6 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl"
                    >
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Award className="h-4 w-4 text-emerald-400" />
                        Key Strengths
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {careerInsight.strengths.map((s, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
                          >
                            <Award className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-[#e2e8f0]">{s}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Weaknesses */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel rounded-xl p-6 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl"
                    >
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-amber-400" />
                        Development Areas
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {careerInsight.weaknesses.map((w, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10"
                          >
                            <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-[#e2e8f0]">{w}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* AI Recommendations */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel rounded-xl p-6 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl"
                    >
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI Recommendations
                      </h3>
                      <div className="space-y-2">
                        {careerInsight.recommendations.map((rec, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex items-start gap-2.5 p-3 rounded-lg bg-white/5 border border-white/5"
                          >
                            <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-sm text-[#e2e8f0]">{rec}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Radar Chart */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel rounded-xl p-6 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl"
                    >
                      <h3 className="text-white font-semibold mb-4 text-sm">Semantic Profile</h3>
                      <div className="h-64">
                        <CareerRadarChart
                          matchScore={careerInsight.confidence_score * 100}
                        />
                      </div>
                    </motion.div>

                    {/* Career Paths */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="glass-panel rounded-xl p-6 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl"
                    >
                      <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        Career Paths
                      </h3>
                      <CareerPathCard paths={careerInsight.career_paths} />
                    </motion.div>

                    {/* Missing Skills */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="glass-panel rounded-xl p-6 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl"
                    >
                      <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
                        <Target className="h-4 w-4 text-rose-400" />
                        Missing Market Skills
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {careerInsight.missing_skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-panel rounded-xl p-12 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl text-center">
                <Brain className="h-12 w-12 text-[#4a5568] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Upload Your Resume</h3>
                <p className="text-sm text-[#a0aec0] max-w-md mx-auto">
                  Upload your resume in the Resume Intelligence section to get AI-powered career insights,
                  semantic matching, and personalized recommendations.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "skill-gap" && (
          <motion.div
            key="skill-gap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <SkillGapAnalyzer />
          </motion.div>
        )}

        {activeTab === "roadmap" && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <SkillGapAnalyzer />
          </motion.div>
        )}

        {activeTab === "recommendations" && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Recommendation Feed
                </h2>
                <span className="text-xs text-[#a0aec0] bg-white/5 px-2 py-1 rounded">
                  {recommendations?.total || 0} recommendations
                </span>
              </div>
              <RecommendationFeed
                recommendations={recommendations?.recommendations || []}
                isLoading={isLoading || recsLoading}
              />
            </div>

            <div className="space-y-6">
              <div className="glass-panel rounded-xl p-5 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  Trending Skills
                </h3>
                <TrendingSkills skills={trendingSkills} isLoading={trendingLoading} />
              </div>

              {careerInsight && (
                <div className="glass-panel rounded-xl p-5 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl">
                  <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Skill Distribution
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: "Strengths", count: careerInsight.strengths.length, color: "bg-emerald-400" },
                      { label: "Weak areas", count: careerInsight.weaknesses.length, color: "bg-amber-400" },
                      { label: "Missing skills", count: careerInsight.missing_skills.length, color: "bg-rose-400" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-[#a0aec0]">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.color} transition-all`}
                              style={{
                                width: `${(item.count / Math.max(
                                  careerInsight.strengths.length,
                                  careerInsight.weaknesses.length,
                                  careerInsight.missing_skills.length,
                                  1
                                )) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-white font-medium text-xs w-4 text-right">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "matching" && (
          <motion.div
            key="matching"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="glass-panel rounded-xl p-6 border border-white/10 bg-gradient-to-r from-primary/5 to-cyan-500/5 backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Semantic Matching Engine
              </h2>
              <p className="text-sm text-[#a0aec0]">
                The AI engine compares your resume against job descriptions using embeddings, vector search,
                and semantic similarity to calculate intelligent match scores.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Vector Similarity",
                  desc: "FAISS-powered vector search compares embeddings of your resume against job descriptions for semantic understanding beyond keywords.",
                  icon: Layers,
                  metric: "1536-dim",
                  sub: "OpenAI embeddings",
                },
                {
                  title: "Skill Matching",
                  desc: "Intelligent skill extraction and comparison across 120+ recognized technologies. Detects matched and missing skills automatically.",
                  icon: Target,
                  metric: "120+ skills",
                  sub: "AI skill detection",
                },
                {
                  title: "Semantic Analysis",
                  desc: "Deep semantic comparison of experience, projects, and qualifications using transformer-based NLP models.",
                  icon: Brain,
                  metric: "94% accuracy",
                  sub: "Transformer-based",
                },
                {
                  title: "Industry Fit",
                  desc: "Cross-references your background against 8 major industry verticals to determine best-fit sectors and roles.",
                  icon: Globe,
                  metric: "8 industries",
                  sub: "Vertical analysis",
                },
              ].map((item, i) => {
                const ItemIcon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-panel rounded-xl p-5 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <ItemIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                        <p className="text-xs text-[#a0aec0] mt-1 leading-relaxed">{item.desc}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[11px] font-semibold text-primary">{item.metric}</span>
                          <span className="text-[10px] text-[#4a5568]">· {item.sub}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="glass-panel rounded-xl p-6 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl">
              <h3 className="text-white font-semibold mb-4">Matching Architecture</h3>
              <div className="grid sm:grid-cols-5 gap-3 text-center">
                {[
                  { step: "1", label: "Embeddings", desc: "Vector generation" },
                  { step: "2", label: "FAISS Index", desc: "Similarity search" },
                  { step: "3", label: "Semantic Match", desc: "AI comparison" },
                  { step: "4", label: "Score Calc", desc: "Multi-factor" },
                  { step: "5", label: "Insights", desc: "Recommendations" },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 rounded-lg bg-white/5 border border-white/5"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center mx-auto mb-2">
                      {item.step}
                    </div>
                    <p className="text-xs font-semibold text-white">{item.label}</p>
                    <p className="text-[10px] text-[#a0aec0]">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
