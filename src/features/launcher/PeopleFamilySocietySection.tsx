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
  Network,
  MessagesSquare,
  Building2,
  Share2,
  type LucideIcon,
} from "lucide-react";
import { type NavItem } from "@/config/nav";

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

interface SpecificCategory {
  id: string;
  title: string;
  group: "people" | "family" | "society";
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
  const [mainTab, setMainTab] = useState<"all" | "people" | "family" | "society">("all");
  const [activeSpecific, setActiveSpecific] = useState<string>("all");

  // Specific Categories Definitions
  const specificCategories: SpecificCategory[] = useMemo(() => {
    return [
      // PEOPLE
      {
        id: "peo-network",
        title: "Kontak & Relasi",
        group: "people",
        icon: Users,
        getItems: () => [
          { type: "app", item: { to: "/contacts", label: "Kontak & CRM", icon: Users } },
          { type: "app", item: { to: "/klien", label: "Klien & Partner", icon: Briefcase } },
          { type: "app", item: { to: "/portal", label: "Portal Kolaborasi", icon: Building2 } },
        ],
      },
      {
        id: "peo-interaction",
        title: "Agenda & Komunikasi",
        group: "people",
        icon: MessagesSquare,
        getItems: () => [
          { type: "app", item: { to: "/events", label: "Acara & Agenda", icon: Ticket } },
          { type: "app", item: { to: "/interact", label: "Interaksi Sosial", icon: Share2 } },
        ],
      },

      // FAMILY
      {
        id: "fam-logistics",
        title: "Agenda & Anggaran Rumah",
        group: "family",
        icon: Home,
        getItems: () => [
          { type: "app", item: { to: "/kalender", label: "Jadwal Domestik", icon: CalendarDays } },
          { type: "app", item: { to: "/budget", label: "Anggaran Rumah", icon: Wallet } },
        ],
      },
      {
        id: "fam-living",
        title: "Keluarga & Liburan",
        group: "family",
        icon: Plane,
        getItems: () => [
          { type: "app", item: { to: "/trips", label: "Liburan Keluarga", icon: Plane } },
          { type: "app", item: { to: "/recipes", label: "Resep Keluarga", icon: Utensils } },
          { type: "app", item: { to: "/shopping", label: "Belanja Domestik", icon: ShoppingCart } },
        ],
      },

      // SOCIETY
      {
        id: "soc-philanthropy",
        title: "Zakat & Filantropi",
        group: "society",
        icon: Coins,
        getItems: () => [
          { type: "app", item: { to: "/zakat", label: "Zakat & Sedekah", icon: Coins } },
          { type: "app", item: { to: "/legacy?tab=cat_amal", label: "Wakaf & Amal", icon: HeartHandshake } },
        ],
      },
      {
        id: "soc-community",
        title: "Masyarakat & Komunitas",
        group: "society",
        icon: Globe,
        getItems: () => [
          { type: "app", item: { to: "/build?tab=cat_jaringan", label: "Jaringan Komunitas", icon: Network } },
          { type: "app", item: { to: "/surety?tab=cat_publik", label: "Perlindungan Publik", icon: ShieldCheck } },
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
    const collectItems = (groupName?: "people" | "family" | "society") => {
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
      people: collectItems("people"),
      family: collectItems("family"),
      society: collectItems("society"),
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
  const totalCountPeople = defaultItemsForTab.people.length;
  const totalCountFamily = defaultItemsForTab.family.length;
  const totalCountSociety = defaultItemsForTab.society.length;

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

        {/* People */}
        <button
          onClick={() => {
            setMainTab("people");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "people"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Users className="size-4 shrink-0" />
          <span>People</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "people"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountPeople}
          </span>
        </button>

        {/* Family */}
        <button
          onClick={() => {
            setMainTab("family");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "family"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Home className="size-4 shrink-0" />
          <span>Family</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "family"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountFamily}
          </span>
        </button>

        {/* Society */}
        <button
          onClick={() => {
            setMainTab("society");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "society"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Globe className="size-4 shrink-0" />
          <span>Society</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "society"
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
                  : mainTab === "people"
                  ? totalCountPeople
                  : mainTab === "family"
                  ? totalCountFamily
                  : totalCountSociety}
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
                  : mainTab === "people"
                  ? "People"
                  : mainTab === "family"
                  ? "Family"
                  : "Society"}
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
