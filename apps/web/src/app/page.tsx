"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Globe, ChevronDown, ChevronUp, History, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

import { createAnalysis } from "@/lib/api";

const RECENT_URLS = [
  { url: "saas-product.com/pricing", time: "10 分钟前" },
  { url: "example.com/blog/ai-trends", time: "2 小时前" },
  { url: "docs.theproduct.com/api", time: "昨天" },
];

export default function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("zh-CN");
  const [businessType, setBusinessType] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    let normalized = url.trim();
    if (!normalized) {
      setError("请输入 URL");
      return;
    }
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }

    try {
      new URL(normalized);
    } catch {
      setError("URL 格式无效，请输入完整的网址");
      return;
    }

    setIsSubmitting(true);
    try {
      const analysis = await createAnalysis({
        url: normalized,
        language,
        business_type: businessType || undefined,
      });
      router.push(`/analyses/${analysis.id}`);
    } catch {
      setError("创建分析失败，请检查后端服务");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center px-6 py-16">
      {/* Hero */}
      <div className="mb-12 text-center animate-slide-up">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <Sparkles className="size-7 text-emerald-400" />
        </div>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground">
          GEO Copilot
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          输入任意网址，基于页面证据和 GEO 前沿方法知识库，获得结构化优化反馈报告
        </p>
      </div>

      {/* URL Input */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl animate-fade-in"
      >
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6 space-y-4">
            <InputGroup>
              <InputGroupAddon>
                <Globe className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                placeholder="输入网址，开始 GEO 诊断..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                className="h-12 text-base placeholder:text-sm"
                aria-invalid={!!error}
                disabled={isSubmitting}
              />
            </InputGroup>
            {error && (
              <p className="text-xs text-destructive animate-fade-in">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 size-4 animate-spin rounded-full border-2 border-emerald-900 border-t-emerald-400" />
                  正在创建分析...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" />
                  开始分析
                </>
              )}
            </Button>

            {/* Advanced Options */}
            <Collapsible
              open={isAdvancedOpen}
              onOpenChange={setIsAdvancedOpen}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
                {isAdvancedOpen ? (
                  <ChevronUp className="size-3" />
                ) : (
                  <ChevronDown className="size-3" />
                )}
                高级选项
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      输出语言
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                    >
                      <option value="zh-CN">简体中文</option>
                      <option value="en">English</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      业务类型
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                    >
                      <option value="">自动检测</option>
                      <option value="b2b_saas">B2B SaaS</option>
                      <option value="ecommerce">电商</option>
                      <option value="tech_blog">技术博客</option>
                      <option value="api_docs">API 文档</option>
                    </select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </form>

      {/* Recent */}
      <div className="mt-12 w-full max-w-2xl animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <History className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">最近分析</span>
        </div>
        <div className="space-y-2">
          {RECENT_URLS.map((item) => (
            <Card
              key={item.url}
              className="group cursor-pointer border-border bg-card/30 hover:bg-card/60 transition-all"
              onClick={() =>
                router.push(
                  `/analyses/analysis_00${RECENT_URLS.indexOf(item) + 1}`
                )
              }
            >
              <CardContent className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Globe className="size-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm truncate text-foreground/80">
                    {item.url}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {item.time}
                  </Badge>
                  <ArrowRight className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Separator className="mt-4 mb-4" />
        <Button
          variant="ghost"
          className="w-full text-sm text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/analyses")}
        >
          查看全部历史记录
          <ArrowRight className="ml-1 size-3" />
        </Button>
      </div>
    </div>
  );
}
