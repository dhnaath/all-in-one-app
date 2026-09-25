import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  BookOpen,
  Heart,
  Smile,
  Wallet,
  TrendingDown,
  ShoppingBag,
  ShieldCheck,
  Dumbbell,
  Droplet,
  FileHeart,
  Activity,
  Scale,
  Moon,
  Sparkles,
  Vault,
  Shield,
  Award,
  Utensils,
  Package,
  AlertTriangle,
  RefreshCw,
  CalendarDays,
  ShoppingCart,
  Plane,
  Pocket,
  Luggage,
  Key,
  CloudSun,
  Calculator,
  Star,
  Layers,
  ChevronRight,
  ArrowRight,
  Search,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { type NavItem } from "@/config/nav";

interface StandaloneFeature {
  title: string;
  to: string;
  icon: LucideIcon;
}

export interface StandaloneAppDef {
  id: string;
  to: string;
  title: string;
  subtitle: string;
  category: "personal" | "essentials" | "household";
  icon: LucideIcon;
  badge?: string;
  features?: StandaloneFeature[];
}

export const STANDALONE_REORGANIZED_APPS: StandaloneAppDef[] = [
  // 1. Personal Projects
  {
    id: "proyek-personal",
    to: "/proyek-personal",
    title: "Personal Projects",
    subtitle: "Manajemen portofolio proyek pribadi, inisiatif mandiri, dan milestone capaian.",
    category: "personal",
    icon: Briefcase,
    badge: "Standalone",
  },
  // 2. Journal Harian
  {
    id: "journal",
    to: "/journal",
    title: "Journal Harian",
    subtitle: "Catatan refleksi harian, pembelajaran keputusan, rasa syukur, dan ritme energi.",
    category: "personal",
    icon: BookOpen,
    badge: "Standalone",
    features: [
      { title: "Buku Syukur (Gratitude)", to: "/journal?tab=gratitude", icon: Heart },
      { title: "Mood dan Energi Harian", to: "/journal?tab=mood", icon: Smile },
    ],
  },
  // 3. Wallet dan Kas
  {
    id: "wallet",
    to: "/wallet",
    title: "Wallet dan Kas",
    subtitle: "Kendali arus kas masuk/keluar, pembanding harga barang, wishlist belanja, dan garansi.",
    category: "essentials",
    icon: Wallet,
    badge: "Standalone",
    features: [
      { title: "Pembanding Harga", to: "/wallet?tab=price-compare", icon: TrendingDown },
      { title: "Rencana Belanja (Wishlist)", to: "/wallet?tab=wishlist", icon: ShoppingBag },
      { title: "Garansi dan Bukti Nota", to: "/wallet?tab=warranty", icon: ShieldCheck },
    ],
  },
  // 4. Health
  {
    id: "health",
    to: "/health",
    title: "Health",
    subtitle: "Executive health vitality matrix, kebugaran fungsional, hidrasi, dan pemantauan biomarker.",
    category: "personal",
    icon: Heart,
    badge: "Standalone",
    features: [
      { title: "Workouts", to: "/health?tab=workouts", icon: Dumbbell },
      { title: "Water", to: "/health?tab=water", icon: Droplet },
      { title: "Riwayat Rekam Medis", to: "/health?tab=medical-records", icon: FileHeart },
      { title: "Tekanan dan Gula Darah", to: "/health?tab=vitals", icon: Activity },
      { title: "Pengukuran Tubuh dan Berat", to: "/health?tab=body-metrics", icon: Scale },
      { title: "Kualitas Tidur dan Istirahat", to: "/health?tab=sleep", icon: Moon },
      { title: "Skincare dan Grooming", to: "/health?tab=skincare", icon: Sparkles },
    ],
  },
  // 5. Vault
  {
    id: "vault",
    to: "/vault",
    title: "Vault",
    subtitle: "Brankas enkripsi aman untuk KTP, Paspor, Kartu Keluarga, dan Ijazah Sertifikat.",
    category: "personal",
    icon: Vault,
    badge: "Standalone",
    features: [
      { title: "KTP dan Identitas Resmi", to: "/vault?tab=ktp", icon: Shield },
      { title: "Ijazah dan Sertifikat", to: "/vault?tab=certificates", icon: Award },
    ],
  },
  // 6. Recipes
  {
    id: "recipes",
    to: "/recipes",
    title: "Recipes",
    subtitle: "Kurasi nutrisi penunjang performa kognitif, inventaris bahan dapur, dan meal-prep.",
    category: "household",
    icon: Utensils,
    badge: "Standalone",
    features: [
      { title: "Inventaris Bahan Dapur", to: "/recipes?tab=pantry", icon: Package },
      { title: "Jurnal Memasak", to: "/recipes?tab=cook-log", icon: BookOpen },
      { title: "Peringatan Kadaluarsa", to: "/recipes?tab=expiry", icon: AlertTriangle },
      { title: "Manajemen Makanan Sisa", to: "/recipes?tab=leftovers", icon: RefreshCw },
      { title: "Perencana Menu Mingguan", to: "/recipes?tab=meal-planner", icon: CalendarDays },
    ],
  },
  // 7. Shopping
  {
    id: "shopping",
    to: "/shopping",
    title: "Shopping",
    subtitle: "Daftar belanja cerdas, pengadaan perlengkapan kerja & groceries bernutrisi.",
    category: "essentials",
    icon: ShoppingCart,
    badge: "Standalone",
  },
  // 8. Trips
  {
    id: "trips",
    to: "/trips",
    title: "Trips",
    subtitle: "Manajemen perjalanan dinas, retret strategis, itinerary hari ke hari, dan logistik.",
    category: "household",
    icon: Plane,
    badge: "Standalone",
  },
  // 9. Pocket
  {
    id: "pocket",
    to: "/pocket",
    title: "Pocket",
    subtitle: "Saku digital untuk slip kartu akses, voucher diskon, tiket, dan catatan cepat.",
    category: "essentials",
    icon: Pocket,
    badge: "Standalone",
  },
  // 10. Pouch
  {
    id: "pouch",
    to: "/pouch",
    title: "Pouch",
    subtitle: "Organizer dokumen esensial, tiket bepergian, kit perjalanan, dan perlengkapan.",
    category: "essentials",
    icon: ShoppingBag,
    badge: "Standalone",
  },
  // 11. Trunk
  {
    id: "trunk",
    to: "/trunk",
    title: "Trunk",
    subtitle: "Gudang perkakas rumah tangga, inventaris alat musiman, dan penyimpanan bagasi.",
    category: "household",
    icon: Luggage,
    badge: "Standalone",
  },
  // 12. Passwords
  {
    id: "passwords",
    to: "/passwords",
    title: "Passwords",
    subtitle: "Penyimpanan kredensial aman, audit kekuatan sandi, dan generator akun acak.",
    category: "personal",
    icon: Key,
    badge: "Standalone",
  },
  // 13. Weather
  {
    id: "weather",
    to: "/weather",
    title: "Weather",
    subtitle: "Prakiraan cuaca real-time, indeks UV, kelembapan udara, dan kondisi lingkungan.",
    category: "essentials",
    icon: CloudSun,
    badge: "Standalone",
  },
  // 14. Kalkulator
  {
    id: "kalkulator",
    to: "/kalkulator",
    title: "Kalkulator",
    subtitle: "Alat hitung serbaguna ilmiah, konverter satuan, dan kalkulasi persentase kas.",
    category: "personal",
    icon: Calculator,
    badge: "Standalone",
  },
];

