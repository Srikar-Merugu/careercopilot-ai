import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job-service";
import { useJobStore } from "@/store/job-store";
import { useToast } from "@/providers/toast-provider";

export function useJobSearch() {
  const { filters, currentPage, setSearchResults, setIsLoading } = useJobStore();

  return useQuery({
    queryKey: ["jobs", "search", filters, currentPage],
    queryFn: async () => {
      setIsLoading(true);
      try {
        const params: Record<string, string | number> = {
          query: filters.query,
          page: currentPage,
          per_page: 20,
          sort_by: filters.sort_by,
        };
        if (filters.location) params.location = filters.location;
        if (filters.remote_type) params.remote_type = filters.remote_type;
        if (filters.salary_min) params.salary_min = parseInt(filters.salary_min);
        if (filters.salary_max) params.salary_max = parseInt(filters.salary_max);
        if (filters.experience) params.experience = filters.experience;
        if (filters.job_type) params.job_type = filters.job_type;
        if (filters.category) params.category = filters.category;
        if (filters.days_ago) params.days_ago = parseInt(filters.days_ago);

        const data = await jobService.search(params);
        const enriched: any[] = data.jobs.map((job) => ({ job }));
        setSearchResults(enriched, data.total);
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    staleTime: 60000,
    placeholderData: (prev) => prev,
  });
}

export function useJobMatch(jobId: string | null) {
  return useQuery({
    queryKey: ["jobs", "match", jobId],
    queryFn: async () => {
      if (!jobId) throw new Error("No job ID");
      const result = await jobService.getMatch(jobId);
      return result.data;
    },
    enabled: !!jobId,
    staleTime: 120000,
  });
}

export function useSavedJobs() {
  const { setSavedJobs } = useJobStore();

  return useQuery({
    queryKey: ["jobs", "saved"],
    queryFn: async () => {
      const result = await jobService.listSaved();
      setSavedJobs(result.data);
      return result.data;
    },
    staleTime: 30000,
  });
}

export function useSaveJob() {
  const queryClient = useQueryClient();
  const { addSavedJobId, removeSavedJob, savedJobIds } = useJobStore();
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (jobId: string) => {
      await jobService.saveJob(jobId);
      return jobId;
    },
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: ["jobs", "saved"] });
      addSavedJobId(jobId);
      const saved = JSON.parse(localStorage.getItem("cc_saved_jobs") || "[]");
      if (!saved.includes(jobId)) {
        saved.push(jobId);
        localStorage.setItem("cc_saved_jobs", JSON.stringify(saved));
      }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
      toast("Error", "Failed to save job.", "error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
      toast("Job Saved", "Job has been saved to your bookmarks.", "success");
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async (jobId: string) => {
      await jobService.unsaveJob(jobId);
      return jobId;
    },
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: ["jobs", "saved"] });
      removeSavedJob(jobId);
      const saved = JSON.parse(localStorage.getItem("cc_saved_jobs") || "[]");
      localStorage.setItem("cc_saved_jobs", JSON.stringify(saved.filter((id: string) => id !== jobId)));
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
      toast("Error", "Failed to unsave job.", "error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
      toast("Job Unsaved", "Job removed from your bookmarks.", "info");
    },
  });

  return { saveMutation, unsaveMutation };
}

export function useRecommendations() {
  const { setRecommendations } = useJobStore();

  return useQuery({
    queryKey: ["jobs", "recommendations"],
    queryFn: async () => {
      const data = await jobService.getRecommendations();
      setRecommendations(data);
      return data;
    },
    staleTime: 300000,
  });
}
