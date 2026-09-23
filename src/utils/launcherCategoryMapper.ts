/**
 * Launcher Category Mapper
 * Memetakan rute / path aplikasi ke halaman kategori UI Launcher yang tepat.
 *
 * Halaman Kategori:
 * 0: Financial Planning & Wealth Management (FinancialWealthSection)
 * 1: 100 Tools (Tools100Section / Frameworks)
 * 2: Productivity, Operations, and Ownership (ProductivitySection)
 * 3: Personal, Essentials, and Household (PersonalEssentialsSection)
 * 4: People, Family, and Society (PeopleFamilySocietySection)
 */

export const LAUNCHER_STORAGE_KEY = "aio_launcher_last_page";
export const LAUNCHER_LAST_APP_KEY = "aio_launcher_last_app";
export const LAUNCHER_LAST_CLOSED_APP_KEY = "aio_launcher_last_closed_app";

export interface LauncherCategoryDef {
  index: number;
  title: string;
  id: string;
}

export const LAUNCHER_CATEGORIES: LauncherCategoryDef[] = [
  { index: 0, title: "Financial Planning & Wealth Management", id: "financial-wealth" },
  { index: 1, title: "100 Tools", id: "100-tools" },
  { index: 2, title: "Productivity, Operations, and Ownership", id: "productivity" },
  { index: 3, title: "Personal, Essentials, and Household", id: "personal-essentials" },
  { index: 4, title: "People, Family, and Society", id: "people-family-society" },
];

/**
 * List of known standalone app keys from `/lainnya?app=<key>` mapped to category pages
 */
const LAINNYA_APP_CATEGORY_MAP: Record<string, number> = {
  // Page 2: Productivity, Operations, and Ownership
  "daily-planner": 2,
  "roadmap": 2,
  "retro": 2,
  "canvas": 2,
  "wiki": 2,
  "workload": 2,
  "sop": 2,
  "templates": 2,
  "vendors": 2,
  "services-ratecard": 2,
  "mailroom": 2,
  "minutes": 2,
  "access-matrix": 2,

  // Page 3: Personal, Essentials, and Household
  "vision-board": 3,
  "bucket-list": 3,
  "gratitude": 3,
  "mood-tracker": 3,
  "id-wallet": 3,
  "certificates": 3,
  "price-tracker": 3,
  "wishlist-planner": 3,
  "warranty": 3,
  "subscription": 3,
  "medical-history": 3,
  "vitals": 3,
  "meal-planner": 3,
  "body-metrics": 3,
  "sleep-tracker": 3,
  "skincare-routine": 3,
  "kitchen-inventory": 3,
  "cook-log": 3,
  "expiry-alert": 3,
  "leftover-ideas": 3,
  "home-chores": 3,
  "utility-tracker": 3,
  "appliance-care": 3,
  "home-inventory": 3,
  "vehicle-identity": 3,
  "mileage-fuel": 3,
  "vehicle-service": 3,
  "parts-lifecycle": 3,
  "household-renewals": 3,
  "item-disposal": 3,

  // Page 4: People, Family, and Society
  "circle-groups": 4,
  "catchup-cadence": 4,
  "gift-tracker": 4,
  "interaction-timeline": 4,
  "borrowed-items": 4,
  "family-tree": 4,
  "family-rules": 4,
  "family-archive": 4,
  "medical-family": 4,
  "reunion-planner": 4,
  "family-anniversary": 4,
  "rt-rw-directory": 4,
  "community-announcements": 4,
  "membership-card": 4,
  "meeting-resolutions": 4,
  "volunteer-log": 4,
  "donation-tracker": 4,
  "public-services-guide": 4,
  "civic-calendar": 4,
  "disaster-prep": 4,
  "emergency-broadcast": 4,
  "civil-registry": 4,
  "tax-civic": 4,
};

/**
 * Determine the launcher category page index (0-4) for a given route/URL.
 */
