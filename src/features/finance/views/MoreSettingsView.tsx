import React from "react";
import { ArrowLeft } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";
import { useLanguage } from "../hooks/useLanguage";

export function MoreSettingsView({
  onBack,
  onUnavailable,
}: {
  onBack: () => void;
  onUnavailable?: () => void;
}) {
  const { ref, onScroll } = useScrollRestore("MoreSettingsView_scroll");
  const lang = useLanguage();

  const getLanguageLabel = () => {
    switch (lang) {
      case "id":
        return "IDN";
      case "en":
        return "ENG";
      case "ms":
        return "MYS";
      case "zh":
        return "中文";
      default:
        return "IDN";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] w-full relative z-50">
      <div className="flex items-center gap-6 p-4 pt-5 mb-2">
        <button onClick={onBack}>
          <ArrowLeft
            size={24}
            className="text-foreground hover:text-foreground transition-colors"
          />
        </button>
        <h1 className="text-lg font-normal text-foreground">Pengaturan lainnya</h1>
      </div>

      <div ref={ref} onScroll={onScroll} className="overflow-y-auto pb-10">
        {/* Umum */}
        <div className="mt-4 mb-2 px-4">
          <h2 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-1">
            Umum
          </h2>
          <div className="py-3 cursor-pointer" onClick={onUnavailable}>
            <p className="text-base text-foreground font-normal">Bahasa</p>
            <p className="text-sm text-muted-foreground">{getLanguageLabel()}</p>
          </div>
          <div className="py-3 cursor-pointer" onClick={onUnavailable}>
            <p className="text-base text-foreground font-normal">Layar awal</p>
            <p className="text-sm text-muted-foreground">Beranda</p>
          </div>
          <div className="py-3 cursor-pointer" onClick={onUnavailable}>
            <p className="text-base text-foreground font-normal">Tipe transaksi default</p>
            <p className="text-sm text-muted-foreground">Pengeluaran</p>
          </div>
        </div>

        <div className="h-[1px] bg-[#2a2a2a] my-1 mx-4"></div>

        {/* Tampilan */}
        <div className="mt-4 mb-2 px-4">
          <h2 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-1">
            Tampilan
          </h2>
          <div className="py-3 cursor-pointer" onClick={onUnavailable}>
            <p className="text-base text-foreground font-normal">Format mata uang</p>
            <p className="text-sm text-muted-foreground">Rp 1.234.567,00</p>
          </div>
          <div className="py-3 cursor-pointer" onClick={onUnavailable}>
            <p className="text-base text-foreground font-normal">Mode tampilan transaksi</p>
            <p className="text-sm text-muted-foreground">Daftar</p>
          </div>
          <div
            className="py-3 flex justify-between items-center cursor-pointer pr-1"
            onClick={onUnavailable}
          >
            <div className="flex-1 pr-6">
              <p className="text-base text-foreground font-normal">Waktu transaksi</p>
              <p className="text-sm text-muted-foreground leading-snug tracking-tight">
                Tampilkan waktu transaksi dan opsi pelacakan waktu
              </p>
            </div>
            <div className="w-11 h-6 bg-[#4a72ff] rounded-full flex items-center p-1 justify-end shrink-0">
              <div className="w-4 h-4 bg-card rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-[#2a2a2a] my-2 mx-4"></div>

        {/* Tanggal */}
        <div className="mt-4 mb-2 px-4">
          <h2 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-1">
            Tanggal
          </h2>
          <div className="py-3 cursor-pointer" onClick={onUnavailable}>
            <p className="text-base text-foreground font-normal">Hari pertama minggu</p>
            <p className="text-sm text-muted-foreground">Minggu</p>
          </div>
          <div className="py-3 cursor-pointer" onClick={onUnavailable}>
            <p className="text-base text-foreground font-normal">Hari pertama bulan</p>
            <p className="text-sm text-muted-foreground">1</p>
          </div>
          <div className="py-3 cursor-pointer" onClick={onUnavailable}>
            <p className="text-base text-foreground font-normal">Hari pertama tahun</p>
            <p className="text-sm text-muted-foreground">Januari 01</p>
          </div>
        </div>
      </div>
    </div>
  );
}
