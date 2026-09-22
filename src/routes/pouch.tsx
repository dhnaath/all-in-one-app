import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/pouch")({
  component: PouchPage,
});

function PouchPage() {
  return (
    <AppShell title="Pouch" subtitle="Personal">
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
        <h2 className="text-3xl font-bold text-foreground">Pouch</h2>
      </div>
    </AppShell>
  );
}
