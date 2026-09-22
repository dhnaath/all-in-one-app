import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import IslamicContracts from "@/features/syariah/components/IslamicContracts";
import { AKAD_DATA, AkadType } from "@/features/syariah/components/AkadStandaloneViews";

export const Route = createFileRoute("/syariah/akad")({
  validateSearch: (search: Record<string, unknown>): { app?: string } => {
    return {
      app: typeof search.app === "string" ? search.app : undefined,
    };
  },
  component: SyariahAkadPage,
});

function SyariahAkadPage() {
  const { app } = Route.useSearch();
  const navigate = useNavigate();

  const isKnownAkad = app && (app in AKAD_DATA);
  const currentAkad = isKnownAkad ? (app as AkadType) : null;
  const currentData = currentAkad ? AKAD_DATA[currentAkad] : null;

  const title = currentData
    ? `${currentData.title} — ${currentData.badge}`
    : "Akad Syariah";

  const subtitle = currentData
    ? currentData.tagline
    : "Referensi akad-akad syariah dan modul aplikasi standalone transaksi bisnis";

  return (
    <AppShell title={title} subtitle={subtitle}>
      <div className="w-full">
        <IslamicContracts
          initialAkad={currentAkad}
          onNavigateAkad={(newAkad) => {
            if (newAkad) {
              navigate({
                to: "/syariah/akad",
                search: { app: newAkad },
              });
            } else {
              navigate({
                to: "/syariah/akad",
                search: {},
              });
            }
          }}
        />
      </div>
    </AppShell>
  );
}
