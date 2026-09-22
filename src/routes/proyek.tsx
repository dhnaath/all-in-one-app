import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  Kanban,
  LayoutGrid,
  List,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/app/app-shell";
import { Bar, Kosong, Panel, Pill } from "@/app/ui-bits";
import { CustomWorkspaceSection } from "@/features/launcher/CustomWorkspaceSection";
import { cn } from "@/lib/utils";
import {
  type Client,
  type Deliverable,
  type Project,
  type Task,
  clientsQuery,
  deliverablesQuery,
  getInitialProjects,
  projectsQuery,
  rupiah,
  rupiahRingkas,
  saveProjects,
  sisaHari,
  statusProyek,
  tanggal,
  tasksQuery,
} from "@/lib/data";

export const Route = createFileRoute("/proyek")({
  head: () => ({
    meta: [
      { title: "Proyek Konsultansi — Client OS Konsultan Manajemen" },
      {
        name: "description",
        content:
          "Pusat manajemen proyek konsultansi lengkap dengan papan kanban, pelacak deliverable, progres milestone, dan rincian kontrak lintas klien.",
      },
      { property: "og:title", content: "Proyek Konsultansi Management" },
      {
        property: "og:description",
        content:
          "Pantau dan kelola seluruh penugasan konsultansi mulai dari fase perencanaan hingga sign-off selesai.",
      },
    ],
  }),
  component: HalamanProyek,
});

const filterStatus = ["semua", "berjalan", "perencanaan", "tertahan", "selesai"] as const;
type ViewMode = "grid" | "kanban" | "tabel";

const BIDANG_KONSULTANSI = [
  "Teknologi & ERP",
  "Supply Chain & Operasi",
  "M&A & Finansial",
  "Keamanan Siber & Tata Kelola",
  "Strategi Bisnis & Transformasi",
  "Operasional Internal",
];

