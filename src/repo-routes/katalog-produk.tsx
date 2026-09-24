import { createFileRoute } from "@tanstack/react-router";
import ProductApp from "@/features/product/App";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/katalog-produk")({
  head: () => ({
    meta: [
      { title: "Katalog Produk & Aset — Client OS Konsultan Manajemen" },
      { name: "description", content: "Pelacak masa pakai, garansi, kadaluarsa, dan nilai aset." },
    ],
  }),
  component: KatalogProdukPage,
});

function KatalogProdukPage() {
  return (
    <AppShell title="Katalog Produk" subtitle="Pelacak Masa Pakai & Aset">
      <div className="w-full -mt-8">
        <ProductApp />
      </div>
    </AppShell>
  );
}
