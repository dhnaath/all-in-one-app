import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Star,
  Layers,
  FolderKanban,
  CheckSquare,
  FileText,
  Target,
  Wallet,
  Heart,
  Sparkles,
  Calculator,
  CalendarDays,
  Ticket,
  Timer,
  Grid2X2,
  Bookmark,
  Compass,
  CloudSun,
  Navigation,
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
  FileCheck,
  Globe,
  Book,
  Dumbbell,
  Droplet,
  Utensils,
  ShoppingCart,
  Plane,
  Film,
  Gamepad2,
  Podcast,
  Music,
  PenTool,
  Camera,
  Type,
  Code,
  Package,
  Headphones,
  Palette,
  MoreHorizontal,
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

interface ProductivityCategory {
  id: string;
  title: string;
  group:
    | "productivity"
    | "business"
    | "knowledge"
    | "personal"
    | "entertainment"
    | "creative"
    | "other";
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
  const [mainTab, setMainTab] = useState<
    | "all"
    | "productivity"
    | "business"
    | "knowledge"
    | "personal"
    | "entertainment"
    | "creative"
    | "other"
  >("all");
  const [activeSpecific, setActiveSpecific] = useState<string>("all");

  // Extract raw items from nav groups
  const prodItems = useMemo(
    () => navKonsultan.find((g) => g.title === "Productivity")?.items.filter((i) => i.to !== "/") || [],
    []
  );

  const businessItems = useMemo(
    () => navKonsultan.find((g) => g.title === "Business")?.items.filter((i) => i.to !== "/") || [],
    []
  );

  const knowledgeItems = useMemo(
    () => navKonsultan.find((g) => g.title === "Knowledge")?.items.filter((i) => i.to !== "/") || [],
    []
  );

  const personalItems = useMemo(
    () => navKonsultan.find((g) => g.title === "Personal")?.items.filter((i) => i.to !== "/") || [],
    []
  );

  const entertainmentItems = useMemo(
    () => navKonsultan.find((g) => g.title === "Entertainment")?.items.filter((i) => i.to !== "/") || [],
    []
  );

  const creativeItems = useMemo(
    () =>
      (navKonsultan.find((g) => g.title === "Creative") || navKonsultan.find((g) => g.title === "Creativity"))?.items.filter(
        (i) => i.to !== "/"
      ) || [],
    []
  );

  const otherItems = useMemo(
    () => {
      const foundOther = navKonsultan.find((g) => g.title === "Other")?.items.filter((i) => i.to !== "/");
      if (foundOther && foundOther.length > 0) return foundOther;
      const ed = navKonsultan.find((g) => g.title === "Education")?.items.filter((i) => i.to !== "/") || [];
      const wb = navKonsultan.find((g) => g.title === "Wellbeing")?.items.filter((i) => i.to !== "/") || [];
      const ps = navKonsultan.find((g) => g.title === "Personal Storage")?.items.filter((i) => i.to !== "/") || [];
      const ls = navKonsultan.find((g) => g.title === "Lifestyle")?.items.filter((i) => i.to !== "/") || [];
      const ln = navKonsultan.find((g) => g.title === "Lain-lain")?.items.filter((i) => i.to !== "/") || [];
      return [...ed, ...wb, ...ps, ...ls, ...ln];
    },
    []
  );

