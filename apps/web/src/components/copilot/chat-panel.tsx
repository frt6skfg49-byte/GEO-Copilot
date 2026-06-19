"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  ChevronRight,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { sendMessage } from "@/lib/api";
import type { CopilotMessage } from "@/lib/types";

const QUICK_PROMPTS = [
  "为什么分数这么低？",
  "先改哪三项？",
  "帮我生成 FAQ",
  "帮我生成 JSON-LD",
  "帮我生成 summary",
];

interface ChatPanelProps {
  analysisId: string;
  messages?: CopilotMessage[];
  onNewMessage?: (msg: CopilotMessage) => void;
}

export function ChatPanel({
  analysisId,
  messages = [],
  onNewMessage,
}: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<CopilotMessage[]>(messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync messages from props
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages]);

  async function handleSend(content?: string) {
    const text = (content ?? input).trim();
    if (!text || isSending) return;

    const userMsg: CopilotMessage = {
      id: `local_${Date.now()}`,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, userMsg]);
    onNewMessage?.(userMsg);
    setInput("");
    setIsSending(true);

    try {
      const reply = await sendMessage(analysisId, text);
      setLocalMessages((prev) => [...prev, reply]);
      onNewMessage?.(reply);
    } catch {
      setLocalMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          role: "assistant",
          content: "抱歉，追问发送失败。请检查网络后重试。",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Desktop side panel */}
      <aside
        className={cn(
          "hidden xl:block border-l border-border bg-card/30 w-[380px] shrink-0 flex-col",
          !isOpen && "w-[52px]"
        )}
      >
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="flex size-full flex-col items-center pt-4 gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageSquare className="size-5" />
            <span className="text-[10px] writing-vertical-rl rotate-180">
              Copilot
            </span>
          </button>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-400" />
                <span className="text-sm font-medium">Copilot</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setIsOpen(false)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <Separator />

            {/* Messages */}
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="p-4 space-y-3">
                {localMessages.length === 0 && (
                  <div className="py-8 text-center">
                    <MessageSquare className="size-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-xs text-muted-foreground">
                      针对当前分析结果追问
                    </p>
                  </div>
                )}
                {localMessages.map((msg) => (
                  <Bubble key={msg.id} message={msg} />
                ))}
                {isSending && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pl-3">
                    <Loader2 className="size-3 animate-spin" />
                    Copilot 正在思考...
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Prompts */}
            {localMessages.length === 0 && (
              <div className="px-4 pb-2">
                <p className="text-[10px] text-muted-foreground mb-2">
                  快捷提问
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleSend(p)}
                      disabled={isSending}
                      className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all disabled:opacity-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Input */}
            <div className="p-3">
              <div className="flex items-end gap-2">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="基于当前报告追问..."
                  className="min-h-[40px] max-h-[120px] resize-none text-sm border-border bg-background/50"
                  rows={1}
                  disabled={isSending}
                />
                <Button
                  size="icon"
                  className="size-9 shrink-0"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isSending}
                >
                  <Send className="size-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Mobile bottom sheet (simplified) */}
      <div className="xl:hidden fixed bottom-4 right-4 z-50">
        {isOpen ? (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col animate-slide-up">
            <div className="flex items-center justify-between px-4 h-14 shrink-0 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-400" />
                <span className="text-sm font-medium">Copilot</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {localMessages.length === 0 && (
                <div className="py-12 text-center">
                  <MessageSquare className="size-10 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    针对当前分析结果追问
                  </p>
                </div>
              )}
              {localMessages.map((msg) => (
                <Bubble key={msg.id} message={msg} />
              ))}
              {isSending && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pl-3">
                  <Loader2 className="size-3 animate-spin" />
                  正在思考...
                </div>
              )}
            </div>
            {localMessages.length === 0 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleSend(p)}
                      disabled={isSending}
                      className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all disabled:opacity-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="p-3 border-t border-border">
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="基于当前报告追问..."
                  className="min-h-[40px] max-h-[120px] resize-none text-sm border-border"
                  rows={1}
                  disabled={isSending}
                />
                <Button
                  size="icon"
                  className="size-9 shrink-0"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isSending}
                >
                  <Send className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            size="icon"
            className="size-12 rounded-full shadow-lg"
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare className="size-5" />
          </Button>
        )}
      </div>
    </>
  );
}

function Bubble({ message }: { message: CopilotMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isUser ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "max-w-[90%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-emerald-500/10 text-foreground border border-emerald-500/20"
            : "bg-accent/50 text-foreground/85 border border-border"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      <span className="text-[10px] text-muted-foreground/60 px-1">
        {new Date(message.created_at).toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
