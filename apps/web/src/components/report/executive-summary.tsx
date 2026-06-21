"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function ExecutiveSummary({ text }: { text: string }) {
  return (
    <Card className="border-primary/8 bg-primary/[0.03]">
      <CardContent className="flex items-start gap-3 px-5 py-4">
        <Lightbulb className="size-4 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{text}</p>
      </CardContent>
    </Card>
  );
}
