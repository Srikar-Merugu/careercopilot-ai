"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, MapPin, Briefcase, DollarSign, Wifi, Clock } from "lucide-react";
import { useJobStore } from "@/store/job-store";
import { cn } from "@/lib/utils";

const experienceLevels = ["0-2 years", "2-4 years", "3-5 years", "4-7 years", "5-7 years", "7-10 years"];
const jobTypes = ["full_time", "contract", "part_time"];
const remoteTypes = ["remote", "hybrid", "on-site"];
const categories = [
  "Engineering", "Design", "Product", "Data", "DevOps",
  "Security", "AI/ML", "Mobile", "Management",
];
const sortOptions = [
  { value: "match_score", label: "Best Match" },
  { value: "date", label: "Most Recent" },
  { value: "salary_high", label: "Salary: High to Low" },
  { value: "salary_low", label: "Salary: Low to High" },
];
const dateRanges = [
  { value: "", label: "Any time" },
  { value: "1", label: "Past 24 hours" },
  { value: "7", label: "Past 7 days" },
  { value: "14", label: "Past 14 days" },
  { value: "30", label: "Past 30 days" },
];

export function FilterSystem() {
  const { filters, setFilters, resetFilters } = useJobStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const activeCount = Object.entries(filters).filter(
    ([k, v]) => k !== "sort_by" && v !== "" && v !== "match_score"
  ).length;

  const FilterSelect = ({
    label,
    icon,
    value,
    options,
    onChange,
  }: {
    label: string;
    icon: React.ReactNode;
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
  }) => (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
        {icon}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-black/40 border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0b1120]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  const filtersList = [
    {
      key: "location",
      label: "Location",
      icon: <MapPin className="h-3 w-3" />,
      options: [
        { value: "", label: "All Locations" },
        { value: "San Francisco", label: "San Francisco" },
        { value: "New York", label: "New York" },
        { value: "Austin", label: "Austin" },
        { value: "Seattle", label: "Seattle" },
        { value: "Remote", label: "Remote" },
      ],
    },
    {
      key: "experience",
      label: "Experience",
      icon: <Briefcase className="h-3 w-3" />,
      options: [
        { value: "", label: "Any Experience" },
        ...experienceLevels.map((e) => ({ value: e, label: e })),
      ],
    },
    {
      key: "job_type",
      label: "Job Type",
      icon: <Clock className="h-3 w-3" />,
      options: [
        { value: "", label: "All Types" },
        ...jobTypes.map((t) => ({
          value: t,
          label: t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        })),
      ],
    },
    {
      key: "remote_type",
      label: "Remote",
      icon: <Wifi className="h-3 w-3" />,
      options: [
        { value: "", label: "All Types" },
        ...remoteTypes.map((t) => ({
          value: t,
          label: t.charAt(0).toUpperCase() + t.slice(1),
        })),
      ],
    },
    {
      key: "category",
      label: "Category",
      icon: <Briefcase className="h-3 w-3" />,
      options: [
        { value: "", label: "All Categories" },
        ...categories.map((c) => ({ value: c, label: c })),
      ],
    },
    {
      key: "days_ago",
      label: "Posted",
      icon: <Clock className="h-3 w-3" />,
      options: dateRanges,
    },
  ];

  const salaryPresets = [
    { label: "50k+", min: "50000", max: "" },
    { label: "80k+", min: "80000", max: "" },
    { label: "100k+", min: "100000", max: "" },
    { label: "130k+", min: "130000", max: "" },
    { label: "150k+", min: "150000", max: "" },
    { label: "200k+", min: "200000", max: "" },
  ];

  const activeFilters = Object.entries(filters).filter(
    ([k, v]) => k !== "sort_by" && v !== "" && v !== "match_score"
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-[#0b1120]/40 text-xs text-muted-foreground hover:text-white hover:border-white/10 transition-all"
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {activeCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-semibold">
                {activeCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">Sort:</span>
            <select
              value={filters.sort_by}
              onChange={(e) => setFilters({ sort_by: e.target.value })}
              className="bg-transparent text-[11px] text-muted-foreground border border-white/5 rounded-lg px-2 py-1 focus:outline-none focus:border-[#8B5CF6]/30 transition-all"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0b1120]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-[10px] text-muted-foreground hover:text-white transition-all"
          >
            Clear all
          </button>
        )}
      </div>

      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-1.5"
          >
            {activeFilters.map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[10px] text-[#8B5CF6]"
              >
                {key.replace("_", " ")}: {value}
                <button
                  onClick={() => setFilters({ [key]: "" })}
                  className="hover:text-white transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-white/5 bg-[#0b1120]/40 backdrop-blur-xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                {filtersList.map((f) => (
                  <FilterSelect
                    key={f.key}
                    label={f.label}
                    icon={f.icon}
                    value={filters[f.key as keyof typeof filters]}
                    options={f.options}
                    onChange={(v) => setFilters({ [f.key]: v })}
                  />
                ))}
              </div>

              <div className="border-t border-white/5 pt-4">
                <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                  <DollarSign className="h-3 w-3" />
                  Salary Range
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {salaryPresets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() =>
                        setFilters({
                          salary_min: filters.salary_min === preset.min ? "" : preset.min,
                        })
                      }
                      className={cn(
                        "px-3 py-1.5 text-[11px] rounded-lg border transition-all",
                        filters.salary_min === preset.min
                          ? "border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#8B5CF6]"
                          : "border-white/5 text-muted-foreground hover:text-white hover:border-white/10"
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