interface PersonalEssentialsSectionProps {
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

export type MainCategoryTab = "all" | "personal" | "essentials" | "household";

export function PersonalEssentialsSection({
  favorites,
  toggleFavorite,
  getGradient,
}: PersonalEssentialsSectionProps) {
  const [activeTab, setActiveTab] = useState<MainCategoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = useMemo(() => {
    return STANDALONE_REORGANIZED_APPS.filter((app) => {
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

  const countAll = STANDALONE_REORGANIZED_APPS.length;
  const countPersonal = STANDALONE_REORGANIZED_APPS.filter((a) => a.category === "personal").length;
  const countEssentials = STANDALONE_REORGANIZED_APPS.filter((a) => a.category === "essentials").length;
  const countHousehold = STANDALONE_REORGANIZED_APPS.filter((a) => a.category === "household").length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Description */}
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2">
          <span>Personal<span className="font-normal">,</span> Essentials<span className="font-normal">, and</span> Household</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-xl mx-auto">
          14 Standalone Apps Terintegrasi — Ruang Hidup, Finansial, Kesehatan, Hunian, dan Esensial Mandiri.
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
          onClick={() => setActiveTab("personal")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "personal"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Sparkles className="size-4 shrink-0" />
          <span>Personal</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "personal"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countPersonal}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("essentials")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "essentials"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Wallet className="size-4 shrink-0" />
          <span>Essentials</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "essentials"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countEssentials}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("household")}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "household"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Utensils className="size-4 shrink-0" />
          <span>Household</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "household"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countHousehold}
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
                        Kategori: {app.category}
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
