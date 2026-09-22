import React, { useState } from "react";
import { Pencil, Calendar, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { motion } from "motion/react";
import { useDeletedItems } from "../hooks/useDeletedItems";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function CategoryView({ onUnavailable }: { onUnavailable?: () => void }) {
  const { ref, onScroll } = useScrollRestore("category_scroll");
  const { deletedIds, markDeleted } = useDeletedItems("deleted_categories");
  const [mockCategories, setMockCategories] = useState<any[]>(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("categories_list") : null;
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const removeCat = (name: string) => {
    markDeleted(name);
    setMockCategories((c) => c.filter((x) => x.name !== name));
  };
  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className="flex flex-col h-full bg-background overflow-y-auto"
    >
      <div className="p-4 flex justify-between items-center text-foreground">
        <h1 className="text-2xl font-normal tracking-wide">Kategori</h1>
        <button onClick={onUnavailable}>
          <Pencil
            size={20}
            className="text-muted-foreground cursor-pointer hover:text-foreground"
          />
        </button>
      </div>

      <div className="px-4 py-2 flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-foreground bg-card px-3 py-1.5 rounded-full border border-border">
          <Calendar size={16} />
          <span className="font-medium text-sm">Juni 2026</span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <button onClick={onUnavailable} className="hover:text-foreground">
            <ChevronLeft size={18} />
          </button>
          <button onClick={onUnavailable} className="hover:text-foreground">
            <ChevronRight size={18} />
          </button>
          <button onClick={onUnavailable} className="hover:text-foreground">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center relative mb-8">
        {/* Donut Chart visual placeholder */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-6 mt-4">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#252525" strokeWidth="16" />
            {/* Segments (Mockup percentages roughly) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#f44336"
              strokeWidth="16"
              strokeDasharray="113 251"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#e91e63"
              strokeWidth="16"
              strokeDasharray="70 251"
              strokeDashoffset="-113"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#ffeb3b"
              strokeWidth="16"
              strokeDasharray="38 251"
              strokeDashoffset="-183"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#009688"
              strokeWidth="16"
              strokeDasharray="30 251"
              strokeDashoffset="-221"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground mb-1">Total Pengeluaran</span>
            <span className="text-base font-medium text-foreground">Rp 0</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-24 space-y-4">
        {mockCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground/70 pt-10">
            <p className="text-sm">Belum ada data kategori</p>
          </div>
        ) : (
          mockCategories.map((cat, idx) => (
            <div
              key={idx}
              className="relative mb-3 bg-card/60 rounded-2xl overflow-hidden border border-border"
            >
              <div className="absolute inset-0 flex items-center justify-between px-6 z-0">
                <div className="flex items-center gap-2 text-blue-400">
                  <span className="text-xs font-medium uppercase tracking-widest">Arsip</span>
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <span className="text-xs font-medium uppercase tracking-widest">Hapus</span>
                </div>
              </div>
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -100) {
                    if (window.confirm("Hapus kategori ini?")) {
                      removeCat(cat.name);
                    }
                  } else if (info.offset.x > 100) {
                    alert("Kategori diarsipkan.");
                    removeCat(cat.name);
                  }
                }}
                className="bg-card border-y border-border rounded-2xl p-4 flex items-center gap-4 relative z-10 hover:bg-accent transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${cat.color}`}
                >
                  <span className="text-lg text-foreground">{cat.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    <span className="text-sm font-medium text-foreground">
                      Rp {cat.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="w-full bg-background h-2 rounded-full overflow-hidden border border-border">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: `${Math.random() * 50 + 20}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
