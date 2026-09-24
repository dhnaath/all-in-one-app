import React, { useState, useMemo } from "react";
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Coins,
  Scale,
  Building2,
  DollarSign,
  ArrowRight,
  BookOpen,
  Info,
  Calendar,
  Sparkles,
  Award,
  Layers,
  HeartHandshake,
} from "lucide-react";

interface ShariaStock {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change24h: number;
  marketCap: string;
  interestDebtRatio: number; // Max 45%
  nonHalalRevenueRatio: number; // Max 10%
  desStatus: "Lolos DES OJK" | "MSCI Islamic" | "JII Constituent";
  volume: string;
}

const SHARIA_STOCKS: ShariaStock[] = [
  {
    ticker: "BRIS",
    name: "PT Bank Syariah Indonesia Tbk",
    sector: "Keuangan & Perbankan Syariah",
    price: 2980,
    change24h: 2.76,
    marketCap: "Rp 137.4 T",
    interestDebtRatio: 0.0,
    nonHalalRevenueRatio: 0.0,
    desStatus: "JII Constituent",
    volume: "68.4M",
  },
  {
    ticker: "TLKM",
    name: "PT Telkom Indonesia (Persero) Tbk",
    sector: "Infrastruktur Telekomunikasi",
    price: 3120,
    change24h: 0.65,
    marketCap: "Rp 309.1 T",
    interestDebtRatio: 23.4,
    nonHalalRevenueRatio: 1.2,
    desStatus: "JII Constituent",
    volume: "52.1M",
  },
  {
    ticker: "ICBP",
    name: "PT Indofood CBP Sukses Makmur Tbk",
    sector: "Barang Konsumen Primer",
    price: 11850,
    change24h: 1.28,
    marketCap: "Rp 138.2 T",
    interestDebtRatio: 31.8,
    nonHalalRevenueRatio: 0.8,
    desStatus: "JII Constituent",
    volume: "12.8M",
  },
  {
    ticker: "ASII",
    name: "PT Astra International Tbk",
    sector: "Industri & Otomotif",
    price: 5125,
    change24h: -0.48,
    marketCap: "Rp 207.5 T",
    interestDebtRatio: 28.2,
    nonHalalRevenueRatio: 2.1,
    desStatus: "Lolos DES OJK",
    volume: "34.5M",
  },
  {
    ticker: "PGAS",
    name: "PT Perusahaan Gas Negara Tbk",
    sector: "Energi & Distribusi Gas",
    price: 1560,
    change24h: 1.96,
    marketCap: "Rp 37.8 T",
    interestDebtRatio: 26.5,
    nonHalalRevenueRatio: 0.4,
    desStatus: "JII Constituent",
    volume: "41.2M",
  },
  {
    ticker: "KLBF",
    name: "PT Kalbe Farma Tbk",
    sector: "Kesehatan & Farmasi Halal",
    price: 1710,
    change24h: 0.59,
    marketCap: "Rp 80.2 T",
    interestDebtRatio: 11.2,
    nonHalalRevenueRatio: 0.2,
    desStatus: "JII Constituent",
    volume: "22.4M",
  },
  {
    ticker: "ANTM",
    name: "PT Aneka Tambang Tbk",
    sector: "Bahan Baku & Logam Mulia (Emas/Nikel)",
    price: 1580,
    change24h: 3.27,
    marketCap: "Rp 37.9 T",
    interestDebtRatio: 18.7,
    nonHalalRevenueRatio: 0.5,
    desStatus: "JII Constituent",
    volume: "58.9M",
  },
  {
    ticker: "ADRO",
    name: "PT Adaro Energy Indonesia Tbk",
    sector: "Energi & Sumber Daya",
    price: 3680,
    change24h: -0.81,
    marketCap: "Rp 117.7 T",
    interestDebtRatio: 14.3,
    nonHalalRevenueRatio: 1.8,
    desStatus: "Lolos DES OJK",
    volume: "45.1M",
  },
  {
    ticker: "UNVR",
    name: "PT Unilever Indonesia Tbk",
    sector: "Konsumsi Personal & Rumah Tangga",
    price: 2340,
    change24h: 0.43,
    marketCap: "Rp 89.3 T",
    interestDebtRatio: 19.8,
    nonHalalRevenueRatio: 0.9,
    desStatus: "Lolos DES OJK",
    volume: "18.3M",
  },
  {
    ticker: "PTBA",
    name: "PT Bukit Asam Tbk",
    sector: "Energi & Pertambangan",
    price: 2710,
    change24h: 1.12,
    marketCap: "Rp 31.2 T",
    interestDebtRatio: 9.4,
    nonHalalRevenueRatio: 0.6,
    desStatus: "Lolos DES OJK",
    volume: "19.5M",
  },
];

