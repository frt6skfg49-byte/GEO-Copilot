"use client";

import useSWR from "swr";
import { getAnalysis } from "@/lib/api";
import type { AnalysisDetail } from "@/lib/types";

export function useAnalysis(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `analysis_${id}` : null,
    async (key: string) => {
      const analysisId = key.replace("analysis_", "");
      return getAnalysis(analysisId);
    },
    {
      refreshInterval: (data) => {
        if (!data) return 3000;
        if (data.status === "queued" || data.status === "running") return 3000;
        return 0;
      },
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  );

  return {
    analysis: data,
    isLoading,
    isError: error,
    mutate,
  };
}
