import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import IslamicContracts from "@/features/syariah/components/IslamicContracts";

export const Route = createFileRoute("/syariah/akad")({
  component: SyariahAkadPage,
});

function SyariahAkadPage() {
  return (
    <AppShell title="Akad Syariah" subtitle="Referensi akad-akad syariah dalam transaksi bisnis">
      <div className="w-full">
        <IslamicContracts />
      </div>
    </AppShell>
  );
}
