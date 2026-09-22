import { useState } from "react";
import { AnimatePresence } from "motion/react";
import {
  Inbox,
  Calendar,
  Sun,
  CalendarDays,
  Hash,
  Folder,
  MoreHorizontal,
  X,
  Plus,
  Check,
  Circle,
  AlignLeft,
  ListTodo,
  Activity,
  Flag,
  Search,
  Bell,
  LayoutGrid,
  ChevronLeft,
  List,
  Grid,
} from "lucide-react";
import { cn } from "../lib/utils";
import { SmartTaskInput } from "./SmartTaskInput";
import { TaskItem } from "./TaskItem";
import { GridTaskItem } from "./GridTaskItem";
import { WeeklyCalendar } from "./WeeklyCalendar";
import { TasksView } from "./views/TasksView";

interface TickTickLayoutProps {
  onBack?: () => void;
}

export function TickTickLayout({ onBack }: TickTickLayoutProps = {}) {
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [activeView, setActiveView] = useState<"today" | "calendar" | "board">("today");
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
    <div className="flex h-full w-full bg-card text-foreground overflow-hidden font-sans relative">
      {/* Pane 1: Narrow Sidebar (Kolom Kiri) */}
      <div className="hidden md:flex w-[240px] shrink-0 bg-[#F9F9F9] border-r border-border flex-col transition-all">
        {onBack && (
          <div
            onClick={onBack}
            className="h-10 flex items-center px-4 cursor-pointer hover:bg-accent/50 transition-colors text-muted-foreground border-b border-border"
          >
            <ChevronLeft size={16} className="mr-1" />
            <span className="text-[13px] font-medium">Back to Zoho</span>
          </div>
        )}

        {/* Profile / Header */}
        <div className="h-14 flex items-center justify-between px-4 mb-2 shrink-0">
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm">
              S
            </div>
            <span className="ml-2 font-semibold text-sm">Solopreneur</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="text-muted-foreground/70 hover:text-card-foreground p-1 rounded transition-colors">
              <Search size={16} />
            </button>
            <button className="text-muted-foreground/70 hover:text-card-foreground p-1 rounded transition-colors">
              <Bell size={16} />
            </button>
          </div>
        </div>

        {/* Nav Items */}
        <div className="px-3 space-y-0.5 flex-1 overflow-y-auto scrollbar-hide pb-6">
          <NavItem icon={Inbox} label="Inbox" count={12} />
          <NavItem
            icon={Calendar}
            label="Today"
            count={tasks.filter((t) => t.group === "Today").length}
            active={activeView === "today"}
            onClick={() => setActiveView("today")}
          />
          <NavItem
            icon={Sun}
            label="Tomorrow"
            count={tasks.filter((t) => t.group === "Tomorrow").length}
            onClick={() => setActiveView("today")}
          />
          <NavItem
            icon={CalendarDays}
            label="Calendar"
            active={activeView === "calendar"}
            onClick={() => setActiveView("calendar")}
          />
          <NavItem
            icon={LayoutGrid}
            label="Kanban Board"
            active={activeView === "board"}
            onClick={() => setActiveView("board")}
          />

          <div className="mt-6 mb-2 px-2 text-xs font-semibold text-muted-foreground/70 flex items-center justify-between group cursor-pointer">
            LISTS{" "}
            <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <NavItem icon={Folder} label="Work" color="text-blue-500" />
          <NavItem icon={Folder} label="Personal" color="text-emerald-500" />
          <NavItem icon={Folder} label="Ideas" color="text-amber-500" />

          <div className="mt-6 mb-2 px-2 text-xs font-semibold text-muted-foreground/70 flex items-center justify-between group cursor-pointer">
            TAGS <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <NavItem icon={Hash} label="urgent" color="text-rose-500" />
          <NavItem icon={Hash} label="planning" color="text-purple-500" />
          <NavItem icon={Hash} label="finance" color="text-emerald-500" />
        </div>
      </div>

      {activeView === "calendar" ? (
        <WeeklyCalendar />
      ) : activeView === "board" ? (
        <div className="flex-1 w-full h-full bg-muted/50">
          <TasksView />
        </div>
      ) : (
        <>
          {/* Pane 2: Task List View (Kolom Tengah) */}
          <div
            className={cn(
              "flex-1 flex-col md:min-w-[320px] bg-card transition-all relative",
              selectedTask ? "hidden md:flex" : "flex",
            )}
          >
            <div className="h-14 flex items-center justify-between px-4 md:px-8 border-b border-transparent shrink-0">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-foreground">Today</h1>
                <span className="ml-3 text-sm font-medium text-muted-foreground/70 bg-muted px-2 py-0.5 rounded-md hidden sm:inline-block">
                  Wed, Oct 25
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-muted p-1 rounded-md">
                  <button
                    onClick={() => setLayoutMode("list")}
                    className={cn(
                      "p-1.5 rounded text-muted-foreground transition-colors",
                      layoutMode === "list"
                        ? "bg-card text-foreground shadow-sm"
                        : "hover:text-card-foreground",
                    )}
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => setLayoutMode("grid")}
                    className={cn(
                      "p-1.5 rounded text-muted-foreground transition-colors",
                      layoutMode === "grid"
                        ? "bg-card text-foreground shadow-sm"
                        : "hover:text-card-foreground",
                    )}
                  >
                    <Grid size={16} />
                  </button>
                </div>
                <button className="text-muted-foreground/70 hover:text-foreground transition-colors ml-2">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 pb-24">
              {/* Smart Add Input */}
              <div className="mb-8">
                <SmartTaskInput onAdd={handleAddTask} />
              </div>

              {/* Task Groups */}
              {["Overdue", "Today", "Tomorrow", "Completed Tasks"].map((group) => {
                const groupTasks = tasks.filter((t) => t.group === group);
                if (groupTasks.length === 0) return null;
                return (
                  <div
                    key={group}
                    className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <h3
                      className={cn(
                        "text-sm font-bold mb-4 flex items-center border-b border-border pb-2",
                        group === "Overdue" ? "text-rose-500" : "text-foreground",
                      )}
                    >
                      {group}{" "}
                      <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                        {groupTasks.length}
                      </span>
                    </h3>

                    {layoutMode === "list" ? (
                      <div className="space-y-1">
                        <AnimatePresence>
                          {groupTasks.map((task) => (
                            <TaskItem
                              key={task.id}
                              task={task as any}
                              selected={selectedTask?.id === task.id}
                              onClick={() => setSelectedTask(task)}
                              onComplete={handleCompleteTask}
                              onDelete={handleDeleteTask}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <AnimatePresence>
                          {groupTasks.map((task) => (
                            <GridTaskItem
                              key={task.id}
                              task={task as any}
                              selected={selectedTask?.id === task.id}
                              onClick={() => setSelectedTask(task)}
                              onComplete={handleCompleteTask}
                              onDelete={handleDeleteTask}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pane 3: Detail Panel (Kolom Kanan) */}
          <div
            className={cn(
              "bg-card border-l border-border flex-col transition-all duration-300 ease-in-out shrink-0",
              "fixed inset-0 md:static md:inset-auto z-50 md:z-auto",
              selectedTask
                ? "md:w-[400px] translate-x-0 opacity-100 flex"
                : "w-0 translate-x-full opacity-0 border-none hidden md:flex",
            )}
          >
            {selectedTask && (
              <>
                <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
                  <div className="flex items-center text-muted-foreground/70 gap-1">
                    <button
                      className="md:hidden p-1.5 hover:bg-muted hover:text-card-foreground rounded-md transition-colors mr-2"
                      onClick={() => setSelectedTask(null)}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-muted hover:text-card-foreground rounded-md transition-colors tooltip"
                      title="Mark as complete"
                    >
                      <Check size={18} />
                    </button>
                    <button className="p-1.5 hover:bg-muted hover:text-card-foreground rounded-md transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="hidden md:block p-1.5 hover:bg-muted text-muted-foreground/70 hover:text-card-foreground rounded-md transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                  {/* Title */}
                  <div className="flex items-start mb-6">
                    <button className="mr-3 mt-1.5 text-gray-300 hover:text-blue-500 transition-colors shrink-0">
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
                    <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 px-3 py-2.5 rounded-xl hover:bg-muted cursor-pointer transition-colors border border-border shadow-sm">
                      <div className="bg-card p-1.5 rounded-md shadow-sm border border-border">
                        <Calendar size={14} className="text-blue-500" />
                      </div>
                      <span className="font-medium">{selectedTask.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 px-3 py-2.5 rounded-xl hover:bg-muted cursor-pointer transition-colors border border-border shadow-sm">
                      <div className="bg-card p-1.5 rounded-md shadow-sm border border-border">
                        <Flag
                          size={14}
                          className={
                            selectedTask.priority === "high"
                              ? "text-rose-500"
                              : selectedTask.priority === "medium"
                                ? "text-amber-500"
                                : "text-muted-foreground/70"
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
                      <ListTodo size={16} className="mr-2 text-muted-foreground/70" /> Subtasks
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm group">
                        <button className="text-gray-300 hover:text-blue-500 mr-2 shrink-0">
                          <Circle size={16} strokeWidth={2.5} />
                        </button>
                        <span className="text-card-foreground flex-1">Outline structure</span>
                        <X
                          size={14}
                          className="text-gray-300 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-rose-500"
                        />
                      </div>
                      <div className="flex items-center text-sm text-blue-500 mt-2 cursor-pointer hover:text-blue-600 font-medium">
                        <Plus size={16} className="mr-2 shrink-0" /> Add subtask
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <div className="flex items-center text-foreground font-bold mb-3 text-sm">
                      <AlignLeft size={16} className="mr-2 text-muted-foreground/70" /> Description
                    </div>
                    <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl border border-border min-h-[120px] cursor-text whitespace-pre-wrap leading-relaxed shadow-inner">
                      {selectedTask.description || "Add more details here..."}
                    </div>
                  </div>

                  {/* Activity Log */}
                  <div className="mt-auto pt-8">
                    <div className="flex items-center text-foreground font-bold mb-4 text-sm">
                      <Activity size={16} className="mr-2 text-muted-foreground/70" /> Activity
                    </div>
                    <div className="text-xs text-muted-foreground space-y-4 relative before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-muted ml-1">
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1 w-4 h-4 bg-card border-[3px] border-blue-500 rounded-full shadow-sm" />
                        <div className="font-medium text-card-foreground">Created task</div>
                        <div className="text-muted-foreground/70 mt-1">Oct 24, 10:00 AM</div>
                      </div>
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1 w-4 h-4 bg-card border-[3px] border-border rounded-full shadow-sm" />
                        <div className="font-medium text-card-foreground">
                          Changed due date to Today
                        </div>
                        <div className="text-muted-foreground/70 mt-1">Oct 25, 08:30 AM</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Input Area */}
                <div className="p-4 border-t border-border bg-muted/30 shrink-0">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full bg-card border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function NavItem({ icon: Icon, label, count, active, color, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors group",
        active
          ? "bg-blue-50/50 text-blue-600 font-medium"
          : "hover:bg-muted border border-transparent",
      )}
    >
      <Icon
        size={16}
        className={cn(
          "mr-3",
          color ||
            (active
              ? "text-blue-600"
              : "text-muted-foreground group-hover:text-card-foreground transition-colors"),
        )}
      />
      <span className={cn("flex-1 text-[13px]", active ? "font-semibold" : "text-card-foreground")}>
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-xs font-bold px-1.5 rounded-full",
            active ? "bg-blue-100 text-blue-600" : "text-muted-foreground/70 group-hover:bg-accent",
          )}
        >
          {count}
        </span>
      )}
    </div>
  );
}
