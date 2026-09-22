import { useRef, useMemo, useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Target,
  LayoutDashboard,
  CalendarDays,
  Home,
  Terminal,
  Wallet,
  Briefcase,
  Users,
  Compass,
  Heart,
  TrendingUp,
  FolderKanban,
  CheckSquare,
  Plus,
  CornerUpRight,
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { navKonsultan } from "@/config/nav";

// Jarak (px) dari kursor ke ikon yang mempengaruhi ukurannya.
// Makin kecil = efek zoom makin "lokal" (cuma ikon terdekat yang membesar).
// Makin besar = efek zoom menyebar ke ikon-ikon di sekitarnya juga.
const CURSOR_RADIUS = 70;

// Ukuran ikon: [normal, saat pas di tengah kursor, normal lagi]
const ICON_SIZE_RANGE = [40, 70, 40];

interface DockItemConfig {
  id: string;
  label: string;
  icon: any;
  onClick?: () => void;
}

function DockIcon({ 
  item, 
  mouseX, 
  isActive 
}: { 
  item: DockItemConfig, 
  mouseX: any,
  isActive: boolean
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-CURSOR_RADIUS, 0, CURSOR_RADIUS],
    ICON_SIZE_RANGE
  );

  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const content = (
    <>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {item.label}
      </div>
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        className={`flex items-center justify-center rounded-2xl cursor-pointer ${
          isActive 
            ? "bg-primary text-primary-foreground shadow-md border-primary/40" 
            : "bg-card/90 text-muted-foreground shadow-xs hover:bg-accent hover:text-foreground border-border"
        } backdrop-blur-md border`}
      >
        <item.icon className="w-1/2 h-1/2" />
      </motion.div>
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
      )}
    </>
  );

  if (item.onClick) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        className="relative group outline-none bg-transparent border-0 p-0 m-0 leading-none flex flex-col items-center justify-end shrink-0 cursor-pointer"
        aria-label={item.label}
      >
        {content}
      </button>
    );
  }

  const toPath = item.id.split("?")[0];
  const toSearch = item.id.includes("?")
    ? Object.fromEntries(new URLSearchParams(item.id.split("?")[1]))
    : undefined;

  return (
    <Link to={toPath} search={toSearch as any} className="relative group outline-none bg-transparent border-0 p-0 m-0 leading-none flex flex-col items-center justify-end shrink-0">
      {content}
    </Link>
  );
}

