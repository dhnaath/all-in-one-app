import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  BarChart3,
  X,
  Trash2,
  ExternalLink,
  RefreshCw,
  Zap,
  TrendingUp,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  Layers,
  Pause,
  Play,
  History,
  Tag,
  Check,
  Building,
} from "lucide-react";
import { useSubscriptionStore, getMonthlyEquivalent } from "./store";
import {
  Subscription,
  SubscriptionCategory,
  BillingCycle,
  SubscriptionStatus,
  SubscriptionViewMode,
} from "./types";

export function SubscriptionManagerApp() {
  const {
    subscriptions,
    billingHistory,
    selectedSubscriptionId,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    setStatus,
    recordRenewalPayment,
    setSelectedSubscriptionId,
  } = useSubscriptionStore();

  const [activeTab, setActiveTab] = useState<SubscriptionViewMode>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [cycleFilter, setCycleFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Subscription Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subName, setSubName] = useState("");
  const [subCategory, setSubCategory] = useState<SubscriptionCategory>("work_software");
  const [subPrice, setSubPrice] = useState("350000");
  const [subCurrency, setSubCurrency] = useState("IDR");
  const [subCycle, setSubCycle] = useState<BillingCycle>("monthly");
  const [subStartDate, setSubStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [subNextRenewal, setSubNextRenewal] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );
  const [subAutoRenew, setSubAutoRenew] = useState(true);
  const [subPaymentMethod, setSubPaymentMethod] = useState("Kartu Kredit BCA");
  const [subIsTrial, setSubIsTrial] = useState(false);
  const [subTrialEndDate, setSubTrialEndDate] = useState("");
  const [subWebsiteUrl, setSubWebsiteUrl] = useState("");
  const [subNotes, setSubNotes] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations & Analytics
  const metrics = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status === "active" || s.status === "trial");
    const totalMonthlyCost = activeSubs.reduce(
      (sum, s) => sum + getMonthlyEquivalent(s.price, s.billingCycle),
      0
    );
    const annualizedCost = totalMonthlyCost * 12;

    // Upcoming renewals in next 7 days
    const now = new Date();
    const in7Days = new Date(Date.now() + 7 * 86400000);
    const upcomingRenewals = activeSubs.filter((s) => {
      const ren = new Date(s.nextRenewalDate);
      return ren >= now && ren <= in7Days;
    });

    // Trials active
    const activeTrials = subscriptions.filter((s) => s.status === "trial");

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    activeSubs.forEach((s) => {
      const mec = getMonthlyEquivalent(s.price, s.billingCycle);
      categoryTotals[s.category] = (categoryTotals[s.category] || 0) + mec;
    });

    return {
      activeCount: activeSubs.length,
      totalCount: subscriptions.length,
      totalMonthlyCost,
      annualizedCost,
      upcomingRenewals,
      activeTrials,
      categoryTotals,
    };
  }, [subscriptions]);

  // Filtered Subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((s) => {
      // Tab filter
      if (activeTab === "active" && s.status !== "active" && s.status !== "trial") return false;
      if (activeTab === "trials" && s.status !== "trial") return false;
      if (activeTab === "renewals") {
        const ren = new Date(s.nextRenewalDate);
        const in14Days = new Date(Date.now() + 14 * 86400000);
        if (ren > in14Days) return false;
      }

      // Dropdown filters
      if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
      if (cycleFilter !== "all" && s.billingCycle !== cycleFilter) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.paymentMethod.toLowerCase().includes(q) ||
          (s.notes || "").toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [subscriptions, activeTab, categoryFilter, cycleFilter, searchQuery]);

  const handleCreateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subPrice) return;

    createSubscription({
      name: subName.trim(),
      category: subCategory,
      price: parseFloat(subPrice) || 0,
      currency: subCurrency,
      billingCycle: subCycle,
      startDate: subStartDate,
      nextRenewalDate: subNextRenewal,
      autoRenew: subAutoRenew,
      status: subIsTrial ? "trial" : "active",
      trialEndDate: subIsTrial ? subTrialEndDate || undefined : undefined,
      paymentMethod: subPaymentMethod.trim() || "Kartu Kredit",
      reminderDaysBefore: 3,
      websiteUrl: subWebsiteUrl.trim() || undefined,
      notes: subNotes.trim() || undefined,
    });

    showToast(`Langganan "${subName}" berhasil ditambahkan ke pemantauan!`);
    setIsModalOpen(false);
    setSubName("");
    setSubNotes("");
  };

  const formatIDR = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const getCategoryBadge = (cat: SubscriptionCategory) => {
    switch (cat) {
      case "cloud_infrastructure":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Cloud & Server</span>;
      case "work_software":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Work Software</span>;
      case "entertainment":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Hiburan & Media</span>;
      case "fitness":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Kesehatan & Gym</span>;
      case "finance":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Finance & Tools</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">Lainnya</span>;
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
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">Subscription Manager</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  App #38
                </span>
                <span className="text-xs text-slate-400">
                  Recurring Cost & Billing Lifecycle Manager
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                Layanan berlangganan software, cloud, membership, recurring billing cycle, serta pengingat renewal otomatis.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Langganan Baru</span>
          </button>
        </div>
      </header>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Monthly Burn Rate</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-white">
            {formatIDR(metrics.totalMonthlyCost)}
          </div>
          <div className="text-[11px] text-slate-400">Beban tetap bulanan (MEC)</div>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Annual Run Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-emerald-400">
            {formatIDR(metrics.annualizedCost)}
          </div>
          <div className="text-[11px] text-slate-400">Proyeksi tahunan total</div>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Langganan Aktif</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-sky-400">
            {metrics.activeCount} <span className="text-xs text-slate-400 font-normal">layanan</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {metrics.activeTrials.length > 0 ? `${metrics.activeTrials.length} dalam uji coba (trial)` : "Semua berbayar"}
          </div>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Renewal Minggu Ini</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-amber-400">
            {metrics.upcomingRenewals.length} <span className="text-xs text-slate-400 font-normal">perlu dibayar</span>
          </div>
          <div className="text-[11px] text-slate-400">Jatuh tempo dlm 7 hari ke depan</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 mt-4 border-b border-slate-800/80 scrollbar-none">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "active"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Langganan Aktif ({metrics.activeCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("renewals")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "renewals"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Jadwal Perpanjangan & Renewal</span>
        </button>

        <button
          onClick={() => setActiveTab("trials")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "trials"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Masa Uji Coba / Trial ({metrics.activeTrials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "analytics"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Analisis Beban Biaya</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition shrink-0 ${
            activeTab === "history"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <History className="w-4 h-4 text-sky-400" />
          <span>Riwayat Tagihan ({billingHistory.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 mt-4">
        {/* ANALYTICS VIEW */}
        {activeTab === "analytics" && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                Distribusi Pengeluaran Bulanan per Kategori
              </h3>

              <div className="space-y-3">
                {Object.entries(metrics.categoryTotals).map(([cat, total]) => {
                  const percentage =
                    metrics.totalMonthlyCost > 0
                      ? Math.round((total / metrics.totalMonthlyCost) * 100)
                      : 0;

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300 capitalize">
                          {cat.replace("_", " ")}
                        </span>
                        <span className="text-slate-200">
                          {formatIDR(total)} / bln ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-400 leading-relaxed">
              <strong>Tips Efisiensi Ekosistem:</strong> Langganan bertipe tahunan (*annually*) umumnya menghemat 15–25% dibandingkan pembayaran bulanan. Periksa layanan dengan penggunaan rendah (*low frequency*) untuk dijeda atau dibatalkan sebelum tanggal renewal berikutnya.
            </div>
          </div>
        )}

        {/* BILLING HISTORY VIEW */}
        {activeTab === "history" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl text-xs text-slate-400">
              Log pembayaran tagihan perpanjangan yang telah dicatat atau diproses auto-debit.
            </div>

            <div className="space-y-2">
              {billingHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{item.subscriptionName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-slate-400">
                      Metode: <strong className="text-slate-300">{item.paymentMethod}</strong> • Tanggal:{" "}
                      <span className="font-mono text-slate-300">{item.billingDate}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">{formatIDR(item.amount)}</div>
                    <div className="text-[11px] text-slate-400">{item.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE & RENEWALS & TRIALS VIEW */}
        {(activeTab === "active" || activeTab === "renewals" || activeTab === "trials" || activeTab === "all") && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari layanan, kartu pembayaran, catatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="work_software">Work Software</option>
                  <option value="cloud_infrastructure">Cloud & Server</option>
                  <option value="entertainment">Hiburan & Media</option>
                  <option value="fitness">Kesehatan & Gym</option>
                  <option value="finance">Finance</option>
                </select>

                <select
                  value={cycleFilter}
                  onChange={(e) => setCycleFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Semua Siklus</option>
                  <option value="monthly">Bulanan</option>
                  <option value="annually">Tahunan</option>
                  <option value="quarterly">Tiga Bulanan</option>
                  <option value="weekly">Mingguan</option>
                </select>
              </div>
            </div>

            {/* Subscriptions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubscriptions.map((sub) => {
                const daysUntilRenewal = Math.ceil(
                  (new Date(sub.nextRenewalDate).getTime() - Date.now()) / (1000 * 3600 * 24)
                );
                const isUrgent = daysUntilRenewal <= 3 && daysUntilRenewal >= 0;

                return (
                  <div
                    key={sub.id}
                    className={`p-5 bg-slate-800/80 border rounded-xl flex flex-col justify-between space-y-4 transition ${
                      sub.status === "trial"
                        ? "border-rose-500/50 shadow-lg shadow-rose-500/5"
                        : isUrgent
                        ? "border-amber-500/50 shadow-lg shadow-amber-500/5"
                        : "border-slate-700"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryBadge(sub.category)}
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {sub.billingCycle}
                          </span>
                        </div>

                        {sub.status === "trial" ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                            TRIAL ENDS SOON
                          </span>
                        ) : sub.status === "paused" ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700 text-slate-400">
                            Dijeda
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Aktif
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                            {sub.name}
                            {sub.websiteUrl && (
                              <a
                                href={sub.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-500 hover:text-indigo-400"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </h3>
                        </div>

                        <div className="text-lg font-extrabold text-white mt-1">
                          {formatIDR(sub.price)}{" "}
                          <span className="text-xs font-normal text-slate-400">
                            / {sub.billingCycle}
                          </span>
                        </div>
                      </div>

                      {/* Renewal Warning / Info */}
                      <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Jatuh Tempo:</span>
                          <span
                            className={`font-semibold font-mono ${
                              isUrgent ? "text-amber-400 font-bold" : "text-slate-200"
                            }`}
                          >
                            {sub.nextRenewalDate} ({daysUntilRenewal > 0 ? `${daysUntilRenewal} hari lagi` : "Hari ini"})
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-slate-400">
                          <span>Metode Pembayaran:</span>
                          <span className="text-slate-300 truncate max-w-[140px]">{sub.paymentMethod}</span>
                        </div>
                      </div>

                      {sub.notes && (
                        <p className="text-xs text-slate-400 line-clamp-1 italic">
                          "{sub.notes}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            recordRenewalPayment(sub.id);
                            showToast(`Pembayaran renewal ${sub.name} dicatat!`);
                          }}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1 shadow-sm"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Bayar / Renew</span>
                        </button>

                        <button
                          onClick={() => {
                            const newStatus = sub.status === "paused" ? "active" : "paused";
                            setStatus(sub.id, newStatus);
                            showToast(
                              newStatus === "paused"
                                ? `Langganan ${sub.name} dijeda.`
                                : `Langganan ${sub.name} diaktifkan kembali.`
                            );
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-700"
                          title={sub.status === "paused" ? "Lanjutkan" : "Jeda"}
                        >
                          {sub.status === "paused" ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          deleteSubscription(sub.id);
                          showToast(`Langganan ${sub.name} dihapus.`);
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: NEW SUBSCRIPTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Tambah Layanan Berlangganan Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubscription} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Layanan / Software <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. GitHub Copilot, Zoom Pro, AWS Cloud"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="work_software">Work Software</option>
                    <option value="cloud_infrastructure">Cloud Infrastructure</option>
                    <option value="entertainment">Hiburan & Media</option>
                    <option value="fitness">Kesehatan / Gym</option>
                    <option value="finance">Finance / Tools</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Siklus Penagihan</label>
                  <select
                    value={subCycle}
                    onChange={(e) => setSubCycle(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="monthly">Bulanan (Monthly)</option>
                    <option value="annually">Tahunan (Annually)</option>
                    <option value="quarterly">Tiga Bulanan (Quarterly)</option>
                    <option value="weekly">Mingguan (Weekly)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Biaya per Siklus (Rp) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={subPrice}
                    onChange={(e) => setSubPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Next Renewal Date</label>
                  <input
                    type="date"
                    required
                    value={subNextRenewal}
                    onChange={(e) => setSubNextRenewal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Metode Pembayaran
                </label>
                <input
                  type="text"
                  placeholder="mis. Kartu Kredit Mandiri Corporate, GoPay, BCA VA"
                  value={subPaymentMethod}
                  onChange={(e) => setSubPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="trialCheck"
                  checked={subIsTrial}
                  onChange={(e) => setSubIsTrial(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0"
                />
                <label htmlFor="trialCheck" className="text-xs text-slate-300">
                  Sedang dalam Masa Uji Coba Gratis (Free Trial)
                </label>
              </div>

              {subIsTrial && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Batas Akhir Trial (Sebelum Dikenakan Biaya)
                  </label>
                  <input
                    type="date"
                    value={subTrialEndDate}
                    onChange={(e) => setSubTrialEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catatan / Keterangan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="mis. Akun tim pengembang sprint 4 orang"
                  value={subNotes}
                  onChange={(e) => setSubNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
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
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Langganan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
