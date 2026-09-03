import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare, Send, Copy, RefreshCw, Save, Pencil, Loader2, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { streamAI, type ChatMessage } from "@/lib/ai";
import { saveItem } from "@/lib/saved-work";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with an AI assistant for workplace writing, planning, meeting prep and decision-making.",
      },
      { property: "og:title", content: "AI Workplace Chat — Workplace AI" },
      {
        property: "og:description",
        content: "A focused AI chat for everyday workplace tasks — copy, edit and save any reply.",
      },
    ],
  }),
  component: ChatPage,
});

const SYSTEM: ChatMessage = {
  role: "system",
  content:
    "You are an AI workplace productivity assistant. You help with writing, planning, meeting prep, brainstorming and decision-making. Be concise, practical and structured. Ask a brief clarifying question when the request is ambiguous. Never invent facts about the user's organization.",
};

const suggestions = [
  "Draft a professional email",
  "Help me prepare for a meeting",
  "Create a project plan",
  "Improve this message",
  "Brainstorm ideas",
  "Summarize a topic",
];

type Turn = { id: string; role: "user" | "assistant"; content: string };

const STORAGE_KEY = "awpa.chat.session.v1";

function ChatPage() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setTurns(JSON.parse(raw) as Turn[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(turns));
    } catch {
      /* ignore */
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  const runCompletion = async (history: Turn[]) => {
    setLoading(true);
    setError(null);
    const id = crypto.randomUUID();
    setTurns([...history, { id, role: "assistant", content: "" }]);
    try {
      await streamAI(
        [SYSTEM, ...history.map((t) => ({ role: t.role, content: t.content }) as ChatMessage)],
        (chunk) =>
          setTurns((prev) =>
            prev.map((t) => (t.id === id ? { ...t, content: t.content + chunk } : t)),
          ),
      );
    } catch (e) {
      setError((e as Error).message);
      setTurns(history);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const history = [...turns, { id: crypto.randomUUID(), role: "user" as const, content: text }];
    setInput("");
    setTurns(history);
    await runCompletion(history);
  };

  const regenerate = async (assistantId: string) => {
    const idx = turns.findIndex((t) => t.id === assistantId);
    if (idx < 0) return;
    await runCompletion(turns.slice(0, idx));
  };

  const retryLast = async () => {
    const lastUser = [...turns].reverse().find((t) => t.role === "user");
    if (!lastUser) return;
    const idx = turns.findIndex((t) => t.id === lastUser.id);
    await runCompletion(turns.slice(0, idx + 1));
  };

  return (
    <AppShell>
      <PageHeader
        icon={MessagesSquare}
        title="AI Workplace Chat"
        description="Ask AI for help with workplace tasks, ideas, writing, planning and decision-making."
      />

      <Card className="flex min-h-[60vh] flex-col border-border shadow-soft">
        <CardContent className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          <div className="flex-1 space-y-4 overflow-y-auto">
            <div className="rounded-2xl bg-secondary/60 p-4 text-sm text-secondary-foreground">
              Hi! I&apos;m your AI workplace assistant. How can I help you today?
            </div>

            {turns.length === 0 ? (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInput(s + ": ");
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-navy transition-colors hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}

            {turns.map((t) => (
              <div
                key={t.id}
                className={cn("flex", t.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[80%]",
                    t.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground",
                  )}
                >
                  {t.role === "assistant" && editingId === t.id ? (
                    <Textarea
                      value={t.content}
                      rows={8}
                      onChange={(e) =>
                        setTurns((prev) =>
                          prev.map((x) => (x.id === t.id ? { ...x, content: e.target.value } : x)),
                        )
                      }
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">
                      {t.content || (loading ? "…" : "")}
                      {t.role === "assistant" && loading && !t.content ? (
                        <Loader2 className="inline size-3.5 animate-spin" />
                      ) : null}
                    </p>
                  )}

                  {t.role === "assistant" && t.content && !loading ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          await navigator.clipboard.writeText(t.content);
                          toast.success("Copied");
                        }}
                      >
                        <Copy className="size-3.5" /> Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(editingId === t.id ? null : t.id)}
                      >
                        {editingId === t.id ? (
                          <>
                            <Check className="size-3.5" /> Done
                          </>
                        ) : (
                          <>
                            <Pencil className="size-3.5" /> Edit
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => regenerate(t.id)}>
                        <RefreshCw className="size-3.5" /> Regenerate
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          saveItem("chat", t.content.slice(0, 60), t.content);
                          toast.success("Saved to Saved Work");
                        }}
                      >
                        <Save className="size-3.5" /> Save
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {error ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={retryLast}>
                Retry
              </Button>
            </div>
          ) : null}

          <div className="flex items-end gap-2 border-t border-border pt-4">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={2}
              placeholder="Ask anything about your workplace task..."
              className="min-h-[52px] flex-1 resize-none"
            />
            <Button size="lg" onClick={send} disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              <span className="sr-only sm:not-sr-only">Send</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            AI-generated content may contain errors. Review before using or sharing, and avoid
            entering confidential information.
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
