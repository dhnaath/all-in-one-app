import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { 
  Star, 
  Layers,
  Milestone,
  Wrench,
  Compass,
  LayoutGrid,
  TrendingUp,
  Settings,
  Landmark,
  Lightbulb,
  Award,
  RefreshCw,
  Building,
  Target,
  LineChart,
  Workflow,
  ShieldAlert,
  Users,
  DollarSign,
  Binary,
  ShieldCheck,
  Zap,
  Coins,
  Building2,
  Sprout,
  BookOpen,
  Grid2X2,
  Store,
  Navigation,
  Gauge,
  Calculator,
  Scale,
  ArrowRightLeft,
  Network,
  Brain,
  FolderKanban,
  Globe,
  Heart,
  MessagesSquare,
  Sparkles,
  PenTool,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { navKonsultan, type NavItem } from "@/config/nav";

type LauncherItem =
  | { type: "app"; item: NavItem }
  | { type: "folder"; id: string; title: string; items: NavItem[] };

interface Tools100SectionProps {
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

export type ToolDomainId =
  | "all"
  | "strategy"
  | "marketing"
  | "operations"
  | "finance"
  | "innovation"
  | "leadership"
  | "governance";

export interface ToolDomain {
  id: ToolDomainId;
  label: string;
  icon: LucideIcon;
}

export const TOOL_DOMAINS: ToolDomain[] = [
  { id: "all", label: "Semua", icon: Layers },
  { id: "strategy", label: "Strategy & Model", icon: Compass },
  { id: "marketing", label: "Marketing & Sales", icon: Store },
  { id: "operations", label: "Operations & Quality", icon: Settings },
  { id: "finance", label: "Finance & Feasibility", icon: Calculator },
  { id: "innovation", label: "Innovation & Tech", icon: Sparkles },
  { id: "leadership", label: "People & Leadership", icon: Users },
  { id: "governance", label: "Risk, ESG & Policy", icon: ShieldAlert },
];

interface DetailedToolCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  domain: ToolDomainId;
  itemPaths: string[];
}

// 37 Detailed categories without any '&' symbol
const DETAILED_TOOL_CATEGORIES: DetailedToolCategory[] = [
  {
    id: "strategic-management",
    title: "Strategic Management",
    icon: Compass,
    domain: "strategy",
    itemPaths: [
      "/100-framework",
      "/swot",
      "/tows",
      "/pestel",
      "/porter",
      "/vrio",
      "/value-chain",
      "/bcg",
      "/ge-mckinsey",
      "/ansoff",
      "/blue-ocean",
      "/value-disciplines",
    ],
  },
  {
    id: "business-model",
    title: "Business Model",
    icon: LayoutGrid,
    domain: "strategy",
    itemPaths: ["/bmc", "/lean-canvas"],
  },
  {
    id: "value-proposition",
    title: "Value Proposition",
    icon: Target,
    domain: "strategy",
    itemPaths: ["/value-proposition-canvas", "/empathy-map"],
  },
  {
    id: "marketing-strategy",
    title: "Marketing Strategy",
    icon: Store,
    domain: "marketing",
    itemPaths: ["/stp", "/marketing-mix", "/product-life-cycle"],
  },
  {
    id: "customer-experience",
    title: "Customer Experience",
    icon: Navigation,
    domain: "marketing",
    itemPaths: ["/customer-journey-map", "/kano-model"],
  },
  {
    id: "operations-management",
    title: "Operations Management",
    icon: Settings,
    domain: "operations",
    itemPaths: [
      "/framework/six-sigma-dmaic",
      "/framework/sipoc-diagram",
      "/framework/raci-matrix",
      "/framework/gantt-chart",
    ],
  },
  {
    id: "performance-management",
    title: "Performance Management",
    icon: Gauge,
    domain: "operations",
    itemPaths: [
      "/framework/balanced-scorecard-bsc",
      "/framework/okr-framework",
      "/framework/eisenhower-matrix",
    ],
  },
  {
    id: "financial-management",
    title: "Financial Management",
    icon: Calculator,
    domain: "finance",
    itemPaths: [
      "/valuasi",
      "/framework/analisis-rasio-keuangan",
      "/framework/capital-budgeting-roi-npv-irr",
      "/framework/break-even-analysis-bep",
    ],
  },
  {
    id: "business-feasibility",
    title: "Business Feasibility",
    icon: Scale,
    domain: "finance",
    itemPaths: [
      "/framework/cost-benefit-analysis-cba",
      "/framework/business-case-analysis",
    ],
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    icon: Zap,
    domain: "innovation",
    itemPaths: ["/framework/lean-startup-loop"],
  },
  {
    id: "design-thinking",
    title: "Design Thinking",
    icon: Lightbulb,
    domain: "innovation",
    itemPaths: ["/framework/design-thinking"],
  },
  {
    id: "quality-management",
    title: "Quality Management",
    icon: Award,
    domain: "operations",
    itemPaths: [
      "/framework/fishbone-diagram-ishikawa",
      "/framework/house-of-quality-hoq-qfd",
    ],
  },
  {
    id: "continuous-improvement",
    title: "Continuous Improvement",
    icon: RefreshCw,
    domain: "operations",
    itemPaths: ["/framework/pdca-cycle"],
  },
  {
    id: "change-management",
    title: "Change Management",
    icon: ArrowRightLeft,
    domain: "leadership",
    itemPaths: [
      "/framework/kotters-8-step-change",
      "/framework/force-field-analysis",
    ],
  },
  {
    id: "organizational-development",
    title: "Organizational Development",
    icon: Network,
    domain: "leadership",
    itemPaths: ["/framework/mckinsey-7s-framework"],
  },
  {
    id: "public-policy",
    title: "Public Policy",
    icon: Building,
    domain: "governance",
    itemPaths: [
      "/framework/analisis-kebijakan-public-dunn",
      "/framework/stakeholder-power-interest",
    ],
  },
  {
    id: "program-management",
    title: "Program Management",
    icon: Layers,
    domain: "governance",
    itemPaths: [
      "/framework/logical-framework-analysis",
      "/framework/smart-criteria",
    ],
  },
  {
    id: "decision-making",
    title: "Decision Making",
    icon: Target,
    domain: "governance",
    itemPaths: [
      "/framework/decision-tree-analysis",
      "/framework/decision-matrix-pugh",
      "/framework/six-thinking-hats",
    ],
  },
  {
    id: "analytical-thinking",
    title: "Analytical Thinking",
    icon: Brain,
    domain: "governance",
    itemPaths: [
      "/framework/pareto-analysis-8020",
      "/framework/analytical-hierarchy-process-ahp",
    ],
  },
  {
    id: "economics-analysis",
    title: "Economics Analysis",
    icon: TrendingUp,
    domain: "finance",
    itemPaths: [
      "/framework/supply-demand-analysis",
      "/framework/input-output-analysis",
    ],
  },
  {
    id: "quantitative-analysis",
    title: "Quantitative Analysis",
    icon: LineChart,
    domain: "finance",
    itemPaths: ["/framework/radar-spider-chart"],
  },
  {
    id: "product-management",
    title: "Product Management",
    icon: Workflow,
    domain: "innovation",
    itemPaths: [
      "/framework/product-vision-board",
      "/framework/kano-feature-prioritization",
      "/framework/opportunity-solution-tree",
      "/framework/dual-track-agile-framework",
    ],
  },
  {
    id: "agile-scrum-prioritization",
    title: "Agile Scrum Prioritization",
    icon: FolderKanban,
    domain: "innovation",
    itemPaths: [
      "/framework/scrum-kanban-board",
      "/framework/rice-scoring-model",
      "/framework/moscow-prioritization",
      "/framework/user-story-mapping",
    ],
  },
  {
    id: "sustainability-esg",
    title: "Sustainability ESG",
    icon: Globe,
    domain: "governance",
    itemPaths: [
      "/framework/esg-materiality-matrix",
      "/framework/triple-bottom-line-tbl",
      "/framework/circular-economy-butterfly",
      "/framework/carbon-footprint-scope-1-3",
    ],
  },
  {
    id: "risk-management",
    title: "Risk Management",
    icon: ShieldAlert,
    domain: "governance",
    itemPaths: [
      "/framework/risk-assessment-matrix",
      "/framework/fmea-framework",
      "/framework/iso-31000-risk-management",
      "/framework/business-continuity-plan-bcp",
    ],
  },
  {
    id: "leadership",
    title: "Leadership",
    icon: Users,
    domain: "leadership",
    itemPaths: [
      "/framework/situational-leadership",
      "/framework/360-degree-feedback",
      "/framework/kirkpatrick-4-level-model",
    ],
  },
  {
    id: "talent-management",
    title: "Talent Management",
    icon: Grid2X2,
    domain: "leadership",
    itemPaths: [
      "/framework/9-box-talent-grid",
      "/framework/evp-canvas",
      "/framework/johari-window",
    ],
  },
  {
    id: "culture-management",
    title: "Culture Management",
    icon: Heart,
    domain: "leadership",
    itemPaths: [
      "/framework/culture-map",
      "/framework/lencionis-5-dysfunctions",
    ],
  },
  {
    id: "sales-methodologies",
    title: "Sales Methodologies",
    icon: MessagesSquare,
    domain: "marketing",
    itemPaths: [
      "/framework/meddpicc-framework",
      "/framework/spin-selling-framework",
      "/framework/bant-framework",
    ],
  },
  {
    id: "pricing-strategies",
    title: "Pricing Strategies",
    icon: DollarSign,
    domain: "marketing",
    itemPaths: [
      "/framework/pricing-matrix-elasticity",
      "/framework/value-based-pricing-canvas",
    ],
  },
  {
    id: "revenue-operations",
    title: "Revenue Operations",
    icon: Landmark,
    domain: "marketing",
    itemPaths: [
      "/framework/unit-economics-clvcac",
      "/framework/revenue-engine-flywheel",
      "/framework/churn-analysis-matrix",
    ],
  },
  {
    id: "deep-tech",
    title: "Deep Tech",
    icon: Binary,
    domain: "innovation",
    itemPaths: [
      "/framework/technology-readiness-trl",
      "/framework/gartner-hype-cycle",
    ],
  },
  {
    id: "innovation-labs",
    title: "Innovation Labs",
    icon: Sparkles,
    domain: "innovation",
    itemPaths: [
      "/framework/doblins-10-types-innovation",
      "/framework/scamper-ideation-canvas",
      "/framework/open-innovation-model",
    ],
  },
  {
    id: "future-studies",
    title: "Future Studies",
    icon: Compass,
    domain: "innovation",
    itemPaths: [
      "/framework/horizon-scanning-futures",
      "/framework/mvp-canvas",
      "/framework/value-proposition-testing",
    ],
  },
  {
    id: "public-relations",
    title: "Public Relations",
    icon: PenTool,
    domain: "governance",
    itemPaths: [
      "/framework/scr-framework-minto",
      "/framework/peso-model",
      "/framework/press-release-canvas",
    ],
  },
  {
    id: "crisis-management",
    title: "Crisis Management",
    icon: ShieldCheck,
    domain: "governance",
    itemPaths: [
      "/framework/crisis-communication-scct",
      "/framework/issue-life-cycle",
    ],
  },
  {
    id: "stakeholder-relations",
    title: "Stakeholder Relations",
    icon: HeartHandshake,
    domain: "governance",
    itemPaths: [
      "/framework/brand-archetypes",
      "/framework/carrolls-csr-pyramid",
      "/framework/stakeholder-engagement",
    ],
  },
];

export interface TahapModule {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}

export const TAHAPAN_MODULES: TahapModule[] = [
  {
    id: "valuasi-bisnis",
    label: "Valuasi MAPPI Bisnis",
    path: "/valuasi",
    icon: Building,
  },
  {
    id: "framework-konsultasi",
    label: "100 Framework",
    path: "/100-framework",
    icon: Grid2X2,
  },
];

export function Tools100Section({
  page,
  favorites,
  toggleFavorite,
  setActiveFolder,
  getGradient,
  FolderTile,
}: Tools100SectionProps) {
  // Main level tabs at the top: "tahapan", "tools", or "all"
  const [mainTab, setMainTab] = useState<"all" | "tahapan" | "tools">("tahapan");
  // Sub-domain filter when inside "tools" tab
  const [selectedDomain, setSelectedDomain] = useState<ToolDomainId>("all");
  // Specific category in the left column: "all" or specific category id
  const [activeSpecific, setActiveSpecific] = useState<string>("all");

  // Map all tools into a lookup dictionary by path
  const allToolsLookup = useMemo(() => {
    const lookup = new Map<string, NavItem>();
    page.subCategories.forEach((sub) => {
      sub.rawItems.forEach((item) => {
        lookup.set(item.to, item);
      });
    });
    // Ensure all items from navKonsultan are also mapped
    navKonsultan.forEach((group) => {
      group.items.forEach((item) => {
        if (!lookup.has(item.to)) {
          lookup.set(item.to, item);
        }
      });
    });
    return lookup;
  }, [page.subCategories]);

  // Counts calculation
  const tahapanTotalCount = TAHAPAN_MODULES.length; // 2 modules: Valuasi MAPPI Bisnis & 100 Framework
  const toolsTotalCount = useMemo(() => {
    return DETAILED_TOOL_CATEGORIES.reduce((acc, cat) => acc + cat.itemPaths.length, 0);
  }, []);
  const allTotalCount = tahapanTotalCount + toolsTotalCount;

  const getDomainCount = (domainId: ToolDomainId) => {
    if (domainId === "all") return toolsTotalCount;
    return DETAILED_TOOL_CATEGORIES
      .filter((c) => c.domain === domainId)
      .reduce((acc, cat) => acc + cat.itemPaths.length, 0);
  };

  // Categories visible in the left sidebar based on selected domain
  const visibleCategories = useMemo(() => {
    if (selectedDomain === "all") return DETAILED_TOOL_CATEGORIES;
    return DETAILED_TOOL_CATEGORIES.filter((c) => c.domain === selectedDomain);
  }, [selectedDomain]);

  const activeToolsDomainCount = useMemo(() => {
    return visibleCategories.reduce((acc, cat) => acc + cat.itemPaths.length, 0);
  }, [visibleCategories]);

  // Build items list according to tab, domain, and specific category
  const displayedItems = useMemo(() => {
    const items: LauncherItem[] = [];
    const seenPaths = new Set<string>();

    const pushApp = (item: NavItem) => {
      if (!seenPaths.has(item.to)) {
        seenPaths.add(item.to);
        items.push({ type: "app", item });
      }
    };

    if (mainTab === "tahapan") {
      if (activeSpecific === "all" || activeSpecific === "valuasi-bisnis") {
        const item = allToolsLookup.get("/valuasi") || {
          to: "/valuasi",
          label: "Valuasi MAPPI Bisnis",
          icon: Building,
        };
        pushApp({ ...item, label: "Valuasi MAPPI Bisnis" });
      }
      if (activeSpecific === "all" || activeSpecific === "framework-konsultasi") {
        const item = allToolsLookup.get("/100-framework") || {
          to: "/100-framework",
          label: "100 Framework",
          icon: Grid2X2,
        };
        pushApp({ ...item, label: "100 Framework" });
      }
      return items;
    }

    if (mainTab === "tools") {
      const relevantCats = activeSpecific === "all"
        ? visibleCategories
        : visibleCategories.filter((c) => c.id === activeSpecific);

      relevantCats.forEach((cat) => {
        cat.itemPaths.forEach((path) => {
          const item = allToolsLookup.get(path);
          if (item) {
            pushApp(item);
          }
        });
      });
      return items;
    }

    // mainTab === "all"
    if (activeSpecific === "all" || activeSpecific === "valuasi-bisnis") {
      const valItem = allToolsLookup.get("/valuasi") || {
        to: "/valuasi",
        label: "Valuasi MAPPI Bisnis",
        icon: Building,
      };
      pushApp({ ...valItem, label: "Valuasi MAPPI Bisnis" });
    }
    if (activeSpecific === "all" || activeSpecific === "framework-konsultasi") {
      const fwItem = allToolsLookup.get("/100-framework") || {
        to: "/100-framework",
        label: "100 Framework",
        icon: Grid2X2,
      };
      pushApp({ ...fwItem, label: "100 Framework" });
    }

    if (activeSpecific === "all") {
      DETAILED_TOOL_CATEGORIES.forEach((cat) => {
        cat.itemPaths.forEach((path) => {
          const item = allToolsLookup.get(path);
          if (item) {
            pushApp(item);
          }
        });
      });
    } else if (activeSpecific !== "valuasi-bisnis" && activeSpecific !== "framework-konsultasi") {
      const cat = DETAILED_TOOL_CATEGORIES.find((c) => c.id === activeSpecific);
      if (cat) {
        cat.itemPaths.forEach((path) => {
          const item = allToolsLookup.get(path);
          if (item) {
            pushApp(item);
          }
        });
      }
    }

    return items;
  }, [mainTab, activeSpecific, visibleCategories, allToolsLookup]);

  const activeCategoryTitle = useMemo(() => {
    if (activeSpecific === "all") return null;
    const tahapMod = TAHAPAN_MODULES.find((m) => m.id === activeSpecific);
    if (tahapMod) return tahapMod.label;
    const toolCat = DETAILED_TOOL_CATEGORIES.find((c) => c.id === activeSpecific);
    return toolCat ? toolCat.title : null;
  }, [activeSpecific]);

  const activeDomainLabel = useMemo(() => {
    if (selectedDomain === "all") return null;
    const domain = TOOL_DOMAINS.find((d) => d.id === selectedDomain);
    return domain ? domain.label : null;
  }, [selectedDomain]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Description */}
      <div className="text-center mb-[calc(1.5rem+10pt)]">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2">
          <span>
            <span className="font-normal">mini</span>{" "}
            M<span className="font-normal">.</span>B<span className="font-normal">.</span>A<span className="font-normal">.</span>
          </span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-[calc(0.25rem+10pt)] max-w-xl mx-auto">
          Small Package. Bigger Perspective.
        </p>
      </div>

      {/* KATEGORI DI ATAS (Main Level Pills: Semua, Tahapan, Tools) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full mb-4">
        {/* Semua Pill */}
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
            {allTotalCount}
          </span>
        </button>

        {/* Tahapan Pill */}
        <button
          onClick={() => {
            setMainTab("tahapan");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "tahapan"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Milestone className="size-4 shrink-0" />
          <span>Tahapan</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "tahapan"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {tahapanTotalCount}
          </span>
        </button>

        {/* Tools Pill */}
        <button
          onClick={() => {
            setMainTab("tools");
            setActiveSpecific("all");
          }}
          className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            mainTab === "tools"
              ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
          }`}
        >
          <Wrench className="size-4 shrink-0" />
          <span>Tools</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              mainTab === "tools"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {toolsTotalCount}
          </span>
        </button>
      </div>

      {/* Domain Sub-filter (when in Tools tab) */}
      {mainTab === "tools" && (
        <div className="flex flex-wrap items-center justify-center gap-2 w-full mb-[calc(1.5rem+10pt)]">
          {TOOL_DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isActive = selectedDomain === domain.id;
            const count = getDomainCount(domain.id);
            return (
              <button
                key={domain.id}
                onClick={() => {
                  setSelectedDomain(domain.id);
                  setActiveSpecific("all");
                }}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-primary/90 text-primary-foreground shadow-sm font-semibold scale-105"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5 shrink-0" />
                <span>{domain.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
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
      )}

      {mainTab !== "tools" && <div className="mb-[calc(1.5rem+10pt)]" />}

      {/* 12-Column Container: 3 columns on the left (Pills pendek), 9 columns on the right (9 menu app icons per baris) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1640px] mx-auto w-full mb-[10pt] items-start">
        
        {/* LEFT: 3 Columns Space - Ukuran Layout Kategori Dikecilkan 5% agar ada margin lega di kiri & kanan */}
        <div className="xl:col-span-3 w-full flex flex-col items-center xl:items-start">
          <div 
            className="w-[95%] max-w-[95%] mx-auto flex flex-col gap-1.5 max-h-[720px] overflow-y-auto px-1.5 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* TAHAPAN TAB LEFT SIDEBAR */}
            {mainTab === "tahapan" && (
              <>
                <button
                  onClick={() => setActiveSpecific("all")}
                  className={`w-full text-left px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                    activeSpecific === "all"
                      ? "bg-primary text-primary-foreground shadow-sm font-semibold scale-[1.01]"
                      : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Milestone className="size-3.5 shrink-0" />
                    <span className="truncate">Semua Tahapan</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                      activeSpecific === "all"
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background/80 text-muted-foreground"
                    }`}
                  >
                    {tahapanTotalCount}
                  </span>
                </button>

                {TAHAPAN_MODULES.map((mod) => {
                  const Icon = mod.icon;
                  const isActive = activeSpecific === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setActiveSpecific(mod.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm font-semibold scale-[1.01]"
                          : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="size-3.5 shrink-0" />
                        <span className="truncate">{mod.label}</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-background/80 text-muted-foreground"
                        }`}
                      >
                        1
                      </span>
                    </button>
                  );
                })}
              </>
            )}

            {/* TOOLS TAB LEFT SIDEBAR */}
            {mainTab === "tools" && (
              <>
                <button
                  onClick={() => setActiveSpecific("all")}
                  className={`w-full text-left px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                    activeSpecific === "all"
                      ? "bg-primary text-primary-foreground shadow-sm font-semibold scale-[1.01]"
                      : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Wrench className="size-3.5 shrink-0" />
                    <span className="truncate">Semua Tools</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                      activeSpecific === "all"
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background/80 text-muted-foreground"
                    }`}
                  >
                    {activeToolsDomainCount}
                  </span>
                </button>

                {visibleCategories.map((cat) => {
                  const Icon = cat.icon;
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
                        {cat.itemPaths.length}
                      </span>
                    </button>
                  );
                })}
              </>
            )}

            {/* ALL TAB LEFT SIDEBAR */}
            {mainTab === "all" && (
              <>
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
                    <span className="truncate">Semua Katalog</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                      activeSpecific === "all"
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background/80 text-muted-foreground"
                    }`}
                  >
                    {allTotalCount}
                  </span>
                </button>

                {/* Tahapan modules in All */}
                {TAHAPAN_MODULES.map((mod) => {
                  const Icon = mod.icon;
                  const isActive = activeSpecific === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setActiveSpecific(mod.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm font-semibold scale-[1.01]"
                          : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="size-3.5 shrink-0" />
                        <span className="truncate">{mod.label}</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-background/80 text-muted-foreground"
                        }`}
                      >
                        1
                      </span>
                    </button>
                  );
                })}

                {/* All 37 Tool Categories */}
                {DETAILED_TOOL_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
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
                        {cat.itemPaths.length}
                      </span>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* RIGHT: 9 Columns Grid for Apps (Tepat 9 apps mendatar per baris on xl!) */}
        <div className="xl:col-span-9 w-full flex flex-col gap-4">
          {/* Breadcrumb / Active Category Path */}
          <div className="flex items-center justify-between px-1 py-1 text-xs border-b border-border/40 pb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-foreground/90">
                {mainTab === "tools" ? "Tools" : mainTab === "tahapan" ? "Tahapan" : "Semua"}
              </span>
              {mainTab === "tools" && activeDomainLabel && (
                <>
                  <span className="text-muted-foreground/60">/</span>
                  <span className="text-muted-foreground font-medium">{activeDomainLabel}</span>
                </>
              )}
              {activeCategoryTitle && (
                <>
                  <span className="text-muted-foreground/60">/</span>
                  <span className="font-medium text-primary">
                    {activeCategoryTitle}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-muted-foreground font-medium">
                {displayedItems.length} modul
              </span>
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
                      className={`w-12 h-12 sm:w-13 sm:h-13 xl:w-14 xl:h-14 rounded-[1.25rem] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-110 group-active:scale-95 ${gradient} relative`}
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
                        className={`absolute -top-1.5 -right-1.5 p-1.5 rounded-full bg-background border shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 scale-90 hover:scale-110 ${
                          isFav ? "opacity-100" : ""
                        }`}
                        aria-label="Favorit"
                      >
                        <Star
                          className={`size-3 sm:size-3.5 transition-colors ${
                            isFav
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>
                    <span className="text-[11px] sm:text-xs text-foreground/90 font-medium text-center line-clamp-2 leading-tight px-0.5 group-hover:text-foreground">
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
