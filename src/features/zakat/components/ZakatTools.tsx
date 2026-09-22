import React, { useState } from "react";
import { Calculator, TrendingUp, Briefcase, Save, Check, Scale, Users, Coins } from "lucide-react";
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

export default function ZakatTools() {
  const { user } = useAuth();
  const { save: saveMaal, status: statusMaal } = useSaveCalculation("zakat_maal");
  const { save: savePenghasilan, status: statusPenghasilan } =
    useSaveCalculation("zakat_penghasilan");
  const { save: saveFitrah, status: statusFitrah } = useSaveCalculation("zakat_fitrah");

  const [goldPrice, setGoldPrice] = useState<number>(1450000); // 1.45jt / gr
  const nisabGold85 = 85 * goldPrice; // Nisab Maal/Penghasilan (85 gram emas)

  // Zakat Maal States
  const [cash, setCash] = useState<number>(0);
  const [goldWeight, setGoldWeight] = useState<number>(0);

  // Zakat Penghasilan States
  const [monthlyIncome, setMonthlyIncome] = useState<number>(10000000);
  const [otherIncome, setOtherIncome] = useState<number>(0);

  // Zakat Fitrah States
  const [familyMembers, setFamilyMembers] = useState<number>(1);
  const [ricePricePerKg, setRicePricePerKg] = useState<number>(15000);

  // Calculations
  // Maal
  const goldValue = goldWeight * goldPrice;
  const totalAssets = cash + goldValue;
  const isMaalEligible = totalAssets >= nisabGold85;
  const zakatMaal = isMaalEligible ? totalAssets * 0.025 : 0;

  // Penghasilan
  const totalMonthlyIncome = monthlyIncome + otherIncome;
  const totalYearlyIncome = totalMonthlyIncome * 12;
  const isPenghasilanEligible = totalYearlyIncome >= nisabGold85;
  const zakatPenghasilanBulanan = isPenghasilanEligible ? totalMonthlyIncome * 0.025 : 0;
  const zakatPenghasilanTahunan = isPenghasilanEligible ? totalYearlyIncome * 0.025 : 0;

  // Fitrah
  const zakatWeightPerPerson = 2.5;
  const totalWeightFitrah = familyMembers * zakatWeightPerPerson;
  const totalCashFitrah = totalWeightFitrah * ricePricePerKg;

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
      {/* Pengaturan Harga Emas (Nisab) */}
      <div className="max-w-2xl bg-orange-50/50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div>
          <h3 className="font-semibold text-orange-800 dark:text-orange-400">
            Harga Emas Saat Ini
          </h3>
          <p className="text-sm text-orange-700/80 dark:text-orange-400/80 mt-1">
            Sebagai acuan perhitungan Nisab (Batas Minimal Zakat: 85 Gram Emas)
          </p>
        </div>
        <div className="w-full sm:w-48 shrink-0">
          <InputField label="" value={goldPrice} onChange={setGoldPrice} prefix="Rp" />
        </div>
      </div>

      {/* Zakat Penghasilan */}
      <SectionCard
        title="Zakat Profesi"
        subtitle="Zakat Penghasilan"
        icon={Briefcase}
        resultBlock={
          <div className="space-y-8 h-full flex flex-col justify-center">
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="space-y-3 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Penghasilan / Bulan</span>
                  <span className="font-medium text-foreground">
                    {formatIDR(totalMonthlyIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Penghasilan Setahun</span>
                  <span className="font-medium text-foreground">
                    {formatIDR(totalYearlyIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-border/50">
                  <span className="text-muted-foreground">Batas Nisab (85 Gr Emas)</span>
                  <span className="font-medium text-foreground">{formatIDR(nisabGold85)}</span>
                </div>
              </div>

              <div>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest block mb-2",
                    isPenghasilanEligible ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {isPenghasilanEligible
                    ? "WAJIB ZAKAT (2.5%)"
                    : "BELUM WAJIB ZAKAT (Di bawah nisab)"}
                </span>
                <div className="text-3xl font-bold tracking-tight text-foreground mb-1">
                  {formatIDR(zakatPenghasilanBulanan)}
                </div>
                <span className="text-xs font-medium text-muted-foreground mt-2 block">
                  Atau <strong>{formatIDR(zakatPenghasilanTahunan)}</strong> dibayarkan per tahun
                </span>
              </div>
            </div>
            {user && isPenghasilanEligible && (
              <SaveButton
                status={statusPenghasilan}
                onClick={() =>
                  savePenghasilan(
                    `Zakat Penghasilan — ${formatIDR(zakatPenghasilanBulanan)}/bln`,
                    { monthlyIncome, otherIncome },
                    { zakatPenghasilanBulanan, zakatPenghasilanTahunan },
                  )
                }
              />
            )}
          </div>
        }
      >
        <div className="space-y-6 max-w-xl">
          <InputField
            label="Penghasilan Bulanan Tetap"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            prefix="Rp"
          />
          <InputField
            label="Penghasilan Tambahan (Bonus, dll)"
            value={otherIncome}
            onChange={setOtherIncome}
            prefix="Rp"
          />
        </div>
      </SectionCard>

      {/* Zakat Maal */}
      <SectionCard
        title="Zakat Harta"
        subtitle="Zakat Maal (Simpanan)"
        icon={Scale}
        resultBlock={
          <div className="space-y-8 h-full flex flex-col justify-center">
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="space-y-3 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uang Tunai / Tabungan</span>
                  <span className="font-medium text-foreground">{formatIDR(cash)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nilai Emas Tersimpan</span>
                  <span className="font-medium text-foreground">{formatIDR(goldValue)}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-border/50">
                  <span className="text-muted-foreground">Total Nilai Harta</span>
                  <span className="font-medium text-foreground">{formatIDR(totalAssets)}</span>
                </div>
              </div>

              <div>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest block mb-2",
                    isMaalEligible ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {isMaalEligible ? "WAJIB ZAKAT (2.5%)" : "BELUM WAJIB ZAKAT (Di bawah nisab)"}
                </span>
                <div className="text-3xl font-bold tracking-tight text-foreground mb-1">
                  {formatIDR(zakatMaal)}
                </div>
              </div>
            </div>
            {user && isMaalEligible && (
              <SaveButton
                status={statusMaal}
                onClick={() =>
                  saveMaal(
                    `Zakat Maal — ${formatIDR(zakatMaal)}`,
                    { cash, goldWeight, goldPrice },
                    { totalAssets, zakatMaal },
                  )
                }
              />
            )}
          </div>
        }
      >
        <div className="space-y-6 max-w-xl">
          <InputField
            label="Uang Tunai, Tabungan & Deposito"
            value={cash}
            onChange={setCash}
            prefix="Rp"
          />
          <InputField
            label="Berat Emas Simpanan"
            value={goldWeight}
            onChange={setGoldWeight}
            suffix="Gram"
          />
        </div>
      </SectionCard>

      {/* Zakat Fitrah */}
      <SectionCard
        title="Zakat Jiwa"
        subtitle="Zakat Fitrah"
        icon={Users}
        resultBlock={
          <div className="space-y-8 h-full flex flex-col justify-center">
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="space-y-3 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Ketentuan Berat Zakat (2.5 Kg / Jiwa)
                  </span>
                  <span className="font-medium text-foreground">{totalWeightFitrah} Kg</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">
                  Total Dibayarkan (Uang)
                </span>
                <div className="text-3xl font-bold tracking-tight text-foreground mb-1">
                  {formatIDR(totalCashFitrah)}
                </div>
              </div>
            </div>
            {user && familyMembers > 0 && (
              <SaveButton
                status={statusFitrah}
                onClick={() =>
                  saveFitrah(
                    `Zakat Fitrah — ${formatIDR(totalCashFitrah)}`,
                    { familyMembers, ricePricePerKg },
                    { totalWeightFitrah, totalCashFitrah },
                  )
                }
              />
            )}
          </div>
        }
      >
        <div className="space-y-6 max-w-xl">
          <InputField
            label="Jumlah Tanggungan (Anggota Keluarga)"
            value={familyMembers}
            onChange={setFamilyMembers}
            suffix="Jiwa"
          />
          <InputField
            label="Harga Beras / Makanan Pokok per Kg"
            value={ricePricePerKg}
            onChange={setRicePricePerKg}
            prefix="Rp"
          />
        </div>
      </SectionCard>
    </div>
  );
}
