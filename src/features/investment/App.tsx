import React from "react";
import InvestmentTools from "./components/InvestmentTools";

interface TickTickLayoutProps {
  onBack?: () => void;
}

export default function App({ onBack }: TickTickLayoutProps = {}) {
  return (
    <div className="w-full bg-transparent text-foreground font-sans">
      {/* Main Content Area */}
      <div className="w-full p-4 sm:p-6">
        <InvestmentTools />
      </div>
    </div>
  );
}
