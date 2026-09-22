import { createFileRoute } from "@tanstack/react-router";
import { HabitsView } from "@/features/wira/components/views/HabitsView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [
      { title: "Habits Tracker — Client OS" },
      { name: "description", content: "Pelacak rutinitas harian, konsistensi streak, dan disiplin diri." },
    ],
  }),
  component: HabitsViewPage,
});

function HabitsViewPage() {
  return (
    <AppShell title="Habits Tracker" subtitle="Bangun kebiasaan produktif harian, jaga streak, dan pantau konsistensi.">
      <div className="w-full">
        <HabitsView />
      </div>
    </AppShell>
  );
}
