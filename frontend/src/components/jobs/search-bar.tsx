"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, TrendingUp, Clock } from "lucide-react";
import { useJobStore } from "@/store/job-store";

const suggestions = [
  "Senior Frontend Engineer",
  "Backend Developer",
  "AI/ML Engineer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Analyst",
  "Product Manager",
  "React Developer",
  "Python Developer",
  "Cloud Architect",
];

export function SearchBar() {
  const { filters, setFilters } = useJobStore();
  const [localQuery, setLocalQuery] = useState(filters.query);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  useEffect(() => {
    const saved = localStorage.getItem("cc_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveRecentSearch = useCallback((q: string) => {
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("cc_recent_searches", JSON.stringify(updated));
  }, [recentSearches]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters({ query: val });
    }, 400);
  };

  const handleClear = () => {
    setLocalQuery("");
    setFilters({ query: "" });
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (sugg: string) => {
    setLocalQuery(sugg);
    setFilters({ query: sugg });
    setShowSuggestions(false);
    saveRecentSearch(sugg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      saveRecentSearch(localQuery.trim());
    }
    setFilters({ query: localQuery });
    setShowSuggestions(false);
  };

  const placeholderText = "Search jobs, skills, companies...";

  return (
    <div className="relative">
      <motion.form
        onSubmit={handleSubmit}
        className={`relative flex items-center rounded-2xl border transition-all duration-300 ${
          isFocused
            ? "border-[#8B5CF6]/50 bg-[#0b1120]/80 shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)]"
            : "border-white/10 bg-[#0b1120]/40 hover:border-white/20"
        } backdrop-blur-xl`}
      >
        <div className="flex items-center justify-center pl-4">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholderText}
          className="flex-1 bg-transparent px-3 py-3.5 text-sm text-white placeholder:text-muted-foreground/60 focus:outline-none"
        />

        <AnimatePresence>
          {localQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={handleClear}
              className="mr-2 p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mr-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white text-xs font-semibold hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300"
        >
          <Sparkles className="h-3.5 w-3.5 inline-block mr-1" />
          AI Search
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {showSuggestions && !localQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 p-3 rounded-xl border border-white/5 bg-[#0b1120]/95 backdrop-blur-xl shadow-2xl z-50"
          >
            {recentSearches.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Recent Searches
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onMouseDown={() => handleSuggestionClick(s)}
                      className="px-2.5 py-1 text-[11px] rounded-full bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:border-white/10 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Trending Roles
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.slice(0, 6).map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => handleSuggestionClick(s)}
                    className="px-2.5 py-1 text-[11px] rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
