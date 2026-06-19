import type {
  Analysis,
  AnalysisDetail,
  PageEvidencePack,
  GeoSemanticReadout,
  DeepSeekDiagnosis,
  MethodChunk,
  RetrievedMethodPack,
  CopilotMessage,
} from "./types";

// ─── Completed Analysis ──────────────────────────────────────────────────────

export const MOCK_ANALYSES: Analysis[] = [
  {
    id: "analysis_001",
    input_url: "https://www.saas-product.com/pricing",
    final_url: "https://www.saas-product.com/pricing",
    status: "completed",
    language: "zh-CN",
    business_type: "b2b_saas",
    target_keywords: ["AI search optimization", "GEO"],
    created_at: "2026-06-19T10:30:00Z",
    completed_at: "2026-06-19T10:31:25Z",
  },
  {
    id: "analysis_002",
    input_url: "https://example.com/blog/ai-trends-2026",
    final_url: "https://example.com/blog/ai-trends-2026",
    status: "completed",
    language: "zh-CN",
    business_type: "tech_blog",
    created_at: "2026-06-19T09:15:00Z",
    completed_at: "2026-06-19T09:16:10Z",
  },
  {
    id: "analysis_003",
    input_url: "https://blocked-site.com/crawlers-denied",
    final_url: "https://blocked-site.com/crawlers-denied",
    status: "completed",
    language: "zh-CN",
    created_at: "2026-06-18T14:20:00Z",
    completed_at: "2026-06-18T14:21:30Z",
  },
  {
    id: "analysis_004",
    input_url: "https://docs.theproduct.com/api-reference",
    final_url: "https://docs.theproduct.com/api-reference",
    status: "running",
    language: "zh-CN",
    business_type: "api_docs",
    created_at: "2026-06-19T11:00:00Z",
  },
  {
    id: "analysis_005",
    input_url: "https://garbage.link/nx8k2p",
    final_url: "https://garbage.link/nx8k2p",
    status: "failed",
    language: "zh-CN",
    error_code: "FETCH_TIMEOUT",
    created_at: "2026-06-18T16:45:00Z",
    completed_at: "2026-06-18T16:45:35Z",
  },
];

// ─── Page Evidence Pack ─────────────────────────────────────────────────────

