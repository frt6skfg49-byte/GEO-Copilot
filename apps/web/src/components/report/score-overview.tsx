"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ScoreBreakdown } from "@/lib/types";

const DIMENSIONS = [
  { key: "crawl_access", label: "爬虫可访问", desc: "Crawl Access" },
  { key: "entity_clarity", label: "实体清晰度", desc: "Entity Clarity" },
  { key: "structured_data", label: "结构化数据", desc: "Structured Data" },
  { key: "citability", label: "可引用性", desc: "Citability" },
  { key: "evidence_support", label: "证据支撑", desc: "Evidence" },
  { key: "answer_readiness", label: "答案就绪", desc: "Answer Ready" },
] as const;

function getScoreColor(score: number): string {
  if (score >= 60) return "#10b981";
  if (score >= 30) return "#f59e0b";
  return "#f43f5e";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "优秀";
  if (score >= 60) return "良好";
  if (score >= 40) return "一般";
  if (score >= 20) return "较差";
  return "严重不足";
}

function ringOffset(score: number): number {
  const circumference = 2 * Math.PI * 54;
  const progress = score / 100;
  return circumference * (1 - progress);
}

export function ScoreOverview({
  geoScore,
  breakdown,
}: {
  geoScore: number;
  breakdown: ScoreBreakdown;
}) {
  const scoreColor = getScoreColor(geoScore);

  const chartData = DIMENSIONS.map((d) => ({
    dimension: d.label,
    value: breakdown[d.key],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-fade-in">
      {/* Big Score Ring */}
      <Card className="lg:col-span-2 border-border bg-card/60">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="relative inline-flex items-center justify-center">
            <svg width="140" height="140" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="hsl(217 33% 17%)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={ringOffset(geoScore)}
                transform="rotate(-90 60 60)"
                className="score-ring"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-4xl font-bold tracking-tight"
                style={{ color: scoreColor }}
              >
                {geoScore}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                / 100
              </span>
            </div>
          </div>
          <span
            className="mt-3 text-sm font-medium"
            style={{ color: scoreColor }}
          >
            {getScoreLabel(geoScore)}
          </span>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card className="lg:col-span-3 border-border bg-card/60">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-medium">
            六维评分
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="hsl(217 33% 17%)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{
                    fill: "hsl(215 20% 65%)",
                    fontSize: 11,
                  }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }}
                  axisLine={false}
                  tickCount={3}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke={scoreColor}
                  fill={scoreColor}
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <Separator className="my-3" />

          {/* Score Bars */}
          <div className="space-y-2">
            {DIMENSIONS.map((dim) => {
              const val = breakdown[dim.key];
              const color = getScoreColor(val);
              return (
                <div key={dim.key} className="flex items-center gap-3">
                  <span className="w-[88px] text-xs text-muted-foreground shrink-0">
                    {dim.label}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${val}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-mono font-medium w-7 text-right shrink-0"
                    style={{ color }}
                  >
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
