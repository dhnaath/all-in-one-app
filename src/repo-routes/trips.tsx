import { createFileRoute } from "@tanstack/react-router";
import { TripsView } from "@/features/wira/components/views/TripsView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/trips")({
  head: () => ({
    meta: [
      { title: "Trips & Executive Travel Itinerary — All in One" },
      { name: "description", content: "Manajemen perjalanan dinas konsultan, retret strategis, timeline hari ke hari, dan logistik eksekutif." },
    ],
  }),
  component: TripsViewPage,
});

function TripsViewPage() {
  return (
    <AppShell title="Trips & Executive Travel Itinerary" subtitle="Manajemen perjalanan dinas, retret strategis dewan mitra, dan checklist logistik">
      <div className="w-full">
        <TripsView />
      </div>
    </AppShell>
  );
}
