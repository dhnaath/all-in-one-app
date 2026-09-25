import { AppDock } from "./shell/app-dock";
import { ShellSidebarProvider } from "./shell-sidebar";
import { ShellHeaderProvider } from "./shell-header";
import {
  ShellSectionsProvider,
  type ShellSection,
} from "./shell-sections";
import { STANDALONE_APPS } from "@/features/standalone/standaloneAppsData";
import { TypewriterSearchText } from "./shell/TypewriterSearchText";
import { AnimatedSearchIcon } from "./shell/AnimatedSearchIcon";
import { useState, useEffect, useMemo, useRef, useCallback, useLayoutEffect } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  PanelLeft,
  PanelRight,
  LayoutDashboard,
  Terminal,
  Users,
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Sparkles,
  NotebookText,
  CalendarDays,
  Compass,
  Gauge,
  MessagesSquare,
  CalendarClock,
  FolderOpen,
  Activity,
  LineChart,
  AlertTriangle,
  FileText,
  Shield,
  Calculator,
  HeartHandshake,
  Navigation,
  Building,
  TrendingUp,
  Package,
  Grid2X2,
  Plus,
  MoreHorizontal,
  Star,
  User,
  Settings,
  Wallet,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Droplet,
  Timer,
  Briefcase,
  Target,
  BookOpen,
  Bookmark,
  Lightbulb,
  Eye,
  Key,
  Dumbbell,
  Utensils,
  Music,
  CloudSun,
  Book,
  Plane,
  ShoppingCart,
  Heart,
  HeartPulse,
  Archive,
  GraduationCap,
  Layers,
  FileCheck,
  Globe,
  Film,
  Gamepad2,
  Podcast,
  Ticket,
  PenTool,
  Camera,
  Type,
  Code,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Building2,
  Sprout,
  Search,
  Bell,
  Coins,
  MessageCircle,
  Truck,
  Store,
  Home,
  Crown,
  Sofa,
  ScrollText,
  Binary,
  Info,
  Workflow,
  X,
  Car,
  ShieldAlert,
  FileCode2,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/features/finance/hooks/useLanguage";
import type { ReactNode } from "react";

import { ThemeLangToggle } from "@/app/theme-lang-toggle";
import { CommandPalette } from "@/app/CommandPalette";
import { QuickCaptureModal } from "@/app/QuickCaptureModal";
import { ShortcutModal } from "@/app/ShortcutModal";
import { TerminalModal } from "@/app/TerminalModal";
import { RecentModal } from "@/app/RecentModal";
import { TaskbarModal } from "@/app/TaskbarModal";
import { useRecentApps } from "@/hooks/useRecentApps";
import { ProfileMenu, SettingsModal } from "./wira-settings";
import { useMenuSettings } from "@/hooks/useMenuSettings";
import { useFavorites } from "@/hooks/useFavorites";
import { HeaderNavControls } from "./HeaderNavControls";
import { DynamicAppSidebar } from "./DynamicAppSidebar";
import { useCustomNav } from "@/hooks/useCustomNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { navKonsultan, navSidebar21, navAllSidebar, type NavItem, type NavGroup as NavGroupType } from "@/config/nav";

