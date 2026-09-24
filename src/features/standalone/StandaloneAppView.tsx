import * as React from "react";
import {
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Tag,
  ArrowUpDown,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  AlertCircle,
  FileDown,
  X,
  Check,
} from "lucide-react";
import {
  STANDALONE_APPS,
  StandaloneAppConfig,
  StandaloneRecord,
} from "./standaloneAppsData";
import { useRouterState } from "@tanstack/react-router";

interface StandaloneAppViewProps {
  appId: string;
}

export function StandaloneAppView({ appId }: StandaloneAppViewProps) {
  const config = STANDALONE_APPS[appId];

  // If no config found, render fallback
  if (!config) {
    return (
      <div className="p-8 text-center bg-card rounded-2xl border">
        <h2 className="text-lg font-bold text-foreground">Modul Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Aplikasi standalone dengan ID &ldquo;{appId}&rdquo; belum terdaftar.
        </p>
      </div>
    );
  }

  const storageKey = `aio_standalone_${appId}`;

  // State management with localStorage
  const [records, setRecords] = React.useState<StandaloneRecord[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return config.initialRecords;
  });

  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Sync the active tab with the `?tab=` URL param so the shell's contextual
  // sidebar can deep-link into a specific tab of this standalone app.
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  React.useEffect(() => {
    const param = new URLSearchParams(searchStr || "").get("tab");
    if (param && param !== activeTab && config.tabs.some((t) => t.id === param)) {
      setActiveTab(param);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchStr]);

  const changeTab = (id: string) => {
    setActiveTab(id);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", id);
      window.history.replaceState(window.history.state, "", url.toString());
    } catch {
      // ignore
    }
  };
  const [selectedPriority, setSelectedPriority] = React.useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);

  // New Record Form State
  const [formTitle, setFormTitle] = React.useState("");
  const [formSubtitle, setFormSubtitle] = React.useState("");
  const [formCategory, setFormCategory] = React.useState("");
  const [formDate, setFormDate] = React.useState("");
  const [formPriority, setFormPriority] = React.useState<"low" | "medium" | "high">("medium");
  const [formMeta, setFormMeta] = React.useState<Record<string, string>>({});

  // Save to localStorage
  const saveRecords = (newRecords: StandaloneRecord[]) => {
    setRecords(newRecords);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newRecords));
    } catch {
      // ignore
    }
  };

  const handleToggleStatus = (recordId: string) => {
    const updated = records.map((r) => {
      if (r.id !== recordId) return r;
      const nextStatus = r.status === "completed" ? "active" : "completed";
      return { ...r, status: nextStatus as StandaloneRecord["status"] };
    });
    saveRecords(updated);
  };

  const handleDeleteRecord = (recordId: string) => {
    const updated = records.filter((r) => r.id !== recordId);
    saveRecords(updated);
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newRecord: StandaloneRecord = {
      id: `${appId}-${Date.now()}`,
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || undefined,
      category: formCategory.trim() || undefined,
      date: formDate.trim() || new Date().toISOString().split("T")[0],
      priority: formPriority,
      status: "active",
      meta: Object.keys(formMeta).length > 0 ? formMeta : undefined,
    };

    saveRecords([newRecord, ...records]);
    setIsAddModalOpen(false);

    // Reset Form
    setFormTitle("");
    setFormSubtitle("");
    setFormCategory("");
    setFormDate("");
    setFormPriority("medium");
    setFormMeta({});
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    // Tab filter
    if (activeTab === "active" && r.status === "completed") return false;
    if (activeTab === "completed" && r.status !== "completed") return false;
    if (activeTab === "urgent" && r.priority !== "high" && r.status !== "urgent") return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchSub = r.subtitle?.toLowerCase().includes(q) || false;
      const matchCat = r.category?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchSub && !matchCat) return false;
    }

    // Priority filter
    if (selectedPriority !== "all" && r.priority !== selectedPriority) {
      return false;
    }

    return true;
  });

  const totalCount = records.length;
  const activeCount = records.filter((r) => r.status !== "completed").length;
  const completedCount = records.filter((r) => r.status === "completed").length;

  const Icon = config.icon;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-card via-card to-muted/40 border shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div
              className={`size-14 sm:size-16 rounded-2xl bg-gradient-to-tr ${config.colorScheme} flex items-center justify-center text-white shadow-md shrink-0`}
            >
              <Icon className="size-7 sm:size-8" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-semibold text-primary/90 uppercase tracking-wider">
                  {config.categoryGroup}
                </span>
                <ChevronRight className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{config.subCategoryTitle}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
                  {config.badge}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {config.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                {config.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="size-4" />
              <span>Tambah Data Baru</span>
            </button>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border/60">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium">Total Item</span>
            <span className="text-xl sm:text-2xl font-bold text-foreground">{totalCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium">Dalam Proses / Aktif</span>
            <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {activeCount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium">Selesai / Tuntas</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border overflow-x-auto">
          {config.tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => changeTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Priority Selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-card border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-card border text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Prioritas</option>
            <option value="high">Prioritas Tinggi</option>
            <option value="medium">Prioritas Sedang</option>
            <option value="low">Prioritas Rendah</option>
          </select>
        </div>
      </div>

      {/* Main Records List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-card rounded-2xl border border-dashed text-muted-foreground flex flex-col items-center justify-center gap-3">
            <Layers className="size-10 opacity-40 text-muted-foreground" />
            <div className="text-sm font-semibold">Belum ada data pada kriteria ini.</div>
            <p className="text-xs text-muted-foreground max-w-sm">
              Klik &ldquo;Tambah Data Baru&rdquo; untuk memasukkan catatan atau sesuaikan filter pencarian.
            </p>
          </div>
        ) : (
          filteredRecords.map((item) => {
            const isDone = item.status === "completed";
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 group hover:shadow-md ${
                  isDone
                    ? "bg-muted/30 border-border/60 opacity-80"
                    : "bg-card border-border hover:border-primary/40"
                }`}
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.category && (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                          {item.category}
                        </span>
                      )}
                      {item.priority && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.priority === "high"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : item.priority === "medium"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {item.priority === "high"
                            ? "Tinggi"
                            : item.priority === "medium"
                            ? "Sedang"
                            : "Rendah"}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className="cursor-pointer shrink-0 text-muted-foreground hover:text-primary transition-colors"
                      title={isDone ? "Tandai Belum Selesai" : "Tandai Selesai"}
                    >
                      {isDone ? (
                        <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle className="size-5 hover:scale-110 transition-transform" />
                      )}
                    </button>
                  </div>

                  <div>
                    <h3
                      className={`text-base font-bold text-foreground leading-snug ${
                        isDone ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Metadata Chips */}
                  {item.meta && Object.keys(item.meta).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-border/40">
                      {Object.entries(item.meta).map(([k, val]) => {
                        const metaField = config.fieldLabels.extraMeta?.find((f) => f.key === k);
                        const labelName = metaField?.label || k;
                        return (
                          <div
                            key={k}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground flex items-center gap-1 font-medium"
                          >
                            <span className="opacity-75">{labelName}:</span>
                            <span className="text-foreground font-semibold">{String(val)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>{item.date || "Tidak ada tanggal"}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteRecord(item.id)}
                    className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Hapus Data"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-card rounded-2xl border shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-foreground">Tambah Entri Baru</h2>
                <p className="text-xs text-muted-foreground">{config.title}</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="flex flex-col gap-4 mt-4">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  {config.fieldLabels.title} *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={`Masukkan ${config.fieldLabels.title}...`}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-background border text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              {/* Subtitle */}
              {config.fieldLabels.subtitle && (
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    {config.fieldLabels.subtitle}
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder={`Masukkan rincian / deskripsi...`}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-background border text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
              )}

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    {config.fieldLabels.category || "Kategori"}
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Contoh: Operasional / Utama"
                    className="w-full px-3 py-2 text-sm rounded-xl bg-background border text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    {config.fieldLabels.date || "Tanggal"}
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-background border text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Tingkat Prioritas
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map((pri) => (
                    <button
                      key={pri}
                      type="button"
                      onClick={() => setFormPriority(pri)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border cursor-pointer transition-all ${
                        formPriority === pri
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {pri === "high" ? "Tinggi" : pri === "medium" ? "Sedang" : "Rendah"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Extra Meta Fields */}
              {config.fieldLabels.extraMeta && config.fieldLabels.extraMeta.length > 0 && (
                <div className="pt-2 border-t flex flex-col gap-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Informasi Spesifik
                  </span>
                  {config.fieldLabels.extraMeta.map((extra) => (
                    <div key={extra.key}>
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        {extra.label}
                      </label>
                      <input
                        type={extra.type || "text"}
                        value={formMeta[extra.key] || ""}
                        onChange={(e) =>
                          setFormMeta({ ...formMeta, [extra.key]: e.target.value })
                        }
                        placeholder={extra.placeholder}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-background border text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shadow"
                >
                  Simpan Entri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