export function mapAppToCategoryPage(urlOrPath: string): number {
  if (!urlOrPath || urlOrPath === "/") return 0;

  const [path, queryString] = urlOrPath.split("?");
  const searchParams = new URLSearchParams(queryString || "");

  // 1. Check for standalone /lainnya?app=...
  if (path === "/lainnya" || path.startsWith("/lainnya/")) {
    const appKey = searchParams.get("app");
    if (appKey && LAINNYA_APP_CATEGORY_MAP[appKey] !== undefined) {
      return LAINNYA_APP_CATEGORY_MAP[appKey];
    }
  }

  // 2. Check for tab query params specific to Wealth Spectrum pillars (Page 0)
  const tab = searchParams.get("tab") || "";
  if (
    tab.startsWith("cat_kepatuhan") ||
    tab.startsWith("cat_publik") ||
    tab.startsWith("cat_asuransi") ||
    tab.startsWith("cat_dana") ||
    tab.startsWith("cat_proteksi") ||
    tab.startsWith("cat_liabilitas") ||
    tab.startsWith("cat_pengeluaran") ||
    tab.startsWith("cat_kredit") ||
    tab.startsWith("cat_pajak") ||
    tab.startsWith("cat_otomatisasi") ||
    tab.startsWith("cat_modal") ||
    tab.startsWith("cat_jaringan") ||
    tab.startsWith("cat_portofolio") ||
    tab.startsWith("cat_kekayaan") ||
    tab.startsWith("cat_pembukuan") ||
    tab.startsWith("cat_profil") ||
    tab.startsWith("cat_alokasi") ||
    tab.startsWith("cat_efektif") ||
    tab.startsWith("cat_bunga") ||
    tab.startsWith("cat_rebalance") ||
    tab.startsWith("cat_pembelajaran") ||
    tab.startsWith("cat_tatakelola") ||
    tab.startsWith("cat_amal") ||
    tab.startsWith("cat_likuidasi") ||
    tab.startsWith("cat_transfer")
  ) {
    return 0; // Financial Planning & Wealth Management
  }

  // 3. Page 0: Financial Planning & Wealth Management
  if (
    path === "/kurasi-wealth" ||
    path === "/surety" ||
    path === "/flow" ||
    path === "/build" ||
    path === "/grow" ||
    path === "/legacy" ||
    path === "/outward" ||
    path === "/outlook" ||
    path === "/konsultasi" ||
    path === "/kurasi" ||
    path.startsWith("/kurasi") ||
    path === "/komoditas" ||
    path === "/100-komoditas" ||
    path === "/valuasi" ||
    path === "/commodity-dashboard" ||
    path === "/self-shaping" ||
    path === "/mutual-mapping" ||
    path === "/org-optimizing" ||
    path === "/asset" ||
    path.startsWith("/asset") ||
    path === "/aset" ||
    path === "/aset-riil" ||
    path === "/aset-likuid" ||
    path === "/aset-bisnis" ||
    path === "/liabilitas" ||
    path === "/liability" ||
    path === "/earning" ||
    path === "/pemasukan" ||
    path === "/expense" ||
    path === "/pengeluaran" ||
    path === "/budget" ||
    path === "/anggaran" ||
    path === "/cashflow" ||
    path === "/arus-kas" ||
    path === "/syariah" ||
    path.startsWith("/syariah") ||
    path === "/zakat" ||
    path.startsWith("/zakat") ||
    path === "/investasi" ||
    path.startsWith("/investasi") ||
    path === "/wakaf" ||
    path === "/waris" ||
    path === "/muamalah" ||
    path === "/net-worth" ||
    path === "/kalkulator-finansial"
  ) {
    return 0;
  }

  // 4. Page 1: 100 Tools / Frameworks
  if (
    path === "/100-framework" ||
    path.startsWith("/100-framework") ||
    path === "/tools-100" ||
    path === "/framework" ||
    path.startsWith("/framework/") ||
    path === "/mini-mba" ||
    path === "/swot" ||
    path === "/tows" ||
    path === "/pestel" ||
    path === "/porter" ||
    path === "/vrio" ||
    path === "/value-chain" ||
    path === "/bcg" ||
    path === "/ge-mckinsey" ||
    path === "/ansoff" ||
    path === "/blue-ocean" ||
    path === "/value-disciplines" ||
    path === "/bmc" ||
    path === "/lean-canvas" ||
    path === "/value-proposition-canvas" ||
    path === "/empathy-map" ||
    path === "/stp" ||
    path === "/marketing-mix" ||
    path === "/customer-journey-map" ||
    path === "/kano-model" ||
    path === "/product-life-cycle"
  ) {
    return 1;
  }

  // 5. Page 2: Productivity, Operations, and Ownership
  if (
    path === "/proyek" ||
    path.startsWith("/proyek") ||
    path === "/task-manager" ||
    path === "/proyek-personal" ||
    path === "/kalender" ||
    path === "/events" ||
    path === "/notes" ||
    path === "/catatan" ||
    path === "/reading" ||
    path === "/bookmarks" ||
    path === "/ideas" ||
    path === "/goals" ||
    path === "/habits" ||
    path === "/journal" ||
    path === "/pomodoro" ||
    path === "/countdown" ||
    path === "/eisenhower" ||
    path === "/timesheet" ||
    path === "/workflow" ||
    path === "/dokumen" ||
    path === "/templates" ||
    path === "/digital-assets" ||
    path === "/domain" ||
    path === "/lisensi" ||
    path === "/vault" ||
    path === "/passwords" ||
    path === "/pocket" ||
    path === "/access-matrix" ||
    path === "/portal" ||
    path.startsWith("/portal") ||
    path === "/katalog-produk" ||
    path === "/inventory" ||
    path === "/incoterms" ||
    path === "/reports"
  ) {
    return 2;
  }

  // 6. Page 3: Personal, Essentials, and Household
  if (
    path === "/health" ||
    path.startsWith("/health") ||
    path === "/workouts" ||
    path === "/kebugaran" ||
    path === "/water" ||
    path === "/shopping" ||
    path === "/recipes" ||
    path === "/trips" ||
    path === "/weather" ||
    path === "/cuaca" ||
    path === "/kalkulator" ||
    path === "/reliance" ||
    path === "/growth" ||
    path === "/skincare" ||
    path === "/pouch" ||
    path === "/trunk"
  ) {
    return 3;
  }

  // 7. Page 4: People, Family, and Society
  if (
    path === "/contacts" ||
    path.startsWith("/contacts") ||
    path === "/klien" ||
    path === "/profil" ||
    path === "/paguyuban" ||
    path === "/warga" ||
    path === "/design" ||
    path === "/photography" ||
    path === "/writing" ||
    path === "/code" ||
    path === "/movies" ||
    path === "/games" ||
    path === "/podcasts" ||
    path === "/music" ||
    path === "/courses" ||
    path === "/flashcards" ||
    path === "/exams" ||
    path === "/languages"
  ) {
    return 4;
  }

  // Default fallback to 0
  return 0;
}

