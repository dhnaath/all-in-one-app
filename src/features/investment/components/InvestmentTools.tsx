import React, { useState } from "react";
import { TrendingUp, Calculator, PieChart, Save, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../syariah/lib/AuthContext";
import { useSaveCalculation } from "../../syariah/lib/useSaveCalculation";

const InputField = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  type = "number",
  max,
  min = "0",
}: any) => (
  <div className="space-y-2">
    <label className="text-xs font-medium text-foreground/80">{label}</label>
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-sm font-medium text-muted-foreground">{prefix}</span>
      )}
      <input
        type={type}
        min={min}
        max={max}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
          prefix && "pl-10",
          suffix && "pr-10",
        )}
      />
      {suffix && (
        <span className="absolute right-3 text-sm font-medium text-muted-foreground">{suffix}</span>
      )}
    </div>
  </div>
);

const SectionCard = ({ title, subtitle, icon: Icon, children, resultBlock }: any) => (
  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl">
    <div className="flex-1 max-w-2xl flex flex-col">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Icon size={18} strokeWidth={2.5} />
            <span className="text-xs font-bold tracking-widest uppercase">{title}</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{subtitle}</h2>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
    {resultBlock && (
      <div className="w-full lg:w-[400px] bg-secondary/30 rounded-xl border border-border p-6 sm:p-8 flex flex-col justify-center shadow-sm">
        {resultBlock}
      </div>
    )}
  </div>
);

const SaveButton = ({ onClick, status, disabled, label = "Simpan Hasil" }: any) => (
  <button
    onClick={onClick}
    disabled={disabled || status !== "idle"}
    className={cn(
      "w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2",
      "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm",
    )}
  >
    {status === "idle" && (
      <>
        <Save className="w-4 h-4" /> {label}
      </>
    )}
    {status === "saving" && "Menyimpan..."}
    {status === "saved" && (
      <>
        <Check className="w-4 h-4" /> Tersimpan
      </>
    )}
  </button>
);

