import React from "react";
import { X, Check } from "lucide-react";

export function NewAccount({
  type,
  setType,
  onBack,
}: {
  type: "Reguler" | "Kredit";
  setType: (v: "Reguler" | "Kredit") => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] w-full relative z-50">
      <div className="flex items-center justify-between p-4 mb-2">
        <button onClick={onBack}>
          <X size={24} className="text-foreground" />
        </button>
        <h1 className="text-lg font-normal text-foreground">Akun baru</h1>
        <button>
          <Check size={24} className="text-foreground" />
        </button>
      </div>

      <div className="px-5 space-y-6">
        <div className="flex bg-[#2a2a2a] rounded-xl p-1">
          <button
            onClick={() => setType("Reguler")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg ${type === "Reguler" ? "bg-[#2a2a2a] text-foreground" : "text-muted-foreground"}`}
          >
            Reguler
          </button>
          <button
            onClick={() => setType("Kredit")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg ${type === "Kredit" ? "bg-[#2a2a2a] text-foreground" : "text-muted-foreground"}`}
          >
            Kredit
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Nama"
            className="flex-1 bg-[#2a2a2a] border border-transparent rounded-xl px-4 py-4 text-foreground placeholder-gray-500 focus:outline-none focus:border-gray-600"
          />
          <button className="w-14 h-14 bg-[#4a72ff] rounded-xl flex items-center justify-center text-foreground text-2xl shrink-0 shadow-lg">
            🏦
          </button>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block px-1">Mata uang</label>
          <select className="w-full bg-[#2a2a2a] text-foreground rounded-xl px-4 py-4 appearance-none outline-none focus:ring-1 ring-gray-600">
            <option>Rp Rupiah Indonesia</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block px-1">Saldo saat ini</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium font-sans">
              Rp
            </span>
            <input
              type="text"
              defaultValue="0"
              className="w-full bg-[#2a2a2a] text-foreground rounded-xl pl-12 pr-28 py-4 outline-none focus:ring-1 ring-gray-600 text-lg"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1a3a2d] text-[#4caf50] px-3 py-1.5 rounded-lg text-xs font-medium">
              Tersedia
            </div>
          </div>
        </div>

        {type === "Kredit" && (
          <div>
            <label className="text-sm text-muted-foreground mb-2 block px-1">Batas kredit</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium font-sans">
                Rp
              </span>
              <input
                type="text"
                defaultValue="0"
                className="w-full bg-[#2a2a2a] text-foreground rounded-xl pl-12 pr-4 py-4 outline-none focus:ring-1 ring-gray-600 text-lg"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center bg-[#212121] px-4 py-5 rounded-xl mt-2">
          <span className="text-base text-muted-foreground font-normal">Saldo tersedia</span>
          <span className="text-base text-foreground font-medium">Rp 0,00</span>
        </div>

        <div className="pt-2">
          <button className="text-base text-muted-foreground px-1 font-normal">Detail</button>
        </div>
      </div>
    </div>
  );
}
