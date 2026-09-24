import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { isNewlyRevisedApp } from "@/utils/revisedAppsMarker";
import {
  Star,
  Layers,
  FolderKanban,
  CheckSquare,
  FileText,
  Target,
  Wallet,
  CalendarDays,
  Ticket,
  Timer,
  Grid2X2,
  Bookmark,
  NotebookText,
  MessagesSquare,
  Lightbulb,
  Activity,
  BookOpen,
  Briefcase,
  Users,
  User,
  Pocket,
  ShoppingBag,
  Vault,
  Luggage,
  Key,
  Archive,
  GraduationCap,
  Globe,
  Book,
  Dumbbell,
  Droplet,
  PenTool,
  Code,
  Package,
  Building,
  ShieldCheck,
  Workflow,
  LineChart,
  RefreshCw,
  Binary,
  ShieldAlert,
  Scale,
  HeartHandshake,
  Share2,
  LayoutGrid,
  TrendingUp,
  FolderOpen,
  ScrollText,
  Shield,
  HeartPulse,
  CheckCircle2,
  Gauge,
  Calculator,
  Navigation,
  FileCheck,
  Lock,
  Zap,
  Clock,
  Compass,
  Truck,
  Mail,
  Database,
  Scissors,
  type LucideIcon,
} from "lucide-react";
import { navKonsultan, type NavItem } from "@/config/nav";

type LauncherItem =
  | { type: "app"; item: NavItem }
  | { type: "folder"; id: string; title: string; items: NavItem[] };

interface ProductivitySectionProps {
  page: {
    title: string;
    subCategories: { title: string; rawItems: NavItem[] }[];
  };
  favorites: string[];
  toggleFavorite: (to: string) => void;
  setActiveFolder: (folder: { id: string; title: string; items: NavItem[] } | null) => void;
  getGradient: (name: string) => string;
  FolderTile: React.ComponentType<{
    folder: { id: string; title: string; items: NavItem[] };
    onClick: () => void;
  }>;
}

export type MainCategoryTab =
  | "all"
  | "personal-productivity"
  | "knowledge-information"
  | "work-operations"
  | "business-operations"
  | "ownership-security";

export interface ProductivityCategory {
  id: string;
  title: string;
  group: Exclude<MainCategoryTab, "all">;
  icon: LucideIcon;
  getItems: () => LauncherItem[];
}

