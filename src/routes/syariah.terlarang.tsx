import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import ProhibitedTransactions from "@/features/syariah/components/ProhibitedTransactions";
import {
  PROHIBITED_DATA,
  ProhibitedType,
} from "@/features/syariah/components/ProhibitedStandaloneViews";

export const Route = createFileRoute("/syariah/terlarang")({
  validateSearch: (search: Record<string, unknown>): { app?: string } => {
    return {
      app: typeof search.app === "string" ? search.app : undefined,
    };
  },
  component: SyariahTerlarangPage,
});

function SyariahTerlarangPage() {
  const { app } = Route.useSearch();
  const navigate = useNavigate();

  const isKnown = app && app in PROHIBITED_DATA;
  const currentItem = isKnown ? (app as ProhibitedType) : null;
  const currentData = currentItem ? PROHIBITED_DATA[currentItem] : null;

  const title = currentData
    ? `${currentData.title} — ${currentData.badge}`
    : "Transaksi Terlarang";

  const subtitle = currentData
    ? currentData.tagline
    : "Daftar larangan utama dalam muamalah dan modul aplikasi standalone";

  return (
    <AppShell title={title} subtitle={subtitle}>
      <div className="w-full">
        <ProhibitedTransactions
          initialProhibited={currentItem}
          onNavigateProhibited={(newItem) => {
            if (newItem) {
              navigate({
                to: "/syariah/terlarang",
                search: { app: newItem },
              });
            } else {
              navigate({
                to: "/syariah/terlarang",
                search: {},
              });
            }
          }}
        />
      </div>
    </AppShell>
  );
}
