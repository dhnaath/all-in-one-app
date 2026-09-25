import { Link } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { navKonsultan, type NavItem } from "../config/nav";
import { isNewlyRevisedApp } from "@/utils/revisedAppsMarker";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, Star, X, ShieldCheck, Coins, Building, Sprout, BookOpen, Users } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { Tools100Section } from "@/features/launcher/Tools100Section";
import { KurasiSection } from "@/features/launcher/KurasiSection";
import { FinancialWealthSection } from "@/features/launcher/FinancialWealthSection";
import { ProductivitySection } from "@/features/launcher/ProductivitySection";
import { PersonalEssentialsSection } from "@/features/launcher/PersonalEssentialsSection";
import { PeopleFamilySocietySection } from "@/features/launcher/PeopleFamilySocietySection";
import { useLanguage } from "@/features/finance/hooks/useLanguage";
import { translations } from "@/features/finance/translations";
import { TypewriterSearchText } from "@/app/shell/TypewriterSearchText";
import { AnimatedSearchIcon } from "@/app/shell/AnimatedSearchIcon";
import {
  getLastLauncherPage,
  setLastLauncherPage,
  recordActiveApp,
} from "@/utils/launcherCategoryMapper";

const gradients = [
  "bg-gradient-to-br from-blue-400 to-blue-600",
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-purple-400 to-purple-600",
  "bg-gradient-to-br from-orange-400 to-orange-600",
  "bg-gradient-to-br from-pink-400 to-pink-600",
  "bg-gradient-to-br from-indigo-400 to-indigo-600",
  "bg-gradient-to-br from-teal-400 to-teal-600",
  "bg-gradient-to-br from-rose-400 to-rose-600",
  "bg-gradient-to-br from-amber-400 to-amber-600",
  "bg-gradient-to-br from-cyan-400 to-cyan-600",
  "bg-gradient-to-br from-violet-400 to-violet-600",
  "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600",
  "bg-gradient-to-br from-emerald-400 to-emerald-600",
  "bg-gradient-to-br from-sky-400 to-sky-600",
  "bg-gradient-to-br from-red-400 to-red-600",
  "bg-gradient-to-br from-slate-600 to-slate-800",
];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

// Single source of truth for launcher category-page gutters so every page
// (specialized sections + default grid) keeps identical left/right/top/bottom
// spacing when swiping between pages.
const LAUNCHER_PAGE_PAD =
  "w-full shrink-0 snap-center flex-none px-4 sm:px-6 md:px-8 lg:px-12 pt-6 pb-6 flex flex-col items-center";

const SUPER_CATEGORIES = [
  {
    title: "Financial Planning & Wealth Management",
    subCategories: [
      "Asset & Earning",
      "Liability & Expense",
      "Syariah & Muamalah",
      "Value Treated",
      "Wealth Spectrum",
      "Commodity Index",
      "Phase Side",
      "Self-Shaping",
      "Mutual-Mapping",
      "Organization-Optimizing",
    ],
  },
  {
    title: "100 Tools",
    subCategories: [
      "Tahapan",
      "Strategic Management",
      "Business Model & Value Proposition",
      "Marketing & Customer Management",
      "Operations & Performance Management",
      "Financial Management & Business Feasibility",
      "Innovation, Entrepreneurship & Design",
      "Quality Management & Continuous Improvement",
      "Change Management & Organizational Development",
      "Public Policy & Program Management",
      "Decision Making & Analytical Thinking",
      "Economics & Quantitative Analysis",
      "Product Management & Agile/Scrum",
      "Sustainability, ESG & Risk Management",
      "Leadership, Talent & Culture Management",
      "Sales, Pricing & Revenue Operations",
      "Deep Tech, Innovation & Future Studies",
      "Public Relations, Crisis & Stakeholder Management",
    ],
  },
  {
    title: "Productivity, Operations, and Ownership",
    subCategories: [
      "Productivity",
      "Business",
      "Knowledge",
      "Personal",
      "Entertainment",
      "Creative",
      "Other",
    ],
  },
  {
    title: "Personal, Essentials, and Household",
    subCategories: [
      "Personal",
      "Essentials",
      "Household",
    ],
  },
  {
    title: "People, Family, and Society",
    subCategories: [
      "People, Family, and Society",
    ],
  },
];

