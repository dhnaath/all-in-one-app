import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { ImprovementView } from "@/features/society/stages/ImprovementView";

export const Route = createFileRoute("/improvement")({
  head: () => ({
    meta: [
      { title: "Improvement — Client OS" },
      { name: "description", content: "Fase 3: Improvement (Optimalisasi & Kaizen)." },
    ],
  }),
  component: ImprovementPage,
});

function ImprovementPage() {
  return (
    <AppShell title="Improvement" subtitle="Self-Shaping > Fase 3: Optimalisasi & Kaizen">
      <div className="w-full">
        <ImprovementView />
      </div>
    </AppShell>
  );
}
