import { Commodity } from "../types";

const generateHistory = (basePrice: number, volatility: number, days: number = 30) => {
  const data = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
      price: Math.round(currentPrice),
    });

    const change = currentPrice * volatility * (Math.random() - 0.48);
    currentPrice += change;
  }

  return data;
};

// Asumsi Harga Saat Ini (IDR)
const GOLD_PRICE_PER_GRAM = 1350000;
const SILVER_PRICE_PER_GRAM = 16000;

const DINAR_WEIGHT = 4.25;
const DIRHAM_WEIGHT = 2.975;

const goldHistory = generateHistory(GOLD_PRICE_PER_GRAM, 0.005);
const silverHistory = generateHistory(SILVER_PRICE_PER_GRAM, 0.01);

const issiHistory = generateHistory(210.5, 0.015);
const jiiHistory = generateHistory(520.3, 0.015);
const jii70History = generateHistory(215.8, 0.015);
const djimiHistory = generateHistory(9580.0, 0.015);
const msciHistory = generateHistory(2600.0, 0.015);
const sp500shHistory = generateHistory(7900.0, 0.015);

const dinarHistory = goldHistory.map((p) => ({ ...p, price: Math.round(p.price * DINAR_WEIGHT) }));
const dirhamHistory = silverHistory.map((p) => ({
  ...p,
  price: Math.round(p.price * DIRHAM_WEIGHT),
}));

export const MOCK_COMMODITIES: Commodity[] = [
  {
    id: "dinar",
    symbol: "DNR",
    name: "Dinar (Emas)",
    unit: "1 Dinar (4,25g)",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: dinarHistory,
    weight: DINAR_WEIGHT,
    baseCommodity: "Emas",
    currentBasePrice: 0,
  },
  {
    id: "dirham",
    symbol: "DRM",
    name: "Dirham (Perak)",
    unit: "1 Dirham (2,975g)",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: dirhamHistory,
    weight: DIRHAM_WEIGHT,
    baseCommodity: "Perak",
    currentBasePrice: 0,
  },
  {
    id: "gold_gram",
    symbol: "XAU/IDR",
    name: "Emas",
    unit: "1 Gram",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: goldHistory,
    weight: 1,
    baseCommodity: "Emas",
    currentBasePrice: 0,
  },
  {
    id: "silver_gram",
    symbol: "XAG/IDR",
    name: "Perak",
    unit: "1 Gram",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: silverHistory,
    weight: 1,
    baseCommodity: "Perak",
    currentBasePrice: 0,
  },
  {
    id: "issi",
    symbol: "ISSI",
    name: "Indeks Saham Syariah",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: issiHistory,
    isIndex: true,
  },
  {
    id: "jii",
    symbol: "JII",
    name: "Jakarta Islamic Index",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: jiiHistory,
    isIndex: true,
  },
  {
    id: "jii70",
    symbol: "JII70",
    name: "Jakarta Islamic Index 70",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: jii70History,
    isIndex: true,
  },
  {
    id: "djimi",
    symbol: "DJIMI",
    name: "Dow Jones Islamic",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: djimiHistory,
    isIndex: true,
  },
  {
    id: "msci",
    symbol: "MSCI",
    name: "MSCI ACWI Islamic",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: msciHistory,
    isIndex: true,
  },
  {
    id: "sp500sh",
    symbol: "SP500SH",
    name: "S&P 500 Shariah",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: sp500shHistory,
    isIndex: true,
  },
];

// Menyelaraskan harga saat ini dengan titik data historis terakhir
MOCK_COMMODITIES.forEach((c) => {
  const last = c.history[c.history.length - 1];
  const prev = c.history[c.history.length - 2];
  c.currentPrice = last.price;
  c.change24h = last.price - prev.price;
  c.changePercent24h = (c.change24h / prev.price) * 100;

  if (c.baseCommodity === "Emas") {
    c.currentBasePrice = goldHistory[goldHistory.length - 1].price;
  } else if (c.baseCommodity === "Perak") {
    c.currentBasePrice = silverHistory[silverHistory.length - 1].price;
  }
});
