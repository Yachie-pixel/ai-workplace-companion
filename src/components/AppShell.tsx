import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  Search,
  MessagesSquare,
  Bookmark,
  Settings,
  Menu,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/chat", label: "AI Chat", icon: MessagesSquare },
  { to: "/saved", label: "Saved Work", icon: Bookmark },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-navy">
        <Sparkles className="size-4 text-navy-foreground" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold text-navy">Workplace AI</p>
        <p className="text-xs text-muted-foreground">Productivity Assistant</p>
      </div>
    </div>
  );
}

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-secondary/60 p-3 text-xs leading-relaxed text-secondary-foreground",
        className,
      )}
    >
      <p className="mb-1 flex items-center gap-1.5 font-semibold">
        <ShieldAlert className="size-3.5" /> Responsible AI
      </p>
      <p>
        AI-generated content may contain errors or omissions. Review important information before
        using or sharing it. Users remain responsible for reviewing and approving AI-generated
        content. Do not enter confidential or sensitive workplace information unless permitted by
        your organization&apos;s policies.
      </p>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      {Icon ? (
        <div className="hidden size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-navy sm:flex">
          <Icon className="size-5" />
        </div>
      ) : null}
      <div>
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar px-4 py-5 lg:flex">
        <Brand />
        <div className="mt-8 flex-1">
          <NavLinks />
        </div>
        <AiDisclaimer />
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open navigation">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-sidebar p-5">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Brand />
            <div className="mt-8">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
