import React from "react";
import { ArrowLeft, BookOpen, Tags, Calendar, DownloadCloud, FileText } from "lucide-react";

export function TrackerSettingsView({
  onBack,
  onUnavailable,
}: {
  onBack: () => void;
  onUnavailable?: () => void;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] w-full relative z-50">
      <div className="flex items-center gap-6 p-4 pt-5 mb-2">
        <button onClick={onBack}>
          <ArrowLeft
            size={24}
            className="text-foreground hover:text-foreground transition-colors"
          />
        </button>
        <h1 className="text-lg font-normal text-foreground">Pengaturan Tracker</h1>
      </div>

      <div className="p-4 space-y-2">
        <div className="py-2 space-y-1">
          <div className="flex items-center gap-6 py-4 px-2 cursor-pointer" onClick={onUnavailable}>
            <BookOpen size={24} className="text-[#00bcd4]" />
            <div className="flex flex-col">
              <span className="text-base text-foreground font-normal">Kategori Utama</span>
              <span className="text-sm text-muted-foreground">
                Atur kategori pemasukan & pengeluaran
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 py-4 px-2 cursor-pointer" onClick={onUnavailable}>
            <Tags size={24} className="text-[#4caf50]" />
            <div className="flex flex-col">
              <span className="text-base text-foreground font-normal">Manajemen Label</span>
              <span className="text-sm text-muted-foreground">
                Kelola tag kustom untuk transaksi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 py-4 px-2 cursor-pointer" onClick={onUnavailable}>
            <Calendar size={24} className="text-[#ff9800]" />
            <div className="flex flex-col">
              <span className="text-base text-foreground font-normal">Siklus Bulanan</span>
              <span className="text-sm text-muted-foreground">Dimulai setiap tanggal 1</span>
            </div>
          </div>

          <div className="h-[1px] bg-[#2a2a2a] my-4"></div>

          <div
            className="flex items-center gap-6 py-4 px-2 cursor-pointer relative"
            onClick={() => alert("Pencadangan cloud sementara dinonaktifkan")}
          >
            <DownloadCloud size={24} className="text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-base text-foreground font-normal">Pencadangan Tracker</span>
              <span className="text-sm text-muted-foreground">Sinkronkan ke Cloud</span>
            </div>
          </div>

          <div className="flex items-center gap-6 py-4 px-2 cursor-pointer" onClick={onUnavailable}>
            <FileText size={24} className="text-muted-foreground" />
            <span className="text-base text-foreground font-normal">Laporan & Ekspor Berkas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
