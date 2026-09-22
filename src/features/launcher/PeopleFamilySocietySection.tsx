import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Star,
  Layers,
  Users,
  Home,
  Globe,
  Briefcase,
  Ticket,
  CalendarDays,
  Wallet,
  Plane,
  Utensils,
  ShoppingCart,
  Coins,
  HeartHandshake,
  ShieldCheck,
  Shield,
  Network,
  MessagesSquare,
  Building2,
  Share2,
  BookOpen,
  NotebookText,
  FileText,
  Pocket,
  Vault,
  Heart,
  Timer,
  Lightbulb,
  CloudSun,
  Scale,
  FolderKanban,
  CheckSquare,
  Key,
  FileCheck,
  PhoneCall,
  Gift,
  History,
  ArrowRightLeft,
  GitFork,
  Archive,
  PartyPopper,
  Megaphone,
  CreditCard,
  ScrollText,
  Compass,
  ShieldAlert,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { navKonsultan, type NavItem } from "@/config/nav";

type LauncherItem =
  | { type: "app"; item: NavItem }
  | { type: "folder"; id: string; title: string; items: NavItem[] };

interface PeopleFamilySocietySectionProps {
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

export type MainPeopleTab =
  | "all"
  | "people-relationships"
  | "family-management"
  | "community-membership"
  | "society-public";

interface SpecificCategory {
  id: string;
  title: string;
  group: Exclude<MainPeopleTab, "all">;
  icon: LucideIcon;
  getItems: () => LauncherItem[];
}

export function PeopleFamilySocietySection({
  favorites,
  toggleFavorite,
  setActiveFolder,
  getGradient,
  FolderTile,
}: PeopleFamilySocietySectionProps) {
  const [mainTab, setMainTab] = useState<MainPeopleTab>("all");
  const [activeSpecific, setActiveSpecific] = useState<string>("all");

  // Quick lookup helper for NavItem from navKonsultan
  const allNavMap = useMemo(() => {
    const map = new Map<string, NavItem>();
    navKonsultan.forEach((group) => {
      group.items.forEach((item) => {
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

  // Specific Categories Definitions based on user request:
  // 1. People and Relationships
  //    - Contacts
  //    - Communication
  //    - Relationship History
  // 2. Family Management
  //    - Family Organization
  //    - Family Records
  //    - Family Events
  // 3. Community and Membership
  //    - Community
  //    - Organizations
  //    - Social Contributions
  // 4. Society and Public
  //    - Public Information
  //    - Public Safety
  //    - Compliance
  const specificCategories: SpecificCategory[] = useMemo(() => {
    return [
      // 1. People and Relationships
      {
        id: "cat-contacts",
        title: "Contacts",
        group: "people-relationships",
        icon: Users,
        getItems: () => [
          resolveApp("/contacts", "Kontak & CRM", Users),
          resolveApp("/lainnya?app=circle-groups", "Lingkaran Relasi (Circles)", Network),
          resolveApp("/klien", "Klien & Partner", Briefcase),
          resolveApp("/contacts?tab=vip", "Direktori Kontak Penting", Users),
          resolveApp("/profil", "Kartu Nama & Identitas", Users),
        ],
      },
      {
        id: "cat-communication",
        title: "Communication",
        group: "people-relationships",
        icon: MessagesSquare,
        getItems: () => [
          resolveApp("/lainnya?app=catchup-cadence", "Pengingat Silaturahmi", PhoneCall),
          resolveApp("/lainnya?app=gift-tracker", "Pencatat Kado & Hadiah", Gift),
          resolveApp("/portal.pesan", "Pesan & Korespondensi", MessagesSquare),
          resolveApp("/portal", "Portal Kolaborasi", Building2),
          resolveApp("/notes", "Catatan Komunikasi Bersama", NotebookText),
          resolveApp("/portal.jadwal", "Jadwal Pertemuan Mitra", CalendarDays),
        ],
      },
      {
        id: "cat-relationship-history",
        title: "Relationship History",
        group: "people-relationships",
        icon: CalendarDays,
        getItems: () => [
          resolveApp("/lainnya?app=interaction-timeline", "Timeline Pertemuan", History),
          resolveApp("/lainnya?app=borrowed-items", "Pinjam Meminjam Barang", ArrowRightLeft),
          resolveApp("/events", "Riwayat Pertemuan & Acara", Ticket),
          resolveApp("/journal", "Jurnal Interaksi & Relasi", BookOpen),
          resolveApp("/catatan", "Catatan Relasi & Notula", NotebookText),
        ],
      },

      // 2. Family Management
      {
        id: "cat-family-organization",
        title: "Family Organization",
        group: "family-management",
        icon: Home,
        getItems: () => [
          resolveApp("/lainnya?app=family-tree", "Silsilah Keluarga (Tree)", GitFork),
          resolveApp("/lainnya?app=family-rules", "Aturan & Kesepakatan Rumah", Scale),
          resolveApp("/kalender", "Jadwal & Agenda Domestik", CalendarDays),
          resolveApp("/shopping", "Belanja Kebutuhan Domestik", ShoppingCart),
          resolveApp("/proyek", "Proyek & Urusan Keluarga", FolderKanban),
          resolveApp("/task-manager", "Daftar Tugas Domestik", CheckSquare),
        ],
      },
      {
        id: "cat-family-records",
        title: "Family Records",
        group: "family-management",
        icon: FileText,
        getItems: () => [
          resolveApp("/lainnya?app=family-archive", "Arsip Akta & Dokumen KK", Archive),
          resolveApp("/lainnya?app=medical-family", "Golongan Darah & Alergi", HeartHandshake),
          resolveApp("/pocket", "Dokumen & Arsip Keluarga", Pocket),
          resolveApp("/vault", "Berkas Keluarga Terenkripsi", Vault),
          resolveApp("/health", "Catatan Kesehatan Keluarga", Heart),
          resolveApp("/recipes", "Resep Warisan Keluarga", Utensils),
        ],
      },
      {
        id: "cat-family-events",
        title: "Family Events",
        group: "family-management",
        icon: Plane,
        getItems: () => [
          resolveApp("/lainnya?app=reunion-planner", "Perencana Reuni & Arisan", PartyPopper),
          resolveApp("/lainnya?app=family-anniversary", "Ulang Tahun & Hari Jadi", CalendarDays),
          resolveApp("/events", "Acara & Perayaan Keluarga", Ticket),
          resolveApp("/trips", "Liburan & Perjalanan Bersama", Plane),
          resolveApp("/countdown", "Ulang Tahun & Milestones", Timer),
        ],
      },

      // 3. Community and Membership
      {
        id: "cat-community",
        title: "Community",
        group: "community-membership",
        icon: Globe,
        getItems: () => [
          resolveApp("/lainnya?app=rt-rw-directory", "Buku Warga RT/RW", Users),
          resolveApp("/lainnya?app=community-announcements", "Papan Pengumuman Warga", Megaphone),
          resolveApp("/events", "Kopdar & Pertemuan Warga", Ticket),
          resolveApp("/portal", "Portal Forum Komunitas", Building2),
          resolveApp("/portal.pesan", "Obrolan & Pengumuman Warga", MessagesSquare),
          resolveApp("/kalender", "Kalender Kegiatan Komunitas", CalendarDays),
        ],
      },
      {
        id: "cat-organizations",
        title: "Organizations",
        group: "community-membership",
        icon: Building2,
        getItems: () => [
          resolveApp("/lainnya?app=membership-card", "KTA & Kartu Anggota", CreditCard),
          resolveApp("/lainnya?app=meeting-resolutions", "Hasil Keputusan Rapat", ScrollText),
          resolveApp("/portal", "Organisasi & Asosiasi", Building2),
          resolveApp("/klien", "Direktori Anggota & Pengurus", Users),
          resolveApp("/proyek", "Program Kerja Organisasi", FolderKanban),
        ],
      },
      {
        id: "cat-social-contributions",
        title: "Social Contributions",
        group: "community-membership",
        icon: HeartHandshake,
        getItems: () => [
          resolveApp("/lainnya?app=volunteer-log", "Jam Relawan & Bakti Sosial", Heart),
          resolveApp("/lainnya?app=donation-tracker", "Catatan Infaq & Donasi", Coins),
          resolveApp("/proyek", "Program Bakti & Aksi Sosial", HeartHandshake),
          resolveApp("/events", "Kegiatan & Partisipasi Sosial", Ticket),
          resolveApp("/portal.dokumen", "Arsip Laporan Kontribusi", FileText),
          resolveApp("/reports", "Laporan Partisipasi Warga", FileCheck),
        ],
      },

      // 4. Society and Public
      {
        id: "cat-public-information",
        title: "Public Information",
        group: "society-public",
        icon: Globe,
        getItems: () => [
          resolveApp("/lainnya?app=public-services-guide", "Panduan Layanan Publik", Compass),
          resolveApp("/lainnya?app=civic-calendar", "Kalender Pemilu & Libur", CalendarDays),
          resolveApp("/bookmarks", "Portal Informasi Publik & Berita", Globe),
          resolveApp("/weather", "Informasi Cuaca & Lingkungan", CloudSun),
          resolveApp("/reading", "Katalog & Referensi Warga", BookOpen),
          resolveApp("/reports", "Warta & Informasi Publik", FileText),
        ],
      },
      {
        id: "cat-public-safety",
        title: "Public Safety",
        group: "society-public",
        icon: ShieldCheck,
        getItems: () => [
          resolveApp("/lainnya?app=disaster-prep", "Tas Siaga & Jalur Evakuasi", ShieldAlert),
          resolveApp("/lainnya?app=emergency-broadcast", "Nomor Darurat 112 & Damkar", PhoneCall),
          resolveApp("/contacts", "Kontak Darurat & Hotline Publik", Users),
          resolveApp("/pocket", "Kartu Identitas & Kontak Siaga", Pocket),
          resolveApp("/passwords", "Keamanan Identitas & Akses", Key),
          resolveApp("/vault", "Berkas Perlindungan Sipil", Vault),
        ],
      },
      {
        id: "cat-compliance",
        title: "Compliance",
        group: "society-public",
        icon: Scale,
        getItems: () => [
          resolveApp("/lainnya?app=civil-registry", "Administrasi Kependudukan", FileCheck),
          resolveApp("/lainnya?app=tax-civic", "PBB, Retribusi & Iuran Warga", Receipt),
          resolveApp("/portal.dokumen", "Dokumen Legal & Izin Domestik", FileText),
          resolveApp("/reading", "Panduan Aturan & Regulasi Warga", BookOpen),
          resolveApp("/vault", "Arsip Akta & Dokumen Kepatuhan", Vault),
          resolveApp("/reports", "Laporan Verifikasi Kepatuhan", FileCheck),
        ],
      },
    ];
  }, [allNavMap]);

  // Aggregate items per tab
  const defaultItemsForTab = useMemo(() => {
    const collectItems = (groupName?: Exclude<MainPeopleTab, "all">) => {
      const cats = groupName
        ? specificCategories.filter((c) => c.group === groupName)
        : specificCategories;
      const seen = new Set<string>();
      const items: LauncherItem[] = [];

      cats.forEach((cat) => {
        cat.getItems().forEach((entry) => {
          if (entry.type === "app") {
            if (!seen.has(entry.item.to)) {
              seen.add(entry.item.to);
              items.push(entry);
            }
          } else {
            if (!seen.has(entry.id)) {
              seen.add(entry.id);
              items.push(entry);
            }
          }
        });
      });

      return items;
    };

    return {
      all: collectItems(),
      "people-relationships": collectItems("people-relationships"),
      "family-management": collectItems("family-management"),
      "community-membership": collectItems("community-membership"),
      "society-public": collectItems("society-public"),
    };
  }, [specificCategories]);

  // Items currently displayed
  const displayedItems = useMemo(() => {
    if (activeSpecific !== "all") {
      const selected = specificCategories.find((c) => c.id === activeSpecific);
      return selected ? selected.getItems() : [];
    }
    return defaultItemsForTab[mainTab];
  }, [activeSpecific, mainTab, specificCategories, defaultItemsForTab]);

  const activeCategoryTitle = useMemo(() => {
    if (activeSpecific === "all") return null;
    const cat = specificCategories.find((c) => c.id === activeSpecific);
    return cat ? cat.title : null;
  }, [activeSpecific, specificCategories]);

  // Counts
  const totalCountAll = defaultItemsForTab.all.length;
  const totalCountPeople = defaultItemsForTab["people-relationships"].length;
  const totalCountFamily = defaultItemsForTab["family-management"].length;
  const totalCountCommunity = defaultItemsForTab["community-membership"].length;
  const totalCountSociety = defaultItemsForTab["society-public"].length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Description with non-bold comma and "and" */}
      <div className="text-center mb-[calc(1.5rem+10pt)]">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2">
          <span>People<span className="font-normal">,</span> Family<span className="font-normal">, and</span> Society</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-[calc(0.25rem+10pt)] max-w-xl mx-auto">
          A Unified Approach Built to Strengthen Connections and Relationships.
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

        {/* People and Relationships */}
        <button
          onClick={() => {
            setMainTab("people-relationships");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "people-relationships"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Users className="size-4 shrink-0" />
          <span>People and Relationships</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "people-relationships"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountPeople}
          </span>
        </button>

        {/* Family Management */}
        <button
          onClick={() => {
            setMainTab("family-management");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "family-management"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Home className="size-4 shrink-0" />
          <span>Family Management</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "family-management"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountFamily}
          </span>
        </button>

        {/* Community and Membership */}
        <button
          onClick={() => {
            setMainTab("community-membership");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "community-membership"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Globe className="size-4 shrink-0" />
          <span>Community and Membership</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "community-membership"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountCommunity}
          </span>
        </button>

        {/* Society and Public */}
        <button
          onClick={() => {
            setMainTab("society-public");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "society-public"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <ShieldCheck className="size-4 shrink-0" />
          <span>Society and Public</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "society-public"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountSociety}
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
                  : mainTab === "people-relationships"
                  ? totalCountPeople
                  : mainTab === "family-management"
                  ? totalCountFamily
                  : mainTab === "community-membership"
                  ? totalCountCommunity
                  : totalCountSociety}
              </span>
            </button>

            {/* Specific Categories filtered by mainTab */}
            {specificCategories
              .filter((cat) => {
                if (mainTab === "all") return true;
                return cat.group === mainTab;
              })
              .map((cat) => {
                const Icon = cat.icon;
                const count = cat.getItems().length;
                const isActive = activeSpecific === cat.id;

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

        {/* RIGHT: 9 Columns Grid for Apps */}
        <div className="xl:col-span-9 w-full flex flex-col gap-4">
          {/* Breadcrumb / Active Category Path */}
          <div className="flex items-center justify-between px-1 py-1 text-xs border-b border-border/40 pb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-foreground/90">
                {mainTab === "all"
                  ? "Semua"
                  : mainTab === "people-relationships"
                  ? "People and Relationships"
                  : mainTab === "family-management"
                  ? "Family Management"
                  : mainTab === "community-membership"
                  ? "Community and Membership"
                  : "Society and Public"}
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

          {/* Launcher Grid */}
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
                const gradient = getGradient(item.label);
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
                  >
                    <div
                      className={`w-12 h-12 sm:w-13 sm:h-13 xl:w-14 xl:h-14 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-110 group-active:scale-95 ${gradient} relative`}
                    >
                      <item.icon
                        className="size-5 sm:size-6 opacity-90 drop-shadow-sm"
                        strokeWidth={1.5}
                      />

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
