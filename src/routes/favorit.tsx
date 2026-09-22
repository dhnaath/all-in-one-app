import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/favorit")({
  component: FavoritPage,
});

function FavoritPage() {
  return (
    <AppShell title="Favorit" subtitle="Item yang disimpan">
      <div className="flex h-[60vh] items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Fitur Favorit</h2>
          <p className="text-muted-foreground">Sedang dalam pengembangan</p>
        </div>
      </div>
    </AppShell>
  );
}
