import React from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

export function AnalyticsView() {
  return (
    <div className="p-4 flex flex-col min-h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-normal">Analitik</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-foreground">
          <Calendar size={18} />
          <span className="font-medium text-sm">Juni 2026</span>
        </div>
        <div className="flex items-center gap-4 text-foreground">
          <ChevronLeft size={18} />
          <ChevronRight size={18} />
          <Filter size={18} />
        </div>
      </div>

      <div className="flex gap-2 bg-[#2a2a2a] p-1 rounded-xl mb-4">
        <button className="flex-1 text-sm py-1.5 rounded-lg text-muted-foreground">
          Pemasukan
        </button>
        <button className="flex-1 text-sm py-1.5 rounded-lg bg-[#2a2a2a] text-foreground">
          Pengeluaran
        </button>
        <button className="flex-1 text-sm py-1.5 rounded-lg text-muted-foreground">Total</button>
        <button className="flex items-center justify-center gap-1 text-sm py-1.5 px-3 text-muted-foreground">
          <TrendingUp size={14} /> D
        </button>
      </div>

      {/* Chart Placeholder Area */}
      <div className="h-48 mt-12 mb-2 relative flex flex-col justify-end border-b border-border pb-2">
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground/70">
          Belum ada data untuk ditampilkan
        </div>
      </div>

      <div className="space-y-4 mt-4 pb-8">
        {/* Arus Kas */}
        <div className="bg-card rounded-2xl p-5">
          <div className="mb-4 text-foreground">
            <h2 className="text-base font-medium">Arus kas</h2>
            <p className="text-xs text-muted-foreground">Juni 2026</p>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ArrowUpCircle size={18} className="text-[#4caf50]" />
                <span className="text-sm text-foreground">Pemasukan</span>
              </div>
              <span className="text-sm text-[#4caf50]">Rp 0</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ArrowDownCircle size={18} className="text-[#f44336]" />
                <span className="text-sm text-foreground">Pengeluaran</span>
              </div>
              <span className="text-sm text-[#f44336]">Rp 0</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-border">
            <span className="text-sm text-foreground pl-6 border-l-4 border-transparent">
              Total:
            </span>
            <span className="text-sm text-foreground">Rp 0</span>
          </div>
        </div>

        {/* Rata-rata */}
        <div className="bg-card rounded-2xl p-5">
          <div className="mb-4 text-foreground">
            <h2 className="text-base font-medium">Rata-rata</h2>
            <p className="text-xs text-muted-foreground">Juni 2026</p>
          </div>
          <div className="space-y-3 text-muted-foreground/70 text-center py-4">
            <p className="text-sm">Belum ada data transaksi</p>
          </div>
        </div>

        {/* Rasio Finansial */}
        <div className="bg-card rounded-2xl p-5 border border-border relative overflow-hidden">
          <div className="text-foreground relative z-10">
            <h2 className="text-base font-medium">Rasio Finansial</h2>
            <p className="text-xs text-muted-foreground mb-4">Indikator kesehatan keuangan</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-foreground">Rasio Tabungan</span>
                  <span className="font-medium text-muted-foreground">0%</span>
                </div>
                <div className="w-full bg-background rounded-full h-1.5 border border-border overflow-hidden">
                  <div className="h-full rounded-full bg-gray-500" style={{ width: "0%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Belum ada data (Target &gt; 20%)
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-foreground">Debt-to-Income (DTI)</span>
                  <span className="font-medium text-muted-foreground">0%</span>
                </div>
                <div className="w-full bg-background rounded-full h-1.5 border border-border overflow-hidden">
                  <div className="h-full rounded-full bg-gray-500" style={{ width: "0%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Belum ada data (Target &lt; 30%)
                </p>
              </div>
            </div>
          </div>
          <TrendingUp className="text-[#252525] absolute -right-4 -bottom-4 z-0" size={100} />
        </div>
      </div>
    </div>
  );
}
