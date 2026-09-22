import React, { useState } from "react";
import {
  CheckSquare,
  DollarSign,
  FileText,
  Heart,
  X,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from "lucide-react";

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

type CaptureTab = "task" | "transaction" | "note" | "habit";

export function QuickCaptureModal({
  isOpen,
  onClose,
  onSuccess,
}: QuickCaptureModalProps) {
  const [tab, setTab] = useState<CaptureTab>("task");

  // Task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<"Tinggi" | "Sedang" | "Rendah">("Sedang");
  const [taskCategory, setTaskCategory] = useState("Strategi");

  // Transaction form state
  const [txType, setTxType] = useState<"earning" | "expense">("expense");
  const [txTitle, setTxTitle] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState("Operasional");

  // Note form state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  // Habit form state
  const [habitName, setHabitName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (tab === "task") {
        if (!taskTitle.trim()) return;
        const currentTasks = JSON.parse(localStorage.getItem("aio_quick_tasks") || "[]");
        const newTask = {
          id: crypto.randomUUID(),
          title: taskTitle.trim(),
          priority: taskPriority,
          category: taskCategory,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("aio_quick_tasks", JSON.stringify([newTask, ...currentTasks]));
        window.dispatchEvent(new Event("aio_data_updated"));
        onSuccess?.("Tugas berhasil ditambahkan!");
        setTaskTitle("");
      } else if (tab === "transaction") {
        if (!txTitle.trim() || !txAmount) return;
        const currentTxs = JSON.parse(localStorage.getItem("aio_quick_transactions") || "[]");
        const newTx = {
          id: crypto.randomUUID(),
          title: txTitle.trim(),
          amount: parseFloat(txAmount.replace(/[^0-9]/g, "")) || 0,
          type: txType,
          category: txCategory,
          date: new Date().toISOString().split("T")[0],
        };
        localStorage.setItem("aio_quick_transactions", JSON.stringify([newTx, ...currentTxs]));
        window.dispatchEvent(new Event("aio_data_updated"));
        onSuccess?.("Transaksi berhasil dicatat!");
        setTxTitle("");
        setTxAmount("");
      } else if (tab === "note") {
        if (!noteTitle.trim()) return;
        const currentNotes = JSON.parse(localStorage.getItem("aio_quick_notes") || "[]");
        const newNote = {
          id: crypto.randomUUID(),
          title: noteTitle.trim(),
          content: noteContent.trim(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("aio_quick_notes", JSON.stringify([newNote, ...currentNotes]));
        window.dispatchEvent(new Event("aio_data_updated"));
        onSuccess?.("Catatan kilat tersimpan!");
        setNoteTitle("");
        setNoteContent("");
      } else if (tab === "habit") {
        if (!habitName.trim()) return;
        const currentHabits = JSON.parse(localStorage.getItem("aio_quick_habits") || "[]");
        const newHabit = {
          id: crypto.randomUUID(),
          name: habitName.trim(),
          streak: 1,
          doneToday: true,
        };
        localStorage.setItem("aio_quick_habits", JSON.stringify([newHabit, ...currentHabits]));
        window.dispatchEvent(new Event("aio_data_updated"));
        onSuccess?.("Kebiasaan baru ditambahkan!");
        setHabitName("");
      }
      onClose();
    } catch (err) {
      console.error(err);
      onClose();
    }
  };

  return (
    <>
      {/* Invisible backdrop (dismiss on outside click, just like switch profile / mode) */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Pop-up window positioned directly above dock */}
      <div
        className="fixed bottom-[88px] left-1/2 -translate-x-1/2 z-50 w-[92vw] sm:w-[380px] max-h-[calc(100vh-110px)] rounded-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-[30px] border border-white/60 dark:border-white/15 shadow-[0px_4px_21px_-8px_rgba(255,255,255,0.5),0_20px_50px_rgba(0,0,0,0.22)] liquid-glass-dock overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-200 select-none cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with segmented tabs */}
        <div className="p-3 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5 tracking-tight">
              <span className="p-1 rounded-lg bg-primary/10 text-primary">
                <Plus className="size-3.5" />
              </span>
              <span>Quick Capture</span>
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1 p-0.5 bg-background/80 dark:bg-zinc-800/80 rounded-xl border border-border/60 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setTab("task")}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                tab === "task"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckSquare className="size-3" />
              <span>Tugas</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("transaction")}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                tab === "transaction"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <DollarSign className="size-3" />
              <span>Uang</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("note")}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                tab === "note"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="size-3" />
              <span>Catatan</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("habit")}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                tab === "habit"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className="size-3" />
              <span>Habit</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-3.5 space-y-3 overflow-y-auto no-scrollbar max-h-[60vh]">
          {tab === "task" && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Nama Tugas / Deliverable
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Misal: Review presentasi klien Q4..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Prioritas
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 text-foreground focus:outline-none focus:ring-1.5 focus:ring-primary/40"
                  >
                    <option value="Tinggi">Tinggi (Urgent)</option>
                    <option value="Sedang">Sedang (Normal)</option>
                    <option value="Rendah">Rendah (Backlog)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Kategori
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 text-foreground focus:outline-none focus:ring-1.5 focus:ring-primary/40"
                  >
                    <option value="Strategi">Strategi Bisnis</option>
                    <option value="Klien">Klien & Proyek</option>
                    <option value="Keuangan">Finansial</option>
                    <option value="Pribadi">Personal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === "transaction" && (
            <div className="space-y-2.5">
              <div className="flex rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 p-0.5 bg-neutral-100/70 dark:bg-zinc-800/70">
                <button
                  type="button"
                  onClick={() => setTxType("expense")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    txType === "expense"
                      ? "bg-rose-500 text-white shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ArrowDownRight className="size-3.5" />
                  <span>Pengeluaran</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTxType("earning")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    txType === "earning"
                      ? "bg-emerald-600 text-white shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ArrowUpRight className="size-3.5" />
                  <span>Pendapatan</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Keterangan Transaksi
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  placeholder="Misal: Retainer konsultasi, langganan cloud..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="1500000"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Kategori
                  </label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 text-foreground focus:outline-none focus:ring-1.5 focus:ring-primary/40"
                  >
                    <option value="Operasional">Operasional</option>
                    <option value="Honor Konsultan">Honor Konsultan</option>
                    <option value="Investasi">Investasi</option>
                    <option value="Gaya Hidup">Gaya Hidup</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === "note" && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Judul Catatan
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Ide cepat, poin rapat, insight..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Isi Catatan
                </label>
                <textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Tuliskan detail poin atau aksi lanjutan..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground resize-none"
                />
              </div>
            </div>
          )}

          {tab === "habit" && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Aktivitas / Habit Harian
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="Misal: Baca riset industri 20 menit, meditasi..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-xs hover:opacity-95 transition-opacity"
            >
              Simpan & Catat
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
