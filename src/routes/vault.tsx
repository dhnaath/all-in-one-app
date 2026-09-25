import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { VaultAppView } from "@/features/wira/components/views/VaultAppView";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "Vault & Identitas Resmi — All in One" },
      { name: "description", content: "Brankas terenkripsi untuk KTP, Paspor, SIM, Kartu Keluarga, dan Ijazah Sertifikat." },
    ],
  }),
  component: VaultPage,
});

function VaultPage() {
  return (
    <AppShell title="Vault & Identitas" subtitle="Brankas aman untuk KTP, Paspor, Kartu Keluarga, dan Ijazah resmi">
      <div className="w-full">
        <VaultAppView />
      </div>
    </AppShell>
  );
}
