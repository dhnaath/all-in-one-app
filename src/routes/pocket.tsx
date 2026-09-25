import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { PocketAppView } from "@/features/standalone/UtilityStorageViews";

export const Route = createFileRoute("/pocket")({
  head: () => ({
    meta: [
      { title: "Pocket — All in One" },
      { name: "description", content: "Saku digital untuk slip kartu akses, voucher diskon, dan catatan cepat." },
    ],
  }),
  component: PocketPage,
});

function PocketPage() {
  return (
    <AppShell title="Pocket" subtitle="Saku digital untuk slip kartu akses, voucher diskon, dan catatan cepat">
      <div className="w-full">
        <PocketAppView />
      </div>
    </AppShell>
  );
}
