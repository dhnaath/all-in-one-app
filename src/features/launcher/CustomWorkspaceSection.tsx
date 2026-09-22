import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Folder,
  FolderOpen,
  Plus,
  FileText,
  ExternalLink,
  Trash2,
  Edit2,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Layers
} from "lucide-react";
import { useCustomNav, CustomCategory, CustomMenuItem } from "@/hooks/useCustomNav";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function CustomWorkspaceSection() {
  const {
    categories,
    addCategory,
    renameCategory,
    deleteCategory,
    addMenuItem,
    deleteMenuItem,
    toggleCollapse
  } = useCustomNav();

  const [isFolderDialogOpen, setIsFolderDialogOpen] = React.useState(false);
  const [folderNameInput, setFolderNameInput] = React.useState("");
  const [editingCategoryId, setEditingCategoryId] = React.useState<string | null>(null);

  const [isMenuDialogOpen, setIsMenuDialogOpen] = React.useState(false);
  const [targetCategoryId, setTargetCategoryId] = React.useState("");
  const [menuLabelInput, setMenuLabelInput] = React.useState("");
  const [menuTypeInput, setMenuTypeInput] = React.useState<"workspace" | "link" | "external">("workspace");
  const [menuTargetInput, setMenuTargetInput] = React.useState("");
  const [menuDescInput, setMenuDescInput] = React.useState("");

  const handleOpenAddFolder = () => {
    setEditingCategoryId(null);
    setFolderNameInput("");
    setIsFolderDialogOpen(true);
  };

  const handleOpenEditFolder = (cat: CustomCategory) => {
    setEditingCategoryId(cat.id);
    setFolderNameInput(cat.title);
    setIsFolderDialogOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategoryId) {
      renameCategory(editingCategoryId, folderNameInput);
    } else {
      addCategory(folderNameInput);
    }
    setIsFolderDialogOpen(false);
  };

  const handleOpenAddMenu = (categoryId?: string) => {
    setTargetCategoryId(categoryId || (categories.length > 0 ? categories[0].id : ""));
    setMenuLabelInput("");
    setMenuTypeInput("workspace");
    setMenuTargetInput("");
    setMenuDescInput("");
    setIsMenuDialogOpen(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCategoryId) return;
    addMenuItem(targetCategoryId, {
      label: menuLabelInput,
      type: menuTypeInput,
      target: menuTargetInput.trim() || undefined,
      description: menuDescInput.trim() || undefined,
    });
    setIsMenuDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Panel Header */}
      <div className="px-4 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <Layers className="size-4 text-primary" />
          </div>
          <h2 className="font-semibold text-foreground text-sm">Direktori Proyek</h2>
        </div>
        <button
          onClick={handleOpenAddFolder}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="Folder Baru"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {/* Panel Content (File Manager) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[300px]">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <Folder className="size-5 text-muted-foreground" />
            </div>
            <p className="text-xs font-medium text-foreground mb-1">Belum ada folder</p>
            <p className="text-[11px] text-muted-foreground mb-3">
              Buat folder untuk mengarsipkan atau mengelompokkan proyek kustom.
            </p>
            <button
              onClick={handleOpenAddFolder}
              className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md font-medium"
            >
              Buat Folder
            </button>
          </div>
        ) : (
          categories.map((cat) => {
            const isCollapsed = !!cat.isCollapsed;
            return (
              <div key={cat.id} className="group/cat flex flex-col">
                <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleCollapse(cat.id)}
                    className="flex flex-1 items-center gap-1.5 min-w-0"
                  >
                    <span className="text-muted-foreground">
                      {isCollapsed ? <ChevronRight className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                    </span>
                    {isCollapsed ? (
                      <Folder className="size-4 text-muted-foreground shrink-0" />
                    ) : (
                      <FolderOpen className="size-4 text-primary shrink-0" />
                    )}
                    <span className="text-sm font-semibold truncate text-foreground">{cat.title}</span>
                  </button>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover/cat:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenAddMenu(cat.id)}
                      className="p-1 rounded text-muted-foreground hover:bg-accent hover:text-foreground"
                      title="Tambah File/Item"
                    >
                      <Plus className="size-3.5" />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded text-muted-foreground hover:bg-accent hover:text-foreground outline-none">
                        <MoreVertical className="size-3.5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => handleOpenEditFolder(cat)} className="gap-2 text-xs">
                          <Edit2 className="size-3.5" /> Ubah Nama
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteCategory(cat.id)} className="gap-2 text-xs text-rose-500 focus:text-rose-600 focus:bg-rose-50">
                          <Trash2 className="size-3.5" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="flex flex-col gap-0.5 mt-0.5 ml-[22px] border-l border-border/60 pl-2">
                    {cat.items.length === 0 ? (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground/60 italic">Kosong</div>
                    ) : (
                      cat.items.map((item) => (
                        <div key={item.id} className="group/item flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent transition-colors">
                          <Link to={item.path} className="flex items-center gap-2 flex-1 min-w-0">
                            {item.type === "external" ? (
                              <ExternalLink className="size-3.5 text-muted-foreground shrink-0" />
                            ) : (
                              <FileText className="size-3.5 text-muted-foreground shrink-0" />
                            )}
                            <span className="text-xs truncate text-foreground/90 font-medium">{item.label}</span>
                          </Link>
                          <button
                            onClick={() => deleteMenuItem(cat.id, item.id)}
                            className="p-1 rounded opacity-0 group-hover/item:opacity-100 hover:text-rose-500 transition-opacity"
                            title="Hapus"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Dialogs... */}
      <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategoryId ? "Ubah Nama Folder" : "Folder Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveCategory} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nama Folder</label>
              <input
                type="text"
                required
                value={folderNameInput}
                onChange={(e) => setFolderNameInput(e.target.value)}
                placeholder="Contoh: Proyek Internal, Riset, Referensi"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <button
                type="button"
                onClick={() => setIsFolderDialogOpen(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-border hover:bg-muted"
              >
                Batal
              </button>
              <button type="submit" className="px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
                {editingCategoryId ? "Simpan Perubahan" : "Buat Folder"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Item ke Folder</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveMenu} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Folder Induk</label>
              <select
                value={targetCategoryId}
                onChange={(e) => setTargetCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>📁 {c.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nama File/Item</label>
              <input
                type="text"
                required
                value={menuLabelInput}
                onChange={(e) => setMenuLabelInput(e.target.value)}
                placeholder="Contoh: Riset Pasar Q4"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Jenis Item</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMenuTypeInput("workspace")}
                  className={`px-2.5 py-2 text-xs rounded-lg border text-center transition-all ${
                    menuTypeInput === "workspace" ? "border-primary bg-primary/10 text-primary font-bold" : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  📄 Workspace
                </button>
                <button
                  type="button"
                  onClick={() => setMenuTypeInput("link")}
                  className={`px-2.5 py-2 text-xs rounded-lg border text-center transition-all ${
                    menuTypeInput === "link" ? "border-primary bg-primary/10 text-primary font-bold" : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  🔗 Halaman Web
                </button>
                <button
                  type="button"
                  onClick={() => setMenuTypeInput("external")}
                  className={`px-2.5 py-2 text-xs rounded-lg border text-center transition-all ${
                    menuTypeInput === "external" ? "border-primary bg-primary/10 text-primary font-bold" : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  🌐 Tautan Luar
                </button>
              </div>
            </div>
            {menuTypeInput === "link" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Pilih Rute Internal</label>
                <select
                  value={menuTargetInput}
                  onChange={(e) => setMenuTargetInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">-- Pilih Halaman --</option>
                  <option value="/proyek">Daftar Proyek</option>
                  <option value="/tugas">Manajemen Tugas</option>
                  <option value="/kalender">Kalender & Jadwal</option>
                  <option value="/catatan">Catatan</option>
                </select>
              </div>
            )}
            {menuTypeInput === "external" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Alamat Tautan (URL)</label>
                <input
                  type="url"
                  required
                  value={menuTargetInput}
                  onChange={(e) => setMenuTargetInput(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Keterangan Singkat (Opsional)</label>
              <input
                type="text"
                value={menuDescInput}
                onChange={(e) => setMenuDescInput(e.target.value)}
                placeholder="Penjelasan ringkas fungsi item ini..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <button
                type="button"
                onClick={() => setIsMenuDialogOpen(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-border hover:bg-muted"
              >
                Batal
              </button>
              <button type="submit" className="px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
                Tambah Item
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
