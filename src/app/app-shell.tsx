import { AppDock } from "./shell/app-dock";
import { TypewriterSearchText } from "./shell/TypewriterSearchText";
import { AnimatedSearchIcon } from "./shell/AnimatedSearchIcon";
import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
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
import { HeaderBreadcrumb } from "@/app/HeaderBreadcrumb";
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
import { navKonsultan, type NavItem, type NavGroup as NavGroupType } from "@/config/nav";

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

  const selfShapingGroup = rawNav.find((g) => g.title === "Self-Shaping");
  const mutualMappingGroup = rawNav.find((g) => g.title === "Mutual-Mapping");
  const orgOptimizingGroup = rawNav.find((g) => g.title === "Organization-Optimizing");

  const sidebarNav: NavGroupType[] = [
    {
      title: "",
      items: [
        { to: "/", label: "Launcher", icon: LayoutDashboard },
        { to: "/terminal", label: "Terminal", icon: Terminal },
      ],
    },
    {
      title: "Self-Shaping",
      items: selfShapingGroup?.items || [
        { to: "/reliance", label: "Reliance", icon: ShieldCheck },
        { to: "/sufficient", label: "Sufficient", icon: CheckCircle2 },
        { to: "/improvement", label: "Improvement", icon: TrendingUp },
        { to: "/development", label: "Development", icon: Sparkles },
      ],
    },
    {
      title: "Mutual-Mapping",
      items: mutualMappingGroup?.items || [
        { to: "/interact", label: "Interact", icon: MessagesSquare },
        { to: "/interest", label: "Interest", icon: Heart },
        { to: "/intersect", label: "Intersect", icon: Layers },
        { to: "/interdependence", label: "Interdependence", icon: Workflow },
      ],
    },
    {
      title: "Organization-Optimizing",
      items: orgOptimizingGroup?.items || [
        { to: "/insider", label: "Insider", icon: Eye },
        { to: "/insight", label: "Insight", icon: Lightbulb },
        { to: "/outward", label: "Outward", icon: Compass },
        { to: "/outlook", label: "Outlook", icon: TrendingUp },
      ],
    },
  ];

  const nav = sidebarNav
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => enabledMenus[item.to] !== false),
    }))
    .filter((group) => group.items.length > 0 || group.title === "Mutual-Mapping");

  let categoryName = "Umum";
  let categoryGroup: { title?: string; items?: readonly any[] | any[] } | undefined = rawNav[0];

  if (pathname === "/") {
    categoryName = "Umum";
    categoryGroup = undefined;
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

  const categorySiblings = categoryGroup?.items
    ?.filter((item) => item.to !== fullPath && item.to !== pathname)
    ?.map((item) => ({ label: item.label, href: item.to })) || [];

  const displayTitle =
    customMatch && pathname === "/lainnya" ? customMatch.item.label : title;

  const [openDrawer, setOpenDrawer] = useState<"left" | "right" | null>(
    null,
  );
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        const mobileContainer = document.querySelector(
          ".lg\\:hidden.overflow-x-auto",
        ) as HTMLElement;
        if (mobileContainer) {
          const activeElement = mobileContainer.querySelector(".\\!bg-accent") as HTMLElement;
          if (activeElement) {
            const containerRect = mobileContainer.getBoundingClientRect();
            const activeRect = activeElement.getBoundingClientRect();
            const scrollLeft =
              mobileContainer.scrollLeft +
              (activeRect.left - containerRect.left) -
              containerRect.width / 2 +
              activeRect.width / 2;
            mobileContainer.scrollTo({ left: scrollLeft, behavior: "smooth" });
          }
        }
      } else {
        const sidebarContainer = document.querySelector(
          ".bg-sidebar .overflow-y-auto",
        ) as HTMLElement;
        if (sidebarContainer) {
          const activeElement = sidebarContainer.querySelector(".nav-gooey-active") as HTMLElement;
          if (activeElement) {
            const containerRect = sidebarContainer.getBoundingClientRect();
            const activeRect = activeElement.getBoundingClientRect();
            const scrollTop =
              sidebarContainer.scrollTop +
              (activeRect.top - containerRect.top) -
              containerRect.height / 2 +
              activeRect.height / 2;
            sidebarContainer.scrollTo({ top: scrollTop, behavior: "smooth" });
          }
        }
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
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={activeSettingsTab}
      />

      <aside id="sidenavLeft" className={`fixed inset-y-0 left-0 z-50 flex w-[275px] flex-col border-r border-border bg-background transition-transform duration-500 ease-in-out ${openDrawer === "left" ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-4 py-4 sm:px-6 shrink-0">
          <button className="hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg shrink-0" onClick={() => setOpenDrawer(null)}><PanelLeft size={20} /></button>
          <div className="flex flex-col opacity-0 pointer-events-none select-none">
            <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">T</h1>
            <div className="mt-1 flex items-center font-mono text-xs sm:text-sm">T</div>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 py-6 sm:px-6 sm:py-8">
          <nav className="flex flex-col gap-6">
            {nav.map((group) => {
              const isGroupCollapsed = group.title ? !!collapsedNavGroups[group.title] : false;
              return (
              <div key={group.title} className="flex flex-col gap-2 ml-[5px]">
                {group.title && (
                  <button
                    type="button"
                    onClick={() => setCollapsedNavGroups(prev => ({ ...prev, [group.title!]: !prev[group.title!] }))}
                    className="flex items-center justify-between w-full text-left outline-none mb-1 group"
                  >
                    <h4 className="text-lg font-bold capitalize text-muted-foreground group-hover:text-foreground transition-colors">
                      {group.title}
                    </h4>
                    {isGroupCollapsed ? (
                      <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </button>
                )}
                {!isGroupCollapsed && (
                  <div className="flex flex-col gap-2">
                    {group.items.length === 0 ? (
                      <span className="text-xs text-muted-foreground/60 italic py-1 px-2 -ml-2 select-none">
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
                            className="flex-1 whitespace-nowrap text-sm text-muted-foreground hover:text-foreground py-1 px-2 -ml-2 rounded-md hover:bg-muted/50 transition-colors"
                            activeProps={{ className: "text-foreground font-bold" }}
                          >
                            {item.label}
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(item.to);
                            }}
                            className={`absolute right-0 p-1.5 rounded-md transition-opacity ${isFav ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'} hover:bg-accent`}
                            title={isFav ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                          >
                            <Star className={`size-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                          </button>
                        </div>
                      );
                    }))}
                  </div>
                )}
              </div>
            )})}
          </nav>
        </div>
      </aside>

      <aside id="sidenavRight" className={`fixed inset-y-0 right-0 z-50 flex w-[275px] flex-col border-l border-border bg-background transition-transform duration-500 ease-in-out ${openDrawer === "right" ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-end gap-3 px-4 py-4 sm:px-6 shrink-0">
          <button className="hidden p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg shrink-0" onClick={() => setOpenDrawer(null)}><PanelRight size={20} /></button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 py-2 sm:px-6">
          <nav className="flex flex-col gap-4 items-start">
            <div className="flex flex-col gap-3 w-full">



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
      <main id="mainContent" className={`relative flex flex-1 flex-col overflow-hidden transition-[margin] duration-500 ease-in-out ${openDrawer === "left" ? "ml-[275px]" : openDrawer === "right" ? "mr-[275px]" : "ml-0"}`}>
        {openDrawer && (
          <div className="absolute inset-0 z-40 bg-black/40 transition-opacity duration-500" onClick={() => setOpenDrawer(null)} />
        )}
        <header className="absolute top-0 inset-x-0 z-20 bg-background border-b border-border shadow-xs">
          <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
            {/* Bagian Kiri Header: Breadcrumb & Nav Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 basis-0 justify-start">
              <button
                type="button"
                className="p-2 -ml-1 sm:-ml-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg shrink-0 block"
                onClick={() => setOpenDrawer(openDrawer === "left" ? null : "left")}
                title="Buka Navigasi"
              >
                <PanelLeft size={20} />
              </button>

              <button
                type="button"
                className="p-2 relative text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg shrink-0 flex items-center justify-center transition-colors"
                title="Notifikasi"
                aria-label="Notifications"
              >
                <Bell className="size-5 shrink-0" />
              </button>

              <div className="min-w-0 flex-1 overflow-hidden">
                <HeaderBreadcrumb
                  className="text-xs"
                  segments={
                    pathname === "/home"
                      ? [
                          { label: "Home", href: "/home" }
                        ]
                      : [
                          { label: "Home", href: "/home" },
                          ...(categoryName && categoryName !== "Umum"
                            ? [
                                {
                                  label: categoryName,
                                  siblings: categorySiblings,
                                },
                              ]
                            : []),
                          { label: displayTitle },
                        ]
                  }
                />
              </div>
            </div>

            {/* Bagian Tengah Header: Nama Menu yang Dibuka */}
            <div className="shrink-0 px-2 text-center max-w-[35%] sm:max-w-[45%]">
              <h1 className="truncate text-base sm:text-lg font-bold tracking-tight text-foreground">
                {displayTitle}
              </h1>
            </div>

            {/* Bagian Kanan Header: Switch Profile & Actions */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 min-w-0 flex-1 basis-0">
              {actions && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {actions}
                </div>
              )}

              {/* Universal Search (Cmd+K) Button */}
              <button
                type="button"
                onClick={() => setIsCommandPaletteOpen(true)}
                className="p-2 relative text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg shrink-0 flex items-center justify-center transition-colors"
                title="Pencarian Global (Cmd/Ctrl + K)"
                aria-label="Search"
              >
                <Search className="size-5 shrink-0" />
              </button>

              {/* 6-Mode Dropdown Switcher */}
              <div className="relative">
                <button
                  type="button"
                  className={`p-2 flex items-center gap-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg shrink-0 transition-colors ${
                    isModeOpen ? "bg-accent text-foreground" : ""
                  }`}
                  title={`Mode Aktif: ${activeModeConfig.label}`}
                  aria-label="Mode Switcher"
                  onClick={() => {
                    setIsModeOpen(!isModeOpen);
                    setIsProfileOpen(false);
                  }}
                >
                  <ActiveModeIcon className="size-5 shrink-0" />
                  <ChevronDown
                    className={`size-3.5 shrink-0 transition-transform duration-200 ${
                      isModeOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isModeOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsModeOpen(false)}
                    />
                    <div
                      className="absolute z-50 w-72 sm:w-80 rounded-3xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-[30px] border border-white/60 dark:border-white/15 shadow-[0px_4px_21px_-8px_rgba(255,255,255,0.5),0_20px_50px_rgba(0,0,0,0.15)] liquid-glass-dock p-2 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 cursor-default text-left top-[calc(100%+8px)] right-0 select-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Focus Rows List - Styled identical to Dock Items */}
                      <div className="flex flex-col gap-1.5 px-0.5 py-0.5">
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
                              className={`group flex items-center justify-between w-full px-3 py-2 rounded-2xl text-left transition-all duration-150 select-none cursor-pointer backdrop-blur-md border ${
                                isSelected
                                  ? "bg-indigo-600 text-white shadow-md border-indigo-400/50"
                                  : "bg-white/80 dark:bg-zinc-800/80 text-neutral-600 dark:text-neutral-300 shadow-xs hover:bg-neutral-100 dark:hover:bg-zinc-700/80 hover:text-neutral-900 dark:hover:text-white border-neutral-200/50 dark:border-zinc-700/60"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 ${
                                    isSelected
                                      ? "bg-white/20 text-white shadow-xs"
                                      : "bg-white dark:bg-zinc-700 text-neutral-500 dark:text-neutral-300 shadow-2xs border border-neutral-200/40 dark:border-transparent group-hover:text-neutral-900 dark:group-hover:text-white"
                                  }`}
                                >
                                  <Icon className="size-4 shrink-0" strokeWidth={2.2} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className={`text-[13.5px] font-medium tracking-tight truncate leading-tight ${
                                    isSelected ? "text-white font-semibold" : "text-neutral-800 dark:text-neutral-100"
                                  }`}>
                                    {m.label}
                                  </span>
                                  <span className={`text-[10.5px] truncate leading-tight mt-0.5 ${
                                    isSelected ? "text-white/80" : "text-neutral-500 dark:text-neutral-400"
                                  }`}>
                                    {m.desc}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <span className="size-1.5 rounded-full bg-white shadow-xs mr-1 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile Icon & Menu */}
              <div className="relative">
                <button
                  type="button"
                  className={`p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg shrink-0 flex items-center justify-center transition-colors ${
                    isProfileOpen ? "bg-accent text-foreground" : ""
                  }`}
                  title="Pengaturan & Profil"
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsModeOpen(false);
                  }}
                >
                  <Settings className="size-5 shrink-0" />
                </button>
                <ProfileMenu
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  onOpenSettings={handleOpenSettings}
                />
              </div>
              <button
                className="p-2 -mr-1 sm:-mr-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg shrink-0 block"
                onClick={() => setOpenDrawer(openDrawer === "right" ? null : "right")}
                title="Buka Menu Kanan"
              >
                <PanelRight size={20} />
              </button>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-16 pb-[90px] sm:px-6 sm:pt-20 sm:pb-[90px] relative z-10">{children}</div>
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
  );
}
