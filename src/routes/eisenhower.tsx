import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { EisenhowerMatrix } from "@/features/matriks/eisenhower-matrix";

export const Route = createFileRoute("/eisenhower")({
  component: EisenhowerPage,
});

function EisenhowerPage() {
  return (
    <AppShell title="Eisenhower Matrix" subtitle="Matriks Manajemen Waktu">
      <div className="w-full -mt-8">
        <EisenhowerMatrix />
      </div>
    </AppShell>
  );
}
