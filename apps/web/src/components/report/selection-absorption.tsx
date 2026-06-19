"use client";

import { Shield, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { GeoSemanticReadout } from "@/lib/types";

function StatusDot({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    pass: "bg-emerald-500",
    strong: "bg-emerald-500",
    risk: "bg-amber-500",
    fail: "bg-destructive",
    partial: "bg-amber-500",
    weak: "bg-destructive",
    missing: "bg-destructive",
    unknown: "bg-muted-foreground",
    present: "bg-emerald-500",
  };
  return (
    <span
      className={`inline-block size-2 rounded-full ${colorMap[status] || "bg-muted-foreground"}`}
    />
  );
}

function StatusLabel({ val }: { val: string }) {
  const labelMap: Record<string, string> = {
    pass: "通过",
    risk: "风险",
    fail: "未通过",
    strong: "强",
    partial: "部分",
    weak: "弱",
    missing: "缺失",
    unknown: "未知",
    present: "存在",
  };
  return <>{labelMap[val] || val}</>;
}

export function SelectionAbsorption({
  readout,
}: {
  readout?: GeoSemanticReadout;
}) {
  if (!readout) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {/* Selection Layer */}
      <Card className="border-border bg-card/40">
        <CardContent className="pt-5 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-blue-400" />
            <span className="text-sm font-medium text-foreground">
              Citation Selection
            </span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 border-blue-500/20 text-blue-400"
            >
              能否被发现
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            页面能否被 AI 搜索引擎纳入候选来源集合
          </p>
          <Separator />
          <div className="space-y-2">
            <Row
              label="爬虫访问"
              status={readout.selection_layer.crawl_access}
            />
            <Row
              label="实体清晰度"
              status={readout.selection_layer.entity_clarity}
            />
            {readout.selection_layer.authority_signals.length > 0 && (
              <div className="text-xs text-muted-foreground pt-1">
                <span className="text-[11px]">权威信号：</span>
                {readout.selection_layer.authority_signals.join("、")}
              </div>
            )}
          </div>
          {readout.selection_layer.blockers.length > 0 && (
            <div className="rounded-md bg-destructive/5 border border-destructive/10 px-3 py-2 space-y-1">
              <span className="text-[11px] font-medium text-destructive">
                选择层障碍
              </span>
              {readout.selection_layer.blockers.map((b, i) => (
                <p key={i} className="text-xs text-foreground/70">
                  · {b}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Absorption Layer */}
      <Card className="border-border bg-card/40">
        <CardContent className="pt-5 space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="size-4 text-purple-400" />
            <span className="text-sm font-medium text-foreground">
              Citation Absorption
            </span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 border-purple-500/20 text-purple-400"
            >
              是否被引用
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            页面内容能否真正影响 AI 生成的最终答案
          </p>
          <Separator />
          <div className="space-y-2">
            <Row
              label="答案就绪摘要"
              status={readout.absorption_layer.answer_ready_summary}
            />
            <Row
              label="证据密度"
              status={readout.absorption_layer.evidence_density}
            />
            <Row
              label="语义对齐"
              status={readout.absorption_layer.semantic_alignment}
            />
            <Row
              label="结构可读性"
              status={readout.absorption_layer.structural_legibility}
            />
          </div>
          {readout.absorption_layer.blockers.length > 0 && (
            <div className="rounded-md bg-destructive/5 border border-destructive/10 px-3 py-2 space-y-1">
              <span className="text-[11px] font-medium text-destructive">
                吸收层障碍
              </span>
              {readout.absorption_layer.blockers.map((b, i) => (
                <p key={i} className="text-xs text-foreground/70">
                  · {b}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 text-xs">
        <StatusDot status={status} />
        <span className="text-foreground/80">
          <StatusLabel val={status} />
        </span>
      </span>
    </div>
  );
}
