import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  FileText,
  ArrowLeft,
  Save,
  Sparkles,
  Code2,
  Grid,
  List,
  Calendar,
  Search,
  Trash2,
  Pin,
  Download,
  Upload,
  X,
  Check,
  Copy,
  Clock,
  ExternalLink,
} from "lucide-react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export interface NoteItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  category: string;
  isPinned?: boolean;
  tags?: string[];
  type?: "note" | "doc";
}

const INITIAL_NOTES: NoteItem[] = [
  {
    id: "1",
    title: "Q3 Product Roadmap & Deliverables",
    excerpt:
      "Perencanaan fitur utama kuartal ini mencakup integrasi editor baru, sinkronisasi cloud, dan analitik performa proyek.",
    content: `# Q3 Product Roadmap\n\n## Fokus Utama\n1. Integrasi Editor Interaktif\n2. Sinkronisasi Data Real-time\n3. Modul Ekspor Laporan Otomatis\n\n## Milestone\n- Minggu 1-2: Audit UX & Arsitektur\n- Minggu 3-6: Implementasi Prototipe\n- Minggu 7-8: Uji Keandalan & Rilis`,
    date: "2026-03-01",
    category: "Product",
    isPinned: true,
    tags: ["Roadmap", "Product", "Q3"],
    type: "note",
  },
  {
    id: "2",
    title: "Notulen Rapat: Design System & Branding",
    excerpt:
      "Pembahasan pembaruan tipografi, palet warna high-contrast, dan standarisasi komponen antarmuka konsultan.",
    content: `# Notulen Rapat: Design System Sync\n\n**Waktu**: 09:30 WIB\n**Peserta**: Tim Desain & Lead Engineer\n\n## Poin Kesepakatan:\n- Mengadopsi skala tipografi rasio 1.25\n- Menghapus gradien jenuh demi kontras WCAG AA\n- Penggunaan border-radius konsisten 12-16px`,
    date: "2026-03-03",
    category: "Meetings",
    isPinned: true,
    tags: ["Design", "Notulen", "UI/UX"],
    type: "note",
  },
  {
    id: "3",
    title: "Strategi Akuisisi Klien Korporasi 2026",
    excerpt:
      "Rencana target sasaran untuk menjangkau enterprise SME melalui webinar konsultansi kepemimpinan dan audit rantai pasok gratis.",
    content: `# Strategi Enterprise 2026\n\n## Pilar Pertumbuhan\n- Account-Based Marketing (ABM)\n- Diagnostic Free Session (1 Jam)\n- Rekomendasi Aliansi Strategis Asosiasi Industri`,
    date: "2026-02-28",
    category: "Marketing",
    isPinned: false,
    tags: ["B2B", "Growth", "Client"],
    type: "note",
  },
  {
    id: "4",
    title: "Panduan Onboarding Konsultan & Standar Kerja (SOP)",
    excerpt:
      "Dokumentasi baku alur kerja, kerahasiaan data klien (NDA), etika komunikasi profesional, dan susunan berkas kerja.",
    content: `# SOP Onboarding Konsultan\n\n## 1. Keamanan & Kerahasiaan Data\nSetiap analis wajib menandatangani NDA dan menerapkan autentikasi dua faktor pada seluruh akses penyimpanan berkas kerja.\n\n## 2. Standar Presentasi Klien\nGunakan template baku Client OS, font kontras tinggi, dan ringkasan eksekutif maksimal 1 halaman pada pembuka laporan.`,
    date: "2026-02-20",
    category: "Docs & SOP",
    isPinned: false,
    tags: ["SOP", "Onboarding", "Internal"],
    type: "doc",
  },
  {
    id: "5",
    title: "Panduan Teknis Arsitektur & Keamanan Basis Data",
    excerpt:
      "Prinsip pemisahan data per sesi, enkripsi lokal, validasi masukan, dan pencegahan duplikasi catatan kerja.",
    content: `# Panduan Arsitektur & Keamanan\n\n- Penyimpanan persisten lokal terlindungi\n- Sanitasi input dan pencegahan XSS\n- Format ekspor terenkripsi dan kompatibel dengan format standar JSON & Markdown`,
    date: "2026-02-15",
    category: "Engineering",
    isPinned: false,
    tags: ["Security", "Tech", "Architecture"],
    type: "doc",
  },
];

const STORAGE_KEY = "wira_notes_docs_v2";

