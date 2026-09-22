import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useScrollRestore } from "../hooks/useScrollRestore";
import {
  ChevronRight,
  ChevronDown,
  Bot,
  Settings,
  ShieldCheck,
  RefreshCw,
  Building2,
  Sprout,
  FileSignature,
  User,
  Scale,
  Globe,
  Umbrella,
  Vault,
  Lock,
  CreditCard,
  ArrowRightLeft,
  Banknote,
  Receipt,
  Brain,
  Network,
  Briefcase,
  Landmark,
  BookOpen,
  Activity,
  PieChart,
  Zap,
  TrendingUp,
  GraduationCap,
  Building,
  HeartHandshake,
  ReceiptText,
  Gift,
  MoreHorizontal,
  Star,
  Info,
  Moon,
  Sun,
} from "lucide-react";
import { useLanguage, Language } from "../hooks/useLanguage";
import { translations } from "../translations";

const getTimeGreeting = (lang: Language) => {
  const hour = new Date().getHours();
  if (lang === "en") {
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  } else if (lang === "zh") {
    if (hour < 12) return "早上好";
    if (hour < 18) return "下午好";
    return "晚上好";
  } else if (lang === "ms") {
    if (hour < 12) return "Selamat Pagi";
    if (hour < 18) return "Selamat Petang";
    return "Selamat Malam";
  }
  // default id
  if (hour < 12) return "Pagi";
  if (hour < 15) return "Siang";
  if (hour < 18) return "Sore";
  return "Malam";
};

const cardsData = [
  {
    id: "surety",
    icon: ShieldCheck,
    delay: 0.3,
    tabs: [
      { id: "cat_kepatuhan", icon: Scale, color: "text-indigo-400" },
      { id: "cat_publik", icon: Globe, color: "text-sky-400" },
      { id: "cat_asuransi", icon: Umbrella, color: "text-purple-400" },
      { id: "cat_dana", icon: Vault, color: "text-teal-500" },
      { id: "cat_proteksi", icon: Lock, color: "text-green-500" },
    ],
  },
  {
    id: "flow",
    icon: RefreshCw,
    delay: 0.4,
    tabs: [
      { id: "cat_liabilitas", icon: CreditCard, color: "text-red-400" },
      { id: "cat_pengeluaran", icon: ArrowRightLeft, color: "text-blue-400" },
      { id: "cat_kredit", icon: Banknote, color: "text-green-400" },
      { id: "cat_pajak", icon: Receipt, color: "text-yellow-400" },
      { id: "cat_otomatisasi", icon: Activity, color: "text-purple-400" },
    ],
  },
  {
    id: "build",
    icon: Building2,
    delay: 0.5,
    tabs: [
      { id: "cat_modal", icon: Brain, color: "text-purple-500" },
      { id: "cat_jaringan", icon: Network, color: "text-blue-500" },
      { id: "cat_portofolio", icon: Briefcase, color: "text-amber-500" },
      { id: "cat_kekayaan", icon: Landmark, color: "text-green-600" },
      { id: "cat_pembukuan", icon: BookOpen, color: "text-orange-400" },
    ],
  },
  {
    id: "grow",
    icon: Sprout,
    delay: 0.6,
    tabs: [
      { id: "cat_profil", icon: Activity, color: "text-rose-500" },
      { id: "cat_alokasi", icon: PieChart, color: "text-blue-400" },
      { id: "cat_efektif", icon: Zap, color: "text-yellow-500" },
      { id: "cat_bunga", icon: TrendingUp, color: "text-green-500" },
      { id: "cat_rebalance", icon: RefreshCw, color: "text-indigo-400" },
    ],
  },
  {
    id: "legacy",
    icon: BookOpen,
    delay: 0.7,
    tabs: [
      { id: "cat_pembelajaran", icon: GraduationCap, color: "text-sky-500" },
      { id: "cat_tatakelola", icon: Building, color: "text-muted-foreground/70" },
      { id: "cat_amal", icon: HeartHandshake, color: "text-pink-500" },
      { id: "cat_likuidasi", icon: ReceiptText, color: "text-orange-500" },
      { id: "cat_transfer", icon: Gift, color: "text-teal-400" },
    ],
  },
];

