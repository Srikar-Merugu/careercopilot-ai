"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Award,
  Sparkles,
  UserCheck,
  Download,
  RefreshCw,
} from "lucide-react";
import { ResumeAnalysis as ResumeAnalysisType } from "@/store/resume-store";
import { AtsScore } from "./ats-score";
import { Insights } from "./insights";
import { RoleRecommendations } from "./role-recommendations";
import { SkillsChart } from "./skills-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/animations/motion-wrapper";

interface AnalysisDashboardProps {
  analysis: ResumeAnalysisType;
  onReanalyze?: () => void;
  onDownload?: () => void;
  isReanalyzing?: boolean;
}

export function AnalysisDashboard({
  analysis,
  onReanalyze,
  onDownload,
  isReanalyzing,
}: AnalysisDashboardProps) {
  const sections = [
    {
      id: "ats",
      title: "ATS Score Analysis",
      icon: <Award className="h-5 w-5 text-[#8B5CF6]" />,
      content: (
        <AtsScore score={analysis.ats_score} breakdown={analysis.ats_breakdown} />
      ),
    },
    {
      id: "skills",
      title: "Skills Intelligence",
      icon: <Brain className="h-5 w-5 text-[#06B6D4]" />,
      content: (
        <SkillsChart
          skills={analysis.parsed_skills}
          missingSkills={analysis.missing_skills}
        />
      ),
    },
    {
      id: "roles",
      title: "Role Compatibility",
      icon: <UserCheck className="h-5 w-5 text-[#3B82F6]" />,
      content: <RoleRecommendations roles={analysis.recommended_roles} />,
    },
    {
      id: "insights",
      title: "AI Career Insights",
      icon: <Sparkles className="h-5 w-5 text-[#F97316]" />,
      content: (
        <Insights
          strengths={analysis.strengths}
          weaknesses={analysis.weaknesses}
          missingSkills={analysis.missing_skills}
          optimizationTips={analysis.optimization_tips}
          aiFeedback={analysis.ai_feedback}
          careerSuggestions={analysis.career_suggestions}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Resume Intelligence Report
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              AI-powered analysis with personalized career insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onDownload && (
              <Button
                variant="glass"
                size="sm"
                onClick={onDownload}
                className="text-xs"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download Report
              </Button>
            )}
            {onReanalyze && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReanalyze}
                disabled={isReanalyzing}
                className="text-xs"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 mr-1.5 ${isReanalyzing ? "animate-spin" : ""}`}
                />
                Re-analyze
              </Button>
            )}
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "ATS Score", value: `${Math.round(analysis.ats_score)}`, icon: <Award className="h-4 w-4" />, color: "from-[#8B5CF6] to-[#06B6D4]" },
          { label: "Skills Found", value: `${analysis.parsed_skills.length}`, icon: <Brain className="h-4 w-4" />, color: "from-[#06B6D4] to-[#3B82F6]" },
          { label: "Roles Matched", value: `${analysis.recommended_roles.length}`, icon: <UserCheck className="h-4 w-4" />, color: "from-[#3B82F6] to-[#22C55E]" },
          { label: "Missing Skills", value: `${analysis.missing_skills.length}`, icon: <TrendingUp className="h-4 w-4" />, color: "from-[#F97316] to-[#EF4444]" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            className="p-3 rounded-xl border border-white/5 bg-[#0b1120]/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                {React.cloneElement(stat.icon, { className: "h-3 w-3 text-white" })}
              </div>
            </div>
            <p className="text-lg font-bold font-display text-white">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <StaggerContainer staggerChildren={0.15}>
        {sections.map((section) => (
          <StaggerItem key={section.id}>
            <Card className="border-white/5 bg-[#0b1120]/45 backdrop-blur-xl overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {section.icon}
                  <CardTitle className="text-sm">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>{section.content}</CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
