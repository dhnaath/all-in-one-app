import { createFileRoute } from "@tanstack/react-router";
import WaterApp from "@/features/water/App";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/water")({
  head: () => ({
    meta: [
      { title: "Water Tracker — Client OS" },
      { name: "description", content: "Lacak asupan hidrasi harian Anda." },
    ],
  }),
  component: WaterPage,
});

function WaterPage() {
  return (
    <AppShell title="Water Tracker" subtitle="Pantau kebiasaan minum air Anda sehari-hari">
      <div className="w-full">
        <WaterApp />
      </div>
    </AppShell>
  );
}
