import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/physical-commodities")({
  component: PhysicalCommoditiesPage,
});

function PhysicalCommoditiesPage() {
  return (
    <AppShell title="Physical Commodities" subtitle="Aset fisik berharga seperti logam mulia">
      <div className="w-full">
        <p className="text-muted-foreground">
          Manajemen portofolio physical commodities akan ditampilkan di sini.
        </p>
      </div>
    </AppShell>
  );
}
