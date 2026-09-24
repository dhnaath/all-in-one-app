import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Calendar,
  Receipt,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  BarChart3,
  X,
  Trash2,
  Tag,
  Building2,
  FileCheck2,
  Store,
  Layers,
  TrendingDown,
  ShieldCheck,
  CreditCard,
  PieChart,
  ArrowDownRight,
} from "lucide-react";
import { useExpenseStore } from "./store";
import { Expense, ExpenseCategoryKey, ExpenseStatus, ExpenseViewMode } from "./types";

export function ExpenseTrackerApp() {
  const { expenses, addExpense, updateExpense, deleteExpense, setStatus } = useExpenseStore();

  const [activeTab, setActiveTab] = useState<ExpenseViewMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [accountFilter, setAccountFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Expense Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expTitle, setExpTitle] = useState("");
  const [expAmount, setExpAmount] = useState("250000");
  const [expCategory, setExpCategory] = useState<ExpenseCategoryKey>("food_beverage");
  const [expDate, setExpDate] = useState(new Date().toISOString().split("T")[0]);
  const [expAccount, setExpAccount] = useState("Kas Kecil (Petty Cash)");
  const [expMerchant, setExpMerchant] = useState("");
  const [expHasReceipt, setExpHasReceipt] = useState(true);
  const [expIsTaxDeductible, setExpIsTaxDeductible] = useState(true);
  const [expTags, setExpTags] = useState("Operasional");
  const [expNotes, setExpNotes] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  // Metrics
  const metrics = useMemo(() => {
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const taxDeductibleTotal = expenses
      .filter((e) => e.isTaxDeductible)
      .reduce((sum, e) => sum + e.amount, 0);
    const receiptCount = expenses.filter((e) => e.hasReceipt).length;
    const avgExpense = expenses.length > 0 ? Math.round(totalAmount / expenses.length) : 0;
    const receiptCompliance =
      expenses.length > 0 ? Math.round((receiptCount / expenses.length) * 100) : 0;

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    // Merchant breakdown
    const merchantTotals: Record<string, { total: number; count: number }> = {};
    expenses.forEach((e) => {
      if (!merchantTotals[e.merchant]) {
        merchantTotals[e.merchant] = { total: 0, count: 0 };
      }
      merchantTotals[e.merchant].total += e.amount;
      merchantTotals[e.merchant].count += 1;
    });

    return {
      totalAmount,
      taxDeductibleTotal,
      avgExpense,
      receiptCompliance,
      categoryTotals,
      merchantTotals,
    };
  }, [expenses]);

  // Unique Accounts for filter
  const accountsList = useMemo(() => {
    return Array.from(new Set(expenses.map((e) => e.paymentAccount)));
  }, [expenses]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (activeTab === "tax_deductible" && !e.isTaxDeductible) return false;
      if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
      if (accountFilter !== "all" && e.paymentAccount !== accountFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.merchant.toLowerCase().includes(q) ||
          e.paymentAccount.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          (e.notes || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [expenses, activeTab, categoryFilter, accountFilter, searchQuery]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) return;

    addExpense({
      title: expTitle.trim(),
      amount: parseFloat(expAmount) || 0,
      currency: "IDR",
      category: expCategory,
      date: expDate,
      paymentAccount: expAccount.trim() || "Kas Kecil (Petty Cash)",
      merchant: expMerchant.trim() || "Merchant Umum",
      hasReceipt: expHasReceipt,
      isTaxDeductible: expIsTaxDeductible,
      status: "cleared",
      tags: expTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      notes: expNotes.trim() || undefined,
    });

    showToast(`Pengeluaran "${expTitle}" sebesar ${formatIDR(parseFloat(expAmount))} berhasil dicatat!`);
    setIsModalOpen(false);
    setExpTitle("");
    setExpMerchant("");
    setExpNotes("");
  };

  const getCategoryLabel = (cat: ExpenseCategoryKey) => {
    switch (cat) {
      case "food_beverage":
        return "Makanan & Minuman";
      case "transportation":
        return "Transportasi & Bensin";
      case "office_supplies":
        return "ATK & Perlengkapan";
      case "software_tech":
        return "Software & Teknologi";
      case "marketing":
        return "Pemasaran & Iklan";
      case "utilities":
        return "Utilitas (Listrik/Internet)";
      case "entertainment":
        return "Entertainment & Relasi";
      case "travel":
        return "Perjalanan Dinas";
      case "medical":
        return "Kesehatan & Medis";
      case "taxes_fees":
        return "Pajak & Administrasi";
      default:
        return "Lain-lain";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6 lg:p-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-400 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-xl shadow-lg shadow-rose-500/20">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">Expense Tracker</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  App #39
                </span>
                <span className="text-xs text-slate-400">
                  Pencatatan Biaya, Akun, Merchant & Kepatuhan Bukti Struk
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                Mencatat pengeluaran operasional berdasarkan kategori, akun kas/bank, merchant, struk bukti, dan validasi pajak.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-lg text-sm font-semibold shadow-md shadow-rose-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Pengeluaran</span>
          </button>
        </div>
      </header>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Pengeluaran</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-white">
            {formatIDR(metrics.totalAmount)}
          </div>
          <div className="text-[11px] text-slate-400">{expenses.length} transaksi tercatat</div>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Tax-Deductible</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-emerald-400">
            {formatIDR(metrics.taxDeductibleTotal)}
          </div>
          <div className="text-[11px] text-slate-400">Biaya fiskal pengurang pajak</div>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Rata-Rata Transaksi</span>
            <TrendingDown className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-sky-400">
            {formatIDR(metrics.avgExpense)}
          </div>
          <div className="text-[11px] text-slate-400">Per pengeluaran rata-rata</div>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Kepatuhan Struk (Receipt)</span>
            <FileCheck2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-amber-400">
            {metrics.receiptCompliance}%
          </div>
          <div className="text-[11px] text-slate-400">Memiliki bukti pembayaran valid</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 mt-4 border-b border-slate-800/80 scrollbar-none">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "all"
              ? "bg-rose-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Semua Pengeluaran ({expenses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("by_category")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "by_category"
              ? "bg-rose-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <PieChart className="w-4 h-4 text-purple-400" />
          <span>Kategori Biaya</span>
        </button>

        <button
          onClick={() => setActiveTab("merchants")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "merchants"
              ? "bg-rose-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Store className="w-4 h-4 text-amber-400" />
          <span>Direktori Merchant & Vendor</span>
        </button>

        <button
          onClick={() => setActiveTab("tax_deductible")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "tax_deductible"
              ? "bg-rose-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Pajak & Deductible ({expenses.filter((e) => e.isTaxDeductible).length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 mt-4">
        {/* CATEGORY BREAKDOWN VIEW */}
        {activeTab === "by_category" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-rose-400" />
                Alokasi Pengeluaran per Kategori
              </h3>

              <div className="space-y-3">
                {Object.entries(metrics.categoryTotals).map(([cat, total]) => {
                  const percentage =
                    metrics.totalAmount > 0 ? Math.round((total / metrics.totalAmount) * 100) : 0;

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-200">
                          {getCategoryLabel(cat as ExpenseCategoryKey)}
                        </span>
                        <span className="text-slate-300">
                          {formatIDR(total)} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="h-full bg-rose-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MERCHANTS VIEW */}
        {activeTab === "merchants" && (
          <div className="space-y-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(metrics.merchantTotals).map(([merchant, data]) => (
                <div
                  key={merchant}
                  className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <Store className="w-4 h-4 text-amber-400" />
                      {merchant}
                    </div>
                    <div className="text-xs text-slate-400">{data.count} transaksi pembelian</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-rose-400">{formatIDR(data.total)}</div>
                    <div className="text-[10px] text-slate-500">Total Akumulasi</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALL & TAX DEDUCTIBLE TRANSACTIONS VIEW */}
        {(activeTab === "all" || activeTab === "tax_deductible") && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari deskripsi, merchant, tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-rose-500"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="food_beverage">Makanan & Minuman</option>
                  <option value="transportation">Transportasi</option>
                  <option value="office_supplies">ATK & Kantor</option>
                  <option value="software_tech">Software & Tech</option>
                  <option value="travel">Perjalanan Dinas</option>
                  <option value="utilities">Utilitas</option>
                </select>

                <select
                  value={accountFilter}
                  onChange={(e) => setAccountFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-rose-500"
                >
                  <option value="all">Semua Akun / Sumber</option>
                  {accountsList.map((acc) => (
                    <option key={acc} value={acc}>
                      {acc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expenses List */}
            <div className="space-y-2.5">
              {filteredExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between gap-4 hover:border-slate-600 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-100">{exp.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700 text-slate-300">
                        {getCategoryLabel(exp.category)}
                      </span>
                      {exp.isTaxDeductible && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          DEDUCTIBLE
                        </span>
                      )}
                      {exp.hasReceipt ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> STRUK OK
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          TANPA STRUK
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                      <span>
                        Merchant: <strong className="text-slate-300">{exp.merchant}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Akun: <strong className="text-slate-300">{exp.paymentAccount}</strong>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">{exp.date}</span>
                    </div>

                    {exp.notes && (
                      <p className="text-[11px] text-slate-500 italic">"{exp.notes}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-rose-400">
                        -{formatIDR(exp.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">{exp.status}</div>
                    </div>

                    <button
                      onClick={() => {
                        deleteExpense(exp.id);
                        showToast("Pengeluaran dihapus.");
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD EXPENSE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Catat Pengeluaran Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Pengeluaran <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Makan Siang Klien, Bensin Operasional"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Jumlah Biaya (Rp) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="food_beverage">Makanan & Minuman</option>
                    <option value="transportation">Transportasi & Bensin</option>
                    <option value="office_supplies">ATK & Kantor</option>
                    <option value="software_tech">Software & Teknologi</option>
                    <option value="travel">Perjalanan Dinas</option>
                    <option value="utilities">Utilitas</option>
                    <option value="other">Lain-lain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Merchant / Vendor</label>
                  <input
                    type="text"
                    placeholder="mis. Pertamina, Tokopedia"
                    value={expMerchant}
                    onChange={(e) => setExpMerchant(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Akun Sumber Pembayaran
                </label>
                <select
                  value={expAccount}
                  onChange={(e) => setExpAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                >
                  <option value="Kas Kecil (Petty Cash)">Kas Kecil (Petty Cash)</option>
                  <option value="Bank Mandiri Operasional">Bank Mandiri Operasional</option>
                  <option value="BCA Giro Operasional">BCA Giro Operasional</option>
                  <option value="Kartu Kredit Mandiri Corporate">Kartu Kredit Mandiri Corporate</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasReceipt"
                    checked={expHasReceipt}
                    onChange={(e) => setExpHasReceipt(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0"
                  />
                  <label htmlFor="hasReceipt" className="text-xs text-slate-300 font-medium">
                    Ada Struk / Bukti Bayar
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="taxDeduct"
                    checked={expIsTaxDeductible}
                    onChange={(e) => setExpIsTaxDeductible(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <label htmlFor="taxDeduct" className="text-xs text-slate-300 font-medium">
                    Tax-Deductible
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catatan / Keterangan
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan tambahan keperluan bisnis..."
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Pengeluaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
