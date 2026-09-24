import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  ExternalLink,
  FileCheck2,
  FileEdit,
  FileText,
  HelpCircle,
  Layers,
  ListTodo,
  Loader2,
  MessageSquare,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/app/app-shell";
import { Bar, Kosong, Panel, Pill } from "@/app/ui-bits";
import {
  type Deliverable,
  getInitialDeliverables,
  rupiahRingkas,
  saveDeliverables,
  sisaHari,
  statusProyek,
  statusTugas,
  tanggal,
} from "@/lib/data";
import { useDataKlien } from "@/lib/portal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/progres")({
  head: () => ({
    meta: [
      { title: "Progres Engagement & Milestone — Portal Klien Konsultansi" },
      {
        name: "description",
        content:
          "Pantau progres fase konsultansi, persetujuan deliverable, status pekerjaan, dan jadwal milestone engagement Anda secara transparan.",
      },
      { property: "og:title", content: "Progres Engagement & Milestone" },
      {
        property: "og:description",
        content:
          "Visualisasi fase kerja, deliverable sign-off, dan status pekerjaan engagement Anda.",
      },
    ],
  }),
  component: PortalProgres,
});

const DEFAULT_PHASES = [
  {
    id: "fase-1",
    nama: "Fase 1: Diagnostik & Audit As-Is",
    status: "selesai",
    progres: 100,
    deskripsi: "Audit infrastruktur eksisting, wawancara stakeholder, pemetaan pain points.",
  },
  {
    id: "fase-2",
    nama: "Fase 2: Perancangan Roadmap & Formulasi",
    status: "berjalan",
    progres: 65,
    deskripsi: "Penyusunan arsitektur target, evaluasi vendor ERP, dan formulasi business case.",
  },
  {
    id: "fase-3",
    nama: "Fase 3: Implementasi Sistem & Pelatihan",
    status: "perencanaan",
    progres: 0,
    deskripsi: "Penerapan modul, migrasi data bertahap, dan pelatihan pengguna akhir.",
  },
  {
    id: "fase-4",
    nama: "Fase 4: Evaluasi Pasca-GoLive & Handover",
    status: "perencanaan",
    progres: 0,
    deskripsi: "Review stabilitas sistem, transfer knowledge, dan penutupan engagement.",
  },
];

