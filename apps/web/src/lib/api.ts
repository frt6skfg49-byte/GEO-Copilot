import type { Analysis, AnalysisCreateRequest, AnalysisDetail, CopilotMessage } from "./types";
import {
  MOCK_ANALYSES,
  MOCK_ANALYSIS_DETAIL,
  MOCK_COPILOT_MESSAGES,
} from "./mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Analyses ───────────────────────────────────────────────────────────────

export async function createAnalysis(
  data: AnalysisCreateRequest
): Promise<Analysis> {
  if (USE_MOCK) {
    await delay(600);
    return {
      id: `analysis_${Date.now()}`,
      input_url: data.url,
      final_url: data.url,
      status: "queued",
      language: data.language ?? "zh-CN",
      created_at: new Date().toISOString(),
    };
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}

export async function getAnalyses(params?: {
  status?: string;
}): Promise<Analysis[]> {
  if (USE_MOCK) {
    await delay(300);
    let list = MOCK_ANALYSES;
    if (params?.status) {
      list = list.filter((a) => a.status === params.status);
    }
    return list;
  }
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/analyses?${searchParams}`
  );
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}

export async function getAnalysis(id: string): Promise<AnalysisDetail> {
  if (USE_MOCK) {
    await delay(400);
    if (id === "analysis_001") return MOCK_ANALYSIS_DETAIL;
    // For other IDs return a generic detail (or mock running/failed analysis)
    const base = MOCK_ANALYSES.find((a) => a.id === id);
    if (!base) throw new Error("Analysis not found");
    if (base.status === "running") {
      return {
        ...base,
      };
    }
    if (base.status === "failed") {
      return { ...base };
    }
    return { ...base, ...MOCK_ANALYSIS_DETAIL };
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/analyses/${id}`
  );
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}

// ─── Copilot ─────────────────────────────────────────────────────────────────

export async function sendMessage(
  analysisId: string,
  content: string
): Promise<CopilotMessage> {
  if (USE_MOCK) {
    await delay(800);
    const userMsg: CopilotMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    // Simulate a response
    const aiReplies: Record<string, string> = {
      faq: `以下是根据页面证据生成的 FAQ 草案：

## What is SaaS Product?
SaaS Product is an AI-powered workflow automation platform for teams of all sizes. It helps automate repetitive tasks, integrate tools, and improve delivery speed. (需要你确认：产品描述是否准确?)

## Is there a free trial?
Yes, all plans include a 14-day free trial with no credit card required. (已验证自 page evidence: block_starter_plan)

## What AI models are supported?
Based on the page evidence this information is NOT present on the current page. 建议在 pricing 或 product 页面明确列出支持的 AI 模型。标记 needs_human_confirmation。`,
      json: "已在 asset_drafts 中生成 Product + FAQPage JSON-LD 草案，可直接查看并复制。",
      summary:
        "已在 asset_drafts 中生成 answer-ready summary 草案，包含实体定义、核心价值和第三方引用占位。请确认统计数据来源后使用。",
    };
    const lower = content.toLowerCase();
    let reply =
      "好的，这个分析中我注意到几个可以深入的点。你想先看哪个方面？";
    if (lower.includes("faq") || lower.includes("问答")) reply = aiReplies.faq;
    else if (lower.includes("json") || lower.includes("schema"))
      reply = aiReplies.json;
    else if (lower.includes("summary") || lower.includes("总结"))
      reply = aiReplies.summary;
    return {
      id: `msg_${Date.now() + 1}`,
      role: "assistant",
      content: reply,
      created_at: new Date().toISOString(),
    };
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/analyses/${analysisId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }
  );
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}
