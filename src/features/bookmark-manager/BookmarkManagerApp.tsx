import React, { useState, useMemo } from "react";
import {
  Bookmark as BookmarkIcon,
  Folder as FolderIcon,
  Tag as TagIcon,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  RefreshCw,
  FolderPlus,
  Share2,
  BookOpen,
  Scissors,
  Check,
  X,
  ChevronRight,
  FolderTree,
  BarChart2,
  Copy,
  SlidersHorizontal,
  Archive,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { useBookmarkStore } from "./store";
import { Bookmark, BookmarkStatus, BookmarkViewMode, Folder } from "./types";

export function BookmarkManagerApp() {
  const {
    bookmarks,
    folders,
    tags,
    linkChecks,
    collections,
    selectedFolderId,
    selectedTag,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    setBookmarkStatus,
    moveBookmark,
    checkLink,
    checkAllLinks,
    addFolder,
    updateFolder,
    deleteFolder,
    setSelectedFolderId,
    addTag,
    deleteTag,
    setSelectedTag,
    createCollection,
    deleteCollection,
  } = useBookmarkStore();

  const [activeTab, setActiveTab] = useState<BookmarkViewMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "title">("date-desc");
  const [isCheckingLinks, setIsCheckingLinks] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Modals
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderParentId, setNewFolderParentId] = useState<string>("");
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDesc, setNewCollectionDesc] = useState("");
  const [newCollectionBookmarks, setNewCollectionBookmarks] = useState<string[]>([]);
  const [shareLinkUrl, setShareLinkUrl] = useState<string | null>(null);

  // Form states for Bookmark Add/Edit
  const [formUrl, setFormUrl] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formFolderId, setFormFolderId] = useState<string>("");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [formStatus, setFormStatus] = useState<BookmarkStatus>("active");

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingBookmark(null);
    setFormUrl("");
    setFormTitle("");
    setFormDesc("");
    setFormFolderId(selectedFolderId || "");
    setFormTags(selectedTag ? [selectedTag] : []);
    setFormStatus("active");
    setIsAddBookmarkOpen(true);
  };

  const handleOpenEditModal = (bm: Bookmark) => {
    setEditingBookmark(bm);
    setFormUrl(bm.url);
    setFormTitle(bm.title);
    setFormDesc(bm.description || "");
    setFormFolderId(bm.folderId || "");
    setFormTags([...bm.tags]);
    setFormStatus(bm.status);
    setIsAddBookmarkOpen(true);
  };

  const handleSaveBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUrl.trim()) return;

    let finalTitle = formTitle.trim();
    if (!finalTitle) {
      try {
        const u = new URL(formUrl);
        finalTitle = u.hostname.replace("www.", "");
      } catch {
        finalTitle = formUrl;
      }
    }

    if (editingBookmark) {
      updateBookmark(editingBookmark.id, {
        url: formUrl.trim(),
        title: finalTitle,
        description: formDesc.trim(),
        folderId: formFolderId || null,
        tags: formTags,
        status: formStatus,
      });
      showToast(`Bookmark "${finalTitle}" berhasil diperbarui.`);
    } else {
      addBookmark({
        url: formUrl.trim(),
        title: finalTitle,
        description: formDesc.trim(),
        folderId: formFolderId || null,
        tags: formTags,
        status: formStatus,
        faviconUrl: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(formUrl)}&sz=64`,
      });
      showToast(`Bookmark "${finalTitle}" berhasil disimpan.`);
    }
    setIsAddBookmarkOpen(false);
  };

  const handleRunCheckAll = async () => {
    setIsCheckingLinks(true);
    await checkAllLinks();
    setIsCheckingLinks(false);
    showToast("Pemeriksaan status link selesai (Link rot scan).");
  };

  const handleRunCheckSingle = async (bmId: string) => {
    const ok = await checkLink(bmId);
    showToast(ok ? "URL aktif & dapat diakses (200 OK)." : "Tautan tidak dapat diakses (Broken link tercatat)!");
  };

  const handleAddTagToForm = () => {
    const val = tagInput.trim().toLowerCase();
    if (val && !formTags.includes(val)) {
      setFormTags([...formTags, val]);
      addTag(val);
      setTagInput("");
    }
  };

  // Filter & Sort Logic
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((bm) => {
      // Tab-specific filters
      if (activeTab === "unread" && bm.status !== "unread") return false;
      if (activeTab === "broken" && bm.status !== "broken") return false;
      if (activeTab === "folder" && selectedFolderId !== null && bm.folderId !== selectedFolderId) return false;
      if (activeTab === "tag" && selectedTag !== null && !bm.tags.includes(selectedTag)) return false;

      // Quick filter
      if (statusFilter !== "all" && bm.status !== statusFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = bm.title.toLowerCase().includes(q);
        const matchDesc = (bm.description || "").toLowerCase().includes(q);
        const matchUrl = bm.url.toLowerCase().includes(q);
        const matchTag = bm.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchUrl && !matchTag) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "date-asc") return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
  }, [bookmarks, activeTab, selectedFolderId, selectedTag, statusFilter, searchQuery, sortBy]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = bookmarks.length;
    const unread = bookmarks.filter((b) => b.status === "unread").length;
    const broken = bookmarks.filter((b) => b.status === "broken").length;
    const active = bookmarks.filter((b) => b.status === "active").length;
    const archived = bookmarks.filter((b) => b.status === "archived").length;
    const unreadRatio = total > 0 ? ((unread / total) * 100).toFixed(1) : "0";

    const tagCounts: Record<string, number> = {};
    bookmarks.forEach((b) => {
      b.tags.forEach((t) => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const folderCounts: Record<string, number> = {};
    folders.forEach((f) => {
      folderCounts[f.id] = bookmarks.filter((b) => b.folderId === f.id).length;
    });

    return { total, unread, broken, active, archived, unreadRatio, sortedTags, folderCounts };
  }, [bookmarks, folders]);

  // Hierarchical folder map helper
  const rootFolders = useMemo(() => folders.filter((f) => !f.parentFolderId), [folders]);
  const getSubfolders = (parentId: string) => folders.filter((f) => f.parentFolderId === parentId);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6 lg:p-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-400 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <BookmarkIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">Bookmark Manager</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  App #26
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                Penyimpanan tautan terstruktur dengan folder hierarkis, tag, deteksi link rot, dan koleksi kurasi.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleRunCheckAll}
            disabled={isCheckingLinks}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition disabled:opacity-50"
            title="Pindai apakah seluruh tautan masih aktif"
          >
            <RefreshCw className={`w-4 h-4 ${isCheckingLinks ? "animate-spin text-sky-400" : ""}`} />
            <span>{isCheckingLinks ? "Memeriksa Link..." : "Scan Link Rot"}</span>
          </button>

          <button
            onClick={() => setIsNewFolderOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition"
          >
            <FolderPlus className="w-4 h-4 text-amber-400" />
            <span>Folder Baru</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Simpan Bookmark</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-800/80 scrollbar-none">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "all" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Semua ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("folder")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "folder" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>By Folder ({folders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("tag")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "tag" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <TagIcon className="w-4 h-4" />
          <span>By Tag ({tags.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("unread")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "unread" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Unread ({stats.unread})</span>
        </button>

        <button
          onClick={() => setActiveTab("broken")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "broken" ? "bg-rose-600 text-white shadow-sm" : "text-slate-400 hover:text-rose-400 hover:bg-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Broken Links ({stats.broken})</span>
        </button>

        <button
          onClick={() => setActiveTab("collections")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "collections" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Share2 className="w-4 h-4 text-purple-400" />
          <span>Collections ({collections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "stats" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <BarChart2 className="w-4 h-4 text-sky-400" />
          <span>Statistik</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 mt-4">
        {/* STATS VIEW */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-xl">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Bookmark</div>
                <div className="text-3xl font-extrabold text-white mt-1">{stats.total}</div>
                <div className="text-xs text-slate-500 mt-1">Tersimpan di sistem</div>
              </div>
              <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-xl">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Unread Ratio</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.unreadRatio}%</div>
                <div className="text-xs text-slate-500 mt-1">{stats.unread} artikel belum dibaca</div>
              </div>
              <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-xl">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Broken Links</div>
                <div className="text-3xl font-extrabold text-rose-400 mt-1">{stats.broken}</div>
                <div className="text-xs text-slate-500 mt-1">Perlu ditinjau / dihapus</div>
              </div>
              <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-xl">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Folder Aktif</div>
                <div className="text-3xl font-extrabold text-sky-400 mt-1">{folders.length}</div>
                <div className="text-xs text-slate-500 mt-1">Struktur hierarkis</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-800/60 border border-slate-700 rounded-xl">
                <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <TagIcon className="w-4 h-4 text-indigo-400" />
                  Most Used Tags
                </h3>
                <div className="space-y-2">
                  {stats.sortedTags.map(([tag, count]) => (
                    <div key={tag} className="flex items-center justify-between text-sm py-1 border-b border-slate-700/40">
                      <span className="text-slate-300">#{tag}</span>
                      <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs font-medium">{count} tautan</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-slate-800/60 border border-slate-700 rounded-xl">
                <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <FolderIcon className="w-4 h-4 text-amber-400" />
                  Bookmarks by Folder
                </h3>
                <div className="space-y-2">
                  {folders.map((f) => (
                    <div key={f.id} className="flex items-center justify-between text-sm py-1 border-b border-slate-700/40">
                      <span className="text-slate-300">{f.name}</span>
                      <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs font-medium">
                        {stats.folderCounts[f.id] || 0} tautan
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COLLECTIONS VIEW */}
        {activeTab === "collections" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Collections Tematik</h2>
                <p className="text-xs text-slate-400">
                  Kumpulan tautan kurasi yang dapat dibagikan kepada tim atau publik tanpa memaparkan struktur folder pribadi.
                </p>
              </div>
              <button
                onClick={() => {
                  setNewCollectionName("");
                  setNewCollectionDesc("");
                  setNewCollectionBookmarks([]);
                  setIsCollectionModalOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                Buat Koleksi
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((col) => {
                const bms = bookmarks.filter((b) => col.bookmarkIds.includes(b.id));
                return (
                  <div key={col.id} className="p-5 bg-slate-800/70 border border-slate-700 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-base text-white">{col.name}</h3>
                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${col.isPublic ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-700 text-slate-400"}`}>
                          {col.isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{col.description}</p>

                      <div className="mt-4 space-y-2">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Tautan ({bms.length})
                        </div>
                        {bms.slice(0, 3).map((b) => (
                          <div key={b.id} className="flex items-center gap-2 text-xs text-slate-300 truncate">
                            <ArrowUpRight className="w-3 h-3 text-sky-400 shrink-0" />
                            <span className="truncate">{b.title}</span>
                          </div>
                        ))}
                        {bms.length > 3 && (
                          <div className="text-[11px] text-slate-500">+{bms.length - 3} tautan lainnya</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-700/60">
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/bookmarks?collection=${col.id}`;
                          navigator.clipboard.writeText(url);
                          showToast("Link publik disalin ke clipboard!");
                        }}
                        className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Salin Link
                      </button>
                      <button
                        onClick={() => deleteCollection(col.id)}
                        className="text-xs text-rose-400 hover:text-rose-300"
                        title="Hapus Koleksi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FOLDER & TAG SIDEBAR + BOOKMARKS LIST */}
        {activeTab !== "stats" && activeTab !== "collections" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar for Folder / Tag navigation */}
            {(activeTab === "folder" || activeTab === "tag" || activeTab === "all") && (
              <div className="lg:col-span-1 space-y-4">
                {/* Folder Tree Filter */}
                <div className="p-4 bg-slate-800/60 border border-slate-700/70 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FolderIcon className="w-3.5 h-3.5 text-amber-400" />
                      Folder
                    </span>
                    {selectedFolderId && (
                      <button
                        onClick={() => setSelectedFolderId(null)}
                        className="text-[11px] text-sky-400 hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
                    <button
                      onClick={() => setSelectedFolderId(null)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition ${
                        selectedFolderId === null
                          ? "bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40"
                          : "text-slate-300 hover:bg-slate-700/60"
                      }`}
                    >
                      <span>Semua Folder</span>
                      <span className="text-[10px] text-slate-500">{bookmarks.length}</span>
                    </button>

                    {rootFolders.map((rf) => {
                      const subs = getSubfolders(rf.id);
                      const isSelected = selectedFolderId === rf.id;
                      const count = bookmarks.filter((b) => b.folderId === rf.id).length;

                      return (
                        <div key={rf.id} className="space-y-1">
                          <button
                            onClick={() => setSelectedFolderId(rf.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition ${
                              isSelected
                                ? "bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40"
                                : "text-slate-300 hover:bg-slate-700/60"
                            }`}
                          >
                            <span className="truncate flex items-center gap-1.5">
                              <FolderIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              {rf.name}
                            </span>
                            <span className="text-[10px] text-slate-500">{count}</span>
                          </button>

                          {/* Subfolders */}
                          {subs.length > 0 && (
                            <div className="pl-4 space-y-1 border-l border-slate-700/50 ml-2">
                              {subs.map((sf) => {
                                const subCount = bookmarks.filter((b) => b.folderId === sf.id).length;
                                const isSubSelected = selectedFolderId === sf.id;
                                return (
                                  <button
                                    key={sf.id}
                                    onClick={() => setSelectedFolderId(sf.id)}
                                    className={`w-full text-left px-2 py-1 rounded flex items-center justify-between text-[11px] transition ${
                                      isSubSelected
                                        ? "bg-indigo-600/30 text-indigo-300 font-semibold"
                                        : "text-slate-400 hover:bg-slate-700/40 hover:text-slate-200"
                                    }`}
                                  >
                                    <span className="truncate flex items-center gap-1">
                                      <ChevronRight className="w-3 h-3 text-slate-500" />
                                      {sf.name}
                                    </span>
                                    <span className="text-[10px] text-slate-500">{subCount}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tags Filter */}
                <div className="p-4 bg-slate-800/60 border border-slate-700/70 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <TagIcon className="w-3.5 h-3.5 text-indigo-400" />
                      Tags
                    </span>
                    {selectedTag && (
                      <button
                        onClick={() => setSelectedTag(null)}
                        className="text-[11px] text-sky-400 hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => {
                      const isSel = selectedTag === t.name;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTag(isSel ? null : t.name)}
                          className={`px-2 py-1 rounded-md text-xs transition border flex items-center gap-1 ${
                            isSel
                              ? "bg-indigo-600 text-white border-indigo-400 font-semibold"
                              : "bg-slate-700/50 hover:bg-slate-700 text-slate-300 border-slate-600/50"
                          }`}
                        >
                          <span>#{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Bookmarks Main List Area */}
            <div className={`${activeTab === "unread" || activeTab === "broken" ? "lg:col-span-4" : "lg:col-span-3"} space-y-4`}>
              {/* Search & Sort Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari judul, URL, tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">Semua Status</option>
                    <option value="active">Active</option>
                    <option value="unread">Unread</option>
                    <option value="broken">Broken</option>
                    <option value="archived">Archived</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="date-desc">Terbaru</option>
                    <option value="date-asc">Terlama</option>
                    <option value="title">Judul (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Status Banner for Broken Links */}
              {activeTab === "broken" && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-rose-300">Tautan Terdeteksi Tidak Dapat Diakses</h4>
                      <p className="text-xs text-rose-400/80">
                        Sistem mendeteksi tautan ini mengalami link rot (HTTP 404/500/timeout). Anda dapat mempromosikannya ke Web Clipper (#17) jika sebelumnya memiliki salinan, atau menghapusnya.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRunCheckAll}
                    disabled={isCheckingLinks}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Recheck Semua
                  </button>
                </div>
              )}

              {/* Bookmark Cards */}
              {filteredBookmarks.length === 0 ? (
                <div className="p-12 text-center bg-slate-800/40 border border-slate-700/60 rounded-xl">
                  <BookmarkIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-slate-300">Tidak ada bookmark ditemukan</h3>
                  <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookmarks.map((bm) => {
                    const folder = folders.find((f) => f.id === bm.folderId);
                    return (
                      <div
                        key={bm.id}
                        className={`p-4 bg-slate-800/80 hover:bg-slate-800 border rounded-xl transition duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          bm.status === "broken"
                            ? "border-rose-500/40 bg-rose-950/20"
                            : bm.status === "unread"
                            ? "border-emerald-500/30"
                            : "border-slate-700/70"
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {bm.faviconUrl ? (
                            <img
                              src={bm.faviconUrl}
                              alt=""
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                              className="w-5 h-5 rounded mt-0.5 shrink-0 bg-slate-700 p-0.5"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </div>
                          )}

                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <a
                                href={bm.url}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-sm text-slate-100 hover:text-sky-400 transition flex items-center gap-1 truncate"
                              >
                                <span>{bm.title}</span>
                                <ExternalLink className="w-3 h-3 text-slate-500 shrink-0 inline" />
                              </a>

                              {/* Status Badge */}
                              {bm.status === "unread" && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  Unread
                                </span>
                              )}
                              {bm.status === "broken" && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                  Broken (Rot)
                                </span>
                              )}
                              {bm.status === "archived" && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700 text-slate-400">
                                  Archived
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-400 truncate">{bm.url}</div>

                            {bm.description && (
                              <p className="text-xs text-slate-300 line-clamp-1">{bm.description}</p>
                            )}

                            {/* Meta & Tags */}
                            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 flex-wrap">
                              {folder && (
                                <span className="flex items-center gap-1 text-amber-400/90 font-medium">
                                  <FolderIcon className="w-3 h-3" />
                                  {folder.name}
                                </span>
                              )}

                              {bm.tags.map((t) => (
                                <span
                                  key={t}
                                  onClick={() => setSelectedTag(t)}
                                  className="text-slate-400 hover:text-indigo-400 cursor-pointer"
                                >
                                  #{t}
                                </span>
                              ))}

                              {bm.lastCheckedAt && (
                                <span className="text-slate-500">
                                  Checked: {new Date(bm.lastCheckedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                          {/* Recheck link */}
                          <button
                            onClick={() => handleRunCheckSingle(bm.id)}
                            className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-700/60 rounded"
                            title="Validasi Ulang Tautan"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Read/Unread */}
                          {bm.status === "unread" ? (
                            <button
                              onClick={() => {
                                setBookmarkStatus(bm.id, "active");
                                showToast("Ditandai sudah dibaca.");
                              }}
                              className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded text-xs font-medium"
                              title="Tandai Sudah Dibaca"
                            >
                              Tandai Baca
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setBookmarkStatus(bm.id, "unread");
                                showToast("Ditandai belum dibaca (Unread).");
                              }}
                              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/60 rounded"
                              title="Tandai Belum Dibaca"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Promote to Web Clip (#17) */}
                          <button
                            onClick={() => {
                              showToast(`Tautan "${bm.title}" diteruskan ke Web Clipper (#17) untuk ekstraksi konten permanen.`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/60 rounded"
                            title="Promote to Web Clip (#17)"
                          >
                            <Scissors className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(bm)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 rounded"
                            title="Edit Bookmark"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              deleteBookmark(bm.id);
                              showToast("Bookmark dihapus.");
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded"
                            title="Hapus Bookmark"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT BOOKMARK */}
      {isAddBookmarkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white">
                {editingBookmark ? "Edit Bookmark" : "Tambah Bookmark Baru"}
              </h3>
              <button
                onClick={() => setIsAddBookmarkOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBookmark} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL Tujuan <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/article"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Judul Bookmark
                </label>
                <input
                  type="text"
                  placeholder="Judul halaman (opsional, default domain)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catatan Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi singkat konteks tautan..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Folder
                  </label>
                  <select
                    value={formFolderId}
                    onChange={(e) => setFormFolderId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Tanpa Folder</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.parentFolderId ? `— ${f.name}` : f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status Awal
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="unread">Unread (Baca Nanti)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tag Klasifikasi
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ketik tag & Enter..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTagToForm();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTagToForm}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg"
                  >
                    Tambah
                  </button>
                </div>
                {formTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formTags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[11px] flex items-center gap-1 border border-indigo-500/30"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => setFormTags(formTags.filter((x) => x !== t))}
                          className="hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddBookmarkOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-500/25"
                >
                  {editingBookmark ? "Simpan Perubahan" : "Simpan Tautan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW FOLDER */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Buat Folder Baru</h3>
              <button
                onClick={() => setIsNewFolderOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Folder
                </label>
                <input
                  type="text"
                  placeholder="mis. Machine Learning"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Parent Folder (Opsional untuk Sub-folder)
                </label>
                <select
                  value={newFolderParentId}
                  onChange={(e) => setNewFolderParentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Folder Utama (Root)</option>
                  {rootFolders.map((rf) => (
                    <option key={rf.id} value={rf.id}>
                      {rf.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewFolderOpen(false)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newFolderName.trim()) {
                    addFolder(newFolderName.trim(), newFolderParentId || null);
                    showToast(`Folder "${newFolderName}" berhasil dibuat.`);
                    setNewFolderName("");
                    setNewFolderParentId("");
                    setIsNewFolderOpen(false);
                  }
                }}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
              >
                Buat Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE COLLECTION */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Buat Collection Baru</h3>
              <button
                onClick={() => setIsCollectionModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Koleksi
                </label>
                <input
                  type="text"
                  placeholder="mis. Rekomendasi Bacaan Onboarding"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan singkat koleksi..."
                  value={newCollectionDesc}
                  onChange={(e) => setNewCollectionDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pilih Bookmark untuk Dimasukkan
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1 p-2 bg-slate-800/80 border border-slate-700 rounded-lg">
                  {bookmarks.map((b) => {
                    const isChecked = newCollectionBookmarks.includes(b.id);
                    return (
                      <label key={b.id} className="flex items-center gap-2 text-xs text-slate-200 hover:bg-slate-700/50 p-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewCollectionBookmarks([...newCollectionBookmarks, b.id]);
                            } else {
                              setNewCollectionBookmarks(newCollectionBookmarks.filter((id) => id !== b.id));
                            }
                          }}
                          className="rounded border-slate-600 bg-slate-900 text-indigo-600"
                        />
                        <span className="truncate">{b.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCollectionModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newCollectionName.trim()) {
                    createCollection(newCollectionName.trim(), newCollectionDesc.trim(), newCollectionBookmarks, true);
                    showToast(`Koleksi "${newCollectionName}" dibuat.`);
                    setIsCollectionModalOpen(false);
                  }
                }}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
              >
                Simpan Koleksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
