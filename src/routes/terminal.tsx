import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/terminal")({
  component: Terminal,
});

function Terminal() {
  return (
    <AppShell title="Terminal" subtitle="AI Chat">
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
        <h2 className="text-3xl font-bold text-foreground">
          Chat dengan AI
        </h2>
      </div>
    </AppShell>
  );
}
