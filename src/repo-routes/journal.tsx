import { createFileRoute } from "@tanstack/react-router";
import { JournalView } from "@/features/wira/components/views/JournalView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Jurnal & Refleksi Harian — Client OS Konsultan Manajemen" },
      {
        name: "description",
        content:
          "Catatan harian, refleksi keputusan, evaluasi pembelajaran, dan pelacakan energi serta rasa syukur.",
      },
    ],
  }),
  component: JournalViewPage,
});

function JournalViewPage() {
  return (
    <AppShell
      title="Jurnal & Refleksi"
      subtitle="Catatan harian, refleksi keputusan strategis, dan pelacakan rasa syukur"
    >
      <div className="w-full">
        <JournalView />
      </div>
    </AppShell>
  );
}
