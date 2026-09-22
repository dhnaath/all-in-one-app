import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { useState, useEffect } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Briefcase,
  User,
  Plus,
  Trash2,
  Calendar,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export const Route = createFileRoute("/pomodoro")({
  component: ConsultationTimerPage,
});

interface ConsultationLog {
  id: string;
  client: string;
  topic: string;
  durationMinutes: number;
  ratePerHour: number;
  totalBilled: number;
  date: string;
}

function ConsultationTimerPage() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [clientName, setClientName] = useState("PT Synergy Nusantara");
  const [consultationTopic, setConsultationTopic] = useState("Review Strategi Pertumbuhan & TOWS");
  const [ratePerHour, setRatePerHour] = useState(1500000); // 1.500.000 IDR / hour
  const [logs, setLogs] = useState<ConsultationLog[]>([
    {
      id: "log-1",
      client: "PT Adhi Kreasi Mandiri",
      topic: "Diagnostik Model Bisnis & Value Chain",
      durationMinutes: 90,
      ratePerHour: 1500000,
      totalBilled: 2250000,
      date: "2026-09-20",
    },
    {
      id: "log-2",
      client: "CV Solusi Ritel Cemerlang",
      topic: "Audit Restrukturisasi Arus Kas",
      durationMinutes: 60,
      ratePerHour: 1200000,
      totalBilled: 1200000,
      date: "2026-09-18",
    },
  ]);

  // Load saved timer logs
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aio_consultation_logs");
      if (saved) {
        setLogs(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentDurationMinutes = Math.max(1, Math.round(seconds / 60));
  const currentBilled = Math.round((seconds / 3600) * ratePerHour);

  const handleStopAndSave = () => {
    if (seconds < 10) return;
    setIsActive(false);

    const newLog: ConsultationLog = {
      id: crypto.randomUUID(),
      client: clientName || "Klien Umum",
      topic: consultationTopic || "Sesi Konsultasi",
      durationMinutes: currentDurationMinutes,
      ratePerHour: ratePerHour,
      totalBilled: currentBilled,
      date: new Date().toISOString().split("T")[0],
    };

    const updated = [newLog, ...logs];
    setLogs(updated);
    try {
      localStorage.setItem("aio_consultation_logs", JSON.stringify(updated));
      // Also register as quick earning transaction
      const currentTxs = JSON.parse(localStorage.getItem("aio_quick_transactions") || "[]");
      const earningTx = {
        id: crypto.randomUUID(),
        title: `Honor Konsultasi: ${newLog.client}`,
        amount: newLog.totalBilled,
        type: "earning",
        category: "Honor Konsultan",
        date: newLog.date,
      };
      localStorage.setItem("aio_quick_transactions", JSON.stringify([earningTx, ...currentTxs]));
      window.dispatchEvent(new Event("aio_data_updated"));
    } catch (e) {
      console.error(e);
    }

    setSeconds(0);
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalAllBilled = logs.reduce((acc, curr) => acc + curr.totalBilled, 0);
  const totalAllHours = Math.round((logs.reduce((acc, curr) => acc + curr.durationMinutes, 0) / 60) * 10) / 10;

  return (
    <AppShell
      title="Billable Hours & Timer"
      subtitle="Pencatatan Jam Konsultasi & Honorarium Terstruktur"
    >
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-xs">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Total Jam Tertagih</span>
              <Clock className="size-4 text-primary" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {totalAllHours} Jam
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Akumulasi sesi konsultasi terdata</p>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-xs">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Total Pendapatan Honor</span>
              <DollarSign className="size-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatIDR(totalAllBilled)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Tersinkronisasi ke Kuadran Arus Kas</p>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-xs">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Standar Tarif Per Jam</span>
              <Briefcase className="size-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatIDR(ratePerHour)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Dapat disesuaikan per klien</p>
          </div>
        </div>

        {/* Live Active Consultation Timer Cockpit */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md shadow-md text-foreground">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-4 flex-1 w-full">
              <div className="flex items-center gap-2">
                <span className={`size-3 rounded-full ${isActive ? "bg-emerald-500 animate-ping" : "bg-muted-foreground"}`} />
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {isActive ? "Sesi Konsultasi Berlangsung" : "Mulai Sesi Konsultasi Baru"}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Nama Klien / Perusahaan
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    disabled={isActive}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Topik / Kerangka Kerja yang Dibahas
                  </label>
                  <input
                    type="text"
                    value={consultationTopic}
                    onChange={(e) => setConsultationTopic(e.target.value)}
                    disabled={isActive}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span>Tarif:</span>
                  <input
                    type="number"
                    step="50000"
                    value={ratePerHour}
                    onChange={(e) => setRatePerHour(Number(e.target.value))}
                    disabled={isActive}
                    className="w-28 px-2 py-1 text-xs rounded-lg border border-border bg-background font-mono text-foreground"
                  />
                  <span>/ Jam</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Nilai Berjalan:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatIDR(currentBilled)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Timer Big Display & Controls */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/30 border border-border/70 min-w-[260px]">
              <span className="text-4xl sm:text-5xl font-mono font-bold tracking-widest text-foreground mb-4">
                {formatTime(seconds)}
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white shadow-sm transition-all ${
                    isActive
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isActive ? <Pause className="size-4" /> : <Play className="size-4" />}
                  <span>{isActive ? "Jeda" : "Mulai Timer"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleStopAndSave}
                  disabled={seconds < 10}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 disabled:opacity-40 transition-all"
                  title="Selesaikan & Simpan Log Honor"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Selesai</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsActive(false);
                    setSeconds(0);
                  }}
                  className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Log History */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              <span>Riwayat Jam Konsultasi Tertagih</span>
            </h4>
            <span className="text-xs text-muted-foreground">{logs.length} Sesi Terdata</span>
          </div>

          <div className="divide-y divide-border">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{log.client}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                      {log.date}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{log.topic}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-xs">
                  <div className="text-left sm:text-right">
                    <span className="text-muted-foreground block text-[11px]">Durasi</span>
                    <span className="font-semibold text-foreground font-mono">
                      {log.durationMinutes} menit
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground block text-[11px]">Honor</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                      {formatIDR(log.totalBilled)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
