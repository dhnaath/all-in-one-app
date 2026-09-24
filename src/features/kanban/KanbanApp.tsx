import React, { useState, useMemo } from "react";
import {
  LayoutGrid,
  Layers,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Tag,
  Sliders,
  Maximize2,
  BarChart2,
  Plus,
} from "lucide-react";
import { useKanbanBoard } from "./store";
import { KanbanViewMode, SwimlaneBy, Column } from "./types";
import { Task } from "../task-manager/types";

export function KanbanApp() {
  const {
    state,
    activeBoard,
    tasks,
    columnTaskMap,
    moveCard,
    setSwimlane,
  } = useKanbanBoard();

  const [viewMode, setViewMode] = useState<KanbanViewMode>("board");

  // Swimlane groups
  const swimlaneGroups = useMemo(() => {
    if (activeBoard.swimlaneBy === "none") return null;

    if (activeBoard.swimlaneBy === "priority") {
      return ["urgent", "high", "medium", "low"];
    }

    if (activeBoard.swimlaneBy === "assignee") {
      const assignees = new Set<string>();
      tasks.forEach((t) => assignees.add(t.assigneeName || "Belum Ditugaskan"));
      return Array.from(assignees);
    }

    return null;
  }, [activeBoard.swimlaneBy, tasks]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50 text-slate-800">
      {/* LEFT SIDEBAR: Board Controls & WIP Summary */}
      <aside className="w-72 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white border-2 border-slate-200 shadow-xs flex items-center justify-center text-slate-800 shrink-0">
            <LayoutGrid className="w-4 h-4 text-slate-800" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-slate-900 tracking-tight">Kanban Board</h2>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                Tanda Sementara
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Lapisan Alur Kerja & WIP Limit (#09)</p>
          </div>
        </div>

        {/* Swimlane Selector (§6) */}
        <div className="p-4 border-b border-slate-100 space-y-2">
          <span className="text-[11px] font-semibold text-slate-700">Pengelompokan Swimlane</span>
          <select
            value={activeBoard.swimlaneBy}
            onChange={(e) => setSwimlane(e.target.value as SwimlaneBy)}
            className="w-full text-xs p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 bg-slate-50"
          >
            <option value="none">Tanpa Swimlane (Standar)</option>
            <option value="priority">Berdasarkan Prioritas</option>
            <option value="assignee">Berdasarkan Penanggung Jawab</option>
          </select>
        </div>

        {/* WIP Limit Overview (§4.2 & §9) */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <span className="text-[11px] font-semibold text-slate-700">Utilisasi Batas WIP Kolom</span>
          <div className="space-y-2.5">
            {activeBoard.columns.map((col) => {
              const current = (columnTaskMap[col.id] || []).length;
              const max = col.wipLimit;
              const pct = max ? Math.min(100, Math.round((current / max) * 100)) : null;
              const isBottleneck = max !== null && current >= max;

              return (
                <div key={col.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{col.name}</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {current} {max ? `/ ${max}` : "(Bebas)"}
                    </span>
                  </div>

                  {max && (
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isBottleneck ? "bg-red-500" : pct! > 70 ? "bg-amber-500" : "bg-indigo-600"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}

                  {isBottleneck && (
                    <p className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="w-3 h-3" />
                      Potensi Bottleneck Aliran
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footnote */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-500">
          <p className="font-semibold text-slate-700">Standalone App #09</p>
          <p className="mt-0.5">Perpindahan card menulis balik ke Task Manager secara otomatis.</p>
        </div>
      </aside>

      {/* MAIN KANBAN BOARD */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Top Header */}
        <header className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">{activeBoard.name}</h1>
            <p className="text-xs text-slate-500">
              Visualisasi tahapan kerja dinamis dengan kendali aliran WIP limit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-slate-200 rounded-md p-0.5 bg-slate-50 text-xs">
              {[
                { id: "board", label: "Papan Kolom" },
                { id: "compact", label: "Ringkas (Compact)" },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id as KanbanViewMode)}
                  className={`px-3 py-1 rounded transition-colors ${
                    viewMode === v.id
                      ? "bg-white text-slate-900 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* COLUMNS AREA */}
        <div className="flex-1 overflow-x-auto p-4 flex gap-4 items-start bg-slate-100/60">
          {activeBoard.columns.map((col) => {
            const colTasks = columnTaskMap[col.id] || [];
            const isFull = col.wipLimit !== null && colTasks.length >= col.wipLimit;

            return (
              <div
                key={col.id}
                className="w-72 flex-shrink-0 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col max-h-[calc(100vh-145px)]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                    <h3 className="text-xs font-bold text-slate-900">{col.name}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      isFull
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {colTasks.length} {col.wipLimit ? `/${col.wipLimit}` : ""}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-2.5 flex-1 overflow-y-auto space-y-2">
                  {colTasks.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8 italic">Kosong</p>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-indigo-400 transition-all space-y-2 ${
                          viewMode === "compact" ? "py-2" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">{task.title}</h4>
                          <span className="text-[9px] font-bold uppercase px-1 py-0.5 rounded bg-slate-100 text-slate-600 flex-shrink-0">
                            {task.priority}
                          </span>
                        </div>

                        {viewMode !== "compact" && (
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>{task.dueAt ? new Date(task.dueAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "Tanpa Batas"}</span>
                            <span>{task.assigneeName || "Unassigned"}</span>
                          </div>
                        )}

                        {/* Column Relocator Controls (§13) */}
                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Pindah ke:</span>
                          <div className="flex items-center gap-1">
                            {activeBoard.columns
                              .filter((c) => c.id !== col.id)
                              .map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => moveCard(task.id, c.id)}
                                  className="px-1.5 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded text-slate-600 font-medium transition-colors"
                                  title={`Pindahkan ke ${c.name}`}
                                >
                                  {c.name.slice(0, 3)}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
