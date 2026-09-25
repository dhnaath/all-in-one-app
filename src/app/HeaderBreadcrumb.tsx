import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, ArrowRight, ChevronDown, Home } from "lucide-react";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
  siblings?: { label: string; href: string }[];
}

export interface DynamicBreadcrumbProps {
  /**
   * Path string like "/dashboard/settings/profile/security" or "Home > Settings > Profile > Security",
   * or pre-parsed breadcrumb segment items.
   */
  path?: string;
  segments?: BreadcrumbSegment[];
  className?: string;
}

/**
 * Komponen kontrol terpadu untuk ikon Home di header yang diapit tombol panah kiri (Undo)
 * dan panah kanan (Redo) dengan navigasi browser history dan penanganan input form.
 */
function HeaderHomeControls({
  href = "/home",
  isPage = false,
}: {
  href?: string;
  isPage?: boolean;
}) {
  const handleUndo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Coba undo teks aktif jika input/textarea/contenteditable sedang fokus
    try {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable)
      ) {
        if (document.execCommand("undo")) return;
      }
    } catch {}

    // 2. Dispatch custom event jika ada modul aplikasi yang mendengarkan event undo
    window.dispatchEvent(new CustomEvent("app-undo"));

    // 3. Fallback riwayat browser / navigasi kembali
    if (typeof window !== "undefined" && window.history) {
      window.history.back();
    }
  };

  const handleRedo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Coba redo teks aktif jika input/textarea/contenteditable sedang fokus
    try {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable)
      ) {
        if (document.execCommand("redo")) return;
      }
    } catch {}

    // 2. Dispatch custom event jika ada modul aplikasi yang mendengarkan event redo
    window.dispatchEvent(new CustomEvent("app-redo"));

    // 3. Fallback riwayat browser / navigasi maju
    if (typeof window !== "undefined" && window.history) {
      window.history.forward();
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      {/* Panah Kiri: Undo */}
      <button
        type="button"
        onClick={handleUndo}
        className="p-1.5 sm:p-2 rounded-lg shrink-0 transition-colors text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer flex items-center justify-center"
        title="Undo / Riwayat Sebelumnya (Ctrl+Z)"
        aria-label="Undo"
      >
        <ArrowLeft size={19} className="shrink-0" />
      </button>

      {/* Ikon Home: Beranda */}
      {isPage ? (
        <span
          className="p-1.5 sm:p-2 rounded-lg shrink-0 transition-colors bg-accent text-foreground flex items-center justify-center"
          title="Beranda"
        >
          <Home size={19} className="shrink-0" />
        </span>
      ) : (
        <BreadcrumbLink asChild>
          <Link
            to={href}
            className="p-1.5 sm:p-2 rounded-lg shrink-0 transition-colors text-muted-foreground hover:text-foreground hover:bg-accent flex items-center justify-center"
            title="Beranda"
          >
            <Home size={19} className="shrink-0" />
          </Link>
        </BreadcrumbLink>
      )}

      {/* Panah Kanan: Redo */}
      <button
        type="button"
        onClick={handleRedo}
        className="p-1.5 sm:p-2 rounded-lg shrink-0 transition-colors text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer flex items-center justify-center"
        title="Redo / Riwayat Berikutnya (Ctrl+Y)"
        aria-label="Redo"
      >
        <ArrowRight size={19} className="shrink-0" />
      </button>
    </div>
  );
}

export function parsePathToSegments(
  pathStr: string,
  categoryName?: string,
  pageTitle?: string,
  siblings?: { label: string; href: string }[],
): BreadcrumbSegment[] {
  // If formatted like "A > B > C"
  if (pathStr.includes(">")) {
    const parts = pathStr
      .split(">")
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.map((label, idx) => ({
      label,
      href: idx === 0 ? "/" : undefined,
    }));
  }

  // If path is URL like "/portal/projects/alpha/settings"
  const clean = pathStr.split("?")[0].replace(/^\/+|\/+$/g, "");
  const parts = clean ? clean.split("/") : [];

  if (parts.length === 0) {
    return [{ label: pageTitle || "Dashboard", href: "/" }];
  }

  const result: BreadcrumbSegment[] = [{ label: "Home", href: "/" }];

  // If we have categoryName and pageTitle provided from app shell
  if (categoryName && categoryName !== "Umum") {
    result.push({
      label: categoryName,
      siblings: siblings && siblings.length > 0 ? siblings : undefined,
    });
  }

  // Intermediate path segments if deeper
  let currentAcc = "";
  parts.forEach((part, index) => {
    currentAcc += `/${part}`;
    const formatted = part
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    // Skip if it duplicates category or root
    if (index === parts.length - 1) {
      result.push({
        label: pageTitle || formatted,
        href: currentAcc,
      });
    } else if (
      index > 0 &&
      formatted.toLowerCase() !== categoryName?.toLowerCase()
    ) {
      result.push({
        label: formatted,
        href: currentAcc,
      });
    }
  });

  return result;
}

