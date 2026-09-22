import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  History,
  X,
  Search,
  Trash2,
  ExternalLink,
  Star,
  Clock,
  Sparkles,
  LayoutDashboard,
  Compass,
} from "lucide-react";
import { useRecentApps, type RecentAppItem } from "@/hooks/useRecentApps";
import { useFavorites } from "@/hooks/useFavorites";
import { navKonsultan, type NavItem } from "@/config/nav";

interface RecentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecentModal({ isOpen, onClose }: RecentModalProps) {
  const navigate = useNavigate();
  const { recentApps, removeRecentApp, clearRecentApps, addRecentApp } = useRecentApps();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [search, setSearch] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lookup map for nav items to get their actual icon and label
  const navMap = useMemo(() => {
    const map = new Map<string, NavItem>();
    navKonsultan.forEach((g) => {
      g.items.forEach((item) => {
        if (!map.has(item.to)) {
          map.set(item.to, item);
        }
      });
    });
    return map;
  }, []);

  const filteredApps = useMemo(() => {
    if (!search.trim()) return recentApps;
    const q = search.toLowerCase();
    return recentApps.filter(
      (app) =>
        app.label.toLowerCase().includes(q) ||
        app.to.toLowerCase().includes(q) ||
        (app.category && app.category.toLowerCase().includes(q))
    );
  }, [recentApps, search]);

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / (60 * 1000));
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} mnt lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hr lalu`;
  };

  const handleOpenApp = (app: RecentAppItem) => {
    addRecentApp({ to: app.to, label: app.label, category: app.category });
    onClose();
    const toPath = app.to.split("?")[0];
    const toSearch = app.to.includes("?")
      ? Object.fromEntries(new URLSearchParams(app.to.split("?")[1]))
      : undefined;
    navigate({ to: toPath as any, search: toSearch as any });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to dismiss on outside click */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Pop-up modal positioned directly above the dock */}
      <div
        className="fixed bottom-[88px] left-1/2 -translate-x-1/2 z-50 w-[92vw] sm:w-[410px] max-h-[calc(100vh-110px)] rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-[30px] border border-white/60 dark:border-white/15 shadow-[0px_4px_21px_-8px_rgba(255,255,255,0.5),0_20px_50px_rgba(0,0,0,0.22)] liquid-glass-dock overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-200 select-none cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 border-b border-border/60 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <History className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-foreground tracking-tight">
                  Recent Apps & History
                </h3>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  {recentApps.length}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Riwayat akses & pintasan aplikasi terakhir
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {recentApps.length > 0 && (
              <button
                type="button"
                onClick={clearRecentApps}
                title="Hapus riwayat"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="px-3 pt-2.5 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari riwayat aplikasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-muted/40 border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/60 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* List of Recent Apps */}
        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1 max-h-[340px]">
          {filteredApps.length === 0 ? (
            <div className="py-8 px-4 text-center">
              <div className="w-10 h-10 rounded-2xl bg-muted/50 text-muted-foreground flex items-center justify-center mx-auto mb-2.5">
                <Clock className="size-5 opacity-60" />
              </div>
              <p className="text-xs font-semibold text-foreground mb-1">
                {search ? "Tidak ada riwayat yang cocok" : "Belum ada riwayat aktivitas"}
              </p>
              <p className="text-[11px] text-muted-foreground max-w-[240px] mx-auto mb-3">
                {search
                  ? "Coba gunakan kata kunci pencarian yang lain."
                  : "Aplikasi yang Anda kunjungi akan otomatis tercatat di sini."}
              </p>

              {/* Quick Jump Suggestions when empty */}
              <div className="pt-2 border-t border-border/40">
                <span className="text-[10px] font-semibold text-muted-foreground block mb-2">
                  Pintasan Populer:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {[
                    { to: "/", label: "Launcher", icon: LayoutDashboard },
                    { to: "/home", label: "Beranda", icon: Sparkles },
                    { to: "/100-framework", label: "Mini MBA", icon: Compass },
                  ].map((s) => (
                    <button
                      key={s.to}
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate({ to: s.to as any });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted/60 hover:bg-muted text-foreground transition-colors"
                    >
                      <s.icon className="size-3 text-primary" />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            filteredApps.map((app) => {
              const navItem = navMap.get(app.to);
              const AppIcon = navItem?.icon || History;
              const isFav = isFavorite(app.to);

              return (
                <div
                  key={app.id}
                  onClick={() => handleOpenApp(app)}
                  className="group relative flex items-center justify-between p-2 rounded-xl hover:bg-accent/70 border border-transparent hover:border-border/50 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                      <AppIcon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-foreground truncate block">
                          {app.label}
                        </span>
                        {app.category && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground shrink-0">
                            {app.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                        <Clock className="size-2.5" />
                        <span>{formatRelativeTime(app.visitedAt)}</span>
                        <span className="opacity-40">•</span>
                        <span className="font-mono text-[9px] opacity-70 truncate max-w-[120px]">
                          {app.to}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(app.to);
                      }}
                      title={isFav ? "Hapus dari favorit dock" : "Pin ke favorit dock"}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFav
                          ? "text-amber-500 hover:bg-amber-500/10"
                          : "text-muted-foreground hover:text-amber-500 hover:bg-muted"
                      }`}
                    >
                      <Star className={`size-3.5 ${isFav ? "fill-amber-500" : ""}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentApp(app.to);
                      }}
                      title="Hapus item ini"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-3 py-2 border-t border-border/50 bg-muted/10 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Tekan Esc untuk menutup</span>
          <span className="font-medium text-foreground/80">Klik untuk langsung membuka</span>
        </div>
      </div>
    </>
  );
}
