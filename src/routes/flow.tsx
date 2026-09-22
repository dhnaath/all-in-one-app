import { createFileRoute, useRouter } from "@tanstack/react-router";
import { FlowView } from "@/features/finance/views/FlowView";
import { AppShell } from "@/app/app-shell";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/flow")({
  validateSearch: (search: Record<string, unknown>): { tab?: string } => {
    return {
      tab: typeof search.tab === "string" ? search.tab : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Tahap Flow — Client OS" },
      { name: "description", content: "Tahap 2: Flow (Arus Kas)." },
    ],
  }),
  component: FlowPage,
});

const FLOW_TAB_INFO: Record<string, { title: string; subtitle: string }> = {
  cat_liabilitas: { title: "Beban Liabilitas", subtitle: "Tahap 2: Flow (Arus Kas)" },
  cat_pengeluaran: { title: "Pemasukan-Pengeluaran", subtitle: "Tahap 2: Flow (Arus Kas)" },
  cat_kredit: { title: "Kas-Kredit", subtitle: "Tahap 2: Flow (Arus Kas)" },
  cat_pajak: { title: "Retribusi-Kontribusi", subtitle: "Tahap 2: Flow (Arus Kas)" },
  cat_otomatisasi: { title: "Sistem Otomatisasi", subtitle: "Tahap 2: Flow (Arus Kas)" },
  liability: { title: "Manajemen Liabilitas & Utang", subtitle: "Beban Liabilitas" },
  monthly_burden: { title: "Estimasi Beban Bulanan", subtitle: "Beban Liabilitas" },
  emi_calculator: { title: "Kalkulator Cicilan (EMI)", subtitle: "Beban Liabilitas" },
  bill_reminders: { title: "Pengingat Tagihan", subtitle: "Beban Liabilitas" },
  cashflow: { title: "Arus Kas", subtitle: "Pemasukan-Pengeluaran" },
  budget: { title: "Anggaran & Langganan", subtitle: "Pemasukan-Pengeluaran" },
  expense_cat: { title: "Kategori Pengeluaran", subtitle: "Pemasukan-Pengeluaran" },
  liquidity: { title: "Likuiditas & Aset Lancar", subtitle: "Kas-Kredit" },
  bank_sync: { title: "Mutasi Rekening", subtitle: "Kas-Kredit" },
  tax: { title: "Perencanaan Pajak", subtitle: "Retribusi-Kontribusi" },
  emergency: { title: "Dana Darurat", subtitle: "Retribusi-Kontribusi" },
  savings: { title: "Tabungan Berkala", subtitle: "Sistem Otomatisasi" },
};

function FlowPage() {
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

  const activeHeader = currentTab && FLOW_TAB_INFO[currentTab]
    ? FLOW_TAB_INFO[currentTab]
    : { title: "Tahap 2: Flow", subtitle: "Arus Kas" };

  return (
    <AppShell title={activeHeader.title} subtitle={activeHeader.subtitle}>
      <div className="w-full -mt-8">
        <FlowView
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onNavigate={(view) => {
            router.navigate({ to: `/${view}` }).catch(() => {
              console.warn("View not found:", view);
            });
          }}
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
                if (
                  currentTab === "liability" ||
                  currentTab === "monthly_burden" ||
                  currentTab === "emi_calculator" ||
                  currentTab === "bill_reminders"
                ) {
                  setCurrentTab("cat_liabilitas");
                } else if (
                  currentTab === "cashflow" ||
                  currentTab === "budget" ||
                  currentTab === "expense_cat"
                ) {
                  setCurrentTab("cat_pengeluaran");
                } else if (currentTab === "liquidity" || currentTab === "bank_sync") {
                  setCurrentTab("cat_kredit");
                } else if (currentTab === "tax" || currentTab === "emergency") {
                  setCurrentTab("cat_pajak");
                } else if (currentTab === "savings") {
                  setCurrentTab("cat_otomatisasi");
                } else {
                  setCurrentTab(search.tab || "");
                }
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
