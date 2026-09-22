import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import TaxTools from "@/features/tax/components/TaxTools";

export const Route = createFileRoute("/pajak")({
  head: () => ({
    meta: [
      { title: "Kalkulator Pajak — Client OS" },
      { name: "description", content: "Kalkulator Pajak Personal & Bisnis" },
    ],
  }),
  component: PajakPage,
});

function PajakPage() {
  return (
    <AppShell title="Kalkulator Pajak" subtitle="Pajak Personal & Bisnis">
      <div className="w-full">
        <TaxTools />
      </div>
    </AppShell>
  );
}
