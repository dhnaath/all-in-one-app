import React, { useState } from "react";
import {
  ChevronLeft,
  Plus,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  Briefcase,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { useDeletedItems } from "../hooks/useDeletedItems";

export function InvestmentView({ onBack }: { onBack: () => void }) {
  const { deletedIds, markDeleted } = useDeletedItems("deleted_assets");
  const [assets, setAssets] = useState<any[]>(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("assets_list") : null;
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const simulateMarketUpdate = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setAssets((prev) =>
        prev.map((asset) => {
          if (asset.type === "Saham") {
            // Simulate + or - 2% change in current market price
            const randomFluctuation = 1 + (Math.random() * 0.04 - 0.02);
            return {
              ...asset,
              currentPrice: Math.round((asset.currentPrice || 0) * randomFluctuation),
            };
          }
          return asset;
        }),
      );
      setIsSyncing(false);
    }, 1500);
  };

  // Calculate live value based on lots and current price for stocks
  const processedAssets = assets.map((asset) => {
    if (asset.type === "Saham") {
      const shares = (asset.lots || 0) * 100;
      const initialValue = shares * (asset.avgPrice || 0);
      const currentValue = shares * (asset.currentPrice || 0);
      const returnAmount = currentValue - initialValue;
      const returnPercent = (returnAmount / initialValue) * 100;

      return {
        ...asset,
        amount: currentValue,
        return: returnPercent,
        returnAmount: returnAmount,
      };
    }
    return asset as any;
  });

  const totalValue = processedAssets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalInitial = processedAssets.reduce((sum, asset) => {
    return sum + (asset.amount - (asset.returnAmount || 0));
  }, 0);
  const totalReturnAmount = totalValue - totalInitial;
  const totalReturnPercent = (totalReturnAmount / totalInitial) * 100;

  return (
    <div className="min-h-screen bg-background p-4 font-sans text-foreground flex flex-col pb-20 relative">
      <div className="flex justify-between items-center mb-6 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ChevronLeft size={28} strokeWidth={2} />
          </button>
          <h1 className="text-lg font-normal tracking-wide text-foreground">
            Portofolio Investasi
          </h1>
        </div>
        <button className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-[#4caf50] hover:bg-accent transition-colors">
          <Plus size={18} />
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-[#1b2f21] to-[#121212] rounded-3xl p-6 border border-[#2e5238] shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 text-[#4caf50] opacity-10">
          <Briefcase size={120} />
        </div>
        <p className="text-sm font-medium text-[#81c784] mb-1 relative z-10">
          Total Nilai Portofolio
        </p>
        <p className="text-2xl font-medium text-foreground tracking-tight mb-4 relative z-10">
          Rp {totalValue.toLocaleString("id-ID")}
        </p>

        <div className="flex items-center gap-2 mb-2 relative z-10">
          <div
            className={`px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium ${totalReturnAmount >= 0 ? "bg-[#4caf50]/20 text-[#4caf50]" : "bg-red-500/20 text-red-500"}`}
          >
            {totalReturnAmount >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {totalReturnAmount >= 0 ? "+" : ""}Rp{" "}
            {Math.abs(totalReturnAmount).toLocaleString("id-ID")} (
            {(totalReturnPercent || 0).toFixed(2)}%)
          </div>
          <span className="text-xs text-muted-foreground">Semua Waktu</span>
        </div>
      </div>

      {/* Asset Allocation */}
      <h2 className="text-sm font-medium text-muted-foreground/70 mb-4 px-1 uppercase tracking-wider">
        Alokasi Aset
      </h2>

      {processedAssets.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 border border-dashed border-border text-center mb-6 flex flex-col items-center justify-center">
          <Briefcase size={32} className="text-muted-foreground/70 mb-3" />
          <p className="text-sm text-muted-foreground">Belum ada portofolio investasi</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-5 border border-border mb-6 flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#252525" strokeWidth="16" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#9c27b0"
                strokeWidth="16"
                strokeDasharray="125 251"
              />{" "}
              {/* 50% */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#4caf50"
                strokeWidth="16"
                strokeDasharray="63 251"
                strokeDashoffset="-125"
              />{" "}
              {/* 25% */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#1976d2"
                strokeWidth="16"
                strokeDasharray="38 251"
                strokeDashoffset="-188"
              />{" "}
              {/* 15% */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#ff9800"
                strokeWidth="16"
                strokeDasharray="25 251"
                strokeDashoffset="-226"
              />{" "}
              {/* 10% */}
            </svg>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-[#9c27b0]"></span>Obligasi
              </span>
              <span className="font-medium text-foreground">49.8%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-[#4caf50]"></span>Reksa Dana Saham
              </span>
              <span className="font-medium text-foreground">24.9%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-[#1976d2]"></span>Saham Ekuitas
              </span>
              <span className="font-medium text-foreground">15.3%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-[#ff9800]"></span>Pasar Uang
              </span>
              <span className="font-medium text-foreground">10.0%</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4 px-1 mt-6">
        <h2 className="text-sm font-medium text-muted-foreground/70 uppercase tracking-wider">
          Aset Anda
        </h2>
        <div className="flex gap-2">
          <button
            className={`text-muted-foreground hover:text-foreground ${isSyncing ? "animate-spin text-[#00bcd4]" : ""}`}
            title="Sinkronisasi Bursa"
            onClick={simulateMarketUpdate}
            disabled={isSyncing}
          >
            <RefreshCw size={18} />
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <PieChart size={18} />
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <LineChart size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3 w-full">
        {processedAssets.map((asset) => (
          <div
            key={asset.id}
            className="relative mb-3 bg-card/60 rounded-2xl overflow-hidden border border-border"
          >
            <div className="absolute inset-0 flex items-center justify-between px-6 z-0">
              <div className="flex items-center gap-2 text-blue-400">
                <span className="text-xs font-medium uppercase tracking-widest">Arsip</span>
              </div>
              <div className="flex items-center gap-2 text-red-500">
                <span className="text-xs font-medium uppercase tracking-widest">Hapus</span>
              </div>
            </div>
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, info) => {
                if (info.offset.x < -100) {
                  if (window.confirm("Apakah Anda yakin ingin menghapus investasi ini?")) {
                    markDeleted(asset.id);
                    setAssets((prev) => prev.filter((x) => x.id !== asset.id));
                  }
                } else if (info.offset.x > 100) {
                  alert("Investasi diarsipkan.");
                  markDeleted(asset.id);
                  setAssets((prev) => prev.filter((x) => x.id !== asset.id));
                }
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border-y border-border w-full rounded-2xl p-4 flex flex-col relative z-10 hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#2a2a2a]">
                    {asset.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{asset.name}</h3>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      {asset.type} {asset.type === "Saham" && `• ${asset.lots} Lot`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-medium text-foreground">
                    Rp {asset.amount.toLocaleString("id-ID")}
                  </h3>
                  <p
                    className={`text-xs mt-0.5 flex items-center justify-end gap-1 ${asset.return >= 0 ? "text-[#4caf50]" : "text-red-500"}`}
                  >
                    {asset.return >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {asset.return >= 0 ? "+" : ""}Rp{" "}
                    {Math.abs(asset.returnAmount).toLocaleString("id-ID")} (
                    {Math.abs(asset.return).toFixed(2)}%)
                  </p>
                </div>
              </div>

              {asset.type === "Saham" && (
                <div className="mt-3 pt-3 border-t border-border flex justify-between items-center px-1">
                  <div className="text-xs text-muted-foreground flex flex-col gap-1">
                    <span>
                      Avg Price:{" "}
                      <span className="text-muted-foreground">
                        Rp {asset.avgPrice.toLocaleString("id-ID")}
                      </span>
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-col gap-1 text-right">
                    <span>
                      Mkt Price:{" "}
                      <span className="text-muted-foreground">
                        Rp {asset.currentPrice.toLocaleString("id-ID")}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
