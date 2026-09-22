import { Utang, BiayaAdmin } from "./types";

const STORAGE_KEY = "debt_align_data_id_v3";

export const loadUtang = (): Utang[] => {
  try {
    if (typeof window === "undefined") return [];
    const data =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEY) || localStorage.getItem("debt_align_data_id_v2")
        : null;
    if (!data) return [];

    return JSON.parse(data).map((u: any) => ({
      ...u,
      tanggalCetak: u.tanggalCetak ?? null,
      adaTanggalCetak: u.adaTanggalCetak ?? (u.tanggalCetak ? true : false),
      persentaseMinPayment: u.persentaseMinPayment || 10,
      biayaAdmin: (u.biayaAdmin || []).map((b: any) => ({
        ...b,
        tipeBiaya: b.tipeBiaya || "Nominal",
        nominal: b.nominal || 0,
        persentase: b.persentase || 0,
      })),
    }));
  } catch (e) {
    return [];
  }
};

export const saveUtang = (debts: Utang[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(debts));
};

export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const hitungRentangHari = (tglCetak: number | null | undefined, tglJatuhTempo: number) => {
  if (!tglCetak) return 0; // Jika tidak ada tanggal cetak, rentang tidak dihitung (asumsi tidak relevan)
  if (tglJatuhTempo >= tglCetak) return tglJatuhTempo - tglCetak;
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  return daysInMonth - tglCetak + tglJatuhTempo;
};

export const hitungBiayaItem = (b: BiayaAdmin, totalPlafon: number) => {
  return b.tipeBiaya === "Persentase" ? totalPlafon * ((b.persentase || 0) / 100) : b.nominal;
};

export const hitungTotalBiayaAdmin = (biaya: BiayaAdmin[], totalPlafon: number) => {
  return biaya.reduce((sum, b) => sum + hitungBiayaItem(b, totalPlafon), 0);
};

export const hitungTotalBiayaAutodebet = (biaya: BiayaAdmin[], totalPlafon: number) => {
  return biaya
    .filter((b) => b.autodebetAktif)
    .reduce((sum, b) => sum + hitungBiayaItem(b, totalPlafon), 0);
};

export const hitungTotalBunga = (plafon: number, bungaTahunan: number, tenorBulan: number) => {
  return plafon * (bungaTahunan / 100) * (tenorBulan / 12);
};

export const hitungTotalPlafonTermasukBunga = (
  plafon: number,
  bungaTahunan: number,
  tenorBulan: number,
) => {
  return plafon + hitungTotalBunga(plafon, bungaTahunan, tenorBulan);
};

export const hitungCicilanBulan = (plafon: number, bungaTahunan: number, tenorBulan: number) => {
  if (tenorBulan === 0) return 0;
  return hitungTotalPlafonTermasukBunga(plafon, bungaTahunan, tenorBulan) / tenorBulan;
};

export const hitungSisaUtangUtama = (u: Utang) => {
  const cicilan = hitungCicilanBulan(u.totalPlafon, u.bungaTahunan, u.totalTenor);
  const tenorSisa = u.totalTenor - u.tenorSudahBayar;
  return cicilan * Math.max(0, tenorSisa);
};

export const hitungSisaUtang = (u: Utang) => {
  return hitungSisaUtangUtama(u) + hitungTotalBiayaAdmin(u.biayaAdmin || [], u.totalPlafon);
};

export const simulasiMinPayment = (u: Utang) => {
  // Hanya berlaku jika ada sisa utang
  const sisaUtangBulanIni = hitungSisaUtangUtama(u);
  if (sisaUtangBulanIni <= 0) {
    return {
      tagihanSaatIni: 0,
      minPayment: 0,
      sisaTangguhan: 0,
      bungaBulanDepan: 0,
      tagihanBulanDepan: 0,
    };
  }

  // Untuk revolving credit, nilai tagihan berjalan (contoh simpel cicilan bulan ini + sisa, di sini kita proyeksikan jika tidak lunas)
  const tagihanBiayaAdmin = hitungTotalBiayaAdmin(u.biayaAdmin || [], u.totalPlafon);
  // Default tagihan bulan ini adalah cicilan bulan (fixed installment) atau total jika CC
  const sisaUtang = sisaUtangBulanIni + tagihanBiayaAdmin;

  const minPayment = sisaUtang * (u.persentaseMinPayment / 100);
  const sisaTangguhan = Math.max(0, sisaUtang - minPayment);

  const bungaBulanDepan = sisaTangguhan * (u.bungaTahunan / 100 / 12);
  const tagihanBulanDepan = sisaTangguhan + bungaBulanDepan;

  return {
    tagihanSaatIni: sisaUtang,
    minPayment,
    sisaTangguhan,
    bungaBulanDepan,
    tagihanBulanDepan,
  };
};

export const checkAndTriggerReminders = (utangList: Utang[]) => {
  if (!("Notification" in window)) return;

  const notify = () => {
    const today = new Date();
    const currentDay = today.getDate();

    utangList.forEach((u) => {
      if (!u.pengingatAktif) return;
      if (u.tenorSudahBayar >= u.totalTenor) return;

      let daysUntilDue = u.tanggalJatuhTempo - currentDay;
      if (daysUntilDue < 0) {
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        daysUntilDue += daysInMonth;
      }

      if (daysUntilDue >= 0 && daysUntilDue <= 3) {
        const lastNotifiedKey = `notified_${u.id}_${today.getFullYear()}_${today.getMonth()}`;
        if (typeof window !== "undefined" && !localStorage.getItem(lastNotifiedKey)) {
          const text = `Tagihan ${u.namaAkun} (${u.penerbit}) jatuh tempo ${daysUntilDue === 0 ? "hari ini" : `dalam ${daysUntilDue} hari`}.`;
          new Notification("Pengingat Tagihan", { body: text });
          localStorage.setItem(lastNotifiedKey, "true");
        }
      }
    });
  };

  try {
    if (Notification.permission === "granted") {
      notify();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") notify();
        })
        .catch(() => {
          /* ignore iframe errors */
        });
    }
  } catch (e) {
    console.warn("Notifications not supported");
  }
};
