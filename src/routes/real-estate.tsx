import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/real-estate")({
  component: RealEstatePage,
});

function RealEstatePage() {
  return (
    <AppShell title="Real Estate" subtitle="Tanah, bangunan, dan properti komersial">
      <div className="w-full">
        <p className="text-muted-foreground">
          Manajemen portofolio real estate akan ditampilkan di sini.
        </p>
      </div>
    </AppShell>
  );
}
