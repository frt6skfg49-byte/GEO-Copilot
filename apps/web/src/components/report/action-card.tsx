"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvidenceExpand } from "@/components/evidence/evidence-expand";
import { MethodExpand } from "@/components/evidence/method-expand";
import { cn } from "@/lib/utils";
import type { PriorityAction, PageEvidencePack, MethodChunk } from "@/lib/types";

const EFFORT_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: "低投入", color: "border-primary/15 text-primary bg-primary/5" },
  medium: { label: "中投入", color: "border-amber-500/20 text-amber-400 bg-amber-500/5" },
  high: { label: "高投入", color: "border-destructive/20 text-destructive bg-destructive/5" },
};

interface ActionCardProps {
  action: PriorityAction;
  pageEvidence?: PageEvidencePack;
  methodChunks?: MethodChunk[];
}

export function ActionCard({ action, pageEvidence, methodChunks }: ActionCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-border bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left cursor-pointer hover:bg-accent/20 transition-colors"
      >
        <CardContent className="px-4 py-3">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-xs font-bold shrink-0",
                action.priority <= 3
                  ? "bg-primary/8 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {action.priority}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground/85 leading-relaxed">
                {action.action}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    EFFORT_CONFIG[action.effort]?.color
                  )}
                >
                  {EFFORT_CONFIG[action.effort]?.label || action.effort}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {action.expected_effect}
                </span>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform shrink-0 mt-1",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </CardContent>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in">
          <EvidenceExpand
            evidenceRef={action.evidence_ref}
            pageEvidence={pageEvidence}
          />
          <MethodExpand
            methodRef={action.method_ref}
            methodChunks={methodChunks}
          />
        </div>
      )}
    </Card>
  );
}
