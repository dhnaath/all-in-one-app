import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Star,
  Layers,
  User,
  Heart,
  Home,
  Target,
  Activity,
  Briefcase,
  BookOpen,
  Wallet,
  Dumbbell,
  Droplet,
  Pocket,
  ShoppingBag,
  Vault,
  Luggage,
  Key,
  CloudSun,
  Calculator,
  Timer,
  ShoppingCart,
  Utensils,
  Plane,
  CalendarDays,
  Users,
  Sparkles,
  NotebookText,
  Lightbulb,
  PenTool,
  FileText,
  Package,
  Archive,
  CreditCard,
  Receipt,
  HeartPulse,
  Music,
  Podcast,
  Shield,
  ShieldCheck,
  RefreshCw,
  Truck,
  CheckSquare,
  FolderKanban,
  Compass,
  Smile,
  Award,
  TrendingDown,
  Stethoscope,
  Moon,
  AlertTriangle,
  Wrench,
  Car,
  Fuel,
  Trash2,
  Zap,
  Gauge,
  type LucideIcon,
} from "lucide-react";
import { navKonsultan, type NavItem } from "@/config/nav";

type LauncherItem =
  | { type: "app"; item: NavItem }
  | { type: "folder"; id: string; title: string; items: NavItem[] };

interface PersonalEssentialsSectionProps {
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

export type MainPersonalTab =
  | "all"
  | "personal-management"
  | "shopping-consumption"
  | "health-wellness"
  | "food-pantry"
  | "home-management"
  | "vehicle-mobility"
  | "household-lifecycle";

interface SpecificCategory {
  id: string;
  title: string;
  group: Exclude<MainPersonalTab, "all">;
  icon: LucideIcon;
  getItems: () => LauncherItem[];
}

export function PersonalEssentialsSection({
  favorites,
  toggleFavorite,
  setActiveFolder,
  getGradient,
  FolderTile,
}: PersonalEssentialsSectionProps) {
  const [mainTab, setMainTab] = useState<MainPersonalTab>("all");
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

  // User requested category hierarchy:
  // 1. Personal Management
  //    - Personal Planning
  //    - Journal and Reflection
  //    - Personal Documents
  // 2. Shopping and Consumption
  //    - Shopping
  //    - Products and Purchases
  // 3. Health and Wellness
  //    - Health Records
  //    - Fitness and Nutrition
  //    - Personal Care
  // 4. Food and Pantry
  //    - Food Management
  //    - Food Lifecycle
  // 5. Home Management
  //    - Home Operations
  //    - Home Maintenance
  // 6. Vehicle and Mobility
  //    - Vehicle Records
  //    - Vehicle Maintenance
  // 7. Household Lifecycle
  //    - Expiry and Renewal
  const specificCategories: SpecificCategory[] = useMemo(() => {
    return [
      // 1. Personal Management
      {
        id: "cat-personal-planning",
        title: "Personal Planning",
        group: "personal-management",
        icon: Target,
        getItems: () => [
          resolveApp("/goal-manager", "Goals & Target", Target),
          resolveApp("/habits", "Habit Tracker", Activity),
          resolveApp("/lainnya?app=vision-board", "Vision Board & Impian", Compass),
          resolveApp("/lainnya?app=bucket-list", "Bucket List & Cita-Cita", CheckSquare),
          resolveApp("/kalender", "Kalender Personal", CalendarDays),
          resolveApp("/countdown", "Countdown & Milestones", Timer),
          resolveApp("/proyek-personal", "Personal Projects", FolderKanban),
        ],
      },
      {
        id: "cat-journal-reflection",
        title: "Journal and Reflection",
        group: "personal-management",
        icon: BookOpen,
        getItems: () => [
          resolveApp("/journal", "Daily Journal", BookOpen),
          resolveApp("/lainnya?app=gratitude", "Buku Syukur (Gratitude)", Heart),
          resolveApp("/lainnya?app=mood-tracker", "Mood & Energi Harian", Smile),
          resolveApp("/catatan", "Catatan & Ide", NotebookText),
          resolveApp("/ideas", "Gagasan & Brainstorm", Lightbulb),
          resolveApp("/writing", "Writing & Refleksi", PenTool),
        ],
      },
      {
        id: "cat-personal-documents",
        title: "Personal Documents",
        group: "personal-management",
        icon: Pocket,
        getItems: () => [
          resolveApp("/lainnya?app=id-wallet", "KTP & Identitas Resmi", Shield),
          resolveApp("/lainnya?app=certificates", "Ijazah & Sertifikat", Award),
          resolveApp("/pocket", "Pocket Berkas", Pocket),
          resolveApp("/pouch", "Pouch Dokumen", ShoppingBag),
          resolveApp("/vault", "Vault Enkripsi", Vault),
          resolveApp("/passwords", "Passwords & Akses", Key),
          resolveApp("/portal.dokumen", "Arsip Dokumen", FileText),
        ],
      },

      // 2. Shopping and Consumption
      {
        id: "cat-shopping",
        title: "Shopping",
        group: "shopping-consumption",
        icon: ShoppingCart,
        getItems: () => [
          resolveApp("/shopping", "Shopping List", ShoppingCart),
          resolveApp("/lainnya?app=price-tracker", "Pembanding Harga", TrendingDown),
          resolveApp("/lainnya?app=wishlist-planner", "Rencana Belanja (Wishlist)", ShoppingBag),
          resolveApp("/kalkulator", "Kalkulator Belanja", Calculator),
          resolveApp("/katalog-produk", "Wishlist Belanja", Package),
          resolveApp("/inventory", "Cek Stok Domestik", Archive),
        ],
      },
      {
        id: "cat-products-purchases",
        title: "Products and Purchases",
        group: "shopping-consumption",
        icon: Package,
        getItems: () => [
          resolveApp("/lainnya?app=warranty", "Garansi & Bukti Nota", ShieldCheck),
          resolveApp("/lainnya?app=subscription", "Langganan & Berlangganan", RefreshCw),
        ],
      },

      // 3. Health and Wellness
      {
        id: "cat-health-records",
        title: "Health Records",
        group: "health-wellness",
        icon: Heart,
        getItems: () => [
          resolveApp("/health", "Catatan Kesehatan", Heart),
          resolveApp("/lainnya?app=medical-history", "Riwayat Rekam Medis", Stethoscope),
          resolveApp("/lainnya?app=vitals", "Tekanan & Gula Darah", Activity),
          resolveApp("/weather", "Cuaca & Lingkungan", CloudSun),
        ],
      },
      {
        id: "cat-fitness-nutrition",
        title: "Fitness and Nutrition",
        group: "health-wellness",
        icon: Dumbbell,
        getItems: () => [
          resolveApp("/workouts", "Workouts & Latihan", Dumbbell),
          resolveApp("/lainnya?app=meal-planner", "Perencana Menu Mingguan", Utensils),
          resolveApp("/lainnya?app=body-metrics", "Pengukuran Tubuh & Berat", Gauge),
          resolveApp("/water", "Water Tracker & Hidrasi", Droplet),
          resolveApp("/recipes", "Nutrisi & Makanan Sehat", Utensils),
        ],
      },
      {
        id: "cat-personal-care",
        title: "Personal Care",
        group: "health-wellness",
        icon: Sparkles,
        getItems: () => [
          resolveApp("/lainnya?app=sleep-tracker", "Kualitas Tidur & Istirahat", Moon),
          resolveApp("/lainnya?app=skincare-routine", "Skincare & Grooming", Sparkles),
          resolveApp("/trips", "Relaksasi & Liburan", Plane),
          resolveApp("/music", "Audio Relaksasi", Music),
          resolveApp("/podcasts", "Wellness Podcasts", Podcast),
        ],
      },

      // 4. Food and Pantry
      {
        id: "cat-food-management",
        title: "Food Management",
        group: "food-pantry",
        icon: Utensils,
        getItems: () => [
          resolveApp("/lainnya?app=kitchen-inventory", "Inventaris Bahan Dapur", Archive),
          resolveApp("/lainnya?app=cook-log", "Jurnal Memasak", BookOpen),
        ],
      },
      {
        id: "cat-food-lifecycle",
        title: "Food Lifecycle",
        group: "food-pantry",
        icon: Timer,
        getItems: () => [
          resolveApp("/lainnya?app=expiry-alert", "Peringatan Kadaluarsa", AlertTriangle),
          resolveApp("/lainnya?app=leftover-ideas", "Manajemen Makanan Sisa", RefreshCw),
        ],
      },

      // 5. Home Management
      {
        id: "cat-home-operations",
        title: "Home Operations",
        group: "home-management",
        icon: Home,
        getItems: () => [
          resolveApp("/home", "Manajemen Hunian", Home),
          resolveApp("/lainnya?app=home-chores", "Jadwal Piket & Kebersihan", CheckSquare),
          resolveApp("/lainnya?app=utility-tracker", "Catatan Meteran Listrik & Air", Zap),
          resolveApp("/contacts", "Kontak Keluarga & Darurat", Users),
          resolveApp("/task-manager", "Tugas & Urusan Rumah", CheckSquare),
        ],
      },
      {
        id: "cat-home-maintenance",
        title: "Home Maintenance",
        group: "home-management",
        icon: CheckSquare,
        getItems: () => [
          resolveApp("/lainnya?app=appliance-care", "Servis Elektronik & Alat", Wrench),
          resolveApp("/lainnya?app=home-inventory", "Inventaris Perabot & Ruangan", Home),
          resolveApp("/proyek", "Pemeliharaan & Renovasi", CheckSquare),
          resolveApp("/trunk", "Gudang & Perkakas", Luggage),
        ],
      },

      // 6. Vehicle and Mobility
      {
        id: "cat-vehicle-records",
        title: "Vehicle Records",
        group: "vehicle-mobility",
        icon: FileText,
        getItems: () => [
          resolveApp("/lainnya?app=vehicle-identity", "BPKB, STNK & Data Kendaraan", Car),
          resolveApp("/lainnya?app=mileage-fuel", "Catatan BBM & Odometer", Fuel),
        ],
      },
      {
        id: "cat-vehicle-maintenance",
        title: "Vehicle Maintenance",
        group: "vehicle-mobility",
        icon: ShieldCheck,
        getItems: () => [
          resolveApp("/lainnya?app=vehicle-service", "Riwayat Servis & Bengkel", Wrench),
          resolveApp("/lainnya?app=parts-lifecycle", "Siklus Ban, Aki & Komponen", RefreshCw),
        ],
      },

      // 7. Household Lifecycle
      {
        id: "cat-expiry-renewal",
        title: "Expiry and Renewal",
        group: "household-lifecycle",
        icon: RefreshCw,
        getItems: () => [
          resolveApp("/lainnya?app=household-renewals", "Jatuh Tempo Pajak, Asuransi & Iuran", CalendarDays),
          resolveApp("/lainnya?app=item-disposal", "Barang Dihibahkan & Daur Ulang", Trash2),
        ],
      },
    ];
  }, [allNavMap]);

  // Aggregate items per tab
  const defaultItemsForTab = useMemo(() => {
    const collectItems = (groupName?: Exclude<MainPersonalTab, "all">) => {
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
      "personal-management": collectItems("personal-management"),
      "shopping-consumption": collectItems("shopping-consumption"),
      "health-wellness": collectItems("health-wellness"),
      "food-pantry": collectItems("food-pantry"),
      "home-management": collectItems("home-management"),
      "vehicle-mobility": collectItems("vehicle-mobility"),
      "household-lifecycle": collectItems("household-lifecycle"),
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
  const totalCountPersonal = defaultItemsForTab["personal-management"].length;
  const totalCountShopping = defaultItemsForTab["shopping-consumption"].length;
  const totalCountHealth = defaultItemsForTab["health-wellness"].length;
  const totalCountFood = defaultItemsForTab["food-pantry"].length;
  const totalCountHome = defaultItemsForTab["home-management"].length;
  const totalCountVehicle = defaultItemsForTab["vehicle-mobility"].length;
  const totalCountLifecycle = defaultItemsForTab["household-lifecycle"].length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Description */}
      <div className="text-center mb-[calc(1.5rem+10pt)]">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2">
          <span>Personal<span className="font-normal">,</span> Essentials<span className="font-normal">, and</span> Household</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-[calc(0.25rem+10pt)] max-w-xl mx-auto">
          A Unified Space Built to Empower Life and Living.
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

        {/* Personal Management */}
        <button
          onClick={() => {
            setMainTab("personal-management");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "personal-management"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <User className="size-4 shrink-0" />
          <span>Personal Management</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "personal-management"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountPersonal}
          </span>
        </button>

        {/* Shopping and Consumption */}
        <button
          onClick={() => {
            setMainTab("shopping-consumption");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "shopping-consumption"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <ShoppingCart className="size-4 shrink-0" />
          <span>Shopping and Consumption</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "shopping-consumption"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountShopping}
          </span>
        </button>

        {/* Health and Wellness */}
        <button
          onClick={() => {
            setMainTab("health-wellness");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "health-wellness"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Heart className="size-4 shrink-0" />
          <span>Health and Wellness</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "health-wellness"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountHealth}
          </span>
        </button>

        {/* Food and Pantry */}
        <button
          onClick={() => {
            setMainTab("food-pantry");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "food-pantry"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Utensils className="size-4 shrink-0" />
          <span>Food and Pantry</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "food-pantry"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountFood}
          </span>
        </button>

        {/* Home Management */}
        <button
          onClick={() => {
            setMainTab("home-management");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "home-management"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Home className="size-4 shrink-0" />
          <span>Home Management</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "home-management"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountHome}
          </span>
        </button>

        {/* Vehicle and Mobility */}
        <button
          onClick={() => {
            setMainTab("vehicle-mobility");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "vehicle-mobility"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Truck className="size-4 shrink-0" />
          <span>Vehicle and Mobility</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "vehicle-mobility"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountVehicle}
          </span>
        </button>

        {/* Household Lifecycle */}
        <button
          onClick={() => {
            setMainTab("household-lifecycle");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "household-lifecycle"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <RefreshCw className="size-4 shrink-0" />
          <span>Household Lifecycle</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "household-lifecycle"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountLifecycle}
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
                  : mainTab === "personal-management"
                  ? totalCountPersonal
                  : mainTab === "shopping-consumption"
                  ? totalCountShopping
                  : mainTab === "health-wellness"
                  ? totalCountHealth
                  : mainTab === "food-pantry"
                  ? totalCountFood
                  : mainTab === "home-management"
                  ? totalCountHome
                  : mainTab === "vehicle-mobility"
                  ? totalCountVehicle
                  : totalCountLifecycle}
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
                  : mainTab === "personal-management"
                  ? "Personal Management"
                  : mainTab === "shopping-consumption"
                  ? "Shopping and Consumption"
                  : mainTab === "health-wellness"
                  ? "Health and Wellness"
                  : mainTab === "food-pantry"
                  ? "Food and Pantry"
                  : mainTab === "home-management"
                  ? "Home Management"
                  : mainTab === "vehicle-mobility"
                  ? "Vehicle and Mobility"
                  : "Household Lifecycle"}
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
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-110 group-active:scale-95 ${gradient} relative`}
                    >
                      <item.icon
                        className="size-7 sm:size-8 opacity-90 drop-shadow-sm"
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
