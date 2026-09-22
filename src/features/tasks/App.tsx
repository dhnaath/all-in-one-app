import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import {
  Inbox,
  Calendar,
  CalendarDays,
  List,
  Grid,
  MoreHorizontal,
  X,
  Plus,
  Check,
  Circle,
  AlignLeft,
  ListTodo,
  Activity,
  Flag,
  LayoutGrid,
  ChevronLeft,
  CheckSquare,
} from "lucide-react";
import { cn } from "../wira/lib/utils";
import { SmartTaskInput } from "../wira/components/SmartTaskInput";
import { TaskItem } from "../wira/components/TaskItem";
import { GridTaskItem } from "../wira/components/GridTaskItem";
import { WeeklyCalendar } from "../wira/components/WeeklyCalendar";
import { TasksView } from "../wira/components/views/TasksView";

interface TickTickLayoutProps {
  onBack?: () => void;
}

export default function App({ onBack }: TickTickLayoutProps = {}) {
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"today" | "calendar" | "board">("today");
  const [layoutMode, setLayoutMode] = useState<"list" | "grid">("grid");

  // Mock data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Finalize presentation deck",
      priority: "high",
      date: "Yesterday",
      group: "Overdue",
      completed: false,
      description: "Need to add the Q3 metrics before the meeting.",
    },
    {
      id: 2,
      title: "Send invoice to Client B",
      priority: "medium",
      date: "Today",
      group: "Today",
      completed: false,
      description: "",
    },
    {
      id: 3,
      title: "Weekly sync with team",
      priority: "low",
      date: "Today",
      group: "Today",
      completed: false,
      description: "Discuss the new API integrations.",
    },
    {
      id: 4,
      title: "Review Q3 analytics",
      priority: "none",
      date: "Tomorrow",
      group: "Tomorrow",
      completed: false,
      description: "",
    },
  ]);

  const handleAddTask = (parsedTask: any) => {
    const newTask = {
      id: Date.now(),
      title: parsedTask.title || "Untitled Task",
      priority:
        parsedTask.priority === "High"
          ? "high"
          : parsedTask.priority === "Medium"
            ? "medium"
            : "none",
      date: parsedTask.date || "Today",
      group: "Today",
      completed: false,
      description: "",
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleCompleteTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true, group: "Completed Tasks" } : t)),
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTask?.id === id) {
      setSelectedTask(null);
    }
  };

  return (
    <div className="w-full h-full bg-transparent text-foreground font-sans flex flex-col">
      {/* Header that blends perfectly */}
      <div className="px-6 sm:px-8 pt-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
          <p className="text-muted-foreground mt-2">Kelola tugas harian dan to-do list Anda</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg overflow-x-auto hide-scrollbar">
          <button
            onClick={() => {
              setActiveTab("today");
              setSelectedTask(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${activeTab === "today" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <CheckSquare size={16} />
            <span>Hari Ini</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("calendar");
              setSelectedTask(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${activeTab === "calendar" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <CalendarDays size={16} />
            <span>Kalender</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("board");
              setSelectedTask(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${activeTab === "board" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid size={16} />
            <span>Papan Tugas</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === "calendar" ? (
          <div className="h-full overflow-y-auto p-6 sm:p-8">
            <WeeklyCalendar />
          </div>
        ) : activeTab === "board" ? (
          <div className="h-full w-full bg-secondary/20">
            <TasksView />
          </div>
        ) : (
          <div className="flex h-full w-full bg-transparent overflow-hidden">
            {/* Center Column: Task List */}
            <div
              className={cn(
                "flex-1 flex-col transition-all relative border-r border-border",
                selectedTask ? "hidden lg:flex" : "flex",
              )}
            >
              <div className="h-14 flex items-center justify-between px-6 sm:px-8 border-b border-border/40 shrink-0">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold tracking-tight">Tugas Hari Ini</h2>
                  <span className="ml-3 text-sm font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-md hidden sm:inline-block">
                    {new Date().toLocaleDateString("id-ID", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-secondary/50 p-1 rounded-md">
                    <button
                      onClick={() => setLayoutMode("list")}
                      className={cn(
                        "p-1.5 rounded transition-colors",
                        layoutMode === "list"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <List size={16} />
                    </button>
                    <button
                      onClick={() => setLayoutMode("grid")}
                      className={cn(
                        "p-1.5 rounded transition-colors",
                        layoutMode === "grid"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Grid size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 pb-24">
                {/* Smart Add Input */}
                <div className="mb-8 max-w-3xl">
                  <SmartTaskInput onAdd={handleAddTask} />
                </div>

                {/* Task Groups */}
                <div className="space-y-8 max-w-5xl">
                  {["Overdue", "Today", "Tomorrow", "Completed Tasks"].map((group) => {
                    const groupTasks = tasks.filter((t) => t.group === group);
                    if (groupTasks.length === 0) return null;

                    return (
                      <div key={group}>
                        <h3
                          className={cn(
                            "text-sm font-bold mb-4",
                            group === "Overdue" ? "text-destructive" : "text-foreground",
                          )}
                        >
                          {group}
                        </h3>
                        {layoutMode === "list" ? (
                          <div className="space-y-1">
                            {groupTasks.map((task) => (
                              <TaskItem
                                key={task.id}
                                task={task}
                                selected={selectedTask?.id === task.id}
                                onClick={() => setSelectedTask(task)}
                                onComplete={() => handleCompleteTask(task.id)}
                                onDelete={() => handleDeleteTask(task.id)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {groupTasks.map((task) => (
                              <GridTaskItem
                                key={task.id}
                                task={task}
                                selected={selectedTask?.id === task.id}
                                onClick={() => setSelectedTask(task)}
                                onComplete={() => handleCompleteTask(task.id)}
                                onDelete={() => handleDeleteTask(task.id)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Task Detail Pane */}
            {selectedTask && (
              <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 bg-card flex flex-col relative animate-in slide-in-from-right-4 duration-200">
                <div className="h-14 flex items-center justify-between px-4 border-b border-border/40 shrink-0">
                  <div className="flex items-center text-muted-foreground gap-1">
                    <button
                      className="lg:hidden p-1.5 hover:bg-secondary hover:text-foreground rounded-md transition-colors mr-2"
                      onClick={() => setSelectedTask(null)}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-secondary hover:text-foreground rounded-md transition-colors tooltip"
                      title="Mark as complete"
                      onClick={() => handleCompleteTask(selectedTask.id)}
                    >
                      <Check size={18} />
                    </button>
                    <button className="p-1.5 hover:bg-secondary hover:text-foreground rounded-md transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="hidden lg:block p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-md transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                  {/* Title */}
                  <div className="flex items-start mb-6">
                    <button
                      onClick={() => handleCompleteTask(selectedTask.id)}
                      className="mr-3 mt-1.5 text-muted-foreground hover:text-primary transition-colors shrink-0"
                    >
                      <Circle size={22} strokeWidth={2.5} />
                    </button>
                    <textarea
                      value={selectedTask.title}
                      className="w-full text-xl font-bold text-foreground bg-transparent resize-none outline-none min-h-[32px] leading-snug"
                      rows={2}
                      readOnly
                    />
                  </div>

                  {/* Metadata / Date Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-foreground bg-secondary/50 px-3 py-2.5 rounded-xl hover:bg-secondary cursor-pointer transition-colors border border-border shadow-sm">
                      <div className="bg-background p-1.5 rounded-md shadow-sm border border-border">
                        <Calendar size={14} className="text-primary" />
                      </div>
                      <span className="font-medium">{selectedTask.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-foreground bg-secondary/50 px-3 py-2.5 rounded-xl hover:bg-secondary cursor-pointer transition-colors border border-border shadow-sm">
                      <div className="bg-background p-1.5 rounded-md shadow-sm border border-border">
                        <Flag
                          size={14}
                          className={
                            selectedTask.priority === "high"
                              ? "text-destructive"
                              : selectedTask.priority === "medium"
                                ? "text-amber-500"
                                : "text-muted-foreground"
                          }
                        />
                      </div>
                      <span className="font-medium capitalize">
                        {selectedTask.priority || "No Priority"}
                      </span>
                    </div>
                  </div>

                  {/* Subtasks */}
                  <div className="mb-8">
                    <div className="flex items-center text-foreground font-bold mb-3 text-sm">
                      <ListTodo size={16} className="mr-2 text-muted-foreground" /> Subtasks
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm group">
                        <button className="text-muted-foreground hover:text-primary mr-2 shrink-0">
                          <Circle size={16} strokeWidth={2.5} />
                        </button>
                        <span className="text-foreground/90 flex-1">Outline structure</span>
                        <X
                          size={14}
                          className="text-muted-foreground opacity-0 group-hover:opacity-100 cursor-pointer hover:text-destructive transition-all"
                        />
                      </div>
                      <div className="flex items-center text-sm text-primary mt-2 cursor-pointer hover:text-primary/80 font-medium transition-colors">
                        <Plus size={16} className="mr-2 shrink-0" /> Add subtask
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <div className="flex items-center text-foreground font-bold mb-3 text-sm">
                      <AlignLeft size={16} className="mr-2 text-muted-foreground" /> Description
                    </div>
                    <div className="text-sm text-foreground/80 bg-secondary/30 p-4 rounded-xl border border-border min-h-[120px] cursor-text whitespace-pre-wrap leading-relaxed shadow-inner">
                      {selectedTask.description || "Add more details here..."}
                    </div>
                  </div>

                  {/* Activity Log */}
                  <div className="mt-auto pt-8">
                    <div className="flex items-center text-foreground font-bold mb-4 text-sm">
                      <Activity size={16} className="mr-2 text-muted-foreground" /> Activity
                    </div>
                    <div className="text-xs text-muted-foreground space-y-4 relative before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-border ml-1">
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1 w-4 h-4 bg-background border-[3px] border-primary rounded-full shadow-sm" />
                        <div className="font-medium text-foreground">Created task</div>
                        <div className="text-muted-foreground mt-1">Oct 24, 10:00 AM</div>
                      </div>
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1 w-4 h-4 bg-background border-[3px] border-muted-foreground rounded-full shadow-sm" />
                        <div className="font-medium text-foreground">Changed due date to Today</div>
                        <div className="text-muted-foreground mt-1">Oct 25, 08:30 AM</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Input Area */}
                <div className="p-4 border-t border-border bg-card shrink-0">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary transition-colors shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
