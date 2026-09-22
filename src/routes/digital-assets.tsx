import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/digital-assets")({
  component: DigitalAssetsPage,
});

function DigitalAssetsPage() {
  return (
    <AppShell title="Digital Assets" subtitle="Aset kripto, token, dan portofolio digital">
      <div className="w-full">
        <p className="text-muted-foreground">
          Manajemen portofolio digital assets akan ditampilkan di sini.
        </p>
      </div>
    </AppShell>
  );
}
