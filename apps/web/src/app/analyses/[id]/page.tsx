import type { Metadata } from "next";
import { AnalysisDetailClient } from "./client";

// Pre-render all mock analysis detail pages for static export
export function generateStaticParams() {
  return [
    { id: "analysis_001" },
    { id: "analysis_002" },
    { id: "analysis_003" },
    { id: "analysis_004" },
    { id: "analysis_005" },
  ];
}

export const metadata: Metadata = {
  title: "分析详情 — GEO Copilot",
};

export default function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AnalysisDetailClient params={params} />;
}
