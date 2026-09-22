import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { InterdependenceView } from "@/features/society/mutual/InterdependenceView";

export const Route = createFileRoute("/interdependence")({
  head: () => ({
    meta: [
      { title: "Interdependence — Client OS" },
      { name: "description", content: "Mutual-Mapping: Pemetaan saling ketergantungan timbal balik & ekosistem resiprokal." },
    ],
  }),
  component: InterdependencePage,
});

function InterdependencePage() {
  return (
    <AppShell title="Interdependence" subtitle="Mutual-Mapping > Interdependence (Saling Ketergantungan Timbal Balik & Simbiosis)">
      <div className="w-full">
        <InterdependenceView />
      </div>
    </AppShell>
  );
}
