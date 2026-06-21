"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Search,
  History,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
  { href: "/", label: "开始诊断", icon: Search, exact: true },
  { href: "/analyses", label: "历史记录", icon: History, exact: false },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-[240px] flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/8">
          <Sparkles className="size-4 text-primary" />
        </div>
        <div>
          <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            GEO Copilot
          </span>
          <span className="ml-1.5 rounded bg-primary/10 px-1.5 py-0 text-[10px] font-medium text-primary">
            BETA
          </span>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="size-3 text-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 pb-4">
        <Separator className="mb-4 bg-sidebar-border" />
        <p className="text-[11px] leading-relaxed text-sidebar-foreground/40">
          GEO Copilot v0.1 — API-based page audit engine
        </p>
      </div>
    </aside>
  );
}
