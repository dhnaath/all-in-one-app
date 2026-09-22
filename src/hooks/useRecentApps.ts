import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "aio_recent_apps";

export interface RecentAppItem {
  id: string;
  to: string;
  label: string;
  visitedAt: number;
  category?: string;
}

const DEFAULT_RECENT: RecentAppItem[] = [
  {
    id: "/home",
    to: "/home",
    label: "Beranda Eksekutif",
    visitedAt: Date.now() - 5 * 60 * 1000,
    category: "Navigasi",
  },
  {
    id: "/proyek",
    to: "/proyek",
    label: "Proyek & Operasional",
    visitedAt: Date.now() - 15 * 60 * 1000,
    category: "Produktivitas",
  },
  {
    id: "/kalender",
    to: "/kalender",
    label: "Kalender & Timeline",
    visitedAt: Date.now() - 30 * 60 * 1000,
    category: "Jadwal",
  },
  {
    id: "/catatan",
    to: "/catatan",
    label: "Catatan & Notula",
    visitedAt: Date.now() - 55 * 60 * 1000,
    category: "Dokumen",
  },
];

export function useRecentApps() {
  const [recentApps, setRecentApps] = useState<RecentAppItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return DEFAULT_RECENT;
    } catch {
      return DEFAULT_RECENT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentApps));
    } catch (e) {
      console.error("Failed to save recent apps", e);
    }
  }, [recentApps]);

  const addRecentApp = useCallback((app: { to: string; label: string; category?: string }) => {
    if (!app.to) return;
    setRecentApps((prev) => {
      const filtered = prev.filter((item) => item.to !== app.to);
      const newItem: RecentAppItem = {
        id: app.to,
        to: app.to,
        label: app.label,
        visitedAt: Date.now(),
        category: app.category,
      };
      // Keep up to 25 recent items
      return [newItem, ...filtered].slice(0, 25);
    });
  }, []);

  const removeRecentApp = useCallback((idOrTo: string) => {
    setRecentApps((prev) => prev.filter((item) => item.id !== idOrTo && item.to !== idOrTo));
  }, []);

  const clearRecentApps = useCallback(() => {
    setRecentApps([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear recent apps", e);
    }
  }, []);

  return { recentApps, addRecentApp, removeRecentApp, clearRecentApps };
}