export function LandingView({
  onNavigate,
  onUnavailable,
}: {
  onNavigate: (screen: string, tab?: string) => void;
  onUnavailable?: () => void;
}) {
  const { ref, onScroll } = useScrollRestore("landing_scroll");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [localName, setLocalName] = useState("Dhnaath");
  const [theme, setTheme] = useState<"Dark" | "Light">("Dark");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem("appTheme") as "Dark" | "Light") || "Dark";
    setTheme(savedTheme);
  }, []);

  const lang = useLanguage();

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "Dark" ? "Light" : "Dark";
      localStorage.setItem("appTheme", next);
      if (next === "Dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  const cycleLanguage = () => {
    const langs: Language[] = ["id", "en", "ms", "zh"];
    const currentIdx = langs.indexOf(lang);
    const nextLang = langs[(currentIdx + 1) % langs.length];
    localStorage.setItem("appLanguage", nextLang);
    window.dispatchEvent(new Event("languageChange"));
  };

  const getLangLabel = (l: Language) => {
    const labels = { id: "ID", en: "EN", ms: "MS", zh: "ZH" };
    return labels[l];
  };

  const toggleExpand = (card: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCard((prev) => (prev === card ? null : card));
  };

  return (
    <>
      <motion.div
        ref={ref}
        onScroll={onScroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, x: -20 }}
        className={`flex flex-col h-full p-4 md:p-6 relative ${expandedCard ? "overflow-visible" : "overflow-hidden"}`}
      >
        <div className="pt-8 pb-4 flex justify-between items-start">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-2"
            >
              <h1 className="text-xl font-medium tracking-tight text-muted-foreground mb-1">
                {translations.landing.greeting[lang]} {getTimeGreeting(lang)},
              </h1>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">{localName}</h2>
            </motion.div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={toggleTheme}
              className="p-2 bg-card border border-border rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {theme === "Dark" ? (
                <Moon size={20} className="text-muted-foreground" />
              ) : (
                <Sun size={20} className="text-muted-foreground" />
              )}
            </button>
            <button
              onClick={cycleLanguage}
              className="w-[38px] h-[38px] bg-card border border-border rounded-full hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center shrink-0"
            >
              <span className="text-[11px] font-bold text-muted-foreground">
                {getLangLabel(lang)}
              </span>
            </button>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm mb-4 w-full tracking-wide"
        >
          {translations.landing.summary[lang]}
        </motion.p>

        <AnimatePresence>
          {expandedCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setExpandedCard(null)}
            />
          )}
        </AnimatePresence>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0 items-center content-center ${expandedCard ? "overflow-visible" : "overflow-y-auto"} my-auto pr-2 pb-6 -mr-2`}
        >
          {cardsData.map((card, index) => {
            const isExpanded = expandedCard === card.id;
            const tCat =
              translations.landing.categories[
                card.id as keyof typeof translations.landing.categories
              ];
            const tView = (translations as any)[card.id];

            return (
              <div
                key={card.id}
                className={`relative w-full h-[164px] ${isExpanded ? "z-50" : "z-10"}`}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ opacity: { delay: card.delay, duration: 0.3 } }}
                  onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                  style={{ cursor: "pointer" }}
                  className={`absolute inset-y-0 left-0 w-full my-auto bg-card rounded-2xl p-6 text-left overflow-hidden group border border-transparent hover:border-border hover:bg-accent hover:text-accent-foreground shadow-xl ${isExpanded ? "z-50 border-border shadow-2xl overflow-y-auto max-h-[calc(100vh-80px)]" : ""} h-fit min-h-[164px]`}
                >
                  <div className="flex justify-start items-center mb-4">
                    <div className="flex items-center gap-4 text-foreground group-hover:text-foreground transition-colors">
                      <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shrink-0 border border-border">
                        <card.icon size={24} className="theme-icon" />
                      </div>
                      <div className="flex flex-col justify-center -mt-0.5 gap-[10pt]">
                        <h2 className="text-lg font-medium leading-none">{tCat.title}</h2>
                        <div className="text-xs text-muted-foreground leading-none">
                          {tCat.desc[lang]}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                    <AnimatePresence>
                      {!isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex items-center gap-4 transition-colors overflow-hidden"
                        >
                          {card.tabs.map((tab, idx) => (
                            <tab.icon key={idx} size={18} className={tab.color} />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(card.id, e)}
                      className="ml-auto text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <ChevronDown
                        size={20}
                        className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-1.5 mt-2 mb-2">
                          {tCat.long[lang].split(/\r?\n\r?\n/).map((item: string, idx: number) => {
                            const match = item.match(/^(\d+)\s+(.*)$/);
                            if (match) {
                              let text = match[2];
                              text = text.replace(/;?$/, ".");
                              return (
                                <div
                                  key={idx}
                                  className="flex gap-3 text-xs text-muted-foreground text-left leading-relaxed"
                                >
                                  <span className="w-3 shrink-0 font-medium text-muted-foreground">
                                    {match[1]}
                                  </span>
                                  <span>{text}</span>
                                </div>
                              );
                            }
                            return (
                              <p
                                key={idx}
                                className="text-xs text-muted-foreground text-left leading-relaxed"
                              >
                                {item}
                              </p>
                            );
                          })}
                        </div>
                        <div className="pt-3 mt-3 grid grid-cols-2 gap-x-2 gap-y-2 text-sm text-muted-foreground border-t border-border">
                          {card.tabs.map((tab, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between group cursor-pointer hover:text-foreground transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate(card.id, tab.id);
                              }}
                            >
                              <div className={`flex items-center gap-3 ${tab.color}`}>
                                <tab.icon size={16} className="shrink-0" /> {tView.tabs[idx][lang]}
                              </div>
                              <ChevronRight
                                size={16}
                                className="text-muted-foreground group-hover:text-foreground transition-colors"
                              />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
