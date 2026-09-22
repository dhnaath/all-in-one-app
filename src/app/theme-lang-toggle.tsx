import React, { useState, useEffect } from "react";
import { Sun, Moon, Languages } from "lucide-react";

export function ThemeLangToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("aio_theme") === "dark" ||
        document.documentElement.classList.contains("dark")
      );
    }
    return false;
  });

  const [lang, setLang] = useState<"id" | "en">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("aio_lang") as "id" | "en") || "id";
    }
    return "id";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("aio_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("aio_theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleLang = () => {
    const next = lang === "id" ? "en" : "id";
    setLang(next);
    localStorage.setItem("aio_lang", next);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <button
        type="button"
        onClick={toggleTheme}
        className="flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-lg border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground text-xs font-medium transition-colors cursor-pointer"
        title="Ubah Tema"
      >
        {isDark ? <Sun className="size-3.5 text-amber-400" /> : <Moon className="size-3.5 text-slate-700 dark:text-slate-300" />}
        <span>{isDark ? "Light" : "Dark"}</span>
      </button>

      <button
        type="button"
        onClick={toggleLang}
        className="flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-lg border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground text-xs font-medium transition-colors cursor-pointer"
        title="Ubah Bahasa"
      >
        <Languages className="size-3.5 text-primary" />
        <span className="uppercase">{lang}</span>
      </button>
    </div>
  );
}
