import { createFileRoute, useRouter } from "@tanstack/react-router";
import { GrowView } from "@/features/finance/views/GrowView";
import { AppShell } from "@/app/app-shell";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/grow")({
  validateSearch: (search: Record<string, unknown>): { tab?: string } => {
    return {
      tab: typeof search.tab === "string" ? search.tab : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Tahap Grow — Client OS" },
      { name: "description", content: "Tahap 4: Grow (Pertumbuhan)." },
    ],
  }),
  component: GrowPage,
});

const GROW_TAB_INFO: Record<string, { title: string; subtitle: string }> = {
  cat_profil: { title: "Profil Risiko", subtitle: "Tahap 4: Grow (Pertumbuhan)" },
  cat_alokasi: { title: "Alokasi", subtitle: "Tahap 4: Grow (Pertumbuhan)" },
  cat_efektif: { title: "Efektif-Efisien", subtitle: "Tahap 4: Grow (Pertumbuhan)" },
  cat_bunga: { title: "Bunga Berbunga", subtitle: "Tahap 4: Grow (Pertumbuhan)" },
  cat_rebalance: { title: "Rebalancing Periodik", subtitle: "Tahap 4: Grow (Pertumbuhan)" },
};

function GrowPage() {
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

  const activeHeader = currentTab && GROW_TAB_INFO[currentTab]
    ? GROW_TAB_INFO[currentTab]
    : { title: "Tahap 4: Grow", subtitle: "Pertumbuhan" };

  return (
    <AppShell title={activeHeader.title} subtitle={activeHeader.subtitle}>
      <div className="w-full -mt-8">
        <GrowView
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
