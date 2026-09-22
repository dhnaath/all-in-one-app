import React, { useState } from "react";
import { Utang, BiayaAdmin } from "../types";
import { X, Calculator, Plus, Trash2 } from "lucide-react";
import { hitungTotalPlafonTermasukBunga, formatRupiah, hitungCicilanBulan } from "../utils";

export function DebtForm({
  utang,
  onSave,
  onClose,
}: {
  utang?: Utang | null;
  onSave: (d: Partial<Utang>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Utang>>({
    namaAkun: utang?.namaAkun || "",
    penerbit: utang?.penerbit || "",
    jenisUtang: utang?.jenisUtang || "Kredit Tanpa Agunan",
    totalPlafon: utang?.totalPlafon || 0,
    bungaTahunan: utang?.bungaTahunan || 0,
    totalTenor: utang?.totalTenor || 12,
    tenorSudahBayar: utang?.tenorSudahBayar || 0,
    tanggalCetak: utang?.tanggalCetak ?? null,
    adaTanggalCetak: utang?.adaTanggalCetak ?? (utang?.tanggalCetak ? true : false),
    tanggalJatuhTempo: utang?.tanggalJatuhTempo || 15,
    persentaseMinPayment: utang?.persentaseMinPayment || 10,
    biayaAdmin: utang?.biayaAdmin || [],
    pengingatAktif: utang?.pengingatAktif ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;

    if (type === "number") {
      finalValue = parseFloat(value) || 0;
    } else if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddBiaya = () => {
    setFormData((prev) => ({
      ...prev,
      biayaAdmin: [
        ...(prev.biayaAdmin || []),
        {
          id: crypto.randomUUID(),
          namaBiaya: "",
          tipeBiaya: "Nominal",
          nominal: 0,
          persentase: 0,
          autodebetAktif: false,
        },
      ],
    }));
  };

  const handleUpdateBiaya = (index: number, field: keyof BiayaAdmin, value: any) => {
    setFormData((prev) => {
      const updated = [...(prev.biayaAdmin || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, biayaAdmin: updated };
    });
  };

  const handleRemoveBiaya = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      biayaAdmin: (prev.biayaAdmin || []).filter((_, i) => i !== index),
    }));
  };

  const totalTermasukBunga = hitungTotalPlafonTermasukBunga(
    formData.totalPlafon || 0,
    formData.bungaTahunan || 0,
    formData.totalTenor || 0,
  );
  const cicilanEstimasi = hitungCicilanBulan(
    formData.totalPlafon || 0,
    formData.bungaTahunan || 0,
    formData.totalTenor || 0,
  );

  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">
            {utang ? "Edit Akun" : "Tambah Akun Utang"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground/70 hover:bg-muted hover:text-muted-foreground rounded-lg p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">
                Nama Pinjaman
              </label>
              <input
                required
                name="namaAkun"
                type="text"
                value={formData.namaAkun}
                onChange={handleChange}
                className="w-full border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="KTA Rumah"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">
                Nama Kredit atau Pemberi Pinjaman
              </label>
              <input
                required
                name="penerbit"
                type="text"
                value={formData.penerbit}
                onChange={handleChange}
                className="w-full border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="BCA, Kredivo"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">
                Jenis Kredit
              </label>
              <select
                name="jenisUtang"
                value={formData.jenisUtang}
                onChange={handleChange}
                className="w-full border border-border rounded-xl px-4 py-2.5 bg-card focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none cursor-pointer"
              >
                <option value="Kartu Kredit">Kartu Kredit</option>
                <option value="Kredit Tanpa Agunan">Kredit Tanpa Agunan (KTA)</option>
                <option value="Kredit Kendaraan">Kredit Kendaraan</option>
                <option value="KPR">Kredit Pemilikan Rumah (KPR)</option>
                <option value="Pinjaman Online">Pinjaman Online (Pinjol)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">
                Pokok Pinjaman
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                  Rp
                </span>
                <input
                  required
                  name="totalPlafon"
                  type="number"
                  min="0"
                  value={formData.totalPlafon || ""}
                  onChange={handleChange}
                  className="w-full border border-border rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">
                Bunga
              </label>
              <div className="relative">
                <input
                  required
                  name="bungaTahunan"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.bungaTahunan === 0 ? "" : formData.bungaTahunan}
                  onChange={handleChange}
                  className="w-full border border-border rounded-xl pl-4 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                  %
                </span>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">
                Jumlah Tenor
              </label>
              <input
                required
                name="totalTenor"
                type="number"
                min="1"
                value={formData.totalTenor || ""}
                onChange={handleChange}
                className="w-full border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Bulan/Tahun"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">
                Tanggal Mulai
              </label>
              <input
                name="tanggalMulai"
                type="date"
                className="w-full border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">
                Sisa Tenor
              </label>
              <input
                required
                name="tenorSudahBayar"
                type="number"
                min="0"
                max={formData.totalTenor}
                value={formData.tenorSudahBayar === 0 ? "0" : formData.tenorSudahBayar}
                onChange={handleChange}
                className="w-full border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="adaTanggalCetak"
                  name="adaTanggalCetak"
                  checked={formData.adaTanggalCetak}
                  onChange={handleChange}
                  className="rounded border-border text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                />
                <label
                  htmlFor="adaTanggalCetak"
                  className="text-sm font-semibold text-card-foreground cursor-pointer"
                >
                  Ada Tanggal Cetak Tagihan?
                </label>
              </div>
            </div>

            {formData.adaTanggalCetak && (
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-card-foreground mb-1.5">
                  Tanggal Cetak
                </label>
                <div className="relative">
                  <input
                    required={formData.adaTanggalCetak}
                    name="tanggalCetak"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.tanggalCetak || ""}
                    onChange={handleChange}
                    className="w-full border border-border rounded-xl pl-4 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                    tgl
                  </span>
                </div>
              </div>
            )}

            <div className={`col-span-2 ${formData.adaTanggalCetak ? "sm:col-span-1" : ""}`}>
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">
                Jatuh Tempo
              </label>
              <div className="relative">
                <input
                  required
                  name="tanggalJatuhTempo"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.tanggalJatuhTempo || ""}
                  onChange={handleChange}
                  className="w-full border border-border rounded-xl pl-4 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                  tgl
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">
                Persentase Minimum Payment
              </label>
              <div className="relative">
                <input
                  required
                  name="persentaseMinPayment"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.persentaseMinPayment || ""}
                  onChange={handleChange}
                  className="w-full border border-border rounded-xl pl-4 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="10"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                  %
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Gunakan 100% jika Anda selalu melunasi penuh atau cicilan tetap.
              </p>
            </div>

            <div className="col-span-2 mt-2">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-card-foreground">
                  Biaya Admin / Langganan Lainnya
                </label>
                <button
                  type="button"
                  onClick={handleAddBiaya}
                  className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                >
                  <Plus size={14} /> Tambah
                </button>
              </div>

              {formData.biayaAdmin && formData.biayaAdmin.length > 0 ? (
                <div className="space-y-3 w-full">
                  {formData.biayaAdmin.map((b, i) => (
                    <div
                      key={b.id}
                      className="flex flex-col gap-2 bg-muted/30 p-3 rounded-xl border border-border"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nama Biaya"
                          value={b.namaBiaya}
                          onChange={(e) => handleUpdateBiaya(i, "namaBiaya", e.target.value)}
                          className="w-full border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        />
                        <select
                          value={b.tipeBiaya || "Nominal"}
                          onChange={(e) => handleUpdateBiaya(i, "tipeBiaya", e.target.value)}
                          className="border border-border rounded-lg px-2 py-1.5 bg-card focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs w-28 cursor-pointer"
                        >
                          <option value="Nominal">Nominal</option>
                          <option value="Persentase">Persen (%)</option>
                        </select>
                      </div>
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                        {b.tipeBiaya === "Persentase" ? (
                          <div className="relative w-full sm:w-1/2">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Persen dari Plafon"
                              value={b.persentase || ""}
                              onChange={(e) =>
                                handleUpdateBiaya(i, "persentase", parseFloat(e.target.value) || 0)
                              }
                              className="w-full border border-border rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-xs">
                              %
                            </span>
                          </div>
                        ) : (
                          <div className="relative w-full sm:w-1/2">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-xs">
                              Rp
                            </span>
                            <input
                              type="number"
                              min="0"
                              placeholder="Nominal"
                              value={b.nominal || ""}
                              onChange={(e) =>
                                handleUpdateBiaya(i, "nominal", parseFloat(e.target.value) || 0)
                              }
                              className="w-full border border-border rounded-lg pl-7 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 w-full sm:w-auto mt-2 sm:mt-0">
                          <input
                            type="checkbox"
                            id={`auto-${b.id}`}
                            checked={b.autodebetAktif}
                            onChange={(e) =>
                              handleUpdateBiaya(i, "autodebetAktif", e.target.checked)
                            }
                            className="rounded border-border text-blue-600 w-3.5 h-3.5"
                          />
                          <label
                            htmlFor={`auto-${b.id}`}
                            className="text-xs font-medium text-muted-foreground cursor-pointer whitespace-nowrap"
                          >
                            Autodebet
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveBiaya(i)}
                          className="p-1.5 text-muted-foreground/70 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto mt-2 sm:mt-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Belum ada biaya operasional tambahan.
                </p>
              )}
            </div>

            <div className="col-span-2 bg-blue-50/50 rounded-xl p-4 border border-blue-100 space-y-2 mt-2">
              <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm mb-1">
                <Calculator size={16} /> Estimasi Perhitungan Total Plafon:
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total + Bunga:</span>
                <span className="font-bold text-foreground">
                  {formatRupiah(totalTermasukBunga)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cicilan Per Tenor:</span>
                <span className="font-bold text-foreground">{formatRupiah(cicilanEstimasi)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 bg-muted/30 p-4 rounded-xl border border-border mt-2">
            <input
              type="checkbox"
              id="pengingatAktif"
              name="pengingatAktif"
              checked={formData.pengingatAktif}
              onChange={handleChange}
              className="mt-0.5 h-5 w-5 rounded border-border text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="pengingatAktif"
              className="text-sm font-semibold text-card-foreground cursor-pointer select-none"
            >
              Aktifkan pengingat pembayaran
              <p className="font-normal text-xs text-muted-foreground mt-0.5">
                Menerima notifikasi browser 3 hari sebelum jatuh tempo pembayaran.
              </p>
            </label>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 font-semibold text-muted-foreground hover:bg-muted transition-colors rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 font-semibold bg-blue-600 text-foreground hover:bg-blue-700 transition-colors rounded-xl shadow-sm"
            >
              Simpan Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
