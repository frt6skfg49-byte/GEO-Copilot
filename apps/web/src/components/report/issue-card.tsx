"use client";

import { useState } from "react";
import { ChevronDown, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvidenceExpand } from "@/components/evidence/evidence-expand";
import { MethodExpand } from "@/components/evidence/method-expand";
import { cn } from "@/lib/utils";
import type { Issue, PageEvidencePack, MethodChunk } from "@/lib/types";

const SEVERITY_CONFIG = {
  high: {
    label: "严重",
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/5",
    border: "border-l-destructive",
  },
  medium: {
    label: "中等",
    icon: AlertCircle,
    color: "text-amber-400",
    bg: "bg-amber-500/5",
    border: "border-l-amber-400",
  },
  low: {
    label: "轻微",
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/5",
    border: "border-l-blue-400",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  crawl_access: "爬虫访问",
  entity_clarity: "实体清晰度",
  structured_data: "结构化数据",
  citability: "可引用性",
  evidence_support: "证据支撑",
  answer_readiness: "答案就绪",
};

interface IssueCardProps {
  issue: Issue;
  pageEvidence?: PageEvidencePack;
  methodChunks?: MethodChunk[];
}

export function IssueCard({ issue, pageEvidence, methodChunks }: IssueCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const severity = SEVERITY_CONFIG[issue.severity];
  const Icon = severity.icon;

  return (
    <Card
      className={cn(
        "border-l-2 border-border bg-card/40 transition-all",
        isOpen && severity.bg,
        severity.border
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left cursor-pointer hover:bg-accent/20 transition-colors"
      >
        <CardContent className="px-4 py-3">
          <div className="flex items-start gap-3">
            <Icon className={cn("size-4 mt-0.5 shrink-0", severity.color)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    severity.color,
                    severity.bg
                  )}
                >
                  {severity.label}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
                  {CATEGORY_LABELS[issue.category] || issue.category}
                </Badge>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">
                {issue.finding}
              </p>
            </div>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform shrink-0 mt-0.5",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </CardContent>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in">
          {issue.why_it_matters && (
            <div className="rounded-lg bg-accent/30 px-3 py-2.5">
              <span className="text-[11px] font-medium text-muted-foreground">
                为什么重要
              </span>
              <p className="text-xs text-foreground/70 mt-1">
                {issue.why_it_matters}
              </p>
            </div>
          )}
          <EvidenceExpand
            evidenceRef={issue.evidence_ref}
            pageEvidence={pageEvidence}
          />
          <MethodExpand
            methodRef={issue.method_ref}
            methodChunks={methodChunks}
          />
        </div>
      )}
    </Card>
  );
}
