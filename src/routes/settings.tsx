import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader, AiDisclaimer } from "@/components/AppShell";
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
import { loadPreferences, savePreferences, defaultPreferences } from "@/lib/preferences";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workplace AI" },
      {
        name: "description",
        content:
          "Set your name, role, organization, default tone and email signature — stored locally in your browser.",
      },
      { property: "og:title", content: "Settings — Workplace AI" },
      {
        property: "og:description",
        content: "Personalize AI output with locally stored preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [prefs, setPrefs] = useState(defaultPreferences);

  useEffect(() => {
    setPrefs(loadPreferences());
  }, []);

  return (
    <AppShell>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Preferences are saved in your browser only and are used to personalize AI output."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-base text-navy">Your profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={prefs.displayName}
                onChange={(e) => setPrefs({ ...prefs, displayName: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={prefs.role}
                  onChange={(e) => setPrefs({ ...prefs, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org">Organization</Label>
                <Input
                  id="org"
                  value={prefs.organization}
                  onChange={(e) => setPrefs({ ...prefs, organization: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Default email tone</Label>
              <Select
                value={prefs.defaultTone}
                onValueChange={(v) => setPrefs({ ...prefs, defaultTone: v })}
              >
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
              <Label htmlFor="sig">Email signature</Label>
              <Textarea
                id="sig"
                rows={3}
                value={prefs.signature}
                onChange={(e) => setPrefs({ ...prefs, signature: e.target.value })}
              />
            </div>
            <Button
              onClick={() => {
                savePreferences(prefs);
                toast.success("Preferences saved");
              }}
            >
              <Save className="size-4" /> Save preferences
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-base text-navy">AI configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                AI responses are generated in real time through the built-in AI service — no API key
                setup is required.
              </p>
              <p>
                To use a different provider, change the model and endpoint in the single server
                route that handles AI requests.
              </p>
            </CardContent>
          </Card>
          <AiDisclaimer className="p-5 text-sm" />
        </div>
      </div>
    </AppShell>
  );
}
