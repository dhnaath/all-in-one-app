import { useState, useEffect, useMemo } from "react";
import {
  Bookmark,
  Search,
  Plus,
  Star,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  Download,
  Upload,
  Globe,
  Grid,
  List,
  X,
  Tag,
  Share2,
  ArrowUpDown,
  BookOpen,
  FileText,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export type BookmarkCategory =
  | "Klien & Pasar"
  | "Tools & Utilitas"
  | "Riset & Laporan"
  | "Regulasi & Standar"
  | "Desain & Template"
  | "AI & Teknologi";

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: BookmarkCategory;
  tags: string[];
  isFavorite?: boolean;
  notes?: string;
  createdAt: string;
}

const STORAGE_KEY = "wira_bookmarks_hub_v2";

const INITIAL_BOOKMARKS: BookmarkItem[] = [
  {
    id: "bm-1",
    title: "Bursa Efek Indonesia (IDX) — Keterbukaan Informasi & Laporan Keuangan",
    url: "https://www.idx.co.id/id/perusahaan-tercatat/laporan-keuangan-dan-tahunan/",
    description:
      "Akses primer untuk mengunduh laporan keuangan teraudit, keterbukaan informasi emiten, prospektus IPO, dan rasio historis pasar modal.",
    category: "Klien & Pasar",
    tags: ["IDX", "Pasar Modal", "Laporan Keuangan", "Valuasi"],
    isFavorite: true,
    notes: "Rujukan utama analisis komparatif multiplier EV/EBITDA dan Price-to-Book industri perbankan.",
    createdAt: "2026-03-01",
  },
  {
    id: "bm-2",
    title: "McKinsey Global Institute — Riset Transformasi AI & Masa Depan Pekerjaan",
    url: "https://www.mckinsey.com/mgi/overview",
    description:
      "Publikasi riset analitik mengenai dampak adopsi model bahasa besar (LLM), produktivitas sektoral di Asia Tenggara, dan peta jalan digitalisasi.",
    category: "Riset & Laporan",
    tags: ["McKinsey", "AI", "Strategi", "Produktivitas"],
    isFavorite: true,
    notes: "Bab 4 tentang otomatisasi operasional sering dikutip dalam proposal konsultan.",
    createdAt: "2026-03-03",
  },
  {
    id: "bm-3",
    title: "JDIH Kementerian BUMN — Regulasi Tata Kelola Perusahaan (GCG)",
    url: "https://jdih.bumn.go.id/",
    description:
      "Jaringan dokumentasi dan informasi hukum Kementerian BUMN mencakup peraturan menteri tentang Dewan Pengawas, Komite Audit, dan manajemen risiko.",
    category: "Regulasi & Standar",
    tags: ["BUMN", "GCG", "Regulasi", "Hukum", "Kepatuhan"],
    isFavorite: true,
    notes: "Gunakan Peraturan Menteri BUMN No. PER-2/MBU/03/2023 untuk audit tata kelola.",
    createdAt: "2026-03-05",
  },
  {
    id: "bm-4",
    title: "Badan Pusat Statistik (BPS) — Portal Data Agregat & Indikator Makro",
    url: "https://www.bps.go.id/",
    description:
      "Statistik pertumbuhan PDB per provinsi, indeks harga konsumen (inflasi), neraca ekspor-impor komoditas, dan demografi ketenagakerjaan.",
    category: "Klien & Pasar",
    tags: ["BPS", "Makroekonomi", "Inflasi", "Demografi", "PDB"],
    isFavorite: false,
    notes: "Data PDB kuartalan diperbarui setiap minggu pertama Februari, Mei, Agustus, dan November.",
    createdAt: "2026-03-07",
  },
  {
    id: "bm-5",
    title: "OECD iLibrary — Economic Outlook & Policy Recommendations 2026",
    url: "https://www.oecd-ilibrary.org/economics/oecd-economic-outlook_16097408",
    description:
      "Prospek komparatif ekonomi global, suku bunga bank sentral dunia, dan panduan mitigasi risiko rantai pasok manufaktur.",
    category: "Riset & Laporan",
    tags: ["OECD", "Global Economy", "Policy", "Fiskal"],
    isFavorite: false,
    notes: "Sangat baik untuk dasar penulisan whitepaper outlook industri.",
    createdAt: "2026-03-08",
  },
  {
    id: "bm-6",
    title: "Otoritas Jasa Keuangan (OJK) — Master Regulasi Keuangan & Perbankan",
    url: "https://www.ojk.go.id/id/regulasi/Pages/POJK-Perbankan.aspx",
    description:
      "Peraturan Otoritas Jasa Keuangan (POJK) dan Surat Edaran OJK terkini seputar permodalan minimum, credit risk, dan inovasi fintech.",
    category: "Regulasi & Standar",
    tags: ["OJK", "POJK", "Fintech", "Perbankan", "Permodalan"],
    isFavorite: true,
    notes: "Rujukan penting untuk due diligence kepatuhan lembaga keuangan non-bank.",
    createdAt: "2026-03-10",
  },
  {
    id: "bm-7",
    title: "Google Cloud Architecture Center — Reference Architectures & Best Practices",
    url: "https://cloud.google.com/architecture",
    description:
      "Panduan arsitektur sistem enterprise, blueprint data pipeline, migrasi hybrid cloud, dan protokol keamanan data berstandar global.",
    category: "AI & Teknologi",
    tags: ["Cloud", "Google Cloud", "Arsitektur", "Security"],
    isFavorite: false,
    notes: "Template diagram arsitektur dapat diunduh langsung untuk slide presentasi teknis.",
    createdAt: "2026-03-12",
  },
  {
    id: "bm-8",
    title: "Figma Enterprise Design Systems Directory",
    url: "https://www.figma.com/community/design-systems",
    description:
      "Koleksi sistem desain resmi perusahaan terkemuka (Shopify Polaris, Atlassian, IBM Carbon) sebagai acuan standardisasi antarmuka.",
    category: "Desain & Template",
    tags: ["Design System", "Figma", "UI/UX", "Enterprise"],
    isFavorite: false,
    notes: "Gunakan pedoman token warna dan microcopy untuk penyelarasan UI Client OS.",
    createdAt: "2026-03-14",
  },
  {
    id: "bm-9",
    title: "World Economic Forum — Global Competitiveness & ESG Benchmark",
    url: "https://www.weforum.org/reports",
    description:
      "Laporan komparasi indeks daya saing global, kerangka kerja pengungkapan emisi karbon (Scope 1-3), dan transisi energi hijau.",
    category: "Riset & Laporan",
    tags: ["ESG", "WEF", "Sustainability", "Daya Saing"],
    isFavorite: false,
    notes: "Digunakan pada bab Keberlanjutan Laporan Tahunan Klien.",
    createdAt: "2026-03-16",
  },
  {
    id: "bm-10",
    title: "Harvard Business Review — Corporate Strategy Case Studies",
    url: "https://hbr.org/topic/corporate-strategy",
    description:
      "Kumpulan artikel pemikiran mutakhir, studi kasus eksekusi strategi M&A, dan kepemimpinan adaptif dalam situasi krisis.",
    category: "Tools & Utilitas",
    tags: ["HBR", "Studi Kasus", "M&A", "Kepemimpinan"],
    isFavorite: true,
    notes: "Arsip kasus restrukturisasi konglomerasi Asia sangat relevan untuk advisory.",
    createdAt: "2026-03-18",
  },
];