export const MOCK_PAGE_EVIDENCE: PageEvidencePack = {
  page: {
    url: "https://www.saas-product.com/pricing",
    final_url: "https://www.saas-product.com/pricing",
    status_code: 200,
    title: "Pricing — SaaS Product | AI-Powered Workflow Automation",
    description:
      "Flexible pricing plans for teams of all sizes. Start free, scale as you grow.",
    canonical: "https://www.saas-product.com/pricing",
    html_lang: "en",
  },
  crawl_access: {
    robots_found: true,
    sitemap_found: true,
    llms_txt_found: false,
    ai_bots_blocked: ["GPTBot"],
    server_rendered_content: true,
    js_dependency_risk: "low",
  },
  structure: {
    h1: ["Pricing Plans"],
    headings: [
      { level: 1, text: "Pricing Plans" },
      { level: 2, text: "Starter" },
      { level: 2, text: "Professional" },
      { level: 2, text: "Enterprise" },
      { level: 3, text: "Frequently Asked Questions" },
    ],
    content_blocks: [
      {
        block_id: "block_pricing_intro",
        block_type: "intro",
        excerpt:
          "Choose the plan that fits your team. All plans include a 14-day free trial. No credit card required. Our AI-powered automation helps teams ship faster...",
      },
      {
        block_id: "block_starter_plan",
        block_type: "pricing_tier",
        excerpt:
          "Starter — $29/mo. Up to 5 users, 100 workflows, basic analytics, email support...",
      },
      {
        block_id: "block_enterprise_plan",
        block_type: "pricing_tier",
        excerpt:
          "Enterprise — Custom pricing. Unlimited users, unlimited workflows, advanced security, dedicated support, SLA guarantee...",
      },
      {
        block_id: "block_faq_price_matching",
        block_type: "faq",
        excerpt:
          "Q: Do you offer price matching? A: Yes, we'll match any competitor plan feature-for-feature.",
      },
    ],
  },
  schema: {
    json_ld_count: 1,
    schema_types: ["Organization"],
    entities: [
      { name: "SaaS Product Inc.", type: "organization" },
    ],
    same_as_links: [],
  },
  geo_content: {
    answer_summary_present: false,
    claim_candidates: [
      {
        ref: "claim_001",
        text: "Our AI-powered automation helps teams ship faster",
        support_state: "unsupported",
      },
      {
        ref: "claim_002",
        text: "Trusted by over 10,000 companies worldwide",
        support_state: "unsupported",
      },
      {
        ref: "claim_003",
        text: "We'll match any competitor plan feature-for-feature",
        support_state: "partial",
      },
    ],
    evidence_candidates: [
      {
        ref: "ev_001",
        text: "All plans include a 14-day free trial",
        support_level: "full_support",
      },
    ],
    statistics: [],
    external_citations: [],
    faq_blocks: [
      {
        ref: "faq_001",
        question: "Do you offer price matching?",
        answer:
          "Yes, we'll match any competitor plan feature-for-feature.",
      },
      {
        ref: "faq_002",
        question: "Can I cancel anytime?",
        answer: "Yes, all plans are month-to-month with no lock-in.",
      },
    ],
    comparison_blocks: [],
    procedure_blocks: [],
    citability_candidates: [
      {
        ref: "cit_001",
        text: "No credit card required. Our AI-powered automation helps teams ship faster.",
        score: 35,
      },
    ],
  },
  rule_checks: [
    {
      check_id: "rule_title",
      check_name: "Title exists",
      passed: true,
      severity: "high",
      finding: "Title is present and descriptive.",
      evidence_ref: "page.title",
    },
    {
      check_id: "rule_meta_description",
      check_name: "Meta description exists",
      passed: true,
      severity: "medium",
      finding: "Meta description present.",
      evidence_ref: "page.description",
    },
    {
      check_id: "rule_robots_txt",
      check_name: "robots.txt exists",
      passed: true,
      severity: "high",
      finding: "robots.txt found.",
      evidence_ref: "crawl_access.robots_found",
    },
    {
      check_id: "rule_llms_txt",
      check_name: "llms.txt exists",
      passed: false,
      severity: "high",
      finding:
        "llms.txt not found at /llms.txt. This is a critical access layer for AI crawlers.",
      evidence_ref: "crawl_access.llms_txt_found",
    },
    {
      check_id: "rule_ai_bots_blocked",
      check_name: "AI bots not blocked",
      passed: false,
      severity: "high",
      finding:
        "GPTBot is blocked in robots.txt. The page will not be crawled by ChatGPT.",
      evidence_ref: "crawl_access.ai_bots_blocked",
    },
    {
      check_id: "rule_json_ld",
      check_name: "JSON-LD schema present",
      passed: true,
      severity: "medium",
      finding: "1 JSON-LD block found but only Organization type. Missing Product and FAQPage schema.",
      evidence_ref: "schema.json_ld_count",
    },
    {
      check_id: "rule_claims_supported",
      check_name: "Claims have evidence",
      passed: false,
      severity: "medium",
      finding:
        "3 claims detected, 0 fully supported. 'trusted by over 10,000 companies' has no source.",
      evidence_ref: "geo_content.claim_candidates",
    },
  ],
};

// ─── GEO Semantic Readout ────────────────────────────────────────────────────

