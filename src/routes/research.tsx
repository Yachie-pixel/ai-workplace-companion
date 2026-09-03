import { createFileRoute } from "@tanstack/react-router";
import { Search, Loader2, Info } from "lucide-react";
import { useRef, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { streamAI } from "@/lib/ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Turn any topic into an executive summary, key insights, opportunities and recommendations with AI.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content: "Structured, editable AI research briefs for workplace decisions.",
      },
    ],
  }),
  component: ResearchPage,
});

const depthOptions = [
  "Quick Overview",
  "Detailed Summary",
  "Business Insights",
  "Recommendations",
  "Pros & Cons",
] as const;

const formats = ["Executive Summary", "Key Insights", "Recommendations", "Business Brief"] as const;

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [context, setContext] = useState("");
  const [depths, setDepths] = useState<string[]>(["Quick Overview", "Business Insights"]);
  const [format, setFormat] = useState<string>("Executive Summary");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const toggleDepth = (value: string) =>
    setDepths((prev) => (prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]));

  const run = async () => {
    if (!topic.trim()) {
      setError("Enter a research topic first.");
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    setOutput("");

    const prompt = [
      "CONTEXT: " + (context.trim() || "General workplace research request."),
      "TASK: Research and analyse the topic below using your own knowledge, and produce a structured business research brief.",
      "TOPIC: " + topic.trim(),
      "AUDIENCE: " + (audience.trim() || "Business professionals and decision-makers."),
      "ANALYSIS FOCUS: " + (depths.length ? depths.join(", ") : "Quick Overview"),
      "PRIMARY OUTPUT FORMAT: " + format,
      "TONE: Professional, neutral, evidence-aware.",
      "DESIRED OUTPUT: Plain text with these exact section headings, each on its own line:",
      "Executive Summary\nKey Insights\nOpportunities\nRecommendations\nConsiderations",
      "Use short paragraphs and bullet lines starting with '- '. Where a claim is an estimate, trend or opinion rather than a well-established fact, mark it inline as (unverified). Do not fabricate statistics, citations or sources; if a number is uncertain say so.",
    ].join("\n\n");

    try {
      await streamAI(
        [
          {
            role: "system",
            content:
              "You are a rigorous business research analyst. You produce structured, decision-ready briefs and are explicit about uncertainty.",
          },
          { role: "user", content: prompt },
        ],
        (chunk) => setOutput((prev) => prev + chunk),
        controller.signal,
      );
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Research topics, summarize information, and generate actionable insights."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-base text-navy">Research brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Research topic</Label>
              <Input
                id="topic"
                placeholder="How artificial intelligence is changing workplace productivity"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Audience (optional)</Label>
              <Input
                id="audience"
                placeholder="e.g. Executive leadership team"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Analysis focus</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {depthOptions.map((d) => (
                  <label
                    key={d}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  >
                    <Checkbox checked={depths.includes(d)} onCheckedChange={() => toggleDepth(d)} />
                    {d}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Output format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rcontext">Add context (optional)</Label>
              <Textarea
                id="rcontext"
                rows={3}
                placeholder="Your industry, market, constraints or the decision this research supports…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={run} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Researching…
                </>
              ) : (
                <>
                  <Search className="size-4" /> Start Research
                </>
              )}
            </Button>
            <div className="flex gap-2 rounded-xl bg-secondary/60 p-3 text-xs text-secondary-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              <p>
                Output is AI-generated analysis, not verified research. Items marked
                &quot;(unverified)&quot; are estimates or opinions — confirm them with a trusted
                source before acting.
              </p>
            </div>
          </CardContent>
        </Card>

        <AiOutput
          title="Research output"
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRegenerate={run}
          savedKind="research"
          savedTitle={topic || "Research brief"}
          emptyHint="Executive Summary, Key Insights, Opportunities, Recommendations and Considerations will appear here."
          rows={22}
        />
      </div>
    </AppShell>
  );
}