  // Detailed categories without '&' symbol
  const PRODUCTIVITY_CATEGORIES: ProductivityCategory[] = useMemo(() => {
    return [
      // Productivity Group (Project Management, Task Management, Time Management, Planning)
      {
        id: "cat-project-management",
        title: "Project Management",
        group: "productivity",
        icon: FolderKanban,
        getItems: () => {
          const item = prodItems.find((i) => i.to === "/proyek");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "cat-task-management",
        title: "Task Management",
        group: "productivity",
        icon: CheckSquare,
        getItems: () => {
          const item = prodItems.find((i) => i.to === "/task-manager");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "cat-time-management",
        title: "Time Management",
        group: "productivity",
        icon: Timer,
        getItems: () => {
          const paths = ["/kalender", "/events", "/pomodoro"];
          return paths
            .map((path) => prodItems.find((i) => i.to === path))
            .filter((item): item is NavItem => Boolean(item))
            .map((item) => ({ type: "app", item }));
        },
      },
      {
        id: "cat-planning",
        title: "Planning",
        group: "productivity",
        icon: Compass,
        getItems: () => {
          const item = prodItems.find((i) => i.to === "/eisenhower");
          return item ? [{ type: "app", item }] : [];
        },
      },

      // Business Group
      {
        id: "cat-products-inventory",
        title: "Products & Inventory",
        group: "business",
        icon: Package,
        getItems: () => {
          const paths = ["/katalog-produk", "/inventory"];
          return paths
            .map((path) => businessItems.find((i) => i.to === path))
            .filter((item): item is NavItem => Boolean(item))
            .map((item) => ({ type: "app", item }));
        },
      },
      {
        id: "cat-clients-communication",
        title: "Clients & Communication",
        group: "business",
        icon: MessagesSquare,
        getItems: () => {
          const paths = ["/portal/pesan", "/contacts"];
          return paths
            .map((path) => businessItems.find((i) => i.to === path))
            .filter((item): item is NavItem => Boolean(item))
            .map((item) => ({ type: "app", item }));
        },
      },
      {
        id: "cat-reporting",
        title: "Reporting",
        group: "business",
        icon: NotebookText,
        getItems: () => {
          const item = businessItems.find((i) => i.to === "/reports");
          return item ? [{ type: "app", item }] : [];
        },
      },

      // Knowledge Group
      {
        id: "cat-capture-notes",
        title: "Capture & Notes",
        group: "knowledge",
        icon: FileText,
        getItems: () => {
          const paths = ["/notes", "/catatan", "/ideas"];
          return paths
            .map((path) => knowledgeItems.find((i) => i.to === path))
            .filter((item): item is NavItem => Boolean(item))
            .map((item) => ({ type: "app", item }));
        },
      },
      {
        id: "cat-reference",
        title: "Reference",
        group: "knowledge",
        icon: Bookmark,
        getItems: () => {
          const paths = ["/bookmarks", "/incoterms"];
          return paths
            .map((path) => knowledgeItems.find((i) => i.to === path))
            .filter((item): item is NavItem => Boolean(item))
            .map((item) => ({ type: "app", item }));
        },
      },
      {
        id: "cat-reading",
        title: "Reading",
        group: "knowledge",
        icon: Book,
        getItems: () => {
          const item = knowledgeItems.find((i) => i.to === "/reading");
          return item ? [{ type: "app", item }] : [];
        },
      },

      // Personal Group
      {
        id: "cat-personal-management",
        title: "Personal Management",
        group: "personal",
        icon: Target,
        getItems: () => {
          const paths = ["/goals", "/habits"];
          return paths
            .map((path) => personalItems.find((i) => i.to === path))
            .filter((item): item is NavItem => Boolean(item))
            .map((item) => ({ type: "app", item }));
        },
      },
      {
        id: "cat-personal-projects",
        title: "Personal Projects",
        group: "personal",
        icon: Briefcase,
        getItems: () => {
          const item = personalItems.find((i) => i.to === "/proyek-personal");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "cat-journal",
        title: "Journal",
        group: "personal",
        icon: BookOpen,
        getItems: () => {
          const item = personalItems.find((i) => i.to === "/journal");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "cat-finance",
        title: "Finance",
        group: "personal",
        icon: Wallet,
        getItems: () => {
          const item = personalItems.find((i) => i.to === "/wallet");
          return item ? [{ type: "app", item }] : [];
        },
      },

      // Entertainment Group (Watch, Play, Listen)
      {
        id: "cat-watch",
        title: "Watch",
        group: "entertainment",
        icon: Film,
        getItems: () => {
          const item = entertainmentItems.find((i) => i.to === "/movies");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "cat-play",
        title: "Play",
        group: "entertainment",
        icon: Gamepad2,
        getItems: () => {
          const item = entertainmentItems.find((i) => i.to === "/games");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "cat-listen",
        title: "Listen",
        group: "entertainment",
        icon: Headphones,
        getItems: () => {
          const podcasts = entertainmentItems.find((i) => i.to === "/podcasts");
          const music = entertainmentItems.find((i) => i.to === "/music");
          const items: LauncherItem[] = [];
          if (podcasts) items.push({ type: "app", item: podcasts });
          if (music) items.push({ type: "app", item: music });
          return items;
        },
      },

      // Creative Group (Visual, Creation)
      {
        id: "cat-visual",
        title: "Visual",
        group: "creative",
        icon: Palette,
        getItems: () => {
          const design = creativeItems.find((i) => i.to === "/design");
          const photo = creativeItems.find((i) => i.to === "/photography");
          const items: LauncherItem[] = [];
          if (design) items.push({ type: "app", item: design });
          if (photo) items.push({ type: "app", item: photo });
          return items;
        },
      },
      {
        id: "cat-creation",
        title: "Creation",
        group: "creative",
        icon: Sparkles,
        getItems: () => {
          const writing = creativeItems.find((i) => i.to === "/writing");
          const code = creativeItems.find((i) => i.to === "/code");
          const items: LauncherItem[] = [];
          if (writing) items.push({ type: "app", item: writing });
          if (code) items.push({ type: "app", item: code });
          return items;
        },
      },
    ];
  }, [
    prodItems,
    businessItems,
    knowledgeItems,
    personalItems,
    entertainmentItems,
    creativeItems,
  ]);

  // Default items when activeSpecific === "all"
  const defaultItemsForTab = useMemo(() => {
    const prodDefault: LauncherItem[] = prodItems.map((item) => ({ type: "app", item }));
    const businessDefault: LauncherItem[] = businessItems.map((item) => ({ type: "app", item }));
    const knowledgeDefault: LauncherItem[] = knowledgeItems.map((item) => ({ type: "app", item }));
    const personalDefault: LauncherItem[] = personalItems.map((item) => ({ type: "app", item }));
    const entertainmentDefault: LauncherItem[] = entertainmentItems.map((item) => ({ type: "app", item }));
    const creativeDefault: LauncherItem[] = creativeItems.map((item) => ({ type: "app", item }));
    const otherDefault: LauncherItem[] = otherItems.map((item) => ({ type: "app", item }));

    return {
      productivity: prodDefault,
      business: businessDefault,
      knowledge: knowledgeDefault,
      personal: personalDefault,
      entertainment: entertainmentDefault,
      creative: creativeDefault,
      other: otherDefault,
      all: [
        ...prodDefault,
        ...businessDefault,
        ...knowledgeDefault,
        ...personalDefault,
        ...entertainmentDefault,
        ...creativeDefault,
        ...otherDefault,
      ],
    };
  }, [
    prodItems,
    businessItems,
    knowledgeItems,
    personalItems,
    entertainmentItems,
    creativeItems,
    otherItems,
  ]);

  // Displayed items in right grid
  const displayedItems: LauncherItem[] = useMemo(() => {
    if (activeSpecific !== "all") {
      const cat = PRODUCTIVITY_CATEGORIES.find((c) => c.id === activeSpecific);
      if (cat) {
        return cat.getItems();
      }
    }

    if (mainTab === "productivity") return defaultItemsForTab.productivity;
    if (mainTab === "business") return defaultItemsForTab.business;
    if (mainTab === "knowledge") return defaultItemsForTab.knowledge;
    if (mainTab === "personal") return defaultItemsForTab.personal;
    if (mainTab === "entertainment") return defaultItemsForTab.entertainment;
    if (mainTab === "creative") return defaultItemsForTab.creative;
    if (mainTab === "other") return defaultItemsForTab.other;

    return defaultItemsForTab.all;
  }, [activeSpecific, mainTab, PRODUCTIVITY_CATEGORIES, defaultItemsForTab]);

  // Title for active category
  const activeCategoryTitle = useMemo(() => {
    if (activeSpecific === "all") return "";
    return PRODUCTIVITY_CATEGORIES.find((c) => c.id === activeSpecific)?.title || "";
  }, [activeSpecific, PRODUCTIVITY_CATEGORIES]);

  // Counts for main top pills
  const totalCountAll = defaultItemsForTab.all.length;
  const totalCountProd = defaultItemsForTab.productivity.length;
  const totalCountBusiness = defaultItemsForTab.business.length;
  const totalCountKnowledge = defaultItemsForTab.knowledge.length;
  const totalCountPersonal = defaultItemsForTab.personal.length;
  const totalCountEntertainment = defaultItemsForTab.entertainment.length;
  const totalCountCreative = defaultItemsForTab.creative.length;
  const totalCountOther = defaultItemsForTab.other.length;

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

        {/* Productivity */}
        <button
          onClick={() => {
            setMainTab("productivity");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "productivity"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <FolderKanban className="size-4 shrink-0" />
          <span>Productivity</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "productivity"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountProd}
          </span>
        </button>

        {/* Business */}
        <button
          onClick={() => {
            setMainTab("business");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "business"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Briefcase className="size-4 shrink-0" />
          <span>Business</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "business"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountBusiness}
          </span>
        </button>

        {/* Knowledge */}
        <button
          onClick={() => {
            setMainTab("knowledge");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "knowledge"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <BookOpen className="size-4 shrink-0" />
          <span>Knowledge</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "knowledge"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountKnowledge}
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

        {/* Entertainment */}
        <button
          onClick={() => {
            setMainTab("entertainment");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "entertainment"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Film className="size-4 shrink-0" />
          <span>Entertainment</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "entertainment"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountEntertainment}
          </span>
        </button>

        {/* Creative */}
        <button
          onClick={() => {
            setMainTab("creative");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "creative"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Sparkles className="size-4 shrink-0" />
          <span>Creative</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "creative"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountCreative}
          </span>
        </button>

        {/* Other */}
        <button
          onClick={() => {
            setMainTab("other");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "other"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <MoreHorizontal className="size-4 shrink-0" />
          <span>Other</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "other"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountOther}
          </span>
        </button>
      </div>

      {/* 12-Column Container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1640px] mx-auto w-full mb-[10pt] items-start">
        {/* LEFT: 3 Columns Space - Ukuran Layout Kategori Dikecilkan 5% agar ada margin lega di kiri & kanan */}
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
                  : mainTab === "productivity"
                  ? totalCountProd
                  : mainTab === "business"
                  ? totalCountBusiness
                  : mainTab === "knowledge"
                  ? totalCountKnowledge
                  : mainTab === "personal"
                  ? totalCountPersonal
                  : mainTab === "entertainment"
                  ? totalCountEntertainment
                  : mainTab === "creative"
                  ? totalCountCreative
                  : totalCountOther}
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
                  : mainTab === "productivity"
                  ? "Productivity"
                  : mainTab === "business"
                  ? "Business"
                  : mainTab === "knowledge"
                  ? "Knowledge"
                  : mainTab === "personal"
                  ? "Personal"
                  : mainTab === "entertainment"
                  ? "Entertainment"
                  : mainTab === "creative"
                  ? "Creative"
                  : "Other"}
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