export function AppDock({
  onQuickCapture,
  onShortcut,
  onTerminal,
  isQuickCaptureOpen,
  isShortcutOpen,
  isTerminalOpen,
}: {
  onQuickCapture?: () => void;
  onShortcut?: () => void;
  onTerminal?: () => void;
  isQuickCaptureOpen?: boolean;
  isShortcutOpen?: boolean;
  isTerminalOpen?: boolean;
}) {
  const mouseX = useMotionValue(Infinity);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { favorites } = useFavorites();

  const [activeMode, setActiveMode] = useState<string>("personal");

  useEffect(() => {
    const updateMode = () => {
      const mode = localStorage.getItem("client_os_active_mode") || "personal";
      setActiveMode(mode);
    };
    updateMode();
    window.addEventListener("storage", updateMode);
    window.addEventListener("aio_mode_changed", updateMode);
    return () => {
      window.removeEventListener("storage", updateMode);
      window.removeEventListener("aio_mode_changed", updateMode);
    };
  }, []);

  const dockItems = useMemo(() => {
    // Mode-adaptive curated suggestions
    const modeAdaptivePresets: Record<string, Array<{ id: string; label: string; icon: any }>> = {
      personal: [
        { id: "/reliance", label: "Self Reliance", icon: Heart },
        { id: "/growth", label: "Personal Growth", icon: TrendingUp },
      ],
      household: [
        { id: "/budget", label: "Anggaran Rumah", icon: Wallet },
        { id: "/kalender", label: "Jadwal Domestik", icon: CalendarDays },
      ],
      relatives: [
        { id: "/contacts", label: "Kontak Keluarga", icon: Users },
        { id: "/events", label: "Pertemuan Kerabat", icon: CalendarDays },
      ],
      employment: [
        { id: "/proyek", label: "Proyek & Tugas", icon: Briefcase },
        { id: "/task-manager", label: "Task Manager", icon: CheckSquare },
      ],
      owner: [
        { id: "/asset", label: "Portofolio Aset", icon: Wallet },
        { id: "/100-framework", label: "100 Framework", icon: Compass },
      ],
      public: [
        { id: "/outward", label: "Outward Advisory", icon: Compass },
        { id: "/outlook", label: "Market Outlook", icon: TrendingUp },
      ],
    };

    // Create a flat map of all available navigation items
    const allItems = navKonsultan.flatMap(group => group.items);
    
    // Map favorite paths to their respective item configuration
    const dynamicItems = favorites.map(favPath => {
      const found = allItems.find(item => item.to === favPath);
      if (found) {
        return { id: found.to, label: found.label, icon: found.icon };
      }
      return { id: favPath, label: favPath, icon: Target }; // Fallback
    });
    
    // Base static items
    const staticItems: DockItemConfig[] = [
      { id: "/", label: "Launcher", icon: LayoutDashboard },
      { id: "/home", label: "Beranda", icon: Home },
      {
        id: "/shortcut",
        label: "Shortcut",
        icon: CornerUpRight,
        onClick: () => {
          if (onShortcut) {
            onShortcut();
          } else {
            window.dispatchEvent(new CustomEvent("aio_open_shortcut"));
          }
        },
      },
      {
        id: "quick-capture",
        label: "Quick Capture (+)",
        icon: Plus,
        onClick: () => {
          if (onQuickCapture) {
            onQuickCapture();
          } else {
            window.dispatchEvent(new CustomEvent("aio_open_quick_capture"));
          }
        },
      },
      {
        id: "/terminal",
        label: "Terminal",
        icon: Terminal,
        onClick: () => {
          if (onTerminal) {
            onTerminal();
          } else {
            window.dispatchEvent(new CustomEvent("aio_open_terminal"));
          }
        },
      },
    ];

    const currentModeItems = modeAdaptivePresets[activeMode] || modeAdaptivePresets.personal;
    
    // Combine: static + mode items + favorites (without duplicate IDs)
    const combined = [...staticItems];
    for (const item of currentModeItems) {
      if (!combined.some(c => c.id === item.id)) {
        combined.push(item);
      }
    }
    for (const fav of dynamicItems) {
      if (!combined.some(c => c.id === fav.id)) {
        combined.push(fav);
      }
    }

    return combined.slice(0, 9); // Optimal executive dock width with shortcut & quick capture
  }, [favorites, activeMode, onQuickCapture, onShortcut, onTerminal]);

  if (dockItems.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 hidden sm:flex">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-3 px-4 pb-3 h-16 rounded-3xl bg-card/75 dark:bg-card/60 backdrop-blur-xl border border-border/80 shadow-2xl"
      >
        {dockItems.map((item) => {
          let isActive = pathname === item.id || (item.id.startsWith("/") && item.id !== "/" && pathname.startsWith(item.id));
          if (item.id === "quick-capture") {
            isActive = Boolean(isQuickCaptureOpen);
          } else if (item.id === "/shortcut") {
            isActive = Boolean(isShortcutOpen) || pathname === "/shortcut";
          } else if (item.id === "/terminal") {
            isActive = Boolean(isTerminalOpen) || pathname === "/terminal";
          }

          return (
            <DockIcon 
              key={item.id} 
              item={item} 
              mouseX={mouseX} 
              isActive={isActive} 
            />
          );
        })}
      </motion.div>
    </div>
  );
}
