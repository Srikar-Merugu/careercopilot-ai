"use client";

import { useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CareerRadarChartProps {
  _strengths?: string[];
  _weaknesses?: string[];
  _missingSkills?: string[];
  matchScore?: number;
  skillSimilarity?: number;
  semanticRelevance?: number;
  industryFit?: number;
  experienceAlignment?: number;
}

export function CareerRadarChart({
  matchScore = 75,
  skillSimilarity = 70,
  semanticRelevance = 65,
  industryFit = 60,
  experienceAlignment = 70,
}: CareerRadarChartProps) {
  const data = useMemo(() => [
    { category: "Skill Match", value: Math.max(10, skillSimilarity), fullMark: 100 },
    { category: "Semantic Fit", value: Math.max(10, semanticRelevance), fullMark: 100 },
    { category: "Industry Fit", value: Math.max(10, industryFit), fullMark: 100 },
    { category: "Experience", value: Math.max(10, experienceAlignment), fullMark: 100 },
    { category: "Overall", value: Math.max(10, matchScore), fullMark: 100 },
  ], [matchScore, skillSimilarity, semanticRelevance, industryFit, experienceAlignment]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="rgba(124, 58, 237, 0.2)" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "#a0aec0", fontSize: 11, fontWeight: 500 }}
            axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#4a5568", fontSize: 10 }}
            axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(5, 8, 22, 0.95)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              borderRadius: "8px",
              color: "#e2e8f0",
              fontSize: "12px",
            }}
            formatter={(value) => [`${Math.round(Number(value))}%`, "Score"]}
          />
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <Radar
            name="Career"
            dataKey="value"
            stroke="url(#radarGradient)"
            fill="url(#radarGradient)"
            fillOpacity={0.15}
            strokeWidth={2}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
