"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export function UnknownsList({ unknowns }: { unknowns: string[] }) {
  if (!unknowns || unknowns.length === 0) return null;

  return (
    <Card className="border-border bg-card/40">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <HelpCircle className="size-4 text-amber-400" />
          未知项
          <span className="text-xs text-muted-foreground font-normal">
            — 当前证据不足，无法判断
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {unknowns.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="text-amber-400 mt-1.5 size-1.5 rounded-full bg-amber-400 shrink-0" />
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
