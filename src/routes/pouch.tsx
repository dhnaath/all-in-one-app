import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { PouchAppView } from "@/features/standalone/UtilityStorageViews";

export const Route = createFileRoute("/pouch")({
  head: () => ({
    meta: [
      { title: "Pouch — All in One" },
      { name: "description", content: "Daftar periksa dokumen penting, perlengkapan esensial, dan kit bepergian." },
    ],
  }),
  component: PouchPage,
});

function PouchPage() {
  return (
    <AppShell title="Pouch" subtitle="Organizer dokumen esensial, tiket bepergian, dan perlengkapan perjalanan">
      <div className="w-full">
        <PouchAppView />
      </div>
    </AppShell>
  );
}
