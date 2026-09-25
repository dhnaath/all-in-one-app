import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  CheckSquare,
  ShieldCheck,
  PackageCheck,
  CalendarDays,
  Clock,
  CalendarRange,
  GitCommit,
  Hourglass,
  FolderKanban,
  Workflow,
  Flag,
  Users2,
  Users,
  Compass,
  FileText,
  Palette,
  Mail,
  Network,
  Truck,
  DollarSign,
  TrendingUp,
  BarChart3,
  Bookmark,
  FileCheck,
  ClipboardList,
  FormInput,
  Search,
  Bell,
  AlarmClock,
  Timer,
  Flame,
  CheckCircle2,
  Lock,
  CreditCard,
  Receipt,
  Layers,
  Star,
  ArrowRight,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export interface StandaloneSubFeature {
  title: string;
  to: string;
  icon: LucideIcon;
}

export type ProductivityCategoryGroup =
  | "all"
  | "task-workflow"
  | "planning-timeline"
  | "collaboration-ops"
  | "analytics-standards"
  | "utilities-finance";

export interface StandaloneProductivityAppDef {
  id: string;
  to: string;
  title: string;
  subtitle: string;
  category: "task-workflow" | "planning-timeline" | "collaboration-ops" | "analytics-standards" | "utilities-finance";
  categoryLabel: string;
  icon: LucideIcon;
  badge?: string;
  features?: StandaloneSubFeature[];
}

