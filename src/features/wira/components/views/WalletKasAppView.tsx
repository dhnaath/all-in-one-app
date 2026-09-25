import React, { useState, useEffect, useMemo } from "react";
import {
  Wallet,
  TrendingDown,
  ShoppingBag,
  ShieldCheck,
  Plus,
  Trash2,
  Search,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Tag,
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  CreditCard,
  Building,
  Coins,
  FileText,
  AlertTriangle,
  Clock,
  ChevronRight,
  Filter,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useRouterState } from "@tanstack/react-router";

export type WalletKasTab = "wallet" | "price-compare" | "wishlist" | "warranty";

interface KasTransaction {
  id: string;
  title: string;
  amount: number;
  type: "in" | "out";
  category: string;
  account: "Dompet Tunai" | "Rekening Utama" | "E-Wallet" | "Rekening Operasional";
  date: string;
  note?: string;
}

interface PriceCompareItem {
  id: string;
  productName: string;
  category: string;
  stores: {
    storeName: string;
    price: number;
    shipping: number;
    url?: string;
    notes?: string;
  }[];
}

interface WishlistItem {
  id: string;
  name: string;
  targetPrice: number;
  priority: "Tinggi" | "Sedang" | "Rendah";
  category: "Peralatan Kerja" | "Hunian & Rumah" | "Gadget" | "Kesehatan" | "Lainnya";
  targetDate: string;
  purchased: boolean;
  link?: string;
  notes?: string;
}

interface WarrantyItem {
  id: string;
  itemName: string;
  serialNumber: string;
  brand: string;
  purchaseDate: string;
  expiryDate: string;
  serviceCenterPhone?: string;
  status: "active" | "urgent" | "expired";
  receiptLocation?: string;
}

const INITIAL_TRANSACTIONS: KasTransaction[] = [
  {
    id: "tx-1",
    title: "Honor Retainer Konsultasi Strategis",
    amount: 35000000,
    type: "in",
    category: "Pendapatan Bisnis",
    account: "Rekening Utama",
    date: "2026-09-20",
    note: "Termin 1 Proyek Transformasi Klien",
  },
  {
    id: "tx-2",
    title: "Belanja Kebutuhan Dapur & Groceries Mingguan",
    amount: 1450000,
    type: "out",
    category: "Kebutuhan Rumah",
    account: "E-Wallet",
    date: "2026-09-22",
    note: "Bahan organik & nutrisi seimbang",
  },
  {
    id: "tx-3",
    title: "Servis Rutin Berkala Mobil Keluarga",
    amount: 1850000,
    type: "out",
    category: "Transportasi",
    account: "Rekening Utama",
    date: "2026-09-23",
    note: "Ganti oli mesin & balancing",
  },
  {
    id: "tx-4",
    title: "Pengisian Kas Tunai Dompet Harian",
    amount: 2000000,
    type: "in",
    category: "Transfer Internal",
    account: "Dompet Tunai",
    date: "2026-09-24",
    note: "Tarik tunai ATM",
  },
];

const INITIAL_PRICE_COMPARE: PriceCompareItem[] = [
  {
    id: "pc-1",
    productName: "Air Purifier HEPA H13 Room 40m²",
    category: "Peralatan Rumah",
    stores: [
      { storeName: "Official Tokopedia", price: 2199000, shipping: 0, notes: "Garansi resmi 2 tahun" },
      { storeName: "Shopee Mall Flagship", price: 2289000, shipping: 25000, notes: "Voucher diskon 50rb" },
      { storeName: "Ace Hardware Offline", price: 2499000, shipping: 0, notes: "Langsung bawa pulang" },
    ],
  },
  {
    id: "pc-2",
    productName: "Monitor 27-inch 4K IPS Ergonomic Stand",
    category: "Peralatan Kerja",
    stores: [
      { storeName: "Distributor IT Mangga Dua", price: 5150000, shipping: 50000, notes: "Garansi 3 tahun pick-up" },
      { storeName: "Tokopedia Official", price: 5400000, shipping: 0, notes: "Cashback poin 3%" },
      { storeName: "E-Catalog Bhinneka", price: 5650000, shipping: 0, notes: "Faktur pajak PPN siap" },
    ],
  },
];

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: "wl-1",
    name: "Kursi Ergonomis Mesh Jaring Lumbar Support",
    targetPrice: 3800000,
    priority: "Tinggi",
    category: "Peralatan Kerja",
    targetDate: "2026-10-15",
    purchased: false,
    notes: "Untuk mencegah nyeri punggung saat sesi analisis intensif",
  },
  {
    id: "wl-2",
    name: "Vacuum Robot Laser Lidar & Auto Empty",
    targetPrice: 4500000,
    priority: "Sedang",
    category: "Hunian & Rumah",
    targetDate: "2026-11-30",
    purchased: false,
    notes: "Otomasi kebersihan lantai ruang kerja & keluarga",
  },
  {
    id: "wl-3",
    name: "Timbangan Smart Scale Komposisi Tubuh",
    targetPrice: 650000,
    priority: "Rendah",
    category: "Kesehatan",
    targetDate: "2026-09-10",
    purchased: true,
    notes: "Sudah terbeli & tersinkron ke dashboard",
  },
];

