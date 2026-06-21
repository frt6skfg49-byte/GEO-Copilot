"use client";

import { useState } from "react";
import { Copy, Check, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EvidenceExpand } from "@/components/evidence/evidence-expand";
import { MethodExpand } from "@/components/evidence/method-expand";
import { cn } from "@/lib/utils";
import type { AssetDraft, PageEvidencePack, MethodChunk } from "@/lib/types";

const ASSET_LABELS: Record<string, string> = {
  faq: "FAQ 草案",
  json_ld: "JSON-LD Schema",
  summary: "Answer-Ready Summary",
  llms_txt: "llms.txt",
  claim_evidence_block: "Claim-Evidence Block",
};

const ASSET_LANG: Record<string, string> = {
  faq: "markdown",
  json_ld: "json",
  summary: "markdown",
  llms_txt: "markdown",
  claim_evidence_block: "markdown",
};

interface AssetCardProps {
  asset: AssetDraft;
  pageEvidence?: PageEvidencePack;
  methodChunks?: MethodChunk[];
}

export function AssetCard({ asset, pageEvidence, methodChunks }: AssetCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showEvidence, setShowEvidence] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(asset.draft);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <Card className="border-border bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[11px] px-2 py-0.5 border-primary/15 text-primary bg-primary/5"
            >
              {ASSET_LABELS[asset.asset_type] || asset.asset_type}
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 text-muted-foreground"
            >
              {ASSET_LANG[asset.asset_type] || "text"}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <EyeOff className="size-3.5 text-muted-foreground" />
              ) : (
                <Eye className="size-3.5 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={handleCopy}
            >
              {isCopied ? (
                <Check className="size-3.5 text-primary" />
              ) : (
                <Copy className="size-3.5 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Preview */}
        {showPreview && (
          <div className="rounded-lg border border-border bg-muted/30">
            <pre className="code-block p-4 text-xs leading-relaxed whitespace-pre-wrap">
              {asset.draft}
            </pre>
          </div>
        )}

        {/* Human confirmation needed */}
        {asset.needs_human_confirmation.length > 0 && (
          <div className="rounded-lg border border-amber-500/15 bg-amber-500/[0.04] px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="size-3.5 text-amber-400" />
              <span className="text-[11px] font-medium text-amber-400">
                需人工确认
              </span>
            </div>
            <ul className="space-y-1">
              {asset.needs_human_confirmation.map((item, i) => (
                <li
                  key={i}
                  className="text-xs text-foreground/65 flex items-start gap-1.5"
                >
                  <span className="text-amber-400 mt-1.5 size-1 rounded-full bg-amber-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Show references toggle */}
        {!showEvidence && (
          <Button
            variant="ghost"
            size="sm"
            className="text-[11px] text-muted-foreground h-7"
            onClick={() => setShowEvidence(true)}
          >
            查看引用依据
          </Button>
        )}

        {showEvidence && (
          <>
            <EvidenceExpand
              evidenceRef={asset.evidence_ref}
              pageEvidence={pageEvidence}
            />
            <MethodExpand
              methodRef={asset.method_ref}
              methodChunks={methodChunks}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
