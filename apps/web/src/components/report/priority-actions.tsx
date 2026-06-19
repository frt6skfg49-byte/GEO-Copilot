"use client";

import { ActionCard } from "./action-card";
import type { PriorityAction, PageEvidencePack, MethodChunk } from "@/lib/types";

interface PriorityActionsProps {
  actions: PriorityAction[];
  pageEvidence?: PageEvidencePack;
  methodChunks?: MethodChunk[];
}

export function PriorityActions({ actions, pageEvidence, methodChunks }: PriorityActionsProps) {
  if (!actions || actions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">无优先动作</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {actions
        .sort((a, b) => a.priority - b.priority)
        .map((action) => (
          <ActionCard
            key={action.priority}
            action={action}
            pageEvidence={pageEvidence}
            methodChunks={methodChunks}
          />
        ))}
    </div>
  );
}
