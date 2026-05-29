"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code2, Play, RefreshCw, CheckCircle2,
  XCircle, Lightbulb,
} from "lucide-react";
import { useCodingChallenge, useEvaluateCoding } from "@/hooks/use-interviews";
import { useInterviewStore } from "@/store/interview-store";

const LANGUAGES = ["python", "javascript"];

export default function CodingInterviewPage() {
  const { codingChallenge, codingResult } = useInterviewStore();
  const getChallenge = useCodingChallenge();
  const evaluateCode = useEvaluateCoding();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    getChallenge.mutate(language);
  }, [language]);

  useEffect(() => {
    if (codingChallenge) setCode(codingChallenge.starter_code);
  }, [codingChallenge]);

  const handleRun = () => {
    if (!codingChallenge) return;
    evaluateCode.mutate({ code, question: codingChallenge.title, language });
    setShowResults(true);
  };

  const handleNewChallenge = () => {
    setShowResults(false);
    getChallenge.mutate(language);
  };

  return (
    <div className="space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Code2 className="h-6 w-6 text-primary" />
            Coding Challenges
          </h1>
          <p className="text-sm text-[#a0aec0] mt-0.5">Practice coding with AI-powered evaluation</p>
        </div>
        <div className="flex items-center gap-2">
          {LANGUAGES.map((lang) => (
            <button key={lang} onClick={() => setLanguage(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                language === lang
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-white/5 border-white/10 text-[#a0aec0] hover:text-white"
              }`}>
              {lang === "python" ? "Python" : "JavaScript"}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Challenge Panel */}
        <div className="space-y-4">
          {codingChallenge ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold">{codingChallenge.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    codingChallenge.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    codingChallenge.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>{codingChallenge.difficulty}</span>
                </div>
                <button onClick={handleNewChallenge} className="flex items-center gap-1.5 text-xs text-[#a0aec0] hover:text-white">
                  <RefreshCw className="h-3.5 w-3.5" /> New
                </button>
              </div>
              <p className="text-sm text-[#e2e8f0] leading-relaxed mb-3">{codingChallenge.description}</p>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-[#a0aec0] uppercase">Test Cases</p>
                {codingChallenge.test_cases.map((tc, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs font-mono text-[#a0aec0]">
                    <span className="text-[#4a5568]">Input: </span>{JSON.stringify(tc.input)}
                    <br />
                    <span className="text-[#4a5568]">Expected: </span>{JSON.stringify(tc.expected)}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-[#a0aec0]">Loading challenge...</p>
            </div>
          )}

          {/* Results */}
          {showResults && codingResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Evaluation Results
                </h3>
                <span className={`text-lg font-bold ${codingResult.passed ? "text-emerald-400" : "text-amber-400"}`}>
                  {codingResult.score}%
                </span>
              </div>
              <div className="space-y-2 mb-3">
                {codingResult.test_results.map((tr, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#e2e8f0]">
                    {tr.passed ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5 text-rose-400" />}
                    {tr.test}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#a0aec0] mb-3">{codingResult.feedback}</p>
              {codingResult.suggestions.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <p className="text-xs font-medium text-amber-400 mb-1">Suggestions:</p>
                  <ul className="space-y-0.5">
                    {codingResult.suggestions.map((s, i) => (
                      <li key={i} className="text-[11px] text-[#e2e8f0] flex items-start gap-1.5">
                        <span className="text-amber-400">→</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Code Editor Panel */}
        <div className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-500/50" />
                <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
              </div>
              <span className="text-xs text-[#4a5568] ml-2 font-mono">solution.{language === "python" ? "py" : "js"}</span>
            </div>
            <button onClick={handleRun} disabled={!codingChallenge || evaluateCode.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-40 text-xs font-medium text-white transition-all">
              <Play className="h-3.5 w-3.5" /> Run
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full p-4 bg-transparent text-sm font-mono text-[#e2e8f0] focus:outline-none resize-none"
            style={{ minHeight: 300 }}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