export function ProductivitySection({
  favorites,
  toggleFavorite,
  setActiveFolder,
  getGradient,
  FolderTile,
}: ProductivitySectionProps) {
  const [mainTab, setMainTab] = useState<MainCategoryTab>("all");
  const [activeSpecific, setActiveSpecific] = useState<string>("all");

  // Flattened nav items lookup map
  const allNavMap = useMemo(() => {
    const map = new Map<string, NavItem>();
    navKonsultan.forEach((g) => {
      g.items.forEach((item) => {
        if (!map.has(item.to)) {
          map.set(item.to, item);
        }
      });
    });
    return map;
  }, []);

  const resolveApp = (to: string, label: string, icon: LucideIcon): LauncherItem => {
    const found = allNavMap.get(to);
    return {
      type: "app",
      item: found || { to, label, icon },
    };
  };

  // Categories list matching user's requested structure:
  // Personal Productivity, Knowledge and Information, Work Operations, Business Operations, Ownership and Security
  const PRODUCTIVITY_CATEGORIES: ProductivityCategory[] = useMemo(() => {
    return [
      // 1. Personal Productivity
      {
        id: "cat-planning-scheduling",
        title: "Planning and Scheduling",
        group: "personal-productivity",
        icon: CalendarDays,
        getItems: () => [
          resolveApp("/kalender", "Calendar", CalendarDays),
          resolveApp("/planner", "Planner", Clock),
          resolveApp("/reminder-manager", "Reminder Manager", Clock),
          resolveApp("/pomodoro", "Focus Timer", Timer),
          resolveApp("/eisenhower", "Eisenhower Matrix", Grid2X2),
          resolveApp("/countdown", "Countdown", Timer),
        ],
      },
      {
        id: "cat-tasks-projects",
        title: "Tasks and Projects",
        group: "personal-productivity",
        icon: CheckSquare,
        getItems: () => [
          resolveApp("/task-manager", "Task Manager", CheckSquare),
          resolveApp("/kanban", "Kanban Board", LayoutGrid),
          resolveApp("/timeline", "Timeline Manager", Compass),
          resolveApp("/proyek", "Project Manager", CheckCircle2),
          resolveApp("/proyek-personal", "Personal Projects", FolderKanban),
          resolveApp("/lainnya?app=roadmap", "Milestone & Roadmap", Compass),
        ],
      },
      {
        id: "cat-goals-habits",
        title: "Goals and Habits",
        group: "personal-productivity",
        icon: Target,
        getItems: () => [
          resolveApp("/goal-manager", "Goals & Target", Target),
          resolveApp("/habits", "Habit Tracker", Activity),
          resolveApp("/lainnya?app=retro", "Review & Retrospective", RefreshCw),
          resolveApp("/journal", "Journal Harian", BookOpen),
          resolveApp("/health", "Health & Vitalitas", HeartPulse),
          resolveApp("/workouts", "Workouts", Dumbbell),
          resolveApp("/water", "Water Tracker", Droplet),
        ],
      },

      // 2. Knowledge and Information
      {
        id: "cat-notes-ideas",
        title: "Notes and Ideas",
        group: "knowledge-information",
        icon: NotebookText,
        getItems: () => [
          resolveApp("/notes", "Notes", FileText),
          resolveApp("/documents", "Documents", FileCheck),
          resolveApp("/database", "Database", Database),
          resolveApp("/catatan", "Catatan Cepat", NotebookText),
          resolveApp("/ideas", "Ideas & Gagasan", Lightbulb),
          resolveApp("/lainnya?app=canvas", "Whiteboard & Canvas", LayoutGrid),
          resolveApp("/writing", "Writing & Drafts", PenTool),
        ],
      },
      {
        id: "cat-research-reference",
        title: "Research and Reference",
        group: "knowledge-information",
        icon: BookOpen,
        getItems: () => [
          resolveApp("/wiki", "Wiki Engine", BookOpen),
          resolveApp("/knowledge-base", "Knowledge Base", BookOpen),
          resolveApp("/research-manager", "Research Manager", Compass),
          resolveApp("/web-clipper", "Web Clipper", Scissors),
          resolveApp("/reading", "Reading List", Book),
          resolveApp("/bookmarks", "Bookmarks & Tautan", Bookmark),
          resolveApp("/incoterms", "Panduan Incoterms", Navigation),
          resolveApp("/courses", "Courses & Pelatihan", GraduationCap),
          resolveApp("/flashcards", "Flashcards Belajar", Layers),
          resolveApp("/languages", "Languages", Globe),
        ],
      },

      // 3. Work Operations
      {
        id: "cat-work-planning",
        title: "Work Planning",
        group: "work-operations",
        icon: FolderKanban,
        getItems: () => [
          resolveApp("/lainnya?app=workload", "Workload & Capacity", Gauge),
          resolveApp("/tugas", "Manajemen Tugas", CheckCircle2),
        ],
      },
      {
        id: "cat-workflow-management",
        title: "Workflow Management",
        group: "work-operations",
        icon: Workflow,
        getItems: () => [
          resolveApp("/workflow-manager", "Workflow Manager", Workflow),
          resolveApp("/deliverable-manager", "Deliverable Manager", FileCheck),
          resolveApp("/forms", "Forms", FileText),
          resolveApp("/statistics", "Statistics", LineChart),
          resolveApp("/lainnya?app=sop", "SOP & Prosedur Baku", ShieldCheck),
          resolveApp("/portal.progres", "Progres & Tahapan", Workflow),
          resolveApp("/reports", "Laporan Kerja", NotebookText),
          resolveApp("/terminal", "Terminal Eksekusi", Binary),
          resolveApp("/shortcut", "Pintasan Kerja", Zap),
        ],
      },
      {
        id: "cat-professional-resources",
        title: "Professional Resources",
        group: "work-operations",
        icon: Briefcase,
        getItems: () => [
          resolveApp("/lainnya?app=templates", "Template Dokumen Kerja", FileText),
          resolveApp("/code", "Code & Dev Tools", Code),
          resolveApp("/design", "Design & Sketsa", PenTool),
          resolveApp("/exams", "Uji Kompetensi", FileText),
        ],
      },

      // 4. Business Operations
      {
        id: "cat-clients-vendors",
        title: "Clients and Vendors",
        group: "business-operations",
        icon: Users,
        getItems: () => [
          resolveApp("/contacts", "Kontak & CRM", Users),
          resolveApp("/lainnya?app=vendors", "Vendor & Pemasok", Truck),
          resolveApp("/portal.pesan", "Pesan Klien", MessagesSquare),
          resolveApp("/klien", "Klien & Partner", HeartHandshake),
          resolveApp("/portal", "Portal Kolaborasi", Share2),
          resolveApp("/portal.jadwal", "Jadwal Pertemuan Mitra", CalendarDays),
        ],
      },
      {
        id: "cat-products-services",
        title: "Products and Services",
        group: "business-operations",
        icon: Package,
        getItems: () => [
          resolveApp("/katalog-produk", "Katalog Produk", Package),
          resolveApp("/lainnya?app=services-ratecard", "Daftar Tarif & Jasa", ScrollText),
          resolveApp("/inventory", "Inventory & Stok", Archive),
          resolveApp("/portal.dokumen", "Spesifikasi Produk", FileText),
        ],
      },
      {
        id: "cat-administration-governance",
        title: "Administration and Governance",
        group: "business-operations",
        icon: Building,
        getItems: () => [
          resolveApp("/meeting-manager", "Meeting Manager", Users),
          resolveApp("/collaboration", "Collaboration", ShieldCheck),
          resolveApp("/search-manager", "Search Manager", Compass),
          resolveApp("/lainnya?app=mailroom", "Agenda Surat & Ekspedisi", Mail),
          resolveApp("/lainnya?app=minutes", "Risalah Rapat (Minutes)", ScrollText),
          resolveApp("/kalkulator", "Kalkulator Bisnis", Calculator),
          resolveApp("/profil", "Profil Bisnis & Identitas", Building),
        ],
      },

      // 5. Ownership and Security
      {
        id: "cat-digital-assets",
        title: "Digital Assets",
        group: "ownership-security",
        icon: Wallet,
        getItems: () => [
          resolveApp("/digital-assets", "Aset Digital & Lisensi", Globe),
          resolveApp("/wallet", "Dompet Digital", Wallet),
          resolveApp("/trunk", "Trunk Penyimpanan", Luggage),
          resolveApp("/pouch", "Pouch Dokumen Digital", ShoppingBag),
          resolveApp("/pocket", "Pocket Berkas", Pocket),
        ],
      },
      {
        id: "cat-access-storage",
        title: "Access and Storage",
        group: "ownership-security",
        icon: ShieldCheck,
        getItems: () => [
          resolveApp("/lainnya?app=access-matrix", "Access & Key Directory", Shield),
          resolveApp("/passwords", "Passwords & Kredensial", Key),
          resolveApp("/vault", "Vault Enkripsi", Vault),
        ],
      },
    ];
  }, [allNavMap]);

  // Aggregate items per tab
  const defaultItemsForTab = useMemo(() => {
    const collectItems = (group?: Exclude<MainCategoryTab, "all">) => {
      const cats = group
        ? PRODUCTIVITY_CATEGORIES.filter((c) => c.group === group)
        : PRODUCTIVITY_CATEGORIES;
      const seen = new Set<string>();
      const list: LauncherItem[] = [];

      cats.forEach((cat) => {
        cat.getItems().forEach((entry) => {
          if (entry.type === "app" && !seen.has(entry.item.to)) {
            seen.add(entry.item.to);
            list.push(entry);
          }
        });
      });
      return list;
    };

    return {
      all: collectItems(),
      "personal-productivity": collectItems("personal-productivity"),
      "knowledge-information": collectItems("knowledge-information"),
      "work-operations": collectItems("work-operations"),
      "business-operations": collectItems("business-operations"),
      "ownership-security": collectItems("ownership-security"),
    };
  }, [PRODUCTIVITY_CATEGORIES]);

  // Displayed items in right grid
  const displayedItems: LauncherItem[] = useMemo(() => {
    if (activeSpecific !== "all") {
      const cat = PRODUCTIVITY_CATEGORIES.find((c) => c.id === activeSpecific);
      return cat ? cat.getItems() : [];
    }
    return defaultItemsForTab[mainTab];
  }, [activeSpecific, mainTab, PRODUCTIVITY_CATEGORIES, defaultItemsForTab]);

  const activeCategoryTitle = useMemo(() => {
    if (activeSpecific === "all") return null;
    return PRODUCTIVITY_CATEGORIES.find((c) => c.id === activeSpecific)?.title || null;
  }, [activeSpecific, PRODUCTIVITY_CATEGORIES]);

  // Counts for main top pills
  const totalCountAll = defaultItemsForTab.all.length;
  const totalCountPersonal = defaultItemsForTab["personal-productivity"].length;
  const totalCountKnowledge = defaultItemsForTab["knowledge-information"].length;
  const totalCountWork = defaultItemsForTab["work-operations"].length;
  const totalCountBusiness = defaultItemsForTab["business-operations"].length;
  const totalCountOwnership = defaultItemsForTab["ownership-security"].length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Description */}
      <div className="text-center mb-[calc(1.5rem+10pt)]">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2">
          <span>Productivity<span className="font-normal">,</span> Operations<span className="font-normal">, and</span> Ownership</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-[calc(0.25rem+10pt)] max-w-xl mx-auto">
          A Unified Workspace Built to Empower You and Yours.
        </p>
      </div>

      {/* Main Level Pills di Atas */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full mb-[calc(2rem+10pt)]">
        {/* Semua */}
        <button
          onClick={() => {
            setMainTab("all");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "all"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Layers className="size-4 shrink-0" />
          <span>Semua</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "all"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountAll}
          </span>
        </button>

        {/* Personal Productivity */}
        <button
          onClick={() => {
            setMainTab("personal-productivity");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "personal-productivity"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <User className="size-4 shrink-0" />
          <span>Personal Productivity</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "personal-productivity"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountPersonal}
          </span>
        </button>

        {/* Knowledge and Information */}
        <button
          onClick={() => {
            setMainTab("knowledge-information");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "knowledge-information"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <BookOpen className="size-4 shrink-0" />
          <span>Knowledge and Information</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "knowledge-information"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountKnowledge}
          </span>
        </button>

        {/* Work Operations */}
        <button
          onClick={() => {
            setMainTab("work-operations");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "work-operations"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Briefcase className="size-4 shrink-0" />
          <span>Work Operations</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "work-operations"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountWork}
          </span>
        </button>

        {/* Business Operations */}
        <button
          onClick={() => {
            setMainTab("business-operations");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "business-operations"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Building className="size-4 shrink-0" />
          <span>Business Operations</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "business-operations"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountBusiness}
          </span>
        </button>

        {/* Ownership and Security */}
        <button
          onClick={() => {
            setMainTab("ownership-security");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "ownership-security"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <ShieldCheck className="size-4 shrink-0" />
          <span>Ownership and Security</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "ownership-security"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountOwnership}
          </span>
        </button>
      </div>

      {/* 12-Column Container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1640px] mx-auto w-full mb-[10pt] items-start">
        {/* LEFT: 3 Columns Space */}
        <div className="xl:col-span-3 w-full flex flex-col items-center xl:items-start">
          <div
            className="w-full flex flex-col gap-1.5 max-h-[720px] overflow-y-auto px-1 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Option Semua untuk Tab yang Aktif */}
            <button
              onClick={() => setActiveSpecific("all")}
              className={`w-full text-left px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                activeSpecific === "all"
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold scale-[1.01]"
                  : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Layers className="size-3.5 shrink-0" />
                <span className="truncate">Semua</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                  activeSpecific === "all"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background/80 text-muted-foreground"
                }`}
              >
                {mainTab === "all"
                  ? totalCountAll
                  : mainTab === "personal-productivity"
                  ? totalCountPersonal
                  : mainTab === "knowledge-information"
                  ? totalCountKnowledge
                  : mainTab === "work-operations"
                  ? totalCountWork
                  : mainTab === "business-operations"
                  ? totalCountBusiness
                  : totalCountOwnership}
              </span>
            </button>

            {/* Specific Categories filtered by mainTab */}
            {PRODUCTIVITY_CATEGORIES.filter((cat) => {
              if (mainTab === "all") return true;
              return cat.group === mainTab;
            }).map((cat) => {
              const Icon = cat.icon;
              const isActive = activeSpecific === cat.id;
              const count = cat.getItems().length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveSpecific(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm font-semibold scale-[1.01]"
                      : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="size-3.5 shrink-0" />
                    <span className="truncate">{cat.title}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background/80 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: 9 Columns Grid for Apps (Tepat 9 apps mendatar per baris on xl!) */}
        <div className="xl:col-span-9 w-full flex flex-col gap-4">
          {/* Breadcrumb / Active Category Path */}
          <div className="flex items-center justify-between px-1 py-1 text-xs border-b border-border/40 pb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-foreground/90">
                {mainTab === "all"
                  ? "Semua"
                  : mainTab === "personal-productivity"
                  ? "Personal Productivity"
                  : mainTab === "knowledge-information"
                  ? "Knowledge and Information"
                  : mainTab === "work-operations"
                  ? "Work Operations"
                  : mainTab === "business-operations"
                  ? "Business Operations"
                  : "Ownership and Security"}
              </span>
              {activeCategoryTitle && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="font-medium text-primary">{activeCategoryTitle}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-muted-foreground font-medium">{displayedItems.length} modul</span>
            </div>
          </div>

          {/* Launcher Grid - Exactly 9 apps horizontal on xl! */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-x-3 gap-y-6 place-items-start w-full">
            {displayedItems.length === 0 ? (
              <div className="col-span-full py-16 text-center text-sm text-muted-foreground italic w-full">
                Tidak ada modul yang ditemukan dalam filter ini.
              </div>
            ) : (
              displayedItems.map((entry) => {
                if (entry.type === "folder") {
                  return (
                    <FolderTile
                      key={entry.id}
                      folder={entry}
                      onClick={() => setActiveFolder(entry)}
                    />
                  );
                }

                const item = entry.item;
                const isRevised = isNewlyRevisedApp(item.to, item.label);
                const gradient = isRevised ? "" : getGradient(item.label);
                const isFav = favorites.includes(item.to);
                const itemPath = item.to.split("?")[0];
                const itemSearch = item.to.includes("?")
                  ? Object.fromEntries(new URLSearchParams(item.to.split("?")[1]))
                  : undefined;

                return (
                  <Link
                    key={item.to}
                    to={itemPath}
                    search={itemSearch as any}
                    className="flex flex-col items-center gap-2 group w-full outline-none relative"
                    title={isRevised ? `${item.label} (Tanda Sementara: Modul Baru Direvisi)` : item.label}
                  >
                    <div
                      className={`w-12 h-12 sm:w-13 sm:h-13 xl:w-14 xl:h-14 rounded-[1.25rem] flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110 group-active:scale-95 relative ${
                        isRevised
                          ? "bg-card text-foreground border-2 border-border dark:border-border shadow-md ring-2 ring-white/60"
                          : `${gradient} text-white`
                      }`}
                    >
                      <item.icon
                        className={`size-5 sm:size-6 ${
                          isRevised
                            ? "text-foreground drop-shadow-none"
                            : "opacity-90 drop-shadow-sm text-white"
                        }`}
                        strokeWidth={isRevised ? 2 : 1.5}
                      />

                      {/* Tanda Sementara badge */}
                      {isRevised && (
                        <span
                          className="absolute -top-1 -left-1 size-2.5 rounded-full bg-card border border-border shadow-xs"
                          title="Tanda Sementara"
                        />
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(item.to);
                        }}
                        className={`absolute -top-2 -right-2 p-1.5 rounded-full bg-background border shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 scale-90 hover:scale-110 cursor-pointer ${
                          isFav ? "opacity-100" : ""
                        }`}
                        aria-label="Favorit"
                      >
                        <Star
                          className={`size-3 sm:size-3.5 transition-colors ${
                            isFav ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>
                    <span className="text-[11px] text-foreground/90 font-medium text-center line-clamp-2 leading-tight px-0.5 group-hover:text-foreground">
                      {item.label}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