export const STANDALONE_PRODUCTIVITY_APPS: StandaloneProductivityAppDef[] = [
  // 1. Task Manager (Standalone)
  {
    id: "task-manager",
    to: "/task-manager",
    title: "Task Manager",
    subtitle: "Sistem eksekusi tugas, to-do harian, checklist prioritas, dan filter penugasan kerja.",
    category: "task-workflow",
    categoryLabel: "Task & Workflow",
    icon: CheckSquare,
    badge: "Standalone",
  },
  // 2. Approval Manager (Standalone)
  {
    id: "approval-manager",
    to: "/approval-manager",
    title: "Approval Manager",
    subtitle: "Pusat persetujuan dokumen, review pengajuan klien, otorisasi anggaran, dan sign-off formal.",
    category: "task-workflow",
    categoryLabel: "Task & Workflow",
    icon: ShieldCheck,
    badge: "Standalone",
  },
  // 3. Deliverable Manager (Standalone)
  {
    id: "deliverable-manager",
    to: "/deliverable-manager",
    title: "Deliverable Manager",
    subtitle: "Pelacakan output deliverable proyek, status serah terima, revisi klien, dan kendali kualitas.",
    category: "task-workflow",
    categoryLabel: "Task & Workflow",
    icon: PackageCheck,
    badge: "Standalone",
  },
  // 4. Calendar (Standalone)
  {
    id: "calendar",
    to: "/kalender",
    title: "Calendar",
    subtitle: "Kalender eksekutif terpadu, integrasi jadwal acara, deadline deliverable, dan agenda kerja.",
    category: "planning-timeline",
    categoryLabel: "Planning & Timeline",
    icon: CalendarDays,
    badge: "Standalone",
  },
  // 5. Planner (Standalone)
  {
    id: "planner",
    to: "/planner",
    title: "Planner",
    subtitle: "Perencanaan harian & mingguan, time-blocking terfokus, target prioritas, dan refleksi produktivitas.",
    category: "planning-timeline",
    categoryLabel: "Planning & Timeline",
    icon: Clock,
    badge: "Standalone",
  },
  // 6. Schedule Manager (Standalone)
  {
    id: "schedule-manager",
    to: "/schedule-manager",
    title: "Schedule Manager",
    subtitle: "Sinkronisasi slot ketersediaan, alokasi jam kerja tim, dan perencanaan jadwal multi-agenda.",
    category: "planning-timeline",
    categoryLabel: "Planning & Timeline",
    icon: CalendarRange,
    badge: "Standalone",
  },
  // 7. Timeline Manager (Standalone)
  {
    id: "timeline-manager",
    to: "/timeline",
    title: "Timeline Manager",
    subtitle: "Visualisasi timeline kronologis, ketergantungan fase kerja, dan lintasan waktu capaian proyek.",
    category: "planning-timeline",
    categoryLabel: "Planning & Timeline",
    icon: GitCommit,
    badge: "Standalone",
  },
  // 8. Countdown (Standalone)
  {
    id: "countdown",
    to: "/countdown",
    title: "Countdown",
    subtitle: "Pelacak hitung mundur waktu peluncuran, tenggat rilis kritis, batas penawaran, dan hari H.",
    category: "planning-timeline",
    categoryLabel: "Planning & Timeline",
    icon: Hourglass,
    badge: "Standalone",
  },
  // 9. Project Manager (Standalone)
  {
    id: "project-manager",
    to: "/proyek",
    title: "Project Manager",
    subtitle: "Manajemen portofolio proyek strategis, alokasi scope, monitoring milestone, dan dashboard progres.",
    category: "task-workflow",
    categoryLabel: "Task & Workflow",
    icon: FolderKanban,
    badge: "Standalone",
  },
  // 10. Workflow Manager (Standalone) + Review dan Retrospective
  {
    id: "workflow-manager",
    to: "/workflow-manager",
    title: "Workflow Manager",
    subtitle: "Automasi alur kerja operasional, standardisasi tahapan pipeline, serta evaluasi retrospektif.",
    category: "task-workflow",
    categoryLabel: "Task & Workflow",
    icon: Workflow,
    badge: "Standalone",
    features: [
      { title: "Review dan Retrospective", to: "/lainnya?app=retro", icon: FileText },
    ],
  },
  // 11. Milestone Manager (Standalone) + Milestone dan Roadmap
  {
    id: "milestone-manager",
    to: "/milestone-manager",
    title: "Milestone Manager",
    subtitle: "Pelacakan titik pencapaian penting, fase keberhasilan proyek, dan peta jalan jangka panjang.",
    category: "planning-timeline",
    categoryLabel: "Planning & Timeline",
    icon: Flag,
    badge: "Standalone",
    features: [
      { title: "Milestone dan Roadmap", to: "/lainnya?app=roadmap", icon: Compass },
    ],
  },
  // 12. Meeting Manager (Standalone) + Risalah Rapat (Minutes)
  {
    id: "meeting-manager",
    to: "/meeting-manager",
    title: "Meeting Manager",
    subtitle: "Pengorganisasian agenda rapat, koordinasi peserta, serta penyimpanan notula & aksi tindak lanjut.",
    category: "collaboration-ops",
    categoryLabel: "Collaboration & Ops",
    icon: Users2,
    badge: "Standalone",
    features: [
      { title: "Risalah Rapat (Minutes)", to: "/lainnya?app=minutes", icon: FileText },
    ],
  },
  // 13. Collaboration (Standalone) + Whiteboard/Canvas & Agenda Surat
  {
    id: "collaboration",
    to: "/collaboration",
    title: "Collaboration",
    subtitle: "Ruang kolaborasi lintas fungsi, papan kanvas brainstorming, serta korespondensi surat masuk-keluar.",
    category: "collaboration-ops",
    categoryLabel: "Collaboration & Ops",
    icon: Users,
    badge: "Standalone",
    features: [
      { title: "Whiteboard dan Canvas", to: "/lainnya?app=canvas", icon: Palette },
      { title: "Agenda Surat dan Ekspedisi", to: "/lainnya?app=mailroom", icon: Mail },
    ],
  },
  // 14. Interaction Manager (Standalone)
  {
    id: "interaction-manager",
    to: "/interaction-manager",
    title: "Interaction Manager",
    subtitle: "Rekam jejak riwayat komunikasi, pertemuan konsultasi, poin pembicaraan penting, dan tindak lanjut.",
    category: "collaboration-ops",
    categoryLabel: "Collaboration & Ops",
    icon: Network,
    badge: "Standalone",
  },
  // 15. Resource Manager (Standalone) + Vendor & Daftar Tarif
  {
    id: "resource-manager",
    to: "/resource-manager",
    title: "Resource Manager",
    subtitle: "Manajemen aset sumber daya manusia, alat kerja spesialis, direktori vendor rekanan, dan rate card jasa.",
    category: "collaboration-ops",
    categoryLabel: "Collaboration & Ops",
    icon: Briefcase,
    badge: "Standalone",
    features: [
      { title: "Vendor dan Pemasok", to: "/lainnya?app=vendors", icon: Truck },
      { title: "Daftar Tarif dan Jasa", to: "/lainnya?app=services-ratecard", icon: DollarSign },
    ],
  },
  // 16. People Manager (Standalone) + Workload dan Capacity
  {
    id: "people-manager-prod",
    to: "/people-manager",
    title: "People Manager",
    subtitle: "Pengelolaan direktori tim profesional, struktur peran organisasi, beban kerja, dan analisis kapasitas.",
    category: "collaboration-ops",
    categoryLabel: "Collaboration & Ops",
    icon: Users,
    badge: "Standalone",
    features: [
      { title: "Workload dan Capacity", to: "/lainnya?app=workload", icon: BarChart3 },
    ],
  },
  // 17. Goal Manager (Standalone)
  {
    id: "goal-manager",
    to: "/goal-manager",
    title: "Goal Manager",
    subtitle: "Penetapan sasaran kinerja strategis, framework OKR/KPI, dan monitoring progres pencapaian kuartal.",
    category: "analytics-standards",
    categoryLabel: "Analytics & Standards",
    icon: TrendingUp,
    badge: "Standalone",
  },
  // 18. Statistics (Standalone)
  {
    id: "statistics",
    to: "/statistics",
    title: "Statistics",
    subtitle: "Analitik metrik produktivitas kerja, rasio penyelesaian tugas, velocity tim, dan visualisasi kinerja.",
    category: "analytics-standards",
    categoryLabel: "Analytics & Standards",
    icon: BarChart3,
    badge: "Standalone",
  },
  // 19. Template Manager (Standalone) + SOP Baku & Template Dokumen
  {
    id: "template-manager",
    to: "/template-manager",
    title: "Template Manager",
    subtitle: "Penyimpanan standard operating procedures (SOP), format dokumen kerja resmi, dan standar mutu.",
    category: "analytics-standards",
    categoryLabel: "Analytics & Standards",
    icon: Bookmark,
    badge: "Standalone",
    features: [
      { title: "SOP dan Prosedur Baku", to: "/lainnya?app=sop", icon: FileCheck },
      { title: "Template Dokumen Kerja", to: "/lainnya?app=templates", icon: ClipboardList },
    ],
  },
  // 20. Forms (Standalone)
  {
    id: "forms",
    to: "/forms",
    title: "Forms",
    subtitle: "Pembuat formulir survei digital, intake brief proyek, formulir feedback klien, dan kuesioner data.",
    category: "analytics-standards",
    categoryLabel: "Analytics & Standards",
    icon: FormInput,
    badge: "Standalone",
  },
  // 21. Search Manager (Standalone)
  {
    id: "search-manager",
    to: "/search-manager",
    title: "Search Manager",
    subtitle: "Pencarian universal instan lintas tugas, deliverable, berkas, dokumen klien, dan riwayat arsip.",
    category: "utilities-finance",
    categoryLabel: "Utilities & Finance",
    icon: Search,
    badge: "Standalone",
  },
  // 22. Notification Center (Standalone)
  {
    id: "notification-center",
    to: "/notification-center",
    title: "Notification Center",
    subtitle: "Pusat notifikasi peringatan deadline, update perubahan dokumen, reminder sistem, dan log aktivitas.",
    category: "utilities-finance",
    categoryLabel: "Utilities & Finance",
    icon: Bell,
    badge: "Standalone",
  },
  // 23. Reminder Manager (Standalone)
  {
    id: "reminder-manager",
    to: "/reminder-manager",
    title: "Reminder Manager",
    subtitle: "Manajemen pengingat kustom berulang, alert tenggat penting, dan sinkronisasi follow-up berkala.",
    category: "planning-timeline",
    categoryLabel: "Planning & Timeline",
    icon: AlarmClock,
    badge: "Standalone",
  },
  // 24. Time Tracker (Standalone)
  {
    id: "time-tracker",
    to: "/time-tracker",
    title: "Time Tracker",
    subtitle: "Pelacakan durasi jam kerja, timesheet penagihan klien, dan audit efisiensi waktu tugas.",
    category: "utilities-finance",
    categoryLabel: "Utilities & Finance",
    icon: Timer,
    badge: "Standalone",
  },
  // 25. Focus Timer (Standalone)
  {
    id: "focus-timer",
    to: "/focus-timer",
    title: "Focus Timer",
    subtitle: "Sesi konsentrasi Pomodoro, interval deep work terstruktur, dan pemulihan fokus mental eksekutif.",
    category: "utilities-finance",
    categoryLabel: "Utilities & Finance",
    icon: Flame,
    badge: "Standalone",
  },
  // 26. Habit Tracker (Standalone)
  {
    id: "habit-tracker",
    to: "/habit-tracker",
    title: "Habit Tracker",
    subtitle: "Pembangunan disiplin rutinitas harian, rekor streak kebiasaan positif, dan konsistensi jangka panjang.",
    category: "utilities-finance",
    categoryLabel: "Utilities & Finance",
    icon: CheckCircle2,
    badge: "Standalone",
  },
  // 27. Asset Manager (Standalone) + Access dan Key Directory
  {
    id: "asset-manager",
    to: "/asset-manager",
    title: "Asset Manager",
    subtitle: "Inventarisasi aset fisik & perangkat digital kerja, lisensi perangkat lunak, dan repositori hak akses.",
    category: "utilities-finance",
    categoryLabel: "Utilities & Finance",
    icon: Lock,
    badge: "Standalone",
    features: [
      { title: "Access dan Key Directory", to: "/lainnya?app=access-matrix", icon: Lock },
    ],
  },
  // 28. Subscription Manager (Standalone)
  {
    id: "subscription-manager",
    to: "/subscription-manager",
    title: "Subscription Manager",
    subtitle: "Monitoring langganan software/SaaS perusahaan, jadwal siklus perpanjangan, dan audit biaya recurring.",
    category: "utilities-finance",
    categoryLabel: "Utilities & Finance",
    icon: CreditCard,
    badge: "Standalone",
  },
  // 29. Expense Tracker (Standalone)
  {
    id: "expense-tracker",
    to: "/expense-tracker",
    title: "Expense Tracker",
    subtitle: "Pencatatan pengeluaran operasional kerja, klaim reimburse proyek, bukti transfer, dan audit pos beban.",
    category: "utilities-finance",
    categoryLabel: "Utilities & Finance",
    icon: Receipt,
    badge: "Standalone",
  },
];

