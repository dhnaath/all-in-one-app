/**
 * Launcher Category Mapper
 * Maps applications to their corresponding category page in the Launcher.
 *
 * Category Pages:
 * 0: Wealth Management (KurasiSection)
 * 1: 100 Tools (Tools100Section / Frameworks)
 * 2: Financial Planning (MoneyTrackerSection / Asset & Cashflow)
 * 3: Productivity, Operations, and Ownership (ProductivitySection)
 * 4: Personal, Essentials, and Household (PersonalEssentialsSection)
 * 5: People, Family, and Society (PeopleFamilySocietySection)
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
  { index: 0, title: "Wealth Management", id: "wealth-management" },
  { index: 1, title: "100 Tools", id: "100-tools" },
  { index: 2, title: "Financial Planning", id: "financial-planning" },
  { index: 3, title: "Productivity, Operations, and Ownership", id: "productivity" },
  { index: 4, title: "Personal, Essentials, and Household", id: "personal-essentials" },
  { index: 5, title: "People, Family, and Society", id: "people-family-society" },
];

/**
 * List of known standalone app keys from `/lainnya?app=<key>` mapped to category pages
 */
const LAINNYA_APP_CATEGORY_MAP: Record<string, number> = {
  // Page 3: Productivity, Operations, and Ownership
  "daily-planner": 3,
  "roadmap": 3,
  "retro": 3,
  "canvas": 3,
  "wiki": 3,
  "workload": 3,
  "sop": 3,
  "templates": 3,
  "vendors": 3,
  "services-ratecard": 3,
  "mailroom": 3,
  "minutes": 3,
  "access-matrix": 3,

  // Page 4: Personal, Essentials, and Household
  "vision-board": 4,
  "bucket-list": 4,
  "gratitude": 4,
  "mood-tracker": 4,
  "id-wallet": 4,
  "certificates": 4,
  "price-tracker": 4,
  "wishlist-planner": 4,
  "warranty": 4,
  "subscription": 4,
  "medical-history": 4,
  "vitals": 4,
  "meal-planner": 4,
  "body-metrics": 4,
  "sleep-tracker": 4,
  "skincare-routine": 4,
  "kitchen-inventory": 4,
  "cook-log": 4,
  "expiry-alert": 4,
  "leftover-ideas": 4,
  "home-chores": 4,
  "utility-tracker": 4,
  "appliance-care": 4,
  "home-inventory": 4,
  "vehicle-identity": 4,
  "mileage-fuel": 4,
  "vehicle-service": 4,
  "parts-lifecycle": 4,
  "household-renewals": 4,
  "item-disposal": 4,

  // Page 5: People, Family, and Society
  "circle-groups": 5,
  "catchup-cadence": 5,
  "gift-tracker": 5,
  "interaction-timeline": 5,
  "borrowed-items": 5,
  "family-tree": 5,
  "family-rules": 5,
  "family-archive": 5,
  "medical-family": 5,
  "reunion-planner": 5,
  "family-anniversary": 5,
  "rt-rw-directory": 5,
  "community-announcements": 5,
  "membership-card": 5,
  "meeting-resolutions": 5,
  "volunteer-log": 5,
  "donation-tracker": 5,
  "public-services-guide": 5,
  "civic-calendar": 5,
  "disaster-prep": 5,
  "emergency-broadcast": 5,
  "civil-registry": 5,
  "tax-civic": 5,
};

/**
 * Determine the launcher category page index (0-5) for a given route/URL.
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
    return 0; // Wealth Management
  }

  // 3. Page 0: Wealth Management
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
    path === "/komoditas" ||
    path === "/self-shaping" ||
    path === "/mutual-mapping" ||
    path === "/org-optimizing"
  ) {
    return 0;
  }

  // 4. Page 1: 100 Tools / Frameworks
  if (
    path === "/100-framework" ||
    path.startsWith("/100-framework") ||
    path === "/tools-100" ||
    path === "/framework" ||
    path === "/mini-mba"
  ) {
    return 1;
  }

  // 5. Page 2: Financial Planning
  if (
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
    path === "/zakat" ||
    path === "/wakaf" ||
    path === "/waris" ||
    path === "/muamalah" ||
    path === "/net-worth" ||
    path === "/kalkulator-finansial"
  ) {
    return 2;
  }

  // 6. Page 5: People, Family, and Society
  if (
    path === "/contacts" ||
    path.startsWith("/contacts") ||
    path === "/klien" ||
    path === "/portal.pesan" ||
    path === "/trips" ||
    path === "/profil" ||
    path === "/paguyuban" ||
    path === "/warga"
  ) {
    return 5;
  }

  // 7. Page 4: Personal, Essentials, and Household
  if (
    path === "/health" ||
    path.startsWith("/health") ||
    path === "/workouts" ||
    path === "/kebugaran" ||
    path === "/shopping" ||
    path === "/weather" ||
    path === "/cuaca" ||
    path === "/kalkulator" ||
    path === "/habits" ||
    path === "/goals" ||
    path === "/reliance" ||
    path === "/growth" ||
    path === "/proyek-personal" ||
    path === "/skincare" ||
    path === "/inventory" ||
    path === "/pouch"
  ) {
    return 4;
  }

  // 8. Page 3: Productivity, Operations, and Ownership
  if (
    path === "/proyek" ||
    path.startsWith("/proyek") ||
    path === "/task-manager" ||
    path === "/kalender" ||
    path === "/events" ||
    path === "/notes" ||
    path === "/catatan" ||
    path === "/reading" ||
    path === "/bookmarks" ||
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
    path === "/portal.dokumen"
  ) {
    return 3;
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
 * Get the remembered launcher category page (0 - 5).
 */
export function getLastLauncherPage(maxPages = 6): number {
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
export function setLastLauncherPage(pageIndex: number, maxPages = 6): void {
  try {
    if (pageIndex >= 0 && pageIndex < maxPages) {
      localStorage.setItem(LAUNCHER_STORAGE_KEY, String(pageIndex));
    }
  } catch (e) {
    console.error("Failed to set last launcher page", e);
  }
}
