import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import {
  StandaloneInvestmentApp,
  INVESTMENT_APPS,
  InvestmentAppType,
} from "@/features/investment/components/InvestmentStandaloneViews";

export const Route = createFileRoute("/investasi")({
  validateSearch: (search: Record<string, unknown>): { app?: string } => {
    return {
      app: typeof search.app === "string" ? search.app : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Investasi & Aset — Client OS" },
      { name: "description", content: "Kalkulator Standalone Bunga Majemuk dan Return on Investment (ROI)." },
    ],
  }),
  component: InvestasiPage,
});

function InvestasiPage() {
  const { app } = Route.useSearch();
  const navigate = useNavigate();

  const isKnownApp = app && app in INVESTMENT_APPS;
  const currentApp: InvestmentAppType = isKnownApp
    ? (app as InvestmentAppType)
    : "bunga-majemuk";
  const currentData = INVESTMENT_APPS[currentApp];

  const title = currentData
    ? `${currentData.title} — ${currentData.badge}`
    : "Kalkulator Investasi";

  const subtitle = currentData
    ? currentData.tagline
    : "Simulasi Bunga Majemuk & Evaluasi Return on Investment (ROI)";

  return (
    <AppShell title={title} subtitle={subtitle}>
      <div className="w-full">
        <StandaloneInvestmentApp
          appId={currentApp}
          onNavigateApp={(newType) => {
            navigate({
              to: "/investasi",
              search: { app: newType },
            });
          }}
        />
      </div>
    </AppShell>
  );
}
