import React, { useState, useEffect, useMemo } from "react";
import {
  Wallet,
  TrendingDown,
  ShoppingBag,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Search,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Tag,
  Star,
  ExternalLink,
  Layers,
  ChevronRight,
  Check,
} from "lucide-react";

export type WalletTab = "wallet" | "price-compare" | "wishlist" | "warranty";

interface CashTransaction {
  id: string;
  type: "in" | "out";
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface PriceItem {
  id: string;
  itemName: string;
  category: string;
  stores: { storeName: string; price: number; link?: string; note?: string }[];
  targetPrice?: number;
}

interface WishlistItem {
  id: string;
  title: string;
  category: string;
  estimatedPrice: number;
  priority: "Tinggi" | "Sedang" | "Rendah";
  targetDate?: string;
  isPurchased: boolean;
  notes?: string;
}

interface WarrantyItem {
  id: string;
  productName: string;
  store: string;
  purchaseDate: string;
  expiryDate: string;
  invoiceNumber?: string;
  warrantyPeriod: string;
  notes?: string;
}

export function WalletKasView() {
  const [activeTab, setActiveTab] = useState<WalletTab>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("tab");
      if (p === "price-compare" || p === "wishlist" || p === "warranty") return p;
    }
    return "wallet";
  });

  // 1. Transactions state
  const [transactions, setTransactions] = useState<CashTransaction[]>(() => {
    try {
      const s = localStorage.getItem("aio_wallet_transactions");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "tx-1", type: "in", amount: 15000000, category: "Pendapatan", description: "Honor Konsultasi", date: "2026-09-20" },
      { id: "tx-2", type: "out", amount: 450000, category: "Belanja", description: "Keperluan Dapur Mingguan", date: "2026-09-22" },
      { id: "tx-3", type: "out", amount: 150000, category: "Transport", description: "Isi Saldo Tol & Bensin", date: "2026-09-24" },
    ];
  });

  // 2. Price Compare state
  const [priceItems, setPriceItems] = useState<PriceItem[]>(() => {
    try {
      const s = localStorage.getItem("aio_wallet_price_compare");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      {
        id: "pc-1",
        itemName: "Monitor 27 Inch 4K UHD",
        category: "Elektronik",
        targetPrice: 3800000,
        stores: [
          { storeName: "Official Toko A", price: 4200000, note: "Garansi resmi 3 th" },
          { storeName: "Marketplace B", price: 3850000, note: "Cashback 5%" },
          { storeName: "Retail Store C", price: 4450000, note: "Ready stock toko" },
        ],
      },
      {
        id: "pc-2",
        itemName: "Kopi Arabika Single Origin 1kg",
        category: "Kebutuhan Rumah",
        targetPrice: 180000,
        stores: [
          { storeName: "Roastery Mandiri", price: 195000, note: "Fresh roast minggu ini" },
          { storeName: "Toko Grosir Online", price: 175000, note: "Gratis ongkir" },
        ],
      },
    ];
  });

  // 3. Wishlist state
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const s = localStorage.getItem("aio_wallet_wishlist");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "wl-1", title: "Kursi Kerja Ergonomis", category: "Produktivitas", estimatedPrice: 2800000, priority: "Tinggi", targetDate: "2026-10-15", isPurchased: false, notes: "Untuk kenyamanan kerja sesi panjang" },
      { id: "wl-2", title: "Smart Air Purifier HEPA", category: "Kesehatan", estimatedPrice: 1650000, priority: "Sedang", targetDate: "2026-11-01", isPurchased: false, notes: "Menjaga kualitas udara ruang kerja & kamar" },
      { id: "wl-3", title: "Mechanical Keyboard Silent", category: "Kantor", estimatedPrice: 950000, priority: "Rendah", targetDate: "2026-12-20", isPurchased: true, notes: "Sudah terbeli saat promo" },
    ];
  });

  // 4. Warranty state
  const [warranties, setWarranties] = useState<WarrantyItem[]>(() => {
    try {
      const s = localStorage.getItem("aio_wallet_warranties");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "w-1", productName: "Laptop Kerja ThinkPad", store: "Lenovo Official", purchaseDate: "2025-08-10", expiryDate: "2028-08-10", invoiceNumber: "INV/20250810/LN-882", warrantyPeriod: "3 Tahun Premier On-site", notes: "Kartu garansi ada di file digital" },
      { id: "w-2", productName: "Kulkas Inverter 2 Pintu", store: "Electronic City", purchaseDate: "2024-11-05", expiryDate: "2034-11-05", invoiceNumber: "EC-8839201", warrantyPeriod: "10 Tahun Kompresor", notes: "Garansi motor 10 tahun, part 1 tahun" },
      { id: "w-3", productName: "Mesin Kopi Espresso", store: "Otten Coffee", purchaseDate: "2026-02-14", expiryDate: "2027-02-14", invoiceNumber: "OC-INV-7731", warrantyPeriod: "1 Tahun Service & Sparepart", notes: "Simpan nota invoice & dus asli" },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("aio_wallet_transactions", JSON.stringify(transactions));
      localStorage.setItem("aio_wallet_price_compare", JSON.stringify(priceItems));
      localStorage.setItem("aio_wallet_wishlist", JSON.stringify(wishlist));
      localStorage.setItem("aio_wallet_warranties", JSON.stringify(warranties));
    } catch {}
  }, [transactions, priceItems, wishlist, warranties]);

  // Derived calculations
  const totalIn = useMemo(() => transactions.filter((t) => t.type === "in").reduce((acc, c) => acc + c.amount, 0), [transactions]);
  const totalOut = useMemo(() => transactions.filter((t) => t.type === "out").reduce((acc, c) => acc + c.amount, 0), [transactions]);
  const currentBalance = totalIn - totalOut;

  // New item modal states
  const [newTxDesc, setNewTxDesc] = useState("");
  const [newTxAmount, setNewTxAmount] = useState("");
  const [newTxType, setNewTxType] = useState<"in" | "out">("out");
  const [newTxCategory, setNewTxCategory] = useState("Kebutuhan");

  const [newWishlistTitle, setNewWishlistTitle] = useState("");
  const [newWishlistPrice, setNewWishlistPrice] = useState("");
  const [newWishlistPriority, setNewWishlistPriority] = useState<"Tinggi" | "Sedang" | "Rendah">("Sedang");

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxDesc || !newTxAmount) return;
    const amountNum = parseFloat(newTxAmount) || 0;
    const newTx: CashTransaction = {
      id: `tx-${Date.now()}`,
      type: newTxType,
      amount: amountNum,
      category: newTxCategory,
      description: newTxDesc,
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions((prev) => [newTx, ...prev]);
    setNewTxDesc("");
    setNewTxAmount("");
  };

  const handleAddWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishlistTitle) return;
    const priceNum = parseFloat(newWishlistPrice) || 0;
    const item: WishlistItem = {
      id: `wl-${Date.now()}`,
      title: newWishlistTitle,
      category: "Personal",
      estimatedPrice: priceNum,
      priority: newWishlistPriority,
      isPurchased: false,
    };
    setWishlist((prev) => [item, ...prev]);
    setNewWishlistTitle("");
    setNewWishlistPrice("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Wallet dan Kas
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Pencatatan kas, perbandingan harga belanja, wishlist impian, dan bukti garansi.
            </p>
          </div>
        </div>

        {/* Quick summary pill */}
        <div className="flex items-center gap-3 bg-background/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border shrink-0">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Saldo Kas Bersih</span>
            <p className="text-lg font-bold text-foreground">
              Rp {currentBalance.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Selector: The 4 integrated sub-apps */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("wallet")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "wallet"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Wallet className="h-4 w-4 shrink-0" />
          <span>Wallet & Kas Utama</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {transactions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("price-compare")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "price-compare"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <TrendingDown className="h-4 w-4 shrink-0" />
          <span>Pembanding Harga</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {priceItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("wishlist")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "wishlist"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ShoppingBag className="h-4 w-4 shrink-0" />
          <span>Rencana Belanja (Wishlist)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {wishlist.filter((w) => !w.isPurchased).length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("warranty")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "warranty"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Garansi dan Bukti Nota</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {warranties.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Wallet & Kas Utama */}
      {activeTab === "wallet" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="text-xs text-muted-foreground">Total Pemasukan Kas</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <ArrowDownLeft className="h-4 w-4" /> Rp {totalIn.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="text-xs text-muted-foreground">Total Pengeluaran Kas</span>
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> Rp {totalOut.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="text-xs text-muted-foreground">Status Kas Tersedia</span>
              <p className="text-xl font-bold text-primary mt-1">
                {currentBalance >= 0 ? "Surplus Kas" : "Defisit"}
              </p>
            </div>
          </div>

          {/* Form Quick Add */}
          <form onSubmit={handleAddTx} className="rounded-xl border border-border bg-card p-4 flex flex-col md:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Deskripsi transaksi kas..."
              value={newTxDesc}
              onChange={(e) => setNewTxDesc(e.target.value)}
              className="flex-1 w-full bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Nominal (Rp)..."
              value={newTxAmount}
              onChange={(e) => setNewTxAmount(e.target.value)}
              className="w-full md:w-40 bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <select
              value={newTxType}
              onChange={(e) => setNewTxType(e.target.value as "in" | "out")}
              className="w-full md:w-36 bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="out">Pengeluaran (-)</option>
              <option value="in">Pemasukan (+)</option>
            </select>
            <button
              type="submit"
              className="w-full md:w-auto px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Simpan Kas</span>
            </button>
          </form>

          {/* Transactions List */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/40 font-semibold text-xs text-foreground">
              Histori Mutasi Kas Terkini ({transactions.length})
            </div>
            <div className="divide-y divide-border/60">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${tx.type === "in" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                      {tx.type === "in" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{tx.description}</p>
                      <p className="text-[11px] text-muted-foreground">{tx.date} • {tx.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`font-bold font-mono text-sm ${tx.type === "in" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {tx.type === "in" ? "+" : "-"} Rp {tx.amount.toLocaleString("id-ID")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTransactions((prev) => prev.filter((t) => t.id !== tx.id))}
                      className="p-1 text-muted-foreground hover:text-rose-500 transition-colors"
                      title="Hapus transaksi"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pembanding Harga */}
      {activeTab === "price-compare" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {priceItems.map((item) => {
              const lowestPrice = Math.min(...item.stores.map((s) => s.price));
              return (
                <div key={item.id} className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{item.itemName}</h3>
                      <span className="text-[11px] text-muted-foreground">{item.category}</span>
                    </div>
                    {item.targetPrice && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        Target: Rp {item.targetPrice.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                  <div className="divide-y divide-border/60 border border-border rounded-lg overflow-hidden bg-background">
                    {item.stores.map((store, sIdx) => {
                      const isCheapest = store.price === lowestPrice;
                      return (
                        <div key={sIdx} className={`p-2.5 flex items-center justify-between text-xs ${isCheapest ? "bg-emerald-500/10" : ""}`}>
                          <div>
                            <span className="font-semibold text-foreground flex items-center gap-1.5">
                              {store.storeName}
                              {isCheapest && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 font-bold">
                                  Termurah
                                </span>
                              )}
                            </span>
                            {store.note && <span className="text-[10px] text-muted-foreground block">{store.note}</span>}
                          </div>
                          <span className="font-bold font-mono text-foreground">
                            Rp {store.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Rencana Belanja (Wishlist) */}
      {activeTab === "wishlist" && (
        <div className="flex flex-col gap-6">
          {/* Quick Add Wishlist */}
          <form onSubmit={handleAddWishlist} className="rounded-xl border border-border bg-card p-4 flex flex-col md:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Nama barang impian / rencana beli..."
              value={newWishlistTitle}
              onChange={(e) => setNewWishlistTitle(e.target.value)}
              className="flex-1 w-full bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Estimasi harga (Rp)..."
              value={newWishlistPrice}
              onChange={(e) => setNewWishlistPrice(e.target.value)}
              className="w-full md:w-44 bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <select
              value={newWishlistPriority}
              onChange={(e) => setNewWishlistPriority(e.target.value as any)}
              className="w-full md:w-36 bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Tinggi">Prioritas Tinggi</option>
              <option value="Sedang">Prioritas Sedang</option>
              <option value="Rendah">Prioritas Rendah</option>
            </select>
            <button
              type="submit"
              className="w-full md:w-auto px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Wishlist</span>
            </button>
          </form>

          {/* Wishlist Items List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.isPurchased
                    ? "bg-muted/40 border-border opacity-70"
                    : "bg-card border-border hover:border-primary/40 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                      item.priority === "Tinggi"
                        ? "bg-rose-500/15 text-rose-600"
                        : item.priority === "Sedang"
                        ? "bg-amber-500/15 text-amber-600"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {item.priority}
                    </span>
                    <h4 className={`font-bold text-sm text-foreground mt-1 truncate ${item.isPurchased ? "line-through text-muted-foreground" : ""}`}>
                      {item.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWishlist((prev) => prev.map((w) => w.id === item.id ? { ...w, isPurchased: !w.isPurchased } : w))}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      item.isPurchased ? "bg-emerald-500 text-white border-emerald-600" : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                    title={item.isPurchased ? "Tandai belum beli" : "Tandai sudah terbeli"}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-bold font-mono text-foreground">
                    Rp {item.estimatedPrice.toLocaleString("id-ID")}
                  </span>
                  {item.targetDate && (
                    <span className="text-[11px] text-muted-foreground">
                      Target: {item.targetDate}
                    </span>
                  )}
                </div>
                {item.notes && <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2">{item.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Garansi dan Bukti Nota */}
      {activeTab === "warranty" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warranties.map((w) => {
              const isExpired = new Date(w.expiryDate) < new Date();
              return (
                <div key={w.id} className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between gap-3 shadow-xs">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isExpired
                          ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      }`}>
                        {isExpired ? "Garansi Habis" : "Garansi Aktif"}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{w.store}</span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground mt-2">{w.productName}</h3>
                    <p className="text-xs text-primary font-medium mt-0.5">{w.warrantyPeriod}</p>
                  </div>
                  <div className="border-t border-border pt-2 text-[11px] text-muted-foreground flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span>Tanggal Beli:</span>
                      <span className="font-medium text-foreground">{w.purchaseDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Berakhir:</span>
                      <span className="font-semibold text-foreground">{w.expiryDate}</span>
                    </div>
                    {w.invoiceNumber && (
                      <div className="flex justify-between">
                        <span>No. Invoice:</span>
                        <span className="font-mono text-foreground">{w.invoiceNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
