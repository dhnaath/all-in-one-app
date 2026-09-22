import React from "react";
import { ArrowLeft, Settings, Brain, Network, Briefcase, Landmark, BookOpen } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { translations } from "../translations";
import { useScrollRestore } from "../hooks/useScrollRestore";

import { MenuListItem } from "../components/MenuListItem";

export function BuildView({
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
  const { ref, onScroll } = useScrollRestore("BuildView_scroll");
  const lang = useLanguage();

  let title = translations.build.viewTitle[lang];
  let Icon = Settings;
  let iconColor = "text-muted-foreground";

  if (currentTab === "cat_modal") {
    title = translations.build.tabs[0][lang];
    Icon = Brain;
    iconColor = "text-purple-500";
  }
  if (currentTab === "cat_jaringan") {
    title = translations.build.tabs[1][lang];
    Icon = Network;
    iconColor = "text-blue-500";
  }
  if (currentTab === "cat_portofolio") {
    title = translations.build.tabs[2][lang];
    Icon = Briefcase;
    iconColor = "text-amber-500";
  }
  if (currentTab === "cat_kekayaan") {
    title = translations.build.tabs[3][lang];
    Icon = Landmark;
    iconColor = "text-green-600";
  }
  if (currentTab === "cat_pembukuan") {
    title = translations.build.tabs[4][lang];
    Icon = BookOpen;
    iconColor = "text-orange-400";
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
            <Settings size={20} className="text-muted-foreground" />{" "}
            {translations.build.viewTitle[lang]}
          </h1>
        </div>
        <div
          ref={ref}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <div className="col-span-full mb-8 max-w-3xl">
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              {translations.landing.categories.build.desc[lang]}
            </h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {translations.landing.categories.build.long[lang]}
            </p>
          </div>
          <MenuListItem
            onClick={() => onSelectTab?.("cat_modal")}
            icon={Brain}
            title={translations.build.tabs[0][lang]}
            desc={translations.build.tabs[0].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_jaringan")}
            icon={Network}
            title={translations.build.tabs[1][lang]}
            desc={translations.build.tabs[1].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_portofolio")}
            icon={Briefcase}
            title={translations.build.tabs[2][lang]}
            desc={translations.build.tabs[2].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_kekayaan")}
            icon={Landmark}
            title={translations.build.tabs[3][lang]}
            desc={translations.build.tabs[3].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_pembukuan")}
            icon={BookOpen}
            title={translations.build.tabs[4][lang]}
            desc={translations.build.tabs[4].desc[lang]}
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
