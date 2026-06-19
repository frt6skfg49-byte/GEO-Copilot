// ─── Analysis ────────────────────────────────────────────────────────────────

export type AnalysisStatus = "queued" | "running" | "completed" | "failed";

export interface Analysis {
  id: string;
  input_url: string;
  final_url: string;
  status: AnalysisStatus;
  language: string;
  business_type?: string;
  target_keywords?: string[];
  created_at: string;
  completed_at?: string;
  error_code?: string;
}

export interface AnalysisCreateRequest {
  url: string;
  language?: string;
  business_type?: string;
  target_keywords?: string[];
}

// ─── Page Evidence ───────────────────────────────────────────────────────────

export interface PageEvidencePack {
  page: PageMeta;
  crawl_access: CrawlAccess;
  structure: PageStructure;
  schema: PageSchema;
  geo_content: GeoContent;
  rule_checks: RuleCheck[];
}

export interface PageMeta {
  url: string;
  final_url: string;
  status_code: number;
  title: string;
  description: string;
  canonical: string;
  html_lang: string;
}

export interface CrawlAccess {
  robots_found: boolean;
  sitemap_found: boolean;
  llms_txt_found: boolean;
  ai_bots_blocked: string[];
  server_rendered_content: boolean;
  js_dependency_risk: "low" | "medium" | "high";
}

export interface PageStructure {
  h1: string[];
  headings: HeadingItem[];
  content_blocks: ContentBlock[];
}

export interface HeadingItem {
  level: number;
  text: string;
}

export interface ContentBlock {
  block_id: string;
  block_type: string;
  excerpt: string;
}

export interface PageSchema {
  json_ld_count: number;
  schema_types: string[];
  entities: EntityInfo[];
  same_as_links: string[];
}

export interface EntityInfo {
  name: string;
  type: string;
}

export interface GeoContent {
  answer_summary_present: boolean;
  claim_candidates: ClaimCandidate[];
  evidence_candidates: EvidenceCandidate[];
  statistics: StatItem[];
  external_citations: Citation[];
  faq_blocks: FAQBlock[];
  comparison_blocks: ComparisonBlock[];
  procedure_blocks: ProcedureBlock[];
  citability_candidates: CitabilityCandidate[];
}

export interface ClaimCandidate {
  ref: string;
  text: string;
  support_state: "supported" | "partial" | "unsupported" | "unknown";
}

export interface EvidenceCandidate {
  ref: string;
  text: string;
  support_level: "full_support" | "partial_support" | "no_support" | "contradicts" | "inaccessible";
}

export interface StatItem {
  ref: string;
  text: string;
  source?: string;
}

export interface Citation {
  ref: string;
  url: string;
  text: string;
}

export interface FAQBlock {
  ref: string;
  question: string;
  answer: string;
}

export interface ComparisonBlock {
  ref: string;
  title: string;
}

export interface ProcedureBlock {
  ref: string;
  title: string;
  steps: number;
}

export interface CitabilityCandidate {
  ref: string;
  text: string;
  score: number;
}

export interface RuleCheck {
  check_id: string;
  check_name: string;
  passed: boolean;
  severity: "high" | "medium" | "low";
  finding: string;
  evidence_ref: string;
}

// ─── GEO Semantic Readout ───────────────────────────────────────────────────

export interface GeoSemanticReadout {
  page_ref: string;
  page_type: "generic" | "product" | "article" | "docs" | "landing" | "comparison" | "unknown";
  primary_entity: {
    name: string;
    type: "organization" | "product" | "person" | "concept" | "unknown";
    evidence_ref: string;
  };
  query_intents: QueryIntent[];
  selection_layer: SelectionLayer;
  absorption_layer: AbsorptionLayer;
  geo_units: GeoUnit[];
  failure_signals: FailureSignal[];
  retrieval_query_plan: RetrievalQueryPlan;
  unknowns: string[];
}

export interface QueryIntent {
  intent: "definition" | "comparison" | "purchase" | "troubleshooting" | "how_to" | "research" | "unknown";
  confidence: number;
  evidence_ref: string;
}

