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
  type LucideIcon,
} from "lucide-react";
import { type NavItem } from "@/config/nav";

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

interface SpecificCategory {
  id: string;
  title: string;
  group: "personal" | "essentials" | "household";
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
  const [mainTab, setMainTab] = useState<"all" | "personal" | "essentials" | "household">("all");
  const [activeSpecific, setActiveSpecific] = useState<string>("all");

  // Specific Categories Definitions
  const specificCategories: SpecificCategory[] = useMemo(() => {
    return [
      // PERSONAL
      {
        id: "pers-goals",
        title: "Goals & Habits",
        group: "personal",
        icon: Target,
        getItems: () => [
          { type: "app", item: { to: "/goals", label: "Goals", icon: Target } },
          { type: "app", item: { to: "/habits", label: "Habits", icon: Activity } },
        ],
      },
      {
        id: "pers-reflection",
        title: "Refleksi & Proyek",
        group: "personal",
        icon: BookOpen,
        getItems: () => [
          { type: "app", item: { to: "/journal", label: "Journal", icon: BookOpen } },
          { type: "app", item: { to: "/proyek-personal", label: "Personal Projects", icon: Briefcase } },
          { type: "app", item: { to: "/wallet", label: "Wallet", icon: Wallet } },
        ],
      },

      // ESSENTIALS
      {
        id: "ess-wellness",
        title: "Kesehatan & Kebugaran",
        group: "essentials",
        icon: Heart,
        getItems: () => [
          { type: "app", item: { to: "/health", label: "Health", icon: Heart } },
          { type: "app", item: { to: "/workouts", label: "Workouts", icon: Dumbbell } },
          { type: "app", item: { to: "/water", label: "Water Tracker", icon: Droplet } },
        ],
      },
      {
        id: "ess-security",
        title: "Saku & Keamanan",
        group: "essentials",
        icon: Key,
        getItems: () => [
          { type: "app", item: { to: "/passwords", label: "Passwords", icon: Key } },
          { type: "app", item: { to: "/vault", label: "Vault", icon: Vault } },
          { type: "app", item: { to: "/pocket", label: "Pocket", icon: Pocket } },
          { type: "app", item: { to: "/pouch", label: "Pouch", icon: ShoppingBag } },
          { type: "app", item: { to: "/trunk", label: "Trunk", icon: Luggage } },
        ],
      },
      {
        id: "ess-utilities",
        title: "Utilitas Harian",
        group: "essentials",
        icon: Calculator,
        getItems: () => [
          { type: "app", item: { to: "/weather", label: "Weather", icon: CloudSun } },
          { type: "app", item: { to: "/kalkulator", label: "Kalkulator Umum", icon: Calculator } },
          { type: "app", item: { to: "/countdown", label: "Countdown", icon: Timer } },
        ],
      },

      // HOUSEHOLD
      {
        id: "hh-living",
        title: "Dapur & Belanja",
        group: "household",
        icon: Utensils,
        getItems: () => [
          { type: "app", item: { to: "/shopping", label: "Shopping List", icon: ShoppingCart } },
          { type: "app", item: { to: "/recipes", label: "Recipes", icon: Utensils } },
        ],
      },
      {
        id: "hh-logistics",
        title: "Perjalanan & Finansial Rumah",
        group: "household",
        icon: Plane,
        getItems: () => [
          { type: "app", item: { to: "/trips", label: "Trips", icon: Plane } },
          { type: "app", item: { to: "/budget", label: "Anggaran Rumah", icon: Wallet } },
        ],
      },
      {
        id: "hh-family",
        title: "Agenda & Keluarga",
        group: "household",
        icon: Users,
        getItems: () => [
          { type: "app", item: { to: "/kalender", label: "Jadwal Domestik", icon: CalendarDays } },
          { type: "app", item: { to: "/contacts", label: "Kontak Keluarga", icon: Users } },
          { type: "app", item: { to: "/events", label: "Pertemuan Kerabat", icon: CalendarDays } },
        ],
      },
    ];
  }, []);

  // Filter specific categories according to mainTab
  const visibleCategories = useMemo(() => {
    if (mainTab === "all") return specificCategories;
    return specificCategories.filter((c) => c.group === mainTab);
  }, [mainTab, specificCategories]);

  // Compute default items for each main tab
  const defaultItemsForTab = useMemo(() => {
    const collectItems = (groupName?: "personal" | "essentials" | "household") => {
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
      personal: collectItems("personal"),
      essentials: collectItems("essentials"),
      household: collectItems("household"),
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
  const totalCountPersonal = defaultItemsForTab.personal.length;
  const totalCountEssentials = defaultItemsForTab.essentials.length;
  const totalCountHousehold = defaultItemsForTab.household.length;

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

        {/* Personal */}
        <button
          onClick={() => {
            setMainTab("personal");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "personal"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <User className="size-4 shrink-0" />
          <span>Personal</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "personal"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountPersonal}
          </span>
        </button>

        {/* Essentials */}
        <button
          onClick={() => {
            setMainTab("essentials");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "essentials"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Heart className="size-4 shrink-0" />
          <span>Essentials</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "essentials"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountEssentials}
          </span>
        </button>

        {/* Household */}
        <button
          onClick={() => {
            setMainTab("household");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "household"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Home className="size-4 shrink-0" />
          <span>Household</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "household"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountHousehold}
          </span>
        </button>
      </div>

      {/* 12-Column Container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1640px] mx-auto w-full mb-[10pt] items-start">
        {/* LEFT: 3 Columns Space */}
        <div className="xl:col-span-3 w-full flex flex-col items-center xl:items-start">
          <div
            className="w-[95%] max-w-[95%] mx-auto flex flex-col gap-1.5 max-h-[720px] overflow-y-auto px-1.5 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Option Semua untuk Tab yang Aktif */}
            <button
              onClick={() => setActiveSpecific("all")}
              className={`w-full text-left px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
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
                  : mainTab === "personal"
                  ? totalCountPersonal
                  : mainTab === "essentials"
                  ? totalCountEssentials
                  : totalCountHousehold}
              </span>
            </button>

            {/* List Spesifik Kategori */}
            {visibleCategories.map((cat) => {
              const Icon = cat.icon;
              const count = cat.getItems().length;
              const isActive = activeSpecific === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveSpecific(cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
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
                  : mainTab === "personal"
                  ? "Personal"
                  : mainTab === "essentials"
                  ? "Essentials"
                  : "Household"}
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
