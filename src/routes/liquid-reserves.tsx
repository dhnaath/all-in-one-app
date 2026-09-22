import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/liquid-reserves")({
  component: LiquidReservesPage,
});

function LiquidReservesPage() {
  return (
    <AppShell title="Liquid Reserves" subtitle="Kas dan setara kas yang mudah dicairkan">
      <div className="w-full">
        <p className="text-muted-foreground">
          Manajemen portofolio liquid reserves akan ditampilkan di sini.
        </p>
      </div>
    </AppShell>
  );
}
