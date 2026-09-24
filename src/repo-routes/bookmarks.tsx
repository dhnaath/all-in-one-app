import { createFileRoute } from "@tanstack/react-router";
import { BookmarksView } from "@/features/wira/components/views/BookmarksView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Bookmarks & Referensi — Client OS Konsultan" },
      {
        name: "description",
        content:
          "Direktori tautan esensial, portal riset, basis data regulasi, dan utilitas kerja terkurasi.",
      },
    ],
  }),
  component: BookmarksViewPage,
});

function BookmarksViewPage() {
  return (
    <AppShell
      title="Bookmarks & Referensi"
      subtitle="Koleksi tautan rujukan industri, basis data pasar modal, regulasi hukum, dan utilitas kerja"
    >
      <div className="w-full">
        <BookmarksView />
      </div>
    </AppShell>
  );
}