interface ProductivitySectionProps {
  page?: {
    title: string;
    subCategories: any[];
  };
  favorites: string[];
  toggleFavorite: (to: string) => void;
  setActiveFolder?: (folder: any) => void;
  getGradient: (name: string) => string;
  FolderTile?: any;
}

export function ProductivitySection({
  favorites,
  toggleFavorite,
  getGradient,
}: ProductivitySectionProps) {
  const [activeTab, setActiveTab] = useState<ProductivityCategoryGroup>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = useMemo(() => {
    return STANDALONE_PRODUCTIVITY_APPS.filter((app) => {
      const matchCategory = activeTab === "all" || app.category === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        app.title.toLowerCase().includes(q) ||
        app.subtitle.toLowerCase().includes(q) ||
        app.features?.some((f) => f.title.toLowerCase().includes(q));
      return matchCategory && matchQuery;
    });
  }, [activeTab, searchQuery]);

  const countAll = STANDALONE_PRODUCTIVITY_APPS.length;
  const countTaskWorkflow = STANDALONE_PRODUCTIVITY_APPS.filter(
    (a) => a.category === "task-workflow"
  ).length;
  const countPlanningTimeline = STANDALONE_PRODUCTIVITY_APPS.filter(
    (a) => a.category === "planning-timeline"
  ).length;
  const countCollabOps = STANDALONE_PRODUCTIVITY_APPS.filter(
    (a) => a.category === "collaboration-ops"
  ).length;
  const countAnalytics = STANDALONE_PRODUCTIVITY_APPS.filter(
    (a) => a.category === "analytics-standards"
  ).length;
  const countUtilities = STANDALONE_PRODUCTIVITY_APPS.filter(
    (a) => a.category === "utilities-finance"
  ).length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Description */}
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2">
          <span>Productivity and Operations</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-xl mx-auto">
          29 Standalone Apps Terintegrasi — Eksekusi Tugas, Jadwal, Kolaborasi, Analitik, dan Utilitas Kerja.
        </p>
      </div>

      {/* Main Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "all"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Layers className="size-4 shrink-0" />
          <span>Semua App</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "all"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countAll}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("task-workflow")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "task-workflow"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <CheckSquare className="size-4 shrink-0" />
          <span>Task & Workflow</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "task-workflow"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countTaskWorkflow}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("planning-timeline")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "planning-timeline"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <CalendarDays className="size-4 shrink-0" />
          <span>Planning & Timeline</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "planning-timeline"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countPlanningTimeline}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("collaboration-ops")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "collaboration-ops"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Users className="size-4 shrink-0" />
          <span>Collaboration & Ops</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "collaboration-ops"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countCollabOps}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("analytics-standards")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "analytics-standards"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <BarChart3 className="size-4 shrink-0" />
          <span>Analytics & Standards</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "analytics-standards"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countAnalytics}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("utilities-finance")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "utilities-finance"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Timer className="size-4 shrink-0" />
          <span>Utilities & Tracker</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "utilities-finance"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countUtilities}
          </span>
        </button>
      </div>

      {/* Standalone Apps Cards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredApps.map((app) => {
          const isFav = favorites.includes(app.to);
          const gradient = getGradient(app.title);
          const Icon = app.icon;

          return (
            <div
              key={app.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
            >
              <div>
                {/* Header: Icon, Title & Standalone Badge */}
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={app.to}
                    className="flex items-center gap-3.5 group/header min-w-0 flex-1 outline-none"
                  >
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0 ${gradient} group-hover/header:scale-105 transition-transform`}
                    >
                      <Icon className="h-6 w-6 opacity-90 drop-shadow-sm" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-foreground group-hover/header:text-primary transition-colors truncate">
                          {app.title}
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary shrink-0 uppercase tracking-wide">
                          Standalone
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground capitalize">
                        Kategori: {app.categoryLabel}
                      </span>
                    </div>
                  </Link>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(app.to)}
                    className="p-1.5 rounded-xl border border-border/60 hover:bg-muted/60 text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer"
                    title={isFav ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                  >
                    <Star
                      className={`size-4 ${
                        isFav ? "fill-amber-400 text-amber-400" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Subtitle */}
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  {app.subtitle}
                </p>

                {/* Sub-Features Chips (If any) */}
                {app.features && app.features.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                      Fitur di Dalamnya ({app.features.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.features.map((feat, idx) => {
                        const FeatIcon = feat.icon;
                        const featPath = feat.to.split("?")[0];
                        const featSearch = feat.to.includes("?")
                          ? Object.fromEntries(new URLSearchParams(feat.to.split("?")[1]))
                          : undefined;

                        return (
                          <Link
                            key={idx}
                            to={featPath}
                            search={featSearch as any}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-primary/10 hover:text-primary text-[11px] font-medium text-foreground transition-all cursor-pointer border border-border/40 hover:border-primary/30"
                          >
                            <FeatIcon size={12} className="text-primary shrink-0" />
                            <span>{feat.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Quick Open Link */}
              <div className="border-t border-border/50 pt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">
                  {app.features ? `${app.features.length} sub-modul terpadu` : "Modul mandiri"}
                </span>

                <Link
                  to={app.to}
                  className="font-semibold text-primary flex items-center gap-1 hover:underline"
                >
                  <span>Buka App</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
