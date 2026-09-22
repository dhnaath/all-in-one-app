import React, { useState, useEffect, useMemo } from "react";
import {
  Target,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Edit3,
  Trash2,
  X,
  ChevronRight,
  Flame,
  Award,
  Filter,
  Check,
  Download,
  Upload,
  BarChart3,
  Flag,
  ArrowUpRight,
} from "lucide-react";

export type Milestone = {
  id: string;
  title: string;
  completed: boolean;
};

export type GoalItem = {
  id: string;
  title: string;
  description: string;
  category:
    | "Finansial"
    | "Karir & Bisnis"
    | "Kesehatan & Kebugaran"
    | "Pendidikan & Skill"
    | "Pribadi & Spiritual"
    | "Keluarga & Relasi";
  timeframe: "Jangka Pendek" | "Jangka Menengah" | "Jangka Panjang";
  targetType: "numeric" | "percentage" | "milestones";
  currentValue: number;
  targetValue: number;
  unit: string;
  milestones: Milestone[];
  deadline: string;
  priority: "Tinggi" | "Sedang" | "Rendah";
  status: "in_progress" | "completed" | "not_started" | "on_hold";
  whyStatement?: string;
  createdAt: string;
  colorScheme: string;
};

const CATEGORIES = [
  "Semua",
  "Finansial",
  "Karir & Bisnis",
  "Kesehatan & Kebugaran",
  "Pendidikan & Skill",
  "Pribadi & Spiritual",
  "Keluarga & Relasi",
] as const;

