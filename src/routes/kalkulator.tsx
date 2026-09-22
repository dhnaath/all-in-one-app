import { createFileRoute } from "@tanstack/react-router";
import { KalkulatorUmumView } from "@/features/wira/components/views/KalkulatorUmumView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/kalkulator")({
  head: () => ({
    meta: [
      { title: "Kalkulator Umum — Client OS" },
      { name: "description", content: "Kalkulator ilmiah, konverter satuan, dan kalkulator persentase niaga." },
    ],
  }),
  component: KalkulatorPage,
});

function KalkulatorPage() {
  return (
    <AppShell title="Kalkulator Umum" subtitle="Alat hitung serbaguna, konverter satuan, dan pecahan kas.">
      <div className="w-full">
        <KalkulatorUmumView />
      </div>
    </AppShell>
  );
}
