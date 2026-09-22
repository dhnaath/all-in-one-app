import { createFileRoute } from "@tanstack/react-router";
import { HealthView } from "@/features/wira/components/views/HealthView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Health & Executive Vitality Matrix — All in One" },
      { name: "description", content: "Pemantauan biomarker metabolik, kualitas tidur sirkadian, protokol nootropik, dan hidrasi presisi eksekutif." },
    ],
  }),
  component: HealthViewPage,
});

function HealthViewPage() {
  return (
    <AppShell title="Health & Executive Vitality" subtitle="Biomarker metabolik, hidrasi presisi, kualitas tidur sirkadian, dan protokol suplemen nootropik">
      <div className="w-full">
        <HealthView />
      </div>
    </AppShell>
  );
}
