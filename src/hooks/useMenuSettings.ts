import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "aio_menu_settings";

export function useMenuSettings() {
  const [enabledMenus, setEnabledMenus] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enabledMenus));
    } catch (e) {
      console.error("Failed to save menu settings", e);
    }
  }, [enabledMenus]);

  const toggleMenu = useCallback((key: string) => {
    setEnabledMenus((prev) => ({
      ...prev,
      [key]: prev[key] === false ? true : false,
    }));
  }, []);

  const resetMenus = useCallback(() => {
    setEnabledMenus({});
  }, []);

  return { enabledMenus, toggleMenu, resetMenus };
}
