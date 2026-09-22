import { createFileRoute } from "@tanstack/react-router";
import { ShoppingListView } from "@/features/wira/components/views/ShoppingListView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/shopping")({
  head: () => ({
    meta: [
      { title: "Shopping List & Executive Procurement — All in One" },
      { name: "description", content: "Daftar belanja pintar, pengadaan perlengkapan kantor & studio, groceries nutrisi, dan manajemen anggaran." },
    ],
  }),
  component: ShoppingListViewPage,
});

function ShoppingListViewPage() {
  return (
    <AppShell title="Shopping List & Executive Procurement" subtitle="Daftar belanja cerdas, pengadaan perlengkapan kerja & nutrisi dengan pelacakan anggaran">
      <div className="w-full">
        <ShoppingListView />
      </div>
    </AppShell>
  );
}
