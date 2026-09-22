import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { NetWorthPulseCard } from "@/features/launcher/NetWorthPulseCard";
import { DailyFocusCockpit } from "@/features/launcher/DailyFocusCockpit";
import {
  Compass,
  Layers,
  Clock,
  TrendingUp,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function HomePage() {
  return (
    <AppShell title="Beranda" subtitle="Executive Cockpit & Ringkasan Harian">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Top Executive Pulse & Cockpit */}
        <NetWorthPulseCard />
        <DailyFocusCockpit />

        {/* Executive Quick Hubs / Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Frameworks Hub */}
          <Link
            to="/100-framework"
            className="group p-5 rounded-2xl border border-border bg-card/70 hover:bg-muted/40 transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Compass className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                100 Consulting Frameworks
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Akses perpustakaan framework strategi, diagnostik BCG, TOWS, Value Chain, dan ekspor lembar kerja klien.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary mt-4 group-hover:translate-x-0.5 transition-transform">
              <span>Buka Perpustakaan</span>
              <ArrowRight className="size-3.5" />
            </div>
          </Link>

          {/* 4 Financial Quadrants Hub */}
          <Link
            to="/asset"
            className="group p-5 rounded-2xl border border-border bg-card/70 hover:bg-muted/40 transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <TrendingUp className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                Matriks 4 Kuadran Keuangan
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kelola Aset, Akselerasi Pertumbuhan (Grow), Arus Kas Berjalan (Flow), dan Fondasi Kekayaan Jangka Panjang (Legacy).
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-4 group-hover:translate-x-0.5 transition-transform">
              <span>Kelola 4 Kuadran</span>
              <ArrowRight className="size-3.5" />
            </div>
          </Link>

          {/* Billable Consultation Hub */}
          <Link
            to="/pomodoro"
            className="group p-5 rounded-2xl border border-border bg-card/70 hover:bg-muted/40 transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Clock className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                Billable Hours & Sesi Klien
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Timer sesi konsultasi real-time, pencatatan honor per jam, dan sinkronisasi otomatis ke pendapatan arus kas.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mt-4 group-hover:translate-x-0.5 transition-transform">
              <span>Buka Timer & Honor</span>
              <ArrowRight className="size-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
