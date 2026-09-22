import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { EarningMatrix } from "@/features/matriks/earning-matrix";

export const Route = createFileRoute("/earning")({
  component: EarningPage,
});

function EarningPage() {
  return (
    <AppShell title="Earning" subtitle="Kuadran Pendapatan">
      <div className="w-full -mt-8">
        <EarningMatrix />
      </div>
    </AppShell>
  );
}
