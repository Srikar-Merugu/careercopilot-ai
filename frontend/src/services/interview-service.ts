import { apiClient } from "./api-client";

export interface InterviewSession {
  id: string;
  role: string;
  company?: string;
  interview_type: string;
  status: string;
  question_count: number;
  questions: InterviewQuestion[];
  created_at: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category?: string;
  order_num: number;
  difficulty?: string;
}

export interface AnswerResult {
  question_id: string;
  score: number;
  feedback: string;
  next_question?: InterviewQuestion | null;
  is_complete?: boolean;
}

export interface InterviewFeedback {
  id: string;
  interview_id: string;
  communication_score: number;
  technical_score: number;
  confidence_score: number;
  clarity_score: number;
  problem_solving_score: number;
  behavioral_score: number;
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  ai_feedback: string;
  recommendations: string[];
  filler_word_count: number;
  created_at: string;
}

export interface InterviewHistoryItem {
  id: string;
  role: string;
  company?: string;
  interview_type: string;
  status: string;
  overall_score?: number;
  question_count: number;
  created_at: string;
  completed_at?: string;
}

export interface InterviewHistory {
  interviews: InterviewHistoryItem[];
  total: number;
  average_score: number;
  interviews_by_type: Record<string, number>;
}

export interface CodingChallenge {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  language: string;
  starter_code: string;
  test_cases: { input: any[]; expected: any }[];
}

export interface CodingResult {
  passed: boolean;
  score: number;
  feedback: string;
  test_results: { test: string; passed: boolean }[];
  suggestions: string[];
}

export const interviewService = {
  async startInterview(
    role: string,
    interviewType: string,
    company?: string,
    skills?: string[],
    experienceLevel?: string
  ): Promise<InterviewSession> {
    const { data } = await apiClient.post("/interviews/start", {
      role, company, interview_type: interviewType, skills, experience_level: experienceLevel,
    });
    return data;
  },

  async submitAnswer(interviewId: string, questionId: string, answer: string): Promise<AnswerResult> {
    const { data } = await apiClient.post("/interviews/answer", {
      interview_id: interviewId, question_id: questionId, answer,
    });
    return data;
  },

  async completeInterview(interviewId: string): Promise<InterviewFeedback> {
    const { data } = await apiClient.post(`/interviews/${interviewId}/complete`);
    return data;
  },

  async getHistory(limit: number = 20): Promise<InterviewHistory> {
    const { data } = await apiClient.get("/interviews/history", { params: { limit } });
    return data;
  },

  async getInterviewDetail(interviewId: string): Promise<{
    interview: InterviewHistoryItem;
    questions: any[];
    feedback: InterviewFeedback | null;
  }> {
    const { data } = await apiClient.get(`/interviews/${interviewId}`);
    return data;
  },

  async getCodingChallenge(language: string = "python"): Promise<CodingChallenge> {
    const { data } = await apiClient.get("/interviews/coding/challenge", { params: { language } });
    return data;
  },

  async evaluateCoding(code: string, question: string, language: string): Promise<CodingResult> {
    const { data } = await apiClient.post("/interviews/coding/evaluate", {
      challenge_id: "1", code, question, language,
    });
    return data;
  },

  async generateQuestion(
    role: string, interviewType: string, company?: string, skills?: string[]
  ): Promise<{ question: string; category: string; difficulty: string; expected_points: string[] }> {
    const { data } = await apiClient.post("/interviews/generate-question", {
      role, company, interview_type: interviewType, skills,
    });
    return data;
  },
};
