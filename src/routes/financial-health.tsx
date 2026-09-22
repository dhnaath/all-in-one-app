import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { FinancialHealthMatrix } from "@/features/matriks/financial-health-matrix";

export const Route = createFileRoute("/financial-health")({
  component: FinancialHealthPage,
});

function FinancialHealthPage() {
  return (
    <AppShell title="Kesehatan Finansial" subtitle="Matriks Ketahanan & Arus Kas">
      <div className="w-full -mt-8">
        <FinancialHealthMatrix />
      </div>
    </AppShell>
  );
}
