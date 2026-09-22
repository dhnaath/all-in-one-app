import React from "react";
import TaxTools from "./components/TaxTools";

export default function App_Component() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans">
      {/* Header that blends perfectly */}
      <div className="px-6 sm:px-8 pt-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kalkulator Pajak</h1>
          <p className="text-muted-foreground mt-2">Pajak Personal & Bisnis</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full p-6 sm:p-8">
        <TaxTools />
      </div>
    </div>
  );
}
