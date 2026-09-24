import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { LiabilityMatrix } from "@/features/matriks/liability-matrix";

export const Route = createFileRoute("/liability")({
  component: LiabilityPage,
});

function LiabilityPage() {
  return (
    <AppShell title="Liability" subtitle="Kuadran Liabilitas">
      <div className="w-full -mt-8">
        <LiabilityMatrix />
      </div>
    </AppShell>
  );
}
