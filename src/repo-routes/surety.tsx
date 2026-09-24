import { createFileRoute, useRouter } from "@tanstack/react-router";
import { SuretyView } from "@/features/finance/views/SuretyView";
import { AppShell } from "@/app/app-shell";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/surety")({
  validateSearch: (search: Record<string, unknown>): { tab?: string } => {
    return {
      tab: typeof search.tab === "string" ? search.tab : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Tahap Surety — Client OS" },
      { name: "description", content: "Tahap 1: Surety (Kepastian)." },
    ],
  }),
  component: SuretyPage,
});

const SURETY_TAB_INFO: Record<string, { title: string; subtitle: string }> = {
  cat_kepatuhan: { title: "Kepatuhan Hukum", subtitle: "Tahap 1: Surety (Kepastian)" },
  cat_publik: { title: "Perlindungan Publik", subtitle: "Tahap 1: Surety (Kepastian)" },
  cat_asuransi: { title: "Asuransi Pribadi", subtitle: "Tahap 1: Surety (Kepastian)" },
  cat_dana: { title: "Kecukupan Dana", subtitle: "Tahap 1: Surety (Kepastian)" },
  cat_proteksi: { title: "Proteksi Aset", subtitle: "Tahap 1: Surety (Kepastian)" },
  legal: { title: "Legalitas & Kepatuhan", subtitle: "Kepatuhan Hukum" },
  general_ins: { title: "Jaminan Sosial & Publik", subtitle: "Perlindungan Publik" },
  claims: { title: "Riwayat Klaim", subtitle: "Perlindungan Publik" },
  insurance: { title: "Asuransi Kesehatan", subtitle: "Asuransi Pribadi" },
  ci: { title: "Penyakit Kritis", subtitle: "Asuransi Pribadi" },
  emergency_fund: { title: "Dana Darurat", subtitle: "Kecukupan Dana" },
  protection: { title: "Proteksi Aset Terpadu", subtitle: "Proteksi Aset" },
  security: { title: "Keamanan Akun", subtitle: "Proteksi Aset" },
};

function SuretyPage() {
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

  const activeHeader = currentTab && SURETY_TAB_INFO[currentTab]
    ? SURETY_TAB_INFO[currentTab]
    : { title: "Tahap 1: Surety", subtitle: "Kepastian" };

  return (
    <AppShell title={activeHeader.title} subtitle={activeHeader.subtitle}>
      <div className="w-full -mt-8">
        <SuretyView
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onBack={() => {
            if (currentTab) {
              if (currentTab.startsWith("cat_")) {
                if (search.tab) {
                  router.navigate({ to: "/" });
                } else {
                  setCurrentTab("");
                }
              } else {
                // child screen, back to its parent category
                if (currentTab === "legal") setCurrentTab("cat_kepatuhan");
                else if (currentTab === "general_ins" || currentTab === "claims") setCurrentTab("cat_publik");
                else if (currentTab === "insurance" || currentTab === "ci") setCurrentTab("cat_asuransi");
                else if (currentTab === "emergency_fund") setCurrentTab("cat_dana");
                else if (currentTab === "protection" || currentTab === "security") setCurrentTab("cat_proteksi");
                else setCurrentTab(search.tab || "");
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
