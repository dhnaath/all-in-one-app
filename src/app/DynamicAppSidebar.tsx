import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Star,
  Copy,
  Check,
  LayoutGrid,
  ChevronRight,
  Layers,
  ArrowRight,
  ExternalLink,
  Info,
  Coins,
  type LucideIcon,
} from "lucide-react";
import { navKonsultan, type NavItem, type NavGroup } from "@/config/nav";
import type { ShellSection } from "./shell-sections";

interface DynamicAppSidebarProps {
  currentTitle: string;
  pathname: string;
  fullPath: string;
  contextMatch: { item: NavItem; group: NavGroup } | null;
  contextCategory: string | null;
  effectiveSections: ShellSection[];
  standaloneConfig: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCloseDrawer: () => void;
  onSwitchToBrowse: () => void;
}

export function DynamicAppSidebar({
  currentTitle,
  pathname,
  fullPath,
  contextMatch,
  contextCategory,
  effectiveSections,
  standaloneConfig,
  isFavorite,
  onToggleFavorite,
  onCloseDrawer,
  onSwitchToBrowse,
}: DynamicAppSidebarProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const appName = contextMatch?.item.label || standaloneConfig?.title || currentTitle || "Aplikasi";
  const AppIcon: LucideIcon = contextMatch?.item.icon || Sparkles;
  const categoryTitle = contextMatch?.group.title || contextCategory || "Workspace";
  const siblingItems = contextMatch?.group.items || [];

  const isFinanceApp =
    contextMatch?.group.parentCategory === "Finance" ||
    contextMatch?.group.parentCategory === "Phase Side" ||
    contextCategory === "Keuangan & Pasar" ||
    pathname.startsWith("/syariah") ||
    [
      "/asset",
      "/earning",
      "/surety",
      "/flow",
      "/build",
      "/grow",
      "/legacy",
      "/pajak",
      "/investasi",
      "/valuasi",
      "/100-komoditas",
      "/kredit",
      "/budget",
      "/expense",
      "/liability",
      "/zakat",
      "/financial-health",
      "/liquid-reserves",
      "/physical-commodities",
      "/real-estate",
      "/paper-securities",
      "/digital-assets",
      "/intellectual-property",
    ].some((p) => pathname.startsWith(p));

  const financeGroups = useMemo(() => {
    return navKonsultan.filter(
      (g) => g.parentCategory === "Finance" || g.parentCategory === "Phase Side"
    );
  }, []);

  const currentTab = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("tab") || "all"
    : "all";

  return (
    <div className="flex flex-col gap-4 text-sidebar-foreground">
      {/* 1. Header Profile & Quick Action Card */}
      <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary border border-primary/20">
            <AppIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold leading-tight truncate text-foreground">
              {appName}
            </h2>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              {categoryTitle}
            </p>
          </div>
        </div>

        {/* Quick controls: Star / Favorite, Copy URL, Status */}
        <div className="mt-3 flex items-center justify-between gap-1 border-t border-sidebar-border/60 pt-2.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleFavorite}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                isFavorite
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground border border-sidebar-border"
              }`}
              title={isFavorite ? "Hapus dari Favorit" : "Tambahkan ke Favorit"}
            >
              <Star
                className={`h-3 w-3 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`}
              />
              <span>{isFavorite ? "Favorit" : "Simpan"}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 rounded-md border border-sidebar-border px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors cursor-pointer"
              title="Salin Tautan Halaman"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Salin URL</span>
                </>
              )}
            </button>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Aktif
          </span>
        </div>
      </div>

      {/* 2. Fitur & Tab Terdaftar (Interactive Sections / App Elements) */}
      {effectiveSections.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Elemen & Sub-halaman</span>
            <span className="text-[10px] font-mono font-normal text-muted-foreground/60">
              {effectiveSections.length}
            </span>
          </p>
          <div className="flex flex-col gap-0.5">
            {effectiveSections.map((sec) => {
              const SecIcon = sec.icon;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    sec.onSelect();
                    onCloseDrawer();
                  }}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-left transition-colors cursor-pointer ${
                    sec.active
                      ? "bg-primary/15 text-primary font-semibold border-l-2 border-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  }`}
                >
                  {SecIcon ? (
                    <SecIcon className="h-4 w-4 shrink-0" />
                  ) : (
                    <Layers className="h-4 w-4 shrink-0 opacity-60" />
                  )}
                  <span className="truncate flex-1">{sec.label}</span>
                  {sec.active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Standalone App Tab Navigator */}
      {!effectiveSections.length && standaloneConfig?.tabs && standaloneConfig.tabs.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Navigasi Tab Modul</span>
            <span className="text-[10px] font-mono font-normal text-muted-foreground/60">
              {standaloneConfig.tabs.length}
            </span>
          </p>
          <div className="flex flex-col gap-0.5">
            {standaloneConfig.tabs.map((tab: any) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    const currentSearch = Object.fromEntries(new URLSearchParams(window.location.search).entries());
                    navigate({
                      to: pathname,
                      search: { ...currentSearch, tab: tab.id } as any,
                    });
                    onCloseDrawer();
                  }}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] text-left transition-colors cursor-pointer ${
                    isActive
                      ? "bg-primary/15 text-primary font-semibold border-l-2 border-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Modul Terkait / Kategori Financial & Wealth */}
      {isFinanceApp ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-primary" />
              <span>Suite Financial & Wealth</span>
            </p>
            <Link
              to="/"
              onClick={onCloseDrawer}
              className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
            >
              Launcher
            </Link>
          </div>
          <div className="flex flex-col gap-2.5 max-h-[calc(100vh-320px)] overflow-y-auto no-scrollbar">
            {financeGroups.map((group) => {
              const isCurrentGroup = group.title === contextMatch?.group.title;
              return (
                <div key={group.title} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    <span className={`font-semibold ${isCurrentGroup ? "text-primary" : "text-foreground/80"}`}>
                      {group.title}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/60">{group.items.length}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 pl-1.5 border-l border-sidebar-border/70">
                    {group.items.map((item) => {
                      const toPath = item.to.split("?")[0];
                      const isCurrent =
                        item.to === fullPath ||
                        item.to === pathname ||
                        toPath === pathname;
                      const toSearch = item.to.includes("?")
                        ? Object.fromEntries(new URLSearchParams(item.to.split("?")[1]))
                        : undefined;

                      return (
                        <Link
                          key={item.to}
                          to={toPath}
                          search={toSearch as any}
                          onClick={onCloseDrawer}
                          className={`flex items-center gap-2 rounded-lg px-2 py-1 text-[12px] transition-colors ${
                            isCurrent
                              ? "bg-primary/15 text-primary font-semibold"
                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                          }`}
                        >
                          <item.icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate flex-1">{item.label}</span>
                          {isCurrent && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : siblingItems.length > 1 ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Modul Terkait
            </p>
            <span className="text-[10px] text-muted-foreground/60 font-medium truncate max-w-[120px]">
              {categoryTitle}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            {siblingItems.map((item) => {
              const toPath = item.to.split("?")[0];
              const isCurrent =
                item.to === fullPath ||
                item.to === pathname ||
                toPath === pathname;
              const toSearch = item.to.includes("?")
                ? Object.fromEntries(new URLSearchParams(item.to.split("?")[1]))
                : undefined;

              return (
                <Link
                  key={item.to}
                  to={toPath}
                  search={toSearch as any}
                  onClick={onCloseDrawer}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors ${
                    isCurrent
                      ? "bg-primary/15 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate flex-1">{item.label}</span>
                  {isCurrent && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/20 text-primary font-normal shrink-0">
                      Buka
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* 5. Pintasan ke Navigasi Lengkap (Default 21 Kategori) */}
      <div className="mt-2 rounded-xl border border-sidebar-border bg-sidebar-accent/30 p-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-foreground">
          <Info className="h-3.5 w-3.5 text-primary shrink-0" />
          <p className="text-[12px] font-semibold">Navigasi Default</p>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Gunakan tombol switcher di atas atau klik di bawah untuk menelusuri seluruh 21 kategori dan direktori alat lainnya.
        </p>
        <button
          type="button"
          onClick={onSwitchToBrowse}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 py-2 px-3 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>Buka Navigasi Utama</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
