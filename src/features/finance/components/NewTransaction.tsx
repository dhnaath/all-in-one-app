import React, { useState } from "react";
import { X, Calendar, Clock, ChevronRight, Calculator, Check } from "lucide-react";

export function NewTransaction({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState("pengeluaran");
  const [amount, setAmount] = useState("0");

  const handleNumpad = (val: string) => {
    if (val === "C") {
      setAmount("0");
    } else if (val === "<") {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else {
      setAmount((prev) => (prev === "0" ? val : prev + val));
    }
  };

  return (
    <div className="flex flex-col h-full bg-card w-full relative z-50">
      <div className="flex items-center gap-4 p-4 border-b border-border">
        <button onClick={onBack}>
          <X size={24} className="text-foreground" />
        </button>
        <h1 className="text-lg font-normal text-foreground flex-1 text-center pr-6">
          Transaksi baru
        </h1>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex bg-[#2a2a2a] rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab("pemasukan")}
            className={`flex-1 py-2 text-sm rounded-lg ${tab === "pemasukan" ? "bg-[#3a3a3a] text-foreground" : "text-muted-foreground"}`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setTab("pengeluaran")}
            className={`flex-1 py-2 text-sm rounded-lg ${tab === "pengeluaran" ? "bg-[#4a4a4a] text-foreground" : "text-muted-foreground"}`}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => setTab("transfer")}
            className={`flex-1 py-2 text-sm rounded-lg ${tab === "transfer" ? "bg-[#3a3a3a] text-foreground" : "text-muted-foreground"}`}
          >
            Transfer
          </button>
        </div>

        {/* Date Time */}
        <div className="flex justify-between items-center text-sm text-foreground mb-6">
          <ChevronLeft size={20} className="invisible" /> {/* Spacer */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-medium">
              <Calendar size={16} /> 15 Jun 2026
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Clock size={16} /> 03:21
            </div>
          </div>
          <ChevronRight size={20} />
        </div>

        {/* Accounts */}
        <div className="flex gap-2 mb-6">
          <button className="flex items-center gap-2 bg-[#00897b] px-3 py-1.5 rounded-xl text-foreground">
            <div className="text-xs w-5 h-5 bg-card/20 rounded flex items-center justify-center">
              💵
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold leading-tight">Tunai</div>
              <div className="text-xs text-foreground/80 leading-tight">Rp 0,00</div>
            </div>
          </button>
          <button className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-1.5 rounded-xl text-foreground">
            <div className="text-xs w-5 h-5 bg-[#1976d2] rounded flex items-center justify-center text-foreground">
              🏦
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold leading-tight">Rekening bank</div>
              <div className="text-xs text-muted-foreground leading-tight">Rp 0,00</div>
            </div>
          </button>
        </div>

        {/* Amount Display */}
        <div className="flex-1 flex flex-col items-center justify-center pb-8 border-b border-border mb-4">
          <div className="text-5xl font-medium text-muted-foreground mb-6 text-center">
            Rp {amount}
          </div>
          <button className="text-sm text-muted-foreground font-medium">Tambah catatan</button>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4 cursor-pointer">
          <div className="flex items-center gap-2 bg-[#2a2a2a] px-4 py-2.5 rounded-full shrink-0">
            <div className="bg-[#f44336] w-6 h-6 rounded-full flex items-center justify-center text-xs text-foreground">
              🍴
            </div>
            <span className="text-sm font-medium text-foreground">Makanan & Minuman</span>
          </div>
          <div className="flex items-center gap-2 bg-[#2a2a2a] px-4 py-2.5 rounded-full shrink-0">
            <div className="bg-[#e91e63] w-6 h-6 rounded-full flex items-center justify-center text-xs text-foreground">
              🛍️
            </div>
            <span className="text-sm font-medium text-foreground">Belanja</span>
          </div>
          <div className="flex items-center gap-2 bg-[#2a2a2a] px-4 py-2.5 rounded-full shrink-0">
            <div className="bg-[#673ab7] w-6 h-6 rounded-full flex items-center justify-center text-xs text-foreground">
              🏠
            </div>
            <span className="text-sm font-medium text-foreground">Perumahan</span>
          </div>
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-4 gap-y-6 gap-x-2 pb-8 pt-4">
          {["÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "±", "0", ","].map(
            (btn, i) => {
              const k = `numpad-${i}`;
              if (i === 3)
                return (
                  <button
                    key={k}
                    onClick={() => handleNumpad("<")}
                    className="text-lg text-foreground justify-self-center"
                  >
                    <X size={20} />
                  </button>
                );
              if (i === 7)
                return (
                  <button key={k} className="text-lg text-foreground justify-self-center">
                    <Calculator size={20} />
                  </button>
                );
              if (i === 11)
                return (
                  <button
                    key={k}
                    className="col-span-1 row-span-2 text-lg text-foreground justify-self-center self-end mb-2 mr-2"
                  >
                    <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center text-foreground border border-gray-600">
                      <Check size={28} />
                    </div>
                  </button>
                );
              if (i === 15)
                return (
                  <button key={k} className="text-2xl font-normal text-foreground">
                    ,
                  </button>
                );

              if (i > 11) {
                const val = ["+", "±", "0", ","][i - 12];
                if (val === ",")
                  return (
                    <button key={k} className="text-2xl font-normal text-foreground">
                      ,
                    </button>
                  );
                if (val === "0")
                  return (
                    <button
                      key={k}
                      onClick={() => handleNumpad(val)}
                      className="text-2xl font-normal text-foreground justify-self-center self-center"
                    >
                      {val}
                    </button>
                  );
                return (
                  <button
                    key={k}
                    className="text-2xl font-normal text-foreground justify-self-center self-center"
                  >
                    {val}
                  </button>
                );
              }

              const isOperator = ["÷", "×", "-"].includes(btn);
              return (
                <button
                  key={k}
                  onClick={() => !isOperator && handleNumpad(btn)}
                  className={`text-2xl font-normal ${isOperator ? "text-muted-foreground" : "text-foreground"} justify-self-center self-center`}
                >
                  {btn}
                </button>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

// Quick spacer
function ChevronLeft(props: any) {
  return <ChevronRight {...props} className={props.className + " rotate-180"} />;
}