export const MOCK_GEO_READOUT: GeoSemanticReadout = {
  page_ref: "analysis_001",
  page_type: "product",
  primary_entity: {
    name: "SaaS Product Inc.",
    type: "organization",
    evidence_ref: "schema.entities[0]",
  },
  query_intents: [
    {
      intent: "purchase",
      confidence: 0.85,
      evidence_ref: "structure.h1",
    },
    {
      intent: "comparison",
      confidence: 0.4,
      evidence_ref: "structure.headings",
    },
  ],
  selection_layer: {
    crawl_access: "risk",
    entity_clarity: "partial",
    authority_signals: ["Organization schema present"],
    blockers: [
      "GPTBot blocked in robots.txt",
      "llms.txt missing",
      "No sameAs links for entity verification",
    ],
  },
  absorption_layer: {
    answer_ready_summary: "missing",
    evidence_density: "weak",
    semantic_alignment: "partial",
    structural_legibility: "partial",
    blockers: [
      "No answer-ready summary block",
      "Claims lack supporting evidence (0/3 fully supported)",
      "No statistics or external citations",
    ],
  },
  geo_units: [
    {
      unit_id: "geo_unit_001",
      unit_type: "claim",
      source_refs: ["claim_001"],
      claim: "AI-powered automation helps teams ship faster",
      support_state: "no_support",
      reuse_value: "low",
      missing_fields: ["source", "statistic", "date"],
    },
    {
      unit_id: "geo_unit_002",
      unit_type: "faq",
      source_refs: ["faq_001"],
      claim: "We'll match any competitor plan feature-for-feature",
      support_state: "partial_support",
      reuse_value: "medium",
      missing_fields: ["comparison_table", "source", "scope"],
    },
  ],
  failure_signals: [
    {
      failure_type: "crawler_blocked",
      severity: "high",
      evidence_ref: "crawl_access.ai_bots_blocked",
      why: "GPTBot is blocked, preventing ChatGPT source access.",
    },
    {
      failure_type: "missing_summary",
      severity: "high",
      evidence_ref: "geo_content.answer_summary_present",
      why: "No concise answer-ready opening block for AI answer engines.",
    },
    {
      failure_type: "weak_evidence",
      severity: "high",
      evidence_ref: "geo_content.claim_candidates",
      why: "0 of 3 claims have full evidence support.",
    },
    {
      failure_type: "missing_schema",
      severity: "medium",
      evidence_ref: "schema.schema_types",
      why: "Only Organization schema. Product and FAQPage missing.",
    },
    {
      failure_type: "weak_entity",
      severity: "medium",
      evidence_ref: "schema.same_as_links",
      why: "No sameAs links to verify entity identity.",
    },
    {
      failure_type: "low_citability",
      severity: "medium",
      evidence_ref: "geo_content.citability_candidates",
      why: "Only 1 low-score citability candidate. Claims are generic.",
    },
  ],
  retrieval_query_plan: {
    base_required: true,
    page_type: "product",
    detected_failures: [
      "crawler_blocked",
      "missing_schema",
      "weak_evidence",
      "weak_entity",
      "missing_summary",
    ],
    target_assets: ["summary", "claim_evidence_block", "json_ld", "llms_txt"],
    language: "zh-CN",
  },
  unknowns: [
    "AI bot crawl behavior for blocked bots",
    "Actual AI search visibility for target keywords",
  ],
};

// ─── Method Chunks ──────────────────────────────────────────────────────────

