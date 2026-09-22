import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  Droplet,
  BookOpen,
  Dumbbell,
  Moon,
  Sun,
  Coffee,
  Smile,
  Target,
  Brain,
  Flame,
  Zap,
  Plus,
  Check,
  Calendar,
  Sparkles,
  Trophy,
  Trash2,
  Edit3,
  X,
  Clock,
  Download,
  Upload,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export type HabitItem = {
  id: string;
  title: string;
  description: string;
  category: "Produktivitas" | "Kesehatan & Kebugaran" | "Mindfulness & Mental" | "Finansial" | "Edukasi & Belajar";
  timeOfDay: "Pagi" | "Siang" | "Malam" | "Sepanjang Hari";
  frequency: "Setiap Hari" | "Hari Kerja" | "3x Seminggu";
  iconKey: string;
  colorScheme: string;
  history: Record<string, boolean>; // date string "YYYY-MM-DD" -> completed
  longestStreak: number;
  createdAt: string;
};

const ICON_MAP: Record<string, React.ElementType> = {
  Activity,
  Droplet,
  BookOpen,
  Dumbbell,
  Moon,
  Sun,
  Coffee,
  Smile,
  Target,
  Brain,
  Flame,
  Zap,
};

const COLOR_MAP: Record<string, { bg: string; text: string; light: string; border: string }> = {
  emerald: { bg: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", light: "bg-emerald-500/10", border: "border-emerald-500/20" },
  blue: { bg: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", light: "bg-blue-500/10", border: "border-blue-500/20" },
  purple: { bg: "bg-purple-500", text: "text-purple-600 dark:text-purple-400", light: "bg-purple-500/10", border: "border-purple-500/20" },
  amber: { bg: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", light: "bg-amber-500/10", border: "border-amber-500/20" },
  rose: { bg: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", light: "bg-rose-500/10", border: "border-rose-500/20" },
  cyan: { bg: "bg-cyan-500", text: "text-cyan-600 dark:text-cyan-400", light: "bg-cyan-500/10", border: "border-cyan-500/20" },
};

// Generate last N dates formatted as YYYY-MM-DD
function getLastDates(numDays: number): { dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] {
  const dates = [];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    dates.push({
      dateStr,
      dayName: dayNames[d.getDay()],
      dayNum: d.getDate(),
      isToday: i === 0,
    });
  }
  return dates;
}

// Compute streak helper
function computeCurrentStreak(history: Record<string, boolean>): number {
  let streak = 0;
  const d = new Date();
  
  // Check if today is completed
  const todayStr = d.toISOString().slice(0, 10);
  let checkDate = new Date(d);

  if (!history[todayStr]) {
    // If not today, check if yesterday was completed
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().slice(0, 10);
    if (!history[yesterdayStr]) {
      return 0;
    }
  }

  while (true) {
    const dateStr = checkDate.toISOString().slice(0, 10);
    if (history[dateStr]) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

const STORAGE_KEY = "wira_habits_database_v2";

const createSampleHistory = () => {
  const h: Record<string, boolean> = {};
  const d = new Date();
  for (let i = 0; i < 14; i++) {
    const past = new Date(d);
    past.setDate(past.getDate() - i);
    const dateStr = past.toISOString().slice(0, 10);
    if (i !== 3 && i !== 8) {
      h[dateStr] = true;
    }
  }
  return h;
};

const INITIAL_HABITS: HabitItem[] = [
  {
    id: "habit-1",
    title: "Minum 2.5 Liter Air Mineral",
    description: "Menjaga hidrasi tubuh optimal sepanjang aktivitas konsultasi.",
    category: "Kesehatan & Kebugaran",
    timeOfDay: "Sepanjang Hari",
    frequency: "Setiap Hari",
    iconKey: "Droplet",
    colorScheme: "blue",
    history: createSampleHistory(),
    longestStreak: 18,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "habit-2",
    title: "Membaca 20 Menit Literatur Bisnis",
    description: "Fokus membaca jurnal finansial atau buku manajemen sebelum tidur.",
    category: "Edukasi & Belajar",
    timeOfDay: "Malam",
    frequency: "Setiap Hari",
    iconKey: "BookOpen",
    colorScheme: "purple",
    history: createSampleHistory(),
    longestStreak: 12,
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "habit-3",
    title: "Sesi Latihan Fisik & Kardio Pagi",
    description: "Push up, stretching, atau jogging 30 menit setelah subuh.",
    category: "Kesehatan & Kebugaran",
    timeOfDay: "Pagi",
    frequency: "Hari Kerja",
    iconKey: "Dumbbell",
    colorScheme: "emerald",
    history: createSampleHistory(),
    longestStreak: 9,
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "habit-4",
    title: "Refleksi & Review Pengeluaran Harian",
    description: "Mencatat arus kas harian ke dalam modul jurnal keuangan.",
    category: "Finansial",
    timeOfDay: "Malam",
    frequency: "Setiap Hari",
    iconKey: "Target",
    colorScheme: "amber",
    history: createSampleHistory(),
    longestStreak: 21,
    createdAt: "2026-01-12T00:00:00.000Z",
  },
  {
    id: "habit-5",
    title: "Mindfulness & Istirahat Bebas Layar",
    description: "Jeda 15 menit tanpa notifikasi gawai di tengah jam kerja.",
    category: "Mindfulness & Mental",
    timeOfDay: "Siang",
    frequency: "Hari Kerja",
    iconKey: "Brain",
    colorScheme: "rose",
    history: createSampleHistory(),
    longestStreak: 7,
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];

export function HabitsView() {
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_HABITS;
  });

  const [filterTime, setFilterTime] = useState<string>("Semua");
  const [filterCategory, setFilterCategory] = useState<string>("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch {
      // ignore
    }
  }, [habits]);

  const recentDates = useMemo(() => getLastDates(7), []);
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Toggle habit on a specific date
  const handleToggleDay = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;
        const newHistory = { ...habit.history };
        const currentlyDone = !!newHistory[dateStr];
        if (currentlyDone) {
          delete newHistory[dateStr];
        } else {
          newHistory[dateStr] = true;
        }

        const newStreak = computeCurrentStreak(newHistory);
        const longest = Math.max(habit.longestStreak, newStreak);

        return {
          ...habit,
          history: newHistory,
          longestStreak: longest,
        };
      })
    );
  };

  // Quick check-in for today
  const handleQuickCheckToday = (habitId: string) => {
    handleToggleDay(habitId, todayStr);
  };

  // Filtered habits
  const filteredHabits = useMemo(() => {
    return habits.filter((h) => {
      if (filterTime !== "Semua" && h.timeOfDay !== filterTime) return false;
      if (filterCategory !== "Semua" && h.category !== filterCategory) return false;
      return true;
    });
  }, [habits, filterTime, filterCategory]);

  // Statistics
  const stats = useMemo(() => {
    const total = habits.length;
    const completedToday = habits.filter((h) => !!h.history[todayStr]).length;
    const completionRate = total > 0 ? Math.round((completedToday / total) * 100) : 0;
    
    // Top streak
    let topStreak = 0;
    let topHabitTitle = "—";
    habits.forEach((h) => {
      const s = computeCurrentStreak(h.history);
      if (s > topStreak) {
        topStreak = s;
        topHabitTitle = h.title;
      }
    });

    return { total, completedToday, completionRate, topStreak, topHabitTitle };
  }, [habits, todayStr]);

  const handleSaveHabit = (habitData: Omit<HabitItem, "id" | "history" | "longestStreak" | "createdAt">) => {
    if (editingHabit) {
      setHabits((prev) =>
        prev.map((h) => (h.id === editingHabit.id ? { ...h, ...habitData } : h))
      );
    } else {
      const newHabit: HabitItem = {
        ...habitData,
        id: `habit-${Date.now()}`,
        history: { [todayStr]: true },
        longestStreak: 1,
        createdAt: new Date().toISOString(),
      };
      setHabits((prev) => [newHabit, ...prev]);
    }
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const handleDeleteHabit = (id: string) => {
    if (window.confirm("Hapus kebiasaan ini?")) {
      setHabits((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(habits, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `habits_tracker_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed)) {
          setHabits(parsed);
          alert(`Berhasil mengimpor ${parsed.length} kebiasaan!`);
        }
      } catch {
        alert("Format file tidak valid.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Habits Tracker & Rutinitas
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {habits.length} Kebiasaan
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Bangun disiplin bertahap, pertahankan streak harian, dan evaluasi konsistensi gaya hidup produktif.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border bg-card hover:bg-muted/50 text-foreground transition-colors shadow-sm">
            <Upload size={14} />
            <span>Impor</span>
            <input type="file" accept=".json" onChange={importJSON} className="hidden" />
          </label>

          <button
            onClick={exportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border bg-card hover:bg-muted/50 text-foreground transition-colors shadow-sm"
          >
            <Download size={14} />
            <span>Ekspor</span>
          </button>

          <button
            onClick={() => {
              setEditingHabit(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md shadow-primary/20"
          >
            <Plus size={16} />
            <span>Kebiasaan Baru</span>
          </button>
        </div>
      </div>

      {/* Today's Discipline Progress Bar & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily completion hero */}
        <div className="bg-card border border-border p-5 rounded-3xl shadow-sm flex flex-col justify-between md:col-span-2 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar size={14} /> Disiplin Hari Ini ({todayStr})
              </span>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {stats.completedToday} dari {stats.total} Kebiasaan Selesai
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stats.completionRate === 100
                  ? "Luar biasa! Semua kebiasaan hari ini telah tuntas."
                  : stats.completionRate >= 50
                  ? "Progres sangat bagus, teruskan hingga akhir hari!"
                  : "Mulai tandai kebiasaan Anda untuk menjaga konsistensi streak."}
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
              {stats.completionRate}%
            </div>
          </div>

          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>

        {/* Streak Champion */}
        <div className="bg-card border border-border p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Trophy size={14} className="text-amber-500" /> Juara Streak Terpanjang
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-amber-500 flex items-center gap-1">
                <Flame size={28} className="fill-amber-500" /> {stats.topStreak}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">Hari Berturut-turut</span>
            </div>
            <p className="text-xs text-foreground font-medium mt-1 line-clamp-1">
              {stats.topHabitTitle}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Kebiasaan Aktif</span>
            <span className="font-bold text-foreground">{stats.total} Program</span>
          </div>
        </div>
      </div>

      {/* Filters Bar: Time of Day & Category */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Time of day tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-muted-foreground font-medium mr-1 shrink-0">Waktu:</span>
          {["Semua", "Pagi", "Siang", "Malam", "Sepanjang Hari"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterTime(t)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors border ${
                filterTime === t
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-muted-foreground border-border hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Category filter dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium shrink-0">Kategori:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-background border border-border rounded-xl text-foreground font-medium outline-none"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Produktivitas">Produktivitas</option>
            <option value="Kesehatan & Kebugaran">Kesehatan & Kebugaran</option>
            <option value="Mindfulness & Mental">Mindfulness & Mental</option>
            <option value="Finansial">Finansial</option>
            <option value="Edukasi & Belajar">Edukasi & Belajar</option>
          </select>
        </div>
      </div>

      {/* Habits Matrix & Cards */}
      {filteredHabits.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center bg-card/40 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <Activity size={28} />
          </div>
          <h3 className="text-lg font-bold text-foreground">Tidak Ada Kebiasaan</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1 mb-6">
            Mulai kebiasaan positif baru hari ini untuk meningkatkan produktivitas harian Anda.
          </p>
          <button
            onClick={() => {
              setFilterTime("Semua");
              setFilterCategory("Semua");
              setEditingHabit(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
          >
            Tambah Kebiasaan Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHabits.map((habit) => {
            const IconComp = ICON_MAP[habit.iconKey] || Activity;
            const color = COLOR_MAP[habit.colorScheme] || COLOR_MAP.emerald;
            const streak = computeCurrentStreak(habit.history);
            const isDoneToday = !!habit.history[todayStr];

            return (
              <div
                key={habit.id}
                className="bg-card border border-border hover:border-primary/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left info */}
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-13 h-13 rounded-2xl p-3 flex items-center justify-center shrink-0 shadow-sm ${color.light} ${color.text} border ${color.border}`}
                  >
                    <IconComp size={24} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base md:text-lg font-bold text-foreground">{habit.title}</h3>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground border border-border">
                        {habit.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground">
                        {habit.timeOfDay} • {habit.frequency}
                      </span>
                    </div>

                    {habit.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {habit.description}
                      </p>
                    )}

                    {/* Streak badge */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Flame size={14} className="fill-amber-500" />
                        <span>{streak} Hari Streak</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        (Terpanjang: {habit.longestStreak} hari)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: 7-Day Matrix & Quick Check Button */}
                <div className="flex items-center gap-4 self-end lg:self-center">
                  {/* 7 Days interactive dots */}
                  <div className="flex items-center gap-1.5 bg-muted/40 p-2 rounded-2xl border border-border">
                    {recentDates.map((item) => {
                      const completed = !!habit.history[item.dateStr];
                      return (
                        <button
                          key={item.dateStr}
                          onClick={() => handleToggleDay(habit.id, item.dateStr)}
                          className={`flex flex-col items-center justify-center w-8 h-12 rounded-xl transition-all ${
                            completed
                              ? `${color.bg} text-white shadow-sm scale-105`
                              : item.isToday
                              ? "bg-background border-2 border-primary/50 text-foreground hover:bg-muted"
                              : "bg-background border border-border text-muted-foreground hover:bg-muted"
                          }`}
                          title={`${item.dateStr} (${item.dayName}) - ${completed ? "Selesai" : "Belum"}`}
                        >
                          <span className="text-[10px] font-semibold uppercase">{item.dayName}</span>
                          <span className="text-xs font-bold mt-0.5">{item.dayNum}</span>
                          {completed && <Check size={10} strokeWidth={3} className="mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Today check toggle button */}
                  <button
                    onClick={() => handleQuickCheckToday(habit.id)}
                    className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm shrink-0 ${
                      isDoneToday
                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                        : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20"
                    }`}
                  >
                    <Check size={16} strokeWidth={3} />
                    <span>{isDoneToday ? "Selesai Hari Ini" : "Check-in"}</span>
                  </button>

                  {/* Edit & Delete actions */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setEditingHabit(habit);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      title="Edit Kebiasaan"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Hapus Kebiasaan"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Habit Add/Edit Modal */}
      {isModalOpen && (
        <HabitFormModal
          initialData={editingHabit}
          onClose={() => {
            setIsModalOpen(false);
            setEditingHabit(null);
          }}
          onSave={handleSaveHabit}
        />
      )}
    </div>
  );
}

function HabitFormModal({
  initialData,
  onClose,
  onSave,
}: {
  initialData: HabitItem | null;
  onClose: () => void;
  onSave: (habit: Omit<HabitItem, "id" | "history" | "longestStreak" | "createdAt">) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState<HabitItem["category"]>(initialData?.category || "Produktivitas");
  const [timeOfDay, setTimeOfDay] = useState<HabitItem["timeOfDay"]>(initialData?.timeOfDay || "Pagi");
  const [frequency, setFrequency] = useState<HabitItem["frequency"]>(initialData?.frequency || "Setiap Hari");
  const [iconKey, setIconKey] = useState<string>(initialData?.iconKey || "Activity");
  const [colorScheme, setColorScheme] = useState<string>(initialData?.colorScheme || "emerald");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Nama kebiasaan wajib diisi.");
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      timeOfDay,
      frequency,
      iconKey,
      colorScheme,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-1">
          {initialData ? "Edit Kebiasaan" : "Tambah Kebiasaan Baru"}
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Definisikan kebiasaan baru, pilih waktu pelaksanaan, dan tetapkan frekuensi rutinitas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Nama Kebiasaan *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Jalan Kaki 10.000 Langkah"
              className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitItem["category"])}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              >
                <option value="Produktivitas">Produktivitas</option>
                <option value="Kesehatan & Kebugaran">Kesehatan & Kebugaran</option>
                <option value="Mindfulness & Mental">Mindfulness & Mental</option>
                <option value="Finansial">Finansial</option>
                <option value="Edukasi & Belajar">Edukasi & Belajar</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Waktu Pelaksanaan</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as HabitItem["timeOfDay"])}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              >
                <option value="Pagi">Pagi Hari</option>
                <option value="Siang">Siang Hari</option>
                <option value="Malam">Malam Hari</option>
                <option value="Sepanjang Hari">Sepanjang Hari (Fleksibel)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Frekuensi</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as HabitItem["frequency"])}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
            >
              <option value="Setiap Hari">Setiap Hari (7 hari seminggu)</option>
              <option value="Hari Kerja">Hari Kerja (Senin s/d Jumat)</option>
              <option value="3x Seminggu">Minimal 3x Seminggu</option>
            </select>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Pilih Ikon Simbol</label>
            <div className="grid grid-cols-6 gap-2 p-3 bg-muted/40 rounded-2xl border border-border">
              {Object.keys(ICON_MAP).map((k) => {
                const IconComponent = ICON_MAP[k];
                const active = iconKey === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setIconKey(k)}
                    className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm scale-110"
                        : "bg-card text-muted-foreground border border-border hover:text-foreground"
                    }`}
                  >
                    <IconComponent size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color theme selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Warna Aksen</label>
            <div className="flex items-center gap-2">
              {Object.keys(COLOR_MAP).map((col) => {
                const active = colorScheme === col;
                const def = COLOR_MAP[col];
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setColorScheme(col)}
                    className={`w-8 h-8 rounded-full ${def.bg} flex items-center justify-center transition-transform ${
                      active ? "ring-4 ring-primary/30 scale-110" : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {active && <Check size={14} className="text-white" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Deskripsi / Petunjuk Kebiasaan</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Mengonsumsi 8 gelas air putih terbagi pagi, siang, dan sore..."
              className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-colors shadow-sm"
            >
              Simpan Kebiasaan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
