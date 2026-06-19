"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { getAnalysis } from "@/lib/api";
import type { AnalysisDetail } from "@/lib/types";

interface UsePollingOptions {
  interval?: number;
  enabled?: boolean;
  onCompleted?: (data: AnalysisDetail) => void;
  onFailed?: (data: AnalysisDetail) => void;
}

export function usePolling(
  analysisId: string | null,
  options: UsePollingOptions = {}
) {
  const { interval = 3000, enabled = true, onCompleted, onFailed } = options;
  const [data, setData] = useState<AnalysisDetail | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastStatusRef = useRef<string | null>(null);

  const poll = useCallback(async () => {
    if (!analysisId) return;
    try {
      const result = await getAnalysis(analysisId);
      setData(result);
      setError(null);

      if (
        result.status === "completed" &&
        lastStatusRef.current !== "completed"
      ) {
        onCompleted?.(result);
      }
      if (
        result.status === "failed" &&
        lastStatusRef.current !== "failed"
      ) {
        onFailed?.(result);
      }
      lastStatusRef.current = result.status;

      if (result.status === "completed" || result.status === "failed") {
        // Stop polling
        return;
      }
    } catch (e) {
      setError(e as Error);
    }
    timerRef.current = setTimeout(poll, interval);
  }, [analysisId, interval, onCompleted, onFailed]);

  useEffect(() => {
    if (!analysisId || !enabled) return;
    // Immediate first poll
    poll();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [analysisId, enabled, poll]);

  return { data, error, isLoading: !data && !error };
}
