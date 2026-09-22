import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import LocalShariaIndices from "@/features/syariah/components/LocalShariaIndices";

export const Route = createFileRoute("/syariah/indeks")({
  component: SyariahIndeksPage,
});

function SyariahIndeksPage() {
  return (
    <AppShell title="Indeks Sharia" subtitle="Daftar indeks saham syariah lokal">
      <div className="w-full">
        <LocalShariaIndices />
      </div>
    </AppShell>
  );
}
