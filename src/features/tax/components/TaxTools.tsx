import React, { useState } from "react";
import { Calculator, TrendingUp, Briefcase, Save, Check, ShoppingCart } from "lucide-react";
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

export default function TaxTools() {
  const { user } = useAuth();
  const { save: savePPh21, status: statusPPh21 } = useSaveCalculation("pajak_pph21");
  const { save: saveSaham, status: statusSaham } = useSaveCalculation("pajak_saham");
  const { save: saveProperti, status: statusProperti } = useSaveCalculation("pajak_properti");
  const { save: savePpn, status: statusPpn } = useSaveCalculation("pajak_ppn");

  // Calculator states
  const [annualIncome, setAnnualIncome] = useState<number>(100000000);
  const [ptkpStatus, setPtkpStatus] = useState<number>(54000000);

  const [stockTransaction, setStockTransaction] = useState<number>(0);
  const [dividendIncome, setDividendIncome] = useState<number>(0);

  // Properti State
  const [propertyTransactionValue, setPropertyTransactionValue] = useState<number>(1000000000);
  const [npoptkp, setNpoptkp] = useState<number>(60000000);
  const [propertyRentValue, setPropertyRentValue] = useState<number>(100000000);

  // PPN State
  const [vatTransaction, setVatTransaction] = useState<number>(100000000);

  // Perhitungan PPh 21
  const calculatePPh21 = (income: number, ptkp: number) => {
    let pkp = income - ptkp;
    if (pkp <= 0) return { tax: 0, ptkp, pkp: 0 };

    let tax = 0;
    if (pkp > 0) {
      const tier1 = Math.min(pkp, 60000000);
      tax += tier1 * 0.05;
      pkp -= tier1;
    }
    if (pkp > 0) {
      const tier2 = Math.min(pkp, 190000000);
      tax += tier2 * 0.15;
      pkp -= tier2;
    }
    if (pkp > 0) {
      const tier3 = Math.min(pkp, 250000000);
      tax += tier3 * 0.25;
      pkp -= tier3;
    }
    if (pkp > 0) {
      const tier4 = Math.min(pkp, 4500000000);
      tax += tier4 * 0.3;
      pkp -= tier4;
    }
    if (pkp > 0) {
      tax += pkp * 0.35;
    }
    return { tax, ptkp, pkp: income - ptkp };
  };

  const incomeTaxResult = calculatePPh21(annualIncome, ptkpStatus);
  const stockTaxResult = stockTransaction * 0.001;
  const dividendTaxResult = dividendIncome * 0.1;

  const pphPenjualanProperti = propertyTransactionValue * 0.025;
  const bphtbProperti = Math.max(0, propertyTransactionValue - npoptkp) * 0.05;
  const pphSewaProperti = propertyRentValue * 0.1;

  const ppnResult = vatTransaction * 0.11;

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
      {/* PPh 21 */}
      <SectionCard
        title="Pajak Personal"
        subtitle="Pajak Penghasilan (PPh 21)"
        icon={Calculator}
        resultBlock={
          <div className="space-y-8 h-full flex flex-col justify-center">
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="space-y-3 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Penghasilan</span>
                  <span className="font-medium text-foreground">{formatIDR(annualIncome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PTKP Dasar</span>
                  <span className="font-medium text-foreground">
                    {formatIDR(incomeTaxResult.ptkp)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Penghasilan Kena Pajak (PKP)</span>
                  <span className="font-medium text-foreground">
                    {formatIDR(Math.max(0, incomeTaxResult.pkp))}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                  Total PPh 21 Setahun
                </span>
                <div className="text-3xl font-bold tracking-tight text-foreground mb-1">
                  {formatIDR(incomeTaxResult.tax)}
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Estimasi berdasar tarif progresif
                </span>
              </div>
            </div>
            {user && annualIncome > 0 && (
              <SaveButton
                status={statusPPh21}
                onClick={() =>
                  savePPh21(
                    `PPh 21 — ${formatIDR(incomeTaxResult.tax)}`,
                    { annualIncome },
                    { tax: incomeTaxResult.tax },
                  )
                }
              />
            )}
          </div>
        }
      >
        <div className="space-y-6 max-w-xl">
          <InputField
            label="Penghasilan Bruto Setahun"
            value={annualIncome}
            onChange={setAnnualIncome}
            prefix="Rp"
          />
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground/80">Status PTKP</label>
            <div className="relative flex items-center">
              <select
                value={ptkpStatus}
                onChange={(e) => setPtkpStatus(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value={54000000}>TK/0 (Rp 54 Juta)</option>
                <option value={58500000}>TK/1 atau K/0 (Rp 58,5 Juta)</option>
                <option value={63000000}>TK/2 atau K/1 (Rp 63 Juta)</option>
                <option value={67500000}>TK/3 atau K/2 (Rp 67,5 Juta)</option>
                <option value={72000000}>K/3 (Rp 72 Juta)</option>
              </select>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Pajak Saham & Dividen */}
      <SectionCard title="Pajak Personal" subtitle="PPh Saham & Dividen" icon={TrendingUp}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl">
          <div className="p-5 sm:p-6 bg-secondary/30 border border-border rounded-xl space-y-6 flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <h3 className="text-sm font-semibold text-foreground">Penjualan Saham (0.1%)</h3>
            </div>
            <div className="space-y-4 flex-1">
              <InputField
                label="Total Nilai Transaksi Jual"
                value={stockTransaction}
                onChange={setStockTransaction}
                prefix="Rp"
              />
            </div>
            <div className="pt-5 border-t border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                PPh Final Saham
              </span>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {formatIDR(stockTaxResult)}
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-secondary/30 border border-border rounded-xl space-y-6 flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <h3 className="text-sm font-semibold text-foreground">Pendapatan Dividen (10%)</h3>
            </div>
            <div className="space-y-4 flex-1">
              <InputField
                label="Total Pendapatan Dividen"
                value={dividendIncome}
                onChange={setDividendIncome}
                prefix="Rp"
              />
            </div>
            <div className="pt-5 border-t border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                PPh Final Dividen
              </span>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {formatIDR(dividendTaxResult)}
              </div>
            </div>
          </div>
        </div>

        {user && (stockTaxResult > 0 || dividendTaxResult > 0) && (
          <div className="mt-8 pt-6 border-t border-border flex justify-end">
            <div className="w-full sm:w-auto">
              <SaveButton
                status={statusSaham}
                label="Simpan Hasil PPh Final"
                onClick={() =>
                  saveSaham(
                    `Pajak Saham — ${formatIDR(stockTaxResult + dividendTaxResult)}`,
                    { stockTransaction, dividendIncome },
                    { stockTaxResult, dividendTaxResult },
                  )
                }
              />
            </div>
          </div>
        )}
      </SectionCard>

      {/* Pajak Properti */}
      <SectionCard
        title="Pajak Bisnis"
        subtitle="Pajak Properti"
        icon={Briefcase}
        resultBlock={
          <div className="space-y-8 h-full flex flex-col justify-center">
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="space-y-3 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PPh Final Penjual (2.5%)</span>
                  <span className="font-medium text-foreground">
                    {formatIDR(pphPenjualanProperti)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">BPHTB Pembeli (5%)</span>
                  <span className="font-medium text-foreground">{formatIDR(bphtbProperti)}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-border/50">
                  <span className="text-muted-foreground">PPh Final Sewa (10%)</span>
                  <span className="font-medium text-foreground">{formatIDR(pphSewaProperti)}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                  Total Pajak Properti
                </span>
                <div className="text-3xl font-bold tracking-tight text-foreground mb-1">
                  {formatIDR(pphPenjualanProperti + bphtbProperti + pphSewaProperti)}
                </div>
              </div>
            </div>
            {user && (pphPenjualanProperti > 0 || bphtbProperti > 0 || pphSewaProperti > 0) && (
              <SaveButton
                status={statusProperti}
                onClick={() =>
                  saveProperti(
                    `Pajak Properti — ${formatIDR(pphPenjualanProperti + bphtbProperti + pphSewaProperti)}`,
                    { propertyTransactionValue, npoptkp, propertyRentValue },
                    { pphPenjualanProperti, bphtbProperti, pphSewaProperti },
                  )
                }
              />
            )}
          </div>
        }
      >
        <div className="space-y-6 max-w-xl">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Jual Beli Properti
          </h3>
          <InputField
            label="Nilai Transaksi (Harga Jual)"
            value={propertyTransactionValue}
            onChange={setPropertyTransactionValue}
            prefix="Rp"
          />
          <InputField
            label="NPOPTKP (Tergantung Daerah)"
            value={npoptkp}
            onChange={setNpoptkp}
            prefix="Rp"
          />

          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2 mt-8">
            Sewa Properti
          </h3>
          <InputField
            label="Nilai Sewa Keseluruhan"
            value={propertyRentValue}
            onChange={setPropertyRentValue}
            prefix="Rp"
          />
        </div>
      </SectionCard>

      {/* PPN */}
      <SectionCard
        title="Pajak Bisnis"
        subtitle="PPN (Pajak Pertambahan Nilai)"
        icon={ShoppingCart}
        resultBlock={
          <div className="space-y-8 h-full flex flex-col justify-center">
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="space-y-2 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nilai Transaksi (DPP)</span>
                  <span className="font-medium text-foreground">{formatIDR(vatTransaction)}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                  Nilai PPN (11%)
                </span>
                <div className="text-3xl font-bold tracking-tight text-foreground mb-1">
                  {formatIDR(ppnResult)}
                </div>
                <span className="text-xs font-medium text-muted-foreground mt-2 block">
                  Total Tagihan:{" "}
                  <strong className="text-foreground">
                    {formatIDR(vatTransaction + ppnResult)}
                  </strong>
                </span>
              </div>
            </div>
            {user && vatTransaction > 0 && (
              <SaveButton
                status={statusPpn}
                onClick={() =>
                  savePpn(
                    `PPN 11% — ${formatIDR(ppnResult)}`,
                    { vatTransaction },
                    { ppnResult, total: vatTransaction + ppnResult },
                  )
                }
              />
            )}
          </div>
        }
      >
        <div className="space-y-6 max-w-xl">
          <InputField
            label="Dasar Pengenaan Pajak (DPP)"
            value={vatTransaction}
            onChange={setVatTransaction}
            prefix="Rp"
          />
        </div>
      </SectionCard>
    </div>
  );
}
