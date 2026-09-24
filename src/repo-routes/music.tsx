import { createFileRoute } from "@tanstack/react-router";
import { MusicView } from "@/features/wira/components/views/MusicView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/music")({
  head: () => ({
    meta: [
      { title: "Music & Deep Work Station — All in One" },
      { name: "description", content: "Stasiun audio fokus untuk sesi pemodelan finansial dan penulisan intensif." },
    ],
  }),
  component: MusicViewPage,
});

function MusicViewPage() {
  return (
    <AppShell title="Music & Deep Work Station" subtitle="Stasiun audio fokus untuk produktivitas dan relaksasi">
      <div className="w-full">
        <MusicView />
      </div>
    </AppShell>
  );
}