const CATEGORIES: { label: BookmarkCategory; color: string }[] = [
  { label: "Klien & Pasar", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { label: "Tools & Utilitas", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { label: "Riset & Laporan", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  { label: "Regulasi & Standar", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { label: "Desain & Template", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
  { label: "AI & Teknologi", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20" },
];

export function BookmarksView() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_BOOKMARKS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "title" | "favorite">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<BookmarkItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState<BookmarkCategory>("Klien & Pasar");
  const [formTags, setFormTags] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formFavorite, setFormFavorite] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  // Extract domain name cleanly
  const extractDomain = (urlStr: string) => {
    try {
      const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return urlStr.replace(/^https?:\/\//, "").split("/")[0] || "link";
    }
  };

  // Popular tags extraction
  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    bookmarks.forEach((b) => {
      b.tags.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [bookmarks]);

  // Filtered & sorted bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks
      .filter((b) => {
        if (selectedCategory !== "Semua" && b.category !== selectedCategory) return false;
        if (onlyFavorites && !b.isFavorite) return false;
        if (selectedTag && !b.tags.includes(selectedTag)) return false;

        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const domain = extractDomain(b.url).toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          domain.includes(q) ||
          (b.notes && b.notes.toLowerCase().includes(q)) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "favorite") {
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return a.title.localeCompare(b.title);
        }
        // newest
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });
  }, [bookmarks, selectedCategory, onlyFavorites, selectedTag, searchQuery, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const total = bookmarks.length;
    const favorites = bookmarks.filter((b) => b.isFavorite).length;
    const categoriesCount = new Set(bookmarks.map((b) => b.category)).size;
    const domainsCount = new Set(bookmarks.map((b) => extractDomain(b.url))).size;
    return { total, favorites, categoriesCount, domainsCount };
  }, [bookmarks]);

  // Handlers
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm("Hapus bookmark ini dari koleksi?")) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleCopyLink = (url: string, id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openCreateModal = () => {
    setEditingBookmark(null);
    setFormTitle("");
    setFormUrl("");
    setFormDesc("");
    setFormCategory("Klien & Pasar");
    setFormTags("");
    setFormNotes("");
    setFormFavorite(false);
    setIsFormOpen(true);
  };

  const openEditModal = (bm: BookmarkItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingBookmark(bm);
    setFormTitle(bm.title);
    setFormUrl(bm.url);
    setFormDesc(bm.description);
    setFormCategory(bm.category);
    setFormTags(bm.tags.join(", "));
    setFormNotes(bm.notes || "");
    setFormFavorite(!!bm.isFavorite);
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;

    // Normalize URL
    let cleanUrl = formUrl.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: BookmarkItem = {
      id: editingBookmark ? editingBookmark.id : `bm-${Date.now()}`,
      title: formTitle.trim(),
      url: cleanUrl,
      description: formDesc.trim(),
      category: formCategory,
      tags: tagsArray.length > 0 ? tagsArray : ["Referensi"],
      isFavorite: formFavorite,
      notes: formNotes.trim(),
      createdAt: editingBookmark?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (editingBookmark) {
      setBookmarks((prev) => prev.map((b) => (b.id === editingBookmark.id ? payload : b)));
    } else {
      setBookmarks((prev) => [payload, ...prev]);
    }

    setIsFormOpen(false);
    setEditingBookmark(null);
  };

  // Export to Netscape Bookmark HTML format (standard for browser import)
  const handleExportHTML = () => {
    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks Client OS</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;
    bookmarks.forEach((b) => {
      html += `    <DT><A HREF="${b.url}" ADD_DATE="${Math.floor(Date.now() / 1000)}" TAGS="${b.tags.join(",")}">${b.title}</A>\n`;
      if (b.description) {
        html += `    <DD>${b.description}\n`;
      }
    });
    html += `</DL><p>\n`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookmarks-clientos-${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `bookmarks-backup-${new Date().toISOString().split("T")[0]}.json`);
    dl.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setBookmarks(parsed);
          alert(`Berhasil mengimpor ${parsed.length} bookmark.`);
        }
      } catch {
        alert("Gagal membaca berkas JSON. Format tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Metric Counters Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="text-xs font-medium text-muted-foreground">Total Tautan</div>
          <div className="text-2xl font-bold tracking-tight text-foreground mt-1">{stats.total}</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400">Tautan Favorit</div>
          <div className="text-2xl font-bold tracking-tight text-foreground mt-1">{stats.favorites}</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Kategori Aktif</div>
          <div className="text-2xl font-bold tracking-tight text-foreground mt-1">{stats.categoriesCount}</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Domain Terkurasi</div>
          <div className="text-2xl font-bold tracking-tight text-foreground mt-1">{stats.domainsCount}</div>
        </div>
      </div>

      {/* Action & Filter Toolbar */}
      <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari judul, URL, domain, catatan, atau tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Controls & CTA buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Only Favorites toggle */}
            <button
              onClick={() => setOnlyFavorites((prev) => !prev)}
              className={cn(
                "px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors",
                onlyFavorites
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                  : "border-border bg-background hover:bg-muted text-muted-foreground"
              )}
            >
              <Star className={cn("size-3.5", onlyFavorites ? "fill-current" : "")} />
              <span>Favorit</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "title" | "favorite")}
                className="px-3 py-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="newest">Terbaru</option>
                <option value="title">Judul (A-Z)</option>
                <option value="favorite">Prioritas Favorit</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                  viewMode === "grid" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                )}
                title="Tampilan Grid Kartu"
              >
                <Grid className="size-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                  viewMode === "list" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                )}
                title="Tampilan Daftar Ringkas"
              >
                <List className="size-4" />
                <span className="hidden sm:inline">Daftar</span>
              </button>
            </div>

            {/* Export HTML (Browser Bookmarks) */}
            <button
              onClick={handleExportHTML}
              className="px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground flex items-center gap-1.5 transition-colors"
              title="Ekspor Bookmark Browser (.html)"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span className="hidden md:inline">Ekspor HTML</span>
            </button>

            <label className="cursor-pointer px-2.5 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground flex items-center gap-1.5 transition-colors" title="Impor Berkas JSON">
              <Upload className="size-3.5 text-muted-foreground" />
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleExportJSON}
              className="px-2.5 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground flex items-center gap-1.5 transition-colors"
              title="Cadangkan Berkas JSON"
            >
              <Share2 className="size-3.5 text-muted-foreground" />
            </button>

            {/* Primary Add Button */}
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="size-4" />
              <span>Tambah Bookmark</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-border/60">
          <button
            onClick={() => {
              setSelectedCategory("Semua");
              setSelectedTag(null);
            }}
            className={cn(
              "px-3 py-1 rounded-md transition-colors whitespace-nowrap font-medium",
              selectedCategory === "Semua" && !selectedTag
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            Semua ({bookmarks.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = bookmarks.filter((b) => b.category === cat.label).length;
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => {
                  setSelectedCategory(cat.label);
                  setSelectedTag(null);
                }}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors whitespace-nowrap font-medium border",
                  isSelected
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                )}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Tag Filters */}
        {popularTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1">
            <span className="text-muted-foreground shrink-0 flex items-center gap-1">
              <Tag className="size-3" /> Tagar Populer:
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={cn(
                  "px-2 py-0.5 rounded transition-colors whitespace-nowrap",
                  selectedTag === tag
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground"
                )}
              >
                #{tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-muted-foreground hover:text-foreground underline pl-1"
              >
                Hapus filter tag
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      {filteredBookmarks.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-xl bg-card/40">
          <Bookmark className="size-10 text-muted-foreground/50 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-foreground">Tidak ada bookmark ditemukan</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== "Semua" || selectedTag || onlyFavorites
              ? "Coba ubah kata kunci pencarian atau sesuaikan filter Anda."
              : "Belum ada bookmark tersimpan. Simpan tautan referensi penting pertama Anda."}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
          >
            <Plus className="size-3.5" />
            Tambah Bookmark Pertama
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((bm) => {
            const domain = extractDomain(bm.url);
            const categoryObj = CATEGORIES.find((c) => c.label === bm.category);

            return (
              <div
                key={bm.id}
                className="p-5 rounded-xl border border-border bg-card hover:border-foreground/30 transition-all flex flex-col justify-between shadow-xs relative group"
              >
                <div>
                  {/* Top row: domain badge + category + star */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[11px] font-mono shrink-0">
                        <Globe className="size-3" />
                        <span className="truncate max-w-[140px]">{domain}</span>
                      </div>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-md border font-medium truncate", categoryObj?.color)}>
                        {bm.category}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleToggleFavorite(bm.id, e)}
                      className={cn(
                        "p-1 rounded text-muted-foreground hover:text-foreground shrink-0",
                        bm.isFavorite && "text-amber-500 fill-current"
                      )}
                      title={bm.isFavorite ? "Hapus Favorit" : "Tandai Favorit"}
                    >
                      <Star className="size-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    <a href={bm.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-start gap-1">
                      <span>{bm.title}</span>
                      <ExternalLink className="size-3.5 mt-1 shrink-0 text-muted-foreground group-hover:text-primary opacity-60 group-hover:opacity-100" />
                    </a>
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                    {bm.description}
                  </p>

                  {/* Internal Notes if present */}
                  {bm.notes && (
                    <div className="mb-3 p-2.5 rounded-lg bg-muted/50 border border-border/80 text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground mr-1">Catatan:</span>
                      <span className="line-clamp-2">{bm.notes}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Row: Tags & Actions */}
                <div className="space-y-3 pt-3 border-t border-border/60">
                  <div className="flex items-center gap-1 flex-wrap">
                    {bm.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground hover:text-foreground"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] text-muted-foreground">
                      {bm.createdAt}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleCopyLink(bm.url, bm.id, e)}
                        className="p-1.5 rounded-md border border-border hover:bg-muted text-muted-foreground transition-colors"
                        title="Salin Tautan"
                      >
                        {copiedId === bm.id ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                      </button>

                      <a
                        href={bm.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md border border-border hover:bg-muted text-blue-600 dark:text-blue-400 transition-colors"
                        title="Buka Halaman"
                      >
                        <ExternalLink className="size-3" />
                      </a>

                      <button
                        onClick={(e) => openEditModal(bm, e)}
                        className="p-1.5 rounded-md border border-border hover:bg-muted text-muted-foreground transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="size-3" />
                      </button>

                      <button
                        onClick={(e) => handleDelete(bm.id, e)}
                        className="p-1.5 rounded-md border border-border hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
                <tr>
                  <th className="p-3.5 w-8"></th>
                  <th className="p-3.5">Judul & Ringkasan</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Domain</th>
                  <th className="p-3.5">Tagar</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookmarks.map((bm) => {
                  const domain = extractDomain(bm.url);
                  const categoryObj = CATEGORIES.find((c) => c.label === bm.category);

                  return (
                    <tr key={bm.id} className="hover:bg-muted/30 transition-colors">
                      {/* Star */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={(e) => handleToggleFavorite(bm.id, e)}
                          className={cn(
                            "text-muted-foreground hover:text-foreground",
                            bm.isFavorite && "text-amber-500 fill-current"
                          )}
                        >
                          <Star className="size-3.5 fill-current" />
                        </button>
                      </td>

                      {/* Title & Desc */}
                      <td className="p-3.5 max-w-md">
                        <div className="font-semibold text-foreground hover:text-primary">
                          <a href={bm.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                            <span>{bm.title}</span>
                            <ExternalLink className="size-3 opacity-60 text-muted-foreground" />
                          </a>
                        </div>
                        <div className="text-muted-foreground line-clamp-1 mt-0.5">
                          {bm.description}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-md border font-medium", categoryObj?.color)}>
                          {bm.category}
                        </span>
                      </td>

                      {/* Domain */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-mono text-muted-foreground text-[11px] flex items-center gap-1">
                          <Globe className="size-3" />
                          {domain}
                        </span>
                      </td>

                      {/* Tags */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1 flex-wrap max-w-xs">
                          {bm.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => handleCopyLink(bm.url, bm.id, e)}
                            className="p-1.5 rounded-md border border-border hover:bg-muted text-muted-foreground"
                            title="Salin Tautan"
                          >
                            {copiedId === bm.id ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                          </button>
                          <a
                            href={bm.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md border border-border hover:bg-muted text-blue-600 dark:text-blue-400"
                            title="Buka Tautan"
                          >
                            <ExternalLink className="size-3" />
                          </a>
                          <button
                            onClick={(e) => openEditModal(bm, e)}
                            className="p-1.5 rounded-md border border-border hover:bg-muted text-muted-foreground"
                            title="Ubah"
                          >
                            <Edit2 className="size-3" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(bm.id, e)}
                            className="p-1.5 rounded-md border border-border hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600"
                            title="Hapus"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  {editingBookmark ? "Ubah Bookmark" : "Tambah Bookmark Baru"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto space-y-4 text-xs">
                {/* URL */}
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Alamat URL Tautan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://example.com atau portal.klien.id"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Judul Bookmark *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bursa Efek Indonesia — Laporan Tahunan"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Kategori Tautan
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as BookmarkCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.label} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Deskripsi / Ringkasan Kegunaan
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan isi tautan, mengapa tautan ini penting, atau bab mana yang relevan..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Internal Notes */}
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Catatan Internal Penggunaan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rujukan rumus DCF hal 42, jangan disebar ke pihak eksternal."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Tags & Favorite */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Tagar (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="IDX, BUMN, Regulasi, ESG"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formFavorite}
                        onChange={(e) => setFormFavorite(e.target.checked)}
                        className="rounded border-border size-4 text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Star className="size-3.5 text-amber-500 fill-current" />
                        Tandai sebagai Tautan Favorit
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium shadow-xs"
                  >
                    {editingBookmark ? "Simpan Perubahan" : "Simpan Bookmark"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