const RIBAWI_COMMODITIES = [
  {
    name: "Emas (Dinar / Gold)",
    type: "Mata Uang & Logam Mulia",
    benchmarkUnit: "1 Dinar (4.25 gr 22K)",
    spotPrice: "Rp 4.985.000",
    change: "+0.45%",
    rule: "Yadan bi Yadin (Tunai Kontan). Bila ditukar emas wajib sama timbangan (Mitslan bi Mitslin).",
  },
  {
    name: "Perak (Dirham / Silver)",
    type: "Mata Uang & Logam Mulia",
    benchmarkUnit: "1 Dirham (2.975 gr Murni)",
    spotPrice: "Rp 118.000",
    change: "+0.85%",
    rule: "Wajib serah-terima kontan. Bebas selisih jika dibeli dengan mata uang selain perak.",
  },
  {
    name: "Gandum Halus (Burr / Wheat)",
    type: "Pangan Pokok Ribawi",
    benchmarkUnit: "1 Kg Gandum Pilihan",
    spotPrice: "Rp 14.500",
    change: "0.00%",
    rule: "Tukar gandum dengan gandum wajib sama takaran dan langsung diserahterimakan.",
  },
  {
    name: "Jelai (Sya'ir / Barley)",
    type: "Pangan Pokok Ribawi",
    benchmarkUnit: "1 Kg Jelai Organik",
    spotPrice: "Rp 26.000",
    change: "-0.38%",
    rule: "Barang ribawi pangan wajib takaran adil dan tanpa tempo jika komoditas sejenis.",
  },
  {
    name: "Kurma (Tamr / Dates)",
    type: "Pangan Pokok Ribawi",
    benchmarkUnit: "1 Kg Kurma Sukari / Ajwa",
    spotPrice: "Rp 95.000 - Rp 250.000",
    change: "+1.10%",
    rule: "Kurma ditukar kurma wajib sama berat, tidak boleh menukar kurma buruk dengan kurma baik dengan selisih takaran.",
  },
  {
    name: "Garam (Milh / Salt)",
    type: "Pengawet & Bumbu Esensial",
    benchmarkUnit: "1 Kg Garam Kristal Murni",
    spotPrice: "Rp 9.500",
    change: "0.00%",
    rule: "Pertukaran garam sejenis wajib setara kuantitas dan serah terima seketika.",
  },
];