/**
 * Record an app that was just opened.
 * Saves the app URL and its mapped category page index to localStorage.
 */
export function recordActiveApp(urlOrPath: string, explicitPageIndex?: number): void {
  if (!urlOrPath || urlOrPath === "/") return;
  try {
    const pageIndex = explicitPageIndex !== undefined
      ? explicitPageIndex
      : mapAppToCategoryPage(urlOrPath);

    localStorage.setItem(LAUNCHER_LAST_APP_KEY, urlOrPath);
    localStorage.setItem(LAUNCHER_STORAGE_KEY, String(pageIndex));
    window.dispatchEvent(
      new CustomEvent("aio_launcher_page_updated", {
        detail: { pageIndex, app: urlOrPath },
      })
    );
  } catch (e) {
    console.error("Failed to record active app for launcher", e);
  }
}

/**
 * Record an app that was just closed.
 * Saves the closed app URL and its mapped category page index to localStorage.
 */
export function recordClosedApp(urlOrPath: string, explicitPageIndex?: number): void {
  if (!urlOrPath || urlOrPath === "/") return;
  try {
    const pageIndex = explicitPageIndex !== undefined
      ? explicitPageIndex
      : mapAppToCategoryPage(urlOrPath);

    localStorage.setItem(LAUNCHER_LAST_CLOSED_APP_KEY, urlOrPath);
    localStorage.setItem(LAUNCHER_STORAGE_KEY, String(pageIndex));
    window.dispatchEvent(
      new CustomEvent("aio_launcher_page_updated", {
        detail: { pageIndex, app: urlOrPath, closed: true },
      })
    );
  } catch (e) {
    console.error("Failed to record closed app for launcher", e);
  }
}

/**
 * Get the remembered launcher category page (0 - 4).
 */
export function getLastLauncherPage(maxPages = 5): number {
  try {
    const saved = localStorage.getItem(LAUNCHER_STORAGE_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < maxPages) {
        return parsed;
      }
    }

    // Fallback: check last closed app
    const closed = localStorage.getItem(LAUNCHER_LAST_CLOSED_APP_KEY);
    if (closed) {
      const idx = mapAppToCategoryPage(closed);
      if (idx >= 0 && idx < maxPages) return idx;
    }

    // Fallback: check last active app
    const active = localStorage.getItem(LAUNCHER_LAST_APP_KEY);
    if (active) {
      const idx = mapAppToCategoryPage(active);
      if (idx >= 0 && idx < maxPages) return idx;
    }
  } catch (e) {
    console.error("Failed to get last launcher page", e);
  }
  return 0;
}

/**
 * Update the launcher page manually (e.g., when the user swipes or scrolls to another page in Launcher).
 */
export function setLastLauncherPage(pageIndex: number, maxPages = 5): void {
  try {
    if (pageIndex >= 0 && pageIndex < maxPages) {
      localStorage.setItem(LAUNCHER_STORAGE_KEY, String(pageIndex));
    }
  } catch (e) {
    console.error("Failed to set last launcher page", e);
  }
}