export interface SelectionLayer {
  crawl_access: "pass" | "risk" | "fail" | "unknown";
  entity_clarity: "strong" | "partial" | "weak" | "unknown";
  authority_signals: string[];
  blockers: string[];
}

export interface AbsorptionLayer {
  answer_ready_summary: "present" | "weak" | "missing" | "unknown";
  evidence_density: "strong" | "partial" | "weak" | "unknown";
  semantic_alignment: "strong" | "partial" | "weak" | "unknown";
  structural_legibility: "strong" | "partial" | "weak" | "unknown";
  blockers: string[];
}

export interface GeoUnit {
  unit_id: string;
  unit_type: "definition" | "claim" | "evidence" | "statistic" | "quote" | "comparison" | "procedure" | "faq" | "summary";
  source_refs: string[];
  claim: string;
  support_state: "full_support" | "partial_support" | "no_support" | "unknown";
  reuse_value: "high" | "medium" | "low";
  missing_fields: string[];
}

export interface FailureSignal {
  failure_type: string;
  severity: "high" | "medium" | "low";
  evidence_ref: string;
  why: string;
}

export interface RetrievalQueryPlan {
  base_required: boolean;
  page_type: string;
  detected_failures: string[];
  target_assets: string[];
  language: string;
}

// ─── DeepSeek Diagnosis ──────────────────────────────────────────────────────

export interface DeepSeekDiagnosis {
  geo_score: number;
  score_breakdown: ScoreBreakdown;
  executive_summary: string;
  issues: Issue[];
  priority_actions: PriorityAction[];
  asset_drafts: AssetDraft[];
  unknowns: string[];
}

export interface ScoreBreakdown {
  crawl_access: number;
  entity_clarity: number;
  structured_data: number;
  citability: number;
  evidence_support: number;
  answer_readiness: number;
}

export interface Issue {
  id: string;
  severity: "high" | "medium" | "low";
  category: string;
  finding: string;
  evidence_ref: string;
  method_ref: string;
  why_it_matters: string;
}

export interface PriorityAction {
  priority: number;
  action: string;
  expected_effect: string;
  effort: "low" | "medium" | "high";
  evidence_ref: string;
  method_ref: string;
}

export interface AssetDraft {
  asset_type: "faq" | "json_ld" | "summary" | "llms_txt" | "claim_evidence_block";
  draft: string;
  needs_human_confirmation: string[];
  evidence_ref: string;
  method_ref: string;
}

// ─── Method Chunks ──────────────────────────────────────────────────────────

export interface MethodChunk {
  id: string;
  document_id: string;
  method_type: "rubric" | "strategy" | "template" | "warning" | "output_rule" | "asset_pattern";
  page_type: string;
  failure_type: string;
  asset_type: string;
  title: string;
  text: string;
  trust_level: "high" | "medium" | "low";
  source_ref: string;
}

export interface RetrievedMethodPack {
  retrieval_query: string;
  chunks: RetrievedChunk[];
}

export interface RetrievedChunk {
  method_ref: string;
  source_title: string;
  method_type: string;
  text: string;
  why_selected: string;
}

// ─── Copilot ─────────────────────────────────────────────────────────────────

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface CopilotRequest {
  content: string;
}

// ─── Analysis Detail (Full API Response) ────────────────────────────────────

export interface AnalysisDetail extends Analysis {
  page_evidence?: PageEvidencePack;
  geo_readout?: GeoSemanticReadout;
  retrieved_methods?: RetrievedMethodPack;
  method_chunks?: MethodChunk[];
  diagnosis?: DeepSeekDiagnosis;
  messages?: CopilotMessage[];
}

// ─── Progress Steps ─────────────────────────────────────────────────────────

export interface ProgressStep {
  id: string;
  label: string;
  status: "waiting" | "active" | "done" | "error";
}

export const PROGRESS_STEPS: ProgressStep[] = [
  { id: "fetch", label: "页面抓取", status: "waiting" },
  { id: "parse", label: "结构解析", status: "waiting" },
  { id: "retrieve", label: "方法检索", status: "waiting" },
  { id: "diagnose", label: "GEO 诊断", status: "waiting" },
  { id: "build", label: "报告生成", status: "waiting" },
];
