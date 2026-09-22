import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { MOCK_COMMODITIES } from "../lib/data";
import { Commodity } from "../types";
import { cn } from "../lib/utils";

export default function SyariahDashboard() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [currency, setCurrency] = useState<"IDR" | "USD">("IDR");
  const [weightUnit, setWeightUnit] = useState<"GRAM" | "OZ">("GRAM");
  const [exchangeRate, setExchangeRate] = useState<number>(16000);

  useEffect(() => {
    // In a real app, you would fetch the exchange rate here
    setExchangeRate(15850);
  }, []);

  useEffect(() => {
    // Simulate real-time updates for commodities
    const fetchLiveIndices = () => {
      setCommodities(
        MOCK_COMMODITIES.map((c) => {
          // Add some random noise for mock live updates (-0.5% to +0.5%)
          const noise = 1 + (Math.random() * 0.01 - 0.005);
          return {
            ...c,
            currentPrice: c.currentPrice * noise,
          };
        }),
      );
    };

    fetchLiveIndices();
    const interval = setInterval(fetchLiveIndices, 60000); // Update every minute
    return () => clearInterval(interval);
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
    const displaySymbol = item.symbol;
    let displayWeightInfo = "";

    if (!item.isIndex) {
      // Calculate based on selected currency
      if (currency === "IDR") {
        displayPrice = item.currentPrice * exchangeRate;
      }

      // Calculate based on selected weight unit
      if (weightUnit === "GRAM") {
        displayPrice = displayPrice / TROY_OUNCE_TO_GRAM;
        if (currency === "IDR") {
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
              isUp ? "bg-primary/10 text-primary" : "bg-rose-50 text-rose-600",
            )}
          >
            {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-[17px] font-bold text-foreground">
            {formatCurrency(displayPrice, item.isIndex, item.isIndex ? "USD" : currency)}
          </div>
          <div
            className={cn(
              "text-[11px] font-semibold flex items-center mt-0.5",
              isUp ? "text-primary" : "text-rose-600",
            )}
          >
            {isUp ? "+" : ""}
            {item.changePercent24h.toFixed(2)}%
            <span className="text-muted-foreground ml-1.5 font-medium">1 Hari</span>
          </div>
        </div>
      </div>
    );
  };

  return (
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
  );
}
