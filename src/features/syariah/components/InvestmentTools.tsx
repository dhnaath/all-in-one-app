import React, { useState } from "react";
import { TrendingUp, LineChart, Target, Calculator, Save, Check } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../lib/AuthContext";
import { useSaveCalculation } from "../lib/useSaveCalculation";

export default function InvestmentTools() {
  const { user } = useAuth();
  const { save: saveCompound, status: statusCompound } =
    useSaveCalculation("investasi_bunga_majemuk");
  const { save: saveRoi, status: statusRoi } = useSaveCalculation("investasi_roi");

  const [activeTab, setActiveTab] = useState<"compound" | "roi">("compound");

  // Compound Interest State
  const [principal, setPrincipal] = useState<number>(10000000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1000000);
  const [years, setYears] = useState<number>(10);
  const [annualReturn, setAnnualReturn] = useState<number>(8);

  // ROI State
  const [initialInvestment, setInitialInvestment] = useState<number>(50000000);
  const [finalValue, setFinalValue] = useState<number>(65000000);
  const [investmentDuration, setInvestmentDuration] = useState<number>(2);

  const calculateCompoundInterest = () => {
    let total = principal;
    let totalInvested = principal;
    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = years * 12;

    for (let i = 0; i < totalMonths; i++) {
      total = total * (1 + monthlyRate) + monthlyContribution;
      totalInvested += monthlyContribution;
    }

    return { total, totalInvested, interestEarned: total - totalInvested };
  };

  const compoundResult = calculateCompoundInterest();

  const calculateROI = () => {
    const profit = finalValue - initialInvestment;
    const roi = (profit / initialInvestment) * 100;
    const annualizedROI =
      (Math.pow(finalValue / initialInvestment, 1 / (investmentDuration || 1)) - 1) * 100;

    return { profit, roi, annualizedROI };
  };

  const roiResult = calculateROI();

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab("compound")}
          className={cn(
            "px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors border border-border/40 flex items-center gap-2",
            activeTab === "compound"
              ? "bg-secondary/50 text-white"
              : "bg-transparent text-foreground hover:bg-secondary",
          )}
        >
          <TrendingUp className="w-4 h-4" />
          Bunga Majemuk
        </button>
        <button
          onClick={() => setActiveTab("roi")}
          className={cn(
            "px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors border border-border/40 flex items-center gap-2",
            activeTab === "roi"
              ? "bg-secondary/50 text-white"
              : "bg-transparent text-foreground hover:bg-secondary",
          )}
        >
          <Target className="w-4 h-4" />
          Return on Investment
        </button>
      </div>

      {activeTab === "compound" && (
        <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-border/40 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="w-5 h-5 text-foreground" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                  Simulasi Investasi
                </span>
              </div>
              <h2 className="text-3xl font-semibold text-foreground">Kalkulator Bunga Majemuk</h2>
            </div>
            <div className="text-sm font-medium opacity-60 text-right">
              Proyeksi Pertumbuhan Portofolio
              <br />
              (Compound Interest)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-foreground mb-3">
                  Modal Awal
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={principal || ""}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full bg-card border border-border/40/30 px-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-card focus:border-border/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-foreground mb-3">
                  Investasi Rutin (Bulanan)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={monthlyContribution || ""}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full bg-card border border-border/40/30 px-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-card focus:border-border/40 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-foreground mb-3">
                    Target Waktu (Tahun)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={years || ""}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full bg-card border border-border/40/30 pl-4 pr-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-card focus:border-border/40 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">
                      Thn
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-foreground mb-3">
                    Asumsi Return (Tahunan)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={annualReturn || ""}
                      onChange={(e) => setAnnualReturn(Number(e.target.value))}
                      className="w-full bg-card border border-border/40/30 pl-4 pr-8 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-card focus:border-border/40 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 text-white p-8 flex flex-col justify-center relative overflow-hidden">
              <TrendingUp className="absolute -bottom-8 -right-8 w-48 h-48 opacity-5 text-white pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="space-y-2 text-sm opacity-80 pb-4 border-b border-white/10">
                  <div className="flex justify-between">
                    <span>Total Modal Disetor</span>
                    <span>{formatIDR(compoundResult.totalInvested)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Proyeksi Imbal Hasil</span>
                    <span className="text-green-400">
                      +{formatIDR(compoundResult.interestEarned)}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 block mb-2">
                    Estimasi Nilai Akhir
                  </span>
                  <div className="text-3xl sm:text-4xl font-semibold mb-2 text-white">
                    {formatIDR(compoundResult.total)}
                  </div>
                  <span className="text-xs font-medium opacity-60 block">
                    Setelah {years} tahun dengan return {annualReturn}% per tahun
                  </span>

                  {user && compoundResult.total > 0 && (
                    <button
                      onClick={() =>
                        saveCompound(
                          `Bunga Majemuk — ${formatIDR(compoundResult.total)}`,
                          { principal, monthlyContribution, years, annualReturn },
                          {
                            total: compoundResult.total,
                            totalInvested: compoundResult.totalInvested,
                            interestEarned: compoundResult.interestEarned,
                          },
                        )
                      }
                      disabled={statusCompound !== "idle"}
                      className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-card/10 hover:bg-card/20 text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-colors disabled:opacity-50 border border-white/20"
                    >
                      {statusCompound === "idle" && (
                        <>
                          <Save className="w-4 h-4" /> Simpan Hasil
                        </>
                      )}
                      {statusCompound === "saving" && "Menyimpan..."}
                      {statusCompound === "saved" && (
                        <>
                          <Check className="w-4 h-4" /> Tersimpan
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "roi" && (
        <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-border/40 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-foreground" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                  Evaluasi Kinerja
                </span>
              </div>
              <h2 className="text-3xl font-semibold text-foreground">Return on Investment (ROI)</h2>
            </div>
            <div className="text-sm font-medium opacity-60 text-right">
              Tingkat Pengembalian Modal
              <br />
              (Total & Disetahunkan)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-foreground mb-3">
                  Nilai Investasi Awal
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={initialInvestment || ""}
                    onChange={(e) => setInitialInvestment(Number(e.target.value))}
                    className="w-full bg-card border border-border/40/30 px-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-card focus:border-border/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-foreground mb-3">
                  Nilai Investasi Akhir (Saat Ini)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={finalValue || ""}
                    onChange={(e) => setFinalValue(Number(e.target.value))}
                    className="w-full bg-card border border-border/40/30 px-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-card focus:border-border/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-foreground mb-3">
                  Durasi Investasi (Tahun)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={investmentDuration || ""}
                    onChange={(e) => setInvestmentDuration(Number(e.target.value))}
                    className="w-full bg-card border border-border/40/30 pl-4 pr-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-card focus:border-border/40 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">
                    Thn
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 text-white p-8 flex flex-col justify-center relative overflow-hidden">
              <Calculator className="absolute -bottom-8 -right-8 w-48 h-48 opacity-5 text-white pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="space-y-4 pb-6 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 block mb-1">
                      Total Keuntungan / Kerugian
                    </span>
                    <div
                      className={cn(
                        "text-xl sm:text-2xl font-semibold font-bold",
                        roiResult.profit >= 0 ? "text-green-400" : "text-red-400",
                      )}
                    >
                      {roiResult.profit >= 0 ? "+" : ""}
                      {formatIDR(roiResult.profit)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 block mb-2">
                      Total ROI
                    </span>
                    <div
                      className={cn(
                        "text-3xl sm:text-4xl font-semibold mb-1",
                        roiResult.roi >= 0 ? "text-white" : "text-red-400",
                      )}
                    >
                      {roiResult.roi >= 0 ? "+" : ""}
                      {roiResult.roi.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 block mb-2">
                      Annualized ROI
                    </span>
                    <div
                      className={cn(
                        "text-3xl sm:text-4xl font-semibold mb-1",
                        roiResult.annualizedROI >= 0 ? "text-white" : "text-red-400",
                      )}
                    >
                      {roiResult.annualizedROI >= 0 ? "+" : ""}
                      {roiResult.annualizedROI.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {user && (
                  <button
                    onClick={() =>
                      saveRoi(
                        `ROI — ${roiResult.roi.toFixed(2)}%`,
                        { initialInvestment, finalValue, investmentDuration },
                        {
                          profit: roiResult.profit,
                          roi: roiResult.roi,
                          annualizedROI: roiResult.annualizedROI,
                        },
                      )
                    }
                    disabled={statusRoi !== "idle"}
                    className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-card/10 hover:bg-card/20 text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-colors disabled:opacity-50 border border-white/20"
                  >
                    {statusRoi === "idle" && (
                      <>
                        <Save className="w-4 h-4" /> Simpan Hasil
                      </>
                    )}
                    {statusRoi === "saving" && "Menyimpan..."}
                    {statusRoi === "saved" && (
                      <>
                        <Check className="w-4 h-4" /> Tersimpan
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
