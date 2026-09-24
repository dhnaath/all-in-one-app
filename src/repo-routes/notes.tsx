import { createFileRoute } from "@tanstack/react-router";
import { NotesView } from "@/features/wira/components/views/NotesView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes & Docs — Client OS Konsultan Manajemen" },
      {
        name: "description",
        content:
          "Ruang kerja dokumentasi tim, panduan SOP, notulen rapat strategis, dan roadmap produk.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell
      title="Notes & Docs"
      subtitle="Ruang kerja dokumentasi tim, panduan SOP, dan notulen rapat strategis"
    >
      <div className="w-full">
        <NotesView />
      </div>
    </AppShell>
  );
}
