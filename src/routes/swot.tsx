import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  BookOpen, 
  LayoutTemplate, 
  PenTool, 
  ListOrdered, 
  Target, 
  Lightbulb, 
  CheckSquare, 
  Check, 
  CheckCircle2, 
  Copy, 
  Printer, 
  Download, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import { AppShell } from "@/app/app-shell";
import { Panel } from "@/app/ui-bits";
import { SWOTMatrix } from "@/features/matriks/swot-matrix";
import { getFrameworkData, FrameworkContent } from "@/frameworkData";

export const Route = createFileRoute("/swot")({
  component: SWOTPage,
});

const SectionHeader = ({ number, title, icon: Icon }: { number: string; title: string; icon: any }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
      {number}
    </div>
    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
      {title}
    </h2>
  </div>
);

function SWOTPage() {
  const swotData: FrameworkContent = getFrameworkData("SWOT Analysis");

  const [activeTab, setActiveTab] = useState<'hints' | 'worksheet'>('hints');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [worksheetNotes, setWorksheetNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("bizcoach_worksheet_SWOT Analysis");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem("bizcoach_checklist_SWOT Analysis");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const triggerNotify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNoteChange = (bagianKey: string, value: string) => {
    const updated = { ...worksheetNotes, [bagianKey]: value };
    setWorksheetNotes(updated);
    try {
      localStorage.setItem("bizcoach_worksheet_SWOT Analysis", JSON.stringify(updated));
    } catch {}
  };

  const toggleChecklist = (index: number) => {
    const updated = { ...checkedTasks, [index]: !checkedTasks[index] };
    setCheckedTasks(updated);
    try {
      localStorage.setItem("bizcoach_checklist_SWOT Analysis", JSON.stringify(updated));
    } catch {}
  };

  const resetWorksheet = () => {
    if (window.confirm("Hapus semua catatan lembar kerja SWOT?")) {
      setWorksheetNotes({});
      localStorage.removeItem("bizcoach_worksheet_SWOT Analysis");
      triggerNotify("Lembar kerja di-reset!");
    }
  };

  const resetChecklist = () => {
    setCheckedTasks({});
    localStorage.removeItem("bizcoach_checklist_SWOT Analysis");
    triggerNotify("Checklist action plan di-reset!");
  };

  const handleCopySummary = () => {
    const text = `SWOT ANALYSIS - Strategic Planning
Teori: ${swotData.teori.deskripsi}
Manfaat: ${swotData.teori.manfaat}

Draft Area:
${swotData.draft.map(d => `- ${d.bagian}: ${d.hint}`).join('\n')}

Action Plan:
${swotData.actionPlan.map(a => `[ ] ${a}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    triggerNotify("Ringkasan SWOT disalin ke clipboard!");
  };

  const handleDownloadWorksheet = () => {
    const lines = [
      `# LEMBAR KERJA BISNIS: SWOT ANALYSIS`,
      `Kategori: Strategic Management`,
      `Tanggal: ${new Date().toLocaleDateString('id-ID')}`,
      `\n## Catatan Rencana Kerja:`,
      ...swotData.draft.map(d => {
        const val = worksheetNotes[d.bagian] || "(Belum diisi)";
        return `\n### ${d.bagian}\n*Panduan: ${d.hint}*\n**Catatan:**\n${val}\n`;
      }),
      `\n## Action Plan Terpilih:`,
      ...swotData.actionPlan.map((a, i) => `${checkedTasks[i] ? '[x]' : '[ ]'} ${a}`)
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SWOT_Analysis_Worksheet.md`;
    a.click();
    URL.revokeObjectURL(url);
    triggerNotify("File lembar kerja diunduh!");
  };

  const totalChecklist = swotData.actionPlan.length;
  const completedChecklist = swotData.actionPlan.filter((_, idx) => checkedTasks[idx]).length;
  const percentComplete = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  return (
    <AppShell 
      title="SWOT Analysis" 
      subtitle="Matriks Perencanaan Strategis & Panduan Eksekusi Lengkap"
      actions={
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-lg border border-border/70 bg-card/60 text-foreground hover:bg-accent text-xs font-medium transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
            title="Salin Ringkasan SWOT"
          >
            <Copy size={13} />
            <span className="hidden sm:inline">Salin</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-lg border border-border/70 bg-card/60 text-foreground hover:bg-accent text-xs font-medium transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
            title="Cetak Matriks SWOT"
          >
            <Printer size={13} />
            <span className="hidden sm:inline">Cetak</span>
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

      <div className="w-full space-y-10">
        {/* Kanvas Matriks Interaktif (Komponen Independen Asli) */}
        <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
          <SWOTMatrix />
        </section>

        {/* Bagian 1: Teori & Konsep Dasar (Dipindahkan dari 100 Framework) */}
        <section>
          <SectionHeader number="1" title="Teori & Konsep Dasar" icon={BookOpen} />
          <div className="grid md:grid-cols-2 gap-4">
            <Panel>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                Apa itu alat ini?
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {swotData.teori.deskripsi}
              </p>
            </Panel>
            <Panel>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                Manfaat Praktis
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {swotData.teori.manfaat}
              </p>
            </Panel>
          </div>
        </section>

        {/* Bagian 2: Desain & Layout Visual (UI) (Dipindahkan dari 100 Framework) */}
        <section>
          <SectionHeader number="2" title="Desain & Layout Visual (UI)" icon={LayoutTemplate} />
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground text-sm">
              Representasi visual standar industri (<span className="font-semibold text-foreground">{swotData.layout.tipe}</span>):
            </p>
            <span className="text-xs font-semibold px-2.5 py-1 bg-muted text-muted-foreground rounded-md border border-border">
              {swotData.layout.elemen.length} Komponen Kuadran
            </span>
          </div>
          <div className="w-full bg-accent/20 rounded-xl border border-border p-8 flex flex-col items-center justify-center min-h-[200px]">
            <LayoutTemplate className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <div className="text-center">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                {swotData.layout.tipe}
              </h4>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-lg">
                {swotData.layout.elemen.map((el: string, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium text-muted-foreground shadow-sm">
                    {el}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bagian 3: Draft Konten & Lembar Kerja Interaktif (Dipindahkan dari 100 Framework) */}
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
                    {swotData.draft.map((d, i) => (
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
                {swotData.draft.map((d, i) => {
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

        {/* Bagian 4: Tutorial Eksekusi (Dipindahkan dari 100 Framework) */}
        <section>
          <SectionHeader number="4" title="Tutorial Eksekusi" icon={ListOrdered} />
          <div className="space-y-6">
            {swotData.tutorial.map((tut, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-accent text-foreground flex items-center justify-center font-bold border border-border z-10 text-sm">
                    {i + 1}
                  </div>
                  {i !== swotData.tutorial.length - 1 && (
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

        {/* Bagian 5: Action Plan & Interactive Checklist (Dipindahkan dari 100 Framework) */}
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
              {swotData.actionPlan.map((plan, i) => {
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
      </div>
    </AppShell>
  );
}