function PortalProgres() {
  const qc = useQueryClient();
  const { proyek, tugas, deliverables, klien, memuat } = useDataKlien();

  const [proyekPilihan, setProyekPilihan] = useState<string>("semua");
  const [faseAktif, setFaseAktif] = useState<string>("semua");

  // Modal Sign-off state
  const [modalSignOff, setModalSignOff] = useState<Deliverable | null>(null);
  const [namaApprover, setNamaApprover] = useState(klien?.pic ?? "Budi Santoso");
  const [jabatanApprover, setJabatanApprover] = useState("VP Technology & Operation");
  const [catatanSignOff, setCatatanSignOff] = useState("");
  const [setujuChecked, setSetujuChecked] = useState(false);

  // Modal Revisi state
  const [modalRevisi, setModalRevisi] = useState<Deliverable | null>(null);
  const [catatanRevisi, setCatatanRevisi] = useState("");

  const proyekTampil =
    proyekPilihan === "semua" ? proyek : proyek.filter((p) => p.id === proyekPilihan);

  const activeProject = proyekTampil[0] ?? null;

  // Deliverables requiring approval
  const delivButuhReview = deliverables.filter(
    (d) =>
      d.status === "review" && (proyekPilihan === "semua" || d.project_id === proyekPilihan),
  );

  // Filter deliverables by phase if selected
  const deliverablesTampil = deliverables
    .filter((d) => proyekPilihan === "semua" || d.project_id === proyekPilihan)
    .filter((d) => {
      if (faseAktif === "semua") return true;
      const targetPhase = DEFAULT_PHASES.find((f) => f.id === faseAktif);
      return d.fase ? d.fase.includes(targetPhase?.nama.slice(0, 6) ?? "") : true;
    });

  const handleBeriApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSignOff) return;
    if (!setujuChecked) {
      toast.error("Silakan centang pernyataan persetujuan terlebih dahulu.");
      return;
    }

    const currentDelivs = getInitialDeliverables();
    const updated = currentDelivs.map((d) =>
      d.id === modalSignOff.id
        ? {
            ...d,
            status: "approved" as const,
            disetujui_oleh: `${namaApprover.trim()} (${jabatanApprover.trim()})`,
            disetujui_pada: new Date().toISOString(),
            catatan: catatanSignOff.trim() || "Disetujui secara formal oleh klien.",
          }
        : d,
    );

    saveDeliverables(updated);
    qc.setQueryData(["deliverables"], updated);
    toast.success(`Deliverable "${modalSignOff.judul}" resmi disetujui & tercatat!`);
    setModalSignOff(null);
    setSetujuChecked(false);
    setCatatanSignOff("");
  };

  const handleKirimRevisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalRevisi) return;
    if (!catatanRevisi.trim()) {
      toast.error("Mohon sertakan poin catatan revisi.");
      return;
    }

    const currentDelivs = getInitialDeliverables();
    const updated = currentDelivs.map((d) =>
      d.id === modalRevisi.id
        ? {
            ...d,
            status: "rejected" as const,
            catatan: `Revisi diminta: ${catatanRevisi.trim()}`,
          }
        : d,
    );

    saveDeliverables(updated);
    qc.setQueryData(["deliverables"], updated);
    toast.info(`Catatan revisi untuk "${modalRevisi.judul}" telah diteruskan ke konsultan.`);
    setModalRevisi(null);
    setCatatanRevisi("");
  };

  return (
    <AppShell
      title="Progres & Milestone"
      subtitle="Fase kerja engagement, status deliverable, dan persetujuan formal"
      actions={
        <Link
          to="/portal/pesan"
          className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-lg border border-border/70 bg-card/60 hover:bg-accent text-xs font-medium text-foreground transition-colors shadow-2xs whitespace-nowrap"
        >
          <MessageSquare className="size-3.5" />
          <span className="hidden sm:inline">Diskusikan Progres</span>
          <span className="sm:hidden">Diskusi</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Blocker & Action Required Callout Banner */}
        {delivButuhReview.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                      Tindakan Diperlukan
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {delivButuhReview.length} Dokumen Menunggu Review
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground mt-1">
                    {delivButuhReview[0]?.judul}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
                    Dokumen ini telah diselesaikan oleh konsultan dan menunggu persetujuan
                    sign-off dari Anda untuk melanjutkan ke tahapan fase berikutnya.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <button
                  onClick={() => {
                    setNamaApprover(klien?.pic ?? "Budi Santoso");
                    setModalSignOff(delivButuhReview[0]!);
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 text-white dark:text-gray-950 px-3 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <ShieldCheck className="size-3.5" />
                  Beri Persetujuan
                </button>
                <button
                  onClick={() => setModalRevisi(delivButuhReview[0]!)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-amber-500/30 bg-card/70 hover:bg-amber-500/10 text-xs font-medium text-foreground px-2.5 transition-colors"
                >
                  Minta Revisi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phase Stepper Tracker */}
        <div className="rounded-xl border border-border/80 bg-card/50 p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                Alur Fase & Milestone Transformasi
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Klik salah satu fase di bawah untuk meninjau deliverable dan target spesifik
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              {proyek.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Proyek:</span>
                  <select
                    value={proyekPilihan}
                    onChange={(e) => setProyekPilihan(e.target.value)}
                    className="h-7 max-w-[180px] truncate rounded-lg border border-border/70 bg-card px-2 text-xs font-medium text-foreground outline-none shadow-2xs"
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
              <button
                type="button"
                onClick={() => setFaseAktif("semua")}
                className={`h-7 px-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  faseAktif === "semua"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                Lihat Semua Fase
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DEFAULT_PHASES.map((f, idx) => {
              const isSelected = faseAktif === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setFaseAktif(faseAktif === f.id ? "semua" : f.id)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/40"
                      : "border-border/70 bg-background/60 hover:border-primary/40 hover:bg-accent/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-muted-foreground">
                      <span>Langkah 0{idx + 1}</span>
                      {f.status === "selesai" ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="size-3.5" /> Selesai
                        </span>
                      ) : f.status === "berjalan" ? (
                        <span className="flex items-center gap-1 text-primary font-bold">
                          <Loader2 className="size-3 animate-spin" /> Sedang Berjalan
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Circle className="size-3" /> Terjadwal
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                      {f.nama}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {f.deskripsi}
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-1 font-medium">
                      <span>Penyelesaian</span>
                      <span className="font-semibold text-foreground">{f.progres}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          f.status === "selesai"
                            ? "bg-emerald-500"
                            : f.status === "berjalan"
                              ? "bg-primary"
                              : "bg-muted-foreground/30"
                        }`}
                        style={{ width: `${f.progres}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlight Ringkasan Proyek & KPI */}
        {activeProject && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border/80 bg-background/60 p-3.5 shadow-2xs">
              <span className="text-xs text-muted-foreground block">Tingkat Progres Proyek</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {activeProject.progres}%
                </span>
                <Pill
                  value={activeProject.status}
                  label={statusProyek[activeProject.status] ?? activeProject.status}
                />
              </div>
              <div className="mt-2">
                <Bar value={activeProject.progres} />
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/60 p-3.5 shadow-2xs">
              <span className="text-xs text-muted-foreground block">Deliverable Disetujui</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {deliverables.filter((d) => d.status === "approved" || d.status === "selesai").length}
                </span>
                <span className="text-xs text-muted-foreground">
                  dari {deliverables.length} deliverable
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-2 block">
                {deliverables.filter((d) => d.status === "review").length} dokumen menunggu sign-off
              </span>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/60 p-3.5 shadow-2xs">
              <span className="text-xs text-muted-foreground block">Tenggat Target Engagement</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg font-bold text-foreground">
                  {tanggal(activeProject.tanggal_selesai)}
                </span>
              </div>
              <span className="text-[11px] text-primary font-medium mt-2 block">
                {sisaHari(activeProject.tanggal_selesai) ?? 0} hari tersisa
              </span>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/60 p-3.5 shadow-2xs">
              <span className="text-xs text-muted-foreground block">Lead Consultant</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-sm font-bold text-foreground truncate">
                  {activeProject.konsultan ?? "Wira Pratama"}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-2 block">
                Nilai: {rupiahRingkas(Number(activeProject.nilai))}
              </span>
            </div>
          </div>
        )}

        {/* Section Deliverables & Approval Hub */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Panel
              title={
                faseAktif === "semua"
                  ? "Deliverables & Dokumen Hasil Kerja"
                  : `Deliverables (${DEFAULT_PHASES.find((f) => f.id === faseAktif)?.nama})`
              }
            >
              {deliverablesTampil.length === 0 ? (
                <Kosong pesan="Belum ada deliverable untuk filter fase yang dipilih." />
              ) : (
                <ul className="space-y-3">
                  {deliverablesTampil.map((d) => {
                    const isApproved = d.status === "approved" || d.status === "selesai";
                    const isReview = d.status === "review";
                    const isRejected = d.status === "rejected";

                    return (
                      <li
                        key={d.id}
                        className={`rounded-xl border p-4 transition-all ${
                          isReview
                            ? "border-amber-500/40 bg-amber-500/5"
                            : isApproved
                              ? "border-emerald-500/30 bg-emerald-500/5"
                              : "border-border/70 bg-background/50"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-bold text-foreground">{d.judul}</h3>
                              <span className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-foreground">
                                Versi {d.versi ?? "v1.0"}
                              </span>
                              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                {d.jenis}
                              </span>
                            </div>

                            {d.fase && (
                              <p className="mt-1 text-xs text-muted-foreground font-medium">
                                {d.fase}
                              </p>
                            )}

                            {d.catatan && (
                              <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed bg-background/70 p-2 rounded-lg border border-border/50">
                                {d.catatan}
                              </p>
                            )}

                            {isApproved && d.disetujui_oleh && (
                              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                                <FileCheck2 className="size-3.5 shrink-0" />
                                <span>Disahkan oleh: {d.disetujui_oleh}</span>
                                {d.disetujui_pada && (
                                  <span>· {tanggal(d.disetujui_pada)}</span>
                                )}
                              </div>
                            )}

                            <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="size-3 text-primary" />
                              <span>Jatuh tempo: {tanggal(d.jatuh_tempo)}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                            {isApproved ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                                <CheckCircle2 className="size-3.5" /> Disetujui
                              </span>
                            ) : isReview ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setNamaApprover(klien?.pic ?? "Budi Santoso");
                                    setModalSignOff(d);
                                  }}
                                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-2.5 transition-colors shadow-2xs cursor-pointer"
                                >
                                  <ShieldCheck className="size-3.5" />
                                  Sign-off
                                </button>
                                <button
                                  onClick={() => setModalRevisi(d)}
                                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-border/70 bg-card/80 hover:bg-accent text-xs font-medium text-foreground px-2 transition-colors cursor-pointer"
                                >
                                  Revisi
                                </button>
                              </div>
                            ) : isRejected ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-1 rounded-lg">
                                Perlu Perbaikan Konsultan
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                                Draf Konsultan
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </div>

          {/* Kolom Kanan: Checklist Pekerjaan Tim Konsultan & Log Keputusan */}
          <div className="space-y-6">
            <Panel title="Pekerjaan Sprint Konsultan">
              {tugas.length === 0 ? (
                <Kosong pesan="Belum ada daftar pekerjaan aktif." />
              ) : (
                <ul className="space-y-2.5">
                  {tugas.slice(0, 6).map((t) => {
                    const sisa = sisaHari(t.tenggat);
                    const isSelesai = t.status === "selesai";
                    return (
                      <li
                        key={t.id}
                        className="flex items-start gap-2.5 p-2 rounded-lg border border-border/50 bg-background/40"
                      >
                        {isSelesai ? (
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="mt-0.5 size-4 shrink-0 text-primary" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-xs font-semibold",
                              isSelesai ? "text-muted-foreground line-through" : "text-foreground",
                            )}
                          >
                            {t.judul}
                          </p>
                          <div className="mt-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>PJ: {t.penanggung_jawab}</span>
                            <span>{tanggal(t.tenggat)}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>

            <Panel title="Log Keputusan & Sign-off Engagement">
              <div className="space-y-3 text-xs">
                <div className="rounded-lg border border-border/70 bg-card/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Sign-off Dokumen As-Is</span>
                    <span className="text-[10px] text-muted-foreground">05 Juli 2026</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Disahkan oleh Budi Santoso (VP Technology). Ruang lingkup diagnostik disepakati.
                  </p>
                </div>

                <div className="rounded-lg border border-border/70 bg-card/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Persetujuan PMO & SLA</span>
                    <span className="text-[10px] text-muted-foreground">01 September 2026</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Tim inti konsultansi All in One dan PIC operasional klien resmi dibentuk.
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {/* Modal: Sign-off Persetujuan Deliverable */}
      {modalSignOff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-foreground">Persetujuan Sign-off Dokumen</h3>
              </div>
              <button
                onClick={() => setModalSignOff(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs">
              <span className="text-emerald-800 dark:text-emerald-300 font-semibold block">
                Deliverable yang akan disahkan:
              </span>
              <p className="text-foreground font-bold mt-1 text-sm">{modalSignOff.judul}</p>
              <p className="text-muted-foreground mt-0.5">
                Versi: {modalSignOff.versi ?? "v1.0"} · Jenis: {modalSignOff.jenis}
              </p>
            </div>

            <form onSubmit={handleBeriApproval} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Nama Penandatangan / Pemberi Kuasa *
                </label>
                <input
                  type="text"
                  required
                  value={namaApprover}
                  onChange={(e) => setNamaApprover(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Jabatan / Representasi Perusahaan *
                </label>
                <input
                  type="text"
                  required
                  value={jabatanApprover}
                  onChange={(e) => setJabatanApprover(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Catatan Pengesahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Misal: Disetujui penuh dengan arahan penyesuaian SLA tim helpdesk pada sprint berikutnya."
                  value={catatanSignOff}
                  onChange={(e) => setCatatanSignOff(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background p-2 text-xs outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setujuChecked}
                    onChange={(e) => setSetujuChecked(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-foreground leading-snug">
                    Saya menyatakan bahwa deliverable ini telah diperiksa secara seksama dan
                    disetujui sesuai dengan ruang lingkup perjanjian kerja konsultansi.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalSignOff(null)}
                  className="h-8 px-3 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs"
                >
                  <Check className="size-3.5" />
                  Sahkan & Tanda Tangani
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Minta Revisi Deliverable */}
      {modalRevisi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileEdit className="size-5 text-amber-500" />
                <h3 className="text-base font-bold text-foreground">Ajukan Catatan Revisi</h3>
              </div>
              <button
                onClick={() => setModalRevisi(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="text-xs">
              <span className="text-muted-foreground">Deliverable:</span>
              <p className="font-bold text-foreground text-sm mt-0.5">{modalRevisi.judul}</p>
            </div>

            <form onSubmit={handleKirimRevisi} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Poin Masukan & Perbaikan untuk Tim Konsultan *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan bab atau halaman yang perlu diperbaiki, data tambahan yang dibutuhkan, atau poin klarifikasi..."
                  value={catatanRevisi}
                  onChange={(e) => setCatatanRevisi(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background p-2.5 text-xs outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalRevisi(null)}
                  className="h-8 px-3 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-xs"
                >
                  Kirim Masukan Revisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
