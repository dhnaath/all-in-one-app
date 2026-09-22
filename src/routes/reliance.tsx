import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { RelianceView } from "@/features/society/stages/RelianceView";

export const Route = createFileRoute("/reliance")({
  head: () => ({
    meta: [
      { title: "Reliance — Client OS" },
      { name: "description", content: "Fase 1: Reliance (Fondasi & Keandalan)." },
    ],
  }),
  component: ReliancePage,
});

function ReliancePage() {
  return (
    <AppShell title="Reliance" subtitle="Self-Shaping > Fase 1: Pondasi & Keandalan">
      <div className="w-full">
        <RelianceView />
      </div>
    </AppShell>
  );
}
