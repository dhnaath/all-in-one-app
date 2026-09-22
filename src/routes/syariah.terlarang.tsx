import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import ProhibitedTransactions from "@/features/syariah/components/ProhibitedTransactions";

export const Route = createFileRoute("/syariah/terlarang")({
  component: SyariahTerlarangPage,
});

function SyariahTerlarangPage() {
  return (
    <AppShell title="Transaksi Terlarang" subtitle="Daftar transaksi yang dilarang dalam muamalah">
      <div className="w-full">
        <ProhibitedTransactions />
      </div>
    </AppShell>
  );
}
