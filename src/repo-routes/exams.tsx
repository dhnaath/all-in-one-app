import { createFileRoute } from "@tanstack/react-router";
import { ExamsView } from "@/features/wira/components/views/ExamsView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/exams")({
  head: () => ({
    meta: [{ title: "Exams — Client OS" }, { name: "description", content: "Track your exams." }],
  }),
  component: ExamsViewPage,
});

function ExamsViewPage() {
  return (
    <AppShell title="Exams" subtitle="Track your exams.">
      <div className="w-full">
        <ExamsView />
      </div>
    </AppShell>
  );
}
