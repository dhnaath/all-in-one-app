import React from "react";
import ZakatTools from "./components/ZakatTools";

interface TickTickLayoutProps {
  onBack?: () => void;
}

export default function App({ onBack }: TickTickLayoutProps = {}) {
  return (
    <div className="w-full bg-transparent text-foreground font-sans">
      {/* Header that blends perfectly */}
      <div className="px-6 sm:px-8 pt-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kalkulator Zakat</h1>
          <p className="text-muted-foreground mt-2">Zakat Penghasilan, Maal, dan Fitrah</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full p-6 sm:p-8">
        <ZakatTools />
      </div>
    </div>
  );
}