function NavGroup({ title, items }: { title: string; items: any[] }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActiveGroup = items.some((item) => {
    if (item.to === "/" || item.to === "/portal") {
      return pathname === item.to;
    }
    return pathname.startsWith(item.to);
  });

  return (
    <div
      className={`mb-4 last:mb-0 rounded-xl transition-all ${isActiveGroup ? "py-2.5 nav-gooey-active shadow-[-4px_0_12px_rgba(0,0,0,0.02)]" : "py-1"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between pr-3 pl-[22px] py-1.5 text-sm font-bold tracking-wider text-muted-foreground/70 transition-colors hover:text-foreground"
      >
        <span className={isActiveGroup ? "text-foreground" : ""}>{title}</span>
        {isOpen ? (
          <ChevronDown className={`size-3 ${isActiveGroup ? "text-foreground" : ""}`} />
        ) : (
          <ChevronRight className="size-3" />
        )}
      </button>
      {isOpen && (
        <div className="mt-1 flex flex-col gap-0.5">
          {items.map((item) => {
            const toPath = item.to.split("?")[0];
            const toSearch = item.to.includes("?")
              ? Object.fromEntries(new URLSearchParams(item.to.split("?")[1]))
              : undefined;
            return (
              <Link
                key={item.to}
                to={toPath}
                search={toSearch as any}
                activeOptions={{ exact: item.to === "/" || item.to === "/portal" || item.to.includes("?") }}
                className="flex items-center gap-2.5 rounded-lg pl-[27px] pr-3 py-2 text-sm font-medium text-muted-foreground/70 transition-colors hover:text-foreground relative"
                activeProps={{ className: "text-foreground font-bold" }}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export type AppModeId = "personal" | "household" | "relatives" | "employment" | "owner" | "public";

export interface ModeItem {
  id: AppModeId;
  label: string;
  badge: string;
  desc: string;
  icon: LucideIcon;
  badgeClass: string;
  links: { to: string; label: string; icon: LucideIcon }[];
}

export const APP_MODES: ModeItem[] = [
  {
    id: "personal",
    label: "Personal",
    badge: "Self",
    desc: "Keseharian, Catatan & Habit",
    icon: User,
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    links: [
      { to: "/habits", label: "Habit & Rutinitas", icon: Activity },
      { to: "/catatan", label: "Catatan & Ide", icon: NotebookText },
      { to: "/journal", label: "Journal Harian", icon: BookOpen },
      { to: "/goals", label: "Target & Resolusi", icon: Target },
      { to: "/health", label: "Kebugaran & Vitalitas", icon: HeartPulse },
    ],
  },
  {
    id: "household",
    label: "Household",
    badge: "Living",
    desc: "Domestik & Manajemen Rumah",
    icon: Sofa,
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    links: [
      { to: "/budget", label: "Anggaran Rumah Tangga", icon: Wallet },
      { to: "/shopping", label: "Daftar Belanja", icon: ShoppingCart },
      { to: "/inventory", label: "Inventaris Perabot", icon: Archive },
      { to: "/recipes", label: "Resep Masakan", icon: Utensils },
      { to: "/kalender", label: "Kalender & Jadwal", icon: CalendarDays },
    ],
  },
  {
    id: "relatives",
    label: "Relatives",
    badge: "Family",
    desc: "Keluarga Besar & Silaturahmi",
    icon: Users,
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    links: [
      { to: "/contacts", label: "Kontak Keluarga & Kerabat", icon: Users },
      { to: "/events", label: "Acara & Pertemuan Keluarga", icon: Ticket },
      { to: "/kalender", label: "Kalender & Ulang Tahun", icon: CalendarDays },
      { to: "/catatan", label: "Catatan & Silsilah", icon: NotebookText },
      { to: "/zakat", label: "Zakat & Donasi Kerabat", icon: HeartHandshake },
    ],
  },
  {
    id: "employment",
    label: "Employment",
    badge: "Career",
    desc: "Pekerjaan, Tugas & Proyek",
    icon: Briefcase,
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    links: [
      { to: "/proyek-personal", label: "Personal Projects", icon: FolderKanban },
      { to: "/proyek", label: "Project Manager", icon: Briefcase },
      { to: "/task-manager", label: "Task Manager", icon: CheckSquare },
      { to: "/kalender", label: "Calendar", icon: CalendarDays },
      { to: "/pomodoro", label: "Focus Timer", icon: Timer },
    ],
  },
  {
    id: "owner",
    label: "Owner",
    badge: "Equity",
    desc: "Kepemilikan Bisnis & Portofolio",
    icon: Crown,
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    links: [
      { to: "/asset", label: "Kuadran Aset & Ekuitas", icon: Briefcase },
      { to: "/valuasi", label: "Valuasi Perusahaan (MAPPI)", icon: Building },
      { to: "/finances", label: "Keuangan & Dividen", icon: DollarSign },
      { to: "/reports", label: "Laporan Khusus Pemilik", icon: NotebookText },
    ],
  },
  {
    id: "public",
    label: "Public",
    badge: "External",
    desc: "Ranah Publik & Dinamika Luar",
    icon: Globe,
    badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    links: [
      { to: "/outward", label: "Outward Radar", icon: Compass },
      { to: "/outlook", label: "Outlook Dinamika", icon: TrendingUp },
      { to: "/weather", label: "Cuaca & Iklim Global", icon: CloudSun },
      { to: "/100-komoditas", label: "100 Komoditas Pasar", icon: Package },
      { to: "/incoterms", label: "Panduan Incoterms & Ekspor", icon: Navigation },
    ],
  },
];

const CATEGORY_META: Record<string, { icon: LucideIcon; accent: string }> = {
  // Super Categories
  "21 Kategori": { icon: LayoutGrid, accent: "text-primary" },
  "100 Framework": { icon: Grid2X2, accent: "text-purple-600 dark:text-purple-400" },
  "Keuangan & Pasar": { icon: Wallet, accent: "text-emerald-600 dark:text-emerald-400" },
  "Kesehatan & Personal": { icon: Heart, accent: "text-rose-600 dark:text-rose-400" },
  "Kreatif & Akademi": { icon: PenTool, accent: "text-pink-600 dark:text-pink-400" },
  "Knowledge & Bisnis": { icon: BookOpen, accent: "text-sky-600 dark:text-sky-400" },

  // The 21 Categories
  "Dapur dan Bahan Makanan": { icon: Utensils, accent: "text-orange-500 dark:text-orange-400" },
  "Pemeliharaan Rumah dan Utilitas": { icon: Home, accent: "text-amber-600 dark:text-amber-400" },
  "Kendaraan dan Otomotif": { icon: Car, accent: "text-blue-600 dark:text-blue-400" },
  "Perjalanan": { icon: Plane, accent: "text-teal-600 dark:text-teal-400" },
  "Keluarga dan Internal Rumah": { icon: Heart, accent: "text-pink-600 dark:text-pink-400" },
  "Relasi Jejaring dan Profesional": { icon: Users, accent: "text-indigo-600 dark:text-indigo-400" },
  "Lingkungan Komunitas Warga": { icon: Building2, accent: "text-emerald-600 dark:text-emerald-400" },
  "Sosial dan Keagamaan": { icon: HeartHandshake, accent: "text-green-600 dark:text-green-400" },
  "Keselamatan dan Darurat": { icon: ShieldAlert, accent: "text-rose-600 dark:text-rose-400" },
  "Perencanaan Alur Kerja Proyek": { icon: FolderKanban, accent: "text-purple-600 dark:text-purple-400" },
  "Pelaksanaan Tugas dan Karya": { icon: CheckSquare, accent: "text-sky-600 dark:text-sky-400" },
  "Jadwal dan Kalender": { icon: CalendarDays, accent: "text-blue-500 dark:text-blue-400" },
  "Fokus dan Kebiasaan": { icon: Timer, accent: "text-yellow-600 dark:text-yellow-400" },
  "Rapat dan Kolaborasi Tim": { icon: MessagesSquare, accent: "text-violet-600 dark:text-violet-400" },
  "Manajemen Sumber Daya Manusia": { icon: Users, accent: "text-cyan-600 dark:text-cyan-400" },
  "Dokumentasi dan Wiki": { icon: BookOpen, accent: "text-emerald-500 dark:text-emerald-400" },
  "Pengelolaan Form dan Template": { icon: FileCode2, accent: "text-indigo-500 dark:text-indigo-400" },
  "Keuangan dan Aset": { icon: Wallet, accent: "text-emerald-600 dark:text-emerald-400" },
  "Vendor dan Logistik Kantor": { icon: Truck, accent: "text-amber-500 dark:text-amber-400" },
  "Target dan Performa": { icon: Target, accent: "text-rose-500 dark:text-rose-400" },
  "Utilitas Sistem": { icon: Settings, accent: "text-slate-500 dark:text-slate-400" },

  // Legacy Domain Categories
  Finance: { icon: Wallet, accent: "text-emerald-600 dark:text-emerald-400" },
  "Phase Side": { icon: Compass, accent: "text-indigo-600 dark:text-indigo-400" },
  "100 Tools": { icon: Grid2X2, accent: "text-purple-600 dark:text-purple-400" },
  Productivity: { icon: CheckSquare, accent: "text-blue-600 dark:text-blue-400" },
  Personal: { icon: User, accent: "text-rose-600 dark:text-rose-400" },
  Society: { icon: Users, accent: "text-amber-600 dark:text-amber-400" },
  "Creative & Media": { icon: PenTool, accent: "text-pink-600 dark:text-pink-400" },
  "Academy & Tools": { icon: GraduationCap, accent: "text-sky-600 dark:text-sky-400" },
};

const SUPER_CATEGORIES = [
  { id: "All", label: "Semua", icon: LayoutDashboard },
  { id: "21 Kategori", label: "21 Kategori", icon: LayoutGrid },
  { id: "100 Framework", label: "100 Framework", icon: Grid2X2 },
  { id: "Keuangan & Pasar", label: "Keuangan & Pasar", icon: Wallet },
  { id: "Kesehatan & Personal", label: "Kesehatan & Personal", icon: Heart },
  { id: "Kreatif & Akademi", label: "Kreatif & Akademi", icon: PenTool },
  { id: "Knowledge & Bisnis", label: "Knowledge & Bisnis", icon: BookOpen },
];

const SECTION_TITLES: Record<string, string> = {
  "21 Kategori": "21 Kategori Ruang Kerja & Kehidupan",
  "100 Framework": "Framework Strategis (100 Tools)",
  "Keuangan & Pasar": "Perencanaan Keuangan, Pasar & Muamalah",
  "Kesehatan & Personal": "Kesehatan & Gaya Hidup Pribadi",
  "Kreatif & Akademi": "Media Kreatif & Akademi Pembelajaran",
  "Knowledge & Bisnis": "Knowledge & Bisnis Lanjutan",
};

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const location = useRouterState({ select: (s) => s.location });
  const navigate = useNavigate();
  const pathname = location.pathname;
  const fullPath = pathname + (location.searchStr || "");
  const rawNav = navKonsultan;
  const { enabledMenus } = useMenuSettings();
  const { findItemById, findItemByPath } = useCustomNav();

  const searchParams = new URLSearchParams(location.searchStr || "");
  const customIdParam = searchParams.get("id");
  const customMatch = customIdParam
    ? findItemById(customIdParam)
    : findItemByPath(fullPath);

  // ---------------------------------------------------------------------------
  // CONTEXT RESOLUTION — determine which nav group / parent-category the route
  // that is currently open belongs to. This drives BOTH the left sidebar scope
  // and the header's context pill so the shell adapts to the active app.
  // ---------------------------------------------------------------------------
  const contextMatch: { item: NavItem; group: NavGroupType } | null = (() => {
    const sidebarAll: { item: NavItem; group: NavGroupType }[] = [];
    navAllSidebar.forEach((g) => g.items.forEach((item) => sidebarAll.push({ item, group: g })));
    const sMatch = (
      sidebarAll.find((x) => x.item.to === fullPath) ||
      sidebarAll.find((x) => x.item.to === pathname) ||
      sidebarAll.find((x) => x.item.to !== "/" && x.item.to.split("?")[0] === pathname) ||
      sidebarAll.find((x) => {
        const base = x.item.to.split("?")[0];
        return base !== "/" && pathname.startsWith(base);
      }) ||
      null
    );
    if (sMatch) return sMatch;

    const all: { item: NavItem; group: NavGroupType }[] = [];
    rawNav.forEach((g) => g.items.forEach((item) => all.push({ item, group: g })));
    return (
      all.find((x) => x.item.to === fullPath) ||
      all.find((x) => x.item.to === pathname) ||
      all.find((x) => x.item.to !== "/" && x.item.to.split("?")[0] === pathname) ||
      all.find((x) => {
        const base = x.item.to.split("?")[0];
        return base !== "/" && pathname.startsWith(base);
      }) ||
      null
    );
  })();

  const contextCategory =
    pathname === "/" ? null : contextMatch?.group.title || contextMatch?.group.sectionCategory || contextMatch?.group.parentCategory || null;
  const ContextCategoryIcon = contextCategory
    ? CATEGORY_META[contextCategory]?.icon
    : null;

  // Standalone mini-app config for the current route, so the fallback sidebar
  // can surface that app's own tabs as per-app navigation.
  const appQueryParam = searchParams.get("app");
  const pathSlug = pathname.replace(/^\//, "");
  const standaloneConfig =
    STANDALONE_APPS[appQueryParam || ""] || STANDALONE_APPS[pathSlug] || null;

  // Category currently browsed in the left sidebar. Default to "All".
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const isAppRoute = pathname !== "/";
  const [hasAppSidebar, setHasAppSidebar] = useState(false);
  const [sidebarView, setSidebarView] = useState<"auto" | "browse">("auto");
  useEffect(() => {
    setSidebarView("auto");
  }, [pathname]);

  const showAppCustomPortal = isAppRoute && hasAppSidebar && sidebarView === "auto";
  const showDynamicAppFeatures = isAppRoute && !hasAppSidebar && sidebarView === "auto";
  const showDefaultNav = !isAppRoute || sidebarView === "browse";
  const showAppSidebar = showAppCustomPortal;
  const shellSidebarCtx = useMemo(() => ({ setHasAppSidebar }), []);

  // Whether the currently-open app registered its own header via <ShellHeader>.
  const [hasAppHeader, setHasAppHeader] = useState(false);
  const shellHeaderCtx = useMemo(() => ({ setHasAppHeader }), []);

  // Sections published by the open app via useShellSections(). Kept in a ref so
  // click handlers are never stale; `bump` forces a re-render when they change.
  // These drive BOTH the sidebar "Di aplikasi ini" list and the header's row of
  // up to 5 interactive buttons (the header is an elaboration of the sidebar).
  const sectionsRef = useRef<ShellSection[]>([]);
  const [, setSectionsVersion] = useState(0);
  const bumpSections = useCallback(() => setSectionsVersion((v) => v + 1), []);
  const shellSectionsCtx = useMemo(
    () => ({ sectionsRef, bump: bumpSections }),
    [bumpSections],
  );

  // The section list to surface. Priority: app-registered sections, then a
  // standalone mini-app's own tabs (deep-linked via ?tab=). Empty otherwise.
  const registeredSections = sectionsRef.current;
  const effectiveSections: ShellSection[] = useMemo(() => {
    if (registeredSections.length > 0) return registeredSections;
    if (standaloneConfig) {
      const currentTab = searchParams.get("tab") || "all";
      const baseSearch = Object.fromEntries(searchParams.entries());
      return standaloneConfig.tabs.map((tab) => ({
        id: tab.id,
        label: tab.label,
        active: currentTab === tab.id,
        onSelect: () =>
          navigate({
            to: pathname,
            search: { ...baseSearch, tab: tab.id } as any,
          }),
      }));
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registeredSections, standaloneConfig, location.searchStr, pathname]);
  const headerSections = effectiveSections.slice(0, 5);

  // Measure the (variable-height) contextual header so the scrollable content
  // always starts exactly below it.
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(64);
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setHeaderHeight(el.offsetHeight || 64);
    update();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [hasAppHeader, pathname]);

  const primaryItems = [
    { to: "/", label: "Launcher", icon: LayoutDashboard },
    { to: "/terminal", label: "Terminal", icon: Terminal },
  ].filter((it) => enabledMenus[it.to] !== false);

  // Groups rendered in the left sidebar, covering 21 categories AND all other categories.
  const sidebarGroups: NavGroupType[] = navAllSidebar
    .filter((g) => {
      if (activeCategory === "All") return true;
      if (g.sectionCategory === activeCategory) return true;
      if (g.parentCategory === activeCategory) return true;
      if (g.title === activeCategory) return true;
      return false;
    })
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => enabledMenus[it.to] !== false),
    }))
    .filter((g) => g.items.length > 0);

  let categoryName = "Umum";
  let categoryGroup: { title?: string; items?: readonly any[] | any[] } | undefined = navSidebar21[0];

  if (pathname === "/") {
    categoryName = "Umum";
    categoryGroup = undefined;
  } else if (contextMatch) {
    categoryName = contextMatch.group.title || "Umum";
    categoryGroup = contextMatch.group;
  } else if (customMatch && (pathname === "/lainnya" || customMatch.item.path === fullPath)) {
    categoryName = customMatch.category.title;
    categoryGroup = {
      title: customMatch.category.title,
      items: customMatch.category.items.map((i) => ({
        label: i.label,
        to: i.path,
      })),
    };
  } else {
    const exactItem = rawNav.flatMap((g) => g.items).find((i) => i.to === pathname);
    if (exactItem) {
      const foundGroup = rawNav.find((g) => g.items.includes(exactItem));
      if (foundGroup) {
        categoryName = foundGroup.title || "Umum";
        categoryGroup = foundGroup;
      }
    } else {
      const fallbackItem = rawNav
        .flatMap((g) => g.items)
        .find((i) => i.to !== "/" && pathname.startsWith(i.to));
      if (fallbackItem) {
        const foundGroup = rawNav.find((g) => g.items.includes(fallbackItem));
        if (foundGroup) {
          categoryName = foundGroup.title || "Umum";
          categoryGroup = foundGroup;
        }
      }
    }
  }

  // Both sidebars are now symmetric off-canvas drawers. On desktop the left
  // (contextual navigation) drawer starts open; on small screens both start
  // closed and slide over the content. Either can be hidden/shown at will.
  const [openDrawer, setOpenDrawer] = useState<"left" | "right" | null>(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(min-width: 1024px)").matches ? "left" : null;
    }
    return null;
  });
  const [collapsedNavGroups, setCollapsedNavGroups] = useState<Record<string, boolean>>({});
  const [currentMode, setCurrentMode] = useState<AppModeId>(() => {
    try {
      const saved = localStorage.getItem("client_os_active_mode");
      if (saved && ["personal", "household", "relatives", "employment", "owner", "public"].includes(saved)) {
        return saved as AppModeId;
      }
    } catch {}
    return "personal";
  });
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const activeModeConfig = APP_MODES.find((m) => m.id === currentMode) || APP_MODES[0];
  const ActiveModeIcon = activeModeConfig.icon;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const [activeSettingsTab, setActiveSettingsTab] = useState("general");
  const { favorites, toggleFavorite } = useFavorites();

  // Gabungan semua item nav (untuk rail Favorit gaya remake) — mempertahankan
  // label + ikon asli dari config navKonsultan beserta entri Launcher/Terminal.
  const allNavItems: { to: string; label: string; icon: LucideIcon }[] = [
    { to: "/", label: "Launcher", icon: LayoutDashboard },
    { to: "/terminal", label: "Terminal", icon: Terminal },
    ...navKonsultan.flatMap((g) => g.items as { to: string; label: string; icon: LucideIcon }[]),
  ];
  const favItems = favorites
    .map((route) => allNavItems.find((i) => i.to === route))
    .filter((x): x is { to: string; label: string; icon: LucideIcon } => !!x)
    .slice(0, 10);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const sidebarContainer = document.querySelector(
        "#sidenavLeft .overflow-y-auto",
      ) as HTMLElement | null;
      const activeElement = sidebarContainer?.querySelector(
        '[data-status="active"]',
      ) as HTMLElement | null;
      if (sidebarContainer && activeElement) {
        const containerRect = sidebarContainer.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();
        const scrollTop =
          sidebarContainer.scrollTop +
          (activeRect.top - containerRect.top) -
          containerRect.height / 2 +
          activeRect.height / 2;
        sidebarContainer.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    }, 150);

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname]);

  const { addRecentApp } = useRecentApps();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isShortcutOpen, setIsShortcutOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isExpandOpen, setIsExpandOpen] = useState(false);
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const [isTaskbarOpen, setIsTaskbarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-record visited navigation into Recent
  useEffect(() => {
    if (!pathname) return;
    const allNavFlat = navKonsultan.flatMap((g) => g.items);
    const match = allNavFlat.find(
      (i) => i.to === pathname || i.to.split("?")[0] === pathname
    );
    if (match) {
      addRecentApp({ to: match.to, label: match.label });
    } else if (pathname === "/") {
      addRecentApp({ to: "/", label: "Launcher Modul", category: "Navigasi" });
    } else if (pathname === "/home") {
      addRecentApp({ to: "/home", label: "Beranda Eksekutif", category: "Navigasi" });
    }
  }, [pathname, addRecentApp]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K, +, Esc) & custom dock events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (!isInput && e.key === "+") {
        e.preventDefault();
        setIsQuickCaptureOpen(true);
        setIsShortcutOpen(false);
        setIsTerminalOpen(false);
        setIsExpandOpen(false);
        setIsRecentOpen(false);
        setIsTaskbarOpen(false);
      } else if (e.key === "Escape") {
        setIsQuickCaptureOpen(false);
        setIsShortcutOpen(false);
        setIsTerminalOpen(false);
        setIsExpandOpen(false);
        setIsRecentOpen(false);
        setIsTaskbarOpen(false);
      }
    };

    const handleOpenQuickCapture = () => {
      setIsQuickCaptureOpen(true);
      setIsShortcutOpen(false);
      setIsTerminalOpen(false);
      setIsExpandOpen(false);
      setIsRecentOpen(false);
      setIsTaskbarOpen(false);
    };

    const handleOpenShortcut = () => {
      setIsShortcutOpen(true);
      setIsQuickCaptureOpen(false);
      setIsTerminalOpen(false);
      setIsExpandOpen(false);
      setIsRecentOpen(false);
      setIsTaskbarOpen(false);
    };

    const handleOpenTerminal = () => {
      setIsTerminalOpen(true);
      setIsQuickCaptureOpen(false);
      setIsShortcutOpen(false);
      setIsExpandOpen(false);
      setIsRecentOpen(false);
      setIsTaskbarOpen(false);
    };

    const handleOpenExpand = () => {
      setIsExpandOpen(true);
      setIsQuickCaptureOpen(false);
      setIsShortcutOpen(false);
      setIsTerminalOpen(false);
      setIsRecentOpen(false);
      setIsTaskbarOpen(false);
    };

    const handleOpenRecent = () => {
      setIsRecentOpen((prev) => !prev);
      setIsTaskbarOpen(false);
      setIsQuickCaptureOpen(false);
      setIsShortcutOpen(false);
      setIsTerminalOpen(false);
      setIsExpandOpen(false);
    };

    const handleOpenTaskbar = () => {
      setIsTaskbarOpen((prev) => !prev);
      setIsRecentOpen(false);
      setIsQuickCaptureOpen(false);
      setIsShortcutOpen(false);
      setIsTerminalOpen(false);
      setIsExpandOpen(false);
    };

    const handleOpenSearch = () => {
      setIsCommandPaletteOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("aio_open_quick_capture", handleOpenQuickCapture);
    window.addEventListener("aio_open_shortcut", handleOpenShortcut);
    window.addEventListener("aio_open_terminal", handleOpenTerminal);
    window.addEventListener("aio_open_expand", handleOpenExpand);
    window.addEventListener("aio_open_recent", handleOpenRecent);
    window.addEventListener("aio_open_taskbar", handleOpenTaskbar);
    window.addEventListener("aio_open_search", handleOpenSearch);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("aio_open_quick_capture", handleOpenQuickCapture);
      window.removeEventListener("aio_open_shortcut", handleOpenShortcut);
      window.removeEventListener("aio_open_terminal", handleOpenTerminal);
      window.removeEventListener("aio_open_expand", handleOpenExpand);
      window.removeEventListener("aio_open_recent", handleOpenRecent);
      window.removeEventListener("aio_open_taskbar", handleOpenTaskbar);
      window.removeEventListener("aio_open_search", handleOpenSearch);
    };
  }, []);

  const handleOpenSettings = (tab = "general") => {
    setActiveSettingsTab(tab);
    setIsSettingsOpen(true);
    setIsProfileOpen(false);
  };

  return (
    <ShellSidebarProvider value={shellSidebarCtx}>
    <ShellHeaderProvider value={shellHeaderCtx}>
    <ShellSectionsProvider value={shellSectionsCtx}>
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={activeSettingsTab}
      />

      <aside
        id="sidenavLeft"
        className={`fixed inset-y-0 left-0 z-50 flex w-[300px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out ${openDrawer === "left" ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand header (gaya remake) */}
        <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4 shrink-0">
          <div className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-white shadow-md shadow-indigo-500/25 shrink-0">
            <Grid2X2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight truncate text-sidebar-foreground">All in One</p>
            <p className="text-[11px] text-muted-foreground truncate">
              {contextCategory ? contextCategory : "Workspace Konsultan"}
            </p>
          </div>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors shrink-0"
            onClick={() => setOpenDrawer(null)}
            aria-label="Sembunyikan navigasi"
            title="Sembunyikan sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* View switcher: app-provided sidebar vs browse/navigation */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-sidebar-border shrink-0">
          <button
            type="button"
            onClick={() => setSidebarView("auto")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${
              sidebarView === "auto"
                ? "bg-primary/15 text-primary shadow-2xs font-bold"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>{pathname === "/" ? "Launcher" : "Fitur App"}</span>
          </button>
          <button
            type="button"
            onClick={() => setSidebarView("browse")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${
              sidebarView === "browse"
                ? "bg-primary/15 text-primary shadow-2xs font-bold"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
            <span>Navigasi</span>
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 py-4">
          {/* Slot untuk konten sidebar milik app (target portal ShellSidebar) */}
          <div
            id="shellSidebarSlot"
            className={showAppCustomPortal ? "flex flex-col gap-1" : "hidden"}
          />

          {/* Dynamic App Feature Sidebar for apps without custom ShellSidebar */}
          {showDynamicAppFeatures && (
            <DynamicAppSidebar
              currentTitle={title}
              pathname={pathname}
              fullPath={fullPath}
              contextMatch={contextMatch}
              contextCategory={contextCategory}
              effectiveSections={effectiveSections}
              standaloneConfig={standaloneConfig}
              isFavorite={favorites.includes(fullPath) || favorites.includes(pathname)}
              onToggleFavorite={() => toggleFavorite(fullPath)}
              onCloseDrawer={() => setOpenDrawer(null)}
              onSwitchToBrowse={() => setSidebarView("browse")}
            />
          )}

          {showDefaultNav && (
            <>
          {/* Per-app contextual block: the open app's OWN sections/tabs when it
              registered them (or a standalone app's tabs); otherwise the family
              menu of sibling items in the same nav group. */}
          {pathname !== "/" && (effectiveSections.length > 0 || contextMatch) && (
            <div className="mb-4">
              <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Di aplikasi ini
              </p>
              <div className="flex flex-col gap-0.5">
                {effectiveSections.length > 0
                  ? effectiveSections.map((sec) => {
                      const SecIcon = sec.icon;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => {
                            sec.onSelect();
                            setOpenDrawer(null);
                          }}
                          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] text-left transition-colors ${
                            sec.active
                              ? "bg-primary/15 text-primary font-medium"
                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                          }`}
                        >
                          {SecIcon ? (
                            <SecIcon className="h-4 w-4 shrink-0" />
                          ) : (
                            <span className="h-4 w-4 shrink-0 rounded-full border border-current opacity-40" />
                          )}
                          <span className="truncate">{sec.label}</span>
                        </button>
                      );
                    })
                  : contextMatch!.group.items.slice(0, 10).map((item) => {
                      const toPath = item.to.split("?")[0];
                      const toSearch = item.to.includes("?")
                        ? Object.fromEntries(
                            new URLSearchParams(item.to.split("?")[1]),
                          )
                        : undefined;
                      return (
                        <Link
                          key={item.to}
                          to={toPath}
                          search={toSearch as any}
                          activeOptions={{
                            exact:
                              item.to === "/" ||
                              item.to === "/portal" ||
                              item.to.includes("?"),
                          }}
                          onClick={() => setOpenDrawer(null)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
                          activeProps={{
                            className: "bg-primary/15 text-primary font-medium",
                          }}
                        >
                          {item.icon ? (
                            <item.icon className="h-4 w-4 shrink-0" />
                          ) : (
                            <span className="h-4 w-4 shrink-0" />
                          )}
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
              </div>
            </div>
          )}

          {/* Category switcher — follows the open app's context, user can override */}
          <div className="mb-4">
            <div className="flex items-center justify-between px-2.5 pb-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Kategori
              </p>
              {activeCategory !== "All" && (
                <button
                  type="button"
                  onClick={() => setActiveCategory("All")}
                  className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                >
                  Lihat Semua
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-1 pb-1">
              {SUPER_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-medium border transition-colors ${
                      isActive
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rail Favorit (gaya remake) */}
          {favItems.length > 0 && (
            <div className="mb-4">
              <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Favorit
              </p>
              <div className="flex flex-col gap-0.5">
                {favItems.map((item) => {
                  const toPath = item.to.split("?")[0];
                  const toSearch = item.to.includes("?")
                    ? Object.fromEntries(new URLSearchParams(item.to.split("?")[1]))
                    : undefined;
                  return (
                    <Link
                      key={`fav-${item.to}`}
                      to={toPath}
                      search={toSearch as any}
                      activeOptions={{ exact: item.to === "/" || item.to === "/portal" || item.to.includes("?") }}
                      onClick={() => setOpenDrawer(null)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
                      activeProps={{ className: "bg-primary/15 text-primary font-medium" }}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Primary shortcuts (Launcher / Terminal) */}
          {primaryItems.length > 0 && (
            <div className="mb-2 flex flex-col gap-0.5">
              {primaryItems.map((item) => (
                <Link
                  key={`primary-${item.to}`}
                  to={item.to}
                  activeOptions={{ exact: true }}
                  onClick={() => setOpenDrawer(null)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
                  activeProps={{ className: "bg-primary/15 text-primary font-medium" }}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Grup nav — scoped to the active category / context */}
          <nav className="flex flex-col gap-1">
            {sidebarGroups.map((group, groupIdx) => {
              const origIdx = navSidebar21.findIndex((g) => g.title === group.title);
              const is21 = origIdx >= 0;
              const displayNum = is21 ? origIdx + 1 : null;
              const isGroupCollapsed = group.title ? (collapsedNavGroups[group.title] !== undefined ? collapsedNavGroups[group.title] : false) : false;
              const isActiveGroup = group.items.some((item) => {
                const base = item.to.split("?")[0];
                if (base === "/" || base === "/portal") return pathname === base;
                return pathname.startsWith(base) || (item.to.includes("?") && fullPath.includes(item.to));
              });

              const prevGroup = groupIdx > 0 ? sidebarGroups[groupIdx - 1] : null;
              const currentSection = group.sectionCategory || "";
              const prevSection = prevGroup?.sectionCategory || "";
              const showSectionHeader = activeCategory === "All" && currentSection && currentSection !== prevSection;
              const sectionTitle = SECTION_TITLES[currentSection] || currentSection;

              return (
                <div key={group.title || `_grp_${groupIdx}`} className="mb-1">
                  {showSectionHeader && (
                    <div className="pt-3 pb-1 px-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0" />
                        <span>{sectionTitle}</span>
                      </p>
                    </div>
                  )}
                  {group.title && (
                    <button
                      type="button"
                      onClick={() => setCollapsedNavGroups(prev => ({ ...prev, [group.title!]: !prev[group.title!] }))}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold transition-colors ${isActiveGroup ? "text-foreground bg-sidebar-accent/50" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`}
                    >
                      {displayNum ? (
                        <span className="text-[11px] font-mono font-medium text-muted-foreground/60 w-5 shrink-0 text-left">
                          {displayNum}.
                        </span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0 ml-1 mr-1" />
                      )}
                      <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${!isGroupCollapsed ? "rotate-90" : ""}`} />
                      <span className="truncate flex-1 text-left font-medium">{group.title}</span>
                      <span className="text-[10px] text-muted-foreground/60 shrink-0 font-normal">{group.items.length}</span>
                    </button>
                  )}
                  {!isGroupCollapsed && (
                    <div className={`flex flex-col gap-0.5 ${group.title ? (displayNum ? "ml-5" : "ml-4") + " mt-0.5 border-l border-sidebar-border pl-2" : ""}`}>
                      {group.items.length === 0 ? (
                        <span className="text-xs text-muted-foreground/60 italic py-1 px-2 select-none">
                          (Kosong)
                        </span>
                      ) : (
                        group.items.map((item) => {
                          const isFav = favorites.includes(item.to);
                          const toPath = item.to.split("?")[0];
                          const toSearch = item.to.includes("?")
                            ? Object.fromEntries(new URLSearchParams(item.to.split("?")[1]))
                            : undefined;
                          return (
                            <div key={item.to} className="group/item relative flex items-center">
                              <Link
                                to={toPath}
                                search={toSearch as any}
                                activeOptions={{ exact: item.to === "/" || item.to === "/portal" || item.to.includes("?") }}
                                onClick={() => setOpenDrawer(null)}
                                className="flex-1 min-w-0 flex items-center gap-2.5 rounded-lg pl-2.5 pr-8 py-1.5 text-[13px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
                                activeProps={{ className: "bg-primary/15 text-primary font-medium" }}
                              >
                                {item.icon ? <item.icon className="h-4 w-4 shrink-0" /> : <span className="h-4 w-4 shrink-0" />}
                                <span className="truncate">{item.label}</span>
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleFavorite(item.to);
                                }}
                                className={`absolute right-1 p-1.5 rounded-md transition-opacity ${isFav ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'} hover:bg-accent`}
                                title={isFav ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                              >
                                <Star className={`size-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
            </>
          )}
        </div>
      </aside>

      <aside id="sidenavRight" className={`fixed inset-y-0 right-0 z-50 flex w-[300px] flex-col border-l border-border bg-background transition-transform duration-500 ease-in-out ${openDrawer === "right" ? "translate-x-0" : "translate-x-full"}`}>
        {/* Control Center header */}
        <div className="flex items-center justify-between gap-3 px-4 h-14 border-b border-border shrink-0 sm:px-6">
          <span className="text-sm font-semibold text-foreground truncate">Control Center</span>
          <button
            type="button"
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg shrink-0"
            onClick={() => setOpenDrawer(null)}
            title="Sembunyikan panel kanan"
            aria-label="Sembunyikan panel kanan"
          >
            <PanelRight size={18} />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 py-4 sm:px-6">
          <nav className="flex flex-col gap-5 items-start">
            <div className="flex flex-col gap-3 w-full">

              {/* Quick actions — dipindahkan dari header atas */}
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="flex-1 min-w-0 flex items-center gap-2 px-3 h-9 rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  title="Pencarian Global (Cmd/Ctrl + K)"
                >
                  <Search className="h-4 w-4 shrink-0" />
                  <span className="text-[13px] flex-1 text-left truncate">Pencarian</span>
                  <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted/50 font-mono shrink-0">⌘K</kbd>
                </button>
                <Link
                  to="/notification-center"
                  onClick={() => setOpenDrawer(null)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
                  title="Notifikasi"
                  aria-label="Notifikasi"
                >
                  <Bell className="h-4 w-4" />
                </Link>
              </div>

              {/* Mode switcher — dipindahkan dari header atas */}
              <div className="pt-3 border-t border-border/70 w-full">
                <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ActiveModeIcon className="h-3.5 w-3.5" /> Mode Aktif
                </p>
                <div className="flex flex-col gap-1.5">
                  {APP_MODES.map((m) => {
                    const Icon = m.icon;
                    const isSelected = currentMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setCurrentMode(m.id);
                          try {
                            localStorage.setItem("client_os_active_mode", m.id);
                            window.dispatchEvent(new Event("aio_mode_changed"));
                          } catch {}
                        }}
                        className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-xl border text-left transition-colors cursor-pointer ${
                          isSelected
                            ? "border-primary/40 bg-primary/10 text-foreground"
                            : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-lg shrink-0 ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-medium truncate">{m.label}</span>
                          <span className="block text-[10.5px] text-muted-foreground truncate">{m.desc}</span>
                        </span>
                        {isSelected && <span className="size-1.5 rounded-full bg-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Akun — profil & pengaturan dipindahkan dari header atas */}
              <div className="relative pt-3 border-t border-border/70 w-full">
                <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Akun
                </p>
                <div className="flex items-center gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex-1 min-w-0 flex items-center gap-2 px-3 h-9 rounded-lg border transition-colors ${
                      isProfileOpen
                        ? "border-primary/40 bg-primary/10 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                    title="Profil"
                  >
                    <User className="h-4 w-4 shrink-0" />
                    <span className="text-[13px] truncate">Profil</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenSettings("general")}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
                    title="Pengaturan"
                    aria-label="Pengaturan"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
                <ProfileMenu
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  onOpenSettings={handleOpenSettings}
                />
              </div>

              <ThemeLangToggle />
              
              {/* Expandable Region Settings */}
              <div className="pt-2 border-t border-border/80 w-full">
                <button
                  type="button"
                  onClick={() => setIsRegionOpen(!isRegionOpen)}
                  className={`flex h-9 w-full items-center justify-between px-3 rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    isRegionOpen ? "!bg-accent font-medium border-primary/30" : ""
                  }`}
                  title="Region Settings"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="size-4 shrink-0" />
                    <span className="text-sm">Region</span>
                  </span>
                  <ChevronDown className={`size-4 transition-transform duration-200 ${isRegionOpen ? "rotate-180" : ""}`} />
                </button>
                
                {isRegionOpen && (
                  <div className="w-full rounded-xl border border-border bg-muted/20 p-3 mt-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Country / Region</label>
                        <select className="w-full px-2.5 py-1.5 bg-background border border-border rounded-md outline-none focus:ring-1 focus:ring-primary text-xs appearance-none">
                          <option>United States</option>
                          <option>Indonesia</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                          <option>Singapore</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">City</label>
                        <input
                          type="text"
                          placeholder="e.g. Jakarta"
                          className="w-full px-2.5 py-1.5 bg-background border border-border rounded-md outline-none focus:ring-1 focus:ring-primary text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Timezone</label>
                        <select className="w-full px-2.5 py-1.5 bg-background border border-border rounded-md outline-none focus:ring-1 focus:ring-primary text-xs appearance-none">
                          <option>(UTC-08:00) Pacific Time</option>
                          <option>(UTC+07:00) WIB</option>
                          <option>(UTC+08:00) WITA</option>
                          <option>(UTC+09:00) WIT</option>
                          <option>(UTC+00:00) UTC</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

                          </div>
          </nav>
        </div>
        
        {/* Footer Informasi Versi Ringkas di Bawah Sidebar Kanan */}
        <div className="p-4 mt-auto shrink-0">
          <div className="w-full rounded-xl border border-border bg-muted/40 p-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                <span className="font-semibold text-foreground text-xs">Client OS</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-medium">
                Aktif
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] text-muted-foreground">
              <div className="flex justify-between items-center">
                <span>Nomor Versi</span>
                <span className="font-mono font-semibold text-foreground">v2.4.2</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Rilis Build</span>
                <span className="font-mono text-foreground">2026.09-stable</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Kanal Pembaruan</span>
                <span className="text-foreground">Production</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sinkronisasi</span>
                <span className="text-emerald-500 font-medium flex items-center gap-1">
                  ✓ Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main id="mainContent" className={`relative flex flex-1 flex-col overflow-hidden transition-[margin] duration-300 ease-in-out ${openDrawer === "left" ? "lg:ml-[300px]" : "ml-0"} ${openDrawer === "right" ? "lg:mr-[300px]" : "mr-0"}`}>
        {openDrawer && (
          <div className="absolute inset-0 z-40 bg-black/40 transition-opacity duration-500 lg:hidden" onClick={() => setOpenDrawer(null)} />
        )}
        <header ref={headerRef as any} className="absolute top-0 inset-x-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-5 sm:py-2 min-h-[50px]">
            {/* Bagian Kiri Header: Nav Toggle (semua ukuran) + Nav Controls (Undo, Home, Redo) */}
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 shrink-0 justify-start">
              <button
                type="button"
                className={`p-1.5 sm:p-2 -ml-1 sm:-ml-1.5 rounded-lg shrink-0 transition-colors ${openDrawer === "left" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                onClick={() => setOpenDrawer(openDrawer === "left" ? null : "left")}
                title={openDrawer === "left" ? "Sembunyikan Navigasi" : "Tampilkan Navigasi"}
                aria-label="Toggle sidebar kiri"
              >
                <PanelLeft size={19} />
              </button>

              <HeaderNavControls
                href="/home"
                isHomeActive={pathname === "/home" || pathname === "/"}
              />
            </div>

            {/* Bagian Kanan Header: Aksi Khusus Menu (jika ada) + Portal Target + Toggle Control Center */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 min-w-0">
              {actions && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {actions}
                </div>
              )}
              <div
                id="app-header-actions-portal"
                className="flex items-center gap-1 sm:gap-1.5 min-w-0 empty:hidden overflow-x-auto no-scrollbar py-0.5"
              />
              <button
                type="button"
                className={`p-1.5 sm:p-2 -mr-1 sm:-mr-1.5 rounded-lg shrink-0 transition-colors ${openDrawer === "right" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                onClick={() => setOpenDrawer(openDrawer === "right" ? null : "right")}
                title={openDrawer === "right" ? "Sembunyikan Control Center" : "Tampilkan Control Center"}
                aria-label="Toggle sidebar kanan"
              >
                <PanelRight size={19} />
              </button>
            </div>
          </div>
        </header>
        <div
          className={`flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar relative z-10 ${
            pathname === "/" ? "px-4 pb-[90px] sm:px-6 sm:pb-[90px]" : "pb-[80px]"
          }`}
          style={{ paddingTop: headerHeight }}
        >
          {children}
        </div>
        {/* iOS-Style Floating Search Pill above Dock (Active when not in Launcher) */}
        {pathname !== "/" && (
          <div className="fixed bottom-[calc(5rem+10pt)] left-0 right-0 flex justify-center pb-1 pointer-events-none z-30 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="pointer-events-auto flex items-center justify-center h-[28.5px] min-w-[88px] gap-1.5 px-4 rounded-full bg-card/75 dark:bg-card/60 backdrop-blur-xl border border-border/80 shadow-lg text-xs font-medium text-foreground/85 hover:bg-accent/80 hover:text-foreground hover:border-border active:scale-95 transition-all duration-150 cursor-pointer group"
              aria-label="Pencarian Global (Search)"
            >
              <AnimatedSearchIcon active={true} className="size-[13px] text-muted-foreground group-hover:text-foreground transition-colors shrink-0" strokeWidth={2.4} />
              <TypewriterSearchText active={true} speed={50} startDelay={100} />
            </button>
          </div>
        )}
        <AppDock
          onQuickCapture={() => {
            setIsQuickCaptureOpen((prev) => !prev);
            setIsShortcutOpen(false);
            setIsTerminalOpen(false);
            setIsExpandOpen(false);
            setIsRecentOpen(false);
            setIsTaskbarOpen(false);
          }}
          onShortcut={() => {
            setIsShortcutOpen((prev) => !prev);
            setIsQuickCaptureOpen(false);
            setIsTerminalOpen(false);
            setIsExpandOpen(false);
            setIsRecentOpen(false);
            setIsTaskbarOpen(false);
          }}
          onTerminal={() => {
            setIsTerminalOpen((prev) => !prev);
            setIsQuickCaptureOpen(false);
            setIsShortcutOpen(false);
            setIsExpandOpen(false);
            setIsRecentOpen(false);
            setIsTaskbarOpen(false);
          }}
          onExpand={() => {
            setIsExpandOpen((prev) => !prev);
            setIsQuickCaptureOpen(false);
            setIsShortcutOpen(false);
            setIsTerminalOpen(false);
            setIsRecentOpen(false);
            setIsTaskbarOpen(false);
          }}
          onRecent={() => {
            setIsRecentOpen((prev) => !prev);
            setIsTaskbarOpen(false);
            setIsQuickCaptureOpen(false);
            setIsShortcutOpen(false);
            setIsTerminalOpen(false);
            setIsExpandOpen(false);
          }}
          onTaskbar={() => {
            setIsTaskbarOpen((prev) => !prev);
            setIsRecentOpen(false);
            setIsQuickCaptureOpen(false);
            setIsShortcutOpen(false);
            setIsTerminalOpen(false);
            setIsExpandOpen(false);
          }}
          isQuickCaptureOpen={isQuickCaptureOpen}
          isShortcutOpen={isShortcutOpen}
          isTerminalOpen={isTerminalOpen}
          isExpandOpen={isExpandOpen}
          isRecentOpen={isRecentOpen}
          isTaskbarOpen={isTaskbarOpen}
        />

        {/* Global Modals: Command Palette, Quick Capture, Shortcut, Terminal, Recent & Taskbar */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
        <QuickCaptureModal
          isOpen={isQuickCaptureOpen}
          onClose={() => setIsQuickCaptureOpen(false)}
          onSuccess={(msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3000);
          }}
        />
        <ShortcutModal
          isOpen={isShortcutOpen}
          onClose={() => setIsShortcutOpen(false)}
          onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        />
        <TerminalModal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
        />
        <RecentModal
          isOpen={isRecentOpen}
          onClose={() => setIsRecentOpen(false)}
        />
        <TaskbarModal
          isOpen={isTaskbarOpen}
          onClose={() => setIsTaskbarOpen(false)}
        />

        {/* Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 bg-foreground text-background text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 size={15} className="text-emerald-500" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
    </ShellSectionsProvider>
    </ShellHeaderProvider>
    </ShellSidebarProvider>
  );
}
