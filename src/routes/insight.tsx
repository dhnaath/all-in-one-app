import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/insight")({
  component: InsightPage,
});

function InsightPage() {
  return (
    <AppShell title="Insight" subtitle="Organization-Optimizing > Insight">
      <div className="flex h-[50vh] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Insight</h2>
          <p className="text-sm text-muted-foreground">
            Halaman Insight sedang dalam pengembangan.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
