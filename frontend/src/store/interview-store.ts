import { create } from "zustand";
import {
  InterviewSession, InterviewQuestion,
  InterviewFeedback, InterviewHistoryItem, CodingChallenge, CodingResult,
} from "@/services/interview-service";

interface InterviewState {
  session: InterviewSession | null;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  answers: { questionId: string; answer: string; score: number; feedback: string }[];
  feedback: InterviewFeedback | null;
  history: InterviewHistoryItem[];
  historyStats: { total: number; average_score: number; interviews_by_type: Record<string, number> } | null;
  codingChallenge: CodingChallenge | null;
  codingResult: CodingResult | null;
  isLoading: boolean;
  isAiThinking: boolean;
  error: string | null;

  setSession: (session: InterviewSession) => void;
  setQuestions: (questions: InterviewQuestion[]) => void;
  setCurrentQuestionIndex: (idx: number) => void;
  nextQuestion: () => void;
  addAnswer: (questionId: string, answer: string, score: number, feedback: string) => void;
  setFeedback: (feedback: InterviewFeedback) => void;
  setHistory: (items: InterviewHistoryItem[], stats: { total: number; average_score: number; interviews_by_type: Record<string, number> }) => void;
  setCodingChallenge: (challenge: CodingChallenge) => void;
  setCodingResult: (result: CodingResult) => void;
  setIsLoading: (loading: boolean) => void;
  setIsAiThinking: (thinking: boolean) => void;
  setError: (error: string | null) => void;
  resetSession: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  session: null,
  currentQuestionIndex: 0,
  questions: [],
  answers: [],
  feedback: null,
  history: [],
  historyStats: null,
  codingChallenge: null,
  codingResult: null,
  isLoading: false,
  isAiThinking: false,
  error: null,

  setSession: (session) => set({ session, questions: session.questions, currentQuestionIndex: 0, answers: [], feedback: null }),
  setQuestions: (questions) => set({ questions }),
  setCurrentQuestionIndex: (idx) => set({ currentQuestionIndex: idx }),
  nextQuestion: () => set((s) => ({ currentQuestionIndex: Math.min(s.currentQuestionIndex + 1, s.questions.length - 1) })),
  addAnswer: (questionId, answer, score, feedback) =>
    set((s) => ({ answers: [...s.answers, { questionId, answer, score, feedback }] })),
  setFeedback: (feedback) => set({ feedback }),
  setHistory: (items, stats) => set({ history: items, historyStats: stats }),
  setCodingChallenge: (challenge) => set({ codingChallenge: challenge }),
  setCodingResult: (result) => set({ codingResult: result }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsAiThinking: (thinking) => set({ isAiThinking: thinking }),
  setError: (error) => set({ error }),
  resetSession: () => set({
    session: null, questions: [], currentQuestionIndex: 0, answers: [], feedback: null, error: null,
  }),
}));
