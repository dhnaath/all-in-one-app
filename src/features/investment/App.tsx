import React from "react";
import InvestmentTools from "./components/InvestmentTools";

interface TickTickLayoutProps {
  onBack?: () => void;
}

export default function App({ onBack }: TickTickLayoutProps = {}) {
  return (
    <div className="w-full bg-transparent text-foreground font-sans">
      {/* Header */}
      <div className="px-6 sm:px-8 pt-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kalkulator Investasi</h1>
          <p className="text-muted-foreground mt-2">Bunga Majemuk & Return on Investment</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full p-6 sm:p-8">
        <InvestmentTools />
      </div>
    </div>
  );
}
