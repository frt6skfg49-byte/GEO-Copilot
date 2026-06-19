"use client";

import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MethodChunk } from "@/lib/types";

interface MethodExpandProps {
  methodRef: string;
  methodChunks?: MethodChunk[];
}

const METHOD_TYPE_LABELS: Record<string, string> = {
  rubric: "评分标准",
  strategy: "优化策略",
  template: "模板",
  warning: "警告",
  output_rule: "输出规则",
  asset_pattern: "资产模板",
  system_rule: "系统规则",
};

export function MethodExpand({ methodRef, methodChunks }: MethodExpandProps) {
  const chunk = methodChunks?.find((c) => c.id === methodRef);

  if (!chunk) {
    return (
      <div className="rounded-lg border border-border bg-card/40 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="size-3.5" />
          <span className="font-mono text-[11px]">{methodRef}</span>
          <span>— 方法 chunk 未找到</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-500/10 bg-blue-500/[0.03] px-4 py-3 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen className="size-3.5 text-blue-400" />
        <span className="text-[11px] font-mono text-blue-400/80">
          {methodRef}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-foreground">{chunk.title}</p>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 border-blue-500/20 text-blue-400"
        >
          {METHOD_TYPE_LABELS[chunk.method_type] || chunk.method_type}
        </Badge>
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0"
        >
          来源: {chunk.source_ref}
        </Badge>
        <Badge
          variant="outline"
          className={`text-[10px] px-1.5 py-0 ${
            chunk.trust_level === "high"
              ? "border-emerald-500/20 text-emerald-400"
              : chunk.trust_level === "medium"
              ? "border-amber-500/20 text-amber-400"
              : "border-muted-foreground/20 text-muted-foreground"
          }`}
        >
          {chunk.trust_level === "high" ? "高可信" : chunk.trust_level === "medium" ? "中可信" : "低可信"}
        </Badge>
      </div>

      {/* Text */}
      <p className="text-xs text-foreground/75 leading-relaxed">{chunk.text}</p>
    </div>
  );
}
