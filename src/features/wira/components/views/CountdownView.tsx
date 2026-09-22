import React, { useState, useEffect } from "react";
import { Plus, Clock, Calendar, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";

type CountdownEvent = {
  id: string;
  title: string;
  targetDate: string; // ISO string
};

const DUMMY_EVENTS: CountdownEvent[] = [
  {
    id: "1",
    title: "New Year",
    targetDate: new Date(new Date().getFullYear() + 1, 0, 1).toISOString(),
  },
];

export function CountdownView() {
  const [events, setEvents] = useState<CountdownEvent[]>(DUMMY_EVENTS);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const time = (formData.get("time") as string) || "00:00";

    if (!title || !date) return;

    const targetDate = new Date(`${date}T${time}`).toISOString();

    setEvents([
      ...events,
      {
        id: Math.random().toString(36).substr(2, 9),
        title,
        targetDate,
      },
    ]);
    setIsAddOpen(false);
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter((ev) => ev.id !== id));
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Countdowns</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track time until your important events.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
        >
          <Plus size={16} className="mr-2" /> Add Countdown
        </button>
      </div>

      {events.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-card/50 p-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Clock size={32} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No countdowns yet</h3>
          <p className="text-muted-foreground mt-2 max-w-md text-center">
            Add an event to start counting down.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pb-24 md:pb-6">
          {events.map((event) => (
            <CountdownCard key={event.id} event={event} onRemove={() => removeEvent(event.id)} />
          ))}
        </div>
      )}

      {isAddOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-border bg-muted/50">
              <h2 className="text-xl font-bold text-foreground">New Countdown</h2>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Event Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-4 py-2 bg-muted border border-border rounded-xl focus:bg-card focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Vacation, Product Launch"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full px-4 py-2 bg-muted border border-border rounded-xl focus:bg-card focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Time</label>
                  <input
                    type="time"
                    name="time"
                    defaultValue="00:00"
                    className="w-full px-4 py-2 bg-muted border border-border rounded-xl focus:bg-card focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-medium text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CountdownCard({ event, onRemove }: { event: CountdownEvent; onRemove: () => void }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const target = new Date(event.targetDate);
  const diff = target.getTime() - now.getTime();

  const isPast = diff <= 0;

  // Calculate units
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = Math.floor(totalDays / 30.436875);
  const totalYears = Math.floor(totalDays / 365.25);

  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;
  const days = totalDays % 30; // Approx remaining days after months
  const months = totalMonths % 12;
  const years = totalYears;

  const displayWeeks = totalWeeks % 4; // Approx weeks

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow relative group">
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 text-muted-foreground/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 size={16} />
      </button>
      <div className="mb-6">
        <h3 className="font-bold text-foreground text-xl">{event.title}</h3>
        <p className="text-muted-foreground text-sm flex items-center mt-1">
          <Calendar size={14} className="mr-1.5" />
          {target.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isPast ? (
        <div className="bg-green-500/10 text-green-600 dark:text-green-400 py-3 rounded-xl font-bold text-center">
          Event has occurred!
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <UnitBox value={years} label="Years" />
            <UnitBox value={months} label="Months" />
            <UnitBox value={displayWeeks} label="Weeks" />
            <UnitBox value={days} label="Days" />
            <UnitBox value={hours} label="Hours" />
            <UnitBox value={minutes} label="Mins" />
            <UnitBox value={seconds} label="Secs" />
          </div>
        </div>
      )}
    </div>
  );
}

function UnitBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-muted border border-border rounded-xl p-2 flex flex-col items-center justify-center">
      <span className="font-bold text-foreground text-lg tabular-nums">{value}</span>
      <span className="text-[10px] uppercase font-semibold text-muted-foreground">{label}</span>
    </div>
  );
}
