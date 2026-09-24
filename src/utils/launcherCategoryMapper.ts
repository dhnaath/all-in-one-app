const STORAGE_KEY_PAGE = "aio_launcher_last_page";
const STORAGE_KEY_APP = "aio_launcher_last_app";
const STORAGE_KEY_RECENT = "aio_recent_app_path";

export function getPageIndexForApp(appPath: string): number {
  if (!appPath) return 0;
  const path = appPath.split("?")[0].toLowerCase();

  // Page 0: Financial Planning & Wealth
  if (
    path.startsWith("/asset") ||
    path.startsWith("/earning") ||
    path.startsWith("/flow") ||
    path.startsWith("/grow") ||
    path.startsWith("/build") ||
    path.startsWith("/legacy") ||
    path.startsWith("/surety") ||
    path.startsWith("/kredit") ||
    path.startsWith("/pajak") ||
    path.startsWith("/zakat") ||
    path.startsWith("/syariah") ||
    path.startsWith("/investasi") ||
    path.startsWith("/valuasi") ||
    path.startsWith("/finances") ||
    path.startsWith("/budget") ||
    path.startsWith("/expense") ||
    path.startsWith("/wallet") ||
    path.startsWith("/financial-health") ||
    path.startsWith("/kalkulator-finansial")
  ) {
    return 0;
  }

  // Page 1: 100 Frameworks & Business Intelligence
  if (
    path.startsWith("/100-framework") ||
    path.startsWith("/tools-100") ||
    path.startsWith("/framework") ||
    path.startsWith("/mini-mba") ||
    path.startsWith("/swot") ||
    path.startsWith("/tows") ||
    path.startsWith("/pestel") ||
    path.startsWith("/porter") ||
    path.startsWith("/vrio") ||
    path.startsWith("/value-chain") ||
    path.startsWith("/bcg") ||
    path.startsWith("/ge-mckinsey") ||
    path.startsWith("/ansoff") ||
    path.startsWith("/blue-ocean") ||
    path.startsWith("/value-disciplines") ||
    path.startsWith("/bmc") ||
    path.startsWith("/lean-canvas") ||
    path.startsWith("/value-proposition-canvas") ||
    path.startsWith("/empathy-map") ||
    path.startsWith("/stp") ||
    path.startsWith("/marketing-mix") ||
    path.startsWith("/customer-journey-map") ||
    path.startsWith("/kano-model") ||
    path.startsWith("/product-life-cycle")
  ) {
    return 1;
  }

  // Page 2: Productivity & Office Operations
  if (
    path.startsWith("/proyek") ||
    path.startsWith("/task-manager") ||
    path.startsWith("/proyek-personal") ||
    path.startsWith("/kalender") ||
    path.startsWith("/events") ||
    path.startsWith("/notes") ||
    path.startsWith("/catatan") ||
    path.startsWith("/reading") ||
    path.startsWith("/bookmarks") ||
    path.startsWith("/ideas") ||
    path.startsWith("/goals") ||
    path.startsWith("/habits") ||
    path.startsWith("/journal") ||
    path.startsWith("/pomodoro") ||
    path.startsWith("/countdown") ||
    path.startsWith("/eisenhower") ||
    path.startsWith("/timesheet") ||
    path.startsWith("/workflow") ||
    path.startsWith("/dokumen") ||
    path.startsWith("/templates") ||
    path.startsWith("/digital-assets") ||
    path.startsWith("/domain") ||
    path.startsWith("/lisensi") ||
    path.startsWith("/vault") ||
    path.startsWith("/passwords") ||
    path.startsWith("/pocket") ||
    path.startsWith("/access-matrix") ||
    path.startsWith("/portal") ||
    path.startsWith("/katalog-produk") ||
    path.startsWith("/inventory") ||
    path.startsWith("/incoterms") ||
    path.startsWith("/reports")
  ) {
    return 2;
  }

  // Page 3: Personal Essentials & Wellbeing
  if (
    path.startsWith("/health") ||
    path.startsWith("/workouts") ||
    path.startsWith("/kebugaran") ||
    path.startsWith("/water") ||
    path.startsWith("/shopping") ||
    path.startsWith("/recipes") ||
    path.startsWith("/trips") ||
    path.startsWith("/weather") ||
    path.startsWith("/cuaca") ||
    path.startsWith("/kalkulator") ||
    path.startsWith("/reliance") ||
    path.startsWith("/growth") ||
    path.startsWith("/skincare") ||
    path.startsWith("/pouch") ||
    path.startsWith("/trunk")
  ) {
    return 3;
  }

  // Page 4: People, Family & Society
  if (
    path.startsWith("/contacts") ||
    path.startsWith("/klien") ||
    path.startsWith("/profil") ||
    path.startsWith("/paguyuban") ||
    path.startsWith("/warga") ||
    path.startsWith("/design") ||
    path.startsWith("/photography") ||
    path.startsWith("/writing") ||
    path.startsWith("/code") ||
    path.startsWith("/movies") ||
    path.startsWith("/games") ||
    path.startsWith("/podcasts") ||
    path.startsWith("/music") ||
    path.startsWith("/courses") ||
    path.startsWith("/flashcards") ||
    path.startsWith("/exams") ||
    path.startsWith("/languages")
  ) {
    return 4;
  }

  return 0;
}

export function recordActiveApp(appPath: string, pageIndex?: number): void {
  if (!appPath || appPath === "/") return;
  try {
    const page = pageIndex === undefined ? getPageIndexForApp(appPath) : pageIndex;
    localStorage.setItem(STORAGE_KEY_APP, appPath);
    localStorage.setItem(STORAGE_KEY_PAGE, String(page));
    window.dispatchEvent(
      new CustomEvent("aio_launcher_page_updated", {
        detail: { pageIndex: page, app: appPath },
      })
    );
  } catch (err) {
    console.error("Failed to record active app for launcher", err);
  }
}

export function getLastLauncherPage(maxPages = 5): number {
  try {
    const storedPage = localStorage.getItem(STORAGE_KEY_PAGE);
    if (storedPage !== null) {
      const parsed = parseInt(storedPage, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < maxPages) {
        return parsed;
      }
    }
    const recent = localStorage.getItem(STORAGE_KEY_RECENT);
    if (recent) {
      const page = getPageIndexForApp(recent);
      if (page >= 0 && page < maxPages) return page;
    }
    const lastApp = localStorage.getItem(STORAGE_KEY_APP);
    if (lastApp) {
      const page = getPageIndexForApp(lastApp);
      if (page >= 0 && page < maxPages) return page;
    }
  } catch (err) {
    console.error("Failed to get last launcher page", err);
  }
  return 0;
}

export function setLastLauncherPage(pageIndex: number, maxPages = 5): void {
  try {
    if (pageIndex >= 0 && pageIndex < maxPages) {
      localStorage.setItem(STORAGE_KEY_PAGE, String(pageIndex));
    }
  } catch (err) {
    console.error("Failed to set last launcher page", err);
  }
}
