import { createFileRoute } from "@tanstack/react-router";
import { DesignView } from "@/features/wira/components/views/DesignView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/design")({
  head: () => ({
    meta: [
      { title: "Design — Client OS" },
      { name: "description", content: "Design projects and resources." },
    ],
  }),
  component: DesignViewPage,
});

function DesignViewPage() {
  return (
    <AppShell title="Design" subtitle="Design projects and resources.">
      <div className="w-full">
        <DesignView />
      </div>
    </AppShell>
  );
}
