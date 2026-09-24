import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { AssetMatrix } from "@/features/matriks/asset-matrix";

export const Route = createFileRoute("/asset")({
  head: () => ({
    meta: [
      { title: "Kuadran Aset — Client OS" },
      { name: "description", content: "Pemetaan Likuiditas dan Produktivitas Aset." },
    ],
  }),
  component: AssetPage,
});

function AssetPage() {
  return (
    <AppShell title="Kuadran Aset" subtitle="Pemetaan Likuiditas & Produktivitas Aset">
      <AssetMatrix />
    </AppShell>
  );
}
