"use client";

import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import type { AnalysisStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  AnalysisStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  queued: {
    label: "排队中",
    icon: Clock,
    className:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  running: {
    label: "分析中",
    icon: Loader2,
    className:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  completed: {
    label: "已完成",
    icon: CheckCircle2,
    className:
      "bg-primary/8 text-primary border-primary/15",
  },
  failed: {
    label: "失败",
    icon: XCircle,
    className:
      "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function StatusBadge({ status }: { status: AnalysisStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1.5 px-2.5 py-1 ${config.className}`}
    >
      <Icon
        className={`size-3.5 ${status === "running" ? "animate-spin" : ""}`}
      />
      {config.label}
    </Badge>
  );
}
