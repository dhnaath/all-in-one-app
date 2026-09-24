import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { OutwardView } from "@/features/society/overview/OutwardView";

export const Route = createFileRoute("/outward")({
  head: () => ({
    meta: [
      { title: "Outward — Client OS" },
      { name: "description", content: "Organization-Optimizing: Outward radar dan pemantauan dinamika eksternal." },
    ],
  }),
  component: OutwardPage,
});

function OutwardPage() {
  return (
    <AppShell title="Outward" subtitle="Organization-Optimizing > Outward">
      <div className="w-full">
        <OutwardView />
      </div>
    </AppShell>
  );
}
