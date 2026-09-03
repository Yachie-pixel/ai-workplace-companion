import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Search, MessagesSquare, Lightbulb, ArrowRight } from "lucide-react";
import { AppShell, AiDisclaimer } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workplace AI — AI Productivity Assistant Dashboard" },
      {
        name: "description",
        content:
          "Draft emails, run research, and chat with AI for workplace tasks. No account needed — open the dashboard and start working.",
      },
      { property: "og:title", content: "Workplace AI — AI Productivity Assistant" },
      {
        property: "og:description",
        content: "AI email generation, research briefs, and workplace chat in one clean dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Generate professional workplace emails using AI.",
    cta: "Generate Email",
  },
  {
    to: "/research",
    icon: Search,
    title: "Research Assistant",
    description: "Research topics, summarize information, and generate actionable insights.",
    cta: "Start Research",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Workplace Chat",
    description:
      "Ask AI for help with workplace tasks, ideas, writing, planning, and decision-making.",
    cta: "Open AI Chat",
  },
] as const;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning 👋";
  if (h < 18) return "Good afternoon 👋";
  return "Good evening 👋";
}

function Dashboard() {
  return (
    <AppShell>
      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">{greeting()}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          Your AI workplace assistant is ready to help you get more done.
        </p>
      </section>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((f) => (
          <Card key={f.to} className="border-border shadow-soft transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-navy">
                <f.icon className="size-5" />
              </div>
              <CardTitle className="mt-3 text-navy">{f.title}</CardTitle>
              <CardDescription>{f.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to={f.to}>
                  {f.cta} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card className="border-border bg-secondary/50 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-navy">
              <Lightbulb className="size-4" /> AI Productivity Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-secondary-foreground">
            Give the AI context, not just a command. Tell it the situation, the audience and the
            format you want — a two-line brief usually produces output you can send with minimal
            edits.
          </CardContent>
        </Card>
        <AiDisclaimer className="p-5 text-sm" />
      </div>
    </AppShell>
  );
}
