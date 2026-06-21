"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { getAnalyses } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Globe,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  Loader2,
  SearchX,
  RefreshCw,
} from "lucide-react";
import type { Analysis, AnalysisStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  AnalysisStatus,
  { label: string; icon: typeof CheckCircle2; color: string }
> = {
  completed: {
    label: "已完成",
    icon: CheckCircle2,
    color:
      "bg-primary/8 text-primary border-primary/15",
  },
  running: {
    label: "分析中",
    icon: Loader2,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  queued: {
    label: "排队中",
    icon: Clock,
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  failed: {
    label: "失败",
    icon: AlertCircle,
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

function StatusBadge({ status }: { status: AnalysisStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 text-[11px] px-2 py-0.5 ${config.color}`}
    >
      <Icon
        className={`size-3 ${status === "running" ? "animate-spin" : ""}`}
      />
      {config.label}
    </Badge>
  );
}

const FILTERS: { label: string; value: AnalysisStatus | "all" }[] = [
  { label: "全部", value: "all" },
  { label: "已完成", value: "completed" },
  { label: "进行中", value: "running" },
  { label: "失败", value: "failed" },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState<AnalysisStatus | "all">("all");

  const {
    data: analyses,
    isLoading,
    error,
    mutate,
  } = useSWR("analyses_list", () => getAnalyses(), {
    dedupingInterval: 5000,
  });

  const filtered = analyses
    ? filter === "all"
      ? analyses
      : analyses.filter((a) => a.status === filter)
    : [];

  const counts = analyses
    ? {
        all: analyses.length,
        completed: analyses.filter((a) => a.status === "completed").length,
        running: analyses.filter((a) => a.status === "running").length,
        failed: analyses.filter((a) => a.status === "failed").length,
      }
    : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            历史记录
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            浏览和管理你的 GEO 分析记录
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => mutate()}
          disabled={isLoading}
        >
          <RefreshCw
            className={`size-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
          />
          刷新
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              filter === f.value
                ? "bg-primary/8 text-primary ring-1 ring-primary/15"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {f.label}
            {counts && (
              <span className="text-[10px] opacity-60">
                {f.value === "all"
                  ? counts.all
                  : counts[f.value as keyof typeof counts]}
              </span>
            )}
          </button>
        ))}
      </div>

      <Separator className="mb-6" />

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-border bg-white">
              <CardContent className="px-5 py-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex items-center gap-3 px-5 py-4">
            <AlertCircle className="size-5 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">加载失败</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                无法获取分析记录，请检查后端服务
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <SearchX className="size-10 text-muted-foreground/40 mb-4" />
          <p className="text-sm font-medium text-muted-foreground">
            暂无{filter !== "all" ? STATUS_CONFIG[filter].label : ""}分析记录
          </p>
          <Link href="/" className="mt-3">
            <Button variant="outline" size="sm">
              开始第一次分析
            </Button>
          </Link>
        </div>
      )}

      {/* List */}
      {!isLoading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((analysis) => (
            <AnalysisRow key={analysis.id} analysis={analysis} />
          ))}
        </div>
      )}
    </div>
  );
}

function AnalysisRow({ analysis }: { analysis: Analysis }) {
  const date = new Date(analysis.created_at);
  const timeAgo = getTimeAgo(date);

  return (
    <Link href={`/analyses/${analysis.id}`}>
      <Card className="group border-border bg-white hover:bg-white hover:border-primary/10 transition-all cursor-pointer">
        <CardContent className="flex items-center gap-4 px-5 py-3.5">
          <Globe className="size-4 shrink-0 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground/90">
              {analysis.input_url}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {timeAgo}
              {analysis.business_type && ` · ${analysis.business_type}`}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <StatusBadge status={analysis.status} />
            <ChevronRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString("zh-CN");
}
