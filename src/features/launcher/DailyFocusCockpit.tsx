import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  CheckSquare,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

interface FocusTask {
  id: string;
  title: string;
  completed: boolean;
  priority: string;
}

export function DailyFocusCockpit() {
  const [tasks, setTasks] = useState<FocusTask[]>([
    {
      id: "task-1",
      title: "Finalisasi Executive Summary SWOT & TOWS untuk PT Synergy",
      completed: false,
      priority: "Tinggi",
    },
    {
      id: "task-2",
      title: "Review usulan efisiensi operasional supply chain klien",
      completed: false,
      priority: "Sedang",
    },
    {
      id: "task-3",
      title: "Update neraca portofolio kuadran Aset Q4",
      completed: true,
      priority: "Rendah",
    },
  ]);

  // Pomodoro timer state
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Sync quick capture tasks
  const loadTasks = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("aio_quick_tasks") || "[]");
      if (saved.length > 0) {
        setTasks((prev) => {
          const combined = [...saved, ...prev];
          const unique = Array.from(new Map(combined.map((t) => [t.id, t])).values());
          return unique.slice(0, 3);
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTasks();
    window.addEventListener("aio_data_updated", loadTasks);
    return () => window.removeEventListener("aio_data_updated", loadTasks);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm p-4 sm:p-5 mb-6 text-foreground">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold tracking-tight text-foreground">
              Daily Focus Cockpit
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Prioritas eksekutif hari ini & fokus konsultansi
            </p>
          </div>
        </div>
        <Link
          to="/100-framework"
          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>Pusat Kerja</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side: 3 Priority Tasks */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
            <span>Prioritas Tindakan Utama</span>
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md">
              {tasks.filter((t) => t.completed).length}/{tasks.length} Selesai
            </span>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none text-xs ${
                  task.completed
                    ? "bg-muted/30 border-border/40 text-muted-foreground line-through"
                    : "bg-background/60 border-border/70 hover:border-primary/50 text-foreground"
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}}
                  className="mt-0.5 rounded border-border text-primary focus:ring-0 cursor-pointer"
                />
                <span className="flex-1 leading-snug">{task.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Focus Timer & Next Session */}
        <div className="flex flex-col justify-between gap-3 p-3 rounded-xl border border-border/60 bg-background/40">
          {/* Pomodoro Focus */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <div>
                <span className="text-xs font-bold block text-foreground">Sesi Fokus</span>
                <span className="text-[10px] text-muted-foreground">Blok Waktu 25 Menit</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg font-mono font-bold tracking-wider text-foreground">
                {formatTimer(seconds)}
              </span>
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className={`p-1.5 rounded-lg text-white transition-colors ${
                  isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-primary hover:bg-primary/90"
                }`}
                title={isRunning ? "Jeda" : "Mulai"}
              >
                {isRunning ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setSeconds(25 * 60);
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Reset"
              >
                <RotateCcw className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Next Client Agenda */}
          <div className="pt-2.5 border-t border-border/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <div className="truncate">
                <span className="font-semibold block truncate">Konsultasi Advisory Bisnis</span>
                <span className="text-[10px] text-muted-foreground">14:00 – 15:30 WIB (Google Meet)</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium shrink-0 ml-2">
              Hari Ini
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
