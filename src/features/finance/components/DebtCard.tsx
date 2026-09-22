import React from "react";
import { Utang } from "../types";
import {
  formatRupiah,
  hitungTotalPlafonTermasukBunga,
  hitungCicilanBulan,
  hitungTotalBunga,
  hitungRentangHari,
  simulasiMinPayment,
  hitungTotalBiayaAutodebet,
} from "../utils";
import {
  Bell,
  BellOff,
  Calendar,
  Edit2,
  Trash2,
  Home,
  CreditCard,
  Landmark,
  Car,
  FileText,
  Smartphone,
  RefreshCw,
  Calculator,
} from "lucide-react";

const typeIcons: Record<string, any> = {
  "Kartu Kredit": CreditCard,
  "Kredit Tanpa Agunan": Landmark,
  "Kredit Kendaraan": Car,
  KPR: Home,
  "Pinjaman Online": Smartphone,
  Lainnya: FileText,
};

export function DebtCard({
  utang,
  onEdit,
  onDelete,
}: {
  key?: string | number;
  utang: Utang;
  onEdit: (d: Utang) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = typeIcons[utang.jenisUtang] || FileText;

  const totalBunga = hitungTotalBunga(utang.totalPlafon, utang.bungaTahunan, utang.totalTenor);
  const totalTermasukBunga = hitungTotalPlafonTermasukBunga(
    utang.totalPlafon,
    utang.bungaTahunan,
    utang.totalTenor,
  );
  const cicilanPerBulan = hitungCicilanBulan(
    utang.totalPlafon,
    utang.bungaTahunan,
    utang.totalTenor,
  );
  const tenorSisa = Math.max(0, utang.totalTenor - utang.tenorSudahBayar);

  const progress =
    utang.totalTenor > 0 ? Math.min(100, (utang.tenorSudahBayar / utang.totalTenor) * 100) : 0;
  const isLunas = tenorSisa === 0;

  const rentangHari = hitungRentangHari(utang.tanggalCetak, utang.tanggalJatuhTempo);
  const totalAutodebet = hitungTotalBiayaAutodebet(utang.biayaAdmin || [], utang.totalPlafon);
  const simulasi = simulasiMinPayment(utang);

  return (
    <div
      className={`bg-card rounded-xl shadow-sm border ${isLunas ? "border-emerald-200 bg-emerald-50/30" : "border-border"} p-5 hover:shadow-md transition-shadow flex flex-col`}
    >
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${isLunas ? "bg-emerald-100 text-emerald-600" : "bg-blue-50 text-blue-600"}`}
          >
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground leading-tight">{utang.namaAkun}</h3>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              {utang.penerbit} • {utang.jenisUtang}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(utang)}
            className="p-1.5 text-muted-foreground/70 hover:bg-muted/30 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(utang.id)}
            className="p-1.5 text-muted-foreground/70 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Total Plafon (+Bunga)
          </p>
          <p className="text-sm font-bold text-foreground">{formatRupiah(totalTermasukBunga)}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Jumlah Tenor
          </p>
          <p className="text-sm font-bold text-foreground">
            {formatRupiah(cicilanPerBulan)}{" "}
            <span className="text-xs font-normal text-muted-foreground">/bln</span>
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Tenor Sisa
          </p>
          <p className="text-sm font-bold text-foreground">
            {tenorSisa} <span className="text-xs font-normal text-muted-foreground">Bulan</span>
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Tenor Sudah Bayar
          </p>
          <p className="text-sm font-bold text-foreground">
            {utang.tenorSudahBayar}{" "}
            <span className="text-xs font-normal text-muted-foreground">Bulan</span>
          </p>
        </div>
      </div>

      <div className="mb-4 bg-muted/30 p-3.5 rounded-xl border border-border">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-semibold text-card-foreground">Progression</p>
          <p className="text-xs font-bold text-foreground">{progress.toFixed(0)}%</p>
        </div>
        <div className="w-full h-2 bg-accent rounded-full overflow-hidden flex mb-2">
          <div
            style={{ width: `${progress}%` }}
            className={`h-full transition-all ${isLunas ? "bg-emerald-500" : "bg-blue-500"}`}
          />
        </div>
        <div className="flex justify-between text-xs font-medium text-muted-foreground/70">
          <span>Pokok: {formatRupiah(utang.totalPlafon)}</span>
          <span>
            Bunga: {formatRupiah(totalBunga)} ({utang.bungaTahunan}%)
          </span>
        </div>
      </div>

      {!isLunas && (
        <div className="space-y-3 mb-5">
          {totalAutodebet > 0 && (
            <div className="flex items-center gap-2 bg-blue-50/50 text-blue-800 text-xs font-medium p-2.5 rounded-lg border border-blue-100">
              <RefreshCw size={12} className="text-blue-500" />
              <span>Autodebet Ekstra/Biaya: {formatRupiah(totalAutodebet)} /bln</span>
            </div>
          )}

          <div className="bg-primary text-primary-foreground p-3.5 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground mb-1 border-b border-white/10 pb-2">
              <Calculator size={14} className="text-emerald-400" /> Simulasi Membayar{" "}
              {utang.persentaseMinPayment}%
            </div>
            <div className="flex justify-between text-muted-foreground/70">
              <span>Total Tagihan Saat Ini</span>
              <span className="text-foreground">{formatRupiah(simulasi.tagihanSaatIni)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground/70">
              <span>Min. Payment ({utang.persentaseMinPayment}%)</span>
              <span className="text-emerald-400 font-semibold">
                {formatRupiah(simulasi.minPayment)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground/70 pt-1 border-t border-white/10">
              <span>Estimasi Sisa Bln Depan</span>
              <span className="text-foreground">{formatRupiah(simulasi.tagihanBulanDepan)}</span>
            </div>
            <p className="text-xs text-muted-foreground italic mt-1 leading-tight">
              Termasuk bunga sisa ({formatRupiah(simulasi.bungaBulanDepan)}). Gunakan min. payment
              saat mendesak saja.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar size={12} className="text-muted-foreground/70" />
            {utang.adaTanggalCetak !== false && utang.tanggalCetak ? (
              <span>
                Cetak: Tgl {utang.tanggalCetak} → Jatuh Tempo: Tgl {utang.tanggalJatuhTempo}
              </span>
            ) : (
              <span>Jatuh Tempo: Tgl {utang.tanggalJatuhTempo}</span>
            )}
          </div>
          {utang.adaTanggalCetak !== false && utang.tanggalCetak && (
            <span className="text-xs text-muted-foreground/70 italic pl-5">
              ({rentangHari} hari rentang)
            </span>
          )}
        </div>
        <div className="flex items-center text-xs font-medium">
          {isLunas ? (
            <span className="flex items-center justify-center min-w-16 gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              Lunas
            </span>
          ) : utang.pengingatAktif ? (
            <span className="flex items-center justify-center min-w-16 gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              <Bell size={12} /> Aktif
            </span>
          ) : (
            <span className="flex items-center justify-center min-w-16 gap-1 text-muted-foreground bg-muted px-2 py-1 rounded-md">
              <BellOff size={12} /> Nonaktif
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
