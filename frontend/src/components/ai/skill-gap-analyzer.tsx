"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, TrendingUp, AlertCircle, CheckCircle2, Clock, Target } from "lucide-react";
import { useSkillGap, useCareerRoadmap } from "@/hooks/use-ai";
import { useAIStore } from "@/store/ai-store";
import { MatchScoreRing } from "./match-score-ring";

const POPULAR_ROLES = [
  "Frontend Developer",
  "Backend Engineer",
  "Full Stack Developer",
  "DevOps Engineer",
  "ML Engineer",
  "Data Scientist",
  "Engineering Manager",
  "Product Manager",
  "Cloud Architect",
  "AI Engineer",
];

export function SkillGapAnalyzer() {
  const { skillGap, careerRoadmap, isLoading } = useAIStore();
  const [skillsInput, setSkillsInput] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [showRoadmap, setShowRoadmap] = useState(false);

  const skillList = skillsInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const targetRole = selectedRole || customRole;

  const { refetch: analyzeGap } = useSkillGap(skillList, targetRole);
  const { refetch: getRoadmap } = useCareerRoadmap(skillList, targetRole);

  const handleAnalyze = async () => {
    if (skillList.length === 0 || !targetRole) return;
    setShowRoadmap(false);
    await analyzeGap();
  };

  const handleRoadmap = async () => {
    if (skillList.length === 0 || !targetRole) return;
    setShowRoadmap(true);
    await getRoadmap();
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-xl p-6 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Skill Gap Analyzer
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#a0aec0] mb-2">Your Skills (comma-separated)</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Python, React, Docker, SQL, AWS"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-[#a0aec0] mb-2">Target Role</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {POPULAR_ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    setCustomRole("");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    selectedRole === role
                      ? "bg-primary/20 border-primary/40 text-primary"
                      : "bg-white/5 border-white/10 text-[#a0aec0] hover:border-white/20"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={customRole}
              onChange={(e) => {
                setCustomRole(e.target.value);
                setSelectedRole("");
              }}
              placeholder="Or type a custom role..."
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={skillList.length === 0 || !targetRole}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Search className="h-4 w-4" />
              Analyze Gap
            </button>
            <button
              onClick={handleRoadmap}
              disabled={skillList.length === 0 || !targetRole}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-primary/30 hover:bg-primary/10 text-primary font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <BookOpen className="h-4 w-4" />
              Roadmap
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-sm text-[#a0aec0]">AI analyzing your profile...</p>
            </div>
          </motion.div>
        )}

        {!isLoading && skillGap && !showRoadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="glass-panel rounded-xl p-6 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl">
              <div className="flex items-center gap-6 mb-6">
                <MatchScoreRing
                  score={skillGap.overall_readiness}
                  size={100}
                  strokeWidth={8}
                  label="Readiness"
                />
                <div>
                  <h4 className="text-white font-semibold text-lg">Role Readiness</h4>
                  <p className="text-sm text-[#a0aec0] mt-1">
                    Your profile readiness for <span className="text-primary font-medium">{targetRole}</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skillGap.strengths.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {skillGap.missing_skills.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    Missing Skills ({skillGap.missing_skills.length})
                  </h5>
                  <div className="grid gap-3">
                    {skillGap.missing_skills.map((item, i) => (
                      <motion.div
                        key={item.skill}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${
                            item.importance_level === "critical" ? "bg-red-400" :
                            item.importance_level === "high" ? "bg-amber-400" : "bg-blue-400"
                          }`} />
                          <div>
                            <p className="text-sm text-white font-medium">{item.skill}</p>
                            <p className="text-[11px] text-[#a0aec0]">{item.importance_level} priority · {item.estimated_learning_time}</p>
                          </div>
                        </div>
                        {item.learning_resources.length > 0 && (
                          <div className="hidden sm:flex items-center gap-1">
                            {item.learning_resources.slice(0, 2).map((r, j) => (
                              <span key={j} className="text-[10px] px-2 py-1 rounded bg-white/5 text-[#a0aec0]">{r}</span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {skillGap.recommended_path.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-cyan-500/5 border border-primary/10">
                  <h5 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Recommended Path
                  </h5>
                  <ol className="space-y-1.5">
                    {skillGap.recommended_path.map((step, i) => (
                      <li key={i} className="text-sm text-[#a0aec0] flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {!isLoading && careerRoadmap && showRoadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="glass-panel rounded-xl p-6 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-white font-semibold text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Career Roadmap
                  </h4>
                  <p className="text-sm text-[#a0aec0] mt-1">
                    {careerRoadmap.timeline_months} month journey to {targetRole}
                  </p>
                </div>
                <MatchScoreRing
                  score={careerRoadmap.current_role_readiness}
                  size={80}
                  strokeWidth={6}
                  label="Readiness"
                />
              </div>

              {careerRoadmap.roadmap_steps.length > 0 && (
                <div className="relative">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />
                  <div className="space-y-4">
                    {careerRoadmap.roadmap_steps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="relative pl-10"
                      >
                        <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-[#0a0f2e]" />
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-white">{step.focus}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#a0aec0]">{step.duration}</span>
                          </div>
                          <p className="text-xs text-[#a0aec0]">{step.action}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {careerRoadmap.recommended_courses.length > 0 && (
                <div className="mt-6">
                  <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Recommended Courses ({careerRoadmap.recommended_courses.length})
                  </h5>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {careerRoadmap.recommended_courses.map((course, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
                        <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-white font-medium">{course.name}</p>
                          <p className="text-[10px] text-[#a0aec0]">{course.duration} · {course.importance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {careerRoadmap.certifications.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-amber-500/5 to-primary/5 border border-amber-500/10">
                  <h5 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-amber-400" />
                    Recommended Certifications
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {careerRoadmap.certifications.map((cert, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-[#a0aec0] border border-white/10">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && !skillGap && !careerRoadmap && (
        <div className="glass-panel rounded-xl p-8 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl text-center">
          <Search className="h-10 w-10 text-[#4a5568] mx-auto mb-3" />
          <p className="text-[#a0aec0] text-sm">Enter your skills and target role above to analyze skill gaps</p>
          <p className="text-xs text-[#4a5568] mt-1">AI will compare your profile against market requirements</p>
        </div>
      )}
    </div>
  );
}
