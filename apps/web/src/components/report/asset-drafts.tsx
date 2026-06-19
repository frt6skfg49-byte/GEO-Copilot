"use client";

import { AssetCard } from "./asset-card";
import type { AssetDraft, PageEvidencePack, MethodChunk } from "@/lib/types";

interface AssetDraftsProps {
  assets: AssetDraft[];
  pageEvidence?: PageEvidencePack;
  methodChunks?: MethodChunk[];
}

export function AssetDrafts({ assets, pageEvidence, methodChunks }: AssetDraftsProps) {
  if (!assets || assets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">无资产草案</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assets.map((asset, i) => (
        <AssetCard
          key={`${asset.asset_type}_${i}`}
          asset={asset}
          pageEvidence={pageEvidence}
          methodChunks={methodChunks}
        />
      ))}
    </div>
  );
}
