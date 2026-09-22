import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import ZakatTools from "@/features/zakat/components/ZakatTools";

export const Route = createFileRoute("/zakat")({
  head: () => ({
    meta: [
      { title: "Kalkulator Zakat — Client OS" },
      { name: "description", content: "Zakat Penghasilan, Maal, dan Fitrah" },
    ],
  }),
  component: ZakatPage,
});

function ZakatPage() {
  return (
    <AppShell title="Kalkulator Zakat" subtitle="Zakat Penghasilan, Maal, dan Fitrah">
      <div className="w-full">
        <ZakatTools />
      </div>
    </AppShell>
  );
}
