"use client";

import { usePathname } from "next/navigation";

const BREADCRUMB_MAP: Record<string, string> = {
  "/": "开始诊断",
  "/analyses": "历史记录",
};

function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const items = [
    { label: "首页", href: "/" },
  ];
  // Detect analysis detail page
  if (pathname.startsWith("/analyses/") && pathname.split("/").length >= 3) {
    items.push({ label: "历史记录", href: "/analyses" });
    items.push({ label: "分析详情", href: pathname });
  } else if (pathname !== "/") {
    const label = BREADCRUMB_MAP[pathname] || pathname;
    items.push({ label, href: pathname });
  }
  return items;
}

export function Header() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {breadcrumbs.map((item, i) => (
          <span key={item.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-border">/</span>}
            <span
              className={
                i === breadcrumbs.length - 1
                  ? "text-foreground font-medium"
                  : "hover:text-foreground transition-colors cursor-pointer"
              }
            >
              {item.label}
            </span>
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          Mock 模式
        </span>
      </div>
    </header>
  );
}
