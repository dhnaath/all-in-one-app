import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/intellectual-property")({
  component: IntellectualPropertyPage,
});

function IntellectualPropertyPage() {
  return (
    <AppShell title="Intellectual Property" subtitle="Hak kekayaan intelektual, paten, dan merek">
      <div className="w-full">
        <p className="text-muted-foreground">
          Manajemen portofolio intellectual property akan ditampilkan di sini.
        </p>
      </div>
    </AppShell>
  );
}
