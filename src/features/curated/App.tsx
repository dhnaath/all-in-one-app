import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Target,
  Lightbulb,
  Sparkles,
  Package,
  Banknote,
  RefreshCw,
  Scale,
  Folder,
  FileText,
  Calculator,
  Coins,
  Truck,
  Umbrella,
  Shield,
  PiggyBank,
  Rocket,
  Megaphone,
  MessageCircle,
} from "lucide-react";
import { chapters } from "./data";
import { useState, useMemo, useEffect } from "react";

// Custom card component to handle randomized flip animations
const ChapterCard = ({
  chapter,
  gridSize,
  row,
  col,
}: {
  chapter: {
    id: number;
    title: string;
    focus: string;
    example: string;
  };
  gridSize?: number;
  row?: number;
  col?: number;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Randomize entrance animation
  const entranceAxis = useMemo(() => (Math.random() > 0.5 ? "x" : "y"), []);
  const entranceDirection = useMemo(() => (Math.random() > 0.5 ? 1 : -1), []);

  // Keep track of interaction flip configuration
  const [interactionConfig, setInteractionConfig] = useState(() => {
    return {
      axis: Math.random() > 0.5 ? "x" : "y",
      dir: Math.random() > 0.5 ? 1 : -1,
    };
  });

  const handleCardClick = () => {
    if (!isFlipped) {
      setInteractionConfig((prev) => {
        let nextAxis = prev.axis;
        let nextDir = prev.dir;
        while (nextAxis === prev.axis && nextDir === prev.dir) {
          nextAxis = Math.random() > 0.5 ? "x" : "y";
          nextDir = Math.random() > 0.5 ? 1 : -1;
        }
        return { axis: nextAxis, dir: nextDir };
      });
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      rotateX: entranceAxis === "x" ? 180 * entranceDirection : 0,
      rotateY: entranceAxis === "y" ? 180 * entranceDirection : 0,
    },
    visible: {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      transition: { type: "spring" as const, stiffness: 60, damping: 12 },
    },
  };

  if (!chapter) {
    return (
      <div className="w-full h-full border border-border bg-transparent rounded-xl flex items-center justify-center p-4 min-h-[160px]">
        <div className="w-8 h-8 border border-dashed border-muted-foreground/30 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <motion.div
        variants={itemVariants}
        className="group relative w-full h-full aspect-square [perspective:1000px] cursor-pointer"
        onClick={handleCardClick}
      >
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          animate={{
            rotateX: isFlipped && interactionConfig.axis === "x" ? 180 * interactionConfig.dir : 0,
            rotateY: isFlipped && interactionConfig.axis === "y" ? 180 * interactionConfig.dir : 0,
          }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 15 }}
        >
          {/* Front Face */}
          <div className="absolute inset-0 bg-card border border-border rounded-xl p-4 flex flex-col justify-start items-start text-left shadow-sm [backface-visibility:hidden] hover:shadow-md transition-shadow">
            <h3
              className="font-bold tracking-tight leading-tight text-foreground"
              style={{
                fontSize: `${1.2 * (gridSize === 3 ? 1.5 : 1 + (6 - (gridSize || 6)) * 0.1)}rem`,
              }}
            >
              {chapter.title}
            </h3>
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 bg-primary border border-primary rounded-xl text-primary-foreground p-4 flex flex-col justify-between items-start text-left shadow-sm [backface-visibility:hidden] overflow-hidden"
            style={{
              transform:
                interactionConfig.axis === "x"
                  ? `rotateX(${180 * interactionConfig.dir}deg)`
                  : `rotateY(${180 * interactionConfig.dir}deg)`,
            }}
          >
            <div className="w-full flex flex-col h-full overflow-hidden">
              <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-3">{chapter.focus}</h3>
            </div>

            <div className="pt-3 border-t border-primary-foreground/20 w-full mt-auto">
              <div className="text-[10px] font-bold tracking-wider uppercase mb-1 flex items-center gap-1.5 opacity-90">
                <Target className="w-3 h-3" /> Contoh
              </div>
              <p className="text-xs italic line-clamp-3 opacity-90">"{chapter.example}"</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const chapterColors: Record<number, string> = {
  1: "#eb3b5a",
  2: "#20bf6b",
  3: "#f7b731",
  4: "#3867d6",
  5: "#8854d0",
  6: "#fd9644",
  7: "#fc5c65",
  8: "#2d98da",
  9: "#a5b1c2",
  10: "#4b6584",
};

const ValueAnimation = ({ id }: { id: number }) => {
  return (
    <div className="flex gap-1 h-6 items-end">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-primary"
          initial={{ height: "20%" }}
          animate={{ height: ["20%", "100%", "20%"] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function App_Component({ initialChapterId = 1 }: { initialChapterId?: number }) {
  const [activeChapterId, setActiveChapterId] = useState(initialChapterId);

  useEffect(() => {
    setActiveChapterId(initialChapterId);
  }, [initialChapterId]);
  const [gridSize, setGridSize] = useState(6);
  const currentChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, rotateY: 180 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: { type: "spring" as const, stiffness: 60, damping: 12 },
    },
  };

  const handleNextChapter = () => {
    if (activeChapterId < chapters.length) {
      setActiveChapterId((prev) => prev + 1);
    }
  };

  const handlePrevChapter = () => {
    if (activeChapterId > 1) {
      setActiveChapterId((prev) => prev - 1);
    }
  };

  return (
    <div
      className="flex flex-col pt-6 font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden"
      style={
        { "--theme-color": chapterColors[currentChapter.id] || "#eb3b5a" } as React.CSSProperties
      }
    >
      <main className="w-full flex-1 mx-auto">
        <div className="flex flex-col justify-between items-start mb-8 gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
              {currentChapter.title}
              <span className="text-muted-foreground font-medium ml-2">
                — {currentChapter.subtitle}
              </span>
            </h2>

            <p className="text-sm font-medium text-primary mt-1 leading-snug">
              {currentChapter.tagline}
            </p>

            <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
              <p>{currentChapter.description}</p>
            </div>
          </div>
        </div>

        {/* Sub-chapters Grid */}
        <div className="mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex bg-muted p-1 rounded-lg text-sm font-medium">
              {[2, 3, 4, 5, 6].map((size) => {
                const sizeLabels: Record<number, string> = {
                  2: "Matrikulasi",
                  3: "1 SKS",
                  4: "2 SKS",
                  5: "3 SKS",
                  6: "+ Praktikum",
                };
                return (
                  <button
                    key={size}
                    onClick={() => setGridSize(size)}
                    className={`px-3 py-1.5 rounded-md transition-colors ${gridSize === size ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"}`}
                  >
                    {sizeLabels[size]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full pb-8">
            <motion.div
              key={`grid-${currentChapter.id}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-3 sm:gap-4"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(140px, 1fr))`,
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                const row = Math.floor(index / gridSize);
                const col = index % gridSize;

                const dataIndex = row * gridSize + col;

                const titleOverrides: Record<number, Record<number, string[]>> = {
                  1: {
                    2: ["Uang", "Barter", "Perputaran", "Kelangkaan"],
                    3: [
                      "Pelaku Ekonomi",
                      "Pasar",
                      "Circular Flow",
                      "Alur",
                      "Pemerintah",
                      "Konsumsi",
                      "Produksi",
                      "Mekanisme Pasar",
                      "Harga",
                    ],
                    4: [
                      "Permintaan",
                      "Penawaran",
                      "Keseimbangan",
                      "Elastisitas",
                      "Elastisitas Penawaran",
                      "Substitusi",
                      "Surplus",
                      "Floor & Ceiling",
                      "Intervensi",
                      "Pajak",
                      "Subsidi",
                      "Utilitas",
                      "Biaya Jangka Pendek",
                      "Biaya Jangka Panjang",
                      "Persaingan Sempurna",
                      "Monopoli",
                    ],
                    5: [
                      "Fiskal",
                      "Belanja Negara",
                      "Moneter",
                      "Inflasi",
                      "Deflasi",
                      "Siklus Bisnis",
                      "Pengangguran",
                      "Pertumbuhan",
                      "Neraca Pembayaran",
                      "Kurs",
                      "Tarif",
                      "Organisasi Internasional",
                      "Ekonomi Terbuka",
                      "Krisis Ekonomi",
                      "Ekonomi Indonesia",
                      "Digital",
                      "BUMN",
                      "UMKM",
                      "Industri 4.0",
                      "Ekonomi Kreatif",
                      "Pariwisata",
                      "Ketimpangan",
                      "Pemerataan",
                      "Dana Desa",
                      "Masa Depan Ekonomi",
                    ],
                    6: [
                      "Perilaku",
                      "Mental Accounting",
                      "Overconfidence",
                      "Herding",
                      "Nudge",
                      "Platform",
                      "Fintech",
                      "Cryptocurrency",
                      "Gelembung Aset",
                      "Ekonomi Sirkular",
                      "Perlindungan Sosial",
                      "Ekonomi Digital",
                      "Green Economy",
                      "Blue Economy",
                      "Sharing Economy",
                      "Game Theory",
                      "SDM",
                      "Asimetri Informasi",
                      "Pertumbuhan",
                      "Inovasi",
                      "Kontra-Siklus",
                      "Quantitative Easing",
                      "Ekonomi Perang",
                      "Pasca-Pandemi",
                      "Ekonomi Global",
                      "Subsidi",
                      "Investasi Asing",
                      "Hilirisasi",
                      "Ekonomi Kreatif",
                      "CBDC",
                      "Studi Kasus Pandemi",
                      "Studi Kasus Kripto",
                      "Studi Kasus The Fed",
                      "Studi Kasus Nikel",
                      "Studi Kasus El Nino",
                      "Studi Kasus Argentina",
                    ],
                  },
                  2: {
                    2: ["Data", "Big Data", "Kegagalan Data", "Populasi"],
                    3: [
                      "Kualitatif",
                      "Kuantitatif",
                      "Nominal",
                      "Interval",
                      "Dummy",
                      "Validitas",
                      "Reliabilitas",
                      "Primer",
                      "Pengumpulan Data",
                    ],
                    4: [
                      "Mean",
                      "Median",
                      "Modus",
                      "Pemusatan",
                      "Range",
                      "Varians",
                      "Standar Deviasi",
                      "Koefisien Variasi",
                      "Distribusi",
                      "Histogram",
                      "Diagram",
                      "Frekuensi",
                      "Kuartil",
                      "Desil",
                      "Box Plot",
                      "Penyebaran",
                    ],
                    5: [
                      "Korelasi",
                      "Pearson",
                      "R²",
                      "Regresi",
                      "Slope",
                      "p-value",
                      "Regresi Berganda",
                      "Asumsi Regresi",
                      "Deteksi",
                      "Prediksi",
                      "Prediksi Penjualan",
                      "Prediksi Biaya",
                      "Tren",
                      "Sensitivitas",
                      "Skenario",
                      "Uji t",
                      "Uji Proporsi",
                      "Chi-Square",
                      "T-Test",
                      "ANOVA",
                      "Time Series",
                      "Moving Average",
                      "Exponential Smoothing",
                      "Regresi Time Series",
                      "MAPE",
                    ],
                    6: [
                      "Big Data",
                      "Data Mining",
                      "ML",
                      "Prediktif",
                      "Churn",
                      "Sentimen",
                      "Rekomendasi",
                      "NLP",
                      "Deep Learning",
                      "Etika Data",
                      "Bias",
                      "Transparansi",
                      "Data Scientist",
                      "Dashboard",
                      "Storytelling",
                      "Real-Time",
                      "Cloud",
                      "Data Warehouse",
                      "ETL",
                      "Optimasi",
                      "Personalisasi",
                      "Fraud",
                      "Risiko",
                      "Rantai Pasok",
                      "Pemasaran",
                      "Segmentasi",
                      "Harga",
                      "Produk",
                      "Kualitas",
                      "Sumber Daya",
                      "Studi Kasus E-commerce",
                      "Studi Kasus Musiman",
                      "Studi Kasus Segmentasi",
                      "Studi Kasus Kredit",
                      "Studi Kasus Sentimen",
                      "Studi Kasus Saham",
                    ],
                  },
                  3: {
                    2: ["Manajemen Diri", "Eisenhower", "Time Management", "SMART"],
                    3: [
                      "Planning",
                      "Organizing",
                      "Actuating",
                      "Controlling",
                      "POAC",
                      "Rekrutmen",
                      "Pelatihan",
                      "Penilaian Kinerja",
                      "Kompensasi",
                    ],
                    4: [
                      "Garis",
                      "Fungsional",
                      "Datar",
                      "Sentralisasi",
                      "Keputusan",
                      "Brainstorming",
                      "Konflik",
                      "Perubahan",
                      "Maslow",
                      "Herzberg",
                      "Kepemimpinan",
                      "Transformasional",
                      "Tim",
                      "Talenta",
                      "Proyek",
                      "Tools Proyek",
                    ],
                    5: [
                      "SWOT",
                      "Matriks SWOT",
                      "Pendatang Baru",
                      "Daya Tawar",
                      "Substitusi",
                      "Rantai Nilai",
                      "Keunggulan Kompetitif",
                      "Blue Ocean",
                      "Strategi",
                      "Balance Scorecard",
                      "Identifikasi Risiko",
                      "Mitigasi",
                      "BCP",
                      "TQM",
                      "Lean",
                      "Inovasi",
                      "Layanan",
                      "Reputasi",
                      "CSR",
                      "GCG",
                      "Etika",
                      "Anggaran",
                      "Modal Kerja",
                      "BEP",
                      "Keputusan Investasi",
                    ],
                    6: [
                      "VUCA",
                      "Kotter",
                      "Kubler-Ross",
                      "Agile",
                      "Disruptif",
                      "Learning Organization",
                      "Digital Leadership",
                      "Milenial",
                      "Hybrid",
                      "Stres",
                      "Pengembangan Org",
                      "Change Management",
                      "Resiliensi",
                      "Krisis",
                      "Foresight",
                      "Knowledge",
                      "OKR",
                      "Negosiasi",
                      "Coaching",
                      "DEI",
                      "Perubahan Iklim",
                      "ESG",
                      "Supplier",
                      "Outsourcing",
                      "Benchmarking",
                      "Portofolio Proyek",
                      "Program",
                      "M&E",
                      "GRC",
                      "AI",
                      "Studi Kasus Telkom",
                      "Studi Kasus BUMN",
                      "Studi Kasus Agile",
                      "Studi Kasus Pandemi",
                      "Studi Kasus Blue Ocean",
                      "Studi Kasus ESG",
                    ],
                  },
                  4: {
                    2: ["Komunikasi", "Shannon-Weaver", "Encoding", "Feedback"],
                    3: [
                      "Non-verbal",
                      "Hambatan Psikologis",
                      "Hambatan Kultural",
                      "Body Language",
                      "Paralinguistik",
                      "Active Listening",
                      "Lisan",
                      "Tertulis",
                      "Negosiasi",
                    ],
                    4: [
                      "Iklan",
                      "Promosi",
                      "PR",
                      "Personal Selling",
                      "Direct Marketing",
                      "Branding",
                      "Brand Equity",
                      "IMC",
                      "Media Tradisional",
                      "Media Digital",
                      "Content",
                      "Influencer",
                      "Storytelling",
                      "Visual",
                      "Copywriting",
                      "Customer Journey",
                    ],
                    5: [
                      "Fisher & Ury",
                      "BATNA",
                      "ZOPA",
                      "Reciprocity",
                      "Scarcity",
                      "Authority",
                      "Consistency",
                      "Liking",
                      "Social Proof",
                      "Presentasi",
                      "Slide",
                      "Data Presentasi",
                      "Q&A",
                      "Antarbudaya",
                      "Internal",
                      "Eksternal",
                      "Investor Relations",
                      "Public Affairs",
                      "Media Relations",
                      "Proposal",
                      "Surat",
                      "Email",
                      "Meeting",
                      "Fasilitasi",
                      "Negosiasi Gaji",
                    ],
                    6: [
                      "Krisis",
                      "Respons Krisis",
                      "Hoax",
                      "Social Listening",
                      "War Room",
                      "Transparansi",
                      "Reputation",
                      "Review",
                      "Hukum Digital",
                      "Internal Krisis",
                      "Pelanggan Krisis",
                      "Konferensi Pers",
                      "Personal Branding",
                      "Brand Reputation",
                      "Corporate Storytelling",
                      "Visual Krisis",
                      "Public Speaking",
                      "Teknik Public Speaking",
                      "Penulisan",
                      "Perubahan",
                      "CSR Komunikasi",
                      "Kampanye",
                      "Lobi",
                      "M&A",
                      "Investor Relations",
                      "Public Affairs",
                      "Talenta",
                      "Generasi",
                      "Sosial Media AI",
                      "Masa Depan Komunikasi",
                      "Studi Kasus Indomie",
                      "Studi Kasus Lion Air",
                      "Studi Kasus Data",
                      "Studi Kasus Startup",
                      "Studi Kasus Negosiasi",
                      "Studi Kasus Branding",
                    ],
                  },
                  5: {
                    2: ["5T", "Rantai Pasok", "Pengemasan", "Transportasi"],
                    3: [
                      "Supplier",
                      "Aliran",
                      "Upstream",
                      "Gudang",
                      "Bullwhip",
                      "Pemasok",
                      "Procurement",
                      "MRP",
                      "Persediaan",
                    ],
                    4: [
                      "Darat",
                      "Laut",
                      "Udara",
                      "Pemilihan Moda",
                      "Layout Gudang",
                      "FIFO",
                      "Digital Gudang",
                      "Transportasi",
                      "Distribusi",
                      "Hub & Spoke",
                      "Last Mile",
                      "Label",
                      "Berbahaya",
                      "SCM",
                      "3PL",
                      "Kontrak",
                    ],
                    5: [
                      "Biaya Logistik",
                      "EOQ",
                      "Safety Stock",
                      "ABC",
                      "Biaya",
                      "Total Biaya",
                      "Min-Max",
                      "JIT",
                      "Reverse",
                      "Green",
                      "Reverse",
                      "Risiko Logistik",
                      "Marine Cargo",
                      "Kepabeanan",
                      "Incoterms",
                      "Ekspor",
                      "Bea Cukai",
                      "FTZ",
                      "E-commerce Logistik",
                      "Distribution Center",
                      "Tracking",
                      "Penyimpanan",
                      "Kualitas",
                      "KPI",
                      "Benchmarking",
                    ],
                    6: [
                      "Logistik 4.0",
                      "IoT",
                      "Sensor",
                      "Otomatisasi",
                      "Drone",
                      "Blockchain",
                      "Analytics",
                      "SCRM",
                      "Resiliensi",
                      "Global",
                      "Krisis",
                      "Cold Chain",
                      "Farmasi",
                      "Bencana",
                      "Event",
                      "Multi-Eselon",
                      "Optimasi",
                      "CPFR",
                      "VMI",
                      "Dropshipping",
                      "Daur Ulang",
                      "Sirkular",
                      "Pembayaran",
                      "Platform",
                      "E-logistics",
                      "Internasional",
                      "Halal",
                      "Suhu",
                      "Berbahaya",
                      "Masa Depan",
                      "Studi Kasus Rute",
                      "Studi Kasus Inventori",
                      "Studi Kasus Bencana",
                      "Studi Kasus Vaksin",
                      "Studi Kasus IoT",
                      "Studi Kasus Ekspor",
                    ],
                  },
                  6: {
                    2: ["Jual-Beli", "Produk & Jasa", "Siklus", "Profit"],
                    3: [
                      "Value Proposition",
                      "Jobs to be Done",
                      "Segmentasi",
                      "Pesaing",
                      "Keunggulan",
                      "Merek",
                      "Perilaku",
                      "Customer Journey",
                      "Retensi",
                    ],
                    4: [
                      "B2B",
                      "B2C",
                      "C2C",
                      "B2G",
                      "Penjualan",
                      "Subscription",
                      "Iklan",
                      "Freemium",
                      "Fee",
                      "STP",
                      "Persona",
                      "Analisis Pesaing",
                      "Franchise",
                      "E-commerce",
                      "Internasional",
                      "Startup",
                    ],
                    5: [
                      "Ekspor",
                      "Incoterms",
                      "Dokumen Ekspor",
                      "Sertifikat",
                      "Bea Cukai",
                      "Strategi Masuk",
                      "Joint Venture",
                      "Harga Global",
                      "Hedging",
                      "Budaya Global",
                      "Ekspor",
                      "Distributor",
                      "Waralaba Global",
                      "Multinasional",
                      "Country Risk",
                      "Berkembang",
                      "Pemasaran Global",
                      "Bisnis Keluarga",
                      "Transformasi",
                      "Berkelanjutan",
                      "Sharing",
                      "Platform",
                      "Kreatif",
                      "Social Enterprise",
                      "Masa Depan",
                    ],
                    6: [
                      "Marketplace",
                      "SaaS",
                      "Sharing",
                      "Monetisasi",
                      "Langganan",
                      "Network Effect",
                      "CLV",
                      "Churn",
                      "Subscription",
                      "Freemium",
                      "Growth Hacking",
                      "Platform",
                      "Harga Dinamis",
                      "Go-to-Market",
                      "KPI",
                      "Lean Startup",
                      "BMC",
                      "Blue Ocean",
                      "Skalabilitas",
                      "Ekspansi",
                      "AI",
                      "Big Data",
                      "R&D",
                      "Regulasi",
                      "HKI",
                      "Talenta",
                      "Keberlanjutan",
                      "VUCA",
                      "Iklim",
                      "Metaverse",
                      "Studi Kasus Kuliner",
                      "Studi Kasus Garmen",
                      "Studi Kasus Thrifting",
                      "Studi Kasus Marketplace",
                      "Studi Kasus Subscription",
                      "Studi Kasus Ekspansi",
                    ],
                  },
                };

                const baseChapter = currentChapter.subChapters[dataIndex];
                const overrideTitle = titleOverrides[currentChapter.id]?.[gridSize]?.[dataIndex];

                const chapter = overrideTitle
                  ? { ...baseChapter, title: overrideTitle }
                  : baseChapter;

                return (
                  <ChapterCard
                    key={`${currentChapter.id}-${dataIndex}`}
                    chapter={chapter}
                    gridSize={gridSize}
                    row={row}
                    col={col}
                  />
                );
              })}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
