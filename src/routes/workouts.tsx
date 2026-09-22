import { createFileRoute } from "@tanstack/react-router";
import { WorkoutsView } from "@/features/wira/components/views/WorkoutsView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/workouts")({
  head: () => ({
    meta: [
      { title: "Workouts & Executive Fitness Matrix — All in One" },
      { name: "description", content: "Protokol kebugaran fungsional, postur tulang belakang meja kerja, dan ketahanan kardiovaskular eksekutif." },
    ],
  }),
  component: WorkoutsViewPage,
});

function WorkoutsViewPage() {
  return (
    <AppShell title="Workouts & Executive Fitness Matrix" subtitle="Protokol kebugaran fungsional, dekompresi tulang belakang, rest timer, dan pelacak set">
      <div className="w-full">
        <WorkoutsView />
      </div>
    </AppShell>
  );
}
