import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { InterestView } from "@/features/society/mutual/InterestView";

export const Route = createFileRoute("/interest")({
  head: () => ({
    meta: [
      { title: "Interest — Client OS" },
      { name: "description", content: "Mutual-Mapping: Penyelarasan minat, kepentingan strategis, & formula win-win." },
    ],
  }),
  component: InterestPage,
});

function InterestPage() {
  return (
    <AppShell title="Interest" subtitle="Mutual-Mapping > Interest (Penyelarasan Minat Bersama & Value Alignment)">
      <div className="w-full">
        <InterestView />
      </div>
    </AppShell>
  );
}