function HalamanProyek() {
  const qc = useQueryClient();
  const [aktifStatus, setAktifStatus] = useState<string>("semua");
  const [klienFilter, setKlienFilter] = useState<string>("semua");
  const [kataKunci, setKataKunci] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Modal states
  const [modalFormBuka, setModalFormBuka] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [hapusConfirmId, setHapusConfirmId] = useState<string | null>(null);

  // Form states
  const [formClientId, setFormClientId] = useState<string>("c1");
  const [formNama, setFormNama] = useState("");
  const [formBidang, setFormBidang] = useState(BIDANG_KONSULTANSI[0]);
  const [formRingkasan, setFormRingkasan] = useState("");
  const [formStatus, setFormStatus] = useState<string>("berjalan");
  const [formPrioritas, setFormPrioritas] = useState<string>("tinggi");
  const [formTglMulai, setFormTglMulai] = useState("2026-09-01");
  const [formTglSelesai, setFormTglSelesai] = useState("2026-12-31");
  const [formProgres, setFormProgres] = useState<number>(30);
  const [formNilai, setFormNilai] = useState<string>("250000000");
  const [formKonsultan, setFormKonsultan] = useState("Wira Pratama & Tim");

  const [projects, clients, tasks, deliverables] = useQueries({
    queries: [projectsQuery, clientsQuery, tasksQuery, deliverablesQuery],
  });

  const daftarSemuaProyek = projects.data ?? [];
  const daftarKlien = clients.data ?? [];
  const daftarTugas = tasks.data ?? [];
  const daftarDeliv = deliverables.data ?? [];

  // Helper find client name
  const getKlienInfo = (id: string | null) => {
    if (!id) return { nama: "Internal All in One", id: null, pic: "Tim Internal" };
    const k = daftarKlien.find((c) => c.id === id);
    return k ?? { nama: "Klien Tidak Diketahui", id, pic: "—" };
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return daftarSemuaProyek
      .filter((p) => (aktifStatus === "semua" ? true : p.status === aktifStatus))
      .filter((p) => (klienFilter === "semua" ? true : p.client_id === klienFilter))
      .filter((p) => {
        if (!kataKunci.trim()) return true;
        const q = kataKunci.toLowerCase();
        const client = getKlienInfo(p.client_id);
        return (
          p.nama.toLowerCase().includes(q) ||
          client.nama.toLowerCase().includes(q) ||
          (p.ringkasan && p.ringkasan.toLowerCase().includes(q)) ||
          (p.konsultan && p.konsultan.toLowerCase().includes(q)) ||
          (p.bidang && p.bidang.toLowerCase().includes(q))
        );
      });
  }, [daftarSemuaProyek, aktifStatus, klienFilter, kataKunci, daftarKlien]);

  // KPI Portfolio calculations
  const totalNilaiPortofolio = useMemo(() => {
    return daftarSemuaProyek.reduce((acc, p) => acc + (Number(p.nilai) || 0), 0);
  }, [daftarSemuaProyek]);

  const jumlahProyekBerjalan = useMemo(() => {
    return daftarSemuaProyek.filter((p) => p.status === "berjalan").length;
  }, [daftarSemuaProyek]);

  const rataProgres = useMemo(() => {
    if (daftarSemuaProyek.length === 0) return 0;
    const sum = daftarSemuaProyek.reduce((acc, p) => acc + (p.progres || 0), 0);
    return Math.round(sum / daftarSemuaProyek.length);
  }, [daftarSemuaProyek]);

  const jumlahTertahan = useMemo(() => {
    return daftarSemuaProyek.filter((p) => p.status === "tertahan").length;
  }, [daftarSemuaProyek]);

  // Open modal for Create
  const handleBukaTambah = () => {
    setEditTarget(null);
    setFormClientId(daftarKlien[0]?.id ?? "c1");
    setFormNama("");
    setFormBidang(BIDANG_KONSULTANSI[0]);
    setFormRingkasan("");
    setFormStatus("berjalan");
    setFormPrioritas("tinggi");
    setFormTglMulai("2026-09-01");
    setFormTglSelesai("2026-12-31");
    setFormProgres(20);
    setFormNilai("250000000");
    setFormKonsultan("Wira Pratama & Tim");
    setModalFormBuka(true);
  };

  // Open modal for Edit
  const handleBukaEdit = (p: Project) => {
    setEditTarget(p);
    setFormClientId(p.client_id ?? "internal");
    setFormNama(p.nama);
    setFormBidang(p.bidang ?? BIDANG_KONSULTANSI[0]);
    setFormRingkasan(p.ringkasan ?? "");
    setFormStatus(p.status);
    setFormPrioritas(p.prioritas);
    setFormTglMulai(p.tanggal_mulai ?? "2026-09-01");
    setFormTglSelesai(p.tanggal_selesai ?? "2026-12-31");
    setFormProgres(p.progres);
    setFormNilai(String(p.nilai));
    setFormKonsultan(p.konsultan ?? "Wira Pratama");
    setModalFormBuka(true);
  };

  // Save Project (Create / Update)
  const handleSimpanProyek = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) {
      toast.error("Nama penugasan proyek wajib diisi.");
      return;
    }

    const current = getInitialProjects();
    const targetClientId = formClientId === "internal" ? null : formClientId;

    if (editTarget) {
      // Edit
      const updated = current.map((p) =>
        p.id === editTarget.id
          ? {
              ...p,
              client_id: targetClientId,
              nama: formNama.trim(),
              bidang: formBidang,
              ringkasan: formRingkasan.trim() || null,
              status: formStatus,
              prioritas: formPrioritas,
              tanggal_mulai: formTglMulai,
              tanggal_selesai: formTglSelesai,
              progres: formProgres,
              nilai: Number(formNilai) || 0,
              konsultan: formKonsultan.trim(),
            }
          : p,
      );
      saveProjects(updated);
      qc.setQueryData(["projects"], updated);
      toast.success(`Proyek "${formNama.trim()}" berhasil diperbarui!`);
    } else {
      // Create
      const newProj: Project = {
        id: "p-" + Date.now(),
        client_id: targetClientId,
        nama: formNama.trim(),
        bidang: formBidang,
        ringkasan: formRingkasan.trim() || null,
        status: formStatus,
        prioritas: formPrioritas,
        tanggal_mulai: formTglMulai,
        tanggal_selesai: formTglSelesai,
        progres: formProgres,
        nilai: Number(formNilai) || 0,
        konsultan: formKonsultan.trim(),
      };
      const updated = [newProj, ...current];
      saveProjects(updated);
      qc.setQueryData(["projects"], updated);
      toast.success(`Proyek baru "${formNama.trim()}" berhasil ditambahkan!`);
    }

    setModalFormBuka(false);
  };

  // Quick Status change from card/kanban
  const handleUbahStatusCepat = (projectId: string, newStatus: string) => {
    const current = getInitialProjects();
    const updated = current.map((p) =>
      p.id === projectId
        ? {
            ...p,
            status: newStatus,
            progres: newStatus === "selesai" ? 100 : p.progres,
          }
        : p,
    );
    saveProjects(updated);
    qc.setQueryData(["projects"], updated);
    toast.success(`Status proyek diubah ke "${statusProyek[newStatus] ?? newStatus}"`);
    if (detailProject?.id === projectId) {
      setDetailProject({
        ...detailProject,
        status: newStatus,
        progres: newStatus === "selesai" ? 100 : detailProject.progres,
      });
    }
  };

  // Quick Progress increment / decrement
  const handleUbahProgresCepat = (projectId: string, delta: number) => {
    const current = getInitialProjects();
    const updated = current.map((p) => {
      if (p.id === projectId) {
        const next = Math.max(0, Math.min(100, p.progres + delta));
        const nextStatus = next === 100 ? "selesai" : p.status === "selesai" ? "berjalan" : p.status;
        return { ...p, progres: next, status: nextStatus };
      }
      return p;
    });
    saveProjects(updated);
    qc.setQueryData(["projects"], updated);
  };

  // Delete project
  const handleHapusProyek = (id: string) => {
    const current = getInitialProjects();
    const target = current.find((p) => p.id === id);
    const updated = current.filter((p) => p.id !== id);
    saveProjects(updated);
    qc.setQueryData(["projects"], updated);
    toast.success(`Proyek "${target?.nama ?? "Proyek"}" berhasil dihapus.`);
    setHapusConfirmId(null);
    if (detailProject?.id === id) setDetailProject(null);
  };

  return (
    <AppShell
      title="Proyek Konsultansi"
      subtitle="Manajemen komprehensif penugasan konsultansi, deliverable, dan kontrak"
      actions={
        <button
          type="button"
          onClick={handleBukaTambah}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">Tambah Proyek</span>
          <span className="sm:hidden">Proyek</span>
        </button>
      }
    >
      <div className="flex flex-col xl:flex-row gap-6 h-full items-start">
        <div className="flex-1 w-full space-y-6">
          {/* KPI Analytics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-border/80 bg-background/60 p-3 sm:p-4 shadow-2xs">
              <span className="text-[11px] sm:text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-primary" /> Total Portofolio
              </span>
              <p className="mt-1 text-base sm:text-xl font-bold tracking-tight text-foreground">
                {rupiahRingkas(totalNilaiPortofolio)}
              </p>
              <span className="mt-1 text-[10px] text-muted-foreground block">
                {daftarSemuaProyek.length} total penugasan
              </span>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/60 p-3 sm:p-4 shadow-2xs">
              <span className="text-[11px] sm:text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <Briefcase className="size-3.5 text-emerald-500" /> Proyek Berjalan
              </span>
              <p className="mt-1 text-base sm:text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {jumlahProyekBerjalan}{" "}
                <span className="text-xs font-normal text-muted-foreground">penugasan</span>
              </p>
              <span className="mt-1 text-[10px] text-muted-foreground block">
                Sedang aktif dieksekusi
              </span>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/60 p-3 sm:p-4 shadow-2xs">
              <span className="text-[11px] sm:text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-primary" /> Rata-rata Progres
              </span>
              <p className="mt-1 text-base sm:text-xl font-bold tracking-tight text-foreground">
                {rataProgres}%
              </p>
              <div className="mt-1.5 w-full">
                <Bar value={rataProgres} />
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/60 p-3 sm:p-4 shadow-2xs">
              <span className="text-[11px] sm:text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <AlertCircle className="size-3.5 text-amber-500" /> Perhatian / Tertahan
              </span>
              <p className="mt-1 text-base sm:text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {jumlahTertahan}{" "}
                <span className="text-xs font-normal text-muted-foreground">penugasan</span>
              </p>
              <span className="mt-1 text-[10px] text-muted-foreground block">
                Menunggu respon klien / vendor
              </span>
            </div>
          </div>

          {/* Toolbar Komprehensif: Filter Status, Klien, Pencarian & View Mode */}
          <div className="rounded-xl border border-border/80 bg-card/70 p-3 shadow-2xs space-y-3">
            {/* Baris 1: Filter Status & View Mode */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Filter Status Pills (Desktop) */}
              <div className="hidden lg:flex items-center gap-1 rounded-lg border border-border/70 bg-background/80 p-0.5 shadow-2xs">
                {filterStatus.map((s) => {
                  const count =
                    s === "semua"
                      ? daftarSemuaProyek.length
                      : daftarSemuaProyek.filter((p) => p.status === s).length;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAktifStatus(s)}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer",
                        aktifStatus === s
                          ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                      )}
                    >
                      <span>{s === "semua" ? "Semua" : (statusProyek[s] ?? s)}</span>
                      <span
                        className={cn(
                          "text-[10px] rounded-full px-1.5 py-0.2 font-semibold",
                          aktifStatus === s ? "bg-primary-foreground/20 text-white" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Filter Status (Mobile / Tablet) */}
              <div className="lg:hidden flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Status:</span>
                <select
                  value={aktifStatus}
                  onChange={(e) => setAktifStatus(e.target.value)}
                  className="h-8 rounded-lg border border-border/70 bg-background px-2.5 text-xs font-medium text-foreground outline-none shadow-2xs"
                >
                  {filterStatus.map((s) => (
                    <option key={s} value={s}>
                      {s === "semua" ? "Semua Status" : (statusProyek[s] ?? s)}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-muted-foreground mr-1 hidden sm:inline">Tampilan:</span>
                <div className="flex items-center gap-0.5 rounded-lg border border-border/70 bg-background/80 p-0.5 h-8 shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-1.5 rounded-md transition-colors cursor-pointer",
                      viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                    title="Tampilan Kartu Grid"
                  >
                    <LayoutGrid className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("kanban")}
                    className={cn(
                      "p-1.5 rounded-md transition-colors cursor-pointer",
                      viewMode === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                    title="Tampilan Papan Kanban"
                  >
                    <Kanban className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("tabel")}
                    className={cn(
                      "p-1.5 rounded-md transition-colors cursor-pointer",
                      viewMode === "tabel" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                    title="Tampilan Tabel Matriks"
                  >
                    <List className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Baris 2: Pencarian & Filter Klien */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-border/60">
              <div className="flex flex-1 items-center gap-2">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cari nama proyek, klien, konsultan, atau bidang..."
                    value={kataKunci}
                    onChange={(e) => setKataKunci(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border/70 bg-background pl-8 pr-7 text-xs outline-none focus:border-primary transition-colors shadow-2xs placeholder:text-muted-foreground"
                  />
                  {kataKunci && (
                    <button
                      type="button"
                      onClick={() => setKataKunci("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Klien */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    value={klienFilter}
                    onChange={(e) => setKlienFilter(e.target.value)}
                    className="h-8 max-w-[160px] sm:max-w-[200px] truncate rounded-lg border border-border/70 bg-background px-2.5 text-xs font-medium text-foreground outline-none shadow-2xs"
                  >
                    <option value="semua">Semua Klien</option>
                    {daftarKlien.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <span className="text-xs text-muted-foreground shrink-0 text-right">
                Menampilkan <strong>{filteredProjects.length}</strong> dari{" "}
                {daftarSemuaProyek.length} proyek
              </span>
            </div>
          </div>

          {/* Main Content Area based on View Mode */}
          {filteredProjects.length === 0 ? (
            <Panel>
              <Kosong pesan="Tidak ada proyek yang sesuai dengan kriteria filter atau pencarian." />
            </Panel>
          ) : viewMode === "grid" ? (
            /* ================= GRID VIEW ================= */
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredProjects.map((p) => {
                const client = getKlienInfo(p.client_id);
                const tugas = daftarTugas.filter((t) => t.project_id === p.id);
                const selesai = tugas.filter((t) => t.status === "selesai").length;
                const deliv = daftarDeliv.filter((d) => d.project_id === p.id);
                const sisa = sisaHari(p.tanggal_selesai);

                return (
                  <Panel
                    key={p.id}
                    className="flex flex-col justify-between hover:border-primary/40 transition-all shadow-2xs"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Building2 className="size-3 text-primary shrink-0" />
                            <span className="font-semibold text-foreground/80 truncate">
                              {client.nama}
                            </span>
                            {p.bidang && (
                              <span className="rounded bg-primary/10 px-1.5 py-0.2 text-[10px] font-medium text-primary shrink-0">
                                {p.bidang}
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1 text-sm sm:text-base font-bold text-foreground tracking-tight leading-snug">
                            {p.nama}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Pill value={p.prioritas} />
                          <Pill value={p.status} label={statusProyek[p.status] ?? p.status} />
                        </div>
                      </div>

                      {p.ringkasan && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {p.ringkasan}
                        </p>
                      )}

                      {/* Interactive Progres Bar */}
                      <div className="mt-4 space-y-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-muted-foreground text-[11px]">
                            Tingkat Penyelesaian
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleUbahProgresCepat(p.id, -5)}
                              className="size-5 rounded border border-border bg-background text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-accent flex items-center justify-center cursor-pointer"
                              title="Kurangi 5%"
                            >
                              -
                            </button>
                            <span className="tabular-nums font-bold text-foreground text-xs min-w-[32px] text-center">
                              {p.progres}%
                            </span>
                            <button
                              onClick={() => handleUbahProgresCepat(p.id, 5)}
                              className="size-5 rounded border border-border bg-background text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-accent flex items-center justify-center cursor-pointer"
                              title="Tambah 5%"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <Bar value={p.progres} />
                      </div>

                      {/* Key Specs Grid */}
                      <dl className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg border border-border/60 bg-background/50 p-2">
                          <dt className="text-[10px] text-muted-foreground font-medium">
                            Konsultan PIC
                          </dt>
                          <dd className="mt-0.5 font-bold text-foreground truncate">
                            {p.konsultan ?? "Wira Pratama"}
                          </dd>
                        </div>
                        <div className="rounded-lg border border-border/60 bg-background/50 p-2">
                          <dt className="text-[10px] text-muted-foreground font-medium">
                            Nilai Kontrak
                          </dt>
                          <dd className="mt-0.5 font-bold text-foreground">
                            {rupiah(Number(p.nilai))}
                          </dd>
                        </div>
                        <div className="rounded-lg border border-border/60 bg-background/50 p-2">
                          <dt className="text-[10px] text-muted-foreground font-medium">
                            Target Selesai
                          </dt>
                          <dd className="mt-0.5 font-bold text-foreground">
                            {tanggal(p.tanggal_selesai)}
                          </dd>
                        </div>
                        <div className="rounded-lg border border-border/60 bg-background/50 p-2">
                          <dt className="text-[10px] text-muted-foreground font-medium">
                            Sisa Waktu
                          </dt>
                          <dd
                            className={cn(
                              "mt-0.5 font-bold",
                              sisa === null
                                ? "text-muted-foreground"
                                : sisa < 0
                                  ? "text-rose-600 dark:text-rose-400"
                                  : sisa <= 14
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-emerald-600 dark:text-emerald-400",
                            )}
                          >
                            {sisa === null
                              ? "—"
                              : sisa < 0
                                ? `Lewat ${Math.abs(sisa)} hari`
                                : `${sisa} hari lagi`}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Card Footer & Actions */}
                    <div className="mt-4 pt-3 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                        <span>
                          Tugas {selesai}/{tugas.length}
                        </span>
                        <span>·</span>
                        <span>{deliv.length} deliverable</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setDetailProject(p)}
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-border/70 bg-card/70 px-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                        >
                          Detail
                        </button>

                        <button
                          onClick={() => handleBukaEdit(p)}
                          className="size-7 rounded-md border border-border/70 bg-card/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          title="Edit Proyek"
                        >
                          <Edit2 className="size-3" />
                        </button>

                        <button
                          onClick={() => setHapusConfirmId(p.id)}
                          className="size-7 rounded-md border border-border/70 bg-card/70 flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                          title="Hapus Proyek"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </div>
                  </Panel>
                );
              })}
            </div>
          ) : viewMode === "kanban" ? (
            /* ================= KANBAN BOARD VIEW ================= */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {(["perencanaan", "berjalan", "tertahan", "selesai"] as const).map((kolomStatus) => {
                const proyekKolom = filteredProjects.filter((p) => p.status === kolomStatus);
                const totalNilaiKolom = proyekKolom.reduce(
                  (acc, p) => acc + (Number(p.nilai) || 0),
                  0,
                );

                return (
                  <div
                    key={kolomStatus}
                    className="flex flex-col rounded-xl border border-border/80 bg-muted/20 p-3 shadow-2xs"
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between border-b border-border/70 pb-2.5 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Pill
                          value={kolomStatus}
                          label={statusProyek[kolomStatus] ?? kolomStatus}
                        />
                        <span className="text-xs font-bold text-muted-foreground">
                          ({proyekKolom.length})
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {rupiahRingkas(totalNilaiKolom)}
                      </span>
                    </div>

                    {/* Column Cards */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px]">
                      {proyekKolom.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                          Kosong di tahap ini
                        </div>
                      ) : (
                        proyekKolom.map((p) => {
                          const client = getKlienInfo(p.client_id);
                          return (
                            <div
                              key={p.id}
                              className="group rounded-xl border border-border/80 bg-card p-3 shadow-2xs hover:border-primary/40 transition-all space-y-2.5"
                            >
                              <div className="flex items-start justify-between gap-1.5">
                                <span className="text-[11px] font-semibold text-primary truncate">
                                  {client.nama}
                                </span>
                                <Pill value={p.prioritas} />
                              </div>

                              <h4 className="text-xs font-bold text-foreground leading-snug">
                                {p.nama}
                              </h4>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                  <span>Progres</span>
                                  <span className="font-semibold text-foreground">
                                    {p.progres}%
                                  </span>
                                </div>
                                <Bar value={p.progres} />
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                                <span>{rupiahRingkas(Number(p.nilai))}</span>
                                <div className="flex items-center gap-1">
                                  <select
                                    value={p.status}
                                    onChange={(e) =>
                                      handleUbahStatusCepat(p.id, e.target.value)
                                    }
                                    className="h-6 rounded border border-border/70 bg-background px-1 text-[10px] font-medium text-foreground outline-none"
                                    title="Pindahkan Status"
                                  >
                                    <option value="perencanaan">Perencanaan</option>
                                    <option value="berjalan">Berjalan</option>
                                    <option value="tertahan">Tertahan</option>
                                    <option value="selesai">Selesai</option>
                                  </select>
                                  <button
                                    onClick={() => setDetailProject(p)}
                                    className="size-6 rounded border border-border/70 bg-background flex items-center justify-center hover:bg-accent text-foreground"
                                  >
                                    <ArrowRight className="size-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ================= TABLE VIEW ================= */
            <div className="rounded-xl border border-border bg-card shadow-2xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/40 font-semibold text-muted-foreground">
                    <th className="p-3">Nama Penugasan & Klien</th>
                    <th className="p-3">Bidang</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Prioritas</th>
                    <th className="p-3 min-w-[140px]">Progres</th>
                    <th className="p-3">Nilai Kontrak</th>
                    <th className="p-3">Konsultan PIC</th>
                    <th className="p-3">Target Selesai</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredProjects.map((p) => {
                    const client = getKlienInfo(p.client_id);
                    return (
                      <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-foreground">{p.nama}</div>
                          <div className="text-[11px] text-muted-foreground">{client.nama}</div>
                        </td>
                        <td className="p-3 text-muted-foreground">{p.bidang ?? "—"}</td>
                        <td className="p-3">
                          <Pill value={p.status} label={statusProyek[p.status] ?? p.status} />
                        </td>
                        <td className="p-3">
                          <Pill value={p.prioritas} />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-xs min-w-[30px]">
                              {p.progres}%
                            </span>
                            <div className="flex-1">
                              <Bar value={p.progres} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-foreground">
                          {rupiah(Number(p.nilai))}
                        </td>
                        <td className="p-3 text-muted-foreground">{p.konsultan ?? "—"}</td>
                        <td className="p-3 text-muted-foreground">
                          {tanggal(p.tanggal_selesai)}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setDetailProject(p)}
                              className="h-7 px-2 rounded-md border border-border/70 bg-card hover:bg-accent text-[11px] font-medium transition-colors"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => handleBukaEdit(p)}
                              className="size-7 rounded-md border border-border/70 bg-card hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="size-3" />
                            </button>
                            <button
                              onClick={() => setHapusConfirmId(p.id)}
                              className="size-7 rounded-md border border-border/70 bg-card hover:bg-rose-500/10 flex items-center justify-center text-muted-foreground hover:text-rose-600"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar Workspace Section (Kept nicely) */}
        <div className="w-full xl:w-[320px] shrink-0 xl:sticky xl:top-6">
          <CustomWorkspaceSection />
        </div>
      </div>

      {/* Modal: Tambah / Edit Proyek */}
      {modalFormBuka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="size-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">
                  {editTarget ? "Perbarui Proyek Konsultansi" : "Buat Penugasan Proyek Baru"}
                </h3>
              </div>
              <button
                onClick={() => setModalFormBuka(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSimpanProyek} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Nama Penugasan Proyek *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: IT Transformation Strategy & ERP Roadmap"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Klien Mitra</label>
                  <select
                    value={formClientId}
                    onChange={(e) => setFormClientId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
                  >
                    {daftarKlien.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama}
                      </option>
                    ))}
                    <option value="internal">Proyek Internal Konsultan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Bidang Konsultansi
                  </label>
                  <select
                    value={formBidang}
                    onChange={(e) => setFormBidang(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
                  >
                    {BIDANG_KONSULTANSI.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Ringkasan Ruang Lingkup (Scope of Work)
                </label>
                <textarea
                  rows={2}
                  placeholder="Uraian singkat tujuan penugasan, output utama, dan konteks engagement..."
                  value={formRingkasan}
                  onChange={(e) => setFormRingkasan(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background p-2.5 text-xs outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Status Proyek</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
                  >
                    <option value="perencanaan">Perencanaan</option>
                    <option value="berjalan">Berjalan</option>
                    <option value="tertahan">Tertahan</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Prioritas</label>
                  <select
                    value={formPrioritas}
                    onChange={(e) => setFormPrioritas(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
                  >
                    <option value="tinggi">Tinggi</option>
                    <option value="sedang">Sedang</option>
                    <option value="rendah">Rendah</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Progres ({formProgres}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={formProgres}
                    onChange={(e) => setFormProgres(Number(e.target.value))}
                    className="w-full mt-2 accent-primary cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    value={formTglMulai}
                    onChange={(e) => setFormTglMulai(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Target Selesai
                  </label>
                  <input
                    type="date"
                    required
                    value={formTglSelesai}
                    onChange={(e) => setFormTglSelesai(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Nilai Kontrak (Rupiah)
                  </label>
                  <input
                    type="number"
                    value={formNilai}
                    onChange={(e) => setFormNilai(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Konsultan Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    value={formKonsultan}
                    onChange={(e) => setFormKonsultan(e.target.value)}
                    placeholder="Wira Pratama & Tim"
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalFormBuka(false)}
                  className="h-8 px-3 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-xs"
                >
                  {editTarget ? "Simpan Perubahan" : "Buat Proyek"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detail Lengkap Proyek & Deliverable */}
      {detailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-border pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary">
                    {getKlienInfo(detailProject.client_id).nama}
                  </span>
                  {detailProject.bidang && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.2 text-[10px] font-medium text-primary">
                      {detailProject.bidang}
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground mt-1">
                  {detailProject.nama}
                </h3>
              </div>
              <button
                onClick={() => setDetailProject(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Status & Quick Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <Pill value={detailProject.prioritas} />
                <Pill
                  value={detailProject.status}
                  label={statusProyek[detailProject.status] ?? detailProject.status}
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Ubah Status:</span>
                <select
                  value={detailProject.status}
                  onChange={(e) => handleUbahStatusCepat(detailProject.id, e.target.value)}
                  className="h-7 rounded border border-border bg-background px-2 text-xs font-medium text-foreground outline-none"
                >
                  <option value="perencanaan">Perencanaan</option>
                  <option value="berjalan">Berjalan</option>
                  <option value="tertahan">Tertahan</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            </div>

            {detailProject.ringkasan && (
              <div>
                <span className="text-xs font-semibold text-foreground block mb-1">
                  Ruang Lingkup & Tujuan:
                </span>
                <p className="text-xs text-foreground/90 leading-relaxed bg-background p-3 rounded-lg border border-border">
                  {detailProject.ringkasan}
                </p>
              </div>
            )}

            {/* Spec grid */}
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg border border-border bg-background">
                <dt className="text-[10px] text-muted-foreground font-medium">Konsultan PIC</dt>
                <dd className="mt-0.5 font-bold text-foreground">
                  {detailProject.konsultan ?? "Wira Pratama"}
                </dd>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-background">
                <dt className="text-[10px] text-muted-foreground font-medium">Nilai Kontrak</dt>
                <dd className="mt-0.5 font-bold text-foreground">
                  {rupiah(Number(detailProject.nilai))}
                </dd>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-background">
                <dt className="text-[10px] text-muted-foreground font-medium">Periode Mulai</dt>
                <dd className="mt-0.5 font-bold text-foreground">
                  {tanggal(detailProject.tanggal_mulai)}
                </dd>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-background">
                <dt className="text-[10px] text-muted-foreground font-medium">Target Selesai</dt>
                <dd className="mt-0.5 font-bold text-foreground">
                  {tanggal(detailProject.tanggal_selesai)}
                </dd>
              </div>
            </dl>

            {/* Deliverables for this project */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  Deliverables Terkait (
                  {daftarDeliv.filter((d) => d.project_id === detailProject.id).length})
                </span>
                <Link
                  to="/portal/progres"
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  Buka Portal Deliverable <ExternalLink className="size-3" />
                </Link>
              </div>

              {daftarDeliv.filter((d) => d.project_id === detailProject.id).length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                  Belum ada deliverable yang dikaitkan pada proyek ini.
                </div>
              ) : (
                <ul className="space-y-2 text-xs max-h-48 overflow-y-auto">
                  {daftarDeliv
                    .filter((d) => d.project_id === detailProject.id)
                    .map((d) => (
                      <li
                        key={d.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-background"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{d.judul}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {d.jenis} · Versi {d.versi ?? "v1.0"} · Tenggat {tanggal(d.jatuh_tempo)}
                          </p>
                        </div>
                        <Pill value={d.status} />
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Tasks for this project */}
            <div>
              <span className="text-xs font-bold text-foreground block mb-2">
                Daftar Pekerjaan Sprint (
                {daftarTugas.filter((t) => t.project_id === detailProject.id).length})
              </span>

              {daftarTugas.filter((t) => t.project_id === detailProject.id).length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                  Belum ada pekerjaan tercatat.
                </div>
              ) : (
                <ul className="space-y-2 text-xs max-h-48 overflow-y-auto">
                  {daftarTugas
                    .filter((t) => t.project_id === detailProject.id)
                    .map((t) => (
                      <li
                        key={t.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-background"
                      >
                        <div className="flex items-center gap-2">
                          {t.status === "selesai" ? (
                            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <Clock className="size-3.5 text-primary shrink-0" />
                          )}
                          <span
                            className={cn(
                              "font-medium",
                              t.status === "selesai" && "line-through text-muted-foreground",
                            )}
                          >
                            {t.judul}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          PJ: {t.penanggung_jawab}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <button
                onClick={() => {
                  setDetailProject(null);
                  handleBukaEdit(detailProject);
                }}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-foreground hover:bg-accent text-xs font-medium transition-colors"
              >
                <Edit2 className="size-3.5" />
                Edit Data Proyek
              </button>

              <button
                onClick={() => setDetailProject(null)}
                className="h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Delete */}
      {hapusConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertCircle className="size-5" />
              <h4 className="font-bold text-sm">Hapus Proyek Ini?</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tindakan ini akan menghapus proyek dari daftar aktif. Apakah Anda yakin ingin
              melanjutkan?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setHapusConfirmId(null)}
                className="h-8 px-3 rounded-lg border border-border text-foreground hover:bg-accent text-xs font-medium"
              >
                Batal
              </button>
              <button
                onClick={() => handleHapusProyek(hapusConfirmId)}
                className="h-8 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
