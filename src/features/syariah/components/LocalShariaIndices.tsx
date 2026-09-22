import React, { useState } from "react";
import { cn } from "../lib/utils";
import { Building2, Search } from "lucide-react";

const INDICES_DATA = {
  JII: {
    name: "Jakarta Islamic Index (JII)",
    description:
      "30 saham syariah paling likuid dan berkapitalisasi besar di Bursa Efek Indonesia (Periode 2024).",
    companies: [
      { ticker: "ACES", name: "Aspirasi Hidup Indonesia Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "ADRO", name: "Adaro Energy Indonesia Tbk.", sector: "Energy" },
      { ticker: "AKRA", name: "AKR Corporindo Tbk.", sector: "Energy" },
      { ticker: "AMMN", name: "Amman Mineral Internasional Tbk.", sector: "Basic Materials" },
      { ticker: "ANTM", name: "Aneka Tambang Tbk.", sector: "Basic Materials" },
      { ticker: "BRIS", name: "Bank Syariah Indonesia Tbk.", sector: "Financials" },
      { ticker: "BRPT", name: "Barito Pacific Tbk.", sector: "Basic Materials" },
      { ticker: "CPIN", name: "Charoen Pokphand Indonesia Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "EXCL", name: "XL Axiata Tbk.", sector: "Infrastructures" },
      { ticker: "GOTO", name: "GoTo Gojek Tokopedia Tbk.", sector: "Technology" },
      { ticker: "HRUM", name: "Harum Energy Tbk.", sector: "Energy" },
      { ticker: "ICBP", name: "Indofood CBP Sukses Makmur Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "INCO", name: "Vale Indonesia Tbk.", sector: "Basic Materials" },
      { ticker: "INDF", name: "Indofood Sukses Makmur Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "INKP", name: "Indah Kiat Pulp & Paper Tbk.", sector: "Basic Materials" },
      { ticker: "INTP", name: "Indocement Tunggal Prakarsa Tbk.", sector: "Basic Materials" },
      { ticker: "ITMG", name: "Indo Tambangraya Megah Tbk.", sector: "Energy" },
      { ticker: "KLBF", name: "Kalbe Farma Tbk.", sector: "Healthcare" },
      { ticker: "MAPI", name: "Mitra Adiperkasa Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "MDKA", name: "Merdeka Copper Gold Tbk.", sector: "Basic Materials" },
      { ticker: "MEDC", name: "Medco Energi Internasional Tbk.", sector: "Energy" },
      { ticker: "PGAS", name: "Perusahaan Gas Negara Tbk.", sector: "Infrastructures" },
      { ticker: "PTBA", name: "Bukit Asam Tbk.", sector: "Energy" },
      { ticker: "SCMA", name: "Surya Citra Media Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "SMGR", name: "Semen Indonesia (Persero) Tbk.", sector: "Basic Materials" },
      { ticker: "TKIM", name: "Pabrik Kertas Tjiwi Kimia Tbk.", sector: "Basic Materials" },
      { ticker: "TLKM", name: "Telkom Indonesia (Persero) Tbk.", sector: "Infrastructures" },
      { ticker: "TPIA", name: "Chandra Asri Pacific Tbk.", sector: "Basic Materials" },
      { ticker: "UNTR", name: "United Tractors Tbk.", sector: "Industrials" },
      { ticker: "UNVR", name: "Unilever Indonesia Tbk.", sector: "Consumer Non-Cyclicals" },
    ],
  },
  JII70: {
    name: "Jakarta Islamic Index 70 (JII70)",
    description:
      "70 saham syariah paling likuid di Bursa Efek Indonesia (Menampilkan konstituen utama).",
    companies: [
      { ticker: "ACES", name: "Aspirasi Hidup Indonesia Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "ADRO", name: "Adaro Energy Indonesia Tbk.", sector: "Energy" },
      { ticker: "AKRA", name: "AKR Corporindo Tbk.", sector: "Energy" },
      { ticker: "AMMN", name: "Amman Mineral Internasional Tbk.", sector: "Basic Materials" },
      { ticker: "ANTM", name: "Aneka Tambang Tbk.", sector: "Basic Materials" },
      { ticker: "BRIS", name: "Bank Syariah Indonesia Tbk.", sector: "Financials" },
      { ticker: "BRPT", name: "Barito Pacific Tbk.", sector: "Basic Materials" },
      { ticker: "BTPS", name: "Bank BTPN Syariah Tbk.", sector: "Financials" },
      { ticker: "CPIN", name: "Charoen Pokphand Indonesia Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "CTRA", name: "Ciputra Development Tbk.", sector: "Properties & Real Estate" },
      { ticker: "DSNG", name: "Dharma Satya Nusantara Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "ERAA", name: "Erajaya Swasembada Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "EXCL", name: "XL Axiata Tbk.", sector: "Infrastructures" },
      { ticker: "GOTO", name: "GoTo Gojek Tokopedia Tbk.", sector: "Technology" },
      { ticker: "HEAL", name: "Medikaloka Hermina Tbk.", sector: "Healthcare" },
      { ticker: "HRUM", name: "Harum Energy Tbk.", sector: "Energy" },
      { ticker: "ICBP", name: "Indofood CBP Sukses Makmur Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "INCO", name: "Vale Indonesia Tbk.", sector: "Basic Materials" },
      { ticker: "INDF", name: "Indofood Sukses Makmur Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "INKP", name: "Indah Kiat Pulp & Paper Tbk.", sector: "Basic Materials" },
      { ticker: "INTP", name: "Indocement Tunggal Prakarsa Tbk.", sector: "Basic Materials" },
      { ticker: "ITMG", name: "Indo Tambangraya Megah Tbk.", sector: "Energy" },
      { ticker: "JPFA", name: "Japfa Comfeed Indonesia Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "KLBF", name: "Kalbe Farma Tbk.", sector: "Healthcare" },
      {
        ticker: "LSIP",
        name: "PP London Sumatra Indonesia Tbk.",
        sector: "Consumer Non-Cyclicals",
      },
      { ticker: "MAPI", name: "Mitra Adiperkasa Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "MDKA", name: "Merdeka Copper Gold Tbk.", sector: "Basic Materials" },
      { ticker: "MEDC", name: "Medco Energi Internasional Tbk.", sector: "Energy" },
      { ticker: "MIKA", name: "Mitra Keluarga Karyasehat Tbk.", sector: "Healthcare" },
      { ticker: "MTEL", name: "Dayamitra Telekomunikasi Tbk.", sector: "Infrastructures" },
      { ticker: "MYOR", name: "Mayora Indah Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "PGAS", name: "Perusahaan Gas Negara Tbk.", sector: "Infrastructures" },
      { ticker: "PNLF", name: "Panin Financial Tbk.", sector: "Financials" },
      { ticker: "PTBA", name: "Bukit Asam Tbk.", sector: "Energy" },
      { ticker: "SCMA", name: "Surya Citra Media Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "SIDO", name: "Industri Jamu Dan Farmasi Sido Muncul Tbk.", sector: "Healthcare" },
      { ticker: "SILO", name: "Siloam International Hospitals Tbk.", sector: "Healthcare" },
      { ticker: "SMGR", name: "Semen Indonesia (Persero) Tbk.", sector: "Basic Materials" },
      { ticker: "SMRA", name: "Summarecon Agung Tbk.", sector: "Properties & Real Estate" },
      { ticker: "TAPG", name: "Triputra Agro Persada Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "TKIM", name: "Pabrik Kertas Tjiwi Kimia Tbk.", sector: "Basic Materials" },
      { ticker: "TLKM", name: "Telkom Indonesia (Persero) Tbk.", sector: "Infrastructures" },
      { ticker: "TPIA", name: "Chandra Asri Pacific Tbk.", sector: "Basic Materials" },
      { ticker: "UNTR", name: "United Tractors Tbk.", sector: "Industrials" },
      { ticker: "UNVR", name: "Unilever Indonesia Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "WIKA", name: "Wijaya Karya (Persero) Tbk.", sector: "Infrastructures" },
    ],
  },
  ISSI: {
    name: "Indeks Saham Syariah Indonesia (ISSI)",
    description:
      "Seluruh saham syariah yang tercatat di Bursa Efek Indonesia (Menampilkan konstituen unggulan).",
    companies: [
      { ticker: "GOTO", name: "GoTo Gojek Tokopedia Tbk.", sector: "Technology" },
      { ticker: "AMMN", name: "Amman Mineral Internasional Tbk.", sector: "Basic Materials" },
      { ticker: "BREN", name: "Barito Renewables Energy Tbk.", sector: "Infrastructures" },
      { ticker: "CUAN", name: "Petrindo Semesta Kreasi Tbk.", sector: "Energy" },
      { ticker: "NISP", name: "Bank OCBC NISP Tbk.", sector: "Financials" },
      { ticker: "SILO", name: "Siloam International Hospitals Tbk.", sector: "Healthcare" },
      { ticker: "MAPA", name: "MAP Aktif Adiperkasa Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "PGEO", name: "Pertamina Geothermal Energy Tbk.", sector: "Infrastructures" },
      { ticker: "FILM", name: "MD Pictures Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "CMRY", name: "Cisarua Mountain Dairy Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "BRIS", name: "Bank Syariah Indonesia Tbk.", sector: "Financials" },
      { ticker: "TLKM", name: "Telkom Indonesia Tbk.", sector: "Infrastructures" },
    ],
  },
};

type IndexKey = keyof typeof INDICES_DATA;

export default function LocalShariaIndices() {
  const [selectedIndex, setSelectedIndex] = useState<IndexKey>("JII");
  const [searchQuery, setSearchQuery] = useState("");

  const currentData = INDICES_DATA[selectedIndex];

  const filteredCompanies = currentData.companies.filter(
    (company) =>
      company.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-6 sm:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-foreground" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              Perusahaan Indeks Syariah Lokal
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-foreground">Daftar Saham Syariah</h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(INDICES_DATA) as IndexKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedIndex(key)}
            className={cn(
              "px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors border border-border/40",
              selectedIndex === key
                ? "bg-secondary/50 text-white"
                : "bg-transparent text-foreground hover:bg-secondary",
            )}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-foreground/70 mb-4">{currentData.description}</p>
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-foreground/40" />
          </div>
          <input
            type="text"
            placeholder="Cari kode saham, nama, atau sektor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 bg-card border border-border/40 text-sm focus:outline-none focus:border-border/40 focus:ring-0 placeholder:text-foreground/40 transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40">
              <th className="py-3 px-4 text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/60">
                Kode
              </th>
              <th className="py-3 px-4 text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/60">
                Nama Perusahaan
              </th>
              <th className="py-3 px-4 text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/60">
                Sektor
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <tr
                  key={company.ticker}
                  className="border-b border-border/40 hover:bg-card/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="font-bold text-foreground">{company.ticker}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-foreground">{company.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-secondary/50/5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                      {company.sector}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-8 text-center text-sm font-medium text-foreground/50">
                  Tidak ada saham yang ditemukan untuk pencarian "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-foreground/40 text-right">
        {selectedIndex === "JII"
          ? "* Daftar 30 konstituen JII adalah data aktual evaluasi BEI (Periode 2024)"
          : "* Daftar ini menampilkan sebagian konstituen utama dari keseluruhan data aktual"}
      </div>
    </div>
  );
}
