import { createFileRoute } from "@tanstack/react-router";
import InvestmentApp from "@/features/investment/App";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/investasi")({
  head: () => ({
    meta: [
      { title: "Kalkulator Investasi — Client OS Konsultan Manajemen" },
      { name: "description", content: "Kalkulator Bunga Majemuk & Return on Investment." },
    ],
  }),
  component: InvestasiPage,
});

function InvestasiPage() {
  return (
    <AppShell title="Kalkulator Investasi" subtitle="Bunga Majemuk & Return on Investment">
      <div className="w-full -mt-8">
        <InvestmentApp />
      </div>
    </AppShell>
  );
}
