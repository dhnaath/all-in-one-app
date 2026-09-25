import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  Users,
  Home,
  Coins,
  Building2,
  GitFork,
  Scale,
  Archive,
  HeartHandshake,
  Network,
  PhoneCall,
  ArrowRightLeft,
  Gift,
  PartyPopper,
  CalendarDays,
  Megaphone,
  CreditCard,
  ScrollText,
  Compass,
  FileCheck,
  Receipt,
  Heart,
  Star,
  Layers,
  ArrowRight,
  Search,
  type LucideIcon,
} from "lucide-react";
import { type NavItem } from "@/config/nav";

interface StandaloneFeature {
  title: string;
  to: string;
  icon: LucideIcon;
}

export type PeopleCategoryTab =
  | "all"
  | "kemitraan"
  | "keluarga"
  | "komunitas"
  | "sosial";

export interface StandalonePeopleAppDef {
  id: string;
  to: string;
  title: string;
  subtitle: string;
  category: "kemitraan" | "keluarga" | "komunitas" | "sosial";
  categoryLabel: string;
  icon: LucideIcon;
  badge?: string;
  features?: StandaloneFeature[];
}

export const STANDALONE_PEOPLE_APPS: StandalonePeopleAppDef[] = [
  // 1. Klien dan Partner (Standalone)
  {
    id: "klien",
    to: "/klien",
    title: "Klien dan Partner",
    subtitle:
      "Sistem manajemen hubungan klien profesional, profil PIC, portofolio engagement proyek, dan portal kolaborasi terintegrasi.",
    category: "kemitraan",
    categoryLabel: "Kemitraan & Bisnis",
    icon: Briefcase,
    badge: "Standalone",
    features: [
      { title: "Portal Kolaborasi", to: "/portal", icon: Building2 },
    ],
  },

  // 2. People Manager (Standalone)
  {
    id: "people-manager",
    to: "/people-manager",
    title: "People Manager",
    subtitle:
      "Pusat kendali ekosistem keluarga besar, lingkaran relasi sosial, aturan rumah tangga, dokumen KK, dan momen penting kerabat.",
    category: "keluarga",
    categoryLabel: "Keluarga & Relasi",
    icon: Users,
    badge: "Standalone",
    features: [
      { title: "Silsilah Keluarga", to: "/lainnya?app=family-tree", icon: GitFork },
      { title: "Aturan dan Kesepakatan Rumah", to: "/lainnya?app=family-rules", icon: Scale },
      { title: "Arsip Akta dan Dokumen KK", to: "/lainnya?app=family-archive", icon: Archive },
      { title: "Golongan Darah dan Alergi", to: "/lainnya?app=medical-family", icon: HeartHandshake },
      { title: "Lingkaran Relasi (Circles)", to: "/lainnya?app=circle-groups", icon: Network },
      { title: "Pengingat Silaturahmi", to: "/lainnya?app=catchup-cadence", icon: PhoneCall },
      { title: "Pinjam Meminjam Barang", to: "/lainnya?app=borrowed-items", icon: ArrowRightLeft },
      { title: "Pencatat Kado dan Hadiah", to: "/lainnya?app=gift-tracker", icon: Gift },
      { title: "Perencana Reuni dan Arisan", to: "/lainnya?app=reunion-planner", icon: PartyPopper },
      { title: "Ulang Tahun dan Hari Jadi", to: "/lainnya?app=family-anniversary", icon: CalendarDays },
    ],
  },

  // 3. Komunitas Warga (Standalone)
  {
    id: "komunitas-warga",
    to: "/komunitas-warga",
    title: "Komunitas Warga",
    subtitle:
      "Platform rukun tetangga & warga pemukiman: buku warga RT/RW, transparansi iuran, pengumuman, kepatuhan sipil, dan layanan publik.",
    category: "komunitas",
    categoryLabel: "Komunitas & Publik",
    icon: Home,
    badge: "Standalone",
    features: [
      { title: "Buku Warga RT RW", to: "/lainnya?app=rt-rw-directory", icon: Users },
      { title: "Papan Pengumuman Warga", to: "/lainnya?app=community-announcements", icon: Megaphone },
      { title: "KTA dan Kartu Anggota", to: "/lainnya?app=membership-card", icon: CreditCard },
      { title: "Hasil Keputusan Rapat", to: "/lainnya?app=meeting-resolutions", icon: ScrollText },
      { title: "Panduan Layanan Publik", to: "/lainnya?app=public-services-guide", icon: Compass },
      { title: "Kalender Pemilu dan Libur", to: "/lainnya?app=civic-calendar", icon: CalendarDays },
      { title: "Administrasi Kependudukan", to: "/lainnya?app=civil-registry", icon: FileCheck },
      { title: "PBB dan Iuran Warga", to: "/lainnya?app=tax-civic", icon: Receipt },
    ],
  },

  // 4. Zakat dan Sedekah (Standalone)
  {
    id: "zakat",
    to: "/zakat",
    title: "Zakat dan Sedekah",
    subtitle:
      "Kalkulator kepatuhan syariah zakat maal, penghasilan, dan fitrah dengan transparansi catatan donasi infaq dan relawan kemanusiaan.",
    category: "sosial",
    categoryLabel: "Zakat & Filantropi",
    icon: Coins,
    badge: "Standalone",
    features: [
      { title: "Catatan Infaq dan Donasi", to: "/lainnya?app=donation-tracker", icon: Coins },
      { title: "Relawan dan Bakti Sosial", to: "/lainnya?app=volunteer-log", icon: Heart },
    ],
  },
];

