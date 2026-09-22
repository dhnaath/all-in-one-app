import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CornerUpRight,
  X,
  Search,
  Home,
  LayoutDashboard,
  CalendarDays,
  Briefcase,
  Wallet,
  ShoppingBag,
  Plus,
  Command,
  SlidersHorizontal,
  FolderKanban,
  FileText,
  Users,
  Compass,
  ArrowRight,
} from "lucide-react";

interface ShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickCapture?: () => void;
}

interface ShortcutItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "nav" | "action" | "key";
  icon: any;
  to?: string;
  action?: () => void;
  badge?: string;
}

export function ShortcutModal({ isOpen, onClose, onOpenQuickCapture }: ShortcutModalProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "nav" | "action">("all");

  const shortcuts: ShortcutItem[] = useMemo(
    () => [
      {
        id: "home",
        title: "Beranda Eksekutif",
        subtitle: "Dashboard ringkasan harian & KPI",
        category: "nav",
        icon: Home,
        to: "/home",
        badge: "Alt + H",
      },
      {
        id: "launcher",
        title: "Launcher Aplikasi",
        subtitle: "Pusat modul & portal kerja konsultan",
        category: "nav",
        icon: LayoutDashboard,
        to: "/",
        badge: "Alt + L",
      },
      {
        id: "quick-capture",
        title: "Quick Capture (+)",
        subtitle: "Catat tugas, transaksi, catatan & habit",
        category: "action",
        icon: Plus,
        action: () => {
          onClose();
          if (onOpenQuickCapture) onOpenQuickCapture();
        },
        badge: "Q",
      },
      {
        id: "command-palette",
        title: "Command Palette",
        subtitle: "Pencarian global dan eksekusi perintah cepat",
        category: "action",
        icon: Command,
        action: () => {
          onClose();
          window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
          );
        },
        badge: "⌘K",
      },
      {
        id: "kalender",
        title: "Kalender & Jadwal",
        subtitle: "Agenda rapat klien & event penting",
        category: "nav",
        icon: CalendarDays,
        to: "/kalender",
        badge: "Alt + K",
      },
      {
        id: "proyek",
        title: "Proyek & Engagement",
        subtitle: "Manajemen portofolio & deliverable",
        category: "nav",
        icon: Briefcase,
        to: "/proyek",
      },
      {
        id: "finance",
        title: "Keuangan & Kas",
        subtitle: "Arus kas, honor konsultan & beban operasional",
        category: "nav",
        icon: Wallet,
        to: "/finance",
      },
      {
        id: "shopping",
        title: "Kebutuhan Belanja",
        subtitle: "Daftar pengadaan, logistik & belanja",
        category: "nav",
        icon: ShoppingBag,
        to: "/shopping",
      },
      {
        id: "notes",
        title: "Catatan & Dokumen",
        subtitle: "Notulensi rapat dan basis pengetahuan",
        category: "nav",
        icon: FileText,
        to: "/notes",
      },
      {
        id: "task-manager",
        title: "Task Manager",
        subtitle: "Kanban board & status pengerjaan",
        category: "nav",
        icon: FolderKanban,
        to: "/task-manager",
      },
      {
        id: "client-hub",
        title: "Client Hub",
        subtitle: "Direktori klien dan riwayat engagement",
        category: "nav",
        icon: Users,
        to: "/client-hub",
      },
      {
        id: "outward",
        title: "Outward Advisory",
        subtitle: "Riset industri dan strategic outlook",
        category: "nav",
        icon: Compass,
        to: "/outward",
      },
    ],
    [onClose, onOpenQuickCapture]
  );

  const filtered = useMemo(() => {
    return shortcuts.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchText =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(search.toLowerCase())) ||
        (item.badge && item.badge.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchText;
    });
  }, [shortcuts, search, selectedCategory]);

  if (!isOpen) return null;

  const handleItemClick = (item: ShortcutItem) => {
    if (item.action) {
      item.action();
    } else if (item.to) {
      navigate({ to: item.to as any });
      onClose();
    }
  };

  return (
    <>
      {/* Invisible backdrop (dismiss on outside click, just like switch profile / mode) */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Pop-up window positioned directly above dock */}
      <div
        className="fixed bottom-[88px] left-1/2 -translate-x-1/2 z-50 w-[92vw] sm:w-[380px] max-h-[calc(100vh-110px)] rounded-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-[30px] border border-white/60 dark:border-white/15 shadow-[0px_4px_21px_-8px_rgba(255,255,255,0.5),0_20px_50px_rgba(0,0,0,0.22)] liquid-glass-dock overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-200 select-none cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5 tracking-tight">
              <span className="p-1 rounded-lg bg-primary/10 text-primary">
                <CornerUpRight className="size-3.5" />
              </span>
              <span>Shortcut & Pintasan Cepat</span>
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pintasan atau navigasi..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground/70"
            />
          </div>

          {/* Filter pills */}
          <div className="grid grid-cols-3 gap-1 p-0.5 bg-background/80 dark:bg-zinc-800/80 rounded-xl border border-border/60 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`py-1 text-[11px] font-medium rounded-lg transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua ({shortcuts.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("nav")}
              className={`py-1 text-[11px] font-medium rounded-lg transition-all ${
                selectedCategory === "nav"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Halaman
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("action")}
              className={`py-1 text-[11px] font-medium rounded-lg transition-all ${
                selectedCategory === "action"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Aksi
            </button>
          </div>
        </div>

        {/* Shortcuts list */}
        <div className="p-2 space-y-1 overflow-y-auto no-scrollbar max-h-[50vh]">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Tidak ada pintasan yang cocok dengan &quot;{search}&quot;
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-neutral-100/80 dark:hover:bg-zinc-800/70 transition-colors group cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-zinc-800 text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div className="text-[10px] text-muted-foreground truncate">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                  {item.badge ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-zinc-800 text-muted-foreground border border-neutral-200/60 dark:border-zinc-700/60 shrink-0">
                      {item.badge}
                    </span>
                  ) : (
                    <ArrowRight className="size-3 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 border-t border-border/60 bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Tekan Esc untuk menutup</span>
          <span className="font-mono">Pintasan Cepat</span>
        </div>
      </div>
    </>
  );
}
