import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/outlook")({
  component: OutlookPage,
});

function OutlookPage() {
  return (
    <AppShell title="Outlook" subtitle="Organization-Optimizing > Outlook">
      <div className="flex h-[50vh] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Outlook</h2>
          <p className="text-sm text-muted-foreground">
            Halaman Outlook sedang dalam pengembangan.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