interface PeopleFamilySocietySectionProps {
  page?: {
    title: string;
    subCategories: { title: string; rawItems: NavItem[] }[];
  };
  favorites: string[];
  toggleFavorite: (to: string) => void;
  setActiveFolder?: (folder: any) => void;
  getGradient: (name: string) => string;
  FolderTile?: any;
}

export function PeopleFamilySocietySection({
  favorites,
  toggleFavorite,
  getGradient,
}: PeopleFamilySocietySectionProps) {
  const [activeTab, setActiveTab] = useState<PeopleCategoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = useMemo(() => {
    return STANDALONE_PEOPLE_APPS.filter((app) => {
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

  const countAll = STANDALONE_PEOPLE_APPS.length;
  const countKemitraan = STANDALONE_PEOPLE_APPS.filter((a) => a.category === "kemitraan").length;
  const countKeluarga = STANDALONE_PEOPLE_APPS.filter((a) => a.category === "keluarga").length;
  const countKomunitas = STANDALONE_PEOPLE_APPS.filter((a) => a.category === "komunitas").length;
  const countSosial = STANDALONE_PEOPLE_APPS.filter((a) => a.category === "sosial").length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Description */}
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2">
          <span>
            People<span className="font-normal">,</span> Family
            <span className="font-normal">, and</span> Society
          </span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-xl mx-auto">
          4 Standalone Apps Terintegrasi — Klien & Partner, People Manager, Komunitas Warga, serta Zakat & Sedekah.
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
          onClick={() => setActiveTab("kemitraan")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "kemitraan"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Briefcase className="size-4 shrink-0" />
          <span>Kemitraan</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "kemitraan"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countKemitraan}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("keluarga")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "keluarga"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Users className="size-4 shrink-0" />
          <span>Keluarga & Relasi</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "keluarga"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countKeluarga}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("komunitas")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "komunitas"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Home className="size-4 shrink-0" />
          <span>Komunitas Warga</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "komunitas"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countKomunitas}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("sosial")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "sosial"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Coins className="size-4 shrink-0" />
          <span>Zakat & Sosial</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "sosial"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countSosial}
          </span>
        </button>
      </div>

      {/* Standalone Apps Cards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
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
