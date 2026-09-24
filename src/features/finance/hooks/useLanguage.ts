import { useState, useEffect } from "react";

export type Language = "id" | "en" | "ms" | "zh";

export function useLanguage(): Language {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("appLanguage") as Language) || "id";
  });

  useEffect(() => {
    const stored = (localStorage.getItem("appLanguage") as Language) || "id";
    setLang(stored);

    const onLanguageChange = () => {
      setLang((localStorage.getItem("appLanguage") as Language) || "id");
    };

    window.addEventListener("languageChange", onLanguageChange);
    return () => window.removeEventListener("languageChange", onLanguageChange);
  }, []);

  return lang;
}

export function setLanguage(lang: Language) {
  localStorage.setItem("appLanguage", lang);
  window.dispatchEvent(new Event("languageChange"));
}
