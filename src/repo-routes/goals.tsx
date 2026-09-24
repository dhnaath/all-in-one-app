import { createFileRoute } from "@tanstack/react-router";
import { GoalsView } from "@/features/wira/components/views/GoalsView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/goals")({
  head: () => ({
    meta: [
      { title: "Target & Goals — Client OS" },
      { name: "description", content: "Penetapan sasaran strategis, pelacakan milestone, dan pencapaian target." },
    ],
  }),
  component: GoalsViewPage,
});

function GoalsViewPage() {
  return (
    <AppShell title="Target & Goals" subtitle="Tetapkan sasaran terukur, monitor progres berkala, dan raih pencapaian.">
      <div className="w-full">
        <GoalsView />
      </div>
    </AppShell>
  );
}
