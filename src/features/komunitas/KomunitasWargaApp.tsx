import React, { useState } from "react";
import {
  Home,
  Users,
  Megaphone,
  CreditCard,
  ScrollText,
  Compass,
  CalendarDays,
  FileCheck,
  Receipt,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { StandaloneAppView } from "@/features/standalone/StandaloneAppView";

export type KomunitasTab =
  | "rt-rw-directory"
  | "community-announcements"
  | "membership-card"
  | "meeting-resolutions"
  | "public-services-guide"
  | "civic-calendar"
  | "civil-registry"
  | "tax-civic";

interface SubFeatureDef {
  id: KomunitasTab;
  title: string;
  shortLabel: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
}

export const KOMUNITAS_FEATURES: SubFeatureDef[] = [
  {
    id: "rt-rw-directory",
    title: "Buku Warga RT RW",
    shortLabel: "Buku Warga",
    subtitle: "Direktori kependudukan rukun tetangga, susunan pengurus RT/RW, dan pos satpam.",
    icon: Users,
    badge: "Direktori",
  },
  {
    id: "community-announcements",
    title: "Papan Pengumuman Warga",
    shortLabel: "Pengumuman",
    subtitle: "Mading edaran resmi: kerja bakti, fogging DBD, siskamling, dan agenda sosial.",
    icon: Megaphone,
    badge: "Pengumuman",
  },
  {
    id: "membership-card",
    title: "KTA dan Kartu Anggota",
    shortLabel: "KTA & Kartu",
    subtitle: "Dompet identitas anggota asosiasi, paguyuban alumni, dan koperasi warga.",
    icon: CreditCard,
    badge: "Keanggotaan",
  },
  {
    id: "meeting-resolutions",
    title: "Hasil Keputusan Rapat",
    shortLabel: "Keputusan Rapat",
    subtitle: "Arsip notula musyawarah warga, berita acara mufakat, dan realisasi aksi.",
    icon: ScrollText,
    badge: "Notula",
  },
  {
    id: "public-services-guide",
    title: "Panduan Layanan Publik",
    shortLabel: "Layanan Publik",
    subtitle: "Panduan pengurusan berkas di kelurahan, puskesmas, Samsat, dan kepolisian.",
    icon: Compass,
    badge: "Panduan",
  },
  {
    id: "civic-calendar",
    title: "Kalender Pemilu dan Libur",
    shortLabel: "Kalender Pemilu",
    subtitle: "Agenda pilkada serentak, pemilu, hari libur nasional, dan cuti bersama resmi.",
    icon: CalendarDays,
    badge: "Kalender",
  },
  {
    id: "civil-registry",
    title: "Administrasi Kependudukan",
    shortLabel: "Adminduk",
    subtitle: "Pelacak surat pengantar RT, surat pindah, domisili, dan berkas kependudukan.",
    icon: FileCheck,
    badge: "Adminduk",
  },
  {
    id: "tax-civic",
    title: "PBB dan Iuran Warga",
    shortLabel: "PBB & Iuran",
    subtitle: "Rekapitulasi iuran sampah bulanan, IPL keamanan, dan pelunasan PBB hunian.",
    icon: Receipt,
    badge: "Keuangan Warga",
  },
];

export function KomunitasWargaApp() {
  const routerState = useRouterState();
  const searchParams = (routerState.location.search || {}) as { tab?: string };
  const initialTab: KomunitasTab =
    searchParams.tab && KOMUNITAS_FEATURES.some((f) => f.id === searchParams.tab)
      ? (searchParams.tab as KomunitasTab)
      : "rt-rw-directory";

  const [activeTab, setActiveTab] = useState<KomunitasTab>(initialTab);

  const currentFeature =
    KOMUNITAS_FEATURES.find((f) => f.id === activeTab) || KOMUNITAS_FEATURES[0];

  return (
    <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto py-2 px-1">
      {/* Overview Top Stats Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-blue-950/40 via-card to-cyan-950/30 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shrink-0">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Komunitas Warga
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-wide">
                  Standalone App
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Pusat kendali rukun warga, transparansi iuran pemukiman, direktori RT/RW, dan layanan publik.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
            <div className="rounded-xl border border-border/60 bg-background/60 p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Total Warga
              </span>
              <span className="text-sm font-bold text-foreground">42 KK / 184 Jiwa</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Pengumuman
              </span>
              <span className="text-sm font-bold text-blue-500">2 Agenda Aktif</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Status Iuran RT
              </span>
              <span className="text-sm font-bold text-emerald-500">88% Terkumpul</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Pos Satpam
              </span>
              <span className="text-sm font-bold text-amber-500">Siaga 24 Jam</span>
            </div>
          </div>
        </div>

        {/* Sub-Feature Switcher Tabs */}
        <div className="mt-6 pt-5 border-t border-border/60">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-blue-500" />
            <span>Pilih 8 Sub-Modul Terintegrasi:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {KOMUNITAS_FEATURES.map((feat) => {
              const Icon = feat.icon;
              const isActive = activeTab === feat.id;

              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveTab(feat.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm scale-102 font-bold"
                      : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60 hover:scale-102"
                  }`}
                >
                  <Icon className={`size-3.5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                  <span>{feat.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Sub-module Container */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">
                {currentFeature.title}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border/60">
                {currentFeature.badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {currentFeature.subtitle}
            </p>
          </div>

          <Link
            to="/lainnya"
            search={{ app: activeTab } as any}
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Buka Tampilan Penuh</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        {/* Embedded Interactive Standalone View */}
        <StandaloneAppView appId={activeTab} />
      </div>
    </div>
  );
}
