import { createFileRoute } from "@tanstack/react-router";
import { GamesView } from "@/features/wira/components/views/GamesView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Strategic Games & Simulators — All in One" },
      { name: "description", content: "Simulasi bisnis interaktif, optimasi rantai pasok, dan pemodelan keputusan strategis." },
    ],
  }),
  component: GamesViewPage,
});

function GamesViewPage() {
  return (
    <AppShell title="Strategic Games & Simulators" subtitle="Simulasi bisnis interaktif dan pengasah keputusan dewan direksi">
      <div className="w-full">
        <GamesView />
      </div>
    </AppShell>
  );
}
