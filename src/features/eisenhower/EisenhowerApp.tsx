import React, { useState, useMemo } from "react";
import {
  Grid2X2,
  AlertOctagon,
  Calendar,
  Users,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useEisenhowerMatrix, QUADRANT_DEFS } from "./store";
import { QuadrantKey, EisenhowerViewMode } from "./types";
import { Task } from "../task-manager/types";

export function EisenhowerApp() {
  const {
    state,
    classifiedTasks,
    setOverride,
    clearOverride,
    scheduleToPlanner,
    delegateTask,
    eliminateTask,
  } = useEisenhowerMatrix();

  const [viewMode, setViewMode] = useState<EisenhowerViewMode>("grid");
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantKey>("q1_do");

  // Ratios (§8)
  const totalClassified =
    classifiedTasks.q1_do.length +
    classifiedTasks.q2_schedule.length +
    classifiedTasks.q3_delegate.length +
    classifiedTasks.q4_eliminate.length;

  const q1Ratio = totalClassified > 0 ? Math.round((classifiedTasks.q1_do.length / totalClassified) * 100) : 0;
  const q2Ratio = totalClassified > 0 ? Math.round((classifiedTasks.q2_schedule.length / totalClassified) * 100) : 0;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50 text-slate-800">
      {/* LEFT SIDEBAR: Matrix Analytics & Health Indicators */}
      <aside className="w-80 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white border-2 border-slate-200 shadow-xs flex items-center justify-center text-slate-800 shrink-0">
            <Grid2X2 className="w-4 h-4 text-slate-800" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-slate-900 tracking-tight">Eisenhower Matrix</h2>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                Tanda Sementara
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Lapisan Klasifikasi Urgensi & Kepentingan (#08)</p>
          </div>
        </div>

        {/* Matrix Health Indicator (§8) */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/70">
          <span className="text-[11px] font-semibold text-slate-700">Indikator Kesehatan Waktu</span>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Q1 (Pemadam Kebakaran):</span>
                <span className="font-bold text-red-600">{q1Ratio}% ({classifiedTasks.q1_do.length})</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all" style={{ width: `${q1Ratio}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Q2 (Kerja Terencana):</span>
                <span className="font-bold text-blue-600">{q2Ratio}% ({classifiedTasks.q2_schedule.length})</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all" style={{ width: `${q2Ratio}%` }} />
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-white border border-slate-200 rounded text-[11px] text-slate-600 leading-snug">
            {q2Ratio >= q1Ratio ? (
              <p className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                Manajemen Sehat: Proporsi waktu Anda lebih banyak untuk perencanaan jangka panjang (Q2) daripada krisis mendesak.
              </p>
            ) : (
              <p className="text-amber-700 font-medium flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                Peringatan: Q1 terlalu tinggi. Banyak tugas ditunda hingga menjadi krisis mendesak.
              </p>
            )}
          </div>
        </div>

        {/* Rule Configurations (§3.3) */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <span className="text-[11px] font-semibold text-slate-700">Aturan Ambang Urgensi</span>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Ambang Mendesak:</span>
              <span className="font-bold text-slate-900 font-mono">
                {state.rule.urgencyThresholdDays} Hari
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Tugas dengan batas waktu $\le 2$ hari otomatis dikategorikan Mendesak (Urgent).
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-700">Navigasi Kuadran Detail</span>
            {(Object.keys(QUADRANT_DEFS) as QuadrantKey[]).map((key) => {
              const def = QUADRANT_DEFS[key];
              const count = classifiedTasks[key].length;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedQuadrant(key);
                    setViewMode("detail");
                  }}
                  className="w-full p-2 text-left rounded border border-slate-200 hover:border-indigo-300 text-xs flex items-center justify-between transition-colors bg-white"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: def.color }} />
                    <span className="font-semibold text-slate-800">{def.label}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footnote */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-500">
          <p className="font-semibold text-slate-700">Standalone App #08</p>
          <p className="mt-0.5">Klasifikasi terstruktur tanpa mengubah data Task asli.</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Top Header */}
        <header className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Matriks Prioritas Eisenhower</h1>
            <p className="text-xs text-slate-500">
              Klasifikasi keputusan 4 kuadran: Do First, Schedule, Delegate, Eliminate.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-slate-200 rounded-md p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                2x2 Grid View
              </button>
              <button
                onClick={() => setViewMode("detail")}
                className={`px-3 py-1 rounded transition-colors ${
                  viewMode === "detail"
                    ? "bg-white text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Detail Kuadran
              </button>
            </div>
          </div>
        </header>

        {/* VIEW 1: 2x2 GRID VIEW */}
        {viewMode === "grid" && (
          <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(QUADRANT_DEFS) as QuadrantKey[]).map((key) => {
              const def = QUADRANT_DEFS[key];
              const taskList = classifiedTasks[key];

              return (
                <div
                  key={key}
                  className="bg-white border rounded-xl flex flex-col min-h-[300px] shadow-2xs overflow-hidden"
                  style={{ borderColor: `${def.color}40` }}
                >
                  {/* Quadrant Header */}
                  <div
                    className="p-3 border-b flex items-center justify-between"
                    style={{ backgroundColor: `${def.color}08`, borderColor: `${def.color}25` }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: def.color }} />
                        <h3 className="text-xs font-bold text-slate-900">{def.label}</h3>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{def.recommendedAction}</p>
                    </div>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {taskList.length}
                    </span>
                  </div>

                  {/* Task Cards Inside Quadrant */}
                  <div className="p-3 flex-1 overflow-y-auto space-y-2.5">
                    {taskList.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-10">Tidak ada tugas pada kuadran ini.</p>
                    ) : (
                      taskList.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-all shadow-2xs space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">{task.title}</h4>
                            <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 flex-shrink-0">
                              {task.priority}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Deadline: {task.dueAt ? new Date(task.dueAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "Tidak Ada"}</span>
                            {task.assigneeName && <span>PJ: {task.assigneeName}</span>}
                          </div>

                          {/* Quick Actions (§11 & §12) */}
                          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                            {key === "q1_do" && (
                              <button
                                onClick={() => scheduleToPlanner(task)}
                                className="text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded font-medium transition-colors"
                              >
                                Kerjakan Sekarang
                              </button>
                            )}
                            {key === "q2_schedule" && (
                              <button
                                onClick={() => {
                                  scheduleToPlanner(task);
                                  alert(`Tugas "${task.title}" berhasil dialokasikan ke Planner (#04)!`);
                                }}
                                className="text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded font-medium transition-colors"
                              >
                                Jadwalkan ke Planner
                              </button>
                            )}
                            {key === "q3_delegate" && (
                              <button
                                onClick={() => {
                                  const assignee = prompt("Delegasikan tugas ini kepada:", "Junior Associate");
                                  if (assignee) delegateTask(task.id, assignee);
                                }}
                                className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded font-medium transition-colors"
                              >
                                Delegasikan
                              </button>
                            )}
                            {key === "q4_eliminate" && (
                              <button
                                onClick={() => {
                                  if (confirm("Batalkan / eliminasi tugas ini?")) eliminateTask(task.id);
                                }}
                                className="text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-700 px-2 py-0.5 rounded font-medium transition-colors"
                              >
                                Eliminasi
                              </button>
                            )}

                            {/* Move manual override switcher */}
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) setOverride(task.id, e.target.value as QuadrantKey);
                              }}
                              className="text-[10px] p-0.5 bg-slate-50 border border-slate-200 rounded text-slate-500"
                            >
                              <option value="">Pindah...</option>
                              <option value="q1_do">Ke Q1 (Do)</option>
                              <option value="q2_schedule">Ke Q2 (Schedule)</option>
                              <option value="q3_delegate">Ke Q3 (Delegate)</option>
                              <option value="q4_eliminate">Ke Q4 (Eliminate)</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: QUADRANT DETAIL */}
        {viewMode === "detail" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{QUADRANT_DEFS[selectedQuadrant].label}</h3>
                <p className="text-xs text-slate-500">{QUADRANT_DEFS[selectedQuadrant].recommendedAction}</p>
              </div>
              <span className="text-xs font-bold font-mono px-3 py-1 bg-slate-100 rounded text-slate-800">
                {classifiedTasks[selectedQuadrant].length} Tugas
              </span>
            </div>

            <div className="space-y-2">
              {classifiedTasks[selectedQuadrant].map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      Prioritas: {task.priority} · Deadline: {task.dueAt || "Tidak ada"}
                    </p>
                  </div>
                  <button
                    onClick={() => clearOverride(task.id)}
                    className="text-[11px] text-slate-400 hover:text-slate-700 underline"
                  >
                    Reset ke Otomatis
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
