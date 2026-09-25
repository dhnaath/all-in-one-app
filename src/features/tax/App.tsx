import React from "react";
import TaxTools from "./components/TaxTools";

export default function App_Component() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans">
      {/* Main Content Area */}
      <div className="w-full p-4 sm:p-6">
        <TaxTools />
      </div>
    </div>
  );
}
