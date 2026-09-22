import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Star,
  Layers,
  Coins,
  CreditCard,
  DollarSign,
  ShoppingCart,
  HeartHandshake,
  Briefcase,
  Package,
  Home,
  ScrollText,
  Binary,
  Lightbulb,
  TrendingUp,
  HeartPulse,
  Wallet,
  Calculator,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Dice5,
  FileText,
  Shield,
  Scale,
  Handshake,
  Archive,
  Users,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { navKonsultan, type NavItem } from "@/config/nav";

type LauncherItem =
  | { type: "app"; item: NavItem }
  | { type: "folder"; id: string; title: string; items: NavItem[] };

interface MoneyTrackerSectionProps {
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

interface MoneyCategory {
  id: string;
  title: string;
  group: "asset_earning" | "liability_expense" | "sharia";
  icon: LucideIcon;
  getItems: () => LauncherItem[];
}

export function MoneyTrackerSection({
  favorites,
  toggleFavorite,
  setActiveFolder,
  getGradient,
  FolderTile,
}: MoneyTrackerSectionProps) {
  const [mainTab, setMainTab] = useState<
    "all" | "asset_earning" | "liability_expense" | "sharia"
  >("all");
  const [activeSpecific, setActiveSpecific] = useState<string>("all");

  // Raw items from nav groups
  const assetItems = useMemo(() => {
    const group = navKonsultan.find((g) => g.title === "Asset & Earning" || g.title === "Asset");
    return (
      group?.items.filter(
        (i) => i.to !== "/" && !i.to.startsWith("/earning") && i.to !== "/financial-health"
      ) || []
    );
  }, []);

  const liabilityItems = useMemo(() => {
    const group = navKonsultan.find((g) => g.title === "Liability & Expense" || g.title === "Liability");
    return (
      group?.items.filter(
        (i) => i.to !== "/" && !i.to.startsWith("/expense") && i.to !== "/budget" && !i.to.startsWith("/pajak")
      ) || []
    );
  }, []);

  const earningItems = useMemo(() => {
    const ae = navKonsultan.find((g) => g.title === "Asset & Earning");
    if (ae) {
      return ae.items.filter((i) => i.to.startsWith("/earning") || i.to === "/financial-health");
    }
    return navKonsultan.find((g) => g.title === "Earning")?.items.filter((i) => i.to !== "/") || [];
  }, []);

  const expenseItems = useMemo(() => {
    const le = navKonsultan.find((g) => g.title === "Liability & Expense");
    if (le) {
      return le.items.filter((i) => i.to.startsWith("/expense") || i.to === "/budget" || i.to.startsWith("/pajak"));
    }
    return navKonsultan.find((g) => g.title === "Expense")?.items.filter((i) => i.to !== "/") || [];
  }, []);

  const pajakItems = useMemo(
    () => expenseItems.filter((i) => i.to.startsWith("/pajak")),
    [expenseItems]
  );

  const shariaItems = useMemo(() => {
    return (
      navKonsultan.find((g) => g.title === "Syariah & Muamalah")?.items.filter((i) => i.to !== "/") || []
    );
  }, []);

  // Asset instruments for Type of Assets folder
  const kuadranAsset = useMemo(() => assetItems.find((i) => i.to === "/asset"), [assetItems]);
  const assetInstruments = useMemo(
    () => assetItems.filter((i) => i.to !== "/asset" && !i.to.startsWith("/investasi")),
    [assetItems]
  );
  const investasiItems = useMemo(
    () => assetItems.filter((i) => i.to.startsWith("/investasi")),
    [assetItems]
  );

  // Sharia grouped items for category filtering
  const laranganItems = useMemo(
    () =>
      shariaItems.filter(
        (i) => i.to.startsWith("/syariah/terlarang") && i.to !== "/syariah/terlarang"
      ),
    [shariaItems]
  );
  const akadItems = useMemo(
    () =>
      shariaItems.filter(
        (i) => i.to.startsWith("/syariah/akad") && i.to !== "/syariah/akad"
      ),
    [shariaItems]
  );
  const zakatItems = useMemo(
    () =>
      shariaItems.filter(
        (i) => i.to.startsWith("/zakat") && i.to !== "/zakat"
      ),
    [shariaItems]
  );

  // Categories list (strictly without '&' symbols)
  const MONEY_CATEGORIES: MoneyCategory[] = useMemo(() => {
    return [
      // Asset & Earning Group
      {
        id: "asset-type-folder",
        title: "Type of Assets",
        group: "asset_earning",
        icon: Package,
        getItems: () => assetInstruments.map((item) => ({ type: "app", item })),
      },
      {
        id: "asset-tools-investasi",
        title: "Tools Investasi",
        group: "asset_earning",
        icon: TrendingUp,
        getItems: () => investasiItems.map((item) => ({ type: "app", item })),
      },
      {
        id: "earn-kuadran",
        title: "Kuadran Pendapatan",
        group: "asset_earning",
        icon: DollarSign,
        getItems: () => {
          const item = earningItems.find((i) => i.to === "/earning");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "earn-health",
        title: "Kesehatan Finansial",
        group: "asset_earning",
        icon: HeartPulse,
        getItems: () => {
          const item = earningItems.find((i) => i.to === "/financial-health");
          return item ? [{ type: "app", item }] : [];
        },
      },

      // Liability & Expense Group
      {
        id: "lia-kuadran",
        title: "Kuadran Liabilitas",
        group: "liability_expense",
        icon: CreditCard,
        getItems: () => {
          const item = liabilityItems.find((i) => i.to === "/liability");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "lia-kredit",
        title: "Kredit dan Utang",
        group: "liability_expense",
        icon: CreditCard,
        getItems: () => {
          const item = liabilityItems.find((i) => i.to === "/kredit");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "lia-subscriptions",
        title: "Subscriptions",
        group: "liability_expense",
        icon: CreditCard,
        getItems: () => {
          const item = liabilityItems.find((i) => i.to === "/subscriptions");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "exp-kuadran",
        title: "Kuadran Pengeluaran",
        group: "liability_expense",
        icon: ShoppingCart,
        getItems: () => {
          const item = expenseItems.find((i) => i.to === "/expense");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "exp-budget",
        title: "Budget Anggaran",
        group: "liability_expense",
        icon: Wallet,
        getItems: () => {
          const item = expenseItems.find((i) => i.to === "/budget");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "exp-pajak",
        title: "Kalkulator Pajak",
        group: "liability_expense",
        icon: Calculator,
        getItems: () => pajakItems.map((item) => ({ type: "app", item })),
      },

      // Sharia Finance Group (Merged into Larangan Muamalah & Akad Syariah)
      {
        id: "sha-larangan",
        title: "Larangan Muamalah",
        group: "sharia",
        icon: ShieldAlert,
        getItems: () => laranganItems.map((item) => ({ type: "app", item })),
      },
      {
        id: "sha-akad",
        title: "Akad Syariah",
        group: "sharia",
        icon: FileText,
        getItems: () => akadItems.map((item) => ({ type: "app", item })),
      },
      {
        id: "sha-zakat",
        title: "Zakat",
        group: "sharia",
        icon: Calculator,
        getItems: () => zakatItems.map((item) => ({ type: "app", item })),
      },
    ];
  }, [
    earningItems,
    liabilityItems,
    expenseItems,
    pajakItems,
    assetInstruments,
    investasiItems,
    laranganItems,
    akadItems,
    zakatItems,
  ]);

  // Default items when activeSpecific === "all"
  const defaultItemsForTab = useMemo(() => {
    // Asset & Earning default: Kuadran Aset, individual asset instruments, Investasi, and Earning
    const assetEarningDefault: LauncherItem[] = [];
    if (kuadranAsset) assetEarningDefault.push({ type: "app", item: kuadranAsset });
    assetInstruments.forEach((item) => {
      assetEarningDefault.push({ type: "app", item });
    });
    investasiItems.forEach((item) => {
      assetEarningDefault.push({ type: "app", item });
    });
    earningItems.forEach((item) => {
      assetEarningDefault.push({ type: "app", item });
    });

    // Liability & Expense default
    const liaExpDefault: LauncherItem[] = [];
    liabilityItems.forEach((item) => {
      liaExpDefault.push({ type: "app", item });
    });
    expenseItems.forEach((item) => {
      liaExpDefault.push({ type: "app", item });
    });

    // Sharia default
    const shaDefault: LauncherItem[] = shariaItems.map((item) => ({ type: "app", item }));

    return {
      asset_earning: assetEarningDefault,
      liability_expense: liaExpDefault,
      sharia: shaDefault,
      all: [...assetEarningDefault, ...liaExpDefault, ...shaDefault],
    };
  }, [
    kuadranAsset,
    assetInstruments,
    investasiItems,
    earningItems,
    liabilityItems,
    expenseItems,
    shariaItems,
  ]);

  // Displayed items in right grid
  const displayedItems: LauncherItem[] = useMemo(() => {
    if (activeSpecific !== "all") {
      const cat = MONEY_CATEGORIES.find((c) => c.id === activeSpecific);
      if (cat) {
        return cat.getItems();
      }
    }

    if (mainTab === "asset_earning") return defaultItemsForTab.asset_earning;
    if (mainTab === "liability_expense") return defaultItemsForTab.liability_expense;
    if (mainTab === "sharia") return defaultItemsForTab.sharia;

    return defaultItemsForTab.all;
  }, [activeSpecific, mainTab, MONEY_CATEGORIES, defaultItemsForTab]);

  // Title for active category
  const activeCategoryTitle = useMemo(() => {
    if (activeSpecific === "all") return "";
    return MONEY_CATEGORIES.find((c) => c.id === activeSpecific)?.title || "";
  }, [activeSpecific, MONEY_CATEGORIES]);

  // Counts for main top pills
  const totalCountAll = defaultItemsForTab.all.length;
  const totalCountAssetEarning = defaultItemsForTab.asset_earning.length;
  const totalCountLiaExp = defaultItemsForTab.liability_expense.length;
  const totalCountSha = defaultItemsForTab.sharia.length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Description */}
      <div className="text-center mb-[calc(1.5rem+10pt)]">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2">
          <span>Financial Planning</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-[calc(0.25rem+10pt)] max-w-xl mx-auto">
          What Counts, Well Planned.
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

        {/* Asset & Earning */}
        <button
          onClick={() => {
            setMainTab("asset_earning");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "asset_earning"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Briefcase className="size-4 shrink-0" />
          <span>Asset & Earning</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "asset_earning"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountAssetEarning}
          </span>
        </button>

        {/* Liability & Expense */}
        <button
          onClick={() => {
            setMainTab("liability_expense");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "liability_expense"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <CreditCard className="size-4 shrink-0" />
          <span>Liability & Expense</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "liability_expense"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountLiaExp}
          </span>
        </button>

        {/* Sharia Finance */}
        <button
          onClick={() => {
            setMainTab("sharia");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "sharia"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <HeartHandshake className="size-4 shrink-0" />
          <span>Sharia Finance</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "sharia"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {totalCountSha}
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
                  : mainTab === "asset_earning"
                  ? totalCountAssetEarning
                  : mainTab === "liability_expense"
                  ? totalCountLiaExp
                  : totalCountSha}
              </span>
            </button>

            {/* Specific Categories filtered by mainTab */}
            {MONEY_CATEGORIES.filter((cat) => {
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
                  : mainTab === "asset_earning"
                  ? "Asset & Earning"
                  : mainTab === "liability_expense"
                  ? "Liability & Expense"
                  : "Sharia Finance"}
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
