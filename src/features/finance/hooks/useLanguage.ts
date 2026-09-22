import { useState, useEffect } from "react";

export type Language = "id" | "en" | "ms" | "zh";

export function useLanguage() {
  const [lang, setLang] = useState<Language>("id");

  useEffect(() => {
    // Set initial language from localStorage on mount
    const savedLang = (localStorage.getItem("appLanguage") as Language) || "id";
    setLang(savedLang);

    const handleLanguageChange = () => {
      setLang((localStorage.getItem("appLanguage") as Language) || "id");
    };

    window.addEventListener("languageChange", handleLanguageChange);
    return () => window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  return lang;
}
