import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Star,
  Layers,
  Coins,
  Shield,
  TrendingUp,
  Package,
  Compass,
  LineChart,
  Briefcase,
  MessageCircle,
  Truck,
  Store,
  FileText,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MessagesSquare,
  Heart,
  Workflow,
  Eye,
  Lightbulb,
  Building,
  Sprout,
  BookOpen,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { navKonsultan, type NavItem } from "@/config/nav";
import { useLanguage } from "../finance/hooks/useLanguage";
import { translations } from "../finance/translations";

type LauncherItem =
  | { type: "app"; item: NavItem }
  | { type: "folder"; id: string; title: string; items: NavItem[] };

interface KurasiSectionProps {
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

interface KurasiCategory {
  id: string;
  title: string;
  group: "value-treated" | "wealth-spectrum" | "phase-side" | "commodity-index";
  icon: LucideIcon;
  getItems: () => LauncherItem[];
}

export function KurasiSection({
  favorites,
  toggleFavorite,
  setActiveFolder,
  getGradient,
  FolderTile,
}: KurasiSectionProps) {
  const [mainTab, setMainTab] = useState<
    "all" | "value-treated" | "wealth-spectrum" | "phase-side" | "commodity-index"
  >("all");
  const [activeSpecific, setActiveSpecific] = useState<string>("all");

  // Extract raw items from navKonsultan
  const valueTreatedItems = useMemo(() => {
    return (
      navKonsultan.find((g) => g.title === "Value Treated")?.items.filter((i) => i.to !== "/") || []
    );
  }, []);

  const wealthSpectrumGroup = useMemo(() => {
    const raw =
      navKonsultan.find((g) => g.title === "Wealth Spectrum")?.items.filter((i) => i.to !== "/") || [];

    const suretyPillars = raw.filter((i) => i.to.startsWith("/surety?tab="));
    const flowPillars = raw.filter((i) => i.to.startsWith("/flow?tab="));
    const buildPillars = raw.filter((i) => i.to.startsWith("/build?tab="));
    const growPillars = raw.filter((i) => i.to.startsWith("/grow?tab="));
    const legacyPillars = raw.filter((i) => i.to.startsWith("/legacy?tab="));

    const tahap1 = raw.find((i) => i.to === "/surety");
    const tahap2 = raw.find((i) => i.to === "/flow");
    const tahap3 = raw.find((i) => i.to === "/build");
    const tahap4 = raw.find((i) => i.to === "/grow");
    const tahap5 = raw.find((i) => i.to === "/legacy");

    return {
      tahap1,
      suretyPillars,
      tahap2,
      flowPillars,
      tahap3,
      buildPillars,
      tahap4,
      growPillars,
      tahap5,
      legacyPillars,
      allPillarItems: [
        ...suretyPillars,
        ...flowPillars,
        ...buildPillars,
        ...growPillars,
        ...legacyPillars,
      ],
    };
  }, []);

  const phaseSideItems = useMemo(() => {
    const selfShaping =
      navKonsultan.find((g) => g.title === "Self-Shaping")?.items.filter((i) => i.to !== "/") || [];
    const mutualMapping =
      navKonsultan.find((g) => g.title === "Mutual-Mapping")?.items.filter((i) => i.to !== "/") || [];
    const orgOptimizing =
      navKonsultan
        .find((g) => g.title === "Organization-Optimizing")
        ?.items.filter((i) => i.to !== "/") || [];

    return {
      selfShaping,
      mutualMapping,
      orgOptimizing,
      all: [...selfShaping, ...mutualMapping, ...orgOptimizing],
    };
  }, []);

  const commodityItems = useMemo(() => {
    return (
      navKonsultan.find((g) => g.title === "Commodity Index")?.items.filter((i) => i.to !== "/") || []
    );
  }, []);

  // Detailed categories for Kurasi (No '&' symbol)
  const KURASI_CATEGORIES: KurasiCategory[] = useMemo(() => {
    return [
      // Value Treated Categories
      {
        id: "vt-ekonomi",
        title: "Ekonomi",
        group: "value-treated",
        icon: Coins,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/kurasi/ekonomi");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-statistik",
        title: "Statistik",
        group: "value-treated",
        icon: LineChart,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/kurasi/statistik");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-manajemen",
        title: "Manajemen",
        group: "value-treated",
        icon: Briefcase,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/kurasi/manajemen");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-komunikasi",
        title: "Komunikasi",
        group: "value-treated",
        icon: MessageCircle,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/kurasi/komunikasi");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-logistik",
        title: "Logistik",
        group: "value-treated",
        icon: Truck,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/kurasi/logistik");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-bisnis",
        title: "Bisnis",
        group: "value-treated",
        icon: Store,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/kurasi/bisnis");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-administrasi",
        title: "Administrasi",
        group: "value-treated",
        icon: FileText,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/kurasi/administrasi");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-akuntansi",
        title: "Akuntansi",
        group: "value-treated",
        icon: Calculator,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/kurasi/akuntansi");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-asuransi",
        title: "Asuransi",
        group: "value-treated",
        icon: Shield,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/kurasi/asuransi");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-investasi",
        title: "Investasi",
        group: "value-treated",
        icon: TrendingUp,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/kurasi/investasi");
          return item ? [{ type: "app", item }] : [];
        },
      },

      // Wealth Spectrum Categories
      {
        id: "ws-pilar-surety",
        title: "Surety",
        group: "wealth-spectrum",
        icon: ShieldCheck,
        getItems: () => {
          return wealthSpectrumGroup.suretyPillars.map((item) => ({ type: "app", item }));
        },
      },
      {
        id: "ws-pilar-flow",
        title: "Flow",
        group: "wealth-spectrum",
        icon: Coins,
        getItems: () => {
          return wealthSpectrumGroup.flowPillars.map((item) => ({ type: "app", item }));
        },
      },
      {
        id: "ws-pilar-build",
        title: "Build",
        group: "wealth-spectrum",
        icon: Building,
        getItems: () => {
          return wealthSpectrumGroup.buildPillars.map((item) => ({ type: "app", item }));
        },
      },
      {
        id: "ws-pilar-grow",
        title: "Grow",
        group: "wealth-spectrum",
        icon: Sprout,
        getItems: () => {
          return wealthSpectrumGroup.growPillars.map((item) => ({ type: "app", item }));
        },
      },
      {
        id: "ws-pilar-legacy",
        title: "Legacy",
        group: "wealth-spectrum",
        icon: BookOpen,
        getItems: () => {
          return wealthSpectrumGroup.legacyPillars.map((item) => ({ type: "app", item }));
        },
      },

      // Phase Side Categories
      {
        id: "ps-self-shaping",
        title: "Self-Shaping",
        group: "phase-side",
        icon: Sparkles,
        getItems: () => {
          return phaseSideItems.selfShaping.map((item) => ({ type: "app", item }));
        },
      },
      {
        id: "ps-mutual-mapping",
        title: "Mutual-Mapping",
        group: "phase-side",
        icon: Workflow,
        getItems: () => {
          return phaseSideItems.mutualMapping.map((item) => ({ type: "app", item }));
        },
      },
      {
        id: "ps-org-optimizing",
        title: "Organization-Optimizing",
        group: "phase-side",
        icon: Compass,
        getItems: () => {
          return phaseSideItems.orgOptimizing.map((item) => ({ type: "app", item }));
        },
      },

      // Commodity Index
      {
        id: "ci-100-komoditas",
        title: "100 Komoditas",
        group: "commodity-index",
        icon: Package,
        getItems: () => {
          const item = commodityItems.find((i) => i.to === "/100-komoditas");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "ci-pasar-muamalah",
        title: "Pasar Muamalah",
        group: "commodity-index",
        icon: HeartHandshake,
        getItems: () => {
          const item = commodityItems.find((i) => i.to === "/syariah");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "ci-indeks-sharia",
        title: "Indeks Sharia",
        group: "commodity-index",
        icon: LineChart,
        getItems: () => {
          const item = commodityItems.find((i) => i.to === "/syariah/indeks");
          return item ? [{ type: "app", item }] : [];
        },
      },
    ];
  }, [valueTreatedItems, wealthSpectrumGroup, phaseSideItems, commodityItems]);

  // Items for each Main Tab when activeSpecific === "all"
  const defaultItemsForTab = useMemo(() => {
    // Value Treated default
    const vtDefault: LauncherItem[] = valueTreatedItems.map((item) => ({
      type: "app",
      item,
    }));

    // Wealth Spectrum default (Directly shows all app menus from all five pillars, without folders)
    const wsDefault: LauncherItem[] = wealthSpectrumGroup.allPillarItems.map((item) => ({
      type: "app",
      item,
    }));

    // Phase Side default (Self-Shaping, Mutual-Mapping, Organization-Optimizing folders or apps)
    const psDefault: LauncherItem[] = [
      {
        type: "folder",
        id: "folder-self-shaping",
        title: "Self-Shaping",
        items: phaseSideItems.selfShaping,
      },
      {
        type: "folder",
        id: "folder-mutual-mapping",
        title: "Mutual-Mapping",
        items: phaseSideItems.mutualMapping,
      },
      {
        type: "folder",
        id: "folder-organization-optimizing",
        title: "Organization-Optimizing",
        items: phaseSideItems.orgOptimizing,
      },
    ];

    // Commodity Index default
    const ciDefault: LauncherItem[] = commodityItems.map((item) => ({
      type: "app",
      item,
    }));

    return {
      vt: vtDefault,
      ws: wsDefault,
      ps: psDefault,
      ci: ciDefault,
      all: [...vtDefault, ...wsDefault, ...psDefault, ...ciDefault],
    };
  }, [valueTreatedItems, wealthSpectrumGroup, phaseSideItems, commodityItems]);

  // Displayed items in right grid
  const displayedItems: LauncherItem[] = useMemo(() => {
    if (activeSpecific !== "all") {
      const cat = KURASI_CATEGORIES.find((c) => c.id === activeSpecific);
      if (cat) {
        return cat.getItems();
      }
    }

    if (mainTab === "value-treated") return defaultItemsForTab.vt;
    if (mainTab === "wealth-spectrum") return defaultItemsForTab.ws;
    if (mainTab === "phase-side") return defaultItemsForTab.ps;
    if (mainTab === "commodity-index") return defaultItemsForTab.ci;

    return defaultItemsForTab.all;
  }, [activeSpecific, mainTab, KURASI_CATEGORIES, defaultItemsForTab]);

  // Title for active category
  const activeCategoryTitle = useMemo(() => {
    if (activeSpecific === "all") return "";
    return KURASI_CATEGORIES.find((c) => c.id === activeSpecific)?.title || "";
  }, [activeSpecific, KURASI_CATEGORIES]);

  const lang = useLanguage();

  const pillarInfo = useMemo(() => {
    if (activeSpecific === "ws-pilar-surety" || activeCategoryTitle === "Surety") {
      return {
        id: "pilar-surety",
        label: "Surety",
        icon: ShieldCheck,
        title: translations.landing.categories.surety.desc[lang],
        longDesc: translations.landing.categories.surety.long[lang],
      };
    }
    if (activeSpecific === "ws-pilar-flow" || activeCategoryTitle === "Flow") {
      return {
        id: "pilar-flow",
        label: "Flow",
        icon: Coins,
        title: translations.landing.categories.flow.desc[lang],
        longDesc: translations.landing.categories.flow.long[lang],
      };
    }
    if (activeSpecific === "ws-pilar-build" || activeCategoryTitle === "Build") {
      return {
        id: "pilar-build",
        label: "Build",
        icon: Building,
        title: translations.landing.categories.build.desc[lang],
        longDesc: translations.landing.categories.build.long[lang],
      };
    }
    if (activeSpecific === "ws-pilar-grow" || activeCategoryTitle === "Grow") {
      return {
        id: "pilar-grow",
        label: "Grow",
        icon: Sprout,
        title: translations.landing.categories.grow.desc[lang],
        longDesc: translations.landing.categories.grow.long[lang],
      };
    }
    if (activeSpecific === "ws-pilar-legacy" || activeCategoryTitle === "Legacy") {
      return {
        id: "pilar-legacy",
        label: "Legacy",
        icon: BookOpen,
        title: translations.landing.categories.legacy.desc[lang],
        longDesc: translations.landing.categories.legacy.long[lang],
      };
    }
    return null;
  }, [activeSpecific, activeCategoryTitle, lang]);

  // Counts for main top pills
  const totalCountAll = defaultItemsForTab.all.length;
  const totalCountVT = defaultItemsForTab.vt.length;
  const totalCountWS = defaultItemsForTab.ws.length;
  const totalCountPS = defaultItemsForTab.ps.length;
  const totalCountCI = defaultItemsForTab.ci.length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Description */}
      <div className="text-center mb-[calc(1.5rem+10pt)]">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2">
          <span>Wealth Management</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-[calc(0.25rem+10pt)] max-w-xl mx-auto">
          What Matters, Well Managed.
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

        {/* Value Treated */}
        <button
          onClick={() => {
            setMainTab("value-treated");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "value-treated"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Coins className="size-4 shrink-0" />
          <span>Value Treated</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "value-treated"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountVT}
          </span>
        </button>

        {/* Wealth Spectrum */}
        <button
          onClick={() => {
            setMainTab("wealth-spectrum");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "wealth-spectrum"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Shield className="size-4 shrink-0" />
          <span>Wealth Spectrum</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "wealth-spectrum"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountWS}
          </span>
        </button>

        {/* Phase Side */}
        <button
          onClick={() => {
            setMainTab("phase-side");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "phase-side"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Compass className="size-4 shrink-0" />
          <span>Phase Side</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "phase-side"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountPS}
          </span>
        </button>

        {/* Commodity Index */}
        <button
          onClick={() => {
            setMainTab("commodity-index");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "commodity-index"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Package className="size-4 shrink-0" />
          <span>Commodity Index</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "commodity-index"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountCI}
          </span>
        </button>
      </div>

      {/* 12-Column Container: 3 columns on left (Pills pendek), 9 columns on right (9 app icons per baris) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1640px] mx-auto w-full mb-[10pt] items-start">
        {/* LEFT: 3 Columns Space - Ukuran Layout Kategori Dikecilkan 5% agar ada margin lega di kiri & kanan */}
        <div className="xl:col-span-3 w-full flex flex-col items-center xl:items-start">
          <div
            className="w-[95%] max-w-[95%] mx-auto flex flex-col gap-1.5 max-h-[720px] overflow-y-auto px-1.5 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Option Semua untuk Tab yang Aktif */}
            <button
              id="kurasi-category-all-btn"
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
                  : mainTab === "value-treated"
                  ? totalCountVT
                  : mainTab === "wealth-spectrum"
                  ? totalCountWS
                  : mainTab === "phase-side"
                  ? totalCountPS
                  : totalCountCI}
              </span>
            </button>

            {/* Specific Categories filtered by mainTab */}
            {KURASI_CATEGORIES.filter((cat) => {
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

        {/* RIGHT: 9 Columns Grid for Apps (Tepat 9 apps mendatar per baris on xl!) */}
        <div className="xl:col-span-9 w-full flex flex-col gap-4">
          {/* Breadcrumb / Active Category Path */}
          <div className="flex items-center justify-between px-1 py-1 text-xs border-b border-border/40 pb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-foreground/90">
                {mainTab === "all"
                  ? "Semua"
                  : mainTab === "value-treated"
                  ? "Value Treated"
                  : mainTab === "wealth-spectrum"
                  ? "Wealth Spectrum"
                  : mainTab === "phase-side"
                  ? "Phase Side"
                  : "Commodity Index"}
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

          {/* Pillar Overview Header Card (when any of the 5 Pillars is active) */}
          {pillarInfo && (
            <div
              id={`${pillarInfo.id}-overview-card`}
              className="w-full p-5 sm:p-6 rounded-2xl bg-card/60 dark:bg-muted/30 border border-border/50 shadow-xs backdrop-blur-sm transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <pillarInfo.icon className="size-4 text-primary shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {pillarInfo.label}
                </span>
              </div>
              <h2
                id={`${pillarInfo.id}-title`}
                className="text-xl sm:text-2xl font-bold text-foreground mb-3 tracking-tight"
              >
                {pillarInfo.title}
              </h2>
              <p
                id={`${pillarInfo.id}-desc`}
                className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line leading-relaxed max-w-4xl"
              >
                {pillarInfo.longDesc}
              </p>
            </div>
          )}

          {/* Launcher Grid - Exactly 9 apps horizontal on xl! */}
          <div
            id={pillarInfo ? `grid-${pillarInfo.id}` : "kurasi-grid-apps"}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-x-3 gap-y-6 place-items-start w-full transition-all duration-200"
          >
            {displayedItems.length === 0 ? (
              <div className="col-span-full py-16 text-center text-sm text-muted-foreground italic w-full">
                Tidak ada kurasi yang ditemukan dalam filter ini.
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