const INITIAL_WARRANTIES: WarrantyItem[] = [
  {
    id: "w-1",
    itemName: "Mesin Cuci Front Loading Inverter 10kg",
    serialNumber: "SN: WM-LG-2024-9912",
    brand: "LG Electronics",
    purchaseDate: "2024-03-20",
    expiryDate: "2029-03-20",
    serviceCenterPhone: "14010 (Call Center Resmi)",
    status: "active",
    receiptLocation: "Folder Garansi Lemari Lt 2",
  },
  {
    id: "w-2",
    itemName: "Laptop Ultrabook Core Ultra 7",
    serialNumber: "SN: LP-DELL-88210",
    brand: "Dell Precision",
    purchaseDate: "2025-01-15",
    expiryDate: "2027-01-15",
    serviceCenterPhone: "021-1500858 (Dell ProSupport)",
    status: "active",
    receiptLocation: "Email Faktur & Dokumen Digital",
  },
  {
    id: "w-3",
    itemName: "Microwave Oven Convection 28L",
    serialNumber: "SN: MW-PAN-2023-412",
    brand: "Panasonic",
    purchaseDate: "2023-10-05",
    expiryDate: "2026-10-05",
    serviceCenterPhone: "0804-1-111-111",
    status: "urgent",
    receiptLocation: "Kotak Perkakas Dapur",
  },
];

