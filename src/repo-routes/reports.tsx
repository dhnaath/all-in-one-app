import { createFileRoute } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import {
  NotebookText,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Building2,
  FolderKanban,
  Shield,
  Tag,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Trash2,
  Share2,
  FileCheck,
  Check,
  FileSpreadsheet,
  LayoutGrid,
  List,
  X,
  Calendar,
  ExternalLink,
  Lock,
  Globe,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { AppShell } from "@/app/app-shell";
import { Kosong, Panel, Pill } from "@/app/ui-bits";
import { cn } from "@/lib/utils";
import {
  clientsQuery,
  projectsQuery,
  documentsQuery,
  tanggal,
  tanggalPendek,
  rupiah,
  rupiahRingkas,
  Document,
  Client,
  Project,
  STORAGE_DOCUMENTS_KEY,
  MOCK_DOCUMENTS,
} from "@/lib/data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Laporan Khusus & Dokumen — Client OS Konsultan" },
      {
        name: "description",
        content:
          "Pusat deliverable, repositori dokumen formal per klien, generator laporan eksekutif sekali klik, dan pelacak status persetujuan.",
      },
      { property: "og:title", content: "Laporan Khusus & Dokumen" },
      {
        property: "og:description",
        content:
          "Kelola berkas resmi klien, lacak status persetujuan draf hingga disahkan, dan buat laporan eksekutif siap cetak.",
      },
    ],
  }),
  component: HalamanLaporanKhusus,
});

type StatusPersetujuan = "draft" | "review" | "approved" | "rejected";
type Kerahasiaan = "Rahasia" | "Internal" | "Publik";

interface CustomDocument extends Document {
  status_persetujuan?: StatusPersetujuan;
  kategori?: string;
  kerahasiaan?: Kerahasiaan;
  ringkasan?: string;
  catatan_revisi?: string;
  disetujui_oleh?: string;
  tanggal_persetujuan?: string;
}

const TEMPLATE_LIST = [
  {
    id: "tpl-progress",
    judul: "Laporan Evaluasi Progres Bulanan",
    kategori: "Laporan Kinerja",
    deskripsi:
      "Kerangka baku pelaporan kemajuan proyek per milestone, rekapitulasi jam kerja konsultan, kendala operasional, dan action plan 30 hari ke depan.",
    waktuBaca: "4 mnt baca",
    cocokUntuk: "Komite Pengarah & Project Sponsor",
    preset: {
      judul: "Laporan Progres & Evaluasi Capaian Bulanan",
      subjudul: "Rekapitulasi Milestone, Efisiensi Jam Kerja, dan Rencana Kerja Strategis",
      periode: "Juni 2026",
      rekomendasi:
        "1. Percepat tahap finalisasi integrasi sistem backend sebelum uji fungsional bersama pengguna akhir.\n2. Lakukan koordinasi mingguan lintas departemen untuk meminimalkan jeda persetujuan dokumen otorisasi.",
    },
  },
  {
    id: "tpl-audit",
    judul: "Laporan Uji Tuntas (Due Diligence) & Kepatuhan",
    kategori: "Audit & Kepatuhan",
    deskripsi:
      "Evaluasi menyeluruh risiko legalitas, kepatuhan regulasi, tata kelola korporasi, serta kesehatan kepatuhan kontrak dan lisensi bisnis.",
    waktuBaca: "6 mnt baca",
    cocokUntuk: "Dewan Komisaris, Direksi & Legal Counsel",
    preset: {
      judul: "Laporan Audit Kepatuhan & Uji Tuntas Terpadu",
      subjudul: "Penilaian Risiko Regulasi, KBLI, dan Mitigasi Liabilitas Kontrak Operasional",
      periode: "Kuartal II 2026",
      rekomendasi:
        "1. Sesuaikan seluruh klausul SLA vendor ketiga dengan standar kepatuhan perlindungan data terbaru.\n2. Perbarui pendaftaran klasifikasi usaha perizinan berusaha berbasis risiko (OSS-RBA).",
    },
  },
  {
    id: "tpl-feasibility",
    judul: "Studi Kelayakan Strategis & Analisis Finansial",
    kategori: "Studi Kelayakan",
    deskripsi:
      "Analisis kelayakan adopsi teknologi baru, estimasi pengembalian investasi (ROI), valuasi biaya siklus hidup, dan analisis sensitivitas pasar.",
    waktuBaca: "5 mnt baca",
    cocokUntuk: "Chief Financial Officer & Tim Investasi",
    preset: {
      judul: "Studi Kelayakan Strategis & Analisis Kelayakan Investasi",
      subjudul: "Estimasi Pengembalian Investasi (ROI), Analisis Risiko, dan Roadmap Pengadaan",
      periode: "Semester I 2026",
      rekomendasi:
        "1. Strukturisasi pembiayaan bertahap berbasis pencapaian deliverable fungsional guna menjaga likuiditas kas.\n2. Alokasikan kontingensi 10% untuk mitigasi fluktuasi biaya lisensi cloud dan integrasi API.",
    },
  },
  {
    id: "tpl-executive-brief",
    judul: "Executive Advisory Briefing Note",
    kategori: "Executive Brief",
    deskripsi:
      "Ringkasan satu halaman (one-pager) berkepadatan tinggi untuk pengambil keputusan puncak berisi intisari masalah, opsi strategis, dan rekomendasi tajam.",
    waktuBaca: "2 mnt baca",
    cocokUntuk: "Direktur Utama & Dewan Penasihat",
    preset: {
      judul: "Executive Briefing: Rekomendasi Keputusan Kritis",
      subjudul: "Intisari Kajian Transformasi Operasional & Rekomendasi Dewan Direksi",
      periode: "Juni 2026",
      rekomendasi:
        "1. Segera sahkan alokasi sumber daya tahap migrasi sistem utama untuk mencegah keterlambatan go-live.\n2. Bentuk tim task-force lintas fungsi di bawah supervisi langsung manajemen puncak.",
    },
  },
];

