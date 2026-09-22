import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { IntersectView } from "@/features/society/mutual/IntersectView";

export const Route = createFileRoute("/intersect")({
  head: () => ({
    meta: [
      { title: "Intersect — Client OS" },
      { name: "description", content: "Mutual-Mapping: Titik temu konvergensi kapabilitas & kolaborasi lintas domain." },
    ],
  }),
  component: IntersectPage,
});

function IntersectPage() {
  return (
    <AppShell title="Intersect" subtitle="Mutual-Mapping > Intersect (Titik Temu Sinergi & Konvergensi Kapabilitas)">
      <div className="w-full">
        <IntersectView />
      </div>
    </AppShell>
  );
}