export const MOCK_METHOD_CHUNKS: MethodChunk[] = [
  {
    id: "chunk_geo_source_citation_001",
    document_id: "paper_geo_2024",
    method_type: "strategy",
    page_type: "generic",
    failure_type: "weak_evidence",
    asset_type: "claim_evidence_block",
    title: "Add verifiable sources to factual claims",
    text: "对事实性主张添加可核验来源，使生成式引擎更容易判断该页面可以支撑答案。来源必须与主张直接相关，不能只放泛泛外链。",
    trust_level: "high",
    source_ref: "paper_geo_2024",
  },
  {
    id: "chunk_geo_statistics_001",
    document_id: "paper_geo_2024",
    method_type: "strategy",
    page_type: "generic",
    failure_type: "weak_evidence",
    asset_type: "claim_evidence_block",
    title: "Replace vague claims with verifiable statistics",
    text: "把空泛描述改为有来源的数量化事实。统计数据能提升内容的可验证性和答案复用价值，但必须有清晰来源、口径和时间。",
    trust_level: "high",
    source_ref: "paper_geo_2024",
  },
  {
    id: "chunk_geo_claim_evidence_pair_001",
    document_id: "paper_verifiability_2023",
    method_type: "asset_pattern",
    page_type: "generic",
    failure_type: "weak_evidence",
    asset_type: "claim_evidence_block",
    title: "Organize content as claim-evidence pairs",
    text: "推荐把关键内容组织成 claim-evidence pair：一个明确 claim，紧邻一个支持证据、来源、时间和适用范围。",
    trust_level: "high",
    source_ref: "paper_verifiability_2023",
  },
  {
    id: "chunk_geo_citation_recall_001",
    document_id: "paper_verifiability_2023",
    method_type: "rubric",
    page_type: "generic",
    failure_type: "weak_evidence",
    asset_type: "claim_evidence_block",
    title: "Ensure citation recall — every claim needs support",
    text: "每个需要外部支持的陈述都应能找到证据。页面若有大量无证据 claim，生成式答案难以安全引用。",
    trust_level: "high",
    source_ref: "paper_verifiability_2023",
  },
  {
    id: "chunk_geo_rag_traceability_001",
    document_id: "paper_rag_2020",
    method_type: "output_rule",
    page_type: "generic",
    failure_type: "none",
    asset_type: "none",
    title: "Every output must reference evidence and method",
    text: "生成输出必须可回溯到检索上下文。每条 issue、action、asset 都要有 evidence_ref 和 method_ref。",
    trust_level: "high",
    source_ref: "paper_rag_2020",
  },
  {
    id: "chunk_geo_output_guardrail_001",
    document_id: "doc_deepseek_json",
    method_type: "output_rule",
    page_type: "generic",
    failure_type: "none",
    asset_type: "none",
    title: "JSON output guardrails for DeepSeek",
    text: "DeepSeek JSON Output 需要设置 response_format: {type:\"json_object\"}，prompt 中包含 JSON 字样和目标 JSON 示例，并设置足够 max_tokens 防止截断。",
    trust_level: "high",
    source_ref: "doc_deepseek_json",
  },
  {
    id: "chunk_geo_selection_absorption_001",
    document_id: "paper_citation_absorption_2026",
    method_type: "rubric",
    page_type: "generic",
    failure_type: "low_citability",
    asset_type: "none",
    title: "Separate citation selection from absorption",
    text: "GEO 诊断应分离 citation selection 和 citation absorption。前者看页面是否能进入候选来源，后者看内容是否能影响最终答案。",
    trust_level: "medium",
    source_ref: "paper_citation_absorption_2026",
  },
  {
    id: "chunk_geo_evidence_container_001",
    document_id: "paper_citation_absorption_2026",
    method_type: "strategy",
    page_type: "generic",
    failure_type: "weak_evidence",
    asset_type: "claim_evidence_block",
    title: "Design pages as evidence containers",
    text: "高吸收潜力页面应像 evidence container：包含定义、数字事实、比较、步骤、代码或可定位证据，而不是只有泛泛叙述。",
    trust_level: "medium",
    source_ref: "paper_citation_absorption_2026",
  },
  {
    id: "chunk_geo_macro_structure_001",
    document_id: "paper_structural_geo_2026",
    method_type: "strategy",
    page_type: "generic",
    failure_type: "poor_structure",
    asset_type: "summary",
    title: "Optimize document-level structure first",
    text: "优先优化文档级结构：清晰 H1、合理 H2/H3 层级、从定义到证据再到行动的顺序，以及必要的内部跳转。",
    trust_level: "medium",
    source_ref: "paper_structural_geo_2026",
  },
  {
    id: "chunk_geo_semantic_preservation_001",
    document_id: "paper_structural_geo_2026",
    method_type: "output_rule",
    page_type: "generic",
    failure_type: "poor_structure",
    asset_type: "none",
    title: "Preserve original meaning during optimization",
    text: "结构优化不能改变页面原义。所有改写建议必须保留事实、范围、主体和限定条件。",
    trust_level: "medium",
    source_ref: "paper_structural_geo_2026",
  },
];

// ─── Retrieved Method Pack ──────────────────────────────────────────────────