export default function HalamanLaporanKhusus() {
  const [activeTab, setActiveTab] = useState<"dokumen" | "generator" | "template">("dokumen");
  const [cari, setCari] = useState("");
  const [filterKlien, setFilterKlien] = useState<string>("semua");
  const [filterKategori, setFilterKategori] = useState<string>("semua");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [viewMode, setViewMode] = useState<"tabel" | "kartu">("tabel");

  // Selected document for slide-over drawer
  const [dokumenTerpilih, setDokumenTerpilih] = useState<CustomDocument | null>(null);

  // Modal create/upload
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [formDokumen, setFormDokumen] = useState({
    nama: "",
    client_id: "",
    project_id: "",
    jenis: "Kajian Khusus",
    kategori: "Kajian Khusus",
    kerahasiaan: "Internal" as Kerahasiaan,
    versi: "v1.0",
    ringkasan: "",
    dibagikan_ke_klien: true,
    status_persetujuan: "draft" as StatusPersetujuan,
    catatan_revisi: "",
  });

  // Queries
  const [clientsResult, projectsResult, documentsResult] = useQueries({
    queries: [clientsQuery, projectsQuery, documentsQuery],
  });

  const clients: Client[] = clientsResult.data ?? [];
  const projects: Project[] = projectsResult.data ?? [];

  // Local state for documents to allow instant live updates
  const [documents, setDocuments] = useState<CustomDocument[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_DOCUMENTS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return MOCK_DOCUMENTS as CustomDocument[];
  });

  // Save documents to localStorage whenever changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_DOCUMENTS_KEY, JSON.stringify(documents));
    }
  }, [documents]);

  // Generator State
  const [genKlienId, setGenKlienId] = useState<string>("c1");
  const [genProyekId, setGenProyekId] = useState<string>("p1");
  const [genJudul, setGenJudul] = useState("Laporan Progres & Evaluasi Capaian Bulanan");
  const [genSubjudul, setGenSubjudul] = useState(
    "Rekapitulasi Milestone, Efisiensi Jam Kerja, dan Rencana Kerja Strategis",
  );
  const [genPeriode, setGenPeriode] = useState("Juni 2026");
  const [genKonsultan, setGenKonsultan] = useState("Wira & Team (All in One Consulting)");
  const [genRekomendasi, setGenRekomendasi] = useState(
    "1. Percepat tahap finalisasi integrasi sistem backend sebelum uji fungsional bersama pengguna akhir.\n2. Lakukan koordinasi mingguan lintas departemen untuk meminimalkan jeda persetujuan dokumen otorisasi.",
  );
  const [genIncludeMilestone, setGenIncludeMilestone] = useState(true);
  const [genIncludeFinance, setGenIncludeFinance] = useState(true);
  const [genIncludeRisk, setGenIncludeRisk] = useState(true);
  const [genTersimpanNotif, setGenTersimpanNotif] = useState(false);

  // Selected client & project in generator
  const genClient = useMemo(() => clients.find((c) => c.id === genKlienId) ?? clients[0], [clients, genKlienId]);
  const genProject = useMemo(
    () => projects.find((p) => p.id === genProyekId) ?? projects[0],
    [projects, genProyekId],
  );

  // Auto update project when client changes in generator
  useEffect(() => {
    if (genKlienId) {
      const relatedProject = projects.find((p) => p.client_id === genKlienId);
      if (relatedProject) {
        setGenProyekId(relatedProject.id);
      }
    }
  }, [genKlienId, projects]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchQuery =
        !q ||
        doc.nama.toLowerCase().includes(q) ||
        (doc.jenis ?? "").toLowerCase().includes(q) ||
        (doc.kategori ?? "").toLowerCase().includes(q) ||
        (doc.ringkasan ?? "").toLowerCase().includes(q);

      const matchClient = filterKlien === "semua" || doc.client_id === filterKlien;
      const matchKategori = filterKategori === "semua" || doc.kategori === filterKategori;
      const matchStatus =
        filterStatus === "semua" ||
        (doc.status_persetujuan ?? "draft") === filterStatus;

      return matchQuery && matchClient && matchKategori && matchStatus;
    });
  }, [documents, cari, filterKlien, filterKategori, filterStatus]);

  // Metrics
  const metrics = useMemo(() => {
    const total = documents.length;
    const review = documents.filter((d) => d.status_persetujuan === "review").length;
    const approved = documents.filter((d) => d.status_persetujuan === "approved").length;
    const draft = documents.filter(
      (d) => !d.status_persetujuan || d.status_persetujuan === "draft" || d.status_persetujuan === "rejected",
    ).length;
    return { total, review, approved, draft };
  }, [documents]);

  // Helper name functions
  const getClientName = (id: string | null) => clients.find((c) => c.id === id)?.nama ?? "Klien Internal";
  const getProjectName = (id: string | null) => projects.find((p) => p.id === id)?.nama ?? "Umum / Non-Proyek";

  // Actions
  const handleUpdateStatus = (docId: string, newStatus: StatusPersetujuan, note?: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            status_persetujuan: newStatus,
            catatan_revisi: note !== undefined ? note : doc.catatan_revisi,
            disetujui_oleh:
              newStatus === "approved" ? "Wira (Lead Partner)" : newStatus === "draft" ? undefined : doc.disetujui_oleh,
            tanggal_persetujuan: newStatus === "approved" ? new Date().toISOString() : doc.tanggal_persetujuan,
          };
        }
        return doc;
      }),
    );
    if (dokumenTerpilih && dokumenTerpilih.id === docId) {
      setDokumenTerpilih((prev) =>
        prev
          ? {
              ...prev,
              status_persetujuan: newStatus,
              catatan_revisi: note !== undefined ? note : prev.catatan_revisi,
              disetujui_oleh:
                newStatus === "approved" ? "Wira (Lead Partner)" : newStatus === "draft" ? undefined : prev.disetujui_oleh,
              tanggal_persetujuan:
                newStatus === "approved" ? new Date().toISOString() : prev.tanggal_persetujuan,
            }
          : null,
      );
    }
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus berkas dokumen ini?")) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (dokumenTerpilih?.id === id) {
        setDokumenTerpilih(null);
      }
    }
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDokumen.nama.trim()) return;

    const newDoc: CustomDocument = {
      id: `doc-${Date.now()}`,
      client_id: formDokumen.client_id || null,
      project_id: formDokumen.project_id || null,
      nama: formDokumen.nama.endsWith(".pdf") ? formDokumen.nama : `${formDokumen.nama}.pdf`,
      jenis: formDokumen.jenis,
      kategori: formDokumen.kategori,
      kerahasiaan: formDokumen.kerahasiaan,
      versi: formDokumen.versi || "v1.0",
      ukuran: `${(Math.random() * 3 + 1.2).toFixed(1)} MB`,
      tautan: "#",
      diunggah_oleh: "Wira (Lead Consultant)",
      dibagikan_ke_klien: formDokumen.dibagikan_ke_klien,
      status_persetujuan: formDokumen.status_persetujuan,
      ringkasan: formDokumen.ringkasan || "Dokumen resmi deliverable konsultansi manajemen.",
      catatan_revisi: formDokumen.catatan_revisi || "Dokumen baru diunggah.",
      created_at: new Date().toISOString(),
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setIsUploadModalOpen(false);
    setFormDokumen({
      nama: "",
      client_id: "",
      project_id: "",
      jenis: "Kajian Khusus",
      kategori: "Kajian Khusus",
      kerahasiaan: "Internal",
      versi: "v1.0",
      ringkasan: "",
      dibagikan_ke_klien: true,
      status_persetujuan: "draft",
      catatan_revisi: "",
    });
  };

  // Save generated report to repository
  const handleSaveReportToRepo = () => {
    const docName = `${genJudul.trim()} - ${genClient?.nama ?? "Klien"} (${genPeriode}).pdf`;
    const newDoc: CustomDocument = {
      id: `doc-gen-${Date.now()}`,
      client_id: genKlienId,
      project_id: genProyekId,
      nama: docName,
      jenis: "Laporan Eksekutif",
      kategori: "Laporan Kinerja",
      kerahasiaan: "Rahasia",
      versi: "v1.0",
      ukuran: "2.8 MB",
      tautan: "#",
      diunggah_oleh: genKonsultan,
      dibagikan_ke_klien: true,
      status_persetujuan: "approved",
      ringkasan: `${genSubjudul}. Disusun untuk ${genClient?.nama} periode ${genPeriode}.`,
      catatan_revisi: "Dibuat otomatis via Executive Report Generator & disahkan konsultan.",
      created_at: new Date().toISOString(),
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setGenTersimpanNotif(true);
    setTimeout(() => setGenTersimpanNotif(false), 4000);
  };

  const handleApplyTemplate = (tpl: (typeof TEMPLATE_LIST)[0]) => {
    setGenJudul(tpl.preset.judul);
    setGenSubjudul(tpl.preset.subjudul);
    setGenPeriode(tpl.preset.periode);
    setGenRekomendasi(tpl.preset.rekomendasi);
    setActiveTab("generator");
  };

  const statusBadgeInfo = (status?: StatusPersetujuan) => {
    switch (status) {
      case "approved":
        return {
          label: "Disetujui",
          className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          icon: CheckCircle2,
        };
      case "review":
        return {
          label: "Dalam Review",
          className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          icon: Clock,
        };
      case "rejected":
        return {
          label: "Perlu Revisi",
          className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          icon: XCircle,
        };
      case "draft":
      default:
        return {
          label: "Draf",
          className: "bg-muted text-muted-foreground border-border",
          icon: AlertCircle,
        };
    }
  };

  const kerahasiaanBadge = (k?: Kerahasiaan) => {
    switch (k) {
      case "Rahasia":
        return (
          <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <Lock className="size-2.5" />
            Rahasia
          </span>
        );
      case "Publik":
        return (
          <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Globe className="size-2.5" />
            Publik
          </span>
        );
      case "Internal":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <Shield className="size-2.5" />
            Internal
          </span>
        );
    }
  };

  return (
    <AppShell
      title="Laporan Khusus & Dokumen"
      subtitle="Pusat deliverable, repositori dokumen legal & kajian khusus, serta generator laporan eksekutif"
      actions={
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("generator")}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-lg border border-border/70 bg-card/60 hover:bg-accent hover:border-border text-xs font-semibold text-foreground transition-all duration-150 whitespace-nowrap shadow-2xs cursor-pointer"
            title="Buka Generator Laporan Eksekutif"
          >
            <Sparkles className="size-3.5 text-primary shrink-0" />
            <span className="hidden sm:inline">Buat Laporan</span>
            <span className="sm:hidden">Laporan</span>
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-lg bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground transition-all duration-150 whitespace-nowrap shadow-2xs cursor-pointer"
            title="Unggah Berkas Dokumen Baru"
          >
            <Plus className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">Unggah Dokumen</span>
            <span className="sm:hidden">Unggah</span>
          </button>
        </div>
      }
    >
      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Dokumen</span>
            <FileText className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{metrics.total}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Arsip legal & kajian aktif</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Dalam Review</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-amber-600 dark:text-amber-400">
            {metrics.review}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Menunggu sign-off stakeholder</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Disetujui (Approved)</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
            {metrics.approved}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Sah & siap dipublikasikan</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Draf & Revisi</span>
            <AlertCircle className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{metrics.draft}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Perlu penyempurnaan tim</p>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 mb-6">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab("dokumen")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors",
              activeTab === "dokumen"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <FolderKanban className="size-3.5" />
            Repositori Dokumen
            <span className="ml-1 rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-semibold">
              {documents.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("generator")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors",
              activeTab === "generator"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Sparkles className="size-3.5 text-primary" />
            Generator Laporan Eksekutif
          </button>
          <button
            onClick={() => setActiveTab("template")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors",
              activeTab === "template"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <BookOpen className="size-3.5" />
            Pustaka Template Standar
          </button>
        </div>

        {activeTab === "dokumen" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
              <button
                onClick={() => setViewMode("tabel")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "tabel" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
                title="Tampilan Tabel"
              >
                <List className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("kartu")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "kartu" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
                title="Tampilan Grid Kartu"
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= TAB 1: REPOSITORI DOKUMEN ================= */}
      {activeTab === "dokumen" && (
        <div className="space-y-4">
          {/* Controls bar: Search + Multi-dimensional Filter */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Cari berkas, jenis, atau tag..."
                className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Filter Klien */}
            <select
              value={filterKlien}
              onChange={(e) => setFilterKlien(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="semua">Semua Klien</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </select>

            {/* Filter Kategori */}
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="semua">Semua Kategori</option>
              <option value="Kajian Khusus">Kajian Khusus</option>
              <option value="Audit & Kepatuhan">Audit & Kepatuhan</option>
              <option value="Laporan Kinerja">Laporan Kinerja</option>
              <option value="Studi Kelayakan">Studi Kelayakan</option>
              <option value="Legal & Kontrak">Legal & Kontrak</option>
              <option value="Executive Brief">Executive Brief</option>
            </select>

            {/* Filter Status Persetujuan */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="semua">Semua Status Review</option>
              <option value="approved">Disetujui (Approved)</option>
              <option value="review">Dalam Review</option>
              <option value="draft">Draf</option>
              <option value="rejected">Perlu Revisi</option>
            </select>
          </div>

          {filteredDocuments.length === 0 ? (
            <Panel>
              <Kosong pesan="Tidak ada dokumen yang cocok dengan filter atau pencarian Anda." />
            </Panel>
          ) : viewMode === "tabel" ? (
            /* ============= TABLE VIEW ============= */
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="py-3 pl-4 pr-3">Nama Berkas</th>
                      <th className="px-3 py-3">Klien & Proyek</th>
                      <th className="px-3 py-3">Kategori</th>
                      <th className="px-3 py-3">Kerahasiaan</th>
                      <th className="px-3 py-3">Status Persetujuan</th>
                      <th className="px-3 py-3">Versi & Tanggal</th>
                      <th className="py-3 pl-3 pr-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredDocuments.map((doc) => {
                      const badge = statusBadgeInfo(doc.status_persetujuan);
                      const BadgeIcon = badge.icon;
                      return (
                        <tr
                          key={doc.id}
                          className="group transition-colors hover:bg-muted/30 cursor-pointer"
                          onClick={() => setDokumenTerpilih(doc)}
                        >
                          <td className="py-3.5 pl-4 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <FileText className="size-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate max-w-xs group-hover:text-primary transition-colors">
                                  {doc.nama}
                                </p>
                                <p className="text-xs text-muted-foreground truncate max-w-xs">
                                  {doc.ringkasan || doc.jenis}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-3.5">
                            <div className="min-w-0">
                              <p className="font-medium text-xs text-foreground truncate">
                                {getClientName(doc.client_id)}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {getProjectName(doc.project_id)}
                              </p>
                            </div>
                          </td>

                          <td className="px-3 py-3.5">
                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {doc.kategori || doc.jenis}
                            </span>
                          </td>

                          <td className="px-3 py-3.5">{kerahasiaanBadge(doc.kerahasiaan)}</td>

                          <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                            {/* Quick Status Switcher Dropdown */}
                            <select
                              value={doc.status_persetujuan ?? "draft"}
                              onChange={(e) =>
                                handleUpdateStatus(doc.id, e.target.value as StatusPersetujuan)
                              }
                              className={cn(
                                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors outline-none",
                                badge.className,
                              )}
                            >
                              <option value="draft">Draf</option>
                              <option value="review">Dalam Review</option>
                              <option value="approved">Disetujui</option>
                              <option value="rejected">Perlu Revisi</option>
                            </select>
                          </td>

                          <td className="px-3 py-3.5 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-foreground">{doc.versi || "v1.0"}</span>
                              <span>·</span>
                              <span>{tanggalPendek(doc.created_at)}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">{doc.ukuran || "2.5 MB"}</p>
                          </td>

                          <td className="py-3.5 pl-3 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => setDokumenTerpilih(doc)}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                title="Lihat Detail & Audit Trail"
                              >
                                <Eye className="size-4" />
                              </button>
                              <button
                                onClick={() => {
                                  alert(`Mengunduh berkas formal: ${doc.nama}`);
                                }}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                title="Unduh Berkas"
                              >
                                <Download className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                                title="Hapus Berkas"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ============= CARD GRID VIEW ============= */
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((doc) => {
                const badge = statusBadgeInfo(doc.status_persetujuan);
                return (
                  <div
                    key={doc.id}
                    onClick={() => setDokumenTerpilih(doc)}
                    className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm cursor-pointer"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileText className="size-4" />
                          </div>
                          {kerahasiaanBadge(doc.kerahasiaan)}
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                            badge.className,
                          )}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <h4 className="mt-3 text-sm font-semibold leading-snug line-clamp-2">
                        {doc.nama}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {doc.ringkasan || "Deliverable resmi konsultansi manajemen."}
                      </p>

                      <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px]">Klien:</span>
                          <span className="font-medium text-foreground truncate max-w-[150px]">
                            {getClientName(doc.client_id)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px]">Proyek:</span>
                          <span className="truncate max-w-[150px]">{getProjectName(doc.project_id)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                      <span>
                        {doc.versi || "v1.0"} · {doc.ukuran || "3 MB"}
                      </span>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            alert(`Mengunduh berkas formal: ${doc.nama}`);
                          }}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Unduh"
                        >
                          <Download className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600"
                          title="Hapus"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: GENERATOR LAPORAN EKSEKUTIF ================= */}
      {activeTab === "generator" && (
        <div className="space-y-6">
          {genTersimpanNotif && (
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                <span>
                  Laporan berhasil disimpan dan didaftarkan ke <strong>Repositori Dokumen</strong>!
                </span>
              </div>
              <button
                onClick={() => setActiveTab("dokumen")}
                className="text-xs font-semibold underline hover:no-underline"
              >
                Buka Repositori
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column: Configuration Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold">Konfigurasi Laporan</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">Parameter Cepat</span>
                </div>

                {/* Pilih Klien & Proyek */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-foreground">Klien Tujuan</label>
                    <select
                      value={genKlienId}
                      onChange={(e) => setGenKlienId(e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nama} ({c.industri})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground">Proyek Terkait</label>
                    <select
                      value={genProyekId}
                      onChange={(e) => setGenProyekId(e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {projects
                        .filter((p) => p.client_id === genKlienId)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nama} (Progres {p.progres}%)
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground">Judul Laporan</label>
                    <input
                      value={genJudul}
                      onChange={(e) => setGenJudul(e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground">Subjudul / Topik Utama</label>
                    <input
                      value={genSubjudul}
                      onChange={(e) => setGenSubjudul(e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-foreground">Periode Evaluasi</label>
                      <input
                        value={genPeriode}
                        onChange={(e) => setGenPeriode(e.target.value)}
                        className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground">Lead Konsultan</label>
                      <input
                        value={genKonsultan}
                        onChange={(e) => setGenKonsultan(e.target.value)}
                        className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground">
                      Rekomendasi Strategis Tindak Lanjut
                    </label>
                    <textarea
                      rows={3}
                      value={genRekomendasi}
                      onChange={(e) => setGenRekomendasi(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-input bg-background p-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                {/* Modul Yang Disertakan */}
                <div className="space-y-2 border-t border-border pt-3">
                  <label className="text-xs font-semibold text-foreground">Modul Deliverable</label>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={genIncludeMilestone}
                        onChange={(e) => setGenIncludeMilestone(e.target.checked)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span>Capaian Milestone & Status Tugas</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={genIncludeFinance}
                        onChange={(e) => setGenIncludeFinance(e.target.checked)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span>Ringkasan Finansial & Nilai Kontrak</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={genIncludeRisk}
                        onChange={(e) => setGenIncludeRisk(e.target.checked)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span>Matriks Identifikasi Risiko & Mitigasi</span>
                    </label>
                  </div>
                </div>

                {/* Generator Actions */}
                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <button
                    onClick={handleSaveReportToRepo}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  >
                    <FileCheck className="size-4" />
                    Simpan Laporan ke Repositori
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <Printer className="size-4" />
                    Cetak / Simpan sebagai PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Executive A4 Preview (7 cols) */}
            <div className="lg:col-span-7">
              <div className="sticky top-4 rounded-xl border border-border bg-card p-6 shadow-md print:border-none print:shadow-none print:p-0">
                {/* Formal Consulting Header */}
                <div className="border-b-2 border-primary/40 pb-4 mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-bold tracking-widest text-primary uppercase">
                        ALL IN ONE STRATEGIC CONSULTING
                      </p>
                      <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">
                        {genJudul || "Laporan Khusus & Rekomendasi"}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{genSubjudul}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        OFFICIAL DELIVERABLE
                      </span>
                      <p className="mt-1 text-[10px] text-muted-foreground">REF: NSR-REP-2026-04</p>
                    </div>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg bg-muted/40 p-3 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase">Klien:</span>
                    <p className="font-semibold text-foreground truncate">{genClient?.nama}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase">Engagement:</span>
                    <p className="font-semibold text-foreground truncate">{genProject?.nama}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase">Periode:</span>
                    <p className="font-semibold text-foreground">{genPeriode}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase">Kerahasiaan:</span>
                    <p className="font-semibold text-red-600 dark:text-red-400">Strictly Confidential</p>
                  </div>
                </div>

                {/* Executive Summary Section */}
                <div className="space-y-4 text-xs leading-relaxed text-foreground">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-primary" />
                      1. Ringkasan Eksekutif & Temuan Utama
                    </h4>
                    <p className="text-muted-foreground">
                      Berdasarkan evaluasi terhadap implementasi inisiatif strategi pada{" "}
                      <strong className="text-foreground">{genClient?.nama}</strong>, program kerja berjalan
                      dengan tingkat pencapaian milestone <strong className="text-foreground">{genProject?.progres}%</strong>.
                      Secara keseluruhan kapabilitas tim dan koordinasi teknis menunjukkan tren positif sesuai
                      jadwal sasaran.
                    </p>
                  </div>

                  {/* Milestone status if included */}
                  {genIncludeMilestone && (
                    <div className="rounded-lg border border-border p-3 bg-card/60">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                        <span>2. Evaluasi Milestone & Capaian Proyek</span>
                        <span className="text-primary font-bold">{genProject?.progres}% Selesai</span>
                      </h4>
                      <div className="w-full bg-muted rounded-full h-2 mb-3">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${genProject?.progres || 50}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex justify-between border-b border-border/50 pb-1">
                          <span className="text-muted-foreground">Status Inisiatif:</span>
                          <span className="font-medium capitalize">{genProject?.status ?? "Aktif"}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-1">
                          <span className="text-muted-foreground">Tingkat Prioritas:</span>
                          <span className="font-medium capitalize">{genProject?.prioritas ?? "Tinggi"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial & Contract if included */}
                  {genIncludeFinance && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-primary" />
                        3. Ringkasan Finansial & Efisiensi Anggaran
                      </h4>
                      <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-3">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Nilai Kontrak Engagement</p>
                          <p className="text-base font-bold text-foreground">
                            {rupiah(genProject?.nilai || genClient?.nilai_kontrak || 350000000)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Estimasi Penyerapan Biaya</p>
                          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                            Efisiensi 94.2%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Risk Matrix if included */}
                  {genIncludeRisk && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-primary" />
                        4. Matriks Risiko & Mitigasi Operasional
                      </h4>
                      <div className="rounded-lg border border-border overflow-hidden">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-muted/60 text-muted-foreground border-b border-border font-medium">
                            <tr>
                              <th className="p-2">Identifikasi Risiko</th>
                              <th className="p-2">Tingkat</th>
                              <th className="p-2">Rencana Mitigasi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            <tr>
                              <td className="p-2 font-medium">Keterlambatan Integrasi Pihak Ketiga</td>
                              <td className="p-2 text-amber-600">Sedang</td>
                              <td className="p-2 text-muted-foreground">Penetapan sandbox terisolasi & fallback manual</td>
                            </tr>
                            <tr>
                              <td className="p-2 font-medium">Penyesuaian Kebijakan Kepatuhan Regulasi</td>
                              <td className="p-2 text-rose-600">Tinggi</td>
                              <td className="p-2 text-muted-foreground">Audit legal addendum secara simultan</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-primary" />
                      5. Rekomendasi Tindak Lanjut Konsultan
                    </h4>
                    <div className="rounded-lg bg-muted/40 p-3 text-[11px] whitespace-pre-line text-foreground">
                      {genRekomendasi}
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="pt-6 mt-6 border-t border-border grid grid-cols-2 gap-6 text-center text-xs">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Dibuat & Disahkan Oleh:</p>
                      <div className="h-10 flex items-center justify-center font-serif italic text-primary">
                        {genKonsultan.split(" ")[0]}
                      </div>
                      <p className="font-semibold text-foreground">{genKonsultan}</p>
                      <p className="text-[10px] text-muted-foreground">Lead Partner / Consultant</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Diterima & Disetujui Klien:</p>
                      <div className="h-10 flex items-center justify-center font-serif italic text-muted-foreground">
                        {genClient?.pic ?? "Direksi Klien"}
                      </div>
                      <p className="font-semibold text-foreground">{genClient?.pic ?? "Direktur Utama"}</p>
                      <p className="text-[10px] text-muted-foreground">{genClient?.nama}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: PUSTAKA TEMPLATE ================= */}
      {activeTab === "template" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-semibold">Pustaka Template Laporan Konsultansi Standar</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gunakan struktur baku yang telah teruji untuk mempercepat penyusunan kajian, audit, dan ringkasan eksekutif.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {TEMPLATE_LIST.map((tpl) => (
              <div
                key={tpl.id}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {tpl.kategori}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{tpl.waktuBaca}</span>
                  </div>

                  <h4 className="mt-3 text-base font-semibold tracking-tight text-foreground">
                    {tpl.judul}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {tpl.deskripsi}
                  </p>

                  <div className="mt-4 rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">Sasaran Pembaca:</span> {tpl.cocokUntuk}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                  <button
                    onClick={() => handleApplyTemplate(tpl)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                  >
                    <Sparkles className="size-3.5" />
                    Gunakan Template Ini
                  </button>
                  <button
                    onClick={() => {
                      setGenJudul(tpl.preset.judul);
                      setGenSubjudul(tpl.preset.subjudul);
                      setActiveTab("generator");
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium"
                  >
                    Lihat Pratinjau
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SLIDE-OVER DRAWER (DETAIL DOKUMEN) ================= */}
      {dokumenTerpilih && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
          <div className="flex h-full w-full max-w-md flex-col border-l border-border bg-background p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight">{dokumenTerpilih.nama}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {dokumenTerpilih.versi || "v1.0"} · {dokumenTerpilih.ukuran || "2.5 MB"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDokumenTerpilih(null)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content info */}
            <div className="space-y-4 py-4 text-xs">
              {/* Status Section */}
              <div className="rounded-lg border border-border p-3 bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Status Persetujuan:</span>
                  {(() => {
                    const badge = statusBadgeInfo(dokumenTerpilih.status_persetujuan);
                    return (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                          badge.className,
                        )}
                      >
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Kerahasiaan:</span>
                  {kerahasiaanBadge(dokumenTerpilih.kerahasiaan)}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Ubah Status Deliverable</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(dokumenTerpilih.id, "approved")}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                  >
                    <CheckCircle2 className="size-3.5" />
                    Sahkan (Approve)
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(dokumenTerpilih.id, "review")}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                  >
                    <Clock className="size-3.5" />
                    Kirim Review
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(dokumenTerpilih.id, "draft")}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-muted py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <AlertCircle className="size-3.5" />
                    Kembalikan Draf
                  </button>
                  <button
                    onClick={() => {
                      const note = prompt("Masukkan catatan revisi yang dibutuhkan:", dokumenTerpilih.catatan_revisi || "");
                      if (note !== null) {
                        handleUpdateStatus(dokumenTerpilih.id, "rejected", note);
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                  >
                    <XCircle className="size-3.5" />
                    Minta Revisi
                  </button>
                </div>
              </div>

              {/* Ringkasan */}
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Ringkasan Eksekutif Dokumen:</span>
                <p className="rounded-lg border border-border bg-card p-3 leading-relaxed text-foreground">
                  {dokumenTerpilih.ringkasan || "Tidak ada ringkasan yang dicantumkan."}
                </p>
              </div>

              {/* Catatan Revisi */}
              {dokumenTerpilih.catatan_revisi && (
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium">Catatan Review Terakhir:</span>
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-700 dark:text-amber-300">
                    {dokumenTerpilih.catatan_revisi}
                  </div>
                </div>
              )}

              {/* Metadata Details */}
              <div className="space-y-2 rounded-lg border border-border bg-card p-3">
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Klien Pemilik:</span>
                  <span className="font-medium text-foreground">{getClientName(dokumenTerpilih.client_id)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Engagement Proyek:</span>
                  <span className="font-medium text-foreground">{getProjectName(dokumenTerpilih.project_id)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Diunggah Oleh:</span>
                  <span className="text-foreground">{dokumenTerpilih.diunggah_oleh ?? "Tim Konsultan"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Waktu Dibuat:</span>
                  <span className="text-foreground">{tanggal(dokumenTerpilih.created_at)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Portal Klien:</span>
                  <span className="font-medium text-foreground">
                    {dokumenTerpilih.dibagikan_ke_klien ? "Terbuka untuk Klien" : "Internal Konsultan"}
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="mt-auto border-t border-border pt-4 flex gap-2">
              <button
                onClick={() => {
                  alert(`Mengunduh salinan berkas: ${dokumenTerpilih.nama}`);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Download className="size-3.5" />
                Unduh Berkas
              </button>
              <button
                onClick={() => {
                  handleDeleteDocument(dokumenTerpilih.id);
                }}
                className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-xs text-rose-600 hover:bg-rose-500/10"
                title="Hapus"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL UNGGAH / TAMBAH DOKUMEN ================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </div>
                <h3 className="text-base font-semibold">Unggah Dokumen Deliverable Baru</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-medium text-foreground">Nama Berkas Dokumen *</label>
                <input
                  required
                  placeholder="Contoh: Laporan Studi Kelayakan Finansial Q3 2026.pdf"
                  value={formDokumen.nama}
                  onChange={(e) => setFormDokumen({ ...formDokumen, nama: e.target.value })}
                  className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground">Klien Tujuan</label>
                  <select
                    value={formDokumen.client_id}
                    onChange={(e) => {
                      const cid = e.target.value;
                      const relatedP = projects.find((p) => p.client_id === cid);
                      setFormDokumen({
                        ...formDokumen,
                        client_id: cid,
                        project_id: relatedP?.id || "",
                      });
                    }}
                    className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">-- Pilih Klien --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-medium text-foreground">Proyek Engagement</label>
                  <select
                    value={formDokumen.project_id}
                    onChange={(e) => setFormDokumen({ ...formDokumen, project_id: e.target.value })}
                    className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">-- Pilih Proyek --</option>
                    {projects
                      .filter((p) => !formDokumen.client_id || p.client_id === formDokumen.client_id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nama}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-medium text-foreground">Kategori</label>
                  <select
                    value={formDokumen.kategori}
                    onChange={(e) =>
                      setFormDokumen({ ...formDokumen, kategori: e.target.value, jenis: e.target.value })
                    }
                    className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Kajian Khusus">Kajian Khusus</option>
                    <option value="Audit & Kepatuhan">Audit & Kepatuhan</option>
                    <option value="Laporan Kinerja">Laporan Kinerja</option>
                    <option value="Studi Kelayakan">Studi Kelayakan</option>
                    <option value="Legal & Kontrak">Legal & Kontrak</option>
                    <option value="Executive Brief">Executive Brief</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-foreground">Kerahasiaan</label>
                  <select
                    value={formDokumen.kerahasiaan}
                    onChange={(e) =>
                      setFormDokumen({ ...formDokumen, kerahasiaan: e.target.value as Kerahasiaan })
                    }
                    className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Rahasia">Rahasia</option>
                    <option value="Internal">Internal</option>
                    <option value="Publik">Publik</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-foreground">Versi</label>
                  <input
                    value={formDokumen.versi}
                    onChange={(e) => setFormDokumen({ ...formDokumen, versi: e.target.value })}
                    placeholder="v1.0"
                    className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-foreground">Ringkasan / Abstrak Berkas</label>
                <textarea
                  rows={2}
                  placeholder="Intisari isi deliverable dan tujuan penerbitan dokumen..."
                  value={formDokumen.ringkasan}
                  onChange={(e) => setFormDokumen({ ...formDokumen, ringkasan: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="share_client"
                  checked={formDokumen.dibagikan_ke_klien}
                  onChange={(e) => setFormDokumen({ ...formDokumen, dibagikan_ke_klien: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <label htmlFor="share_client" className="text-xs text-foreground cursor-pointer">
                  Bagikan langsung ke Portal Klien (Dapat diunduh klien)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