export function ShariaIndexApp() {
  const [activeTab, setActiveTab] = useState<"index" | "screener" | "commodities" | "zakat">("index");
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");

  // Zakat Calculator state
  const [stockPortfolioValue, setStockPortfolioValue] = useState("150000000");
  const [goldPricePerGram, setGoldPricePerGram] = useState("1420000");

  const sectors = useMemo(() => {
    return Array.from(new Set(SHARIA_STOCKS.map((s) => s.sector)));
  }, []);

  const filteredStocks = useMemo(() => {
    return SHARIA_STOCKS.filter((stock) => {
      if (sectorFilter !== "all" && stock.sector !== sectorFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          stock.ticker.toLowerCase().includes(q) ||
          stock.name.toLowerCase().includes(q) ||
          stock.sector.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sectorFilter, searchQuery]);

  // Zakat calculation
  const zakatResults = useMemo(() => {
    const portfolio = parseFloat(stockPortfolioValue) || 0;
    const goldPrice = parseFloat(goldPricePerGram) || 0;
    const nisabThreshold = goldPrice * 85; // Nisab 85 gr emas
    const isWajibZakat = portfolio >= nisabThreshold;
    const zakatDue = isWajibZakat ? Math.round(portfolio * 0.025) : 0;

    return {
      portfolio,
      goldPrice,
      nisabThreshold,
      isWajibZakat,
      zakatDue,
    };
  }, [stockPortfolioValue, goldPricePerGram]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
            <LineChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">Indeks Sharia & Pasar Muamalah</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Syariah Certified
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-400">
              Benchmark Indeks Saham Syariah (ISSI, JII), Screener Kepatuhan DES OJK/DSN-MUI, dan Acuan Komoditas Muamalah.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Standar DSN-MUI & POJK No. 35/POJK.04/2017
          </span>
        </div>
      </header>

      {/* Top Index Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>ISSI (Indeks Saham Syariah)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">218.45</div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
            +0.64% <span className="text-slate-500 font-normal">hari ini (612 Emiten DES)</span>
          </div>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>JII (Jakarta Islamic Index)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">532.10</div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
            +0.45% <span className="text-slate-500 font-normal">30 Saham Likuid Syariah</span>
          </div>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Dinar Emas (4.25 gr 22K)</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">Rp 4.985.000</div>
          <div className="text-xs text-slate-400">Standar World Islamic Mint</div>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Dirham Perak (2.975 gr)</span>
            <Coins className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-sky-400">Rp 118.000</div>
          <div className="text-xs text-slate-400">Acuan Muamalah Fisik Murni</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("index")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "index"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <LineChart className="w-4 h-4" />
          <span>Indeks & Saham Syariah (ISSI / JII)</span>
        </button>

        <button
          onClick={() => setActiveTab("screener")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "screener"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Kriteria Kepatuhan DES OJK</span>
        </button>

        <button
          onClick={() => setActiveTab("commodities")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "commodities"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>6 Komoditas Ribawi & Pasar Muamalah</span>
        </button>

        <button
          onClick={() => setActiveTab("zakat")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "zakat"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Kalkulator Zakat Saham</span>
        </button>
      </div>

      {/* TAB CONTENT: STOCKS & INDEX */}
      {activeTab === "index" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari kode saham (BRIS, TLKM, ICBP...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Semua Sektor</option>
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto bg-slate-800/80 border border-slate-700 rounded-xl">
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 text-xs font-semibold uppercase">
                  <th className="p-3.5">Ticker & Emiten</th>
                  <th className="p-3.5">Sektor</th>
                  <th className="p-3.5 text-right">Harga Terakhir</th>
                  <th className="p-3.5 text-right">Perubahan 24h</th>
                  <th className="p-3.5 text-center">Rasio Utang Bunga (&le;45%)</th>
                  <th className="p-3.5 text-center">Pendapatan Non-Halal (&le;10%)</th>
                  <th className="p-3.5 text-center">Status DES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredStocks.map((stock) => (
                  <tr key={stock.ticker} className="hover:bg-slate-700/30 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
                          {stock.ticker}
                        </span>
                        <span>{stock.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Market Cap: {stock.marketCap} • Vol: {stock.volume}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300">{stock.sector}</td>
                    <td className="p-3.5 text-right font-bold text-slate-100 font-mono">
                      Rp {stock.price.toLocaleString("id-ID")}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold">
                      <span
                        className={
                          stock.change24h >= 0 ? "text-emerald-400" : "text-rose-400"
                        }
                      >
                        {stock.change24h >= 0 ? `+${stock.change24h}%` : `${stock.change24h}%`}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                          stock.interestDebtRatio <= 45
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {stock.interestDebtRatio}%
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                          stock.nonHalalRevenueRatio <= 10
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {stock.nonHalalRevenueRatio}%
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        {stock.desStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SCREENER CRITERIA */}
      {activeTab === "screener" && (
        <div className="space-y-6 max-w-4xl">
          <div className="p-6 bg-slate-800/80 border border-slate-700 rounded-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Metodologi Screening Saham Syariah (POJK No. 35/POJK.04/2017 & DSN-MUI)
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Otoritas Jasa Keuangan (OJK) bersama Dewan Syariah Nasional (DSN-MUI) secara berkala menerbitkan
              <strong> Daftar Efek Syariah (DES)</strong> dua kali setahun (Mei dan November). Sebuah emiten wajib
              memenuhi 2 tahap kriteria seleksi ketat:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  1. Screening Bisnis & Aktivitas Usaha
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Bukan perbankan/keuangan berbasis bunga konvensional</li>
                  <li>Bukan produsen/distributor minuman keras (khamr)</li>
                  <li>Bukan perjudian, kasino, atau game of chance (maysir)</li>
                  <li>Bukan transaksi spekulatif berlebihan tanpa underlying (gharar)</li>
                  <li>Bukan makanan/minuman non-halal</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  2. Screening Rasio Keuangan (Financial Ratio)
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="p-2 bg-slate-800 rounded border border-slate-700">
                    <div className="font-semibold text-slate-200">Total Utang Berbasis Bunga / Total Aset:</div>
                    <div className="text-emerald-400 font-mono font-bold text-sm">Maksimal 45% (0.45)</div>
                  </li>
                  <li className="p-2 bg-slate-800 rounded border border-slate-700">
                    <div className="font-semibold text-slate-200">Total Pendapatan Non-Halal / Total Pendapatan:</div>
                    <div className="text-emerald-400 font-mono font-bold text-sm">Maksimal 10% (0.10)</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6 KOMODITAS RIBAWI */}
      {activeTab === "commodities" && (
        <div className="space-y-6 max-w-4xl">
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs md:text-sm text-emerald-200 leading-relaxed">
            <strong>Hadits Riwayat Muslim no. 1587:</strong> "Emas dengan emas, perak dengan perak, gandum dengan gandum,
            jelai dengan jelai, kurma dengan kurma, dan garam dengan garam; hendaklah sama takarannya dan diserahterimakan
            dari tangan ke tangan (tunai). Jika berlainan jenis, juallah sekehendakmu dengan syarat tunai kontan."
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RIBAWI_COMMODITIES.map((c) => (
              <div
                key={c.name}
                className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {c.type}
                  </span>
                  <span className="font-mono text-xs text-emerald-400 font-bold">{c.change}</span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-100">{c.name}</h4>
                  <div className="text-lg font-extrabold text-white mt-0.5">{c.spotPrice}</div>
                  <div className="text-[11px] text-slate-400">Satuan acuan: {c.benchmarkUnit}</div>
                </div>

                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400">Ketentuan Fiqih:</strong> {c.rule}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ZAKAT KALKULATOR */}
      {activeTab === "zakat" && (
        <div className="max-w-2xl space-y-6">
          <div className="p-6 bg-slate-800/80 border border-slate-700 rounded-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              Kalkulator Zakat Saham & Portofolio Investasi
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nilai Total Portofolio Saham Syariah (Rp)
                </label>
                <input
                  type="number"
                  value={stockPortfolioValue}
                  onChange={(e) => setStockPortfolioValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Harga Pasar Emas per Gram Saat Ini (Rp)
                </label>
                <input
                  type="number"
                  value={goldPricePerGram}
                  onChange={(e) => setGoldPricePerGram(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-400">
                  Nisab Zakat = 85 gram emas murni (Rp {zakatResults.nisabThreshold.toLocaleString("id-ID")})
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700/80 space-y-3 mt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Status Kewajiban:</span>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    zakatResults.isWajibZakat
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {zakatResults.isWajibZakat ? "Mencapai Nisab (Wajib Zakat)" : "Belum Mencapai Nisab"}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Kadar Zakat:</span>
                <span className="font-mono text-slate-200 font-semibold">2.5% (Haul 1 Tahun)</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-200">Zakat Saham yang Harus Dikeluarkan:</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">
                  Rp {zakatResults.zakatDue.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
