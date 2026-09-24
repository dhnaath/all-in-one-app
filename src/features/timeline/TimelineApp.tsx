import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sliders,
  Maximize2,
  Plus,
  GitCommit,
  Flame,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useTimelineManager } from "./store";
import { TimelineViewMode, GroupBy } from "./types";

export function TimelineApp() {
  const {
    state,
    activeView,
    bars,
    dependencyLines,
    lanes,
    saveBaseline,
    updateConfig,
  } = useTimelineManager();

  const [viewMode, setViewMode] = useState<TimelineViewMode>("gantt");

  // Determine date bounds
  const { minDate, maxDate, dayList } = useMemo(() => {
    let min = new Date();
    let max = new Date(Date.now() + 14 * 86400000);

    bars.forEach((b) => {
      const s = new Date(b.startAt);
      const e = new Date(b.endAt);
      if (s < min) min = s;
      if (e > max) max = e;
    });

    const days: string[] = [];
    const cur = new Date(min);
    // Limit to 21 days for clean UI rendering
    for (let i = 0; i < 21; i++) {
      days.push(cur.toISOString().slice(0, 10));
      cur.setDate(cur.getDate() + 1);
    }

    return { minDate: min, maxDate: max, dayList: days };
  }, [bars]);

  // Dependency violations count
  const violationCount = dependencyLines.filter((l) => l.isViolated).length;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-muted/40 text-foreground">
      {/* LEFT SIDEBAR: Timeline Controls & Critical Path */}
      <ShellSidebar>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-card border-2 border-border shadow-xs flex items-center justify-center text-foreground shrink-0">
            <CalendarDays className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-foreground tracking-tight">Timeline Manager</h2>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-medium border border-border">
                Tanda Sementara
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Gantt Chart & Dependency Engine (#10)</p>
          </div>
        </div>

        {/* Group By Selector (§3.1) */}
        <div className="p-4 border-b border-border space-y-2">
          <span className="text-[11px] font-semibold text-foreground">Pengelompokan Baris (Lane)</span>
          <select
            value={activeView.groupBy}
            onChange={(e) => updateConfig("groupBy", e.target.value as GroupBy)}
            className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500 bg-muted/40"
          >
            <option value="phase">Berdasarkan Fase & Proyek</option>
            <option value="assignee">Berdasarkan Penanggung Jawab</option>
          </select>
        </div>

        {/* Options Toggles */}
        <div className="p-4 border-b border-border space-y-2">
          <span className="text-[11px] font-semibold text-foreground">Opsi Tampilan Jalur</span>
          <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={activeView.showCriticalPath}
              onChange={(e) => updateConfig("showCriticalPath", e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Sorot Jalur Kritis (Critical Path)</span>
          </label>
        </div>

        {/* Violations Warning (§5.1) */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <span className="text-[11px] font-semibold text-foreground">Audit Konsistensi Jadwal</span>
          {violationCount > 0 ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-red-700 font-bold">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{violationCount} Pelanggaran Dependency!</span>
              </div>
              <p className="text-[11px] text-red-600 leading-snug">
                Ada tugas yang dijadwalkan mulai sebelum tugas pendahulunya selesai (Finish-to-Start).
              </p>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Semua urutan jadwal selaras tanpa konflik dependensi.</span>
            </div>
          )}

          {/* Baseline Snapshots (§8) */}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-foreground">Baseline Tersimpan</span>
              <button
                onClick={() => {
                  const name = prompt("Nama Snapshot Baseline:", "Baseline Revisi " + new Date().toLocaleDateString("id-ID"));
                  if (name) saveBaseline(name);
                }}
                className="text-[10px] text-indigo-600 hover:underline font-semibold"
              >
                + Simpan
              </button>
            </div>

            <div className="space-y-1.5">
              {state.baselines.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic">Belum ada snapshot baseline.</p>
              ) : (
                state.baselines.map((b) => (
                  <div key={b.id} className="p-2 bg-muted/40 border border-border rounded text-xs flex items-center justify-between">
                    <span className="font-medium text-foreground truncate mr-2">{b.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {new Date(b.snapshotAt).toLocaleDateString("id-ID", { month: "numeric", day: "numeric" })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="p-3 border-t border-border bg-muted/40 text-[10px] text-muted-foreground">
          <p className="font-semibold text-foreground">Standalone App #10</p>
          <p className="mt-0.5">Visualisasi Gantt, deteksi CPM & garis relasi tugas.</p>
        </div>
      </ShellSidebar>

      {/* MAIN GANTT CHART VIEW */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-card">
        {/* Top Header */}
        <ShellHeader>
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight">{activeView.name}</h1>
            <p className="text-xs text-muted-foreground">
              Rentang waktu horizontal terhubung oleh jalur relasi antar-fase dan milestone.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-md p-0.5 bg-muted/40 text-xs">
              {[
                { id: "gantt", label: "Gantt Chart" },
                { id: "critical_path", label: "Jalur Kritis (CPM)" },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id as TimelineViewMode)}
                  className={`px-3 py-1 rounded transition-colors ${
                    viewMode === v.id
                      ? "bg-card text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </ShellHeader>

        {/* TIMELINE GANTT CANVAS */}
        <div className="flex-1 overflow-auto p-4 bg-muted/40/50">
          <div className="min-w-[800px] bg-card border border-border rounded-xl shadow-xs overflow-hidden">
            {/* Days Header */}
            <div className="flex border-b border-border bg-muted/40">
              <div className="w-56 flex-shrink-0 p-3 text-xs font-bold text-foreground border-r border-border">
                Lanes & Entitas Kerja
              </div>
              <div className="flex-1 grid grid-cols-21 divide-x divide-border text-center text-[10px] font-mono text-muted-foreground py-2">
                {dayList.map((d) => (
                  <div key={d} className="px-1 truncate">
                    <span className="font-semibold block text-foreground">{d.slice(8, 10)}</span>
                    <span className="text-[9px] text-muted-foreground">{d.slice(5, 7)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lanes Body */}
            <div className="divide-y divide-border">
              {Object.keys(lanes).map((laneName) => {
                const laneBars = lanes[laneName].filter((b) =>
                  viewMode === "critical_path" ? b.isOnCriticalPath : true
                );

                return (
                  <div key={laneName} className="flex min-h-[48px] items-stretch">
                    {/* Lane Label */}
                    <div className="w-56 flex-shrink-0 p-3 border-r border-border bg-muted/40/40 text-xs font-semibold text-foreground flex items-center">
                      <span className="truncate">{laneName}</span>
                    </div>

                    {/* Bars Grid */}
                    <div className="flex-1 relative flex flex-col justify-center py-2 px-2 space-y-1.5">
                      {laneBars.map((bar) => {
                        const startIndex = Math.max(0, dayList.indexOf(bar.startAt));
                        const endIndex = Math.max(startIndex, dayList.indexOf(bar.endAt));
                        const spanDays = Math.max(1, endIndex - startIndex + 1);

                        const leftPct = (startIndex / 21) * 100;
                        const widthPct = (spanDays / 21) * 100;

                        return (
                          <div key={bar.id} className="relative w-full h-7">
                            {bar.isMilestone ? (
                              // Diamond shape for milestone (§4.1)
                              <div
                                style={{ left: `${leftPct}%` }}
                                className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10 cursor-pointer"
                                title={bar.title}
                              >
                                <div className="w-4 h-4 rotate-45 bg-amber-500 border-2 border-border shadow-sm" />
                                <span className="text-[10px] font-bold text-amber-800 whitespace-nowrap bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                                  {bar.title}
                                </span>
                              </div>
                            ) : (
                              // Horizontal Bar for task
                              <div
                                style={{
                                  left: `${leftPct}%`,
                                  width: `${Math.max(6, widthPct)}%`,
                                }}
                                className={`absolute top-0 bottom-0 rounded-md px-2 flex items-center justify-between text-[11px] font-medium transition-all shadow-2xs overflow-hidden ${
                                  bar.isOnCriticalPath && activeView.showCriticalPath
                                    ? "bg-red-500 text-white font-semibold"
                                    : "bg-indigo-600 text-white"
                                }`}
                                title={`${bar.title} (${bar.startAt} s/d ${bar.endAt})`}
                              >
                                <span className="truncate">{bar.title}</span>
                                <span className="text-[9px] opacity-80 font-mono ml-1">
                                  {bar.progress}%
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
