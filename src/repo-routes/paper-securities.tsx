import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/paper-securities")({
  component: PaperSecuritiesPage,
});

function PaperSecuritiesPage() {
  return (
    <AppShell title="Paper Securities" subtitle="Surat berharga, saham, dan obligasi">
      <div className="w-full">
        <p className="text-muted-foreground">
          Manajemen portofolio paper securities akan ditampilkan di sini.
        </p>
      </div>
    </AppShell>
  );
}
