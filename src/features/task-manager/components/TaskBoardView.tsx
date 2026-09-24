import { useState } from "react";
import {
  Plus,
  Clock,
  CornerDownRight,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import { Task, TaskPriority, TaskStatus } from "../types";
import { useTaskManager } from "../store";

interface TaskBoardViewProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
  onQuickCreate: (status: TaskStatus) => void;
}

const COLUMNS: Array<{ id: TaskStatus; label: string; color: string }> = [
  { id: "inbox", label: "Inbox", color: "bg-muted-foreground/30" },
  { id: "planned", label: "Planned", color: "bg-blue-500" },
  { id: "in_progress", label: "In Progress", color: "bg-amber-500" },
  { id: "waiting", label: "Waiting", color: "bg-purple-500" },
  { id: "completed", label: "Completed", color: "bg-emerald-500" },
];

export function TaskBoardView({ tasks, onSelectTask, onQuickCreate }: TaskBoardViewProps) {
  const { updateTask, getSubtaskProgress, projects, tags } = useTaskManager();

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case "urgent":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-600 text-white">URGENT</span>;
      case "high":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-white">HIGH</span>;
      case "medium":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-500/20 text-blue-600 dark:text-blue-400">MED</span>;
      case "low":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">LOW</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="flex-shrink-0 w-72 sm:w-80 flex flex-col bg-muted/20 border border-border/60 rounded-2xl p-3 max-h-[calc(100vh-220px)]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-1.5 mb-2">
              <div className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${col.color}`} />
                <h3 className="text-xs font-bold text-foreground tracking-wide uppercase">
                  {col.label}
                </h3>
                <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>
              <button
                onClick={() => onQuickCreate(col.id)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title={`Tambah task di ${col.label}`}
              >
                <Plus className="size-4" />
              </button>
            </div>

            {/* Cards List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {colTasks.map((task) => {
                const progress = getSubtaskProgress(task.id);
                const project = projects.find((p) => p.id === task.projectId);

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task.id)}
                    className="p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer space-y-2 group text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {task.title}
                      </span>
                      {getPriorityBadge(task.priority)}
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Meta Row: Subtasks, Due Date, Project */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                      <div className="flex items-center gap-2">
                        {progress.total > 0 && (
                          <span className="flex items-center gap-0.5 text-primary font-medium">
                            <CornerDownRight className="size-3" />
                            {progress.completed}/{progress.total}
                          </span>
                        )}

                        {project && (
                          <span className="flex items-center gap-1 truncate max-w-[90px]">
                            <FolderOpen className="size-2.5 text-primary shrink-0" />
                            <span className="truncate">{project.name}</span>
                          </span>
                        )}
                      </div>

                      {task.dueAt && (
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="size-3" />
                          {new Date(task.dueAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    {/* Move selector for fast board movement */}
                    <div className="pt-1 flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground opacity-60">Pindah:</span>
                      <select
                        value={task.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateTask(task.id, { status: e.target.value as TaskStatus });
                        }}
                        className="rounded bg-muted/60 border border-border/50 text-[10px] px-1.5 py-0.5 text-foreground cursor-pointer"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}

              {colTasks.length === 0 && (
                <div className="p-6 text-center text-xs text-muted-foreground/60 border border-dashed border-border/50 rounded-xl">
                  Kosong
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
