import React, { useState, useEffect } from "react";
import {
  Pocket,
  ShoppingBag,
  Luggage,
  Plus,
  Trash2,
  Tag,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

// 1. POCKET VIEW (Kartu, Slip, Tiket & Catatan Saku)
export function PocketAppView() {
  const [items, setItems] = useState(() => {
    try {
      const s = localStorage.getItem("aio_pocket_items");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "pkt-1", title: "Kartu Akses Co-Working Space", code: "ACCESS-9921", category: "Membership", note: "Lantai 12, tap kartu pada lift", date: "2026-09-01" },
      { id: "pkt-2", title: "Nomor Kupon Diskon Buku Bisnis", code: "GROWTH2026", category: "Voucher", note: "Diskon 30% berlaku s/d akhir bulan", date: "2026-09-15" },
      { id: "pkt-3", title: "Kode Booking Tiket Kereta Cepat", code: "KCIC-88219A", category: "Tiket", note: "Gerbong 3 Seat 12A Halim - Padalarang", date: "2026-09-28" },
    ];
  });

  const [newTitle, setNewTitle] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newCategory, setNewCategory] = useState("Voucher");

  useEffect(() => {
    try {
      localStorage.setItem("aio_pocket_items", JSON.stringify(items));
    } catch {}
  }, [items]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setItems((prev: any[]) => [
      { id: `pkt-${Date.now()}`, title: newTitle, code: newCode, category: newCategory, date: new Date().toISOString().split("T")[0] },
      ...prev,
    ]);
    setNewTitle("");
    setNewCode("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-5 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <Pocket className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Pocket (Saku Digital)</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Slip cepat, voucher, kode booking tiket, dan kartu digital praktis.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="Nama slip / kartu saku..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 w-full bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        />
        <input
          type="text"
          placeholder="Kode / Nomor / Link..."
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          className="w-full sm:w-48 bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        />
        <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer">
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah</span>
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between gap-3 shadow-xs">
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{item.category}</span>
              <h3 className="font-bold text-sm text-foreground mt-2">{item.title}</h3>
              {item.code && (
                <div className="mt-2.5 p-2 rounded-lg bg-background border border-border font-mono text-xs font-bold text-foreground select-all">
                  {item.code}
                </div>
              )}
              {item.note && <p className="text-xs text-muted-foreground mt-2">{item.note}</p>}
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted-foreground">
              <span>{item.date}</span>
              <button type="button" onClick={() => setItems((p: any[]) => p.filter((x) => x.id !== item.id))} className="text-muted-foreground hover:text-rose-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. POUCH VIEW (Organizer Dokumen & Esensial Bepergian)
export function PouchAppView() {
  const [items, setItems] = useState(() => {
    try {
      const s = localStorage.getItem("aio_pouch_items");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "pch-1", name: "Paspor & Asuransi Perjalanan", status: "Siap", category: "Dokumen", checked: true },
      { id: "pch-2", name: "Kartu SIM Lokal / eSIM Roaming", status: "Siap", category: "Konektivitas", checked: true },
      { id: "pch-3", name: "Mata Uang Asing Kas (SGD & USD)", status: "Perlu Cek", category: "Finansial", checked: false },
      { id: "pch-4", name: "Adapter Colokan Internasional Universal", status: "Siap", category: "Gadget", checked: true },
    ];
  });

  const [newName, setNewName] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("aio_pouch_items", JSON.stringify(items));
    } catch {}
  }, [items]);

  const handleToggle = (id: string) => {
    setItems((prev: any[]) => prev.map((x) => (x.id === id ? { ...x, checked: !x.checked } : x)));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    setItems((prev: any[]) => [...prev, { id: `pch-${Date.now()}`, name: newName, status: "Siap", category: "Esensial", checked: false }]);
    setNewName("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-5 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/20 shrink-0">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Pouch (Travel & Essentials Organizer)</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Daftar periksa dokumen penting, perlengkapan esensial, dan kit bepergian.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="rounded-xl border border-border bg-card p-4 flex gap-3">
        <input
          type="text"
          placeholder="Nama barang / dokumen pouch..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer">
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah</span>
        </button>
      </form>

      <div className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
        {items.map((item: any) => (
          <div key={item.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={item.checked} onChange={() => handleToggle(item.id)} className="rounded text-primary size-4" />
              <span className={`font-medium ${item.checked ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.name}</span>
            </label>
            <button type="button" onClick={() => setItems((p: any[]) => p.filter((x) => x.id !== item.id))} className="text-muted-foreground hover:text-rose-500 p-1">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. TRUNK VIEW (Gudang Perkakas & Penyimpanan Rumah)
export function TrunkAppView() {
  const [items, setItems] = useState(() => {
    try {
      const s = localStorage.getItem("aio_trunk_items");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "trk-1", name: "Kotak Perkakas Bor Listrik & Mata Bor", location: "Gudang Bawah Tangga - Box A", quantity: 1, condition: "Bagus" },
      { id: "trk-2", name: "Tenda Camping & Matras Outdoor", location: "Lemari Atas Garasi", quantity: 2, condition: "Bagus" },
      { id: "trk-3", name: "Kabel Ekstensi 20 Meter & Lampu Sorot", location: "Box Perkakas B", quantity: 1, condition: "Bagus" },
    ];
  });

  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("aio_trunk_items", JSON.stringify(items));
    } catch {}
  }, [items]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    setItems((prev: any[]) => [...prev, { id: `trk-${Date.now()}`, name: newName, location: newLocation || "Gudang Utama", quantity: 1, condition: "Bagus" }]);
    setNewName("");
    setNewLocation("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-5 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20 shrink-0">
            <Luggage className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Trunk (Gudang & Perkakas)</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Inventaris perkakas, peralatan musiman, penyimpanan rumah, dan bagasi.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Nama alat / perkakas..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        />
        <input
          type="text"
          placeholder="Lokasi penyimpanan (contoh: Rak Gudang A)..."
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          className="w-full sm:w-56 bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer">
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah</span>
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between gap-3 shadow-xs">
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-600 font-semibold">{item.condition}</span>
              <h3 className="font-bold text-sm text-foreground mt-2">{item.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">📍 {item.location}</p>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted-foreground">
              <span>Qty: {item.quantity}</span>
              <button type="button" onClick={() => setItems((p: any[]) => p.filter((x) => x.id !== item.id))} className="text-muted-foreground hover:text-rose-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
