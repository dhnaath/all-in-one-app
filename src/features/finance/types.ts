export type JenisUtang =
  | "Kartu Kredit"
  | "Kredit Tanpa Agunan"
  | "Kredit Kendaraan"
  | "KPR"
  | "Pinjaman Online"
  | "Lainnya";

export interface BiayaAdmin {
  id: string;
  namaBiaya: string;
  tipeBiaya?: "Nominal" | "Persentase";
  nominal: number;
  persentase?: number;
  autodebetAktif: boolean;
}

export interface Utang {
  id: string;
  namaAkun: string;
  penerbit: string;
  jenisUtang: JenisUtang;
  totalPlafon: number;
  bungaTahunan: number;
  totalTenor: number;
  tenorSudahBayar: number;
  tanggalCetak?: number | null;
  adaTanggalCetak?: boolean;
  tanggalJatuhTempo: number;
  persentaseMinPayment: number;
  biayaAdmin: BiayaAdmin[];
  pengingatAktif: boolean;
  createdAt: string;
}
