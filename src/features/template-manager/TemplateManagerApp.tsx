import React, { useState, useMemo } from "react";
import {
  FileCode2,
  FolderKanban,
  CheckSquare,
  BookOpen,
  Database,
  FileText,
  Workflow,
  Sparkles,
  Search,
  Filter,
  Layers,
  Copy,
  Plus,
  Play,
  Share2,
  Lock,
  Globe,
  Users,
  BarChart3,
  Calendar,
  X,
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  History,
  Tag,
  ArrowRight,
} from "lucide-react";
import { useTemplateStore } from "./store";
import {
  EcosystemTemplate,
  SourceAppType,
  TemplateCategory,
  TemplateViewMode,
  TemplateVisibility,
  TemplateVariable,
} from "./types";

export function TemplateManagerApp() {
  const {
    templates,
    categories,
    applicationRecords,
    selectedTemplateId,
    createTemplate,
    updateTemplateMetadata,
    deleteTemplate,
    duplicateTemplate,
    publishTemplate,
    applyTemplate,
    createCategory,
    setSelectedTemplateId,
  } = useTemplateStore();

  const [activeTab, setActiveTab] = useState<TemplateViewMode>("gallery");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceAppFilter, setSourceAppFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [targetApplyTemplate, setTargetApplyTemplate] = useState<EcosystemTemplate | null>(null);
  const [variableInputs, setVariableInputs] = useState<Record<string, string>>({});
  const [appliedResult, setAppliedResult] = useState<{ id: string; structure: any } | null>(null);

  // New Template Modal
  const [isNewTemplateOpen, setIsNewTemplateOpen] = useState(false);
  const [newTmplName, setNewTmplName] = useState("");
  const [newTmplDesc, setNewTmplDesc] = useState("");
  const [newTmplApp, setNewTmplApp] = useState<SourceAppType>("project_manager");
  const [newTmplCategory, setNewTmplCategory] = useState(categories[0]?.id || "");
  const [newTmplVisibility, setNewTmplVisibility] = useState<TemplateVisibility>("workspace");
  const [newTmplStructureRaw, setNewTmplStructureRaw] = useState(
    JSON.stringify({ name: "{{project_name}}", phases: [{ name: "Discovery", days: 7 }] }, null, 2)
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getSourceAppMeta = (app: SourceAppType) => {
    switch (app) {
      case "project_manager":
        return { label: "Project Manager (#03)", icon: FolderKanban, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
      case "task_manager":
        return { label: "Task Manager (#01)", icon: CheckSquare, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
      case "wiki":
        return { label: "Wiki (#18)", icon: BookOpen, color: "text-sky-400 bg-sky-500/10 border-sky-500/30" };
      case "forms":
        return { label: "Forms (#22)", icon: FileText, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
      case "database":
        return { label: "Database (#15)", icon: Database, color: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
      case "workflow_manager":
        return { label: "Workflow (#21)", icon: Workflow, color: "text-teal-400 bg-teal-500/10 border-teal-500/30" };
      default:
        return { label: "Aplikasi Lain", icon: Layers, color: "text-slate-400 bg-slate-500/10 border-slate-500/30" };
    }
  };

  const handleOpenApplyModal = (tmpl: EcosystemTemplate) => {
    setTargetApplyTemplate(tmpl);
    const initialInputs: Record<string, string> = {};
    tmpl.variables.forEach((v) => {
      initialInputs[v.key] = v.defaultValue || "";
    });
    setVariableInputs(initialInputs);
    setAppliedResult(null);
    setApplyModalOpen(true);
  };

  const handleExecuteApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetApplyTemplate) return;

    const res = applyTemplate(targetApplyTemplate.id, variableInputs);
    if (res.success) {
      setAppliedResult({ id: res.resultingEntityId, structure: res.resolvedStructure });
      showToast(`Template "${targetApplyTemplate.name}" berhasil diterapkan ke ${targetApplyTemplate.sourceApp}!`);
    }
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTmplName.trim()) return;

    let parsedStructure: any = {};
    try {
      parsedStructure = JSON.parse(newTmplStructureRaw);
    } catch {
      parsedStructure = { raw: newTmplStructureRaw };
    }

    createTemplate({
      name: newTmplName.trim(),
      description: newTmplDesc.trim(),
      sourceApp: newTmplApp,
      categoryId: newTmplCategory || undefined,
      visibility: newTmplVisibility,
      variables: [
        {
          id: `var-${Date.now()}`,
          templateId: "",
          key: "{{item_name}}",
          type: "text_placeholder",
          defaultValue: "Instance Baru",
          description: "Placeholder nama entitas",
        },
      ],
      structure: parsedStructure,
      createdBy: "Anda (Current User)",
    });

    showToast(`Template "${newTmplName}" berhasil disimpan ke rak pusat.`);
    setIsNewTemplateOpen(false);
    setNewTmplName("");
    setNewTmplDesc("");
  };

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      if (activeTab === "my_templates" && !t.createdBy.includes("Anda")) return false;
      if (activeTab === "public_templates" && t.visibility !== "public") return false;
      if (sourceAppFilter !== "all" && t.sourceApp !== sourceAppFilter) return false;
      if (categoryFilter !== "all" && t.categoryId !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = t.name.toLowerCase().includes(q);
        const matchDesc = (t.description || "").toLowerCase().includes(q);
        const matchApp = t.sourceApp.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchApp) return false;
      }

      return true;
    }).sort((a, b) => {
      if (activeTab === "most_used") return b.usageCount - a.usageCount;
      return 0;
    });
  }, [templates, activeTab, sourceAppFilter, categoryFilter, searchQuery]);

  // Active detail template
  const activeTemplate = useMemo(() => {
    if (!selectedTemplateId) return null;
    return templates.find((t) => t.id === selectedTemplateId) || null;
  }, [templates, selectedTemplateId]);

  const activeTemplateRecords = useMemo(() => {
    if (!activeTemplate) return [];
    return applicationRecords.filter((r) => r.templateId === activeTemplate.id);
  }, [applicationRecords, activeTemplate]);

  // Statistics
  const stats = useMemo(() => {
    const total = templates.length;
    const totalApplied = applicationRecords.length;
    const publicCount = templates.filter((t) => t.visibility === "public").length;

    const appBreakdown: Record<string, number> = {};
    templates.forEach((t) => {
      appBreakdown[t.sourceApp] = (appBreakdown[t.sourceApp] || 0) + 1;
    });

    const mostPopular = [...templates].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5);

    return { total, totalApplied, publicCount, appBreakdown, mostPopular };
  }, [templates, applicationRecords]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6 lg:p-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-400 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <FileCode2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">Template Manager</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  App #30
                </span>
                <span className="text-xs text-slate-400">
                  {templates.length} Struktur Tersimpan • {applicationRecords.length}x Diterapkan
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                Penyimpanan terpusat untuk struktur reusable (Task, Project, Wiki, Form, Database) dengan variabel relatif.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setIsNewTemplateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Simpan Template Baru</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-800/80 scrollbar-none">
        <button
          onClick={() => setActiveTab("gallery")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "gallery" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Katalog Template ({templates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("most_used")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "most_used" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Paling Sering Digunakan</span>
        </button>

        <button
          onClick={() => setActiveTab("my_templates")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "my_templates" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Template Saya</span>
        </button>

        <button
          onClick={() => setActiveTab("public_templates")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "public_templates" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Globe className="w-4 h-4 text-sky-400" />
          <span>Template Publik ({stats.publicCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "stats" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-violet-400" />
          <span>Statistik & Adopsi</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 mt-4">
        {/* STATS VIEW */}
        {activeTab === "stats" && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Template</div>
                <div className="text-3xl font-extrabold text-white mt-1">{stats.total}</div>
                <div className="text-xs text-slate-500 mt-1">Struktur tersimpan</div>
              </div>
              <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Penerapan</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.totalApplied}x</div>
                <div className="text-xs text-slate-500 mt-1">Instance dibuat dari template</div>
              </div>
              <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Kategori Tematik</div>
                <div className="text-3xl font-extrabold text-sky-400 mt-1">{categories.length}</div>
                <div className="text-xs text-slate-500 mt-1">Lintas aplikasi</div>
              </div>
              <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Template Publik</div>
                <div className="text-3xl font-extrabold text-violet-400 mt-1">{stats.publicCount}</div>
                <div className="text-xs text-slate-500 mt-1">Dapat diakses siapa saja</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-800/60 border border-slate-700 rounded-xl">
                <h4 className="font-semibold text-slate-200 mb-3 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-violet-400" />
                  Template per Aplikasi Sumber
                </h4>
                <div className="space-y-2">
                  {Object.entries(stats.appBreakdown).map(([app, count]) => {
                    const meta = getSourceAppMeta(app as any);
                    return (
                      <div key={app} className="flex items-center justify-between text-xs py-1 border-b border-slate-700/40">
                        <span className="text-slate-300 flex items-center gap-1.5">
                          <meta.icon className="w-3.5 h-3.5 text-slate-400" />
                          {meta.label}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300 font-medium">{count} template</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 bg-slate-800/60 border border-slate-700 rounded-xl">
                <h4 className="font-semibold text-slate-200 mb-3 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Template Paling Populer
                </h4>
                <div className="space-y-2">
                  {stats.mostPopular.map((tmpl) => (
                    <div key={tmpl.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-700/40">
                      <span className="text-slate-300 truncate max-w-xs">{tmpl.name}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-semibold shrink-0">
                        {tmpl.usageCount}x dipakai
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE GALLERY & LIST */}
        {activeTab !== "stats" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari template, aplikasi, placeholder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                <select
                  value={sourceAppFilter}
                  onChange={(e) => setSourceAppFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Semua Aplikasi</option>
                  <option value="project_manager">Project Manager (#03)</option>
                  <option value="task_manager">Task Manager (#01)</option>
                  <option value="wiki">Wiki (#18)</option>
                  <option value="forms">Forms (#22)</option>
                  <option value="database">Database (#15)</option>
                  <option value="workflow_manager">Workflow (#21)</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Template Cards Grid */}
            {filteredTemplates.length === 0 ? (
              <div className="p-12 text-center bg-slate-800/40 border border-slate-700/60 rounded-xl">
                <FileCode2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-300">Tidak ada template ditemukan</h3>
                <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau simpan template baru.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((tmpl) => {
                  const meta = getSourceAppMeta(tmpl.sourceApp);
                  const AppIcon = meta.icon;
                  const cat = categories.find((c) => c.id === tmpl.categoryId);

                  return (
                    <div
                      key={tmpl.id}
                      className="p-5 bg-slate-800/80 border border-slate-700 hover:border-slate-600 rounded-xl flex flex-col justify-between transition space-y-4"
                    >
                      <div className="space-y-2">
                        {/* Header Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium flex items-center gap-1.5 ${meta.color}`}>
                            <AppIcon className="w-3.5 h-3.5" />
                            {meta.label}
                          </span>

                          <div className="flex items-center gap-1 text-[11px] text-slate-400" title={`Visibilitas: ${tmpl.visibility}`}>
                            {tmpl.visibility === "public" ? (
                              <Globe className="w-3.5 h-3.5 text-sky-400" />
                            ) : tmpl.visibility === "workspace" ? (
                              <Users className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span className="capitalize">{tmpl.visibility}</span>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3
                            onClick={() => setSelectedTemplateId(tmpl.id)}
                            className="font-bold text-base text-slate-100 cursor-pointer hover:text-indigo-400 transition"
                          >
                            {tmpl.name}
                          </h3>
                          {tmpl.description && (
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                              {tmpl.description}
                            </p>
                          )}
                        </div>

                        {/* Category & Variables */}
                        <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-slate-400">
                          {cat && (
                            <span className="px-2 py-0.5 rounded bg-slate-700/60 text-slate-300">
                              {cat.name}
                            </span>
                          )}
                          <span>•</span>
                          <span>{tmpl.variables.length} variabel/placeholder</span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {tmpl.usageCount}x diterapkan
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedTemplateId(tmpl.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-200 rounded"
                            title="Inspeksi Struktur"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => duplicateTemplate(tmpl.id)}
                            className="p-1.5 text-slate-400 hover:text-sky-400 rounded"
                            title="Duplikasi"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenApplyModal(tmpl)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Terapkan
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: APPLY TEMPLATE (RESOLVE VARIABLES & APPLY) */}
      {applyModalOpen && targetApplyTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">Terapkan Template: {targetApplyTemplate.name}</h3>
                <p className="text-xs text-slate-400">
                  Target aplikasi: <strong>{targetApplyTemplate.sourceApp}</strong>. Tentukan nilai anchor dan variabel.
                </p>
              </div>
              <button onClick={() => setApplyModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!appliedResult ? (
              <form onSubmit={handleExecuteApply} className="space-y-4">
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Nilai Placeholder & Relative Dates ({targetApplyTemplate.variables.length}):
                  </div>

                  {targetApplyTemplate.variables.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">
                      Template ini tidak memiliki placeholder kustom, struktur akan disalin secara langsung.
                    </div>
                  ) : (
                    targetApplyTemplate.variables.map((v) => (
                      <div key={v.id} className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-300">
                          {v.key}{" "}
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({v.type.replace("_", " ")} - {v.description || "nilai pengganti"})
                          </span>
                        </label>
                        <input
                          type={v.type === "date_relative" ? "text" : "text"}
                          value={variableInputs[v.key] || ""}
                          placeholder={`mis. ${v.defaultValue || "isi nilai"}`}
                          onChange={(e) =>
                            setVariableInputs({ ...variableInputs, [v.key]: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/30"
                  >
                    Konfirmasi & Buat Instance
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    Instance Berhasil Dibuat!
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Struktur baru dengan resulting ID <strong>{appliedResult.id}</strong> telah dihasilkan dan siap dikelola di aplikasi sumber.
                  </p>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">Pratinjau JSON yang Telah Diresolusi:</div>
                  <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 border border-slate-800">
                    {JSON.stringify(appliedResult.structure, null, 2)}
                  </pre>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: INSPECT TEMPLATE DETAIL */}
      {selectedTemplateId && activeTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">{activeTemplate.name}</h3>
                <p className="text-xs text-slate-400">
                  Dibuat oleh {activeTemplate.createdBy} • {new Date(activeTemplate.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setSelectedTemplateId(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Deskripsi</label>
                <p className="text-xs text-slate-200 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                  {activeTemplate.description || "Tidak ada deskripsi."}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Structure Blob (Format Asli)</label>
                <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 border border-slate-800">
                  {JSON.stringify(activeTemplate.structure, null, 2)}
                </pre>
              </div>

              {/* History of application */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 block">
                  Riwayat Penerapan ({activeTemplateRecords.length})
                </label>
                {activeTemplateRecords.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-2 bg-slate-800/40 rounded">
                    Belum pernah diterapkan.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {activeTemplateRecords.map((rec) => (
                      <div key={rec.id} className="p-2 bg-slate-800/60 border border-slate-700 rounded text-xs flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-200">{rec.resultingEntityId}</span>
                          <span className="text-[11px] text-slate-400 ml-2">oleh {rec.appliedBy}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{new Date(rec.appliedAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  deleteTemplate(activeTemplate.id);
                  showToast("Template dihapus.");
                  setSelectedTemplateId(null);
                }}
                className="px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Template
              </button>

              <button
                onClick={() => {
                  setSelectedTemplateId(null);
                  handleOpenApplyModal(activeTemplate);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
              >
                Terapkan Template Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE TEMPLATE */}
      {isNewTemplateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Simpan Template Baru ke Katalog</h3>
              <button onClick={() => setIsNewTemplateOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Template <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Audit ISO 27001 Checklist"
                  value={newTmplName}
                  onChange={(e) => setNewTmplName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi</label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan kegunaan dan skenario pemakaian..."
                  value={newTmplDesc}
                  onChange={(e) => setNewTmplDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Aplikasi Asal</label>
                  <select
                    value={newTmplApp}
                    onChange={(e) => setNewTmplApp(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="project_manager">Project Manager (#03)</option>
                    <option value="task_manager">Task Manager (#01)</option>
                    <option value="wiki">Wiki (#18)</option>
                    <option value="forms">Forms (#22)</option>
                    <option value="database">Database (#15)</option>
                    <option value="workflow_manager">Workflow (#21)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Visibilitas</label>
                  <select
                    value={newTmplVisibility}
                    onChange={(e) => setNewTmplVisibility(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="private">Private (Hanya Saya)</option>
                    <option value="workspace">Workspace (Satu Tim)</option>
                    <option value="public">Publik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Struktur JSON Blob</label>
                <textarea
                  rows={4}
                  value={newTmplStructureRaw}
                  onChange={(e) => setNewTmplStructureRaw(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 font-mono text-[11px] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTemplateOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
