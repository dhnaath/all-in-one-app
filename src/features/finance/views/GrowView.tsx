import React from "react";
import { ArrowLeft, TrendingUp, Activity, PieChart, Zap, RefreshCw } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { translations } from "../translations";
import { useScrollRestore } from "../hooks/useScrollRestore";

import { MenuListItem } from "../components/MenuListItem";

export function GrowView({
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
  const { ref, onScroll } = useScrollRestore("GrowView_scroll");
  const lang = useLanguage();

  let title = translations.grow.viewTitle[lang];
  let Icon = TrendingUp;
  let iconColor = "text-muted-foreground";

  if (currentTab === "cat_profil") {
    title = translations.grow.tabs[0][lang];
    Icon = Activity;
    iconColor = "text-rose-500";
  }
  if (currentTab === "cat_alokasi") {
    title = translations.grow.tabs[1][lang];
    Icon = PieChart;
    iconColor = "text-blue-400";
  }
  if (currentTab === "cat_efektif") {
    title = translations.grow.tabs[2][lang];
    Icon = Zap;
    iconColor = "text-yellow-500";
  }
  if (currentTab === "cat_bunga") {
    title = translations.grow.tabs[3][lang];
    Icon = TrendingUp;
    iconColor = "text-green-500";
  }
  if (currentTab === "cat_rebalance") {
    title = translations.grow.tabs[4][lang];
    Icon = RefreshCw;
    iconColor = "text-indigo-400";
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
            <TrendingUp size={20} className="text-muted-foreground" />{" "}
            {translations.grow.viewTitle[lang]}
          </h1>
        </div>
        <div
          ref={ref}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <div className="col-span-full mb-8 max-w-3xl">
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              {translations.landing.categories.grow.desc[lang]}
            </h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {translations.landing.categories.grow.long[lang]}
            </p>
          </div>
          <MenuListItem
            onClick={() => onSelectTab?.("cat_profil")}
            icon={Activity}
            title={translations.grow.tabs[0][lang]}
            desc={translations.grow.tabs[0].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_alokasi")}
            icon={PieChart}
            title={translations.grow.tabs[1][lang]}
            desc={translations.grow.tabs[1].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_efektif")}
            icon={Zap}
            title={translations.grow.tabs[2][lang]}
            desc={translations.grow.tabs[2].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_bunga")}
            icon={TrendingUp}
            title={translations.grow.tabs[3][lang]}
            desc={translations.grow.tabs[3].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_rebalance")}
            icon={RefreshCw}
            title={translations.grow.tabs[4][lang]}
            desc={translations.grow.tabs[4].desc[lang]}
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
