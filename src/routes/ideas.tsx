import { createFileRoute } from "@tanstack/react-router";
import { IdeasView } from "@/features/wira/components/views/IdeasView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/ideas")({
  head: () => ({
    meta: [
      { title: "Ide & Inovasi — Client OS Konsultan Manajemen" },
      {
        name: "description",
        content:
          "Bank gagasan, matriks prioritas dampak vs upaya, dan pipeline validasi inovasi bisnis.",
      },
    ],
  }),
  component: IdeasViewPage,
});

function IdeasViewPage() {
  return (
    <AppShell
      title="Ide & Inovasi"
      subtitle="Katalog gagasan, matriks prioritas dampak vs upaya, dan pipeline validasi"
    >
      <div className="w-full">
        <IdeasView />
      </div>
    </AppShell>
  );
}
