import { useState, useEffect, useCallback } from "react";
import { navKonsultan } from "@/config/nav";

export interface RecentAppItem {
  id: string;
  to: string;
  label: string;
  category?: string;
  timestamp: number;
  visitedAt: number;
}

const STORAGE_KEY = "aio_recent_apps";
const MAX_RECENT = 30;

export function useRecentApps() {
  const [recentApps, setRecentApps] = useState<RecentAppItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setRecentApps(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addRecentApp = useCallback(
    (app: { to: string; label?: string; category?: string; id?: string }) => {
      if (!app.to || app.to === "/") return;

      setRecentApps((prev) => {
        // Resolve label and category from nav if missing
        let resolvedLabel = app.label;
        let resolvedCategory = app.category;

        if (!resolvedLabel || !resolvedCategory) {
          for (const group of navKonsultan) {
            const found = group.items.find((item) => item.to === app.to);
            if (found) {
              if (!resolvedLabel) resolvedLabel = found.label;
              if (!resolvedCategory) resolvedCategory = group.title;
              break;
            }
          }
        }

        const filtered = prev.filter((item) => item.to !== app.to);
        const now = Date.now();
        const newItem: RecentAppItem = {
          id: app.id || app.to,
          to: app.to,
          label: resolvedLabel || app.to.replace("/", "").replace(/-/g, " "),
          category: resolvedCategory,
          timestamp: now,
          visitedAt: now,
        };

        const next = [newItem, ...filtered].slice(0, MAX_RECENT);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          localStorage.setItem("aio_recent_app_path", app.to);
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const removeRecentApp = useCallback((to: string) => {
    setRecentApps((prev) => {
      const next = prev.filter((item) => item.to !== to);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clearRecentApps = useCallback(() => {
    setRecentApps([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    recentApps,
    addRecentApp,
    removeRecentApp,
    clearRecentApps,
  };
}
