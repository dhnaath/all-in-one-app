import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { StandaloneAppView } from "@/features/standalone/StandaloneAppView";

export const Route = createFileRoute("/digital-assets")({
  head: () => ({
    meta: [
      { title: "Aset Digital & Lisensi — Client OS" },
      { name: "description", content: "Inventaris domain, server, SaaS, dan lisensi digital." },
    ],
  }),
  component: DigitalAssetsPage,
});

function DigitalAssetsPage() {
  return (
    <AppShell title="Aset Digital & Lisensi" subtitle="Inventaris domain, server, SaaS, dan lisensi digital">
      <div className="w-full">
        <StandaloneAppView appId="digital-assets" />
      </div>
    </AppShell>
  );
}

