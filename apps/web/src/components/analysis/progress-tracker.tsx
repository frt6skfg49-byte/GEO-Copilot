"use client";

import { cn } from "@/lib/utils";
import { Check, Loader2, Circle } from "lucide-react";
import type { AnalysisStatus } from "@/lib/types";

interface Step {
  id: string;
  label: string;
}

const STEPS: Step[] = [
  { id: "fetch", label: "页面抓取" },
  { id: "parse", label: "结构解析" },
  { id: "retrieve", label: "方法检索" },
  { id: "diagnose", label: "GEO 诊断" },
  { id: "build", label: "报告生成" },
];

// For running status — simulate which step we're on based on time
const STEP_ORDER: Record<string, number> = {
  fetch: 0,
  parse: 1,
  retrieve: 2,
  diagnose: 3,
  build: 4,
};

export function ProgressTracker({ status }: { status: AnalysisStatus }) {
  if (status !== "running" && status !== "queued") return null;

  // For simplicity: show all steps as "active" if running (user sees animation)
  // Real implementation would get current step from API
  const isRunning = status === "running";

  return (
    <div className="w-full py-4">
      <p className="text-sm font-medium text-foreground mb-4">
        {isRunning ? "正在分析中..." : "等待分析开始..."}
      </p>
      <div className="space-y-3">
        {STEPS.map((step, index) => {
          let stepState: "waiting" | "active" | "done" = "waiting";
          if (isRunning) {
            // Simulate: all prior steps done, current step active, rest waiting
            // For mock, animate through first 3 steps
            const activeIndex = Math.min(
              (Math.floor(Date.now() / 800) % STEPS.length),
              STEPS.length - 1
            );
            if (index < activeIndex) stepState = "done";
            else if (index === activeIndex) stepState = "active";
            else stepState = "waiting";
          }

          return (
            <div
              key={step.id}
              className="flex items-center gap-3 text-sm"
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full shrink-0",
                  stepState === "done" &&
                    "bg-emerald-500/10 text-emerald-400",
                  stepState === "active" &&
                    "bg-blue-500/10 text-blue-400",
                  stepState === "waiting" &&
                    "bg-muted text-muted-foreground"
                )}
              >
                {stepState === "done" ? (
                  <Check className="size-3.5" />
                ) : stepState === "active" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Circle className="size-3.5" />
                )}
              </span>
              <span
                className={cn(
                  stepState === "done" && "text-foreground",
                  stepState === "active" && "text-foreground font-medium",
                  stepState === "waiting" && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
