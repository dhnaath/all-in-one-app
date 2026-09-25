import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { TrunkAppView } from "@/features/standalone/UtilityStorageViews";

export const Route = createFileRoute("/trunk")({
  head: () => ({
    meta: [
      { title: "Trunk — All in One" },
      { name: "description", content: "Gudang perkakas, penyimpanan peralatan musiman rumah, dan inventaris bagasi." },
    ],
  }),
  component: TrunkPage,
});

function TrunkPage() {
  return (
    <AppShell title="Trunk" subtitle="Gudang perkakas, inventaris alat musiman, dan penyimpanan rumah">
      <div className="w-full">
        <TrunkAppView />
      </div>
    </AppShell>
  );
}
