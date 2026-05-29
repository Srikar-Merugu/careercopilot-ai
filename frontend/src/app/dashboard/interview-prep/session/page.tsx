"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Brain, Send, CheckCircle2, Sparkles, Mic, MicOff, ArrowLeft,
} from "lucide-react";
import { useSubmitAnswer, useCompleteInterview, useInterviewDetail } from "@/hooks/use-interviews";
import { useInterviewStore } from "@/store/interview-store";
import { ChatBubble } from "@/components/interview/chat-bubble";
import { TypingIndicator, ScoreDisplay } from "@/components/interview/typing-indicator";

export default function InterviewSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");
  const { session, questions, currentQuestionIndex, feedback, isAiThinking, setQuestions } = useInterviewStore();
  const submitAnswer = useSubmitAnswer();
  const completeInterview = useCompleteInterview();

  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean; score?: number; feedback?: string }[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { data: detail } = useInterviewDetail(interviewId);

  useEffect(() => {
    if (detail && detail.questions && !session) {
      setQuestions(detail.questions.map((q: any) => ({
        id: q.id, question: q.question, category: q.category, order_num: q.order_num,
      })));
    }
  }, [detail, session, setQuestions]);

  useEffect(() => {
    if (questions.length > 0 && chatMessages.length === 0) {
      setChatMessages([{ text: questions[0].question, isUser: false }]);
    }
  }, [questions, chatMessages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiThinking]);

  const handleSend = async () => {
    if (!inputValue.trim() || !interviewId || !questions[currentQuestionIndex]) return;
    const answer = inputValue.trim();
    setInputValue("");

    setChatMessages((prev) => [...prev, { text: answer, isUser: true }]);

    const result = await submitAnswer.mutateAsync({
      interviewId,
      questionId: questions[currentQuestionIndex].id,
      answer,
    });

    setChatMessages((prev) => {
      const updated = [...prev];
      const lastIdx = updated.length - 1;
      updated[lastIdx] = { ...updated[lastIdx], score: result.score };
      return updated;
    });

    if (result.is_complete || result.next_question === null || result.next_question === undefined) {
      setIsComplete(true);
      await completeInterview.mutateAsync(interviewId);
      setChatMessages((prev) => [
        ...prev,
        { text: `Interview complete! Let me analyze your responses...`, isUser: false },
      ]);
      setTimeout(() => setShowFeedback(true), 1000);
    } else if (result.next_question) {
      setTimeout(() => {
        setChatMessages((prev) => [...prev, { text: result.next_question!.question, isUser: false }]);
      }, 800);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!interviewId) {
    return (
      <div className="text-center py-20">
        <p className="text-[#a0aec0]">No interview selected. Start one from the interview dashboard.</p>
        <button onClick={() => router.push("/dashboard/interview-prep")} className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-sm">Go Back</button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col -m-4 sm:-m-6 lg:-m-8">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 bg-[#050816]/80 backdrop-blur-md">
        <button onClick={() => router.push("/dashboard/interview-prep")} className="flex items-center gap-2 text-sm text-[#a0aec0] hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Exit</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <Brain className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] text-[#a0aec0]">
              {session?.role || "Interview"} · Q{Math.min(currentQuestionIndex + 1, questions.length)}/{questions.length}
            </span>
          </div>
          <button
            onClick={() => setIsListening(!isListening)}
            className={`p-2 rounded-xl transition-all ${isListening ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/5 text-[#a0aec0] border border-white/10 hover:text-white"}`}
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {chatMessages.map((msg, i) => (
            <ChatBubble key={i} text={msg.text} isUser={msg.isUser} score={msg.score} feedback={msg.feedback} delay={0} />
          ))}
          {isAiThinking && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input area */}
      {!isComplete && (
        <div className="border-t border-white/5 bg-[#050816]/80 backdrop-blur-md px-4 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer..."
                rows={1}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-primary/40 resize-none"
              />
            </div>
            <button onClick={handleSend} disabled={!inputValue.trim() || submitAnswer.isPending}
              className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40 flex items-center justify-center transition-all">
              <Send className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Feedback modal */}
      <AnimatePresence>
        {showFeedback && feedback && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowFeedback(false)}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="w-full max-w-2xl rounded-xl border border-white/10 bg-[#0b1120]/95 backdrop-blur-xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Interview Results
                </h2>
                <button onClick={() => { setShowFeedback(false); router.push("/dashboard/interview-prep"); }}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium">
                  Done
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-20 w-20">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <motion.circle cx="40" cy="40" r="34" fill="none" stroke="#7C3AED" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - feedback.overall_score / 100) }}
                      transition={{ duration: 1.5 }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{Math.round(feedback.overall_score)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Overall Score</h3>
                  <p className="text-sm text-[#a0aec0]">{feedback.ai_feedback}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
                {[
                  { label: "Comm", key: "communication_score" },
                  { label: "Tech", key: "technical_score" },
                  { label: "Conf.", key: "confidence_score" },
                  { label: "Clarity", key: "clarity_score" },
                  { label: "Problem", key: "problem_solving_score" },
                  { label: "Behav.", key: "behavioral_score" },
                ].map((item) => (
                  <ScoreDisplay key={item.key} score={(feedback as any)[item.key] || 0} label={item.label} />
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Strengths
                  </h4>
                  <ul className="space-y-1">
                    {feedback.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-[#e2e8f0] flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Areas to Improve
                  </h4>
                  <ul className="space-y-1">
                    {feedback.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-[#e2e8f0] flex items-start gap-1.5">
                        <span className="text-amber-400">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {feedback.recommendations.length > 0 && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <h4 className="text-sm font-semibold text-primary mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {feedback.recommendations.map((r, i) => (
                      <li key={i} className="text-xs text-[#e2e8f0] flex items-start gap-1.5">
                        <span className="text-primary">→</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
