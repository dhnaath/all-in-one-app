import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import {
  StandaloneZakatApp,
  ZAKAT_DATA,
  ZakatType,
} from "@/features/zakat/components/ZakatStandaloneViews";

export const Route = createFileRoute("/zakat")({
  validateSearch: (search: Record<string, unknown>): { app?: string } => {
    return {
      app: typeof search.app === "string" ? search.app : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Zakat Syariah — Client OS" },
      { name: "description", content: "Aplikasi Standalone Zakat Penghasilan, Zakat Maal, dan Zakat Fitrah" },
    ],
  }),
  component: ZakatPage,
});

function ZakatPage() {
  const { app } = Route.useSearch();
  const navigate = useNavigate();

  const isKnownZakat = app && app in ZAKAT_DATA;
  const currentZakat: ZakatType = isKnownZakat ? (app as ZakatType) : "penghasilan";
  const currentData = ZAKAT_DATA[currentZakat];

  const title = currentData
    ? `${currentData.title} — ${currentData.badge}`
    : "Zakat Syariah";

  const subtitle = currentData
    ? currentData.tagline
    : "Modul aplikasi standalone zakat penghasilan, maal, dan fitrah";

  return (
    <AppShell title={title} subtitle={subtitle}>
      <div className="w-full">
        <StandaloneZakatApp
          zakatId={currentZakat}
          onNavigateZakat={(newType) => {
            navigate({
              to: "/zakat",
              search: { app: newType },
            });
          }}
        />
      </div>
    </AppShell>
  );
}
