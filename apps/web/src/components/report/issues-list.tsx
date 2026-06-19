"use client";

import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { IssueCard } from "./issue-card";
import type { Issue, PageEvidencePack, MethodChunk } from "@/lib/types";

interface IssuesListProps {
  issues: Issue[];
  pageEvidence?: PageEvidencePack;
  methodChunks?: MethodChunk[];
}

export function IssuesList({ issues, pageEvidence, methodChunks }: IssuesListProps) {
  if (!issues || issues.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">未发现问题</p>
      </div>
    );
  }

  const grouped = {
    high: issues.filter((i) => i.severity === "high"),
    medium: issues.filter((i) => i.severity === "medium"),
    low: issues.filter((i) => i.severity === "low"),
  };

  return (
    <div className="space-y-4">
      {grouped.high.length > 0 && (
        <Section
          label="严重问题"
          icon={AlertTriangle}
          color="text-destructive"
          issues={grouped.high}
          pageEvidence={pageEvidence}
          methodChunks={methodChunks}
        />
      )}
      {grouped.medium.length > 0 && (
        <Section
          label="中等问题"
          icon={AlertCircle}
          color="text-amber-400"
          issues={grouped.medium}
          pageEvidence={pageEvidence}
          methodChunks={methodChunks}
        />
      )}
      {grouped.low.length > 0 && (
        <Section
          label="轻微问题"
          icon={Info}
          color="text-blue-400"
          issues={grouped.low}
          pageEvidence={pageEvidence}
          methodChunks={methodChunks}
        />
      )}
    </div>
  );
}

function Section({
  label,
  icon: Icon,
  color,
  issues,
  pageEvidence,
  methodChunks,
}: {
  label: string;
  icon: typeof AlertTriangle;
  color: string;
  issues: Issue[];
  pageEvidence?: PageEvidencePack;
  methodChunks?: MethodChunk[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs">
        <Icon className={`size-3.5 ${color}`} />
        <span className="font-medium text-muted-foreground">
          {label}
        </span>
        <span className="text-muted-foreground/60">({issues.length})</span>
      </div>
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          pageEvidence={pageEvidence}
          methodChunks={methodChunks}
        />
      ))}
    </div>
  );
}