export const MOCK_RETRIEVED_METHODS: RetrievedMethodPack = {
  retrieval_query: "product page missing schema weak evidence GPTBot blocked",
  chunks: [
    {
      method_ref: "chunk_geo_source_citation_001",
      source_title: "GEO: Generative Engine Optimization",
      method_type: "strategy",
      text: "对事实性主张添加可核验来源，使生成式引擎更容易判断该页面可以支撑答案。",
      why_selected:
        "Page contains unsupported claims like 'trusted by over 10,000 companies'",
    },
    {
      method_ref: "chunk_geo_statistics_001",
      source_title: "GEO: Generative Engine Optimization",
      method_type: "strategy",
      text: "把空泛描述改为有来源的数量化事实。统计数据能提升内容的可验证性和答案复用价值。",
      why_selected:
        "No statistics found on page; claims are qualitative and unsupported",
    },
    {
      method_ref: "chunk_geo_claim_evidence_pair_001",
      source_title: "Evaluating Verifiability in GSEs",
      method_type: "asset_pattern",
      text: "推荐把关键内容组织成 claim-evidence pair：一个明确 claim，紧邻一个支持证据。",
      why_selected: "Page has claims without adjacency to evidence",
    },
    {
      method_ref: "chunk_geo_citation_recall_001",
      source_title: "Evaluating Verifiability in GSEs",
      method_type: "rubric",
      text: "每个需要外部支持的陈述都应能找到证据。",
      why_selected:
        "Citation recall is 0% — no claims have full evidence support",
    },
    {
      method_ref: "chunk_geo_selection_absorption_001",
      source_title: "From Citation Selection to Citation Absorption",
      method_type: "rubric",
      text: "GEO 诊断应分离 citation selection 和 citation absorption。",
      why_selected:
        "Page has blockers in both selection (GPTBot blocked) and absorption (weak evidence)",
    },
    {
      method_ref: "chunk_geo_evidence_container_001",
      source_title: "From Citation Selection to Citation Absorption",
      method_type: "strategy",
      text: "高吸收潜力页面应像 evidence container：包含定义、数字事实、比较、步骤。",
      why_selected:
        "Page lacks evidence density — no statistics, comparisons, or procedures",
    },
    {
      method_ref: "chunk_geo_macro_structure_001",
      source_title: "Structural Feature Engineering for GEO",
      method_type: "strategy",
      text: "优先优化文档级结构：清晰 H1、合理 H2/H3 层级、从定义到证据再到行动的顺序。",
      why_selected:
        "Page jumps from intro directly to pricing tiers without entity definition",
    },
    {
      method_ref: "chunk_geo_output_guardrail_001",
      source_title: "DeepSeek JSON Output",
      method_type: "output_rule",
      text: "需要设置 JSON Output，prompt 中包含 JSON 字样和目标 JSON 示例。",
      why_selected: "Base guardrail for all DeepSeek calls",
    },
  ],
};

// ─── DeepSeek Diagnosis ─────────────────────────────────────────────────────

