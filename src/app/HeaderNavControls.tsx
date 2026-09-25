import React, { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";

export function HeaderNavControls() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRefreshing(true);

    // Kirim event refresh ke aplikasi jika ada modul yang mendengarkan
    window.dispatchEvent(new CustomEvent("app-refresh"));

    // Trigger router/window refresh halus
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  const handleUndo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Coba undo teks aktif jika input/textarea/contenteditable sedang fokus
    try {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable)
      ) {
        if (document.execCommand("undo")) return;
      }
    } catch {}

    // 2. Dispatch custom event jika ada modul aplikasi yang mendengarkan event undo
    window.dispatchEvent(new CustomEvent("app-undo"));

    // 3. Fallback riwayat browser / navigasi kembali
    if (typeof window !== "undefined" && window.history) {
      window.history.back();
    }
  };

  const handleRedo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Coba redo teks aktif jika input/textarea/contenteditable sedang fokus
    try {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable)
      ) {
        if (document.execCommand("redo")) return;
      }
    } catch {}

    // 2. Dispatch custom event jika ada modul aplikasi yang mendengarkan event redo
    window.dispatchEvent(new CustomEvent("app-redo"));

    // 3. Fallback riwayat browser / navigasi maju
    if (typeof window !== "undefined" && window.history) {
      window.history.forward();
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
      {/* Panah Kiri: Undo */}
      <button
        type="button"
        onClick={handleUndo}
        className="p-1.5 sm:p-2 rounded-lg shrink-0 transition-colors text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer flex items-center justify-center"
        title="Undo / Riwayat Sebelumnya (Ctrl+Z)"
        aria-label="Undo"
      >
        <ArrowLeft size={19} className="shrink-0" />
      </button>

      {/* Ikon Refresh: Menggantikan Home di antara panah kiri dan kanan */}
      <button
        type="button"
        onClick={handleRefresh}
        className="p-1.5 sm:p-2 rounded-lg shrink-0 transition-colors text-muted-foreground hover:text-foreground hover:bg-accent flex items-center justify-center cursor-pointer"
        title="Muat Ulang / Refresh Halaman"
        aria-label="Refresh"
      >
        <RotateCw
          size={18}
          className={`shrink-0 transition-transform duration-500 ${isRefreshing ? "animate-spin text-primary" : ""}`}
        />
      </button>

      {/* Panah Kanan: Redo */}
      <button
        type="button"
        onClick={handleRedo}
        className="p-1.5 sm:p-2 rounded-lg shrink-0 transition-colors text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer flex items-center justify-center"
        title="Redo / Riwayat Berikutnya (Ctrl+Y)"
        aria-label="Redo"
      >
        <ArrowRight size={19} className="shrink-0" />
      </button>
    </div>
  );
}