export function HeaderBreadcrumb({
  path,
  segments: customSegments,
  className,
}: DynamicBreadcrumbProps) {
  const segments = React.useMemo(() => {
    if (customSegments && customSegments.length > 0) {
      return customSegments;
    }
    if (path) {
      return parsePathToSegments(path);
    }
    return [{ label: "Home", href: "/" }];
  }, [path, customSegments]);

  const total = segments.length;

  // Single page or root
  if (total <= 1) {
    const isHome = segments[0]?.label === "Home" || segments[0]?.label === "Rumah";
    return (
      <Breadcrumb className={className}>
        <BreadcrumbList className="flex-nowrap whitespace-nowrap text-xs">
          <BreadcrumbItem>
            {isHome ? (
              <HeaderHomeControls href={segments[0]?.href || "/home"} isPage={true} />
            ) : (
              <BreadcrumbPage className="flex items-center p-2 rounded-lg text-muted-foreground">
                <span className="truncate max-w-[120px] sm:max-w-[180px]">
                  {segments[0]?.label || "Home"}
                </span>
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // 2 items: Home > CurrentPage
  if (total === 2) {
    return (
      <Breadcrumb className={className}>
        <BreadcrumbList className="flex-nowrap whitespace-nowrap text-xs">
          <BreadcrumbItem>
            <HeaderHomeControls href={segments[0].href || "/home"} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground truncate max-w-[100px] sm:max-w-[160px]">
              {segments[1].label}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // 3 items: Home > Category / Sublevel > CurrentPage
  if (total === 3) {
    const itemMiddle = segments[1];
    const hasSiblings = itemMiddle.siblings && itemMiddle.siblings.length > 0;

    return (
      <Breadcrumb className={className}>
        <BreadcrumbList className="flex-nowrap whitespace-nowrap text-xs">
          {/* 1. Item Pertama: Home beserta panah kiri (Undo) dan kanan (Redo) */}
          <BreadcrumbItem>
            <HeaderHomeControls href={segments[0].href || "/home"} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* 2. Item Tengah (DropdownMenu jika ada sub-menu/siblings, atau link biasa) */}
          <BreadcrumbItem>
            {hasSiblings ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer transition-colors hover:text-foreground text-muted-foreground outline-none">
                  <span className="truncate max-w-[80px] sm:max-w-[120px]">{itemMiddle.label}</span>
                  <ChevronDown className="size-3 opacity-60 shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[180px] p-1 shadow-md">
                  {itemMiddle.siblings!.map((s) => (
                    <DropdownMenuItem key={s.href} asChild>
                      <Link
                        to={s.href}
                        className="w-full px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                      >
                        {s.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : itemMiddle.href ? (
              <BreadcrumbLink asChild>
                <Link to={itemMiddle.href} className="truncate max-w-[80px] sm:max-w-[120px]">
                  {itemMiddle.label}
                </Link>
              </BreadcrumbLink>
            ) : (
              <span className="text-muted-foreground truncate max-w-[80px] sm:max-w-[120px]">
                {itemMiddle.label}
              </span>
            )}
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* 3. Item Terakhir: Active Page */}
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground truncate max-w-[90px] sm:max-w-[150px]">
              {segments[2].label}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Rule Output: Total > 3 items -> Max 4 Display Parts (Collapsed/Ellipsis pattern)
  const firstItem = segments[0];
  const lastItem = segments[segments.length - 1];
  const subLevelItem = segments[segments.length - 2];
  const collapsedItems = segments.slice(1, segments.length - 2);

  const dropdownChoices =
    subLevelItem.siblings && subLevelItem.siblings.length > 0
      ? subLevelItem.siblings
      : collapsedItems.length > 0
        ? collapsedItems.map((c) => ({
            label: c.label,
            href: c.href || "/",
          }))
        : [];

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="flex-nowrap whitespace-nowrap text-xs">
        {/* 1. Item Pertama: Home beserta panah kiri (Undo) dan kanan (Redo) */}
        <BreadcrumbItem>
          <HeaderHomeControls href={firstItem.href || "/home"} />
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* 2. Item Kedua: BreadcrumbEllipsis (...) jika path > 3 tingkat */}
        <BreadcrumbItem>
          <BreadcrumbEllipsis className="size-4 text-muted-foreground shrink-0" />
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* 3. Item Ketiga: DropdownMenu yang berisi pilihan menu selevel / sub-menu relevan */}
        <BreadcrumbItem>
          {dropdownChoices.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer transition-colors hover:text-foreground text-muted-foreground outline-none">
                <span className="truncate max-w-[80px] sm:max-w-[120px]">{subLevelItem.label}</span>
                <ChevronDown className="size-3 opacity-60 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px] p-1 shadow-md">
                {dropdownChoices.map((choice) => (
                  <DropdownMenuItem key={choice.href} asChild>
                    <Link
                      to={choice.href}
                      className="w-full px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                    >
                      {choice.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : subLevelItem.href ? (
            <BreadcrumbLink asChild>
              <Link to={subLevelItem.href} className="truncate max-w-[80px] sm:max-w-[120px]">
                {subLevelItem.label}
              </Link>
            </BreadcrumbLink>
          ) : (
            <span className="text-muted-foreground truncate max-w-[80px] sm:max-w-[120px]">
              {subLevelItem.label}
            </span>
          )}
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* 4. Item Keempat: BreadcrumbPage (Halaman aktif / non-clickable) */}
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold text-foreground truncate max-w-[90px] sm:max-w-[150px]">
            {lastItem.label}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
