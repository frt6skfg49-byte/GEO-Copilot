"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/analysis/status-badge";
import { ProgressTracker } from "@/components/analysis/progress-tracker";
import { ScoreOverview } from "@/components/report/score-overview";
import { ExecutiveSummary } from "@/components/report/executive-summary";
import { SelectionAbsorption } from "@/components/report/selection-absorption";
import { IssuesList } from "@/components/report/issues-list";
import { PriorityActions } from "@/components/report/priority-actions";
import { AssetDrafts } from "@/components/report/asset-drafts";
import { UnknownsList } from "@/components/report/unknowns-list";
import { ChatPanel } from "@/components/copilot/chat-panel";
import {
  Globe,
  ArrowLeft,
  AlertCircle,
  Clock,
  BarChart3,
  ListChecks,
  FileCode,
  Layers,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { useAnalysis } from "@/hooks/use-analysis";

export function AnalysisDetailClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { analysis, isLoading, isError } = useAnalysis(id);
  const [activeTab, setActiveTab] = useState("overview");

  // Loading
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-96" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <Skeleton className="h-[200px] lg:col-span-2" />
          <Skeleton className="h-[200px] lg:col-span-3" />
        </div>
      </div>
    );
  }

  // Error
  if (isError || !analysis) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <AlertCircle className="size-10 text-destructive mx-auto mb-4" />
        <h1 className="text-lg font-semibold text-foreground mb-2">
          无法加载分析
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          分析记录不存在或加载失败，请检查分析 ID 是否正确
        </p>
        <Link href="/analyses">
          <Button variant="outline" size="sm">
            <ArrowLeft className="size-3.5 mr-1.5" />
            返回历史记录
          </Button>
        </Link>
      </div>
    );
  }

  const {
    status,
    input_url,
    created_at,
    completed_at,
    language,
    error_code,
    diagnosis,
    page_evidence,
    geo_readout,
    retrieved_methods,
    method_chunks,
    messages,
  } = analysis;

  const isComplete = status === "completed";
  const isFailed = status === "failed";
  const isRunning = status === "running" || status === "queued";

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/analyses">
                <Button variant="ghost" size="icon" className="size-8">
                  <ArrowLeft className="size-4" />
                </Button>
              </Link>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="size-4 text-muted-foreground shrink-0" />
                  <h1 className="text-lg font-semibold text-foreground truncate">
                    {input_url}
                  </h1>
                  <a
                    href={input_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <StatusBadge status={status} />
                  <span>
                    {new Date(created_at).toLocaleString("zh-CN")}
                  </span>
                  {language && <span>语言: {language}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Running / Queued */}
          {isRunning && (
            <Card className="border-border bg-card/40 animate-fade-in">
              <CardContent className="py-8">
                <ProgressTracker status={status} />
              </CardContent>
            </Card>
          )}

          {/* Failed */}
          {isFailed && (
            <Card className="border-destructive/20 bg-destructive/5 animate-fade-in">
              <CardContent className="flex items-start gap-3 px-5 py-6">
                <AlertCircle className="size-5 text-destructive mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-destructive">
                    分析失败
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {error_code
                      ? `错误码: ${error_code}`
                      : "分析过程中发生错误，请重试"}
                  </p>
                  <Link href="/">
                    <Button variant="outline" size="sm" className="mt-2">
                      <RefreshCw className="size-3.5 mr-1.5" />
                      重新分析
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Report */}
          {isComplete && diagnosis && (
            <div className="space-y-6 animate-fade-in">
              {/* Score Overview */}
              <ScoreOverview
                geoScore={diagnosis.geo_score}
                breakdown={diagnosis.score_breakdown}
              />

              {/* Executive Summary */}
              <ExecutiveSummary text={diagnosis.executive_summary} />

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full justify-start gap-1 bg-transparent border-b border-border rounded-none pb-0 h-auto">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none pb-2.5 text-xs data-[state=active]:text-foreground text-muted-foreground"
                  >
                    <BarChart3 className="size-3.5 mr-1.5" />
                    总览
                  </TabsTrigger>
                  <TabsTrigger
                    value="issues"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none pb-2.5 text-xs data-[state=active]:text-foreground text-muted-foreground"
                  >
                    <ListChecks className="size-3.5 mr-1.5" />
                    问题
                    <Badge
                      variant="outline"
                      className="ml-1.5 text-[10px] px-1 py-0"
                    >
                      {diagnosis.issues.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="actions"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none pb-2.5 text-xs data-[state=active]:text-foreground text-muted-foreground"
                  >
                    <ArrowUpRight className="size-3.5 mr-1.5" />
                    优先动作
                  </TabsTrigger>
                  <TabsTrigger
                    value="assets"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none pb-2.5 text-xs data-[state=active]:text-foreground text-muted-foreground"
                  >
                    <FileCode className="size-3.5 mr-1.5" />
                    资产草案
                    <Badge
                      variant="outline"
                      className="ml-1.5 text-[10px] px-1 py-0"
                    >
                      {diagnosis.asset_drafts.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="layers"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none pb-2.5 text-xs data-[state=active]:text-foreground text-muted-foreground"
                  >
                    <Layers className="size-3.5 mr-1.5" />
                    Layers
                  </TabsTrigger>
                  <TabsTrigger
                    value="unknowns"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none pb-2.5 text-xs data-[state=active]:text-foreground text-muted-foreground"
                  >
                    <HelpCircle className="size-3.5 mr-1.5" />
                    未知项
                  </TabsTrigger>
                </TabsList>

                <Separator className="-mt-px" />

                {/* Tab Contents */}
                <TabsContent value="overview" className="mt-6 space-y-6">
                  <SelectionAbsorption readout={geo_readout} />
                  {diagnosis.priority_actions.slice(0, 3).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <ArrowUpRight className="size-4 text-emerald-400" />
                        最高优先级动作
                      </h3>
                      <PriorityActions
                        actions={diagnosis.priority_actions.slice(0, 3)}
                        pageEvidence={page_evidence}
                        methodChunks={method_chunks}
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="issues" className="mt-6">
                  <IssuesList
                    issues={diagnosis.issues}
                    pageEvidence={page_evidence}
                    methodChunks={method_chunks}
                  />
                </TabsContent>

                <TabsContent value="actions" className="mt-6">
                  <PriorityActions
                    actions={diagnosis.priority_actions}
                    pageEvidence={page_evidence}
                    methodChunks={method_chunks}
                  />
                </TabsContent>

                <TabsContent value="assets" className="mt-6">
                  <AssetDrafts
                    assets={diagnosis.asset_drafts}
                    pageEvidence={page_evidence}
                    methodChunks={method_chunks}
                  />
                </TabsContent>

                <TabsContent value="layers" className="mt-6">
                  <SelectionAbsorption readout={geo_readout} />
                </TabsContent>

                <TabsContent value="unknowns" className="mt-6">
                  <UnknownsList unknowns={diagnosis.unknowns} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* Copilot Panel */}
      {isComplete && (
        <ChatPanel
          analysisId={id}
          messages={messages}
        />
      )}
    </div>
  );
}