export function WalletKasAppView() {
  const routerState = useRouterState();
  const searchStr = routerState.location.searchStr;

  const [activeTab, setActiveTab] = useState<WalletKasTab>(() => {
    const param = new URLSearchParams(searchStr || "").get("tab");
    if (param && ["wallet", "price-compare", "wishlist", "warranty"].includes(param)) {
      return param as WalletKasTab;
    }
    return "wallet";
  });

  // Sync tab with URL
  useEffect(() => {
    const param = new URLSearchParams(searchStr || "").get("tab");
    if (param && ["wallet", "price-compare", "wishlist", "warranty"].includes(param) && param !== activeTab) {
      setActiveTab(param as WalletKasTab);
    }
  }, [searchStr]);

  const handleTabChange = (tab: WalletKasTab) => {
    setActiveTab(tab);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(window.history.state, "", url.toString());
    } catch {}
  };

  // State
  const [transactions, setTransactions] = useState<KasTransaction[]>(() => {
    try {
      const s = localStorage.getItem("aio_wallet_transactions");
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_TRANSACTIONS;
  });

  const [prices, setPrices] = useState<PriceCompareItem[]>(() => {
    try {
      const s = localStorage.getItem("aio_wallet_price_compare");
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_PRICE_COMPARE;
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const s = localStorage.getItem("aio_wallet_wishlist");
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_WISHLIST;
  });

  const [warranties, setWarranties] = useState<WarrantyItem[]>(() => {
    try {
      const s = localStorage.getItem("aio_wallet_warranties");
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_WARRANTIES;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aio_wallet_transactions", JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem("aio_wallet_price_compare", JSON.stringify(prices));
    } catch {}
  }, [prices]);

  useEffect(() => {
    try {
      localStorage.setItem("aio_wallet_wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem("aio_wallet_warranties", JSON.stringify(warranties));
    } catch {}
  }, [warranties]);

  // Form states
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txTitle, setTxTitle] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txType, setTxType] = useState<"in" | "out">("out");
  const [txCategory, setTxCategory] = useState("Kebutuhan Rumah");
  const [txAccount, setTxAccount] = useState<KasTransaction["account"]>("Rekening Utama");

  const [isAddWishlistOpen, setIsAddWishlistOpen] = useState(false);
  const [wlName, setWlName] = useState("");
  const [wlPrice, setWlPrice] = useState("");
  const [wlPriority, setWlPriority] = useState<WishlistItem["priority"]>("Sedang");
  const [wlCategory, setWlCategory] = useState<WishlistItem["category"]>("Peralatan Kerja");
  const [wlDate, setWlDate] = useState("");

  const [isAddWarrantyOpen, setIsAddWarrantyOpen] = useState(false);
  const [wItemName, setWItemName] = useState("");
  const [wSerial, setWSerial] = useState("");
  const [wBrand, setWBrand] = useState("");
  const [wExpiry, setWExpiry] = useState("");

  // Calculations
  const totalIn = transactions.filter((t) => t.type === "in").reduce((a, b) => a + b.amount, 0);
  const totalOut = transactions.filter((t) => t.type === "out").reduce((a, b) => a + b.amount, 0);
  const totalSaldo = totalIn - totalOut;

  const totalWishlistBudget = wishlist.filter((w) => !w.purchased).reduce((a, b) => a + b.targetPrice, 0);
  const activeWarrantiesCount = warranties.filter((w) => w.status !== "expired").length;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle.trim() || !txAmount) return;
    const newTx: KasTransaction = {
      id: `tx-${Date.now()}`,
      title: txTitle.trim(),
      amount: Math.abs(Number(txAmount)),
      type: txType,
      category: txCategory,
      account: txAccount,
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions([newTx, ...transactions]);
    setIsAddTxOpen(false);
    setTxTitle("");
    setTxAmount("");
  };

  const handleAddWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wlName.trim() || !wlPrice) return;
    const newWl: WishlistItem = {
      id: `wl-${Date.now()}`,
      name: wlName.trim(),
      targetPrice: Math.abs(Number(wlPrice)),
      priority: wlPriority,
      category: wlCategory,
      targetDate: wlDate || new Date().toISOString().split("T")[0],
      purchased: false,
    };
    setWishlist([newWl, ...wishlist]);
    setIsAddWishlistOpen(false);
    setWlName("");
    setWlPrice("");
    setWlDate("");
  };

  const handleAddWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wItemName.trim() || !wExpiry) return;
    const newW: WarrantyItem = {
      id: `w-${Date.now()}`,
      itemName: wItemName.trim(),
      serialNumber: wSerial.trim() || `SN-${Date.now()}`,
      brand: wBrand.trim() || "Resmi",
      purchaseDate: new Date().toISOString().split("T")[0],
      expiryDate: wExpiry,
      status: "active",
    };
    setWarranties([newW, ...warranties]);
    setIsAddWarrantyOpen(false);
    setWItemName("");
    setWSerial("");
    setWBrand("");
    setWExpiry("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-amber-500/5 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
            <Wallet className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                Standalone App
              </span>
              <span className="text-xs text-muted-foreground">Financial & Purchase Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
              Wallet dan Kas
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Kendali arus kas harian, perbandingan harga cerdas, rencana belanja terarah, dan arsip garansi resmi.
            </p>
          </div>
        </div>

        {/* Action / Saldo Highlight */}
        <div className="flex items-center gap-4 bg-background/80 backdrop-blur border border-border rounded-xl p-3.5 px-5">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Total Saldo Kas</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground font-mono mt-0.5">
              {formatRupiah(totalSaldo)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        <button
          onClick={() => handleTabChange("wallet")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0",
            activeTab === "wallet"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Wallet size={15} />
          <span>Wallet & Kas Utama</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {transactions.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange("price-compare")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0",
            activeTab === "price-compare"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <TrendingDown size={15} />
          <span>Pembanding Harga</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {prices.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange("wishlist")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0",
            activeTab === "wishlist"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <ShoppingBag size={15} />
          <span>Rencana Belanja (Wishlist)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {wishlist.filter((w) => !w.purchased).length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange("warranty")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0",
            activeTab === "warranty"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <ShieldCheck size={15} />
          <span>Garansi & Bukti Nota</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {activeWarrantiesCount}
          </span>
        </button>
      </div>

      {/* TAB 1: WALLET & KAS */}
      {activeTab === "wallet" && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground font-medium">Total Penerimaan Kas</span>
                <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                  +{formatRupiah(totalIn)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ArrowDownLeft size={20} />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground font-medium">Total Pengeluaran Kas</span>
                <p className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-1">
                  -{formatRupiah(totalOut)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ArrowUpRight size={20} />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground font-medium">Rekening & Akun Aktif</span>
                <p className="text-lg sm:text-xl font-bold text-foreground mt-1">
                  4 Kanal Dompet
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CreditCard size={20} />
              </div>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <span>Buku Kas & Riwayat Transaksi</span>
            </h3>

            <button
              onClick={() => setIsAddTxOpen(!isAddTxOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer hover:opacity-90 shadow-xs"
            >
              <Plus size={14} />
              <span>Catat Transaksi</span>
            </button>
          </div>

          {/* Add Transaction Form */}
          {isAddTxOpen && (
            <form onSubmit={handleAddTx} className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Keterangan transaksi (contoh: Honor, Makan, Listrik)..."
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Nominal (Rp)..."
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                  required
                />
                <select
                  value={txType}
                  onChange={(e) => setTxType(e.target.value as "in" | "out")}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="out">🔴 Kas Keluar (Pengeluaran)</option>
                  <option value="in">🟢 Kas Masuk (Pemasukan)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={txAccount}
                  onChange={(e) => setTxAccount(e.target.value as any)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="Rekening Utama">Rekening Utama</option>
                  <option value="Dompet Tunai">Dompet Tunai</option>
                  <option value="E-Wallet">E-Wallet (Gopay/OVO/ShopeePay)</option>
                  <option value="Rekening Operasional">Rekening Operasional</option>
                </select>
                <input
                  type="text"
                  placeholder="Kategori (Kebutuhan Rumah / Bisnis / Hiburan)..."
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTxOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          )}

          {/* Transaction List */}
          <div className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden shadow-xs">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 font-bold",
                      tx.type === "in"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {tx.type === "in" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{tx.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{tx.account}</span>
                      <span>•</span>
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span
                      className={cn(
                        "text-sm font-bold font-mono",
                        tx.type === "in" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      )}
                    >
                      {tx.type === "in" ? "+" : "-"}
                      {formatRupiah(tx.amount)}
                    </span>
                  </div>
                  <button
                    onClick={() => setTransactions(transactions.filter((t) => t.id !== tx.id))}
                    className="p-1 text-muted-foreground hover:text-rose-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PEMBANDING HARGA */}
      {activeTab === "price-compare" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <TrendingDown size={16} className="text-amber-500" />
                <span>Matriks Perbandingan Harga Barang</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pantau perbedaan harga antar marketplace & toko resmi untuk memaksimalkan efisiensi anggaran belanja.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prices.map((item) => {
              const sortedStores = [...item.stores].sort((a, b) => a.price + a.shipping - (b.price + b.shipping));
              const bestPrice = sortedStores[0];
              const highestPrice = sortedStores[sortedStores.length - 1];
              const maxSavings = (highestPrice.price + highestPrice.shipping) - (bestPrice.price + bestPrice.shipping);

              return (
                <div key={item.id} className="p-5 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {item.category}
                      </span>
                      {maxSavings > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          Hemat s/d {formatRupiah(maxSavings)}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-foreground mt-2">{item.productName}</h4>

                    {/* Store Price Options */}
                    <div className="mt-3 space-y-2">
                      {sortedStores.map((st, idx) => {
                        const isBest = idx === 0;
                        const totalPrice = st.price + st.shipping;
                        return (
                          <div
                            key={idx}
                            className={cn(
                              "p-2.5 rounded-lg border text-xs flex items-center justify-between",
                              isBest
                                ? "border-emerald-500/30 bg-emerald-500/5 font-medium"
                                : "border-border/60 bg-muted/20"
                            )}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground">{st.storeName}</span>
                                {isBest && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                    Termurah
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-muted-foreground">{st.notes}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-foreground">
                                {formatRupiah(totalPrice)}
                              </span>
                              {st.shipping > 0 && (
                                <p className="text-[9px] text-muted-foreground">Ongkir: {formatRupiah(st.shipping)}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-border pt-2.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Rekomendasi Pembelian: <strong className="text-foreground">{bestPrice.storeName}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: RENCANA BELANJA (WISHLIST) */}
      {activeTab === "wishlist" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <ShoppingBag size={16} className="text-amber-500" />
                <span>Rencana Belanja Prioritas (Wishlist)</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Estimasi alokasi dana tertunda: <strong className="font-mono text-foreground">{formatRupiah(totalWishlistBudget)}</strong>
              </p>
            </div>

            <button
              onClick={() => setIsAddWishlistOpen(!isAddWishlistOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer hover:opacity-90 shadow-xs"
            >
              <Plus size={14} />
              <span>Tambah Wishlist</span>
            </button>
          </div>

          {/* Add Wishlist Form */}
          {isAddWishlistOpen && (
            <form onSubmit={handleAddWishlist} className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Nama barang / rencana belanja..."
                  value={wlName}
                  onChange={(e) => setWlName(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Estimasi harga (Rp)..."
                  value={wlPrice}
                  onChange={(e) => setWlPrice(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                  required
                />
                <select
                  value={wlPriority}
                  onChange={(e) => setWlPriority(e.target.value as any)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="Tinggi">Prioritas Tinggi (Kebutuhan Kritis)</option>
                  <option value="Sedang">Prioritas Sedang</option>
                  <option value="Rendah">Prioritas Rendah (Keinginan)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={wlCategory}
                  onChange={(e) => setWlCategory(e.target.value as any)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="Peralatan Kerja">Peralatan Kerja</option>
                  <option value="Hunian & Rumah">Hunian & Rumah</option>
                  <option value="Gadget">Gadget & Elektronik</option>
                  <option value="Kesehatan">Kesehatan & Kebugaran</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <input
                  type="date"
                  value={wlDate}
                  onChange={(e) => setWlDate(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddWishlistOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs"
                >
                  Simpan ke Wishlist
                </button>
              </div>
            </form>
          )}

          {/* Wishlist Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-4 rounded-xl border bg-card flex flex-col justify-between gap-3 shadow-xs transition-all",
                  item.purchased ? "opacity-60 border-border/50" : "border-border"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        item.priority === "Tinggi"
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          : item.priority === "Sedang"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      {item.priority}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{item.category}</span>
                  </div>

                  <h4
                    className={cn(
                      "font-bold text-sm text-foreground mt-2",
                      item.purchased && "line-through text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </h4>
                  <p className="font-mono font-bold text-sm text-foreground mt-1">
                    {formatRupiah(item.targetPrice)}
                  </p>
                  {item.notes && <p className="text-xs text-muted-foreground mt-1.5">{item.notes}</p>}
                </div>

                <div className="border-t border-border pt-2 flex items-center justify-between text-xs">
                  <button
                    onClick={() =>
                      setWishlist(
                        wishlist.map((w) => (w.id === item.id ? { ...w, purchased: !w.purchased } : w))
                      )
                    }
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium cursor-pointer"
                  >
                    {item.purchased ? (
                      <CheckCircle2 size={15} className="text-emerald-500" />
                    ) : (
                      <Circle size={15} />
                    )}
                    <span>{item.purchased ? "Sudah Terbeli" : "Tandai Terbeli"}</span>
                  </button>

                  <button
                    onClick={() => setWishlist(wishlist.filter((w) => w.id !== item.id))}
                    className="text-muted-foreground hover:text-rose-500 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GARANSI & BUKTI NOTA */}
      {activeTab === "warranty" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Pengingat Garansi & Lokasi Arsip Nota</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cegah hangusnya hak perbaikan gratis dan percepat proses klaim servis resmi saat perangkat terkendala.
              </p>
            </div>

            <button
              onClick={() => setIsAddWarrantyOpen(!isAddWarrantyOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer hover:opacity-90 shadow-xs"
            >
              <Plus size={14} />
              <span>Daftarkan Garansi</span>
            </button>
          </div>

          {/* Add Warranty Form */}
          {isAddWarrantyOpen && (
            <form onSubmit={handleAddWarranty} className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nama perangkat (contoh: TV LED 55 Inch, Laptop Dell)..."
                  value={wItemName}
                  onChange={(e) => setWItemName(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Nomor Seri / Serial Number (SN)..."
                  value={wSerial}
                  onChange={(e) => setWSerial(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Merek / Produsen..."
                  value={wBrand}
                  onChange={(e) => setWBrand(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">Batas Garansi:</span>
                  <input
                    type="date"
                    value={wExpiry}
                    onChange={(e) => setWExpiry(e.target.value)}
                    className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddWarrantyOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs"
                >
                  Simpan Garansi
                </button>
              </div>
            </form>
          )}

          {/* Warranty Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {warranties.map((w) => (
              <div key={w.id} className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        w.status === "active"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : w.status === "urgent"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {w.status === "active" ? "Garansi Aktif" : w.status === "urgent" ? "Segera Berakhir" : "Kedaluwarsa"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{w.brand}</span>
                  </div>

                  <h4 className="font-bold text-sm text-foreground mt-2">{w.itemName}</h4>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">{w.serialNumber}</p>

                  <div className="mt-3 p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Batas Servis:</span>
                      <strong className="text-foreground">{w.expiryDate}</strong>
                    </div>
                    {w.receiptLocation && (
                      <p className="text-[11px] text-muted-foreground">📍 {w.receiptLocation}</p>
                    )}
                    {w.serviceCenterPhone && (
                      <p className="text-[11px] text-muted-foreground">📞 {w.serviceCenterPhone}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Beli: {w.purchaseDate}</span>
                  <button
                    onClick={() => setWarranties(warranties.filter((x) => x.id !== w.id))}
                    className="hover:text-rose-500 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
