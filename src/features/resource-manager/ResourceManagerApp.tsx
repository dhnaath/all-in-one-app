import React, { useState, useMemo } from "react";
import {
  Layers,
  Users,
  Laptop,
  Box,
  Coins,
  DoorOpen,
  Car,
  Key,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  BarChart3,
  X,
  Trash2,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FolderGit2,
  Zap,
  Building,
  RefreshCw,
} from "lucide-react";
import { useResourceStore } from "./store";
import { usePeopleStore } from "../people-manager/store";
import {
  Resource,
  ResourceTypeKey,
  Allocation,
  ResourceViewMode,
  AllocationTargetType,
} from "./types";

export function ResourceManagerApp() {
  const {
    resources,
    allocations,
    conflicts,
    selectedResourceId,
    createResource,
    updateResource,
    deleteResource,
    createAllocation,
    updateAllocationStatus,
    releaseAllocation,
    resolveConflict,
    setSelectedResourceId,
  } = useResourceStore();

  const { people } = usePeopleStore();

  const [activeTab, setActiveTab] = useState<ResourceViewMode>("capacity_overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Resource Modal
  const [isNewResOpen, setIsNewResOpen] = useState(false);
  const [resName, setResName] = useState("");
  const [resType, setResType] = useState<ResourceTypeKey>("person");
  const [resUnit, setResUnit] = useState("jam/minggu");
  const [resTotalCap, setResTotalCap] = useState("40");
  const [resExclusive, setResExclusive] = useState(false);
  const [resPersonRef, setResPersonRef] = useState("");
  const [resNotes, setResNotes] = useState("");

  // New Allocation Modal
  const [isNewAllocOpen, setIsNewAllocOpen] = useState(false);
  const [allocResId, setAllocResId] = useState("");
  const [allocTargetType, setAllocTargetType] = useState<AllocationTargetType>("project");
  const [allocTargetTitle, setAllocTargetTitle] = useState("");
  const [allocAmount, setAllocAmount] = useState("10");
  const [allocStart, setAllocStart] = useState(new Date().toISOString().split("T")[0]);
  const [allocEnd, setAllocEnd] = useState(new Date().toISOString().split("T")[0]);

  // Resolve Conflict Modal
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(null);
  const [resolveNote, setResolveNote] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getTypeIcon = (type: ResourceTypeKey) => {
    switch (type) {
      case "person":
        return <Users className="w-4 h-4 text-emerald-400" />;
      case "room":
        return <DoorOpen className="w-4 h-4 text-sky-400" />;
      case "equipment":
        return <Laptop className="w-4 h-4 text-purple-400" />;
      case "vehicle":
        return <Car className="w-4 h-4 text-amber-400" />;
      case "budget":
        return <Coins className="w-4 h-4 text-yellow-400" />;
      case "software_license":
        return <Key className="w-4 h-4 text-cyan-400" />;
      default:
        return <Box className="w-4 h-4 text-slate-400" />;
    }
  };

  // Compute Capacity per resource
  const resourceCapacities = useMemo(() => {
    return resources.map((res) => {
      const activeAllocs = allocations.filter(
        (a) => a.resourceId === res.id && (a.status === "active" || a.status === "planned")
      );
      const allocatedTotal = activeAllocs.reduce((sum, a) => sum + a.amount, 0);
      const remaining = Math.max(0, res.totalCapacity - allocatedTotal);
      const isOverallocated = allocatedTotal > res.totalCapacity;
      const utilizationRate =
        res.totalCapacity > 0 ? Math.round((allocatedTotal / res.totalCapacity) * 100) : 0;

      return {
        ...res,
        allocatedTotal,
        remaining,
        isOverallocated,
        utilizationRate,
        activeAllocsCount: activeAllocs.length,
      };
    });
  }, [resources, allocations]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resourceCapacities.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          (r.notes || "").toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [resourceCapacities, typeFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalRes = resources.length;
    const overallocatedCount = resourceCapacities.filter((r) => r.isOverallocated).length;
    const activeConflictsCount = conflicts.filter((c) => !c.resolved).length;
    const idleCount = resourceCapacities.filter((r) => r.allocatedTotal === 0).length;

    // Budget resource spent vs remaining
    const budgetRes = resourceCapacities.find((r) => r.type === "budget");
    const budgetAllocated = budgetRes ? budgetRes.allocatedTotal : 0;
    const budgetRemaining = budgetRes ? budgetRes.remaining : 0;

    return {
      totalRes,
      overallocatedCount,
      activeConflictsCount,
      idleCount,
      budgetAllocated,
      budgetRemaining,
    };
  }, [resources, resourceCapacities, conflicts]);

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName.trim()) return;

    createResource({
      name: resName.trim(),
      type: resType,
      capacityUnit: resUnit.trim() || "unit",
      totalCapacity: parseFloat(resTotalCap) || 1,
      isExclusive: resExclusive,
      personRef: resType === "person" ? resPersonRef || undefined : undefined,
      notes: resNotes.trim() || undefined,
    });

    showToast(`Resource "${resName}" berhasil didaftarkan ke ekosistem!`);
    setIsNewResOpen(false);
    setResName("");
    setResNotes("");
  };

  const handleCreateAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocResId || !allocTargetTitle.trim()) return;

    const res = resources.find((r) => r.id === allocResId);

    const { hasConflict } = createAllocation({
      resourceId: allocResId,
      resourceName: res?.name || "Resource",
      allocatedToType: allocTargetType,
      allocatedToId: `target-${Date.now()}`,
      allocatedToTitle: allocTargetTitle.trim(),
      amount: parseFloat(allocAmount) || 1,
      periodStart: allocStart,
      periodEnd: allocEnd,
      status: "active",
    });

    if (hasConflict) {
      showToast("Alokasi berhasil dibuat, tetapi TERDETEKSI KONFLIK tumpang tindih waktu!");
    } else {
      showToast("Alokasi sumber daya berhasil dicatat!");
    }

    setIsNewAllocOpen(false);
    setAllocTargetTitle("");
  };

  const handleResolveConflict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConflictId) return;

    resolveConflict(selectedConflictId, resolveNote.trim() || "Telah dinegosiasikan & dijadwal ulang");
    showToast("Konflik berhasil diselesaikan!");
    setSelectedConflictId(null);
    setResolveNote("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6 lg:p-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-400 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">Resource Manager</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  App #34
                </span>
                <span className="text-xs text-slate-400">
                  Source of Truth Kapasitas & Alokasi Lintas-Proyek
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                Menjawab "apa yang dipakai, seberapa banyak, dan apakah cukup" (orang, alat, ruang meeting, budget, kendaraan, lisensi).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setIsNewAllocOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Alokasikan Resource</span>
          </button>

          <button
            onClick={() => setIsNewResOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-sm font-semibold shadow-md shadow-amber-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sumber Daya</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-800/80 scrollbar-none">
        <button
          onClick={() => setActiveTab("capacity_overview")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "capacity_overview"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Ringkasan Kapasitas & Utilisasi</span>
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "list"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Daftar Resource ({resources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("conflicts")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "conflicts"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Konflik Alokasi ({conflicts.filter((c) => !c.resolved).length})</span>
        </button>

        <button
          onClick={() => setActiveTab("allocation_calendar")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "allocation_calendar"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Jadwal Alokasi Aktif ({allocations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "stats"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Statistik & Utilisasi</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 mt-4">
        {/* STATS VIEW */}
        {activeTab === "stats" && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Resource</div>
                <div className="text-3xl font-extrabold text-white mt-1">{stats.totalRes}</div>
                <div className="text-xs text-slate-500 mt-1">Orang, alat, ruang, budget</div>
              </div>

              <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Overallocated</div>
                <div className="text-3xl font-extrabold text-rose-400 mt-1">{stats.overallocatedCount}</div>
                <div className="text-xs text-slate-500 mt-1">Melebihi 100% kapasitas</div>
              </div>

              <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Konflik Aktif</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-1">{stats.activeConflictsCount}</div>
                <div className="text-xs text-slate-500 mt-1">Tumpang tindih jadwal eksklusif</div>
              </div>

              <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Idle Resources</div>
                <div className="text-3xl font-extrabold text-sky-400 mt-1">{stats.idleCount}</div>
                <div className="text-xs text-slate-500 mt-1">Belum teralokasi</div>
              </div>
            </div>

            {/* Budget spent vs remaining */}
            <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                Alokasi Pagu Anggaran (Budget Resource)
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-900 rounded-lg">
                  <div className="text-slate-400">Total Dialokasikan ke Proyek:</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    Rp {stats.budgetAllocated.toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg">
                  <div className="text-slate-400">Sisa Pagu Anggaran Bebas:</div>
                  <div className="text-lg font-bold text-sky-400 mt-1">
                    Rp {stats.budgetRemaining.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONFLICTS VIEW */}
        {activeTab === "conflicts" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl text-xs text-slate-400">
              Deteksi otomatis bentrok pemakaian untuk resource bertipe eksklusif (seperti ruang rapat fisik, unit kendaraan).
            </div>

            {conflicts.length === 0 ? (
              <div className="p-12 text-center bg-slate-800/40 border border-slate-700/60 rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h3 className="font-semibold text-slate-200">Tidak ada konflik alokasi</h3>
                <p className="text-xs text-slate-400 mt-1">Semua alokasi terdistribusi secara tertib tanpa jadwal ganda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conflicts.map((conf) => (
                  <div
                    key={conf.id}
                    className={`p-5 bg-slate-800/80 border rounded-xl space-y-3 ${
                      conf.resolved ? "border-slate-700 opacity-60" : "border-rose-500/50 shadow-lg shadow-rose-500/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-5 h-5 ${conf.resolved ? "text-slate-400" : "text-rose-400"}`} />
                        <span className="font-bold text-base text-white">{conf.resourceName}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            conf.resolved
                              ? "bg-slate-700 text-slate-400"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {conf.resolved ? "Selesai (Resolved)" : "Bentrok Jadwal"}
                        </span>
                      </div>

                      {!conf.resolved && (
                        <button
                          onClick={() => {
                            setSelectedConflictId(conf.id);
                          }}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold"
                        >
                          Selesaikan Konflik
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      {conf.resolutionNote || "Tumpang tindih rentang waktu penggunaan pada resource eksklusif."}
                    </p>

                    <div className="text-[11px] text-slate-500 font-mono">
                      Alokasi yang Terlibat: {conf.conflictingAllocationIds.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ALLOCATION CALENDAR / TIMELINE VIEW */}
        {activeTab === "allocation_calendar" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl text-xs text-slate-400">
              Daftar komitmen pemakaian sumber daya per project atau deliverable kerja.
            </div>

            <div className="space-y-3">
              {allocations.map((alloc) => (
                <div
                  key={alloc.id}
                  className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{alloc.resourceName}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-amber-400 font-semibold">{alloc.allocatedToTitle}</span>
                    </div>

                    <div className="text-slate-400">
                      Beban Alokasi: <strong className="text-slate-200">{alloc.amount}</strong> • Periode:{" "}
                      <span className="font-mono text-slate-300">
                        {alloc.periodStart} s/d {alloc.periodEnd}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alloc.status === "active"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : alloc.status === "completed"
                          ? "bg-slate-700 text-slate-400"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {alloc.status}
                    </span>

                    {alloc.status === "active" && (
                      <button
                        onClick={() => {
                          releaseAllocation(alloc.id);
                          showToast("Alokasi telah dibebaskan (Release)!");
                        }}
                        className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs"
                      >
                        Bebaskan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAPACITY OVERVIEW & LIST VIEW */}
        {(activeTab === "capacity_overview" || activeTab === "list") && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari resource, alat, ruangan, budget..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Semua Jenis Resource</option>
                  <option value="person">Orang / Personil</option>
                  <option value="room">Ruang Meeting</option>
                  <option value="equipment">Alat & Perangkat</option>
                  <option value="vehicle">Kendaraan Operasional</option>
                  <option value="budget">Pagu Budget Proyek</option>
                  <option value="software_license">Lisensi Software</option>
                </select>
              </div>
            </div>

            {/* Resource Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((res) => {
                let barColor = "bg-emerald-500";
                if (res.isOverallocated) {
                  barColor = "bg-rose-500";
                } else if (res.utilizationRate > 80) {
                  barColor = "bg-amber-500";
                }

                return (
                  <div
                    key={res.id}
                    className={`p-5 bg-slate-800/80 border rounded-xl flex flex-col justify-between space-y-4 transition ${
                      res.isOverallocated ? "border-rose-500/60 shadow-lg shadow-rose-500/10" : "border-slate-700"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-slate-700/60 rounded-lg">{getTypeIcon(res.type)}</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                            {res.type.replace("_", " ")}
                          </span>
                        </div>

                        {res.isOverallocated ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                            OVERALLOCATED
                          </span>
                        ) : res.isExclusive ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Eksklusif (1 slot)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Tersedia
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-slate-100">{res.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {res.notes || "Tanpa catatan spesifik"}
                        </p>
                      </div>

                      {/* Capacity Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-400">
                            Terpakai: {res.allocatedTotal} / {res.totalCapacity} {res.capacityUnit}
                          </span>
                          <span className={res.isOverallocated ? "text-rose-400" : "text-slate-300"}>
                            {res.utilizationRate}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700/50">
                          <div
                            className={`h-full ${barColor} transition-all duration-300`}
                            style={{ width: `${Math.min(100, res.utilizationRate)}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                          <span>Sisa: {res.remaining} {res.capacityUnit}</span>
                          <span>{res.activeAllocsCount} alokasi aktif</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setAllocResId(res.id);
                          setIsNewAllocOpen(true);
                        }}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold flex items-center gap-1 shadow-sm"
                      >
                        + Alokasikan
                      </button>

                      <button
                        onClick={() => {
                          deleteResource(res.id);
                          showToast("Resource dihapus.");
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: NEW RESOURCE */}
      {isNewResOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Daftarkan Sumber Daya (Resource) Baru</h3>
              <button onClick={() => setIsNewResOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Resource <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Ruang Rapat Beta, Laptop Cadangan #2"
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori Tipe</label>
                  <select
                    value={resType}
                    onChange={(e) => {
                      const t = e.target.value as ResourceTypeKey;
                      setResType(t);
                      if (t === "person") setResUnit("jam/minggu");
                      else if (t === "room") setResUnit("slot jam");
                      else if (t === "budget") setResUnit("Rp");
                      else if (t === "software_license") setResUnit("seat");
                      else setResUnit("unit");

                      if (t === "room" || t === "vehicle" || t === "equipment") setResExclusive(true);
                      else setResExclusive(false);
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="person">Orang / Personil</option>
                    <option value="room">Ruang Rapat (Room)</option>
                    <option value="equipment">Alat / Equipment</option>
                    <option value="vehicle">Kendaraan (Vehicle)</option>
                    <option value="budget">Anggaran / Budget</option>
                    <option value="software_license">Lisensi Software</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Satuan Kapasitas</label>
                  <input
                    type="text"
                    value={resUnit}
                    onChange={(e) => setResUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kapasitas Total Periode <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={resTotalCap}
                  onChange={(e) => setResTotalCap(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {resType === "person" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tautkan ke Profil People Manager (#35)
                  </label>
                  <select
                    value={resPersonRef}
                    onChange={(e) => setResPersonRef(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Pilih Orang...</option>
                    {people.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.jobTitle || "Person"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="exclusiveCheck"
                  checked={resExclusive}
                  onChange={(e) => setResExclusive(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="exclusiveCheck" className="text-xs text-slate-300">
                  Bersifat Eksklusif (Hanya 1 pihak dapat memakai pada satu waktu)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewResOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ALLOCATE RESOURCE */}
      {isNewAllocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Buat Alokasi Sumber Daya Baru</h3>
              <button onClick={() => setIsNewAllocOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAllocation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pilih Resource <span className="text-rose-400">*</span>
                </label>
                <select
                  required
                  value={allocResId}
                  onChange={(e) => setAllocResId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Pilih Resource...</option>
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.totalCapacity} {r.capacityUnit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Alokasi</label>
                  <select
                    value={allocTargetType}
                    onChange={(e) => setAllocTargetType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="project">Project (#03)</option>
                    <option value="task">Task (#01)</option>
                    <option value="deliverable">Deliverable (#20)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Beban Jumlah</label>
                  <input
                    type="number"
                    required
                    value={allocAmount}
                    onChange={(e) => setAllocAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Judul Proyek / Aktivitas <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Proyek Core Banking Mandiri"
                  value={allocTargetTitle}
                  onChange={(e) => setAllocTargetTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mulai</label>
                  <input
                    type="date"
                    value={allocStart}
                    onChange={(e) => setAllocStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Selesai</label>
                  <input
                    type="date"
                    value={allocEnd}
                    onChange={(e) => setAllocEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAllocOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold"
                >
                  Konfirmasi Alokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESOLVE CONFLICT */}
      {selectedConflictId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Selesaikan Konflik Alokasi</h3>
              <button onClick={() => setSelectedConflictId(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveConflict} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catatan Resolusi / Negosiasi Jadwal
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="mis. Telah disepakati Ruang Rapat digeser 1 jam lebih lambat untuk tim vendor."
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedConflictId(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                >
                  Tandai Selesai (Resolve)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
