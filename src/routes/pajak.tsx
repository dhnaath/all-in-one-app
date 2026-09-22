import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import {
  StandaloneTaxApp,
  TAX_APPS,
  TaxAppType,
} from "@/features/tax/components/TaxStandaloneViews";

export const Route = createFileRoute("/pajak")({
  validateSearch: (search: Record<string, unknown>): { app?: string } => {
    return {
      app: typeof search.app === "string" ? search.app : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Kalkulator Pajak — Client OS" },
      { name: "description", content: "Kalkulator Standalone PPh 21, Saham & Dividen, Properti, dan PPN" },
    ],
  }),
  component: PajakPage,
});

function PajakPage() {
  const { app } = Route.useSearch();
  const navigate = useNavigate();

  const isKnownApp = app && app in TAX_APPS;
  const currentApp: TaxAppType = isKnownApp
    ? (app as TaxAppType)
    : "pph21";
  const currentData = TAX_APPS[currentApp];

  const title = currentData
    ? `${currentData.title} — ${currentData.badge}`
    : "Kalkulator Pajak";

  const subtitle = currentData
    ? currentData.tagline
    : "Kalkulator Pajak Personal & Bisnis";

  return (
    <AppShell title={title} subtitle={subtitle}>
      <div className="w-full">
        <StandaloneTaxApp
          appId={currentApp}
          onNavigateApp={(newType) => {
            navigate({
              to: "/pajak",
              search: { app: newType },
            });
          }}
        />
      </div>
    </AppShell>
  );
}