const COLOR_SCHEMES = [
  { id: "blue", bg: "from-blue-500 to-indigo-600", border: "border-blue-500", light: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { id: "emerald", bg: "from-emerald-500 to-teal-600", border: "border-emerald-500", light: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: "purple", bg: "from-purple-500 to-violet-600", border: "border-purple-500", light: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { id: "amber", bg: "from-amber-500 to-orange-600", border: "border-amber-500", light: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: "rose", bg: "from-rose-500 to-pink-600", border: "border-rose-500", light: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
];

const INITIAL_GOALS: GoalItem[] = [
  {
    id: "goal-1",
    title: "Akumulasi Dana Darurat 6 Bulan Pengeluaran",
    description: "Membangun bantalan likuiditas kas aman di instrumen pasar uang syariah.",
    category: "Finansial",
    timeframe: "Jangka Menengah",
    targetType: "numeric",
    currentValue: 45,
    targetValue: 60,
    unit: "Juta Rp",
    milestones: [
      { id: "m-1", title: "Review dan pangkas pengeluaran non-esensial", completed: true },
      { id: "m-2", title: "Target 1 bulan pengeluaran (Rp 10 Juta)", completed: true },
      { id: "m-3", title: "Target 3 bulan pengeluaran (Rp 30 Juta)", completed: true },
      { id: "m-4", title: "Target 6 bulan pengeluaran (Rp 60 Juta)", completed: false },
    ],
    deadline: "2026-12-31",
    priority: "Tinggi",
    status: "in_progress",
    whyStatement: "Memberikan ketenangan pikiran dan stabilitas proteksi finansial keluarga.",
    createdAt: "2026-01-01T00:00:00.000Z",
    colorScheme: "emerald",
  },
  {
    id: "goal-2",
    title: "Sertifikasi Konsultan Manajemen Risiko Finansial",
    description: "Menyelesaikan program sertifikasi profesi internasional dan modul ujian kelayakan.",
    category: "Pendidikan & Skill",
    timeframe: "Jangka Pendek",
    targetType: "milestones",
    currentValue: 3,
    targetValue: 4,
    unit: "Modul",
    milestones: [
      { id: "m-21", title: "Pendaftaran dan orientasi materi ujian", completed: true },
      { id: "m-22", title: "Penyelesaian 8 modul studi kasus", completed: true },
      { id: "m-23", title: "Latihan try out dan simulasi skor >85%", completed: true },
      { id: "m-24", title: "Ujian sertifikasi akhir resmi", completed: false },
    ],
    deadline: "2026-10-30",
    priority: "Tinggi",
    status: "in_progress",
    whyStatement: "Meningkatkan kredibilitas firma konsultasi dan memperluas kapasitas layanan klien enterprise.",
    createdAt: "2026-02-15T00:00:00.000Z",
    colorScheme: "blue",
  },
  {
    id: "goal-3",
    title: "Membaca 12 Buku Analisis Bisnis & Muamalah",
    description: "Target literasi mendalam mengenai ekonomi makro, fikih muamalah, dan valuasi aset.",
    category: "Pendidikan & Skill",
    timeframe: "Jangka Menengah",
    targetType: "numeric",
    currentValue: 8,
    targetValue: 12,
    unit: "Buku",
    milestones: [],
    deadline: "2026-12-31",
    priority: "Sedang",
    status: "in_progress",
    whyStatement: "Memperkaya wawasan strategis dalam menyusun framework solusi untuk klien.",
    createdAt: "2026-01-10T00:00:00.000Z",
    colorScheme: "purple",
  },
  {
    id: "goal-4",
    title: "Mencapai Kebugaran Lari 10K & Bobot Ideal 70 Kg",
    description: "Latihan kardio 3x seminggu dan menjaga pola makan seimbang.",
    category: "Kesehatan & Kebugaran",
    timeframe: "Jangka Pendek",
    targetType: "percentage",
    currentValue: 75,
    targetValue: 100,
    unit: "%",
    milestones: [
      { id: "m-41", title: "Konsisten lari 5K di bawah 30 menit", completed: true },
      { id: "m-42", title: "Pola makan defisit kalori teratur", completed: true },
      { id: "m-43", title: "Lari 10K tanpa berhenti", completed: false },
    ],
    deadline: "2026-11-15",
    priority: "Sedang",
    status: "in_progress",
    whyStatement: "Energi fisik yang prima menunjang produktivitas mental dan fokus kerja maksimal.",
    createdAt: "2026-02-01T00:00:00.000Z",
    colorScheme: "rose",
  },
  {
    id: "goal-5",
    title: "Peluncuran Modul Portal Klien & Katalog Terpadu",
    description: "Integrasi sistem dashboard self-service klien untuk transparansi progres proyek.",
    category: "Karir & Bisnis",
    timeframe: "Jangka Pendek",
    targetType: "milestones",
    currentValue: 4,
    targetValue: 4,
    unit: "Tahap",
    milestones: [
      { id: "m-51", title: "Desain UI portal dan arsitektur route", completed: true },
      { id: "m-52", title: "Integrasi sistem dokumen dan jadwal", completed: true },
      { id: "m-53", title: "Uji coba keamanan data dan enkripsi", completed: true },
      { id: "m-54", title: "Rilis resmi ke klien aktif", completed: true },
    ],
    deadline: "2026-08-30",
    priority: "Tinggi",
    status: "completed",
    whyStatement: "Menyajikan pengalaman layanan berstandar internasional yang profesional dan terpercaya.",
    createdAt: "2026-01-05T00:00:00.000Z",
    colorScheme: "amber",
  },
];

const STORAGE_KEY = "wira_goals_database_v2";

export function GoalsView() {
  const [goals, setGoals] = useState<GoalItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_GOALS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [statusFilter, setStatusFilter] = useState<"all" | "in_progress" | "completed">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);
  const [quickUpdateId, setQuickUpdateId] = useState<string | null>(null);
  const [quickUpdateVal, setQuickUpdateVal] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch {
      // ignore
    }
  }, [goals]);

  // Calculate percentage helper
  const getGoalProgress = (goal: GoalItem): number => {
    if (goal.targetType === "milestones" && goal.milestones.length > 0) {
      const completedCount = goal.milestones.filter((m) => m.completed).length;
      return Math.round((completedCount / goal.milestones.length) * 100);
    }
    if (goal.targetValue <= 0) return 0;
    const pct = Math.round((goal.currentValue / goal.targetValue) * 100);
    return Math.min(100, Math.max(0, pct));
  };

  // Toggle milestone completion
  const handleToggleMilestone = (goalId: string, milestoneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;
        const updatedMilestones = goal.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const isAllDone = completedCount === updatedMilestones.length && updatedMilestones.length > 0;
        return {
          ...goal,
          milestones: updatedMilestones,
          currentValue: completedCount,
          status: isAllDone ? "completed" : "in_progress",
        };
      })
    );
  };

  // Quick numerical progress update
  const handleSaveQuickUpdate = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const newStatus = quickUpdateVal >= g.targetValue ? "completed" : "in_progress";
        return {
          ...g,
          currentValue: quickUpdateVal,
          status: newStatus,
        };
      })
    );
    setQuickUpdateId(null);
  };

  // Filtered goals
  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      if (statusFilter === "in_progress" && g.status === "completed") return false;
      if (statusFilter === "completed" && g.status !== "completed") return false;
      if (selectedCategory !== "Semua" && g.category !== selectedCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        (g.whyStatement && g.whyStatement.toLowerCase().includes(q))
      );
    });
  }, [goals, statusFilter, selectedCategory, searchQuery]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = goals.length;
    const completed = goals.filter((g) => g.status === "completed").length;
    const inProgress = total - completed;
    const avgProgress =
      total > 0
        ? Math.round(goals.reduce((acc, g) => acc + getGoalProgress(g), 0) / total)
        : 0;
    return { total, completed, inProgress, avgProgress };
  }, [goals]);

  // Save Goal from Modal
  const handleSaveGoal = (goalData: Omit<GoalItem, "id" | "createdAt">) => {
    if (editingGoal) {
      setGoals((prev) =>
        prev.map((g) => (g.id === editingGoal.id ? { ...g, ...goalData } : g))
      );
    } else {
      const newGoal: GoalItem = {
        ...goalData,
        id: `goal-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setGoals((prev) => [newGoal, ...prev]);
    }
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Hapus target ini?")) {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(goals, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `goals_target_${new Date().toISOString().slice(0, 10)}.json`;
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
          setGoals(parsed);
          alert(`Berhasil mengimpor ${parsed.length} target!`);
        }
      } catch {
        alert("File tidak valid.");
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
              Target & Goals Strategis
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {goals.length} Sasaran
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Penetapan target terukur, pelacakan milestone bertahap, dan evaluasi pencapaian jangka panjang.
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
              setEditingGoal(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md shadow-primary/20"
          >
            <Plus size={16} />
            <span>Buat Target Baru</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Target size={22} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Target</p>
            <p className="text-xl font-bold text-foreground">{stats.total}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame size={22} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Sedang Berjalan</p>
            <p className="text-xl font-bold text-foreground">{stats.inProgress}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Target Tercapai</p>
            <p className="text-xl font-bold text-foreground">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <BarChart3 size={22} />
          </div>
          <div className="w-full pr-2">
            <div className="flex justify-between items-baseline">
              <p className="text-xs text-muted-foreground font-medium">Rata-rata Progres</p>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{stats.avgProgress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.avgProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Control Strip: Search, Status Filter & Category Tabs */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama sasaran, deskripsi, atau alasan motivasi..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 border border-border rounded-xl p-1 bg-background shrink-0">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === "all" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter("in_progress")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === "in_progress" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Berjalan ({stats.inProgress})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === "completed" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tercapai ({stats.completed})
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-muted-foreground font-medium mr-1 shrink-0">Kategori:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors border ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-muted-foreground border-border hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Goals Cards Grid */}
      {filteredGoals.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center bg-card/40 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <Target size={28} />
          </div>
          <h3 className="text-lg font-bold text-foreground">Tidak Ada Target yang Cocok</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1 mb-6">
            {searchQuery || selectedCategory !== "Semua" || statusFilter !== "all"
              ? "Coba sesuaikan filter pencarian atau kategori Anda."
              : "Definisikan target jangka panjang Anda untuk mulai mengarahkan fokus produktivitas."}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Semua");
              setStatusFilter("all");
              setEditingGoal(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
          >
            Buat Target Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGoals.map((goal) => {
            const progressPct = getGoalProgress(goal);
            const isDone = goal.status === "completed" || progressPct >= 100;
            const colorDef = COLOR_SCHEMES.find((c) => c.id === goal.colorScheme) || COLOR_SCHEMES[0];

            // Deadline calculation
            const today = new Date().toISOString().slice(0, 10);
            const isOverdue = goal.deadline < today && !isDone;
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={goal.id}
                className={`bg-card border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
                  isDone ? "border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10" : "border-border hover:border-primary/40"
                }`}
              >
                <div>
                  {/* Top Header line of card */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${colorDef.light} border border-current/20`}>
                        {goal.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                        {goal.timeframe}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${
                          goal.priority === "Tinggi"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            : goal.priority === "Sedang"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-slate-500/10 text-slate-600"
                        }`}
                      >
                        Prioritas {goal.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingGoal(goal);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                        title="Edit Target"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteGoal(goal.id, e)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Hapus Target"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-foreground leading-snug mb-1">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      {goal.description}
                    </p>
                  )}

                  {/* Why statement callout */}
                  {goal.whyStatement && (
                    <div className="p-2.5 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground italic mb-4 flex items-start gap-2">
                      <Sparkles size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>"{goal.whyStatement}"</span>
                    </div>
                  )}

                  {/* Progress Bar & Numerical Metrics */}
                  <div className="space-y-2 mb-4 bg-muted/30 p-3.5 rounded-2xl border border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <TrendingUp size={14} className="text-primary" />
                        Pencapaian:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          {goal.targetType === "milestones"
                            ? `${goal.currentValue} / ${goal.targetValue} sub-tugas`
                            : `${goal.currentValue} / ${goal.targetValue} ${goal.unit}`}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                          {progressPct}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colorDef.bg} rounded-full transition-all duration-500`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Quick Numeric Update Controls (only for numeric or percentage) */}
                    {goal.targetType !== "milestones" && (
                      <div className="pt-2 flex items-center justify-between text-xs border-t border-border/50">
                        {quickUpdateId === goal.id ? (
                          <div className="flex items-center gap-2 w-full">
                            <span className="text-muted-foreground shrink-0">Update Nilai:</span>
                            <input
                              type="number"
                              value={quickUpdateVal}
                              onChange={(e) => setQuickUpdateVal(Number(e.target.value))}
                              className="w-24 px-2 py-1 text-xs bg-background border border-border rounded-lg outline-none"
                            />
                            <button
                              onClick={() => handleSaveQuickUpdate(goal.id)}
                              className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground font-semibold text-xs"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={() => setQuickUpdateId(null)}
                              className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-muted-foreground text-[11px]">Perbarui kemajuan numerik:</span>
                            <button
                              onClick={() => {
                                setQuickUpdateId(goal.id);
                                setQuickUpdateVal(goal.currentValue);
                              }}
                              className="text-primary hover:underline font-medium text-xs flex items-center gap-1"
                            >
                              <Edit3 size={11} /> Update Nilai
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Milestones Sub-tasks Checklist */}
                  {goal.milestones && goal.milestones.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Tahapan Milestone ({goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length})
                      </p>
                      <div className="space-y-1.5">
                        {goal.milestones.map((m) => (
                          <div
                            key={m.id}
                            onClick={(e) => handleToggleMilestone(goal.id, m.id, e)}
                            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition-colors ${
                              m.completed
                                ? "bg-emerald-500/10 border-emerald-500/20 text-foreground"
                                : "bg-card border-border hover:bg-muted/40 text-muted-foreground"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                                m.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/50 bg-background"
                              }`}
                            >
                              {m.completed && <Check size={12} strokeWidth={3} />}
                            </div>
                            <span className={`line-clamp-1 ${m.completed ? "line-through text-muted-foreground" : "font-medium"}`}>
                              {m.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Deadline info & Status */}
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar size={13} className="shrink-0" />
                    <span>Tenggat: {goal.deadline}</span>
                    {isDone ? (
                      <span className="ml-1 text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Selesai
                      </span>
                    ) : isOverdue ? (
                      <span className="ml-1 text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle size={13} /> Lewat {Math.abs(daysLeft)} hari!
                      </span>
                    ) : (
                      <span className="ml-1 text-blue-600 dark:text-blue-400 font-semibold">
                        ({daysLeft} hari lagi)
                      </span>
                    )}
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isDone
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? "Tercapai" : "Berjalan"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Add / Edit Modal */}
      {isModalOpen && (
        <GoalFormModal
          initialData={editingGoal}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGoal(null);
          }}
          onSave={handleSaveGoal}
        />
      )}
    </div>
  );
}

function GoalFormModal({
  initialData,
  onClose,
  onSave,
}: {
  initialData: GoalItem | null;
  onClose: () => void;
  onSave: (goal: Omit<GoalItem, "id" | "createdAt">) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState<GoalItem["category"]>(initialData?.category || "Finansial");
  const [timeframe, setTimeframe] = useState<GoalItem["timeframe"]>(initialData?.timeframe || "Jangka Menengah");
  const [targetType, setTargetType] = useState<GoalItem["targetType"]>(initialData?.targetType || "numeric");
  const [currentValue, setCurrentValue] = useState<number>(initialData?.currentValue ?? 0);
  const [targetValue, setTargetValue] = useState<number>(initialData?.targetValue ?? 100);
  const [unit, setUnit] = useState(initialData?.unit || "Juta Rp");
  const [deadline, setDeadline] = useState(initialData?.deadline || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10));
  const [priority, setPriority] = useState<GoalItem["priority"]>(initialData?.priority || "Tinggi");
  const [whyStatement, setWhyStatement] = useState(initialData?.whyStatement || "");
  const [colorScheme, setColorScheme] = useState(initialData?.colorScheme || "blue");
  const [milestones, setMilestones] = useState<Milestone[]>(initialData?.milestones || []);
  const [newMilestoneText, setNewMilestoneText] = useState("");

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setMilestones((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, title: newMilestoneText.trim(), completed: false },
    ]);
    setNewMilestoneText("");
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Judul target wajib diisi.");
      return;
    }

    const effectiveTargetVal = targetType === "milestones" ? milestones.length : targetValue;
    const effectiveCurrVal =
      targetType === "milestones"
        ? milestones.filter((m) => m.completed).length
        : currentValue;
    const isCompleted = effectiveCurrVal >= effectiveTargetVal && effectiveTargetVal > 0;

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      timeframe,
      targetType,
      currentValue: effectiveCurrVal,
      targetValue: effectiveTargetVal,
      unit: targetType === "milestones" ? "Tahap" : unit,
      milestones,
      deadline,
      priority,
      status: isCompleted ? "completed" : "in_progress",
      whyStatement: whyStatement.trim(),
      colorScheme,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-1">
          {initialData ? "Edit Sasaran Target" : "Buat Target Baru"}
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Tetapkan sasaran terukur dan alasan motivasi fundamental untuk mencapainya.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Judul Sasaran *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Akumulasi Portofolio Saham Syariah Rp 100 Juta"
              className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GoalItem["category"])}
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              >
                <option value="Finansial">Finansial</option>
                <option value="Karir & Bisnis">Karir & Bisnis</option>
                <option value="Kesehatan & Kebugaran">Kesehatan & Kebugaran</option>
                <option value="Pendidikan & Skill">Pendidikan & Skill</option>
                <option value="Pribadi & Spiritual">Pribadi & Spiritual</option>
                <option value="Keluarga & Relasi">Keluarga & Relasi</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Jangka Waktu</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as GoalItem["timeframe"])}
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              >
                <option value="Jangka Pendek">Jangka Pendek (&lt; 3 bulan)</option>
                <option value="Jangka Menengah">Jangka Menengah (3-12 bulan)</option>
                <option value="Jangka Panjang">Jangka Panjang (&gt; 1 tahun)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Tipe Pengukuran</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as GoalItem["targetType"])}
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              >
                <option value="numeric">Angka Numerik (Nominal / Jumlah)</option>
                <option value="milestones">Daftar Tahapan (Checklist Milestone)</option>
                <option value="percentage">Persentase (0 - 100%)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Tenggat Waktu (Target Selesai)</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* If numeric or percentage */}
          {targetType !== "milestones" ? (
            <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3.5 rounded-2xl border border-border">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Nilai Saat Ini</label>
                <input
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Target Akhir</label>
                <input
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Satuan</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Rp, Kg, Buku, Jam..."
                  className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-xl outline-none"
                />
              </div>
            </div>
          ) : (
            /* Milestone builder */
            <div className="space-y-2 bg-muted/40 p-3.5 rounded-2xl border border-border">
              <label className="text-xs font-semibold text-foreground">Tahapan Milestone</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMilestoneText}
                  onChange={(e) => setNewMilestoneText(e.target.value)}
                  placeholder="Tambah langkah/tahapan milestone..."
                  className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded-xl outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMilestone();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground"
                >
                  Tambah
                </button>
              </div>

              {milestones.length > 0 && (
                <div className="space-y-1.5 pt-2 max-h-36 overflow-y-auto">
                  {milestones.map((m, idx) => (
                    <div key={m.id} className="flex items-center justify-between bg-card p-2 rounded-xl border border-border text-xs">
                      <span>{idx + 1}. {m.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(m.id)}
                        className="text-muted-foreground hover:text-rose-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Deskripsi / Rincian Sasaran</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan parameter keberhasilan dan strategi eksekusi..."
              className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" />
              Alasan Mengapa ("The Why" - Faktor Pendorong Utama)
            </label>
            <input
              type="text"
              value={whyStatement}
              onChange={(e) => setWhyStatement(e.target.value)}
              placeholder="Mengapa target ini sangat krusial bagi kehidupan atau bisnis Anda?"
              className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as GoalItem["priority"])}
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              >
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Tema Warna Kartu</label>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              >
                <option value="blue">Biru (Fokus & Korporat)</option>
                <option value="emerald">Hijau Emerald (Finansial & Kebugaran)</option>
                <option value="purple">Ungu (Pendidikan & Kreativitas)</option>
                <option value="amber">Amber (Energi & Proyek)</option>
                <option value="rose">Rose (Keluarga & Pribadi)</option>
              </select>
            </div>
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
              Simpan Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
