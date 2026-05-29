"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface SkillsChartProps {
  skills: string[];
  missingSkills: string[];
}

const COLORS = [
  "#8B5CF6", "#06B6D4", "#3B82F6", "#22C55E", "#EAB308",
  "#F97316", "#EF4444", "#EC4899", "#14B8A6", "#6366F1",
];

export function SkillsChart({ skills, missingSkills }: SkillsChartProps) {
  const radarData = [
    { category: "Frontend", value: 0 },
    { category: "Backend", value: 0 },
    { category: "DevOps", value: 0 },
    { category: "AI/ML", value: 0 },
    { category: "Database", value: 0 },
    { category: "Cloud", value: 0 },
  ];

  const skillCategories: Record<string, string> = {
    javascript: "Frontend",
    typescript: "Frontend",
    react: "Frontend",
    angular: "Frontend",
    vue: "Frontend",
    "next.js": "Frontend",
    html: "Frontend",
    css: "Frontend",
    tailwindcss: "Frontend",
    node: "Backend",
    "node.js": "Backend",
    python: "Backend",
    java: "Backend",
    go: "Backend",
    rust: "Backend",
    fastapi: "Backend",
    django: "Backend",
    flask: "Backend",
    docker: "DevOps",
    kubernetes: "DevOps",
    ci: "DevOps",
    "ci/cd": "DevOps",
    terraform: "DevOps",
    "machine learning": "AI/ML",
    "deep learning": "AI/ML",
    tensorflow: "AI/ML",
    pytorch: "AI/ML",
    nlp: "AI/ML",
    postgresql: "Database",
    mongodb: "Database",
    redis: "Database",
    mysql: "Database",
    aws: "Cloud",
    gcp: "Cloud",
    azure: "Cloud",
  };

  skills.forEach((skill) => {
    const category = skillCategories[skill.toLowerCase()];
    if (category) {
      const entry = radarData.find((d) => d.category === category);
      if (entry) entry.value = Math.min(entry.value + 20, 100);
    }
  });

  const maxEntry = Math.max(...radarData.map((d) => d.value), 1);
  radarData.forEach((d) => {
    d.value = Math.round((d.value / maxEntry) * 100);
  });

  const missingSkillsData = missingSkills.slice(0, 8).map((skill, i) => ({
    name: skill,
    value: 100,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-xs font-semibold text-white/80 mb-4 uppercase tracking-wider">
          Skill Distribution
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }}
                tickCount={5}
              />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {missingSkillsData.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-white/80 mb-4 uppercase tracking-wider">
            Skills to Develop
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={missingSkillsData}
                layout="vertical"
                margin={{ left: 20, right: 20, top: 5, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b1120",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  formatter={() => ["High Priority", "Priority"]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                  {missingSkillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold text-white/80 mb-3 uppercase tracking-wider">
          Extracted Skills ({skills.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02, duration: 0.2 }}
              className="px-2.5 py-1 text-[11px] font-medium rounded-full border border-white/5 bg-white/[0.03] text-muted-foreground hover:border-[#8B5CF6]/30 hover:text-white transition-all duration-200"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
