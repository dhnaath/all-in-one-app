import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ChevronRight,
  Layers,
} from "lucide-react";

export function NetWorthPulseCard() {
  const [data, setData] = useState({
    totalAssets: 485000000,
    totalLiabilities: 85000000,
    monthlyEarning: 42000000,
    monthlyExpense: 17500000,
  });

  const loadData = () => {
    try {
      const txs = JSON.parse(localStorage.getItem("aio_quick_transactions") || "[]");
      let addedEarning = 0;
      let addedExpense = 0;

      txs.forEach((tx: any) => {
        if (tx.type === "earning") addedEarning += tx.amount || 0;
        if (tx.type === "expense") addedExpense += tx.amount || 0;
      });

      setData((prev) => ({
        ...prev,
        monthlyEarning: 42000000 + addedEarning,
        monthlyExpense: 17500000 + addedExpense,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("aio_data_updated", loadData);
    return () => window.removeEventListener("aio_data_updated", loadData);
  }, []);

  const netWorth = data.totalAssets - data.totalLiabilities;
  const cashflow = data.monthlyEarning - data.monthlyExpense;
  const savingsRate = Math.round((cashflow / (data.monthlyEarning || 1)) * 100);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md shadow-sm p-4 sm:p-5 mb-6 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-border/60 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="size-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
              <span>Executive Money Pulse</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Surplus {savingsRate}%
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Konsolidasi Real-Time 4 Kuadran (Asset, Liability, Earning, Expense)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground self-start sm:self-center">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          <span>Rasio Ketahanan: <strong>Tinggi (Resilien)</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Net Worth */}
        <Link
          to="/asset"
          className="group p-3.5 rounded-xl border border-border/60 bg-background/50 hover:bg-accent/40 hover:border-border transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-medium">Total Kekayaan Bersih</span>
            <Wallet className="size-3.5 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            {formatIDR(netWorth)}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
            <span>Aset: {formatIDR(data.totalAssets)}</span>
            <span className="text-rose-500">Hutang: {formatIDR(data.totalLiabilities)}</span>
          </div>
        </Link>

        {/* Monthly Cashflow */}
        <Link
          to="/flow"
          className="group p-3.5 rounded-xl border border-border/60 bg-background/50 hover:bg-accent/40 hover:border-border transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-medium">Arus Kas Bersih (Bulan Ini)</span>
            <ArrowUpRight className="size-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg sm:text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            +{formatIDR(cashflow)}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
            <span>Masuk: {formatIDR(data.monthlyEarning)}</span>
            <span>Keluar: {formatIDR(data.monthlyExpense)}</span>
          </div>
        </Link>

        {/* Quick Quadrants Navigator */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-background/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span className="font-medium">Akses 4 Kuadran Keuangan</span>
            <Layers className="size-3.5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <Link
              to="/asset"
              className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium text-center transition-colors truncate"
            >
              1. Aset
            </Link>
            <Link
              to="/grow"
              className="px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-medium text-center transition-colors truncate"
            >
              2. Grow
            </Link>
            <Link
              to="/flow"
              className="px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium text-center transition-colors truncate"
            >
              3. Flow
            </Link>
            <Link
              to="/legacy"
              className="px-2 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-medium text-center transition-colors truncate"
            >
              4. Legacy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
