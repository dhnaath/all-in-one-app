import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

export function HeaderNavControls({
  href = "/home",
  isHomeActive = false,
}: {
  href?: string;
  isHomeActive?: boolean;
}) {
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

      {/* Ikon Home: Beranda */}
      {isHomeActive ? (
        <span
          className="p-1.5 sm:p-2 rounded-lg shrink-0 transition-colors bg-accent text-foreground flex items-center justify-center cursor-default"
          title="Beranda"
        >
          <Home size={19} className="shrink-0" />
        </span>
      ) : (
        <Link
          to={href}
          className="p-1.5 sm:p-2 rounded-lg shrink-0 transition-colors text-muted-foreground hover:text-foreground hover:bg-accent flex items-center justify-center cursor-pointer"
          title="Beranda"
        >
          <Home size={19} className="shrink-0" />
        </Link>
      )}

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
