"use client";

import { FileSearch } from "lucide-react";
import type { PageEvidencePack } from "@/lib/types";

interface EvidenceExpandProps {
  evidenceRef: string;
  pageEvidence?: PageEvidencePack;
}

function resolveEvidence(ref: string, evidence?: PageEvidencePack): string | null {
  if (!evidence) return null;

  // Try to resolve ref like "crawl_access.ai_bots_blocked", "schema.schema_types", etc.
  const parts = ref.split(".");
  let current: any = evidence;

  for (const part of parts) {
    if (current === undefined || current === null) return null;
    // Handle array indices like "claim_candidates[1]"
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      current = current[arrayMatch[1]]?.[parseInt(arrayMatch[2])];
    } else {
      current = current[part];
    }
  }

  if (typeof current === "string") return current;
  if (typeof current === "boolean") return current ? "true" : "false";
  if (typeof current === "number") return String(current);
  if (Array.isArray(current)) {
    return current.map((item) =>
      typeof item === "string" ? item : item.text || item.name || JSON.stringify(item)
    ).join(", ");
  }
  if (typeof current === "object" && current !== null) {
    return JSON.stringify(current, null, 2);
  }
  return null;
}

export function EvidenceExpand({
  evidenceRef,
  pageEvidence,
}: EvidenceExpandProps) {
  const value = resolveEvidence(evidenceRef, pageEvidence);
  if (!value) {
    return (
      <div className="rounded-lg border border-border bg-card/40 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileSearch className="size-3.5" />
          <span className="font-mono text-[11px]">{evidenceRef}</span>
          <span>— 证据未找到（mock 模式下可能不完整）</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.03] px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <FileSearch className="size-3.5 text-emerald-400" />
        <span className="text-[11px] font-mono text-emerald-400/80">
          {evidenceRef}
        </span>
      </div>
      <pre className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap font-mono">
        {value}
      </pre>
    </div>
  );
}
