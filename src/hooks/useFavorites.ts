import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const FAVORITES_KEY = "aio_favorites";
const FAVORITES_EVENT = "aio_favorites_changed";
const MAX_FAVORITES = 5;

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY && e.newValue) {
        try {
          setFavorites(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    // Same-tab sync: the storage event only fires in OTHER tabs, so broadcast
    // toggles locally to keep every mounted useFavorites instance (launcher
    // grid, dock, etc.) in sync without a remount.
    const handleLocal = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail;
      if (Array.isArray(detail)) setFavorites(detail);
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(FAVORITES_EVENT, handleLocal);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(FAVORITES_EVENT, handleLocal);
    };
  }, []);

  const toggleFavorite = useCallback(
    (path: string) => {
      const isAdding = !favorites.includes(path);
      if (isAdding && favorites.length >= MAX_FAVORITES) {
        toast.warning(`Maksimal ${MAX_FAVORITES} aplikasi favorit.`);
        return;
      }
      const next = isAdding
        ? [...favorites, path]
        : favorites.filter((p) => p !== path);
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      setFavorites(next);
      window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: next }));
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (path: string) => favorites.includes(path),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
