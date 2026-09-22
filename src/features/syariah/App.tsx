import React, { useState, useEffect } from "react";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  LayoutDashboard,
  LineChart,
  AlertTriangle,
  FileText,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { MOCK_COMMODITIES } from "./lib/data";
import LocalShariaIndices from "./components/LocalShariaIndices";
import { Commodity } from "./types";
import { cn } from "./lib/utils";
import ProhibitedTransactions from "./components/ProhibitedTransactions";
import IslamicContracts from "./components/IslamicContracts";
import IslamicInsurance from "./components/IslamicInsurance";

export default function App({ onBack }: { onBack?: () => void } = {}) {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [currency, setCurrency] = useState<"IDR" | "USD">("IDR");
  const [weightUnit, setWeightUnit] = useState<"GRAM" | "OZ">("GRAM");
  const [exchangeRate, setExchangeRate] = useState<number>(16000);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Frontend-only build uses deterministic local data by default.
    setCommodities(MOCK_COMMODITIES);
  }, []);

  const formatCurrency = (val: number, isIndex: boolean = false, curr: "IDR" | "USD" = "IDR") => {
    if (isIndex) {
      return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(val);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: curr === "USD" ? 2 : 0,
      maximumFractionDigits: curr === "USD" ? 2 : 0,
    }).format(val);
  };

  const renderCommodityCard = (item: Commodity) => {
    const isUp = item.changePercent24h >= 0;
    const TROY_OUNCE_TO_GRAM = 31.1034768;

    let displayPrice = item.currentPrice;
    let displaySymbol = item.symbol;
    let displayWeightInfo =
      item.weight && item.weight !== 1
        ? `• ${item.weight.toLocaleString("id-ID", { maximumFractionDigits: 3 })}g`
        : "";

    if (!item.isIndex) {
      if (currency === "USD") {
        displayPrice = displayPrice / exchangeRate;
        displaySymbol = displaySymbol.replace("IDR", "USD");
      }

      if (weightUnit === "OZ") {
        if (item.id === "gold_gram" || item.id === "silver_gram") {
          displayPrice = displayPrice * TROY_OUNCE_TO_GRAM;
          displayWeightInfo = `• 1 oz`;
        } else if (item.id === "dinar" || item.id === "dirham") {
          const ozWeight = item.weight ? item.weight / TROY_OUNCE_TO_GRAM : 0;
          displayWeightInfo = `• ${ozWeight.toLocaleString("id-ID", { maximumFractionDigits: 3 })} oz`;
        }
      } else {
        if (item.id === "gold_gram" || item.id === "silver_gram") {
          displayWeightInfo = `• 1 g`;
        }
      }
    }

    return (
      <div
        key={item.id}
        className="bg-card p-5 rounded-2xl shadow-sm border border-border/40 flex flex-col justify-between h-32 transition-all hover:shadow-md hover:border-border"
      >
        <div className="flex justify-between items-start w-full">
          <div>
            <h3 className="font-semibold text-foreground">{item.name}</h3>
            <span className="text-xs text-muted-foreground font-medium mt-1 block truncate max-w-[150px]">
              {displaySymbol} {displayWeightInfo}
            </span>
          </div>
          <div
            className={cn(
              "p-1.5 rounded-lg",
              isUp ? "bg-emerald-50 text-primary" : "bg-rose-50 text-rose-600",
            )}
          >
            {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          </div>
        </div>
        <div className="flex justify-between items-end w-full mt-auto">
          <span className="text-xl font-bold text-foreground truncate pr-2">
            {formatCurrency(displayPrice, item.isIndex, item.isIndex ? "IDR" : currency)}
          </span>
          <span
            className={cn(
              "text-sm font-semibold shrink-0",
              isUp ? "text-primary" : "text-rose-600",
            )}
          >
            {isUp ? "+" : ""}
            {item.changePercent24h.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  };

  const TABS = [
    { id: "dashboard", label: "Dashboard Pasar", icon: LayoutDashboard },
    { id: "indices", label: "Indeks Sharia", icon: LineChart },
    { id: "prohibited", label: "Transaksi Terlarang", icon: AlertTriangle },
    { id: "contracts", label: "Akad Syariah", icon: FileText },
    { id: "insurance", label: "Asuransi Syariah", icon: Shield },
  ];

  return (
    <div className="flex h-full w-full bg-transparent text-foreground overflow-hidden font-sans relative">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex w-[240px] shrink-0 bg-transparent border-r border-border/40 flex-col transition-all">
        {onBack && (
          <div
            onClick={onBack}
            className="h-10 flex items-center px-4 cursor-pointer hover:bg-secondary/50 transition-colors text-muted-foreground border-b border-border/40"
          >
            <ChevronLeft size={16} className="mr-1" />
            <span className="text-[13px] font-medium">Kembali</span>
          </div>
        )}

        <div className="h-14 flex items-center px-4 mb-2 shrink-0 border-b border-border/40">
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-primary rounded-lg text-white flex items-center justify-center shadow-sm">
              <Activity size={16} strokeWidth={2.5} />
            </div>
            <span className="ml-3 font-bold text-[15px] text-foreground tracking-tight">
              Pasar Muamalah
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {TABS.map((tab) => (
            <NavItem
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-background/20 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative w-[280px] h-full bg-card border-r border-border/40 flex flex-col shadow-2xl animate-in slide-in-from-left">
            <div className="h-14 flex items-center justify-between px-4 border-b border-border/40 bg-card">
              <div className="flex items-center">
                <div className="w-7 h-7 bg-primary rounded-lg text-white flex items-center justify-center shadow-sm">
                  <Activity size={16} strokeWidth={2.5} />
                </div>
                <span className="ml-3 font-bold text-[15px] text-foreground">Pasar Muamalah</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 -mr-2 text-muted-foreground hover:bg-secondary rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {TABS.map((tab) => (
                <NavItem
                  key={tab.id}
                  icon={tab.icon}
                  label={tab.label}
                  active={activeTab === tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent relative">
        <div className="h-14 border-b border-border/40 flex items-center px-4 sm:px-6 bg-transparent shrink-0 sticky top-0 z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 mr-2 text-foreground/80 hover:bg-secondary rounded-lg"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-foreground">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-hide bg-transparent">
          <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {activeTab === "dashboard" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Kutipan Harga</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Harga komoditas & pasar saham real-time.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-card p-1 rounded-xl border border-border/40 shadow-sm">
                    <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
                      <button
                        onClick={() => setCurrency("IDR")}
                        className={cn(
                          "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                          currency === "IDR"
                            ? "bg-card shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        IDR
                      </button>
                      <button
                        onClick={() => setCurrency("USD")}
                        className={cn(
                          "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                          currency === "USD"
                            ? "bg-card shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        USD
                      </button>
                    </div>
                    <div className="w-px h-6 bg-secondary"></div>
                    <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
                      <button
                        onClick={() => setWeightUnit("GRAM")}
                        className={cn(
                          "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                          weightUnit === "GRAM"
                            ? "bg-card shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        GRAM
                      </button>
                      <button
                        onClick={() => setWeightUnit("OZ")}
                        className={cn(
                          "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                          weightUnit === "OZ"
                            ? "bg-card shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        OZ
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    Logam Mulia
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
                    {commodities.filter((item) => !item.isIndex).map(renderCommodityCard)}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 mt-8">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Indeks Global
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                    {commodities.filter((item) => item.isIndex).map(renderCommodityCard)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "indices" && (
              <div className="animate-in fade-in duration-300">
                <LocalShariaIndices />
              </div>
            )}

            {activeTab === "prohibited" && (
              <div className="animate-in fade-in duration-300">
                <ProhibitedTransactions />
              </div>
            )}

            {activeTab === "contracts" && (
              <div className="animate-in fade-in duration-300">
                <IslamicContracts />
              </div>
            )}

            {activeTab === "insurance" && (
              <div className="animate-in fade-in duration-300">
                <IslamicInsurance />
              </div>
            )}

            <footer className="pt-8 mt-12 border-t border-border/40 text-center text-xs text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-2">
              <span>Data didukung oleh Yahoo Finance</span>
              <span>© 2024 Sahala Terminal • Pasar Muamalah Global</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, count, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-2.5 rounded-xl cursor-pointer transition-colors group",
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "hover:bg-secondary border border-transparent text-foreground/80",
      )}
    >
      <Icon
        size={18}
        className={cn(
          "mr-3",
          active
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground/80 transition-colors",
        )}
      />
      <span className="flex-1 text-[13px]">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full",
            active
              ? "bg-primary/20 text-primary"
              : "text-muted-foreground group-hover:bg-secondary",
          )}
        >
          {count}
        </span>
      )}
    </div>
  );
}
