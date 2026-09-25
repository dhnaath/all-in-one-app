import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { KomunitasWargaApp } from "@/features/komunitas/KomunitasWargaApp";

export const Route = createFileRoute("/komunitas-warga")({
  head: () => ({
    meta: [
      { title: "Komunitas Warga — Client OS" },
      {
        name: "description",
        content: "Platform manajemen rukun warga RT/RW, transparansi iuran, pengumuman, dan layanan publik.",
      },
    ],
  }),
  component: KomunitasWargaRouteComponent,
});

function KomunitasWargaRouteComponent() {
  return (
    <AppShell
      title="Komunitas Warga"
      subtitle="Manajemen Rukun Warga RT/RW, Transparansi Iuran, Pengumuman, dan Layanan Publik"
    >
      <div className="w-full">
        <KomunitasWargaApp />
      </div>
    </AppShell>
  );
}
