import { useState, useMemo, useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  GalleryHorizontal,
  X,
  Layers,
  CheckSquare,
  Plus,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Compass,
  Briefcase,
  Home,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";
import { navKonsultan } from "@/config/nav";
import { isNewlyRevisedApp } from "@/utils/revisedAppsMarker";

interface TaskbarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WorkspaceWindow {
  id: string;
  title: string;
  subtitle: string;
  to: string;
  icon: any;
  category: string;
  badge?: string;
}

interface QuickTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const STORAGE_TASKBAR_TASKS = "aio_taskbar_active_tasks";

const DEFAULT_TASKS: QuickTask[] = [
  { id: "1", text: "Tinjau alokasi aset kuartal ini", completed: false, createdAt: Date.now() - 3600000 },
  { id: "2", text: "Finalisasi rencana strategis Mini MBA", completed: true, createdAt: Date.now() - 7200000 },
  { id: "3", text: "Perbarui notula rapat mitra eksternal", completed: false, createdAt: Date.now() - 1800000 },
];

export function TaskbarModal({ isOpen, onClose }: TaskbarModalProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [activeTab, setActiveTab] = useState<"switcher" | "tasks">("switcher");
  const [newTaskInput, setNewTaskInput] = useState("");
  const [activeMode, setActiveMode] = useState<string>("personal");

  // Load quick tasks from localStorage
  const [tasks, setTasks] = useState<QuickTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TASKBAR_TASKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TASKBAR_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save taskbar tasks", e);
    }
  }, [tasks]);

  useEffect(() => {
    const updateMode = () => {
      const mode = localStorage.getItem("client_os_active_mode") || "personal";
      setActiveMode(mode);
    };
    updateMode();
    window.addEventListener("aio_mode_changed", updateMode);
    return () => window.removeEventListener("aio_mode_changed", updateMode);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Primary Workspace Windows
  const primaryWindows: WorkspaceWindow[] = useMemo(
    () => [
      {
        id: "launcher",
        title: "Launcher Modul",
        subtitle: "Pusat peluncur navigasi kerja konsultan",
        to: "/",
        icon: LayoutDashboard,
        category: "System",
        badge: "Pusat Modul",
      },
      {
        id: "home",
        title: "Beranda Eksekutif",
        subtitle: "Ringkasan metrik harian & KPI",
        to: "/home",
        icon: Home,
        category: "Executive",
      },
      {
        id: "finance",
        title: "Financial Planning",
        subtitle: "Neraca aset, liabilitas, dan arus kas",
        to: "/asset",
        icon: Wallet,
        category: "Finance",
      },
      {
        id: "wealth",
        title: "Wealth Management",
        subtitle: "Kurasi spektrum nilai & valuasi MAPPI",
        to: "/kurasi-wealth",
        icon: TrendingUp,
        category: "Wealth",
      },
      {
        id: "mba",
        title: "Mini MBA (100 Tools)",
        subtitle: "Framework bisnis, model & strategi eksekutif",
        to: "/100-framework",
        icon: Compass,
        category: "Frameworks",
      },
      {
        id: "projects",
        title: "Proyek & Operasional",
        subtitle: "Manajemen eksekusi alur kerja tim",
        to: "/proyek",
        icon: Briefcase,
        category: "Operations",
      },
    ],
    []
  );

  const handleSwitchWindow = (to: string) => {
    onClose();
    const toPath = to.split("?")[0];
    const toSearch = to.includes("?")
      ? Object.fromEntries(new URLSearchParams(to.split("?")[1]))
      : undefined;
    navigate({ to: toPath as any, search: toSearch as any });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask: QuickTask = {
      id: Date.now().toString(),
      text: newTaskInput.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskInput("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const activePendingTasksCount = tasks.filter((t) => !t.completed).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Pop-up window positioned directly above dock */}
      <div
        className="fixed bottom-[88px] left-1/2 -translate-x-1/2 z-50 w-[92vw] sm:w-[440px] max-h-[calc(100vh-110px)] rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-[30px] border border-white/60 dark:border-white/15 shadow-[0px_4px_21px_-8px_rgba(255,255,255,0.5),0_20px_50px_rgba(0,0,0,0.22)] liquid-glass-dock overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-200 select-none cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-primary/10 text-primary">
                <GalleryHorizontal className="size-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-foreground tracking-tight flex items-center gap-1.5">
                  Taskbar & Active Switcher
                  <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                    Live
                  </span>
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Multitasking & manajemen ruang kerja aktif
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Segmented control */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted/50 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("switcher")}
              className={`flex items-center justify-center gap-1.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "switcher"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="size-3.5" />
              <span>Ruang Kerja</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tasks")}
              className={`flex items-center justify-center gap-1.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "tasks"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckSquare className="size-3.5" />
              <span>Tugas Berjalan ({activePendingTasksCount})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Switcher (Workspace Cards) */}
        {activeTab === "switcher" && (
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 max-h-[350px]">
            <div className="text-[10px] font-semibold text-muted-foreground px-1 pb-1 flex items-center justify-between">
              <span>JENDELA & MODUL AKTIF</span>
              <span className="capitalize text-primary font-medium">Mode: {activeMode}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {primaryWindows.map((win) => {
                const isCurrent =
                  pathname === win.to ||
                  (win.to !== "/" && pathname.startsWith(win.to));
                const Icon = win.icon;

                return (
                  <button
                    key={win.id}
                    type="button"
                    onClick={() => handleSwitchWindow(win.to)}
                    className={`group relative text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isCurrent
                        ? "bg-primary/10 border-primary/40 ring-1 ring-primary/20 shadow-xs"
                        : "bg-muted/30 hover:bg-muted/70 border-border/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      {(() => {
                        const isRevised = isNewlyRevisedApp(win.to, win.title);
                        return (
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isRevised
                                ? "bg-white text-zinc-950 border border-zinc-300 dark:border-white shadow-2xs"
                                : isCurrent
                                ? "bg-primary text-primary-foreground"
                                : "bg-background text-muted-foreground group-hover:text-foreground border border-border/60"
                            }`}
                          >
                            <Icon className={`size-3.5 ${isRevised ? "text-zinc-950" : ""}`} />
                          </div>
                        );
                      })()}
                      {isCurrent ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground">
                          Aktif
                        </span>
                      ) : (
                        <ArrowRight className="size-3 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-foreground truncate">
                        {win.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {win.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick action bar */}
            <div className="pt-2 border-t border-border/40 mt-2 flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate({ to: "/task-manager" as any });
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
              >
                <span>Buka Task Manager Lengkap</span>
                <ExternalLink className="size-3" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate({ to: "/" as any });
                }}
                className="text-[10px] text-muted-foreground hover:text-foreground"
              >
                Kembali ke Launcher
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Running Tasks & Active Session */}
        {activeTab === "tasks" && (
          <div className="flex-1 overflow-y-auto p-3 flex flex-col max-h-[350px]">
            {/* Quick Task Input Form */}
            <form onSubmit={handleAddTask} className="flex gap-1.5 mb-3">
              <input
                type="text"
                placeholder="Catat tugas cepat saat ini..."
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-muted/40 border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/60 transition-all"
              />
              <button
                type="submit"
                disabled={!newTaskInput.trim()}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0"
              >
                <Plus className="size-3.5" />
                <span>Catat</span>
              </button>
            </form>

            {/* Task list */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
              {tasks.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <CheckSquare className="size-6 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold text-foreground">Tidak ada tugas aktif</p>
                  <p className="text-[10px] mt-0.5">
                    Gunakan kolom di atas untuk mencatat tugas yang sedang berjalan.
                  </p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group flex items-center justify-between p-2 rounded-xl border transition-all ${
                      task.completed
                        ? "bg-muted/20 border-transparent text-muted-foreground opacity-60"
                        : "bg-muted/30 border-border/40 hover:border-border text-foreground"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                    >
                      <div
                        className={`size-4 rounded-md border flex items-center justify-center transition-colors ${
                          task.completed
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border hover:border-primary/60"
                        }`}
                      >
                        {task.completed && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs truncate ${
                          task.completed ? "line-through opacity-70" : "font-medium"
                        }`}
                      >
                        {task.text}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive rounded-md transition-all ml-1"
                      title="Hapus tugas"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Clear completed button */}
            {tasks.some((t) => t.completed) && (
              <div className="pt-2 mt-2 border-t border-border/40 flex justify-end">
                <button
                  type="button"
                  onClick={() => setTasks((prev) => prev.filter((t) => !t.completed))}
                  className="text-[10px] text-muted-foreground hover:text-foreground"
                >
                  Bersihkan tugas yang selesai
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="px-3 py-2 border-t border-border/50 bg-muted/10 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Taskbar Multitasking</span>
          <span className="font-medium text-foreground/80">Esc untuk menutup</span>
        </div>
      </div>
    </>
  );
}
