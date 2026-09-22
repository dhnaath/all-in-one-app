import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { CountdownView } from "@/features/wira/components/views/CountdownView";

export const Route = createFileRoute("/countdown")({
  head: () => ({
    meta: [{ title: "Countdown" }],
  }),
  component: CountdownPage,
});

function CountdownPage() {
  return (
    <AppShell title="Countdown" subtitle="Hitung mundur tenggat penting">
      <div className="h-[800px] w-full overflow-y-auto bg-card rounded-xl border border-border">
        <CountdownView />
      </div>
    </AppShell>
  );
}