export const MOCK_DIAGNOSIS: DeepSeekDiagnosis = {
  geo_score: 42,
  score_breakdown: {
    crawl_access: 50,
    entity_clarity: 35,
    structured_data: 25,
    citability: 30,
    evidence_support: 20,
    answer_readiness: 55,
  },
  executive_summary:
    "该页面在基础 SEO 层面合格，但 GEO 就绪度严重不足。核心问题集中在三方面：GPTBot 被屏蔽导致无法被 ChatGPT 访问为零来源；所有 claims 缺乏证据支撑导致无法被 AI 安全引用；缺少 llms.txt 和 Product schema 等关键 AI 访问通道。",
  issues: [
    {
      id: "issue_001",
      severity: "high",
      category: "crawl_access",
      finding:
        "GPTBot 在 robots.txt 中被明确屏蔽。这意味着 ChatGPT 无法将该页面作为来源进行检索和引用，GEO 可见性从根本上为零。",
      evidence_ref: "crawl_access.ai_bots_blocked",
      method_ref: "chunk_geo_selection_absorption_001",
      why_it_matters:
        "如果被主流 AI 爬虫屏蔽，页面再好的内容也无法进入生成式答案的候选来源。citation selection 是 GEO 的入口条件。",
    },
    {
      id: "issue_002",
      severity: "high",
      category: "evidence_support",
      finding:
        "页面有 3 个事实性 claims（'helps teams ship faster'、'trusted by 10,000 companies'、'match any competitor'），但没有任何一个提供可核验的来源、数据或引用。",
      evidence_ref: "geo_content.claim_candidates",
      method_ref: "chunk_geo_citation_recall_001",
      why_it_matters:
        "无证据支撑的 claims 在 AI 答案生成中会被判定为不可信，即使页面被选为来源，其内容也难以被安全引用到最终答案中。",
    },
    {
      id: "issue_003",
      severity: "high",
      category: "crawl_access",
      finding:
        "缺少 llms.txt 文件。该文件正成为 AI 爬虫（Anthropic Claude、Perplexity 等）获取页面结构化信息的标准入口。",
      evidence_ref: "crawl_access.llms_txt_found",
      method_ref: "chunk_geo_evidence_container_001",
      why_it_matters:
        "llms.txt 允许网站主动告知 AI 哪些内容是核心信息、哪些是辅助信息，是提升 absorption quality 的低成本高收益手段。",
    },
    {
      id: "issue_004",
      severity: "medium",
      category: "structured_data",
      finding:
        "仅有 Organization 类型的 JSON-LD schema，缺少 Product 和 FAQPage schema。产品定价页缺失 Product schema 会导致 AI 无法结构化理解定价维度。",
      evidence_ref: "schema.schema_types",
      method_ref: "chunk_geo_output_guardrail_001",
      why_it_matters:
        "Product schema 让 AI 能结构化读取产品价格、功能、适用场景；FAQPage schema 让 FAQ 区块可被直接提取为答案单元。",
    },
    {
      id: "issue_005",
      severity: "medium",
      category: "entity_clarity",
      finding:
        "页面实体仅有 Organization schema 声明，缺少 sameAs 链接（Wikipedia、LinkedIn、Crunchbase 等）来交叉验证实体身份。",
      evidence_ref: "schema.same_as_links",
      method_ref: "chunk_geo_selection_absorption_001",
      why_it_matters:
        "sameAs 是 AI 搜索引擎确认实体身份和权威性的关键信号。没有 sameAs，AI 无法确定该组织是否为真实存在的实体。",
    },
    {
      id: "issue_006",
      severity: "medium",
      category: "answer_readiness",
      finding:
        "页面缺少 answer-ready summary 区块。首屏直接进入 pricing tiers，没有关于产品的简要定义和核心价值主张。",
      evidence_ref: "geo_content.answer_summary_present",
      method_ref: "chunk_geo_macro_structure_001",
      why_it_matters:
        "AI 答案引擎偏好有明确 summary 的页面——一个 2-3 句的实体定义+核心价值陈述可以显著提升 absorption 概率。",
    },
    {
      id: "issue_007",
      severity: "low",
      category: "citability",
      finding:
        "FAQ 区块的回答过于简短（如 price matching 回答仅 1 句），缺少具体条件、范围和证据，降低了可引用价值。",
      evidence_ref: "geo_content.faq_blocks",
      method_ref: "chunk_geo_claim_evidence_pair_001",
      why_it_matters:
        "FAQ 内容只有在回答具体、有证据支撑时才具备高可引用性。过于泛化的 FAQ 对 AI 答案质量贡献有限。",
    },
  ],
  priority_actions: [
    {
      priority: 1,
      action:
        "修改 robots.txt，允许 GPTBot、OAI-SearchBot、ClaudeBot、Google-Extended 等主流 AI 爬虫访问",
      expected_effect: "恢复页面被 ChatGPT、Claude 等 AI 搜索引擎发现和索引的能力",
      effort: "low",
      evidence_ref: "crawl_access.ai_bots_blocked",
      method_ref: "chunk_geo_selection_absorption_001",
    },
    {
      priority: 2,
      action:
        "为 'trusted by over 10,000 companies' 添加可链接的数据来源（如 Trustpilot、G2 评分、或第三方审计报告）",
      expected_effect: "将最高频的品牌 claim 从 unsupported 变为 fully_supported，提升可验证性",
      effort: "low",
      evidence_ref: "geo_content.claim_candidates[1]",
      method_ref: "chunk_geo_citation_recall_001",
    },
    {
      priority: 3,
      action: "创建 llms.txt 文件，声明页面核心信息和结构化数据入口",
      expected_effect: "为 AI 爬虫提供结构化的页面导览，提升信息被准确提取的概率",
      effort: "low",
      evidence_ref: "crawl_access.llms_txt_found",
      method_ref: "chunk_geo_evidence_container_001",
    },
    {
      priority: 4,
      action: "添加 Product JSON-LD schema，包含价格、功能、适用团队规模等字段",
      expected_effect: "让 AI 能结构化读取产品定价信息，提升 purchase intent 搜索的匹配度",
      effort: "medium",
      evidence_ref: "schema.schema_types",
      method_ref: "chunk_geo_output_guardrail_001",
    },
    {
      priority: 5,
      action:
        "在页面顶部添加 2-3 句 answer-ready summary：说明 SaaS Product 是什么、解决什么问题、适用于谁",
      expected_effect: "提升 AI 答案引擎对页面核心价值的提取和引用概率",
      effort: "low",
      evidence_ref: "geo_content.answer_summary_present",
      method_ref: "chunk_geo_macro_structure_001",
    },
  ],
  asset_drafts: [
    {
      asset_type: "json_ld",
      draft: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "SaaS Product — AI-Powered Workflow Automation",
  "description": "Flexible AI automation platform for teams. Includes workflow builder, analytics, and integrations.",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "29",
    "highPrice": "Custom",
    "priceCurrency": "USD",
    "offerCount": "3"
  },
  "provider": {
    "@type": "Organization",
    "name": "SaaS Product Inc.",
    "sameAs": ["https://linkedin.com/company/saas-product"]
  }
}`,
      needs_human_confirmation: [
        "需确认 provider.sameAs 中的实际社交/权威链接",
        "需补充产品具体功能特性和适用行业",
      ],
      evidence_ref: "schema.schema_types",
      method_ref: "chunk_geo_claim_evidence_pair_001",
    },
    {
      asset_type: "faq",
      draft: `# Frequently Asked Questions

## Do you offer price matching?
Yes, we match any competitor plan feature-for-feature. This applies to publicly listed plans from SaaS Workflow Automation tools (e.g., Zapier, Make, n8n). Submit your competitor's plan URL to support@saas-product.com for verification. Price matching is valid for annual plans only.

## Can I cancel anytime?
Yes. All plans are month-to-month with no lock-in contract. Cancel from your dashboard at any time — your subscription remains active until the end of your current billing period. No cancellation fees apply.

## What AI models does the platform use?
Our automation engine integrates with GPT-4o, Claude Fable 5, and Gemini 2.0 through configurable connectors. You retain full control over which model processes your data.`,
      needs_human_confirmation: [
        "FAQ 中的具体 AI 模型需与产品实际集成确认",
        "价格匹配的竞品列表和邮箱需确认",
      ],
      evidence_ref: "geo_content.faq_blocks",
      method_ref: "chunk_geo_claim_evidence_pair_001",
    },
    {
      asset_type: "summary",
      draft: `SaaS Product is an AI-powered workflow automation platform that helps engineering and ops teams automate repetitive tasks, integrate tools, and ship faster. Built for teams of 5 to 5,000, it offers visual workflow building, real-time analytics, and enterprise-grade security. Founded in 2020, SaaS Product Inc. serves over 10,000 companies (verified by G2 Fall 2025 Report, see evidence).`,
      needs_human_confirmation: [
        "统计数据需有第三方来源验证（建议添加 G2/Gartner/三方审计链接）",
        "成立年份和公司规模需确认",
      ],
      evidence_ref: "geo_content.answer_summary_present",
      method_ref: "chunk_geo_macro_structure_001",
    },
    {
      asset_type: "llms_txt",
      draft: `# SaaS Product — Pricing Page
> LLMs.txt for AI crawler consumption

## Page Identity
- Type: Product Pricing Page
- Entity: SaaS Product Inc. (B2B SaaS, Workflow Automation)
- Primary Intent: Purchase evaluation
- Language: en

## Key Information
- Plans: Starter ($29/mo), Professional ($99/mo), Enterprise (Custom)
- Free trial: 14 days, no credit card required
- Cancellation: Month-to-month, cancel anytime
- Price matching: Available for annual plans

## Structured Data
- Organization schema: present
- Product schema: missing
- FAQPage schema: missing
- sameAs: not provided

## For AI Crawlers
- robots.txt: contains GPTBot restriction (see issue_001)
- llms.txt: this file
- llms-full.txt: not available
- Sitemap: https://www.saas-product.com/sitemap.xml`,
      needs_human_confirmation: [
        "价格数据需与实际定价对齐",
        "sitemap URL 需确认",
      ],
      evidence_ref: "crawl_access.llms_txt_found",
      method_ref: "chunk_geo_evidence_container_001",
    },
  ],
  unknowns: [
    "GPTBot 屏蔽是否为有意决策还是历史遗留",
    "10,000 companies 数据是否有内部数据支撑但未在页面上展示",
    "该页面实际在 ChatGPT/Perplexity 搜索结果中的可见性（需要实际采样）",
  ],
};

