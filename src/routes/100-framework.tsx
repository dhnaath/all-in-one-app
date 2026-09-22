import React, { useState, useEffect, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  BookOpen, LayoutTemplate, PenTool, CheckSquare, 
  ListOrdered, Target, Lightbulb, 
  Briefcase, Menu, X, ArrowRight, ArrowLeft, Activity, Users, Box,
  Settings, RefreshCw, Landmark, LineChart,
  Layers, ShieldCheck, Award, TrendingUp, Sparkles, Megaphone,
  Search, Star, Copy, Check, Printer, Download, RotateCcw,
  ChevronDown, ChevronRight, CheckCircle2, Database,
  SearchCode
} from 'lucide-react';
import { AppShell } from '@/app/app-shell';
import { Panel } from '@/app/ui-bits';
import { CATEGORIES, getFrameworkData, FrameworkContent } from '../frameworkData';
import { VisualLayoutMockup } from '@/app/VisualMockups';

export const Route = createFileRoute('/100-framework')({
  component: FrameworkDashboard,
});

const SectionHeader = ({ number, title, icon: Icon }: { number: string, title: string, icon: any }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
      {number}
    </div>
    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
      {title}
    </h2>
  </div>
);

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    case "Strategic Management": return Activity;
    case "Business Model & Value Proposition": return LayoutTemplate;
    case "Marketing & Customer Management": return Users;
    case "Operations & Performance Management": return Settings;
    case "Financial Management & Business Feasibility": return Landmark;
    case "Innovation, Entrepreneurship & Design": return Lightbulb;
    case "Quality Management & Continuous Improvement": return Target;
    case "Change Management & Organizational Development": return RefreshCw;
    case "Public Policy & Program Management": return BookOpen;
    case "Decision Making & Analytical Thinking": return CheckSquare;
    case "Economics & Quantitative Analysis": return LineChart;
    case "Product Management & Agile/Scrum": return Layers;
    case "Sustainability, ESG & Risk Management": return ShieldCheck;
    case "Leadership, Talent & Culture Management": return Award;
    case "Sales, Pricing & Revenue Operations": return TrendingUp;
    case "Deep Tech, Innovation & Future Studies": return Sparkles;
    case "Public Relations, Crisis & Stakeholder Management": return Megaphone;
    default: return Box;
  }
};

