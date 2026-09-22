import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { GripVertical, Clock, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";

export function WeeklyCalendar() {
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Team Meeting",
      start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
      end: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
      backgroundColor: "#3b82f6",
      borderColor: "#2563eb",
    },
  ]);

  const [unscheduledTasks, setUnscheduledTasks] = useState([
    { id: "101", title: "Write Documentation", priority: "medium" },
    { id: "102", title: "Code Review", priority: "high" },
    { id: "103", title: "Design System Update", priority: "low" },
    { id: "104", title: "User Testing", priority: "none" },
  ]);

  const externalEventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let draggable: Draggable | null = null;
    if (externalEventsRef.current) {
      draggable = new Draggable(externalEventsRef.current, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          const id = eventEl.getAttribute("data-id");
          const title = eventEl.getAttribute("data-title");
          return {
            id,
            title,
            duration: "01:00", // default duration
            create: true, // creates a new event when dropped
            backgroundColor: "#3b82f6",
            borderColor: "#2563eb",
          };
        },
      });
    }

    return () => {
      if (draggable) {
        draggable.destroy();
      }
    };
  }, []);

  const handleEventReceive = (info: any) => {
    const { id, title } = info.event;
    setUnscheduledTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex h-full w-full bg-background text-foreground overflow-hidden font-sans border border-border rounded-xl">
      {/* Pane 1: Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-[500px] border-r border-border">
        <div className="h-14 flex items-center justify-between px-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <CalendarIcon size={20} className="text-muted-foreground" />
            <h1 className="text-xl font-bold text-foreground">Weekly Plan</h1>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 custom-calendar-wrapper">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,timeGridDay",
            }}
            editable={true}
            droppable={true}
            nowIndicator={true}
            allDaySlot={false}
            slotMinTime="06:00:00"
            slotMaxTime="24:00:00"
            slotDuration="01:00:00"
            events={events}
            eventReceive={handleEventReceive}
            height="100%"
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
            eventContent={(eventInfo) => {
              return (
                <div className="p-1 h-full flex flex-col relative overflow-hidden">
                  <div className="font-semibold text-xs leading-tight mb-1">
                    {eventInfo.event.title}
                  </div>
                  <div className="text-[10px] opacity-80">{eventInfo.timeText}</div>
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* Pane 2: Unscheduled Tasks (Right Sidebar) */}
      <div className="w-[300px] shrink-0 bg-secondary/30 flex flex-col border-l border-border">
        <div className="h-14 flex items-center px-4 border-b border-border shrink-0 bg-background">
          <h2 className="font-semibold text-foreground">Unscheduled Tasks</h2>
          <span className="ml-2 text-xs font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {unscheduledTasks.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4" ref={externalEventsRef}>
          <div className="space-y-3">
            {unscheduledTasks.map((task) => (
              <div
                key={task.id}
                data-id={task.id}
                data-title={task.title}
                className="fc-event flex items-start gap-3 p-3 bg-background border border-border rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-md transition-all group"
              >
                <div className="mt-0.5 text-muted-foreground/50 group-hover:text-primary transition-colors">
                  <GripVertical size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground leading-snug">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-semibold text-muted-foreground flex items-center bg-secondary px-1.5 py-0.5 rounded border border-border">
                      <Clock size={10} className="mr-1" /> 60m
                    </span>
                    {task.priority !== "none" && (
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded border",
                          task.priority === "high"
                            ? "text-destructive bg-destructive/10 border-destructive/20"
                            : task.priority === "medium"
                              ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
                              : "text-primary bg-primary/10 border-primary/20",
                        )}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {unscheduledTasks.length === 0 && (
              <div className="text-center py-10 text-sm text-muted-foreground">
                All caught up! Drag tasks here to unschedule.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
