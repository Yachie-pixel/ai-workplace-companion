import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, Copy, Trash2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { listSaved, deleteItem, updateItem, type SavedItem } from "@/lib/saved-work";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Work — Workplace AI" },
      {
        name: "description",
        content:
          "Your saved AI emails, research briefs and chat responses, stored privately in this browser.",
      },
      { property: "og:title", content: "Saved Work — Workplace AI" },
      {
        property: "og:description",
        content: "View, edit, copy and delete AI outputs saved in your browser.",
      },
    ],
  }),
  component: SavedPage,
});

const labels: Record<SavedItem["kind"], string> = {
  email: "Email",
  research: "Research",
  chat: "Chat",
};

function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    const sync = () => setItems(listSaved());
    sync();
    window.addEventListener("awpa:saved-work", sync);
    return () => window.removeEventListener("awpa:saved-work", sync);
  }, []);

  return (
    <AppShell>
      <PageHeader
        icon={Bookmark}
        title="Saved Work"
        description="Everything you save is stored only in this browser — no account, no server."
      />

      {items.length === 0 ? (
        <Card className="border-dashed border-border">
          <CardContent className="py-14 text-center text-sm text-muted-foreground">
            Nothing saved yet. Save an email, research brief or chat response and it will show up
            here.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {items.map((item) => {
            const value = drafts[item.id] ?? item.content;
            return (
              <Card key={item.id} className="border-border shadow-soft">
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base text-navy">{item.title}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="secondary">{labels[item.kind]}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    rows={8}
                    value={value}
                    onChange={(e) => setDrafts((d) => ({ ...d, [item.id]: e.target.value }))}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        updateItem(item.id, value);
                        toast.success("Changes saved");
                      }}
                    >
                      <Save className="size-3.5" /> Save changes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await navigator.clipboard.writeText(value);
                        toast.success("Copied");
                      }}
                    >
                      <Copy className="size-3.5" /> Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        deleteItem(item.id);
                        toast.success("Deleted");
                      }}
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
