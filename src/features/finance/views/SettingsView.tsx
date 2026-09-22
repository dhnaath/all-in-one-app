import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Crown,
  Lock,
  Globe,
  Palette,
  Bell,
  Download,
  MoreHorizontal,
  Send,
  Info,
  ChevronRight,
  Check,
} from "lucide-react";
import { useLanguage, Language } from "../hooks/useLanguage";
import { translations } from "../translations";
import { motion, AnimatePresence } from "motion/react";

export function SettingsView({
  onBack,
  onMoreSettings,
  onUnavailable,
}: {
  onBack: () => void;
  onMoreSettings: () => void;
  onUnavailable?: () => void;
}) {
  const lang = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] w-full relative z-50">
      <div className="flex items-center gap-6 p-4 pt-5 mb-2">
        <button onClick={onBack}>
          <ArrowLeft
            size={24}
            className="text-foreground hover:text-foreground transition-colors"
          />
        </button>
        <h1 className="text-lg font-normal text-foreground">{translations.settings.title[lang]}</h1>
      </div>

      <div className="p-4 space-y-2">
        <div className="py-2 space-y-1">
          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center gap-6">
              <Lock size={24} className="text-muted-foreground" />
              <span className="text-base text-foreground font-normal">
                {translations.settings.appLock[lang]}
              </span>
            </div>
            <div className="w-12 h-6 bg-[#2a2a2a] rounded-full flex items-center p-1 cursor-pointer">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center gap-6 py-4 px-2 cursor-pointer" onClick={onUnavailable}>
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-muted-foreground">$</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base text-foreground font-normal">
                {translations.settings.currency[lang]}
              </span>
              <span className="text-sm text-muted-foreground">Rp - Rupiah Indonesia</span>
            </div>
          </div>

          <div className="flex items-center gap-6 py-4 px-2 cursor-pointer" onClick={onUnavailable}>
            <Bell size={24} className="text-muted-foreground" />
            <span className="text-base text-foreground font-normal">
              {translations.settings.notifications[lang]}
            </span>
          </div>

          <div className="flex items-center gap-6 py-4 px-2 cursor-pointer" onClick={onUnavailable}>
            <Download size={24} className="text-muted-foreground" />
            <span className="text-base text-foreground font-normal">
              {translations.settings.export[lang]}
            </span>
          </div>

          <button
            onClick={onMoreSettings}
            className="w-full flex items-center gap-6 py-4 px-2 cursor-pointer"
          >
            <MoreHorizontal size={24} className="text-muted-foreground" />
            <span className="text-base text-foreground font-normal">
              {translations.settings.more[lang]}
            </span>
          </button>
        </div>

        <div className="h-[1px] bg-[#2a2a2a] my-2"></div>

        <div className="py-2 space-y-1">
          <div className="flex items-center gap-6 py-4 px-2 cursor-pointer" onClick={onUnavailable}>
            <Info size={24} className="text-muted-foreground" />
            <span className="text-base text-foreground font-normal">Tentang</span>
          </div>
        </div>
      </div>
    </div>
  );
}
