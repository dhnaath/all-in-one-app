import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { SufficientView } from "@/features/society/stages/SufficientView";

export const Route = createFileRoute("/sufficient")({
  head: () => ({
    meta: [
      { title: "Sufficient — Client OS" },
      { name: "description", content: "Fase 2: Sufficient (Kecukupan & Kemandirian)." },
    ],
  }),
  component: SufficientPage,
});

function SufficientPage() {
  return (
    <AppShell title="Sufficient" subtitle="Self-Shaping > Fase 2: Kecukupan & Kemandirian">
      <div className="w-full">
        <SufficientView />
      </div>
    </AppShell>
  );
}