// ─── Copilot Messages ───────────────────────────────────────────────────────

export const MOCK_COPILOT_MESSAGES: CopilotMessage[] = [
  {
    id: "msg_001",
    role: "user",
    content: "为什么分数这么低？",
    created_at: "2026-06-19T10:32:00Z",
  },
  {
    id: "msg_002",
    role: "assistant",
    content: `该页面 GEO 总分 42/100，主要扣分在三方面：

1. **Crawl Access (50/100)**: GPTBot 被屏蔽 + llms.txt 缺失，页面从源头上限制了 AI 访问。

2. **Evidence Support (20/100)**: 3 个核心 claims 全部没有证据支撑，得分最低。这是最关键的扣分项——AI 引擎在不信任 claims 的情况下不会引用页面内容。

3. **Structured Data (25/100)**: 只有基础的 Organization schema，缺少 Product 和 FAQPage，AI 无法结构化理解定价信息。

优先按 priority_actions 列表从高到低处理，前 3 项 effort 均为 low，预期可在 1-2 小时内完成。`,
    created_at: "2026-06-19T10:32:15Z",
  },
  {
    id: "msg_003",
    role: "user",
    content: "先改哪三项？",
    created_at: "2026-06-19T10:33:00Z",
  },
  {
    id: "msg_004",
    role: "assistant",
    content: `建议按以下顺序执行（均 effort: low，可在 1-2 小时内完成）：

1. **修改 robots.txt** — 取消 GPTBot 等 AI crawler 的屏蔽规则。这是入口条件，不改它其他优化无法生效。

2. **为 'trusted by over 10,000 companies' 添加证据** — 链接到 G2、Trustpilot 或第三方审计报告。这是最高频的 brand claim，变成 verified 后 citation recall 可从 0% 提升。

3. **创建 llms.txt** — 已在 asset_drafts 中生成了草案。llms.txt 是一次性创建、长期受益的 AI 访问通道。

完成后建议提交新的分析来验证分数变化。`,
    created_at: "2026-06-19T10:33:25Z",
  },
];

// ─── Full Analysis Detail ───────────────────────────────────────────────────

export const MOCK_ANALYSIS_DETAIL: AnalysisDetail = {
  ...MOCK_ANALYSES[0],
  page_evidence: MOCK_PAGE_EVIDENCE,
  geo_readout: MOCK_GEO_READOUT,
  retrieved_methods: MOCK_RETRIEVED_METHODS,
  method_chunks: MOCK_METHOD_CHUNKS,
  diagnosis: MOCK_DIAGNOSIS,
  messages: MOCK_COPILOT_MESSAGES,
};
