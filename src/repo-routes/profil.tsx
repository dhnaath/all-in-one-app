import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/profil")({
  component: ProfilPage,
});

function ProfilPage() {
  return (
    <AppShell title="Profil" subtitle="Manajemen akun">
      <div className="flex h-[60vh] items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Profil Pengguna</h2>
          <p className="text-muted-foreground">Sedang dalam pengembangan</p>
        </div>
      </div>
    </AppShell>
  );
}
