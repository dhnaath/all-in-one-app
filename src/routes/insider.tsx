import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { InsiderView } from "@/features/society/overview/InsiderView";

export const Route = createFileRoute("/insider")({
  head: () => ({
    meta: [
      { title: "Insider — Client OS" },
      { name: "description", content: "Organization-Optimizing: Insider intelligence dan pemantauan internal." },
    ],
  }),
  component: InsiderPage,
});

function InsiderPage() {
  return (
    <AppShell title="Insider" subtitle="Organization-Optimizing > Insider">
      <div className="w-full">
        <InsiderView />
      </div>
    </AppShell>
  );
}
