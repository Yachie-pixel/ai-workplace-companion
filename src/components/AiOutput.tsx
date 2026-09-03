import { Copy, RefreshCw, Save, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveItem, type SavedKind } from "@/lib/saved-work";

type Props = {
  title: string;
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  onRegenerate: () => void;
  savedKind: SavedKind;
  savedTitle: string;
  emptyHint: string;
  rows?: number;
};

export function AiOutput({
  title,
  value,
  onChange,
  loading,
  error,
  onRegenerate,
  savedKind,
  savedTitle,
  emptyHint,
  rows = 18,
}: Props) {
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  const save = () => {
    saveItem(savedKind, savedTitle, value);
    toast.success("Saved to Saved Work");
  };

  return (
    <Card className="border-border shadow-soft">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle className="text-base text-navy">{title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copy} disabled={!value || loading}>
            <Copy className="size-3.5" /> Copy
          </Button>
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={loading}>
            <RefreshCw className="size-3.5" /> Regenerate
          </Button>
          <Button size="sm" onClick={save} disabled={!value || loading}>
            <Save className="size-3.5" /> Save
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="mb-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-medium">{error}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={onRegenerate}>
                Retry
              </Button>
            </div>
          </div>
        ) : null}

        {loading && !value ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Generating with AI…
          </div>
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder={emptyHint}
            className="resize-y font-normal leading-relaxed"
          />
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          AI-generated draft — edit before sending. Verify any facts, figures, or claims
          independently.
        </p>
      </CardContent>
    </Card>
  );
}
