import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Calendar,
  CalendarClock,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  MapPin,
  Plus,
  Users,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/app/app-shell";
import { Kosong, Panel, Pill } from "@/app/ui-bits";
import {
  type Meeting,
  getInitialMeetings,
  hariPendek,
  jamMenit,
  saveMeetings,
  sisaHari,
  tanggal,
  tanggalJam,
} from "@/lib/data";
import { useDataKlien } from "@/lib/portal";

export const Route = createFileRoute("/portal/jadwal")({
  head: () => ({
    meta: [
      { title: "Jadwal & Agenda Pertemuan — Portal Klien Konsultansi" },
      {
        name: "description",
        content:
          "Pusat agenda workshop, rapat koordinasi, dan tenggat deliverable konsultansi beserta tautan Google Meet langsung.",
      },
      { property: "og:title", content: "Jadwal & Agenda Engagement" },
      {
        property: "og:description",
        content: "Pantau rapat mendatang, jadwal penyerahan deliverable, dan arsip notula.",
      },
    ],
  }),
  component: PortalJadwal,
});

type FilterTipe = "semua" | "online" | "onsite" | "tenggat";

function PortalJadwal() {
  const qc = useQueryClient();
  const { jadwal, deliverables, proyek, namaProyek, klien, memuat } = useDataKlien();

  const [filter, setFilter] = useState<FilterTipe>("semua");
  const [proyekFilter, setProyekFilter] = useState<string>("semua");
  const [modalBuka, setModalBuka] = useState(false);
  const [detailMeeting, setDetailMeeting] = useState<Meeting | null>(null);

  // Form state
  const [judulForm, setJudulForm] = useState("");
  const [proyekIdForm, setProyekIdForm] = useState(proyek[0]?.id ?? "");
  const [tipeForm, setTipeForm] = useState<"online" | "onsite">("online");
  const [tanggalForm, setTanggalForm] = useState("2026-09-25");
  const [jamForm, setJamForm] = useState("10:00");
  const [durasiForm, setDurasiForm] = useState("60");
  const [lokasiForm, setLokasiForm] = useState("Google Meet");
  const [tautanForm, setTautanForm] = useState("https://meet.google.com/nra-stra-new");
  const [agendaForm, setAgendaForm] = useState("");
  const [pesertaForm, setPesertaForm] = useState("");

  const sekarang = Date.now();

  const daftarJadwalProyek =
    proyekFilter === "semua" ? jadwal : jadwal.filter((j) => j.project_id === proyekFilter);

  const mendatang = daftarJadwalProyek
    .filter((j) => new Date(j.mulai).getTime() >= sekarang - 3600_000 && j.status !== "selesai")
    .sort((a, b) => new Date(a.mulai).getTime() - new Date(b.mulai).getTime());

  const lampau = daftarJadwalProyek
    .filter((j) => !mendatang.some((m) => m.id === j.id))
    .sort((a, b) => (a.mulai < b.mulai ? 1 : -1));

  const tenggat = deliverables
    .filter((d) => d.jatuh_tempo && d.status !== "disetujui" && d.status !== "approved")
    .filter((d) => proyekFilter === "semua" || d.project_id === proyekFilter)
    .sort((a, b) => (a.jatuh_tempo! < b.jatuh_tempo! ? -1 : 1));

  // Nearest meeting
  const rapatTerdekat = mendatang[0] ?? null;

  // Filtered list according to tab
  const listTampil = (() => {
    if (filter === "online") return mendatang.filter((j) => j.tipe === "online");
    if (filter === "onsite") return mendatang.filter((j) => j.tipe === "onsite");
    return mendatang;
  })();

  const handleSalinLink = (link?: string | null) => {
    if (!link) {
      toast.info("Tautan pertemuan belum tersedia.");
      return;
    }
    navigator.clipboard?.writeText(link);
    toast.success("Tautan pertemuan disalin ke clipboard!");
  };

  const handleSimpanJadwal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulForm.trim()) {
      toast.error("Judul pertemuan wajib diisi.");
      return;
    }

    const mulaiWaktu = `${tanggalForm}T${jamForm}:00Z`;
    const targetProject = proyekIdForm || (proyek[0]?.id ?? null);
    const daftarPeserta = pesertaForm
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const newMeeting: Meeting = {
      id: "m-" + Date.now(),
      client_id: klien?.id ?? "c1",
      project_id: targetProject,
      judul: judulForm.trim(),
      agenda: agendaForm.trim() || null,
      mulai: mulaiWaktu,
      durasi_menit: parseInt(durasiForm, 10) || 60,
      lokasi: lokasiForm.trim() || (tipeForm === "online" ? "Google Meet" : "Kantor Klien"),
      tautan_meeting: tipeForm === "online" ? tautanForm.trim() || null : null,
      tipe: tipeForm,
      status: "terjadwal",
      peserta: daftarPeserta.length > 0 ? daftarPeserta : ["Tim Klien", "Tim Konsultan"],
      created_at: new Date().toISOString(),
    };

    const currentMeetings = getInitialMeetings();
    const updated = [newMeeting, ...currentMeetings];
    saveMeetings(updated);

    qc.setQueryData(["meetings"], updated);
    toast.success("Pertemuan baru berhasil dijadwalkan!");

    // Reset & close modal
    setJudulForm("");
    setAgendaForm("");
    setPesertaForm("");
    setModalBuka(false);
  };

  const handleTandaiSelesai = (meetingId: string) => {
    const currentMeetings = getInitialMeetings();
    const updated = currentMeetings.map((m) =>
      m.id === meetingId ? { ...m, status: "selesai" } : m,
    );
    saveMeetings(updated);
    qc.setQueryData(["meetings"], updated);
    toast.success("Status pertemuan diperbarui menjadi selesai.");
    if (detailMeeting?.id === meetingId) {
      setDetailMeeting(null);
    }
  };

  return (
    <AppShell
      title="Jadwal & Agenda"
      subtitle="Pertemuan koordinasi bersama tim konsultan dan tenggat deliverable"
      actions={
        <button
          type="button"
          onClick={() => setModalBuka(true)}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">Jadwalkan Rapat</span>
          <span className="sm:hidden">Rapat</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Quick Meeting Launcher / Highlight Rapat Terdekat */}
        {rapatTerdekat && (
          <div className="rounded-xl border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-5 shadow-2xs">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  {rapatTerdekat.tipe === "online" ? (
                    <Video className="size-6" />
                  ) : (
                    <MapPin className="size-6" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      Rapat Terdekat Berikutnya
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {namaProyek(rapatTerdekat.project_id)}
                    </span>
                  </div>
                  <h2 className="mt-1 text-base font-bold text-foreground sm:text-lg">
                    {rapatTerdekat.judul}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <Clock className="size-3.5 text-primary" />
                      {hariPendek(rapatTerdekat.mulai)}, {tanggal(rapatTerdekat.mulai)} ·{" "}
                      {jamMenit(rapatTerdekat.mulai)} WIB ({rapatTerdekat.durasi_menit} menit)
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      {rapatTerdekat.lokasi ?? "Google Meet"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:self-end lg:self-center">
                {rapatTerdekat.tautan_meeting ? (
                  <>
                    <a
                      href={rapatTerdekat.tautan_meeting}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                    >
                      <Video className="size-3.5" />
                      Masuk Ruang Rapat
                      <ExternalLink className="size-3" />
                    </a>
                    <button
                      onClick={() => handleSalinLink(rapatTerdekat.tautan_meeting)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-card/60 px-3 text-xs font-medium text-foreground hover:bg-accent transition-colors shadow-2xs"
                      title="Salin Tautan"
                    >
                      <Copy className="size-3.5" />
                      <span className="hidden sm:inline">Salin Link</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setDetailMeeting(rapatTerdekat)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    <MapPin className="size-3.5" />
                    Lihat Lokasi & Agenda
                  </button>
                )}
                <button
                  onClick={() => setDetailMeeting(rapatTerdekat)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-card/60 px-3 text-xs font-medium text-foreground hover:bg-accent transition-colors shadow-2xs"
                >
                  Detail Agenda
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Layout Utama: Kiri (Agenda Mendatang & Filter) + Kanan (Tenggat & Arsip) */}
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            {/* Filter Tabs & Proyek Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-card/60 p-1 shadow-2xs overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setFilter("semua")}
                  className={`h-7 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    filter === "semua"
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Semua Rapat ({mendatang.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("online")}
                  className={`h-7 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    filter === "online"
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Online Meet (
                  {mendatang.filter((j) => j.tipe === "online").length}
                  )
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("onsite")}
                  className={`h-7 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    filter === "onsite"
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Onsite / Kantor (
                  {mendatang.filter((j) => j.tipe === "onsite").length}
                  )
                </button>
              </div>

              {proyek.length > 1 && (
                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                  <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Proyek:</span>
                  <select
                    value={proyekFilter}
                    onChange={(e) => setProyekFilter(e.target.value)}
                    className="h-8 max-w-[200px] truncate rounded-lg border border-border/70 bg-card/60 px-2.5 text-xs font-medium text-foreground outline-none shadow-2xs"
                  >
                    <option value="semua">Semua Proyek</option>
                    {proyek.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* List Pertemuan */}
            <Panel title="Daftar Agenda & Pertemuan Mendatang">
              {listTampil.length === 0 ? (
                <Kosong
                  pesan={
                    memuat
                      ? "Memuat jadwal rapat…"
                      : "Belum ada agenda rapat untuk kriteria yang dipilih."
                  }
                />
              ) : (
                <ul className="space-y-3.5">
                  {listTampil.map((j) => {
                    const sisa = sisaHari(j.mulai.slice(0, 10));
                    const dateObj = new Date(j.mulai);
                    return (
                      <li
                        key={j.id}
                        className="group flex flex-col gap-3.5 rounded-xl border border-border/80 bg-background/60 p-4 transition-all hover:border-primary/40 hover:shadow-xs sm:flex-row sm:items-start"
                      >
                        {/* Tanggal Box */}
                        <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-card border border-border/70 shadow-2xs text-center">
                          <span className="text-lg font-bold leading-none text-foreground">
                            {dateObj.getDate()}
                          </span>
                          <span className="mt-1 text-[11px] font-semibold uppercase text-primary">
                            {dateObj.toLocaleDateString("id-ID", { month: "short" })}
                          </span>
                        </div>

                        {/* Konten Rapat */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-foreground tracking-tight">
                              {j.judul}
                            </h3>
                            <Pill
                              value={j.tipe === "online" ? "berjalan" : "aktif"}
                              label={j.tipe === "online" ? "Google Meet" : "Onsite"}
                            />
                            {sisa !== null && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  sisa <= 1
                                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {sisa <= 0 ? "Hari ini" : `${sisa} hari lagi`}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs font-medium text-muted-foreground">
                            {namaProyek(j.project_id)}
                          </p>

                          {j.agenda && (
                            <p className="mt-2 text-xs text-foreground/80 leading-relaxed line-clamp-2">
                              {j.agenda}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 font-medium text-foreground">
                              <Clock className="size-3 text-primary" />
                              {jamMenit(j.mulai)} WIB · {j.durasi_menit} mnt
                            </span>
                            <span className="flex items-center gap-1">
                              {j.tipe === "online" ? (
                                <Video className="size-3 text-primary" />
                              ) : (
                                <MapPin className="size-3 text-muted-foreground" />
                              )}
                              {j.lokasi ?? "Online Meet"}
                            </span>
                            {j.peserta && j.peserta.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="size-3" />
                                {j.peserta.length} peserta
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 sm:flex-col sm:items-end shrink-0 pt-2 sm:pt-0">
                          {j.tautan_meeting ? (
                            <a
                              href={j.tautan_meeting}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-2.5 text-xs font-medium transition-colors"
                            >
                              <Video className="size-3" />
                              Buka Link
                            </a>
                          ) : null}
                          <button
                            onClick={() => setDetailMeeting(j)}
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-border/70 bg-card/60 px-2.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                          >
                            Detail
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </div>

          {/* Kolom Kanan: Tenggat Deliverable & Riwayat */}
          <div className="space-y-6">
            {/* Tenggat Deliverable Terdekat */}
            <Panel title="Tenggat Deliverable Penting">
              {tenggat.length === 0 ? (
                <Kosong pesan="Tidak ada tenggat deliverable yang tertunda." />
              ) : (
                <ul className="divide-y divide-border/60">
                  {tenggat.slice(0, 5).map((d) => {
                    const sisa = sisaHari(d.jatuh_tempo);
                    return (
                      <li key={d.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold text-foreground">{d.judul}</p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {namaProyek(d.project_id)} · Versi {d.versi ?? "v1.0"}
                            </p>
                          </div>
                          <Pill
                            value={d.status === "review" ? "tertahan" : "perencanaan"}
                            label={d.status === "review" ? "Review" : "Draf"}
                          />
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <CalendarClock className="size-3 text-primary" />
                          <span>{tanggal(d.jatuh_tempo)}</span>
                          {sisa !== null && (
                            <span
                              className={`font-medium ${
                                sisa < 0
                                  ? "text-rose-500"
                                  : sisa <= 7
                                    ? "text-amber-500"
                                    : "text-muted-foreground"
                              }`}
                            >
                              · {sisa < 0 ? `lewat ${Math.abs(sisa)} hari` : `${sisa} hari lagi`}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>

            {/* Riwayat Pertemuan Selesai */}
            <Panel title="Riwayat Pertemuan Selesai">
              {lampau.length === 0 ? (
                <Kosong pesan="Belum ada riwayat pertemuan yang selesai." />
              ) : (
                <ul className="divide-y divide-border/60">
                  {lampau.map((j) => (
                    <li key={j.id} className="py-2.5 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{j.judul}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {tanggal(j.mulai)} · {jamMenit(j.mulai)} WIB
                          </p>
                          {j.catatan_hasil && (
                            <p className="mt-1 text-[11px] italic text-muted-foreground line-clamp-1">
                              "{j.catatan_hasil}"
                            </p>
                          )}
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                          <CheckCircle2 className="size-3" /> Selesai
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </div>
      </div>

      {/* Modal: Tambah Jadwal Baru */}
      {modalBuka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">Jadwalkan Pertemuan Baru</h3>
              </div>
              <button
                onClick={() => setModalBuka(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSimpanJadwal} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Judul Pertemuan / Sesi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Sesi Evaluasi Sprint 3 & Integrasi Data"
                  value={judulForm}
                  onChange={(e) => setJudulForm(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Proyek Terkait</label>
                  <select
                    value={proyekIdForm}
                    onChange={(e) => setProyekIdForm(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
                  >
                    {proyek.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Format Pertemuan
                  </label>
                  <select
                    value={tipeForm}
                    onChange={(e) => setTipeForm(e.target.value as "online" | "onsite")}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
                  >
                    <option value="online">Online (Video Meet)</option>
                    <option value="onsite">Onsite (Tatap Muka)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={tanggalForm}
                    onChange={(e) => setTanggalForm(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Waktu Mulai</label>
                  <input
                    type="time"
                    required
                    value={jamForm}
                    onChange={(e) => setJamForm(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Durasi</label>
                  <select
                    value={durasiForm}
                    onChange={(e) => setDurasiForm(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
                  >
                    <option value="30">30 menit</option>
                    <option value="45">45 menit</option>
                    <option value="60">60 menit</option>
                    <option value="90">90 menit</option>
                    <option value="120">120 menit</option>
                  </select>
                </div>
              </div>

              {tipeForm === "online" ? (
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Tautan Google Meet / Zoom
                  </label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={tautanForm}
                    onChange={(e) => setTautanForm(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Lokasi / Ruang Rapat
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Ruang Rapat Eksekutif Lt. 4"
                    value={lokasiForm}
                    onChange={(e) => setLokasiForm(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Agenda Pembahasan
                </label>
                <textarea
                  rows={2}
                  placeholder="Poin-poin utama yang akan dibahas bersama tim..."
                  value={agendaForm}
                  onChange={(e) => setAgendaForm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background p-2 text-xs outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Peserta (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Budi Santoso, Wira Pratama, Tim IT"
                  value={pesertaForm}
                  onChange={(e) => setPesertaForm(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalBuka(false)}
                  className="h-8 px-3 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-xs"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail & Agenda Rapat */}
      {detailMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-[11px] font-semibold text-primary uppercase">
                  {namaProyek(detailMeeting.project_id)}
                </span>
                <h3 className="text-base font-bold text-foreground mt-0.5">
                  {detailMeeting.judul}
                </h3>
              </div>
              <button
                onClick={() => setDetailMeeting(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-foreground/90">
              <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-xl">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Waktu Pertemuan</span>
                  <span className="font-semibold text-foreground">
                    {tanggalJam(detailMeeting.mulai)} WIB
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Durasi & Format</span>
                  <span className="font-semibold text-foreground">
                    {detailMeeting.durasi_menit} menit · {detailMeeting.tipe}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">
                  Lokasi / Media Pertemuan:
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-background">
                  <span className="flex items-center gap-1.5 font-medium truncate">
                    {detailMeeting.tipe === "online" ? (
                      <Video className="size-4 text-primary" />
                    ) : (
                      <MapPin className="size-4 text-muted-foreground" />
                    )}
                    {detailMeeting.lokasi ?? "Google Meet"}
                  </span>
                  {detailMeeting.tautan_meeting && (
                    <a
                      href={detailMeeting.tautan_meeting}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary font-semibold hover:underline shrink-0 ml-2"
                    >
                      Buka Ruang Meet <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </div>

              {detailMeeting.agenda && (
                <div>
                  <span className="font-semibold text-foreground block mb-1">
                    Agenda Pembahasan:
                  </span>
                  <p className="p-3 rounded-lg border border-border/80 bg-background leading-relaxed">
                    {detailMeeting.agenda}
                  </p>
                </div>
              )}

              {detailMeeting.peserta && detailMeeting.peserta.length > 0 && (
                <div>
                  <span className="font-semibold text-foreground block mb-1">Daftar Hadir / PIC:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {detailMeeting.peserta.map((p, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11px]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {detailMeeting.catatan_hasil && (
                <div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                    Catatan Notula Selesai:
                  </span>
                  <p className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                    {detailMeeting.catatan_hasil}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              {detailMeeting.status !== "selesai" ? (
                <button
                  onClick={() => handleTandaiSelesai(detailMeeting.id)}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 text-xs font-semibold transition-colors"
                >
                  <CheckCircle2 className="size-3.5" />
                  Tandai Sudah Selesai
                </button>
              ) : (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-500" /> Selesai
                </span>
              )}

              <button
                onClick={() => setDetailMeeting(null)}
                className="h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
