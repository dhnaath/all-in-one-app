import { createFileRoute, useRouter } from "@tanstack/react-router";
import { LegacyView } from "@/features/finance/views/LegacyView";
import { AppShell } from "@/app/app-shell";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/legacy")({
  validateSearch: (search: Record<string, unknown>): { tab?: string } => {
    return {
      tab: typeof search.tab === "string" ? search.tab : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Tahap Legacy — Client OS" },
      { name: "description", content: "Tahap 5: Legacy (Warisan)." },
    ],
  }),
  component: LegacyPage,
});

const LEGACY_TAB_INFO: Record<string, { title: string; subtitle: string }> = {
  cat_pembelajaran: { title: "Pembelajaran Seumur Hidup", subtitle: "Tahap 5: Legacy (Warisan)" },
  cat_tatakelola: { title: "Tata Kelola yang Baik", subtitle: "Tahap 5: Legacy (Warisan)" },
  cat_amal: { title: "Kontribusi Amal", subtitle: "Tahap 5: Legacy (Warisan)" },
  cat_likuidasi: { title: "Likuidasi Kewajiban", subtitle: "Tahap 5: Legacy (Warisan)" },
  cat_transfer: { title: "Transfer Kekayaan", subtitle: "Tahap 5: Legacy (Warisan)" },
};

function LegacyPage() {
  const search = Route.useSearch();
  const [currentTab, setCurrentTab] = useState(search.tab || "");
  const router = useRouter();

  useEffect(() => {
    if (search.tab) {
      setCurrentTab(search.tab);
    } else {
      setCurrentTab("");
    }
  }, [search.tab]);

  const activeHeader = currentTab && LEGACY_TAB_INFO[currentTab]
    ? LEGACY_TAB_INFO[currentTab]
    : { title: "Tahap 5: Legacy", subtitle: "Warisan" };

  return (
    <AppShell title={activeHeader.title} subtitle={activeHeader.subtitle}>
      <div className="w-full -mt-8">
        <LegacyView
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onBack={() => {
            if (currentTab) {
              if (search.tab) {
                router.navigate({ to: "/" });
              } else {
                setCurrentTab("");
              }
            } else {
              router.navigate({ to: "/" });
            }
          }}
        />
      </div>
    </AppShell>
  );
}
