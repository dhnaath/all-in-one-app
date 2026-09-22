import React from "react";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Building,
  HeartHandshake,
  ReceiptText,
  Gift,
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { translations } from "../translations";
import { useScrollRestore } from "../hooks/useScrollRestore";

import { MenuListItem } from "../components/MenuListItem";

export function LegacyView({
  currentTab,
  onBack,
  onSelectTab,
  onUnavailable,
}: {
  currentTab: string;
  onBack: () => void;
  onSelectTab?: (tab: string) => void;
  onUnavailable?: () => void;
}) {
  const { ref, onScroll } = useScrollRestore("LegacyView_scroll");
  const lang = useLanguage();

  let title = translations.legacy.viewTitle[lang];
  let Icon = BookOpen;
  let iconColor = "text-muted-foreground";

  if (currentTab === "cat_pembelajaran") {
    title = translations.legacy.tabs[0][lang];
    Icon = GraduationCap;
    iconColor = "text-sky-500";
  }
  if (currentTab === "cat_tatakelola") {
    title = translations.legacy.tabs[1][lang];
    Icon = Building;
    iconColor = "text-muted-foreground/70";
  }
  if (currentTab === "cat_amal") {
    title = translations.legacy.tabs[2][lang];
    Icon = HeartHandshake;
    iconColor = "text-pink-500";
  }
  if (currentTab === "cat_likuidasi") {
    title = translations.legacy.tabs[3][lang];
    Icon = ReceiptText;
    iconColor = "text-orange-500";
  }
  if (currentTab === "cat_transfer") {
    title = translations.legacy.tabs[4][lang];
    Icon = Gift;
    iconColor = "text-teal-400";
  }

  if (!currentTab) {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={onBack}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <BookOpen size={20} className="text-muted-foreground" />{" "}
            {translations.legacy.viewTitle[lang]}
          </h1>
        </div>
        <div
          ref={ref}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <div className="col-span-full mb-8 max-w-3xl">
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              {translations.landing.categories.legacy.desc[lang]}
            </h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {translations.landing.categories.legacy.long[lang]}
            </p>
          </div>
          <MenuListItem
            onClick={() => onSelectTab?.("cat_pembelajaran")}
            icon={GraduationCap}
            title={translations.legacy.tabs[0][lang]}
            desc={translations.legacy.tabs[0].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_tatakelola")}
            icon={Building}
            title={translations.legacy.tabs[1][lang]}
            desc={translations.legacy.tabs[1].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_amal")}
            icon={HeartHandshake}
            title={translations.legacy.tabs[2][lang]}
            desc={translations.legacy.tabs[2].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_likuidasi")}
            icon={ReceiptText}
            title={translations.legacy.tabs[3][lang]}
            desc={translations.legacy.tabs[3].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_transfer")}
            icon={Gift}
            title={translations.legacy.tabs[4][lang]}
            desc={translations.legacy.tabs[4].desc[lang]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
          <Icon size={20} className={iconColor} /> {title}
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 flex flex-col items-center justify-center p-6 pb-20 text-[#666]"
      >
        <p className="text-sm">Segera Hadir / Coming Soon</p>
      </div>
    </div>
  );
}
