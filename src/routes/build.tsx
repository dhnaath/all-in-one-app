import { createFileRoute, useRouter } from "@tanstack/react-router";
import { BuildView } from "@/features/finance/views/BuildView";
import { AppShell } from "@/app/app-shell";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/build")({
  validateSearch: (search: Record<string, unknown>): { tab?: string } => {
    return {
      tab: typeof search.tab === "string" ? search.tab : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Tahap Build — Client OS" },
      { name: "description", content: "Tahap 3: Build (Pembangunan)." },
    ],
  }),
  component: BuildPage,
});

const BUILD_TAB_INFO: Record<string, { title: string; subtitle: string }> = {
  cat_modal: { title: "Modal Manusia", subtitle: "Tahap 3: Build (Pembangunan)" },
  cat_jaringan: { title: "Jaringan", subtitle: "Tahap 3: Build (Pembangunan)" },
  cat_portofolio: { title: "Portofolio", subtitle: "Tahap 3: Build (Pembangunan)" },
  cat_kekayaan: { title: "Kekayaan Bersih", subtitle: "Tahap 3: Build (Pembangunan)" },
  cat_pembukuan: { title: "Pembukuan", subtitle: "Tahap 3: Build (Pembangunan)" },
};

function BuildPage() {
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

  const activeHeader = currentTab && BUILD_TAB_INFO[currentTab]
    ? BUILD_TAB_INFO[currentTab]
    : { title: "Tahap 3: Build", subtitle: "Pembangunan" };

  return (
    <AppShell title={activeHeader.title} subtitle={activeHeader.subtitle}>
      <div className="w-full -mt-8">
        <BuildView
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
