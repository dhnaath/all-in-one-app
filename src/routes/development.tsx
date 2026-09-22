import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { DevelopmentView } from "@/features/society/stages/DevelopmentView";

export const Route = createFileRoute("/development")({
  head: () => ({
    meta: [
      { title: "Development — Client OS" },
      { name: "description", content: "Fase 4: Development (Pengembangan & Ekspansi)." },
    ],
  }),
  component: DevelopmentPage,
});

function DevelopmentPage() {
  return (
    <AppShell title="Development" subtitle="Self-Shaping > Fase 4: Pengembangan & Ekspansi">
      <div className="w-full">
        <DevelopmentView />
      </div>
    </AppShell>
  );
}
