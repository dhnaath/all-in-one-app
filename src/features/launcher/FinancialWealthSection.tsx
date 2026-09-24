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
  Search,
  CreditCard,
  ShoppingCart,
  Wallet,
  ShieldAlert,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { navKonsultan, type NavItem } from "@/config/nav";
import { useLanguage } from "../finance/hooks/useLanguage";
import { translations } from "../finance/translations";

type LauncherItem =
  | { type: "app"; item: NavItem }
  | { type: "folder"; id: string; title: string; items: NavItem[] };

interface FinancialWealthSectionProps {
  page?: {
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

export type MainTabType =
  | "all"
  | "asset_earning"
  | "liability_expense"
  | "sharia"
  | "wealth_spectrum"
  | "value_treated"
  | "phase_side"
  | "commodity_index";

interface UnifiedCategory {
  id: string;
  title: string;
  group: MainTabType;
  icon: LucideIcon;
  getItems: () => LauncherItem[];
}

export function FinancialWealthSection({
  favorites,
  toggleFavorite,
  setActiveFolder,
  getGradient,
  FolderTile,
}: FinancialWealthSectionProps) {
  const [mainTab, setMainTab] = useState<MainTabType>("all");
  const [activeSpecific, setActiveSpecific] = useState<string>("all");
  const lang = useLanguage();

  // ==========================================
  // 1. DATA EXTRACTORS: FINANCIAL PLANNING
  // ==========================================
  const assetItems = useMemo(() => {
    const ae = navKonsultan.find((g) => g.title === "Asset & Earning");
    if (ae) {
      return ae.items.filter(
        (i) => i.to !== "/" && !i.to.startsWith("/earning") && i.to !== "/financial-health",
      );
    }
    return navKonsultan.find((g) => g.title === "Asset")?.items.filter((i) => i.to !== "/") || [];
  }, []);

  const kuadranAsset = useMemo(() => assetItems.find((i) => i.to === "/asset"), [assetItems]);

  const assetInstruments = useMemo(
    () =>
      assetItems.filter(
        (i) =>
          i.to.startsWith("/asset?type=") ||
          i.to === "/liquid-reserves" ||
          i.to === "/physical-commodities" ||
          i.to === "/real-estate" ||
          i.to === "/paper-securities" ||
          i.to === "/digital-assets" ||
          i.to === "/intellectual-property",
      ),
    [assetItems],
  );

  const investasiItems = useMemo(
    () => assetItems.filter((i) => i.to.startsWith("/investasi")),
    [assetItems],
  );

  const earningItems = useMemo(() => {
    const ae = navKonsultan.find((g) => g.title === "Asset & Earning");
    if (ae) {
      return ae.items.filter((i) => i.to.startsWith("/earning") || i.to === "/financial-health");
    }
    return navKonsultan.find((g) => g.title === "Earning")?.items.filter((i) => i.to !== "/") || [];
  }, []);

  const liabilityItems = useMemo(() => {
    const group = navKonsultan.find(
      (g) => g.title === "Liability & Expense" || g.title === "Liability",
    );
    return (
      group?.items.filter(
        (i) =>
          i.to !== "/" &&
          !i.to.startsWith("/expense") &&
          i.to !== "/budget" &&
          !i.to.startsWith("/pajak"),
      ) || []
    );
  }, []);

  const expenseItems = useMemo(() => {
    const le = navKonsultan.find((g) => g.title === "Liability & Expense");
    if (le) {
      return le.items.filter(
        (i) => i.to.startsWith("/expense") || i.to === "/budget" || i.to.startsWith("/pajak"),
      );
    }
    return navKonsultan.find((g) => g.title === "Expense")?.items.filter((i) => i.to !== "/") || [];
  }, []);

  const pajakItems = useMemo(
    () => expenseItems.filter((i) => i.to.startsWith("/pajak")),
    [expenseItems],
  );

  const shariaItems = useMemo(() => {
    return (
      navKonsultan
        .find((g) => g.title === "Syariah & Muamalah")
        ?.items.filter((i) => i.to !== "/") || []
    );
  }, []);

  const laranganItems = useMemo(
    () => shariaItems.filter((i) => i.to.startsWith("/syariah/terlarang")),
    [shariaItems],
  );

  const akadItems = useMemo(
    () => shariaItems.filter((i) => i.to.startsWith("/syariah/akad")),
    [shariaItems],
  );

  const zakatItems = useMemo(
    () => shariaItems.filter((i) => i.to.startsWith("/zakat")),
    [shariaItems],
  );

  // ==========================================
  // 2. DATA EXTRACTORS: WEALTH MANAGEMENT
  // ==========================================
  const valueTreatedItems = useMemo(() => {
    return (
      navKonsultan.find((g) => g.title === "Value Treated")?.items.filter((i) => i.to !== "/") || []
    );
  }, []);

  const wealthSpectrumGroup = useMemo(() => {
    const raw =
      navKonsultan.find((g) => g.title === "Wealth Spectrum")?.items.filter((i) => i.to !== "/") ||
      [];

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
      allPillarItems: raw,
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
    };
  }, []);

  const commodityItems = useMemo(() => {
    return (
      navKonsultan.find((g) => g.title === "Commodity Index")?.items.filter((i) => i.to !== "/") || []
    );
  }, []);

  // ==========================================
  // 3. UNIFIED CATEGORIES DEFINITION
  // ==========================================
  const ALL_CATEGORIES: UnifiedCategory[] = useMemo(() => {
    return [
      // 1. Asset & Earning
      {
        id: "fin-type-of-assets",
        title: "Type of Assets",
        group: "asset_earning",
        icon: Coins,
        getItems: () => {
          const items: LauncherItem[] = [];
          if (kuadranAsset) items.push({ type: "app", item: kuadranAsset });
          assetInstruments.forEach((item) => items.push({ type: "app", item }));
          return items;
        },
      },
      {
        id: "fin-tools-investasi",
        title: "Tools Investasi",
        group: "asset_earning",
        icon: TrendingUp,
        getItems: () => investasiItems.map((item) => ({ type: "app", item })),
      },
      {
        id: "fin-earning-kuadran",
        title: "Kuadran Pendapatan",
        group: "asset_earning",
        icon: Briefcase,
        getItems: () => {
          const item = earningItems.find((i) => i.to === "/earning");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "fin-earning-health",
        title: "Kesehatan Finansial",
        group: "asset_earning",
        icon: HeartHandshake,
        getItems: () => {
          const item = earningItems.find((i) => i.to === "/financial-health");
          return item ? [{ type: "app", item }] : [];
        },
      },

      // 2. Liability & Expense
      {
        id: "fin-lia-kuadran",
        title: "Kuadran Liabilitas",
        group: "liability_expense",
        icon: CreditCard,
        getItems: () => {
          const item = liabilityItems.find((i) => i.to === "/liability");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "fin-lia-kredit",
        title: "Kredit dan Utang",
        group: "liability_expense",
        icon: CreditCard,
        getItems: () => {
          const item = liabilityItems.find((i) => i.to === "/kredit");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "fin-lia-subscriptions",
        title: "Subscriptions",
        group: "liability_expense",
        icon: CreditCard,
        getItems: () => {
          const item = liabilityItems.find((i) => i.to === "/subscriptions");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "fin-exp-kuadran",
        title: "Kuadran Pengeluaran",
        group: "liability_expense",
        icon: ShoppingCart,
        getItems: () => {
          const item = expenseItems.find((i) => i.to === "/expense");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "fin-exp-budget",
        title: "Budget Anggaran",
        group: "liability_expense",
        icon: Wallet,
        getItems: () => {
          const item = expenseItems.find((i) => i.to === "/budget");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "fin-exp-pajak",
        title: "Kalkulator Pajak",
        group: "liability_expense",
        icon: Calculator,
        getItems: () => pajakItems.map((item) => ({ type: "app", item })),
      },

      // 3. Sharia Finance
      {
        id: "fin-sha-indeks",
        title: "Indeks Sharia",
        group: "sharia",
        icon: LineChart,
        getItems: () => {
          const item = commodityItems.find((i) => i.to === "/syariah/indeks");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "fin-sha-muamalah",
        title: "Pasar Muamalah",
        group: "sharia",
        icon: HeartHandshake,
        getItems: () => {
          const item = commodityItems.find((i) => i.to === "/syariah");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "fin-sha-larangan",
        title: "Larangan Muamalah",
        group: "sharia",
        icon: ShieldAlert,
        getItems: () => laranganItems.map((item) => ({ type: "app", item })),
      },
      {
        id: "fin-sha-akad",
        title: "Akad Syariah",
        group: "sharia",
        icon: FileText,
        getItems: () => akadItems.map((item) => ({ type: "app", item })),
      },
      {
        id: "fin-sha-zakat",
        title: "Zakat",
        group: "sharia",
        icon: Calculator,
        getItems: () => zakatItems.map((item) => ({ type: "app", item })),
      },

      // 4. Wealth Spectrum
      {
        id: "ws-pilar-surety",
        title: "Surety (Proteksi)",
        group: "wealth_spectrum",
        icon: ShieldCheck,
        getItems: () => {
          const items: LauncherItem[] = [];
          if (wealthSpectrumGroup.tahap1) {
            items.push({ type: "app", item: wealthSpectrumGroup.tahap1 });
          }
          wealthSpectrumGroup.suretyPillars.forEach((item) => items.push({ type: "app", item }));
          return items;
        },
      },
      {
        id: "ws-pilar-flow",
        title: "Flow (Likuiditas)",
        group: "wealth_spectrum",
        icon: Coins,
        getItems: () => {
          const items: LauncherItem[] = [];
          if (wealthSpectrumGroup.tahap2) {
            items.push({ type: "app", item: wealthSpectrumGroup.tahap2 });
          }
          wealthSpectrumGroup.flowPillars.forEach((item) => items.push({ type: "app", item }));
          return items;
        },
      },
      {
        id: "ws-pilar-build",
        title: "Build (Akumulasi)",
        group: "wealth_spectrum",
        icon: Building,
        getItems: () => {
          const items: LauncherItem[] = [];
          if (wealthSpectrumGroup.tahap3) {
            items.push({ type: "app", item: wealthSpectrumGroup.tahap3 });
          }
          wealthSpectrumGroup.buildPillars.forEach((item) => items.push({ type: "app", item }));
          return items;
        },
      },
      {
        id: "ws-pilar-grow",
        title: "Grow (Pertumbuhan)",
        group: "wealth_spectrum",
        icon: Sprout,
        getItems: () => {
          const items: LauncherItem[] = [];
          if (wealthSpectrumGroup.tahap4) {
            items.push({ type: "app", item: wealthSpectrumGroup.tahap4 });
          }
          wealthSpectrumGroup.growPillars.forEach((item) => items.push({ type: "app", item }));
          return items;
        },
      },
      {
        id: "ws-pilar-legacy",
        title: "Legacy (Warisan)",
        group: "wealth_spectrum",
        icon: BookOpen,
        getItems: () => {
          const items: LauncherItem[] = [];
          if (wealthSpectrumGroup.tahap5) {
            items.push({ type: "app", item: wealthSpectrumGroup.tahap5 });
          }
          wealthSpectrumGroup.legacyPillars.forEach((item) => items.push({ type: "app", item }));
          return items;
        },
      },

      // 5. Value Treated
      {
        id: "vt-liquid-reserves",
        title: "Liquid Reserves",
        group: "value_treated",
        icon: Coins,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/liquid-reserves");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-paper-securities",
        title: "Paper Securities",
        group: "value_treated",
        icon: LineChart,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/paper-securities");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-real-estate",
        title: "Real Estate",
        group: "value_treated",
        icon: Building,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/real-estate");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-commodities",
        title: "Physical Commodities",
        group: "value_treated",
        icon: Package,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/physical-commodities");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-digital-assets",
        title: "Digital Assets",
        group: "value_treated",
        icon: Compass,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/digital-assets");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "vt-intellectual-property",
        title: "Intellectual Property",
        group: "value_treated",
        icon: Briefcase,
        getItems: () => {
          const item = valueTreatedItems.find((i) => i.to === "/intellectual-property");
          return item ? [{ type: "app", item }] : [];
        },
      },

      // 6. Phase Side
      {
        id: "ps-self-shaping",
        title: "Self-Shaping",
        group: "phase_side",
        icon: Eye,
        getItems: () => phaseSideItems.selfShaping.map((item) => ({ type: "app", item })),
      },
      {
        id: "ps-mutual-mapping",
        title: "Mutual-Mapping",
        group: "phase_side",
        icon: Heart,
        getItems: () => phaseSideItems.mutualMapping.map((item) => ({ type: "app", item })),
      },
      {
        id: "ps-org-optimizing",
        title: "Organization-Optimizing",
        group: "phase_side",
        icon: Workflow,
        getItems: () => phaseSideItems.orgOptimizing.map((item) => ({ type: "app", item })),
      },

      // 7. Commodity Index
      {
        id: "ci-100-komoditas",
        title: "100 Komoditas",
        group: "commodity_index",
        icon: Package,
        getItems: () => {
          const item = commodityItems.find((i) => i.to === "/100-komoditas");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "ci-pasar-muamalah",
        title: "Pasar Muamalah",
        group: "commodity_index",
        icon: HeartHandshake,
        getItems: () => {
          const item = commodityItems.find((i) => i.to === "/syariah");
          return item ? [{ type: "app", item }] : [];
        },
      },
      {
        id: "ci-indeks-sharia",
        title: "Indeks Sharia",
        group: "commodity_index",
        icon: LineChart,
        getItems: () => {
          const item = commodityItems.find((i) => i.to === "/syariah/indeks");
          return item ? [{ type: "app", item }] : [];
        },
      },
    ];
  }, [
    kuadranAsset,
    assetInstruments,
    investasiItems,
    earningItems,
    liabilityItems,
    expenseItems,
    pajakItems,
    laranganItems,
    akadItems,
    zakatItems,
    wealthSpectrumGroup,
    valueTreatedItems,
    phaseSideItems,
    commodityItems,
  ]);

  // ==========================================
  // 4. DEFAULT ITEMS FOR EACH MAIN TAB
  // ==========================================
  const defaultItemsForTab = useMemo(() => {
    // 1. Asset & Earning
    const aeDefault: LauncherItem[] = [];
    if (kuadranAsset) aeDefault.push({ type: "app", item: kuadranAsset });
    assetInstruments.forEach((item) => aeDefault.push({ type: "app", item }));
    investasiItems.forEach((item) => aeDefault.push({ type: "app", item }));
    earningItems.forEach((item) => aeDefault.push({ type: "app", item }));

    // 2. Liability & Expense
    const leDefault: LauncherItem[] = [];
    liabilityItems.forEach((item) => leDefault.push({ type: "app", item }));
    expenseItems.forEach((item) => leDefault.push({ type: "app", item }));

    // 3. Sharia Finance
    const shaDefault: LauncherItem[] = [
      ...shariaItems.map((item) => ({ type: "app" as const, item })),
      ...commodityItems.filter((i) => i.to.startsWith("/syariah")).map((item) => ({ type: "app" as const, item })),
    ];

    // 4. Wealth Spectrum (Direct app tiles)
    const wsDefault: LauncherItem[] = wealthSpectrumGroup.allPillarItems.map((item) => ({
      type: "app",
      item,
    }));

    // 5. Value Treated
    const vtDefault: LauncherItem[] = valueTreatedItems.map((item) => ({ type: "app", item }));

    // 6. Phase Side
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

    // 7. Commodity Index
    const ciDefault: LauncherItem[] = commodityItems.map((item) => ({ type: "app", item }));

    // All unified items
    const allDefault: LauncherItem[] = [
      ...aeDefault,
      ...leDefault,
      ...shaDefault,
      ...wsDefault,
      ...vtDefault,
      ...psDefault,
      ...ciDefault,
    ];

    return {
      all: allDefault,
      asset_earning: aeDefault,
      liability_expense: leDefault,
      sharia: shaDefault,
      wealth_spectrum: wsDefault,
      value_treated: vtDefault,
      phase_side: psDefault,
      commodity_index: ciDefault,
    };
  }, [
    kuadranAsset,
    assetInstruments,
    investasiItems,
    earningItems,
    liabilityItems,
    expenseItems,
    shariaItems,
    wealthSpectrumGroup,
    valueTreatedItems,
    phaseSideItems,
    commodityItems,
  ]);

  // Filter categories by selected main tab
  const visibleCategories = useMemo(() => {
    let list = ALL_CATEGORIES;
    if (mainTab !== "all") {
      list = list.filter((c) => c.group === mainTab);
    }
    return list;
  }, [mainTab, ALL_CATEGORIES]);

  // Displayed items in right grid
  const displayedItems: LauncherItem[] = useMemo(() => {
    if (activeSpecific !== "all") {
      const cat = ALL_CATEGORIES.find((c) => c.id === activeSpecific);
      if (cat) {
        return cat.getItems();
      }
    }

    if (mainTab === "asset_earning") return defaultItemsForTab.asset_earning;
    if (mainTab === "liability_expense") return defaultItemsForTab.liability_expense;
    if (mainTab === "sharia") return defaultItemsForTab.sharia;
    if (mainTab === "wealth_spectrum") return defaultItemsForTab.wealth_spectrum;
    if (mainTab === "value_treated") return defaultItemsForTab.value_treated;
    if (mainTab === "phase_side") return defaultItemsForTab.phase_side;
    if (mainTab === "commodity_index") return defaultItemsForTab.commodity_index;

    return defaultItemsForTab.all;
  }, [activeSpecific, mainTab, ALL_CATEGORIES, defaultItemsForTab]);

  const activeCategoryTitle = useMemo(() => {
    if (activeSpecific === "all") return "";
    return ALL_CATEGORIES.find((c) => c.id === activeSpecific)?.title || "";
  }, [activeSpecific, ALL_CATEGORIES]);

  // Pillar details for Wealth Spectrum
  const pillarInfo = useMemo(() => {
    if (activeSpecific === "ws-pilar-surety" || activeCategoryTitle.includes("Surety")) {
      return {
        id: "pilar-surety",
        label: "Surety",
        icon: ShieldCheck,
        title: translations.landing.categories.surety.desc[lang],
        longDesc: translations.landing.categories.surety.long[lang],
      };
    }
    if (activeSpecific === "ws-pilar-flow" || activeCategoryTitle.includes("Flow")) {
      return {
        id: "pilar-flow",
        label: "Flow",
        icon: Coins,
        title: translations.landing.categories.flow.desc[lang],
        longDesc: translations.landing.categories.flow.long[lang],
      };
    }
    if (activeSpecific === "ws-pilar-build" || activeCategoryTitle.includes("Build")) {
      return {
        id: "pilar-build",
        label: "Build",
        icon: Building,
        title: translations.landing.categories.build.desc[lang],
        longDesc: translations.landing.categories.build.long[lang],
      };
    }
    if (activeSpecific === "ws-pilar-grow" || activeCategoryTitle.includes("Grow")) {
      return {
        id: "pilar-grow",
        label: "Grow",
        icon: Sprout,
        title: translations.landing.categories.grow.desc[lang],
        longDesc: translations.landing.categories.grow.long[lang],
      };
    }
    if (activeSpecific === "ws-pilar-legacy" || activeCategoryTitle.includes("Legacy")) {
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

  // Pill item configs
  const mainPills: { id: MainTabType; label: string; icon: LucideIcon; count: number }[] = [
    { id: "all", label: "Semua", icon: Layers, count: defaultItemsForTab.all.length },
    {
      id: "asset_earning",
      label: "Asset & Earning",
      icon: Briefcase,
      count: defaultItemsForTab.asset_earning.length,
    },
    {
      id: "liability_expense",
      label: "Liability & Expense",
      icon: CreditCard,
      count: defaultItemsForTab.liability_expense.length,
    },
    {
      id: "sharia",
      label: "Sharia Finance",
      icon: ShieldCheck,
      count: defaultItemsForTab.sharia.length,
    },
    {
      id: "wealth_spectrum",
      label: "Wealth Spectrum",
      icon: TrendingUp,
      count: defaultItemsForTab.wealth_spectrum.length,
    },
    {
      id: "value_treated",
      label: "Value Treated",
      icon: Package,
      count: defaultItemsForTab.value_treated.length,
    },
    {
      id: "phase_side",
      label: "Phase Side",
      icon: Compass,
      count: defaultItemsForTab.phase_side.length,
    },
    {
      id: "commodity_index",
      label: "Commodity Index",
      icon: LineChart,
      count: defaultItemsForTab.commodity_index.length,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Description: styling requirement strictly applied */}
      <div className="text-center mb-[calc(1.5rem+10pt)]">
        <h3 className="text-2xl sm:text-3xl tracking-tight flex items-center justify-center gap-1.5 text-foreground/90 font-normal">
          <span className="font-bold">Financial</span>
          <span className="font-normal">Planning</span>
          <span className="font-normal mx-0.5">&</span>
          <span className="font-bold">Wealth</span>
          <span className="font-normal">Management</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-[calc(0.25rem+10pt)] max-w-xl mx-auto">
          What Counts, Well Planned. What Matters, Well Managed.
        </p>
      </div>

      {/* Main Level Pills di Atas */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full mb-[calc(2rem+10pt)]">
        {mainPills.map((pill) => {
          const Icon = pill.icon;
          const isActive = mainTab === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => {
                setMainTab(pill.id);
                setActiveSpecific("all");
              }}
              className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
                  : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span>{pill.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background/80 text-muted-foreground"
                }`}
              >
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 12-Column Container: 3 columns on the left (Pills pendek), 9 columns on the right (matching mini MBA / 100 Tools style) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1640px] mx-auto w-full mb-[10pt] items-start">
        {/* LEFT: 3 Columns Space - Clean Pills list without rigid square box card */}
        <div className="xl:col-span-3 w-full flex flex-col items-center xl:items-start">
          <div
            className="w-[95%] max-w-[95%] mx-auto flex flex-col gap-1.5 max-h-[720px] overflow-y-auto px-1.5 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Opsi Tampilkan Semua Item dari Tab Terpilih */}
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
                <span className="truncate">Tampilkan Semua</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                  activeSpecific === "all"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background/80 text-muted-foreground"
                }`}
              >
                {mainTab === "all"
                  ? defaultItemsForTab.all.length
                  : defaultItemsForTab[mainTab].length}
              </span>
            </button>

            {visibleCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeSpecific === cat.id;
              const count = cat.getItems().length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveSpecific(cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
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
                      isSelected
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
          {/* Breadcrumb Header */}
          <div className="flex items-center justify-between px-1 py-1 text-xs border-b border-border/40 pb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-foreground/90">
                {mainPills.find((p) => p.id === mainTab)?.label || "Semua"}
              </span>
              {activeCategoryTitle && (
                <>
                  <span className="text-muted-foreground/60">/</span>
                  <span className="font-medium text-primary">{activeCategoryTitle}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-muted-foreground font-medium">
                {displayedItems.length} modul
              </span>
            </div>
          </div>

          {/* Pillar Detailed Educational Info Box (for Wealth Spectrum) */}
          {pillarInfo && (
            <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm sm:text-base">
                <pillarInfo.icon className="size-4 sm:size-5" />
                <span>Pilar {pillarInfo.label}</span>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-foreground">
                {pillarInfo.title}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {pillarInfo.longDesc}
              </p>
            </div>
          )}

          {/* Interactive Tiles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-x-3 gap-y-6 place-items-start w-full">
            {displayedItems.length === 0 ? (
              <div className="col-span-full py-16 text-center text-sm text-muted-foreground italic w-full">
                Tidak ada aplikasi atau modul pada kategori ini.
              </div>
            ) : (
              displayedItems.map((item, idx) => {
                if (item.type === "folder") {
                  return (
                    <FolderTile
                      key={item.id || idx}
                      folder={item}
                      onClick={() => setActiveFolder(item)}
                    />
                  );
                }

                const navItem = item.item;
                const isFav = favorites.includes(navItem.to);
                const gradient = getGradient(navItem.label);

                return (
                  <Link
                    key={navItem.to + idx}
                    to={navItem.to}
                    className="flex flex-col items-center gap-2 group w-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-[1.25rem] cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-110 group-active:scale-95 ${gradient} relative`}
                    >
                      <navItem.icon
                        className="size-7 sm:size-8 opacity-90 drop-shadow-sm"
                        strokeWidth={1.5}
                      />

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(navItem.to);
                        }}
                        className={`absolute -top-2 -right-2 p-1.5 rounded-full bg-background border shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 scale-90 hover:scale-110 ${
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
                    <span className="text-xs sm:text-sm text-foreground/90 font-medium text-center line-clamp-2 leading-tight px-1 group-hover:text-foreground">
                      {navItem.label}
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
