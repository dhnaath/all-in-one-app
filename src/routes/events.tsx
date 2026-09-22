import { createFileRoute } from "@tanstack/react-router";
import { EventsView } from "@/features/wira/components/views/EventsView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Acara & Agenda — Client OS Konsultan" },
      {
        name: "description",
        content:
          "Jadwal pertemuan klien, lokakarya strategis, rapat dewan pengawas, dan agenda penting.",
      },
    ],
  }),
  component: EventsViewPage,
});

function EventsViewPage() {
  return (
    <AppShell
      title="Acara & Pertemuan"
      subtitle="Kelola agenda rapat klien, lokakarya strategis, dewan penasihat, dan agenda penting"
    >
      <div className="w-full">
        <EventsView />
      </div>
    </AppShell>
  );
}
