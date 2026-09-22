import React from "react";
import { Utang } from "../types";
import { formatRupiah, hitungSisaUtang, hitungCicilanBulan } from "../utils";
import { Wallet, CalendarClock, TrendingDown } from "lucide-react";

export function Dashboard({ utangList }: { utangList: Utang[] }) {
  const totalSisaUtang = utangList.reduce((sum, u) => sum + hitungSisaUtang(u), 0);
  const totalCicilanBulanIni = utangList.reduce((sum, u) => {
    return u.tenorSudahBayar < u.totalTenor
      ? sum + hitungCicilanBulan(u.totalPlafon, u.bungaTahunan, u.totalTenor)
      : sum;
  }, 0);
  const totalUtangAktif = utangList.filter((u) => u.tenorSudahBayar < u.totalTenor).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border flex items-start gap-4">
        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
          <Wallet size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Sisa Utang</p>
          <p className="text-2xl md:text-2xl font-bold text-foreground">
            {formatRupiah(totalSisaUtang)}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border flex items-start gap-4">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <CalendarClock size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Cicilan Per Tenor</p>
          <p className="text-2xl md:text-2xl font-bold text-foreground">
            {formatRupiah(totalCicilanBulanIni)}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border flex items-start gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <TrendingDown size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Akun Aktif</p>
          <p className="text-2xl md:text-2xl font-bold text-foreground">{totalUtangAktif}</p>
          <p className="text-xs text-muted-foreground mt-1">Akun yang belum lunas</p>
        </div>
      </div>
    </div>
  );
}