type LauncherItem =
  | { type: "app"; item: NavItem }
  | { type: "folder"; id: string; title: string; items: NavItem[] };

function FolderTile({
  folder,
  onClick,
}: {
  folder: { id: string; title: string; items: NavItem[] };
  onClick: () => void;
}) {
  const previewItems = folder.items.slice(0, 9);

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group w-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-[1.25rem] cursor-pointer"
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] bg-slate-800/85 dark:bg-zinc-800/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm p-1.5 sm:p-2 grid grid-cols-3 gap-1 place-items-center transition-transform duration-200 group-hover:scale-110 group-active:scale-95 relative">
        {previewItems.map((item) => {
          const isRevised = isNewlyRevisedApp(item.to, item.label);
          const grad = isRevised ? "" : getGradient(item.label);
          return (
            <div
              key={item.to}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[3px] sm:rounded-[4px] flex items-center justify-center shadow-xs ${
                isRevised
                  ? "bg-white text-zinc-900 border border-zinc-300 dark:border-white shadow-2xs"
                  : `${grad} text-white`
              }`}
            >
              <item.icon className={`size-1.5 sm:size-2 ${isRevised ? "opacity-100 text-zinc-900" : "opacity-95 text-white"}`} strokeWidth={2.2} />
            </div>
          );
        })}
        {folder.items.length > 9 && (
          <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[9px] font-bold px-1 rounded-full shadow-xs">
            +{folder.items.length - 9}
          </span>
        )}
      </div>
      <span className="text-xs sm:text-sm text-foreground/90 font-medium text-center line-clamp-2 leading-tight px-1 group-hover:text-foreground">
        {folder.title}
      </span>
    </button>
  );
}

export function Launcher() {
  const lang = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeSubCategories, setActiveSubCategories] = useState<Record<string, string>>({});
  const [activeFolder, setActiveFolder] = useState<{ id: string; title: string; items: NavItem[] } | null>(null);
  const { favorites, toggleFavorite } = useFavorites();

  // iOS Page Indicator <-> Search Pill transition state (2s idle timer)
  const [showSearch, setShowSearch] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = () => {
    setShowSearch(false);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      setShowSearch(true);
    }, 2000);
  };

  // Initially start in dots mode, then transition to Search after 2 seconds idle
  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  const pillarFolderInfo = useMemo(() => {
    if (!activeFolder) return null;
    if (activeFolder.id === "folder-pilar-surety") {
      return {
        id: "folder-pilar-surety",
        label: "Surety",
        icon: ShieldCheck,
        title: translations.landing.categories.surety.desc[lang],
        longDesc: translations.landing.categories.surety.long[lang],
      };
    }
    if (activeFolder.id === "folder-pilar-flow") {
      return {
        id: "folder-pilar-flow",
        label: "Flow",
        icon: Coins,
        title: translations.landing.categories.flow.desc[lang],
        longDesc: translations.landing.categories.flow.long[lang],
      };
    }
    if (activeFolder.id === "folder-pilar-build") {
      return {
        id: "folder-pilar-build",
        label: "Build",
        icon: Building,
        title: translations.landing.categories.build.desc[lang],
        longDesc: translations.landing.categories.build.long[lang],
      };
    }
    if (activeFolder.id === "folder-pilar-grow") {
      return {
        id: "folder-pilar-grow",
        label: "Grow",
        icon: Sprout,
        title: translations.landing.categories.grow.desc[lang],
        longDesc: translations.landing.categories.grow.long[lang],
      };
    }
    if (activeFolder.id === "folder-pilar-legacy") {
      return {
        id: "folder-pilar-legacy",
        label: "Legacy",
        icon: BookOpen,
        title: translations.landing.categories.legacy.desc[lang],
        longDesc: translations.landing.categories.legacy.long[lang],
      };
    }
    return null;
  }, [activeFolder, lang]);

  // Close folder modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveFolder(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const pages = useMemo(() => {
    return SUPER_CATEGORIES.map((superCat) => {
      if (
        superCat.title === "People, Family, and Society" ||
        superCat.title === "People, Family, Society"
      ) {
        const g = navKonsultan.find((group) => group.title === "People, Family, and Society");
        const rawValid = (g?.items || []).filter((item) => item.to !== "/");
        return {
          title: superCat.title,
          subCategories: [
            {
              title: "People, Family, and Society",
              rawItems: rawValid.length > 0 ? rawValid : [
                { to: "/contacts", label: "Kontak & CRM", icon: Users },
              ],
            },
          ],
        };
      }

      const subCategories = superCat.subCategories
        .map((subTitle) => {
          if (subTitle === "Phase Side") {
            const selfShaping = navKonsultan.find((g) => g.title === "Self-Shaping")?.items || [];
            const mutualMapping = navKonsultan.find((g) => g.title === "Mutual-Mapping")?.items || [];
            const orgOptimizing = navKonsultan.find((g) => g.title === "Organization-Optimizing")?.items || [];
            const rawValid = [...selfShaping, ...mutualMapping, ...orgOptimizing].filter(
              (item) => item.to !== "/"
            );
            return {
              title: "Phase Side",
              rawItems: rawValid,
            };
          }
          const g = navKonsultan.find((group) => group.title === subTitle);
          const rawValid = (g?.items || []).filter((item) => item.to !== "/");
          return {
            title: subTitle,
            rawItems: rawValid,
          };
        })
        .filter((sub) => sub.rawItems.length > 0);

      return {
        title: superCat.title,
        subCategories,
      };
    }).filter((page) => page.subCategories.some((sub) => sub.rawItems.length > 0));
  }, []);

  // Restore category page based on last opened or closed menu app
  useEffect(() => {
    if (!pages.length) return;
    const targetPage = getLastLauncherPage(pages.length);
    setCurrentPage(targetPage);

    const applyScroll = (instant = false) => {
      if (scrollRef.current) {
        const el = scrollRef.current;
        const width = el.clientWidth;
        if (width > 0 && targetPage >= 0) {
          const prevBehavior = el.style.scrollBehavior;
          if (instant) {
            el.style.scrollBehavior = "auto";
          }
          el.scrollLeft = targetPage * width;
          if (instant) {
            requestAnimationFrame(() => {
              if (el) {
                el.style.scrollBehavior = prevBehavior || "smooth";
              }
            });
          }
        }
      }
    };

    // Immediate instant position on initial mount
    applyScroll(true);

    const timer1 = setTimeout(() => applyScroll(true), 30);
    const timer2 = setTimeout(() => applyScroll(true), 120);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pages.length]);

  // Listen to cross-component launcher page updates
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<{ pageIndex?: number }>;
      if (custom.detail && typeof custom.detail.pageIndex === "number") {
        const p = custom.detail.pageIndex;
        if (p >= 0 && p < pages.length) {
          setCurrentPage(p);
          scrollToPage(p);
        }
      }
    };
    window.addEventListener("aio_launcher_page_updated", handleUpdate);
    return () => window.removeEventListener("aio_launcher_page_updated", handleUpdate);
  }, [pages.length]);

  // Handle scroll to update current page and persist it
  useEffect(() => {
    let timeoutId: any = null;
    const handleScroll = () => {
      resetIdleTimer();
      if (scrollRef.current) {
        const { scrollLeft, clientWidth } = scrollRef.current;
        if (clientWidth > 0) {
          const page = Math.round(scrollLeft / clientWidth);
          if (page >= 0 && page < pages.length) {
            setCurrentPage(page);
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              setLastLauncherPage(page, pages.length);
            }, 100);
          }
        }
      }
    };
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
      el.addEventListener("touchmove", resetIdleTimer, { passive: true });
      el.addEventListener("pointerdown", resetIdleTimer, { passive: true });
      el.addEventListener("wheel", resetIdleTimer, { passive: true });
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", handleScroll);
        el.removeEventListener("touchmove", resetIdleTimer);
        el.removeEventListener("pointerdown", resetIdleTimer);
        el.removeEventListener("wheel", resetIdleTimer);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pages.length]);

  const scrollToPage = (pageIndex: number) => {
    resetIdleTimer();
    if (scrollRef.current && pageIndex >= 0 && pageIndex < pages.length) {
      scrollRef.current.scrollTo({
        left: pageIndex * scrollRef.current.clientWidth,
        behavior: "smooth",
      });
      setCurrentPage(pageIndex);
      setLastLauncherPage(pageIndex, pages.length);
    }
  };

  const setSubCategory = (pageTitle: string, subCategoryTitle: string | null) => {
    setActiveSubCategories((prev) => ({
      ...prev,
      [pageTitle]: subCategoryTitle || "All",
    }));
  };

  return (
    <AppShell title="Launcher" subtitle="Aplikasi">
      <div className="flex-1 w-full max-w-[1720px] mx-auto relative bg-background/50 flex flex-col">
        {/* Pages Container */}
        <div 
          ref={scrollRef}
          className="w-full flex overflow-x-auto snap-x snap-mandatory [hide-scrollbar::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollBehavior: "smooth" }}
        >
          {pages.length > 0 ? (
            pages.map((page, pageIdx) => {
              if (
                page.title === "Financial Planning & Wealth Management" ||
                page.title === "Financial & Wealth Management" ||
                page.title === "Wealth Management" ||
                page.title === "Financial Planning"
              ) {
                return (
                  <div
                    key={pageIdx}
                    className={LAUNCHER_PAGE_PAD}
                  >
                    <FinancialWealthSection
                      page={page}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      setActiveFolder={setActiveFolder}
                      getGradient={getGradient}
                      FolderTile={FolderTile}
                    />
                  </div>
                );
              }

              if (page.title === "100 Tools") {
                return (
                  <div
                    key={pageIdx}
                    className={LAUNCHER_PAGE_PAD}
                  >
                    <Tools100Section
                      page={page}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      setActiveFolder={setActiveFolder}
                      getGradient={getGradient}
                      FolderTile={FolderTile}
                    />
                  </div>
                );
              }

              if (
                page.title === "Productivity, Operations, and Ownership" ||
                page.title === "Productivity" ||
                page.title === "Produktivitas"
              ) {
                return (
                  <div
                    key={pageIdx}
                    className={LAUNCHER_PAGE_PAD}
                  >
                    <ProductivitySection
                      page={page}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      setActiveFolder={setActiveFolder}
                      getGradient={getGradient}
                      FolderTile={FolderTile}
                    />
                  </div>
                );
              }

              if (
                page.title === "Personal, Essentials, and Household" ||
                page.title === "Personal, Essentials, Household"
              ) {
                return (
                  <div
                    key={pageIdx}
                    className={LAUNCHER_PAGE_PAD}
                  >
                    <PersonalEssentialsSection
                      page={page}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      setActiveFolder={setActiveFolder}
                      getGradient={getGradient}
                      FolderTile={FolderTile}
                    />
                  </div>
                );
              }

              if (
                page.title === "People, Family, and Society" ||
                page.title === "People, Family, Society"
              ) {
                return (
                  <div
                    key={pageIdx}
                    className={LAUNCHER_PAGE_PAD}
                  >
                    <PeopleFamilySocietySection
                      page={page}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      setActiveFolder={setActiveFolder}
                      getGradient={getGradient}
                      FolderTile={FolderTile}
                    />
                  </div>
                );
              }

              const activeSub = activeSubCategories[page.title] || "All";

              // Filter subcategories for this view
              const filteredSubs =
                activeSub === "All"
                  ? page.subCategories
                  : page.subCategories.filter((sub) => sub.title === activeSub);

              // Specific Rules:
              // 1. In "Asset", the 6 asset instruments are grouped into "Type of Assets" folder,
              //    while "Kuadran Aset" remains an individual app.
              // 2. In "Wealth Spectrum", Kepatuhan Hukum, Perlindungan Publik, Asuransi Pribadi,
              //    Kecukupan Dana, dan Proteksi Aset are grouped into "Pilar Surety" folder.
              // 3. Similarly for "Flow", the 5 sub-pillars (Beban Liabilitas, Pemasukan-Pengeluaran,
              //    Kas-Kredit, Retribusi-Kontribusi, Sistem Otomatisasi) are grouped into "Pilar Flow" folder,
              //    while Tahap 1: Surety, Tahap 2: Flow, and Tahap 3-5 remain individual apps.
              const currentItems: LauncherItem[] = [];
              filteredSubs.forEach((sub) => {
                if (sub.title === "Asset" || sub.title === "Asset & Earning") {
                  const kuadran = sub.rawItems.find((i) => i.to === "/asset");
                  const instruments = sub.rawItems.filter((i) => i.to !== "/asset");
                  if (kuadran) {
                    currentItems.push({ type: "app", item: kuadran });
                  }
                  instruments.forEach((inst) => {
                    currentItems.push({ type: "app", item: inst });
                  });
                } else if (sub.title === "Wealth Spectrum") {
                  const suretyPillarUrls = [
                    "/surety?tab=cat_kepatuhan",
                    "/surety?tab=cat_publik",
                    "/surety?tab=cat_asuransi",
                    "/surety?tab=cat_dana",
                    "/surety?tab=cat_proteksi",
                  ];
                  const flowPillarUrls = [
                    "/flow?tab=cat_liabilitas",
                    "/flow?tab=cat_pengeluaran",
                    "/flow?tab=cat_kredit",
                    "/flow?tab=cat_pajak",
                    "/flow?tab=cat_otomatisasi",
                  ];
                  const buildPillarUrls = [
                    "/build?tab=cat_modal",
                    "/build?tab=cat_jaringan",
                    "/build?tab=cat_portofolio",
                    "/build?tab=cat_kekayaan",
                    "/build?tab=cat_pembukuan",
                  ];
                  const growPillarUrls = [
                    "/grow?tab=cat_profil",
                    "/grow?tab=cat_alokasi",
                    "/grow?tab=cat_efektif",
                    "/grow?tab=cat_bunga",
                    "/grow?tab=cat_rebalance",
                  ];
                  const legacyPillarUrls = [
                    "/legacy?tab=cat_pembelajaran",
                    "/legacy?tab=cat_tatakelola",
                    "/legacy?tab=cat_amal",
                    "/legacy?tab=cat_likuidasi",
                    "/legacy?tab=cat_transfer",
                  ];

                  const suretyPillars = sub.rawItems.filter((i) =>
                    suretyPillarUrls.includes(i.to)
                  );
                  const flowPillars = sub.rawItems.filter((i) =>
                    flowPillarUrls.includes(i.to)
                  );
                  const buildPillars = sub.rawItems.filter((i) =>
                    buildPillarUrls.includes(i.to)
                  );
                  const growPillars = sub.rawItems.filter((i) =>
                    growPillarUrls.includes(i.to)
                  );
                  const legacyPillars = sub.rawItems.filter((i) =>
                    legacyPillarUrls.includes(i.to)
                  );

                  const allPillars = [
                    ...suretyPillarUrls,
                    ...flowPillarUrls,
                    ...buildPillarUrls,
                    ...growPillarUrls,
                    ...legacyPillarUrls,
                  ];
                  const otherItems = sub.rawItems.filter(
                    (i) => !allPillars.includes(i.to)
                  );

                  const tahap1 = otherItems.find((i) => i.to === "/surety");
                  const tahap2 = otherItems.find((i) => i.to === "/flow");
                  const tahap3 = otherItems.find((i) => i.to === "/build");
                  const tahap4 = otherItems.find((i) => i.to === "/grow");
                  const tahap5 = otherItems.find((i) => i.to === "/legacy");
                  const remainingTahap = otherItems.filter(
                    (i) =>
                      i.to !== "/surety" &&
                      i.to !== "/flow" &&
                      i.to !== "/build" &&
                      i.to !== "/grow" &&
                      i.to !== "/legacy"
                  );

                  if (suretyPillars.length > 0) {
                    currentItems.push({
                      type: "folder",
                      id: "folder-pilar-surety",
                      title: "Surety",
                      items: suretyPillars,
                    });
                  }

                  if (flowPillars.length > 0) {
                    currentItems.push({
                      type: "folder",
                      id: "folder-pilar-flow",
                      title: "Flow",
                      items: flowPillars,
                    });
                  }

                  if (buildPillars.length > 0) {
                    currentItems.push({
                      type: "folder",
                      id: "folder-pilar-build",
                      title: "Build",
                      items: buildPillars,
                    });
                  }

                  if (growPillars.length > 0) {
                    currentItems.push({
                      type: "folder",
                      id: "folder-pilar-grow",
                      title: "Grow",
                      items: growPillars,
                    });
                  }

                  if (legacyPillars.length > 0) {
                    currentItems.push({
                      type: "folder",
                      id: "folder-pilar-legacy",
                      title: "Legacy",
                      items: legacyPillars,
                    });
                  }

                  remainingTahap.forEach((item) => {
                    currentItems.push({ type: "app", item });
                  });
                } else if (sub.title === "Phase Side") {
                  const selfShapingItems =
                    navKonsultan
                      .find((g) => g.title === "Self-Shaping")
                      ?.items.filter((i) => i.to !== "/") || [];
                  const mutualMappingItems =
                    navKonsultan
                      .find((g) => g.title === "Mutual-Mapping")
                      ?.items.filter((i) => i.to !== "/") || [];
                  const orgOptimizingItems =
                    navKonsultan
                      .find((g) => g.title === "Organization-Optimizing")
                      ?.items.filter((i) => i.to !== "/") || [];

                  if (selfShapingItems.length > 0) {
                    currentItems.push({
                      type: "folder",
                      id: "folder-self-shaping",
                      title: "Self-Shaping",
                      items: selfShapingItems,
                    });
                  }
                  if (mutualMappingItems.length > 0) {
                    currentItems.push({
                      type: "folder",
                      id: "folder-mutual-mapping",
                      title: "Mutual-Mapping",
                      items: mutualMappingItems,
                    });
                  }
                  if (orgOptimizingItems.length > 0) {
                    currentItems.push({
                      type: "folder",
                      id: "folder-organization-optimizing",
                      title: "Organization-Optimizing",
                      items: orgOptimizingItems,
                    });
                  }
                } else if (page.title === "Kehidupan Pribadi" || page.title === "Produktivitas") {
                  if (sub.rawItems.length > 0) {
                    currentItems.push({
                      type: "folder",
                      id: `folder-${sub.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
                      title: sub.title,
                      items: sub.rawItems,
                    });
                  }
                } else {
                  sub.rawItems.forEach((item) => {
                    currentItems.push({ type: "app", item });
                  });
                }
              });

              return (
                <div 
                  key={pageIdx} 
                  className={LAUNCHER_PAGE_PAD}
                >
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground/80 mb-8 tracking-tight">
                    {page.title}
                  </h3>
                  
                  {/* Subcategory Pills */}
                  <div 
                    className="w-full max-w-5xl mb-10 overflow-x-auto [&::-webkit-scrollbar]:hidden" 
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <div className="flex flex-nowrap items-center gap-3 w-max mx-auto px-2 py-1">
                      <button
                        onClick={() => setSubCategory(page.title, "All")}
                        className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          activeSub === "All"
                            ? "bg-primary text-primary-foreground shadow-md scale-105"
                            : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
                        }`}
                      >
                        Semua
                      </button>
                      {page.subCategories.map((sub) => (
                        <button
                          key={sub.title}
                          onClick={() => setSubCategory(page.title, sub.title)}
                          className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            activeSub === sub.title
                              ? "bg-primary text-primary-foreground shadow-md scale-105"
                              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
                          }`}
                        >
                          {sub.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Launcher Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-6 gap-y-8 place-items-start max-w-[1400px] mx-auto w-full mb-10">
                    {currentItems.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-sm text-muted-foreground italic w-full">
                        Belum ada modul di kategori ini (masih kosong).
                      </div>
                    ) : (
                      currentItems.map((entry) => {
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
                        const isRevised = isNewlyRevisedApp(item.to, item.label);
                        const gradient = isRevised ? "" : getGradient(item.label);
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
                            onClick={() => {
                              recordActiveApp(item.to, pageIdx);
                            }}
                            className="flex flex-col items-center gap-3 group w-full outline-none relative"
                            title={isRevised ? `${item.label} (Tanda Sementara: Modul Baru Direvisi)` : item.label}
                          >
                            <div 
                              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110 group-active:scale-95 relative ${
                                isRevised
                                  ? "bg-white text-zinc-900 border-2 border-zinc-200 dark:border-white shadow-md ring-2 ring-white/60"
                                  : `${gradient} text-white`
                              }`}
                            >
                              <item.icon
                                className={`size-7 sm:size-8 ${
                                  isRevised
                                    ? "text-zinc-900 drop-shadow-none"
                                    : "opacity-90 drop-shadow-sm text-white"
                                }`}
                                strokeWidth={isRevised ? 2 : 1.5}
                              />
                              
                              {/* Tanda Sementara dot indicator */}
                              {isRevised && (
                                <span
                                  className="absolute -top-1 -left-1 size-3 rounded-full bg-white border border-zinc-400 shadow-xs"
                                  title="Tanda Sementara"
                                />
                              )}

                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleFavorite(item.to);
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
                              {item.label}
                            </span>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full flex items-center justify-center py-20 text-muted-foreground">
              Tidak ada aplikasi ditemukan.
            </div>
          )}
        </div>

        {/* iOS-Style Floating Page Indicator / Search Pill above Dock */}
        {pages.length > 0 && (
          <div className="fixed bottom-[calc(5rem+10pt)] left-0 right-0 flex justify-center pb-1 pointer-events-none z-30">
            <div
              className={`pointer-events-auto relative group flex items-center justify-center rounded-full bg-card/75 dark:bg-card/60 backdrop-blur-xl border border-border/80 shadow-lg select-none transition-all duration-300 ease-out h-[28.5px] ${
                showSearch
                  ? "px-4 min-w-[88px] cursor-pointer hover:bg-accent/80 hover:border-border active:scale-95"
                  : "px-3.5 min-w-[74px] cursor-default"
              }`}
              onClick={() => {
                if (showSearch) {
                  window.dispatchEvent(new CustomEvent("aio_open_search"));
                }
              }}
              title={showSearch ? "Cari Cepat (Search)" : undefined}
            >
              {/* Layer 1: Search View (Morphs / crossfades in when idle for 2s) */}
              <div
                className={`flex items-center gap-1.5 transition-all duration-300 ease-out ${
                  showSearch
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-90 translate-y-0.5 absolute pointer-events-none"
                }`}
              >
                <AnimatedSearchIcon active={showSearch} className="size-[13px] text-muted-foreground group-hover:text-foreground transition-colors shrink-0" strokeWidth={2.4} />
                <TypewriterSearchText active={showSearch} speed={50} startDelay={70} />
              </div>

              {/* Layer 2: Dots View (Active initially & when scrolling/swiping) */}
              <div
                className={`flex items-center gap-1.5 transition-all duration-300 ease-out ${
                  !showSearch
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-90 -translate-y-0.5 absolute pointer-events-none"
                }`}
              >
                {pages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToPage(idx);
                    }}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      currentPage === idx
                        ? "bg-primary w-3 h-2 shadow-xs"
                        : "bg-muted-foreground/35 hover:bg-muted-foreground/60 size-2"
                    }`}
                    aria-label={`Ke halaman ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Interactive iOS Folder Modal */}
        {activeFolder && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setActiveFolder(null)}
          >
            <div
              className="relative max-w-xl w-full bg-card/95 dark:bg-zinc-900/95 border border-border/50 shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/40">
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-foreground">
                    {activeFolder.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {activeFolder.id === "folder-type-of-assets"
                      ? `${activeFolder.items.length} Jenis Instrumen Aset`
                      : activeFolder.id === "folder-pilar-surety"
                      ? `${activeFolder.items.length} Pilar Proteksi & Mitigasi Risiko`
                      : activeFolder.id === "folder-pilar-flow"
                      ? `${activeFolder.items.length} Pilar Arus Kas & Likuiditas`
                      : activeFolder.id === "folder-pilar-build"
                      ? `${activeFolder.items.length} Pilar Pembangunan & Akumulasi Modal`
                      : activeFolder.id === "folder-pilar-grow"
                      ? `${activeFolder.items.length} Pilar Pertumbuhan & Alokasi Portofolio`
                      : activeFolder.id === "folder-pilar-legacy"
                      ? `${activeFolder.items.length} Pilar Warisan & Tata Kelola Generasi`
                      : activeFolder.id === "folder-self-shaping"
                      ? `${activeFolder.items.length} Modul Self-Shaping & Pengembangan Karakter`
                      : activeFolder.id === "folder-mutual-mapping"
                      ? `${activeFolder.items.length} Modul Mutual-Mapping & Hubungan Antarpribadi`
                      : activeFolder.id === "folder-organization-optimizing"
                      ? `${activeFolder.items.length} Modul Organization-Optimizing & Tata Kelola Organisasi`
                      : activeFolder.id === "folder-personal-growth"
                      ? `${activeFolder.items.length} Aplikasi Pengembangan Diri, Target & Kebiasaan`
                      : activeFolder.id === "folder-personal-storage"
                      ? `${activeFolder.items.length} Aplikasi Brankas, Dompet & Penyimpanan Pribadi`
                      : activeFolder.id === "folder-wellbeing"
                      ? `${activeFolder.items.length} Aplikasi Kesehatan & Kebugaran Diri`
                      : activeFolder.id === "folder-lifestyle"
                      ? `${activeFolder.items.length} Aplikasi Gaya Hidup & Perjalanan`
                      : activeFolder.id === "folder-entertainment"
                      ? `${activeFolder.items.length} Aplikasi Hiburan, Musik & Game`
                      : activeFolder.id === "folder-education"
                      ? `${activeFolder.items.length} Aplikasi Pembelajaran & Edukasi`
                      : activeFolder.id === "folder-creativity"
                      ? `${activeFolder.items.length} Aplikasi Kreativitas & Desain`
                      : activeFolder.id === "folder-proyek-portal-klien"
                      ? `${activeFolder.items.length} Modul Proyek & Komunikasi Klien`
                      : activeFolder.id === "folder-productivity"
                      ? `${activeFolder.items.length} Alat Efisiensi & Produktivitas Kerja`
                      : activeFolder.id === "folder-memos"
                      ? `${activeFolder.items.length} Aplikasi Catatan, Memo & Ide`
                      : activeFolder.id === "folder-lain-lain"
                      ? `${activeFolder.items.length} Utilitas Tambahan & Lain-lain`
                      : `${activeFolder.items.length} Modul Terkait`}
                  </p>
                </div>
                <button
                  onClick={() => setActiveFolder(null)}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Tutup Folder"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Pillar Overview Header Card (when inside any pillar folder) */}
              {pillarFolderInfo && (
                <div
                  id={`${pillarFolderInfo.id}-overview-card`}
                  className="mb-5 p-4 sm:p-5 rounded-2xl bg-card/60 dark:bg-muted/30 border border-border/50 text-left transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <pillarFolderInfo.icon className="size-4 text-primary shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {pillarFolderInfo.label}
                    </span>
                  </div>
                  <h2
                    id={`${pillarFolderInfo.id}-title`}
                    className="text-base sm:text-lg font-bold text-foreground mb-2"
                  >
                    {pillarFolderInfo.title}
                  </h2>
                  <p
                    id={`${pillarFolderInfo.id}-desc`}
                    className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto"
                  >
                    {pillarFolderInfo.longDesc}
                  </p>
                </div>
              )}

              {/* Grid of full app icons */}
              <div
                id={pillarFolderInfo ? `folder-grid-${pillarFolderInfo.id}` : "folder-grid-apps"}
                className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6 place-items-center max-h-[60vh] overflow-y-auto py-2 px-1 [&::-webkit-scrollbar]:hidden"
              >
                {activeFolder.items.map((item) => {
                  const isRevised = isNewlyRevisedApp(item.to, item.label);
                  const gradient = isRevised ? "" : getGradient(item.label);
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
                      onClick={() => {
                        setActiveFolder(null);
                        recordActiveApp(item.to, currentPage);
                      }}
                      className="flex flex-col items-center gap-2.5 group w-full outline-none relative"
                      title={isRevised ? `${item.label} (Tanda Sementara: Modul Baru Direvisi)` : item.label}
                    >
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110 group-active:scale-95 relative ${
                          isRevised
                            ? "bg-white text-zinc-900 border-2 border-zinc-200 dark:border-white shadow-md ring-2 ring-white/60"
                            : `${gradient} text-white`
                        }`}
                      >
                        <item.icon
                          className={`size-7 sm:size-8 ${
                            isRevised
                              ? "text-zinc-900 drop-shadow-none"
                              : "opacity-90 drop-shadow-sm text-white"
                          }`}
                          strokeWidth={isRevised ? 2 : 1.5}
                        />
                        
                        {/* Tanda Sementara dot indicator */}
                        {isRevised && (
                          <span
                            className="absolute -top-1 -left-1 size-3 rounded-full bg-white border border-zinc-400 shadow-xs"
                            title="Tanda Sementara"
                          />
                        )}

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(item.to);
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
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 pt-3 border-t border-border/40 text-center text-xs text-muted-foreground">
                Klik aplikasi untuk membuka • Tekan <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60 text-[10px] font-mono">Esc</kbd> atau klik di luar untuk menutup
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}