export default function InvestmentTools() {
  const { user } = useAuth();
  const { save: saveCompound, status: statusCompound } =
    useSaveCalculation("investasi_bunga_majemuk");
  const { save: saveRoi, status: statusRoi } = useSaveCalculation("investasi_roi");

  // Calculator states
  const [compoundState, setCompoundState] = useState({
    principal: 10000000,
    monthlyContribution: 1000000,
    years: 10,
    annualReturn: 8,
  });

  const [roiState, setRoiState] = useState({
    initialInvestment: 50000000,
    finalValue: 65000000,
    investmentDuration: 2,
  });

  const calculateCompoundInterest = () => {
    let total = compoundState.principal;
    let totalInvested = compoundState.principal;
    const monthlyRate = compoundState.annualReturn / 100 / 12;
    const totalMonths = compoundState.years * 12;

    for (let i = 0; i < totalMonths; i++) {
      total = total * (1 + monthlyRate) + compoundState.monthlyContribution;
      totalInvested += compoundState.monthlyContribution;
    }

    return { total, totalInvested, interestEarned: total - totalInvested };
  };

  const calculateROI = () => {
    const profit = roiState.finalValue - roiState.initialInvestment;
    const roi = (profit / roiState.initialInvestment) * 100;
    const annualizedROI =
      (Math.pow(roiState.finalValue / roiState.initialInvestment, 1 / roiState.investmentDuration) -
        1) *
      100;

    return { profit, roi, annualizedROI };
  };

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const compoundResult = calculateCompoundInterest();
  const roiResult = calculateROI();

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
      {/* Bunga Majemuk */}
      <SectionCard
        title="Kalkulator Utama"
        subtitle="Bunga Majemuk"
        icon={TrendingUp}
        resultBlock={
          <div className="space-y-8 h-full flex flex-col justify-center">
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="space-y-3 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Modal Disetor</span>
                  <span className="font-medium text-foreground">
                    {formatIDR(compoundResult.totalInvested)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Proyeksi Bunga Didapat</span>
                  <span className="font-medium text-emerald-500">
                    +{formatIDR(compoundResult.interestEarned)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 text-primary">
                  Proyeksi Total Nilai Investasi
                </span>
                <div className="text-3xl font-bold tracking-tight text-foreground mb-1">
                  {formatIDR(compoundResult.total)}
                </div>
              </div>
            </div>
            {user && compoundResult.total > 0 && (
              <SaveButton
                status={statusCompound}
                onClick={() =>
                  saveCompound(
                    `Bunga Majemuk — ${formatIDR(compoundResult.total)}`,
                    compoundState,
                    compoundResult,
                  )
                }
              />
            )}
          </div>
        }
      >
        <div className="space-y-6 max-w-xl">
          <InputField
            label="Modal Awal"
            value={compoundState.principal}
            onChange={(v: number) => setCompoundState({ ...compoundState, principal: v })}
            prefix="Rp"
          />
          <InputField
            label="Investasi Bulanan"
            value={compoundState.monthlyContribution}
            onChange={(v: number) => setCompoundState({ ...compoundState, monthlyContribution: v })}
            prefix="Rp"
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Jangka Waktu"
              value={compoundState.years}
              onChange={(v: number) => setCompoundState({ ...compoundState, years: v })}
              suffix="Tahun"
            />
            <InputField
              label="Estimasi Return"
              value={compoundState.annualReturn}
              onChange={(v: number) => setCompoundState({ ...compoundState, annualReturn: v })}
              suffix="% / Tahun"
            />
          </div>
        </div>
      </SectionCard>

      {/* ROI */}
      <SectionCard
        title="Kalkulator Tambahan"
        subtitle="Return on Investment (ROI)"
        icon={Calculator}
        resultBlock={
          <div className="space-y-8 h-full flex flex-col justify-center">
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="space-y-3 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total ROI</span>
                  <span
                    className={cn(
                      "font-medium",
                      roiResult.roi >= 0 ? "text-emerald-500" : "text-rose-500",
                    )}
                  >
                    {roiResult.roi >= 0 ? "+" : ""}
                    {roiResult.roi.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Annualized ROI</span>
                  <span
                    className={cn(
                      "font-medium",
                      roiResult.annualizedROI >= 0 ? "text-emerald-500" : "text-rose-500",
                    )}
                  >
                    {roiResult.annualizedROI >= 0 ? "+" : ""}
                    {roiResult.annualizedROI.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest block mb-2",
                    roiResult.profit >= 0 ? "text-emerald-500" : "text-rose-500",
                  )}
                >
                  {roiResult.profit >= 0 ? "Total Keuntungan" : "Total Kerugian"}
                </span>
                <div className="text-3xl font-bold tracking-tight text-foreground mb-1">
                  {roiResult.profit >= 0 ? "+" : ""}
                  {formatIDR(roiResult.profit)}
                </div>
              </div>
            </div>
            {user && (
              <SaveButton
                status={statusRoi}
                onClick={() => saveRoi(`ROI — ${roiResult.roi.toFixed(2)}%`, roiState, roiResult)}
              />
            )}
          </div>
        }
      >
        <div className="space-y-6 max-w-xl">
          <InputField
            label="Modal Awal Investasi"
            value={roiState.initialInvestment}
            onChange={(v: number) => setRoiState({ ...roiState, initialInvestment: v })}
            prefix="Rp"
          />
          <InputField
            label="Nilai Akhir Investasi"
            value={roiState.finalValue}
            onChange={(v: number) => setRoiState({ ...roiState, finalValue: v })}
            prefix="Rp"
          />
          <InputField
            label="Durasi Investasi"
            value={roiState.investmentDuration}
            onChange={(v: number) => setRoiState({ ...roiState, investmentDuration: v })}
            suffix="Tahun"
          />
        </div>
      </SectionCard>
    </div>
  );
}
