import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { InteractView } from "@/features/society/mutual/InteractView";

export const Route = createFileRoute("/interact")({
  head: () => ({
    meta: [
      { title: "Interact — Client OS" },
      { name: "description", content: "Mutual-Mapping: Pola komunikasi dua arah & dinamika interaksi resiprokal." },
    ],
  }),
  component: InteractPage,
});

function InteractPage() {
  return (
    <AppShell title="Interact" subtitle="Mutual-Mapping > Interact (Dinamika Interaksi & Komunikasi Dua Arah)">
      <div className="w-full">
        <InteractView />
      </div>
    </AppShell>
  );
}
