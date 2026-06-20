# GEO Copilot

AI 驱动的 GEO（Generative Engine Optimization）诊断平台。输入任意网址，基于页面证据和前沿方法知识库，生成结构化的优化反馈报告。

## 快速体验

### 在线 Demo（GitHub Codespaces）

1. 点击仓库右上角 **Code → Codespaces → Create codespace on master**
2. 等待环境自动构建（约 1-2 分钟）
3. 浏览器会自动打开 `http://localhost:3000`
4. 输入任意网址，即可开始诊断

### 本地运行

```bash
git clone https://github.com/frt6skfg49-byte/GEO-Copilot.git
cd GEO-Copilot/apps/web
npm install
NEXT_PUBLIC_USE_MOCK=true npm run dev
```

打开 http://localhost:3000 即可使用。

## 技术栈

- **前端**: Next.js 16 + React 19 + TypeScript
- **UI**: Tailwind CSS 4 + Base UI + shadcn
- **图表**: Recharts
- **数据**: SWR + Mock 模式

## 项目结构

```
├── apps/web/          # Web 前端应用
│   └── src/
│       ├── app/       # Next.js App Router 页面
│       ├── components/# UI 组件
│       │   ├── ui/          # 基础 UI 组件
│       │   ├── layout/      # 布局组件
│       │   ├── report/      # 报告组件
│       │   ├── analysis/    # 分析组件
│       │   ├── evidence/    # 证据展示组件
│       │   └── copilot/     # AI 对话组件
│       ├── hooks/     # 自定义 Hooks
│       └── lib/       # 工具函数 & 类型定义
└── docs/              # 项目文档
```
