"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { interviewService } from "@/services/interview-service";
import { useInterviewStore } from "@/store/interview-store";

export function useStartInterview() {
  const { setSession, setIsLoading } = useInterviewStore();

  return useMutation({
    mutationFn: async ({
      role, interviewType, company, skills, experienceLevel,
    }: {
      role: string; interviewType: string; company?: string; skills?: string[]; experienceLevel?: string;
    }) => {
      setIsLoading(true);
      try {
        const data = await interviewService.startInterview(role, interviewType, company, skills, experienceLevel);
        setSession(data);
        return data;
      } finally {
        setIsLoading(false);
      }
    },
  });
}

export function useSubmitAnswer() {
  const { addAnswer, nextQuestion, setIsAiThinking } = useInterviewStore();

  return useMutation({
    mutationFn: async ({ interviewId, questionId, answer }: { interviewId: string; questionId: string; answer: string }) => {
      setIsAiThinking(true);
      try {
        const data = await interviewService.submitAnswer(interviewId, questionId, answer);
        addAnswer(questionId, answer, data.score, data.feedback);
        return data;
      } finally {
        setIsAiThinking(false);
      }
    },
    onSuccess: (data) => {
      if (data.next_question) {
        nextQuestion();
      }
    },
  });
}

export function useCompleteInterview() {
  const { setFeedback } = useInterviewStore();

  return useMutation({
    mutationFn: async (interviewId: string) => {
      const data = await interviewService.completeInterview(interviewId);
      setFeedback(data);
      return data;
    },
  });
}

export function useInterviewHistory() {
  const { setHistory } = useInterviewStore();

  return useQuery({
    queryKey: ["interviews", "history"],
    queryFn: async () => {
      const data = await interviewService.getHistory();
      setHistory(data.interviews, { total: data.total, average_score: data.average_score, interviews_by_type: data.interviews_by_type });
      return data;
    },
    staleTime: 30000,
  });
}

export function useInterviewDetail(interviewId: string | null) {
  return useQuery({
    queryKey: ["interviews", "detail", interviewId],
    queryFn: () => interviewService.getInterviewDetail(interviewId!),
    enabled: !!interviewId,
    staleTime: 60000,
  });
}

export function useCodingChallenge() {
  const { setCodingChallenge } = useInterviewStore();

  return useMutation({
    mutationFn: async (language: string = "python") => {
      const data = await interviewService.getCodingChallenge(language);
      setCodingChallenge(data);
      return data;
    },
  });
}

export function useEvaluateCoding() {
  const { setCodingResult } = useInterviewStore();

  return useMutation({
    mutationFn: async ({ code, question, language }: { code: string; question: string; language: string }) => {
      const data = await interviewService.evaluateCoding(code, question, language);
      setCodingResult(data);
      return data;
    },
  });
}
