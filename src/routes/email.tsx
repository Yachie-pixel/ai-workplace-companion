import { createFileRoute } from "@tanstack/react-router";
import { Mail, Wand2, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { streamAI } from "@/lib/ai";
import { loadPreferences } from "@/lib/preferences";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails from your own inputs: audience, purpose, key points, tone and length.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content: "AI-written workplace emails you can edit, copy and save.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState("Formal");
  const [length, setLength] = useState("Balanced");
  const [context, setContext] = useState("");
  const [extra, setExtra] = useState("");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = async () => {
    if (!purpose.trim() && !keyPoints.trim()) {
      setError("Add an email purpose or some key points so the AI has something to work with.");
      return;
    }
    const prefs = loadPreferences();
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    setOutput("");

    const prompt = [
      "CONTEXT: " + (context.trim() || "Not specified."),
      "TASK: Write one complete workplace email.",
      "AUDIENCE / RECIPIENT: " + (recipient.trim() || "Not specified."),
      "PURPOSE: " + (purpose.trim() || "Not specified."),
      "KEY POINTS TO COVER:\n" + (keyPoints.trim() || "Not specified."),
      "TONE: " + tone,
      "LENGTH: " + length,
      "ADDITIONAL INSTRUCTIONS: " + (extra.trim() || "None."),
      prefs.displayName || prefs.role || prefs.organization
        ? `SENDER: ${prefs.displayName || "Unnamed"}${prefs.role ? ", " + prefs.role : ""}${
            prefs.organization ? " at " + prefs.organization : ""
          }`
        : "",
      prefs.signature ? "SIGNATURE TO USE:\n" + prefs.signature : "",
      "DESIRED OUTPUT: Plain text starting with a line 'Subject: ...', then a blank line, then the email body with greeting, well-structured paragraphs, and a sign-off. No commentary, no markdown fences.",
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      await streamAI(
        [
          {
            role: "system",
            content:
              "You are an expert workplace communication assistant. You write clear, professional emails tailored precisely to the supplied inputs. Never invent facts that were not provided; if something is missing, use a clearly marked placeholder like [date].",
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
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the situation and the AI drafts a tailored, ready-to-edit workplace email."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-base text-navy">Email brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient / Audience</Label>
              <Input
                id="recipient"
                placeholder="e.g. Head of Operations"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Email purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g. Request a deadline extension"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={4}
                placeholder="One point per line"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Formal", "Friendly", "Persuasive"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Concise", "Balanced", "Detailed"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Add context (optional)</Label>
              <Textarea
                id="context"
                rows={3}
                placeholder="Background the AI should know: project status, prior conversation, deadlines…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extra">Additional instructions (optional)</Label>
              <Textarea
                id="extra"
                rows={2}
                placeholder="e.g. Mention the Q3 report, keep under 150 words"
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={generate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Wand2 className="size-4" /> Generate Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          title="Generated email"
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRegenerate={generate}
          savedKind="email"
          savedTitle={purpose || recipient || "Generated email"}
          emptyHint="Your generated email will appear here and stays fully editable."
        />
      </div>
    </AppShell>
  );
}
