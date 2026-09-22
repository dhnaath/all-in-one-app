import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/pocket")({
  component: PocketPage,
});

function PocketPage() {
  return (
    <AppShell title="Pocket" subtitle="Personal">
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
        <h2 className="text-3xl font-bold text-foreground">Pocket</h2>
      </div>
    </AppShell>
  );
}