function FrameworkDashboard() {
  const allFrameworks = useMemo(() => CATEGORIES.flatMap(c => c.frameworks), []);
  const [activeFramework, setActiveFramework] = useState(() => allFrameworks[0] || "TOWS Matrix");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all');
  const [activeTab, setActiveTab] = useState<'hints' | 'worksheet'>('hints');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("bizcoach_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [worksheetNotes, setWorksheetNotes] = useState<Record<string, string>>({});
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});

  const data: FrameworkContent = getFrameworkData(activeFramework);
  const activeCategory = CATEGORIES.find(c => c.frameworks.includes(activeFramework))?.name || "";

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(`bizcoach_worksheet_${activeFramework}`);
      setWorksheetNotes(savedNotes ? JSON.parse(savedNotes) : {});
    } catch {
      setWorksheetNotes({});
    }

    try {
      const savedChecklist = localStorage.getItem(`bizcoach_checklist_${activeFramework}`);
      setCheckedTasks(savedChecklist ? JSON.parse(savedChecklist) : {});
    } catch {
      setCheckedTasks({});
    }
  }, [activeFramework]);

  const toggleFavorite = (fw: string) => {
    setFavorites(prev => {
      const next = prev.includes(fw) ? prev.filter(f => f !== fw) : [...prev, fw];
      try {
        localStorage.setItem("bizcoach_favorites", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleNoteChange = (bagianKey: string, value: string) => {
    const updated = { ...worksheetNotes, [bagianKey]: value };
    setWorksheetNotes(updated);
    try {
      localStorage.setItem(`bizcoach_worksheet_${activeFramework}`, JSON.stringify(updated));
    } catch {}
  };

  const toggleChecklist = (index: number) => {
    const updated = { ...checkedTasks, [index]: !checkedTasks[index] };
    setCheckedTasks(updated);
    try {
      localStorage.setItem(`bizcoach_checklist_${activeFramework}`, JSON.stringify(updated));
    } catch {}
  };

  const resetChecklist = () => {
    setCheckedTasks({});
    try {
      localStorage.removeItem(`bizcoach_checklist_${activeFramework}`);
    } catch {}
    triggerNotify("Checklist direset");
  };

  const resetWorksheet = () => {
    if (confirm("Apakah Anda yakin ingin mengosongkan lembar kerja draf ini?")) {
      setWorksheetNotes({});
      try {
        localStorage.removeItem(`bizcoach_worksheet_${activeFramework}`);
      } catch {}
      triggerNotify("Lembar kerja dikosongkan");
    }
  };

  const triggerNotify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopySummary = () => {
    const text = [
      `=== ${activeFramework.toUpperCase()} ===`,
      `Kategori: ${activeCategory}`,
      `\n[1. TEORI & KONSEP]`,
      `Deskripsi: ${data.teori.deskripsi}`,
      `Manfaat: ${data.teori.manfaat}`,
      `\n[2. ELEMEN STRUKTUR]`,
      data.layout.elemen.map(e => `- ${e}`).join('\n'),
      `\n[3. PANDUAN PENGISIAN]`,
      data.draft.map(d => `* ${d.bagian}: ${d.hint}`).join('\n'),
      `\n[4. LANGKAH TUTORIAL]`,
      data.tutorial.map((t, idx) => `${idx + 1}. ${t.step}: ${t.desc}`).join('\n'),
      `\n[5. ACTION PLAN]`,
      data.actionPlan.map(a => `[ ] ${a}`).join('\n'),
    ].join('\n');

    navigator.clipboard.writeText(text);
    triggerNotify("Ringkasan lengkap berhasil disalin!");
  };

  const handleDownloadWorksheet = () => {
    const lines = [
      `# LEMBAR KERJA BISNIS: ${activeFramework.toUpperCase()}`,
      `Kategori: ${activeCategory}`,
      `Tanggal: ${new Date().toLocaleDateString('id-ID')}`,
      `\n## Catatan Rencana Kerja:`,
      ...data.draft.map(d => {
        const val = worksheetNotes[d.bagian] || "(Belum diisi)";
        return `\n### ${d.bagian}\n*Panduan: ${d.hint}*\n**Catatan:**\n${val}\n`;
      }),
      `\n## Action Plan Terpilih:`,
      ...data.actionPlan.map((a, i) => `${checkedTasks[i] ? '[x]' : '[ ]'} ${a}`)
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeFramework.replace(/[^a-zA-Z0-9]/g, '_')}_Worksheet.md`;
    a.click();
    URL.revokeObjectURL(url);
    triggerNotify("File lembar kerja diunduh!");
  };

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return CATEGORIES.map(category => {
      const matchingFrameworks = category.frameworks.filter(fw => {
        if (filterMode === 'favorites' && !favorites.includes(fw)) {
          return false;
        }
        if (!q) return true;

        const fwData = getFrameworkData(fw);
        const nameMatch = fw.toLowerCase().includes(q);
        const catMatch = category.name.toLowerCase().includes(q);
        const descMatch = fwData.teori.deskripsi.toLowerCase().includes(q);
        const benefitMatch = fwData.teori.manfaat.toLowerCase().includes(q);

        return nameMatch || catMatch || descMatch || benefitMatch;
      });

      return {
        ...category,
        frameworks: matchingFrameworks
      };
    }).filter(c => c.frameworks.length > 0);
  }, [searchQuery, filterMode, favorites]);

  const totalFilteredCount = useMemo(() => {
    return filteredCategories.reduce((acc, c) => acc + c.frameworks.length, 0);
  }, [filteredCategories]);

  const currentIndex = allFrameworks.indexOf(activeFramework);
  const prevFramework = currentIndex > 0 ? allFrameworks[currentIndex - 1] : null;
  const nextFramework = currentIndex < allFrameworks.length - 1 ? allFrameworks[currentIndex + 1] : null;

  const totalChecklist = data.actionPlan.length;
  const completedChecklist = data.actionPlan.filter((_, idx) => checkedTasks[idx]).length;
  const percentComplete = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  const toggleCategoryCollapse = (catName: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const isCategoryCollapsed = (catName: string) => {
    if (searchQuery.trim().length > 0) return false;
    return !!collapsedCategories[catName];
  };

  const expandAll = () => setCollapsedCategories({});
  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    CATEGORIES.forEach(c => {
      if (c.name !== activeCategory) {
        allCollapsed[c.name] = true;
      }
    });
    setCollapsedCategories(allCollapsed);
  };

  return (
    <AppShell 
      title="100 Framework M.B.A." 
      subtitle="Panduan Eksekusi 100 M.B.A. Frameworks & Lembar Kerja"
      actions={
        <div className="flex items-center gap-1.5 shrink-0">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 text-xs font-medium bg-card/60 text-foreground hover:bg-accent rounded-lg transition-colors border border-border/70 whitespace-nowrap shadow-2xs cursor-pointer"
          >
            <SearchCode size={13} />
            <span className="hidden sm:inline">Pilih Framework</span>
            <span className="sm:hidden">Framework</span>
          </button>
        </div>
      }
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-foreground text-background px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-sm font-medium animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start h-full">
        {/* Sidebar Nav */}
        <div className={`
          fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:static lg:bg-transparent lg:z-auto lg:block lg:w-80 lg:shrink-0
          ${mobileSidebarOpen ? 'block' : 'hidden'}
        `}>
          <div className={`
            absolute inset-y-0 left-0 w-4/5 max-w-sm bg-card border-r border-border shadow-xl flex flex-col transition-transform
            lg:static lg:w-full lg:max-w-none lg:shadow-none lg:bg-transparent lg:border-none lg:flex-none
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
              <h2 className="font-semibold">Daftar Framework</h2>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 hover:bg-muted rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-card lg:rounded-2xl lg:border lg:border-border lg:shadow-sm space-y-4 flex-1 overflow-y-auto lg:max-h-[calc(100vh-8rem)]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Cari framework..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg border border-border">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      filterMode === 'all'
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Semua ({allFrameworks.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('favorites')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                      filterMode === 'favorites'
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Star size={12} fill={filterMode === 'favorites' ? "currentColor" : "none"} />
                    Favorit ({favorites.length})
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">Tidak ada framework ditemukan.</p>
                  </div>
                ) : (
                  filteredCategories.map((category) => {
                    const IconComp = getCategoryIcon(category.name);
                    const isCollapsed = isCategoryCollapsed(category.name);
                    const hasActiveChild = category.frameworks.includes(activeFramework);
                    
                    return (
                      <div key={category.name} className="border-b border-border pb-3 last:border-0">
                        <button
                          onClick={() => toggleCategoryCollapse(category.name)}
                          className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded-lg text-foreground hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-1">
                            <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${hasActiveChild ? 'text-primary bg-primary/10' : 'text-muted-foreground group-hover:text-primary'}`}>
                              <IconComp size={15} />
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-wider truncate ${hasActiveChild ? 'text-primary' : 'text-muted-foreground'}`}>
                              {category.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                              {category.frameworks.length}
                            </span>
                            {isCollapsed ? <ChevronRight size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                          </div>
                        </button>

                        {!isCollapsed && (
                          <div className="space-y-0.5 mt-1 pl-2">
                            {category.frameworks.map((fw) => {
                              const isActive = fw === activeFramework;
                              const isFav = favorites.includes(fw);
                              return (
                                <button
                                  key={fw}
                                  onClick={() => {
                                    setActiveFramework(fw);
                                    setMobileSidebarOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${
                                    isActive 
                                      ? "bg-accent text-accent-foreground border border-border" 
                                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                  }`}
                                >
                                  <span className="truncate pr-2">{fw}</span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {isFav && <Star size={12} className="text-amber-500 fill-amber-500" />}
                                    {isActive && <ArrowRight size={14} className="text-primary" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          {/* Invisible click-away area for mobile sidebar */}
          <div className="flex-1 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full space-y-8">
          
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold tracking-wide uppercase border border-border">
                  {activeCategory}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  #{currentIndex + 1} dari 100
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(activeFramework)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    favorites.includes(activeFramework)
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      : "border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <Star size={14} fill={favorites.includes(activeFramework) ? "currentColor" : "none"} />
                  <span className="hidden sm:inline">{favorites.includes(activeFramework) ? "Favorit" : "Simpan"}</span>
                </button>
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted text-xs font-medium transition-colors"
                >
                  <Copy size={14} />
                  <span className="hidden sm:inline">Salin</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted text-xs font-medium transition-colors"
                >
                  <Printer size={14} />
                  <span className="hidden sm:inline">Cetak</span>
                </button>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              {activeFramework}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Panduan eksekusi menyeluruh, arsitektur visual kanvas, lembar kerja interaktif, dan langkah aksi taktis untuk implementasi nyata bisnis Anda.
            </p>
          </div>

          {/* Section 1: Teori & Konsep Dasar */}
          <section>
            <SectionHeader number="1" title="Teori & Konsep Dasar" icon={BookOpen} />
            <div className="grid md:grid-cols-2 gap-4">
              <Panel>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Apa itu alat ini?
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {data.teori.deskripsi}
                </p>
              </Panel>
              <Panel>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  Manfaat Praktis
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {data.teori.manfaat}
                </p>
              </Panel>
            </div>
          </section>

          {/* Section 2: Desain & Layout Visual */}
          <section>
            <SectionHeader number="2" title="Desain & Layout Visual (UI)" icon={LayoutTemplate} />
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground text-sm">
                Representasi visual standar industri (<span className="font-semibold text-foreground">{data.layout.tipe}</span>):
              </p>
              <span className="text-xs font-semibold px-2.5 py-1 bg-muted text-muted-foreground rounded-md border border-border">
                {data.layout.elemen.length} Komponen
              </span>
            </div>
            <VisualLayoutMockup layout={data.layout} />
          </section>

          {/* Section 3: Draft Konten & Lembar Kerja Interaktif */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <SectionHeader number="3" title="Draft Konten & Lembar Kerja" icon={PenTool} />
              
              <div className="flex items-center p-1 bg-muted/50 rounded-lg border border-border mb-6">
                <button
                  onClick={() => setActiveTab('hints')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === 'hints' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Panduan & Hint
                </button>
                <button
                  onClick={() => setActiveTab('worksheet')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                    activeTab === 'worksheet' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>Lembar Kerja</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                </button>
              </div>
            </div>

            {activeTab === 'hints' ? (
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase w-1/3">Komponen Area</th>
                        <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Hint / Pertanyaan Pemantik</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {data.draft.map((d, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 align-top font-medium text-foreground">
                            {d.bagian}
                          </td>
                          <td className="px-4 py-3 align-top text-muted-foreground">
                            {d.hint}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-accent/50 border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Tersimpan otomatis secara lokal.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadWorksheet}
                      className="px-3 py-1.5 rounded-lg bg-background border border-border hover:bg-muted transition-colors flex items-center gap-1 font-medium"
                    >
                      <Download size={14} />
                      Ekspor MD
                    </button>
                    <button
                      onClick={resetWorksheet}
                      className="px-3 py-1.5 rounded-lg bg-background border border-border text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-1 font-medium"
                    >
                      <RotateCcw size={14} />
                      Reset
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {data.draft.map((d, i) => {
                    const val = worksheetNotes[d.bagian] || "";
                    return (
                      <div key={i} className="border border-border rounded-xl p-5 bg-card focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                        <div className="flex items-baseline justify-between gap-2 mb-2">
                          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-muted text-muted-foreground text-xs flex items-center justify-center font-bold">
                              {i + 1}
                            </span>
                            {d.bagian}
                          </label>
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            {val.length} kar
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 bg-muted/50 p-2.5 rounded-lg border border-border/50">
                          💡 {d.hint}
                        </p>
                        <textarea
                          rows={3}
                          placeholder={`Tulis rencana untuk ${d.bagian}...`}
                          value={val}
                          onChange={(e) => handleNoteChange(d.bagian, e.target.value)}
                          className="w-full text-sm p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-transparent text-foreground placeholder:text-muted-foreground resize-y"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Section 4: Tutorial Eksekusi */}
          <section>
            <SectionHeader number="4" title="Tutorial Eksekusi" icon={ListOrdered} />
            <div className="space-y-6">
              {data.tutorial.map((tut, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-accent text-foreground flex items-center justify-center font-bold border border-border z-10 text-sm">
                      {i + 1}
                    </div>
                    {i !== data.tutorial.length - 1 && (
                      <div className="w-px h-full bg-border mt-2 -mb-2"></div>
                    )}
                  </div>
                  <div className="pt-1 pb-6 flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-1">{tut.step}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{tut.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Action Plan & Interactive Checklist */}
          <section>
            <div className="bg-foreground rounded-2xl p-6 md:p-8 text-background shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <CheckSquare size={160} />
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 relative z-10">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-background">
                  <Target className="text-primary" />
                  Action Plan & Takeaways
                </h2>
                
                <div className="flex items-center gap-3 bg-background/10 px-3.5 py-1.5 rounded-full text-xs font-medium border border-background/20 text-background">
                  <div className="w-16 bg-background/20 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${percentComplete}%` }}
                    ></div>
                  </div>
                  <span>{percentComplete}% Selesai</span>
                </div>
              </div>

              <p className="text-background/80 text-sm mb-6 max-w-2xl leading-relaxed relative z-10">
                Langkah taktis yang wajib dieksekusi. Centang tugas setelah selesai untuk melacak progres implementasi Anda.
              </p>

              {percentComplete === 100 && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 flex items-center justify-between gap-3 text-sm relative z-10 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-400 shrink-0" size={18} />
                    <span className="font-medium">Luar biasa! Semua rencana aksi telah tuntas!</span>
                  </div>
                  <button onClick={resetChecklist} className="text-xs underline hover:text-emerald-100">
                    Reset
                  </button>
                </div>
              )}

              <div className="space-y-2 relative z-10">
                {data.actionPlan.map((plan, i) => {
                  const isChecked = !!checkedTasks[i];
                  return (
                    <div
                      key={i}
                      onClick={() => toggleChecklist(i)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked 
                          ? "bg-background/20 border-background/30 text-background/50"
                          : "bg-background/5 border-background/10 hover:bg-background/10 text-background"
                      }`}
                    >
                      <div className="pt-0.5 shrink-0">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isChecked ? "bg-primary border-primary text-primary-foreground" : "border-background/30"
                        }`}>
                          {isChecked && <Check size={14} strokeWidth={3} />}
                        </div>
                      </div>
                      <span className={`text-sm font-medium leading-relaxed ${isChecked ? "line-through" : ""}`}>
                        {plan}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Bottom Next / Prev Navigation */}
          <div className="border-t border-border pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevFramework ? (
              <button
                onClick={() => {
                  setActiveFramework(prevFramework);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted text-left transition-colors group flex items-center gap-3"
              >
                <ArrowLeft size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">Sebelumnya</div>
                  <div className="text-sm font-bold text-foreground">{prevFramework}</div>
                </div>
              </button>
            ) : <div />}

            {nextFramework && (
              <button
                onClick={() => {
                  setActiveFramework(nextFramework);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-right transition-colors group flex items-center justify-between sm:justify-end gap-3"
              >
                <div>
                  <div className="text-[10px] text-primary-foreground/70 uppercase font-semibold">Berikutnya</div>
                  <div className="text-sm font-bold">{nextFramework}</div>
                </div>
                <ArrowRight size={16} className="text-primary-foreground/70 group-hover:text-primary-foreground transition-colors" />
              </button>
            )}
          </div>
          
        </div>
      </div>
    </AppShell>
  );
}