export function NotesView() {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("Catatan Baru");
  const [noteCategory, setNoteCategory] = useState("Product");
  const [noteContent, setNoteContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editorType, setEditorType] = useState<"custom" | "blocknote">("custom");
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Mulai menulis catatan dokumen kerja Anda di sini...",
      },
    ],
  });

  const handleCreateNew = () => {
    setNoteTitle("Catatan Baru");
    setNoteCategory("Product");
    setNoteContent("");
    setActiveNoteId("new");
  };

  const handleOpenNote = (note: NoteItem) => {
    setNoteTitle(note.title);
    setNoteCategory(note.category);
    setNoteContent(note.content || note.excerpt || "");
    setActiveNoteId(note.id);
  };

  const handleSave = () => {
    setIsSaving(true);
    const today = new Date().toISOString().slice(0, 10);
    const excerpt =
      noteContent.slice(0, 140).replace(/[#*`_]/g, "").trim() || "Tidak ada ringkasan.";

    if (activeNoteId === "new") {
      const newNote: NoteItem = {
        id: `note-${Date.now()}`,
        title: noteTitle.trim() || "Untitled Note",
        excerpt,
        content: noteContent,
        date: today,
        category: noteCategory,
        isPinned: false,
        tags: [noteCategory],
        type: noteCategory === "Docs & SOP" ? "doc" : "note",
      };
      setNotes((prev) => [newNote, ...prev]);
      setActiveNoteId(newNote.id);
    } else {
      setNotes((prev) =>
        prev.map((item) =>
          item.id === activeNoteId
            ? {
                ...item,
                title: noteTitle.trim() || item.title,
                category: noteCategory,
                content: noteContent,
                excerpt,
                date: today,
              }
            : item
        )
      );
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 300);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Hapus dokumen ini dari daftar?")) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
    }
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item))
    );
  };

  const handleCopy = (note: NoteItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `# ${note.title}\n\n${note.content || note.excerpt}`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDownloadMarkdown = (note: NoteItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const content = note.content || `# ${note.title}\n\n${note.excerpt}`;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `notes_docs_backup_${new Date().toISOString().slice(0, 10)}.json`;
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
          setNotes(parsed);
        }
      } catch {
        alert("Berkas JSON tidak valid.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const categories = ["Semua", "Product", "Meetings", "Marketing", "Docs & SOP", "Engineering"];

  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        if (selectedCategory !== "Semua" && n.category !== selectedCategory) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.excerpt.toLowerCase().includes(q) ||
          (n.content && n.content.toLowerCase().includes(q)) ||
          (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))
        );
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [notes, selectedCategory, searchQuery]);

  // ACTIVE WRITING CANVAS
  if (activeNoteId) {
    return (
      <div className="max-w-4xl mx-auto w-full py-2 space-y-4">
        {/* Sleek Action Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <button
            onClick={() => setActiveNoteId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
          >
            <ArrowLeft size={15} />
            <span>Kembali ke Dokumen</span>
          </button>

          <div className="flex items-center gap-2">
            <select
              value={noteCategory}
              onChange={(e) => setNoteCategory(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground outline-none"
            >
              <option value="Product">Product</option>
              <option value="Meetings">Meetings</option>
              <option value="Marketing">Marketing</option>
              <option value="Docs & SOP">Docs & SOP</option>
              <option value="Engineering">Engineering</option>
            </select>

            <div className="flex items-center bg-muted/60 p-0.5 rounded-lg text-xs font-medium border border-border">
              <button
                onClick={() => setEditorType("custom")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  editorType === "custom"
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Markdown
              </button>
              <button
                onClick={() => setEditorType("blocknote")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  editorType === "blocknote"
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Block Canvas
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-3.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-60"
            >
              {saveSuccess ? (
                <>
                  <Check size={14} />
                  <span>Tersimpan</span>
                </>
              ) : isSaving ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <Save size={14} />
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Note Title Input */}
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Ketik judul dokumen..."
          className="text-2xl font-bold tracking-tight text-foreground w-full border-none outline-none bg-transparent placeholder:text-muted-foreground/40 pt-2"
        />

        {/* Editor Body */}
        {editorType === "blocknote" ? (
          <div className="min-h-[480px] rounded-xl border border-border bg-card p-4">
            <BlockNoteView editor={editor} theme="light" />
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Tuliskan isi dokumen, draf proposal, atau notulen rapat di sini (mendukung Markdown)..."
              rows={20}
              className="w-full p-4 rounded-xl border border-border bg-card text-foreground font-mono text-sm leading-relaxed outline-none focus:ring-1 focus:ring-primary/40 resize-none min-h-[460px]"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>
                {noteContent.length} karakter · {noteContent.split(/\s+/).filter(Boolean).length} kata
              </span>
              <span>
                Estimasi baca: ~{Math.max(1, Math.ceil(noteContent.split(/\s+/).filter(Boolean).length / 200))} menit
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MAIN OVERVIEW
  return (
    <div className="max-w-6xl mx-auto w-full space-y-4 py-1">
      {/* Clean, Unified Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2 border-b border-border/80">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, tagar, atau teks dokumen..."
            className="w-full h-9 pl-9 pr-8 text-xs bg-card border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* View Toggle */}
          <div className="flex items-center bg-card border border-border p-0.5 rounded-lg">
            <button
              onClick={() => setLayoutMode("grid")}
              className={cn(
                "p-1.5 rounded text-xs transition-colors",
                layoutMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Tampilan Grid"
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setLayoutMode("list")}
              className={cn(
                "p-1.5 rounded text-xs transition-colors",
                layoutMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Tampilan List"
            >
              <List size={14} />
            </button>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors">
            <Upload size={13} />
            <span>Impor</span>
            <input type="file" accept=".json" onChange={importJSON} className="hidden" />
          </label>

          <button
            onClick={exportAllJSON}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors"
          >
            <Download size={13} />
            <span>Ekspor</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>Dokumen Baru</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors border",
              selectedCategory === cat
                ? "border-primary/40 bg-primary/10 text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            {cat}
            {cat === "Semua" && ` (${notes.length})`}
          </button>
        ))}
      </div>

      {/* Content Presentation */}
      {filteredNotes.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border rounded-xl bg-card/40">
          <FileText className="mx-auto size-8 text-muted-foreground/60 mb-2" />
          <h3 className="text-sm font-semibold text-foreground">Tidak Ada Dokumen</h3>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
            {searchQuery
              ? `Tidak ditemukan hasil untuk "${searchQuery}". Coba kata kunci lain.`
              : "Belum ada dokumen dalam kategori ini. Buat dokumen baru sekarang."}
          </p>
          <button
            onClick={handleCreateNew}
            className="mt-4 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90"
          >
            <Plus size={13} />
            <span>Buat Dokumen</span>
          </button>
        </div>
      ) : layoutMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                onClick={() => handleOpenNote(note)}
                className={cn(
                  "group relative flex flex-col justify-between p-4 rounded-xl border bg-card hover:border-foreground/20 hover:shadow-xs transition-all cursor-pointer",
                  note.isPinned ? "border-primary/30 bg-primary/[0.015]" : "border-border"
                )}
              >
                <div>
                  {/* Top line: Category and Quick Actions */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {note.category}
                    </span>

                    <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleTogglePin(note.id, e)}
                        className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                        title={note.isPinned ? "Lepas pin" : "Sematkan"}
                      >
                        <Pin size={13} className={note.isPinned ? "fill-primary text-primary" : ""} />
                      </button>
                      <button
                        onClick={(e) => handleCopy(note, e)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                        title="Salin isi"
                      >
                        {copiedId === note.id ? (
                          <Check size={13} className="text-emerald-500" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                      <button
                        onClick={(e) => handleDownloadMarkdown(note, e)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                        title="Unduh Markdown"
                      >
                        <Download size={13} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(note.id, e)}
                        className="p-1 rounded text-muted-foreground hover:text-rose-500 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {note.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mt-1.5">
                    {note.excerpt}
                  </p>
                </div>

                {/* Footer info */}
                <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {note.date}
                  </span>
                  {note.isPinned && (
                    <span className="text-[10px] font-semibold text-primary">Disematkan</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onClick={() => handleOpenNote(note)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-xl border bg-card hover:border-foreground/20 transition-all cursor-pointer",
                  note.isPinned ? "border-primary/30 bg-primary/[0.015]" : "border-border"
                )}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileText size={16} className="text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-xs text-foreground truncate group-hover:text-primary transition-colors">
                        {note.title}
                      </h3>
                      {note.isPinned && (
                        <span className="text-[10px] font-semibold text-primary shrink-0">
                          [Pin]
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{note.excerpt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded hidden sm:inline">
                    {note.category}
                  </span>
                  <span className="text-[11px] text-muted-foreground hidden md:inline">
                    {note.date}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleTogglePin(note.id, e)}
                      className="p-1 rounded text-muted-foreground hover:text-primary"
                    >
                      <Pin size={13} className={note.isPinned ? "fill-primary text-primary" : ""} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(note.id, e)}
                      className="p-1 rounded text-muted-foreground hover:text-rose-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
