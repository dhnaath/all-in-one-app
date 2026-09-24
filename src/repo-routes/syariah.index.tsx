import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import SyariahDashboard from "@/features/syariah/components/SyariahDashboard";

export const Route = createFileRoute("/syariah/")({
  component: SyariahPage,
});

function SyariahPage() {
  return (
    <AppShell title="Dashboard Pasar" subtitle="Kutipan harga logam mulia dan indeks global">
      <div className="w-full">
        <SyariahDashboard />
      </div>
    </AppShell>
  );
}
