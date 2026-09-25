import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Sparkles,
  NotebookText,
  CalendarDays,
  Compass,
  Gauge,
  MessagesSquare,
  Activity,
  LineChart,
  AlertTriangle,
  AlertOctagon,
  Dice5,
  FileText,
  Shield,
  Calculator,
  HeartHandshake,
  Handshake,
  Tag,
  Navigation,
  Building,
  TrendingUp,
  Package,
  Grid2X2,
  MoreHorizontal,
  Star,
  User,
  Settings,
  Wallet,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Droplet,
  Timer,
  Briefcase,
  Target,
  BookOpen,
  Bookmark,
  Lightbulb,
  Eye,
  Key,
  Dumbbell,
  Utensils,
  Music,
  CloudSun,
  Book,
  Plane,
  ShoppingCart,
  Heart,
  HeartPulse,
  Archive,
  GraduationCap,
  Layers,
  FileCheck,
  PackageCheck,
  Globe,
  Film,
  Gamepad2,
  Podcast,
  PenTool,
  Camera,
  Type,
  Code,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Building2,
  Sprout,
  Search,
  Bell,
  Coins,
  MessageCircle,
  Truck,
  Store,
  Home,
  ScrollText,
  Binary,
  Info,
  Pocket,
  Vault,
  Luggage,
  ShoppingBag,
  Workflow,
  Scale,
  Umbrella,
  Lock,
  ArrowRightLeft,
  Banknote,
  Receipt,
  Brain,
  Network,
  Landmark,
  PieChart,
  Zap,
  ReceiptText,
  Gift,
  LayoutGrid,
  Waves,
  Gem,
  Award,
  ShieldAlert,
  Megaphone,
  Clock,
  Mail,
  Smile,
  TrendingDown,
  Stethoscope,
  Moon,
  Wrench,
  Car,
  Fuel,
  Trash2,
  PhoneCall,
  History,
  GitFork,
  PartyPopper,
  Terminal,
  Database,
  Scissors,
  BellRing,
  FileCheck2,
  HardDrive,
  FileCode2,
  Flag,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  isTemporaryWhiteMarker?: boolean;
};

export type NavGroup = {
  title: string;
  isStandalone?: boolean;
  parentCategory?: string;
  sectionCategory?: string;
  items: NavItem[];
};

export const navSidebar21: NavGroup[] = [
  // 1. Dapur dan Bahan Makanan
  {
    title: "Dapur dan Bahan Makanan",
    parentCategory: "Dapur dan Bahan Makanan",
    items: [
      { to: "/shopping", label: "Shopping", icon: ShoppingCart },
      { to: "/recipes", label: "Recipes", icon: Utensils },
      { to: "/lainnya?app=kitchen-inventory", label: "Inventaris Bahan Dapur", icon: Archive },
      { to: "/lainnya?app=cook-log", label: "Jurnal Memasak", icon: BookOpen },
      { to: "/lainnya?app=expiry-alert", label: "Peringatan Kadaluarsa", icon: AlertTriangle },
      { to: "/lainnya?app=leftover-ideas", label: "Manajemen Makanan Sisa", icon: RefreshCw },
    ],
  },
  // 2. Pemeliharaan Rumah dan Utilitas
  {
    title: "Pemeliharaan Rumah dan Utilitas",
    parentCategory: "Pemeliharaan Rumah dan Utilitas",
    items: [
      { to: "/lainnya?app=home-chores", label: "Jadwal Piket dan Kebersihan", icon: CheckSquare },
      { to: "/lainnya?app=utility-tracker", label: "Meteran Listrik dan Air", icon: Zap },
      { to: "/lainnya?app=appliance-care", label: "Servis Elektronik dan Alat", icon: Wrench },
      { to: "/lainnya?app=home-inventory", label: "Inventaris Perabot dan Ruangan", icon: Home },
      { to: "/lainnya?app=item-disposal", label: "Hibah dan Daur Ulang", icon: Trash2 },
    ],
  },
  // 3. Kendaraan dan Otomotif
  {
    title: "Kendaraan dan Otomotif",
    parentCategory: "Kendaraan dan Otomotif",
    items: [
      { to: "/lainnya?app=vehicle-identity", label: "BPKB STNK Data Kendaraan", icon: Car },
      { to: "/lainnya?app=mileage-fuel", label: "Catatan BBM dan Odometer", icon: Fuel },
      { to: "/lainnya?app=vehicle-service", label: "Riwayat Servis dan Bengkel", icon: Wrench },
      { to: "/lainnya?app=parts-lifecycle", label: "Siklus Ban Aki Komponen", icon: RefreshCw },
      { to: "/lainnya?app=household-renewals", label: "Pajak Asuransi dan Kir", icon: CalendarDays },
    ],
  },
  // 4. Perjalanan
  {
    title: "Perjalanan",
    parentCategory: "Perjalanan",
    items: [
      { to: "/trips", label: "Trips", icon: Plane },
    ],
  },
  // 5. Keluarga dan Internal Rumah
  {
    title: "Keluarga dan Internal Rumah",
    parentCategory: "Keluarga dan Internal Rumah",
    items: [
      { to: "/lainnya?app=family-tree", label: "Silsilah Keluarga (Tree)", icon: GitFork },
      { to: "/lainnya?app=family-rules", label: "Aturan dan Kesepakatan Rumah", icon: Scale },
      { to: "/lainnya?app=family-archive", label: "Arsip Akta Dokumen KK", icon: Archive },
      { to: "/lainnya?app=medical-family", label: "Golongan Darah dan Alergi", icon: HeartHandshake },
    ],
  },
  // 6. Relasi Jejaring dan Profesional
  {
    title: "Relasi Jejaring dan Profesional",
    parentCategory: "Relasi Jejaring dan Profesional",
    items: [
      { to: "/klien", label: "Klien dan Partner", icon: Briefcase },
      { to: "/portal", label: "Portal Kolaborasi", icon: Building2 },
      { to: "/lainnya?app=circle-groups", label: "Lingkaran Relasi (Circles)", icon: Network },
      { to: "/lainnya?app=catchup-cadence", label: "Pengingat Silaturahmi", icon: PhoneCall },
      { to: "/lainnya?app=interaction-timeline", label: "Timeline Pertemuan", icon: History },
      { to: "/lainnya?app=borrowed-items", label: "Pinjam Meminjam Barang", icon: ArrowRightLeft },
      { to: "/lainnya?app=gift-tracker", label: "Pencatat Kado dan Hadiah", icon: Gift },
      { to: "/lainnya?app=reunion-planner", label: "Perencana Reuni dan Arisan", icon: PartyPopper },
      { to: "/lainnya?app=family-anniversary", label: "Ulang Tahun Hari Jadi", icon: CalendarDays },
    ],
  },
  // 7. Lingkungan Komunitas Warga
  {
    title: "Lingkungan Komunitas Warga",
    parentCategory: "Lingkungan Komunitas Warga",
    items: [
      { to: "/lainnya?app=rt-rw-directory", label: "Buku Warga RT RW", icon: Users },
      { to: "/lainnya?app=community-announcements", label: "Papan Pengumuman Warga", icon: Megaphone },
      { to: "/lainnya?app=membership-card", label: "KTA dan Kartu Anggota", icon: CreditCard },
      { to: "/lainnya?app=meeting-resolutions", label: "Hasil Keputusan Rapat", icon: ScrollText },
      { to: "/lainnya?app=public-services-guide", label: "Panduan Layanan Publik", icon: Compass },
      { to: "/lainnya?app=civic-calendar", label: "Kalender Pemilu dan Libur", icon: CalendarDays },
      { to: "/lainnya?app=civil-registry", label: "Administrasi Kependudukan", icon: FileCheck },
      { to: "/lainnya?app=tax-civic", label: "PBB dan Iuran Warga", icon: Receipt },
    ],
  },
  // 8. Sosial dan Keagamaan
  {
    title: "Sosial dan Keagamaan",
    parentCategory: "Sosial dan Keagamaan",
    items: [
      { to: "/zakat", label: "Zakat dan Sedekah", icon: Coins },
      { to: "/lainnya?app=donation-tracker", label: "Catatan Infaq dan Donasi", icon: Coins },
      { to: "/lainnya?app=volunteer-log", label: "Relawan dan Bakti Sosial", icon: Heart },
    ],
  },
  // 9. Keselamatan dan Darurat
  {
    title: "Keselamatan dan Darurat",
    parentCategory: "Keselamatan dan Darurat",
    items: [
      { to: "/lainnya?app=disaster-prep", label: "Tas Siaga Jalur Evakuasi", icon: ShieldAlert },
      { to: "/lainnya?app=emergency-broadcast", label: "Nomor Darurat dan Damkar", icon: PhoneCall },
    ],
  },
  // 10. Perencanaan Alur Kerja Proyek
  {
    title: "Perencanaan Alur Kerja Proyek",
    parentCategory: "Perencanaan Alur Kerja Proyek",
    items: [
      { to: "/proyek", label: "Project Manager", icon: FolderKanban },
      { to: "/workflow-manager", label: "Workflow Manager", icon: Workflow },
      { to: "/lainnya?app=roadmap", label: "Milestone dan Roadmap", icon: Compass },
      { to: "/milestone-manager", label: "Milestone Manager", icon: Flag },
      { to: "/lainnya?app=retro", label: "Review dan Retrospective", icon: RefreshCw },
    ],
  },
  // 11. Pelaksanaan Tugas dan Karya
  {
    title: "Pelaksanaan Tugas dan Karya",
    parentCategory: "Pelaksanaan Tugas dan Karya",
    items: [
      { to: "/task-manager", label: "Task Manager", icon: CheckSquare },
      { to: "/kanban", label: "Kanban Board", icon: LayoutGrid },
      { to: "/eisenhower", label: "Eisenhower Matrix", icon: Grid2X2 },
      { to: "/deliverable-manager", label: "Deliverable Manager", icon: PackageCheck },
      { to: "/approval-manager", label: "Approval Manager", icon: FileCheck2 },
    ],
  },
  // 12. Jadwal dan Kalender
  {
    title: "Jadwal dan Kalender",
    parentCategory: "Jadwal dan Kalender",
    items: [
      { to: "/kalender", label: "Calendar", icon: CalendarDays },
      { to: "/planner", label: "Planner", icon: Clock },
      { to: "/schedule-manager", label: "Schedule Manager", icon: CalendarDays },
      { to: "/timeline", label: "Timeline Manager", icon: Compass },
      { to: "/countdown", label: "Countdown", icon: Timer },
      { to: "/reminder-manager", label: "Reminder Manager", icon: Bell },
    ],
  },
  // 13. Fokus dan Kebiasaan
  {
    title: "Fokus dan Kebiasaan",
    parentCategory: "Fokus dan Kebiasaan",
    items: [
      { to: "/time-tracker", label: "Time Tracker", icon: Timer },
      { to: "/pomodoro", label: "Focus Timer", icon: Timer },
      { to: "/habits", label: "Habit Tracker", icon: Activity },
    ],
  },
  // 14. Rapat dan Kolaborasi Tim
  {
    title: "Rapat dan Kolaborasi Tim",
    parentCategory: "Rapat dan Kolaborasi Tim",
    items: [
      { to: "/collaboration", label: "Collaboration", icon: ShieldCheck },
      { to: "/meeting-manager", label: "Meeting Manager", icon: Users },
      { to: "/lainnya?app=minutes", label: "Risalah Rapat (Minutes)", icon: ScrollText },
      { to: "/interaction-manager", label: "Interaction Manager", icon: MessageSquare },
      { to: "/lainnya?app=canvas", label: "Whiteboard dan Canvas", icon: LayoutGrid },
    ],
  },
  // 15. Manajemen Sumber Daya Manusia
  {
    title: "Manajemen Sumber Daya Manusia",
    parentCategory: "Manajemen Sumber Daya Manusia",
    items: [
      { to: "/people-manager", label: "People Manager", icon: Users },
      { to: "/lainnya?app=workload", label: "Workload dan Capacity", icon: Scale },
      { to: "/notification-center", label: "Notification Center", icon: BellRing },
    ],
  },
  // 16. Dokumentasi dan Wiki
  {
    title: "Dokumentasi dan Wiki",
    parentCategory: "Dokumentasi dan Wiki",
    items: [
      { to: "/lainnya?app=wiki", label: "Knowledge Base (Wiki)", icon: BookOpen },
      { to: "/lainnya?app=sop", label: "SOP dan Prosedur Baku", icon: ShieldCheck },
    ],
  },
  // 17. Pengelolaan Form dan Template
  {
    title: "Pengelolaan Form dan Template",
    parentCategory: "Pengelolaan Form dan Template",
    items: [
      { to: "/template-manager", label: "Template Manager", icon: FileCode2 },
      { to: "/lainnya?app=templates", label: "Template Dokumen Kerja", icon: FileText },
      { to: "/forms", label: "Forms", icon: FileText },
    ],
  },
  // 18. Keuangan dan Aset
  {
    title: "Keuangan dan Aset",
    parentCategory: "Keuangan dan Aset",
    items: [
      { to: "/expense-tracker", label: "Expense Tracker", icon: Receipt },
      { to: "/subscription-manager", label: "Subscription Manager", icon: CreditCard },
      { to: "/asset-manager", label: "Asset Manager", icon: HardDrive },
    ],
  },
  // 19. Vendor dan Logistik Kantor
  {
    title: "Vendor dan Logistik Kantor",
    parentCategory: "Vendor dan Logistik Kantor",
    items: [
      { to: "/lainnya?app=vendors", label: "Vendor dan Pemasok", icon: Truck },
      { to: "/lainnya?app=services-ratecard", label: "Daftar Tarif dan Jasa", icon: ScrollText },
      { to: "/lainnya?app=mailroom", label: "Agenda Surat dan Ekspedisi", icon: Mail },
    ],
  },
  // 20. Target dan Performa
  {
    title: "Target dan Performa",
    parentCategory: "Target dan Performa",
    items: [
      { to: "/goal-manager", label: "Goal Manager", icon: Target },
      { to: "/resource-manager", label: "Resource Manager", icon: Layers },
      { to: "/statistics", label: "Statistics", icon: LineChart },
    ],
  },
  // 21. Utilitas Sistem
  {
    title: "Utilitas Sistem",
    parentCategory: "Utilitas Sistem",
    items: [
      { to: "/search-manager", label: "Search Manager", icon: Search },
      { to: "/lainnya?app=access-matrix", label: "Access dan Key Directory", icon: Shield },
    ],
  },
];

export const navKonsultan: NavGroup[] = [
  // ============================================================================
  // 1. FINANCIAL PLANNING & WEALTH MANAGEMENT (STANDALONE & WEALTH MATRIX)
  // ============================================================================
  {
    title: "Tahapan",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/100-framework", label: "100 Framework", icon: Grid2X2 },
      { to: "/valuasi", label: "Valuasi MAPPI", icon: Building },
    ],
  },
  {
    title: "Commodity Index",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/100-komoditas", label: "100 Komoditas", icon: Package },
      { to: "/syariah", label: "Pasar Muamalah", icon: HeartHandshake },
      { to: "/syariah/indeks", label: "Indeks Sharia", icon: LineChart },
    ],
  },
  {
    title: "Self-Shaping",
    isStandalone: false,
    parentCategory: "Phase Side",
    items: [
      { to: "/reliance", label: "Reliance", icon: ShieldCheck },
      { to: "/sufficient", label: "Sufficient", icon: CheckCircle2 },
      { to: "/improvement", label: "Improvement", icon: TrendingUp },
      { to: "/development", label: "Development", icon: Sparkles },
    ],
  },
  {
    title: "Mutual-Mapping",
    isStandalone: false,
    parentCategory: "Phase Side",
    items: [
      { to: "/interact", label: "Interact", icon: MessagesSquare },
      { to: "/interest", label: "Interest", icon: Heart },
      { to: "/intersect", label: "Intersect", icon: Layers },
      { to: "/interdependence", label: "Interdependence", icon: Workflow },
    ],
  },
  {
    title: "Organization-Optimizing",
    isStandalone: false,
    parentCategory: "Phase Side",
    items: [
      { to: "/insider", label: "Insider", icon: Eye },
      { to: "/insight", label: "Insight", icon: Lightbulb },
      { to: "/outward", label: "Outward", icon: Compass },
      { to: "/outlook", label: "Outlook", icon: TrendingUp },
    ],
  },
  {
    title: "Asset & Earning",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/asset", label: "Kuadran Aset", icon: Briefcase },
      { to: "/earning", label: "Kuadran Pendapatan", icon: DollarSign },
      { to: "/financial-health", label: "Kesehatan Finansial", icon: HeartPulse },
      { to: "/liquid-reserves", label: "Liquid Reserves", icon: Coins },
      { to: "/physical-commodities", label: "Physical Commodities", icon: Package },
      { to: "/real-estate", label: "Real Estate", icon: Home },
      { to: "/paper-securities", label: "Paper Securities", icon: ScrollText },
      { to: "/digital-assets", label: "Digital Assets", icon: Binary },
      { to: "/intellectual-property", label: "Intellectual Property", icon: Lightbulb },
      { to: "/investasi?app=bunga-majemuk", label: "Bunga Majemuk", icon: TrendingUp },
      { to: "/investasi?app=roi", label: "Return on Investment (ROI)", icon: Calculator },
    ],
  },
  {
    title: "Liability & Expense",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/liability", label: "Kuadran Liabilitas", icon: CreditCard },
      { to: "/expense", label: "Kuadran Pengeluaran", icon: ShoppingCart },
      { to: "/kredit", label: "Kredit & Utang", icon: CreditCard },
      { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
      { to: "/budget", label: "Budget", icon: Wallet },
      { to: "/pajak?app=pph21", label: "PPh 21 Personal", icon: Calculator },
      { to: "/pajak?app=saham", label: "Pajak Saham & Dividen", icon: TrendingUp },
      { to: "/pajak?app=properti", label: "Pajak Properti", icon: Briefcase },
      { to: "/pajak?app=ppn", label: "PPN (11%)", icon: ShoppingCart },
    ],
  },
  {
    title: "Wealth Spectrum",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/surety", label: "Tahap 1: Surety", icon: ShieldCheck },
      { to: "/surety?tab=cat_kepatuhan", label: "Kepatuhan Hukum", icon: Scale },
      { to: "/surety?tab=cat_publik", label: "Perlindungan Publik", icon: Globe },
      { to: "/surety?tab=cat_asuransi", label: "Asuransi Pribadi", icon: Umbrella },
      { to: "/surety?tab=cat_dana", label: "Kecukupan Dana", icon: Vault },
      { to: "/surety?tab=cat_proteksi", label: "Proteksi Aset", icon: Lock },
      { to: "/flow", label: "Tahap 2: Flow", icon: Coins },
      { to: "/flow?tab=cat_liabilitas", label: "Beban Liabilitas", icon: CreditCard },
      { to: "/flow?tab=cat_pengeluaran", label: "Pemasukan-Pengeluaran", icon: ArrowRightLeft },
      { to: "/flow?tab=cat_kredit", label: "Kas-Kredit", icon: Banknote },
      { to: "/flow?tab=cat_pajak", label: "Retribusi-Kontribusi", icon: Receipt },
      { to: "/flow?tab=cat_otomatisasi", label: "Sistem Otomatisasi", icon: Activity },
      { to: "/build", label: "Tahap 3: Build", icon: Building },
      { to: "/build?tab=cat_modal", label: "Modal Manusia", icon: Brain },
      { to: "/build?tab=cat_jaringan", label: "Jaringan", icon: Network },
      { to: "/build?tab=cat_portofolio", label: "Portofolio", icon: Briefcase },
      { to: "/build?tab=cat_kekayaan", label: "Kekayaan Bersih", icon: Landmark },
      { to: "/build?tab=cat_pembukuan", label: "Pembukuan", icon: BookOpen },
      { to: "/grow", label: "Tahap 4: Grow", icon: Sprout },
      { to: "/grow?tab=cat_profil", label: "Profil Risiko", icon: Activity },
      { to: "/grow?tab=cat_alokasi", label: "Alokasi", icon: PieChart },
      { to: "/grow?tab=cat_efektif", label: "Efektif-Efisien", icon: Zap },
      { to: "/grow?tab=cat_bunga", label: "Bunga Berbunga", icon: TrendingUp },
      { to: "/grow?tab=cat_rebalance", label: "Rebalancing Periodik", icon: RefreshCw },
      { to: "/legacy", label: "Tahap 5: Legacy", icon: BookOpen },
      { to: "/legacy?tab=cat_pembelajaran", label: "Pembelajaran Seumur Hidup", icon: GraduationCap },
      { to: "/legacy?tab=cat_tatakelola", label: "Tata Kelola yang Baik", icon: Building },
      { to: "/legacy?tab=cat_amal", label: "Kontribusi Amal", icon: HeartHandshake },
      { to: "/legacy?tab=cat_likuidasi", label: "Likuidasi Kewajiban", icon: ReceiptText },
      { to: "/legacy?tab=cat_transfer", label: "Transfer Kekayaan", icon: Gift },
    ],
  },
  {
    title: "Value Treated",
    isStandalone: false,
    parentCategory: "Finance",
    items: [
      { to: "/kurasi/ekonomi", label: "Ekonomi", icon: Coins },
      { to: "/kurasi/statistik", label: "Statistik", icon: LineChart },
      { to: "/kurasi/manajemen", label: "Manajemen", icon: Briefcase },
      { to: "/kurasi/komunikasi", label: "Komunikasi", icon: MessageCircle },
      { to: "/kurasi/logistik", label: "Logistik", icon: Truck },
      { to: "/kurasi/bisnis", label: "Bisnis", icon: Store },
      { to: "/kurasi/administrasi", label: "Administrasi", icon: FileText },
      { to: "/kurasi/akuntansi", label: "Akuntansi", icon: Calculator },
      { to: "/kurasi/asuransi", label: "Asuransi", icon: Shield },
      { to: "/kurasi/investasi", label: "Investasi", icon: TrendingUp },
    ],
  },
  {
    title: "Syariah & Muamalah",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/syariah/terlarang?app=riba", label: "Riba", icon: AlertOctagon },
      { to: "/syariah/terlarang?app=gharar", label: "Gharar", icon: ShieldAlert },
      { to: "/syariah/terlarang?app=maysir", label: "Maysir", icon: Dice5 },
      { to: "/syariah/akad?app=tabarru", label: "Tabarru'", icon: HeartHandshake },
      { to: "/syariah/akad?app=mudharabah", label: "Mudharabah", icon: Scale },
      { to: "/syariah/akad?app=wakalah", label: "Wakalah", icon: Handshake },
      { to: "/syariah/akad?app=wadiah", label: "Wadiah", icon: Archive },
      { to: "/syariah/akad?app=musyarakah", label: "Musyarakah", icon: Users },
      { to: "/syariah/akad?app=murabahah", label: "Murabahah", icon: Tag },
      { to: "/syariah/akad?app=tamin", label: "Ta'min", icon: Shield },
      { to: "/syariah/akad?app=takaful", label: "Takaful", icon: Users },
      { to: "/syariah/akad?app=tadhamun", label: "Tadhamun", icon: Heart },
      { to: "/zakat?app=penghasilan", label: "Zakat Penghasilan", icon: Briefcase },
      { to: "/zakat?app=maal", label: "Zakat Maal", icon: Scale },
      { to: "/zakat?app=fitrah", label: "Zakat Fitrah", icon: Users },
    ],
  },

  // ============================================================================
  // 2. 100 STRATEGIC MANAGEMENT FRAMEWORKS (STANDALONE & MINI-MBA)
  // ============================================================================
  {
    title: "Strategic Management",
    isStandalone: true,
    parentCategory: "100 Tools",
    items: [
      { to: "/swot", label: "SWOT Analysis", icon: Target },
      { to: "/tows", label: "TOWS Matrix", icon: Grid2X2 },
      { to: "/pestel", label: "PESTEL Analysis", icon: Globe },
      { to: "/porter", label: "Porter's Five Forces", icon: ShieldAlert },
      { to: "/vrio", label: "VRIO Framework", icon: Gem },
      { to: "/value-chain", label: "Value Chain Analysis", icon: Workflow },
      { to: "/bcg", label: "BCG Matrix", icon: PieChart },
      { to: "/ge-mckinsey", label: "GE-McKinsey Matrix", icon: LayoutGrid },
      { to: "/ansoff", label: "Ansoff Matrix", icon: TrendingUp },
      { to: "/blue-ocean", label: "Blue Ocean Strategy (ERRC)", icon: Waves },
      { to: "/value-disciplines", label: "Value Disciplines Model", icon: Award },
    ],
  },
  {
    title: "Business Model & Value Proposition",
    isStandalone: true,
    parentCategory: "100 Tools",
    items: [
      { to: "/bmc", label: "Business Model Canvas (BMC)", icon: LayoutGrid },
      { to: "/lean-canvas", label: "Lean Canvas", icon: Grid2X2 },
      { to: "/value-proposition-canvas", label: "Value Proposition Canvas", icon: Target },
      { to: "/empathy-map", label: "Empathy Map", icon: Heart },
    ],
  },
  {
    title: "Marketing & Customer Management",
    isStandalone: true,
    parentCategory: "100 Tools",
    items: [
      { to: "/stp", label: "STP Framework", icon: Compass },
      { to: "/marketing-mix", label: "4P/7P Marketing Mix", icon: Store },
      { to: "/customer-journey-map", label: "Customer Journey Map (CJM)", icon: Navigation },
      { to: "/kano-model", label: "Kano Model", icon: LineChart },
      { to: "/product-life-cycle", label: "Product Life Cycle (PLC)", icon: TrendingUp },
    ],
  },
  {
    title: "Operations & Performance Management",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/six-sigma-dmaic", label: "Six Sigma (DMAIC)", icon: Gauge },
      { to: "/framework/sipoc-diagram", label: "SIPOC Diagram", icon: Workflow },
      { to: "/framework/raci-matrix", label: "RACI Matrix", icon: Users },
      { to: "/framework/gantt-chart", label: "Gantt Chart", icon: CalendarDays },
      { to: "/framework/balanced-scorecard-bsc", label: "Balanced Scorecard (BSC)", icon: Target },
      { to: "/framework/okr-framework", label: "OKR Framework", icon: Award },
      { to: "/framework/eisenhower-matrix", label: "Eisenhower Matrix", icon: Grid2X2 },
    ],
  },
  {
    title: "Financial Management & Business Feasibility",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/analisis-rasio-keuangan", label: "Analisis Rasio Keuangan", icon: Calculator },
      { to: "/framework/capital-budgeting-roi-npv-irr", label: "Capital Budgeting (ROI, NPV, IRR)", icon: Landmark },
      { to: "/framework/break-even-analysis-bep", label: "Break-Even Analysis (BEP)", icon: LineChart },
      { to: "/framework/cost-benefit-analysis-cba", label: "Cost-Benefit Analysis (CBA)", icon: Scale },
      { to: "/framework/business-case-analysis", label: "Business Case Analysis", icon: FileText },
    ],
  },
  {
    title: "Innovation, Entrepreneurship & Design",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/lean-startup-loop", label: "Lean Startup Loop", icon: RefreshCw },
      { to: "/framework/design-thinking", label: "Design Thinking", icon: Lightbulb },
    ],
  },
  {
    title: "Quality Management & Continuous Improvement",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/fishbone-diagram-ishikawa", label: "Fishbone Diagram (Ishikawa)", icon: Workflow },
      { to: "/framework/pdca-cycle", label: "PDCA Cycle", icon: RefreshCw },
      { to: "/framework/house-of-quality-hoq-qfd", label: "House of Quality (HOQ / QFD)", icon: Building },
    ],
  },
  {
    title: "Change Management & Organizational Development",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/mckinsey-7s-framework", label: "McKinsey 7S Framework", icon: Network },
      { to: "/framework/kotters-8-step-change", label: "Kotter's 8-Step Change", icon: TrendingUp },
      { to: "/framework/force-field-analysis", label: "Force Field Analysis", icon: ArrowRightLeft },
    ],
  },
  {
    title: "Public Policy & Program Management",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/logical-framework-analysis", label: "Logical Framework Analysis", icon: Layers },
      { to: "/framework/stakeholder-power-interest", label: "Stakeholder Power-Interest", icon: Users },
      { to: "/framework/analisis-kebijakan-public-dunn", label: "Analisis Kebijakan Public (Dunn)", icon: Scale },
      { to: "/framework/smart-criteria", label: "SMART Criteria", icon: CheckCircle2 },
    ],
  },
  {
    title: "Decision Making & Analytical Thinking",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/decision-tree-analysis", label: "Decision Tree Analysis", icon: Workflow },
      { to: "/framework/decision-matrix-pugh", label: "Decision Matrix (Pugh)", icon: Grid2X2 },
      { to: "/framework/pareto-analysis-8020", label: "Pareto Analysis (80/20)", icon: LineChart },
      { to: "/framework/analytical-hierarchy-process-ahp", label: "Analytical Hierarchy Process (AHP)", icon: Layers },
      { to: "/framework/six-thinking-hats", label: "Six Thinking Hats", icon: Brain },
    ],
  },
  {
    title: "Economics & Quantitative Analysis",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/supply-demand-analysis", label: "Supply-Demand Analysis", icon: TrendingUp },
      { to: "/framework/input-output-analysis", label: "Input-Output Analysis", icon: ArrowRightLeft },
      { to: "/framework/radar-spider-chart", label: "Radar / Spider Chart", icon: Compass },
    ],
  },
  {
    title: "Product Management & Agile/Scrum",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/product-vision-board", label: "Product Vision Board", icon: LayoutDashboard },
      { to: "/framework/kano-feature-prioritization", label: "Kano Feature Prioritization", icon: Star },
      { to: "/framework/scrum-kanban-board", label: "Scrum / Kanban Board", icon: FolderKanban },
      { to: "/framework/rice-scoring-model", label: "RICE Scoring Model", icon: Calculator },
      { to: "/framework/moscow-prioritization", label: "MoSCoW Prioritization", icon: CheckSquare },
      { to: "/framework/user-story-mapping", label: "User Story Mapping", icon: Layers },
      { to: "/framework/opportunity-solution-tree", label: "Opportunity Solution Tree", icon: Workflow },
      { to: "/framework/dual-track-agile-framework", label: "Dual-Track Agile Framework", icon: RefreshCw },
    ],
  },
  {
    title: "Sustainability, ESG & Risk Management",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/esg-materiality-matrix", label: "ESG Materiality Matrix", icon: Globe },
      { to: "/framework/risk-assessment-matrix", label: "Risk Assessment Matrix", icon: ShieldAlert },
      { to: "/framework/triple-bottom-line-tbl", label: "Triple Bottom Line (TBL)", icon: Sprout },
      { to: "/framework/circular-economy-butterfly", label: "Circular Economy (Butterfly)", icon: RefreshCw },
      { to: "/framework/fmea-framework", label: "FMEA Framework", icon: AlertTriangle },
      { to: "/framework/iso-31000-risk-management", label: "ISO 31000 Risk Management", icon: ShieldCheck },
      { to: "/framework/carbon-footprint-scope-1-3", label: "Carbon Footprint (Scope 1-3)", icon: Globe },
      { to: "/framework/business-continuity-plan-bcp", label: "Business Continuity Plan (BCP)", icon: Shield },
    ],
  },
  {
    title: "Leadership, Talent & Culture Management",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/9-box-talent-grid", label: "9-Box Talent Grid", icon: Grid2X2 },
      { to: "/framework/situational-leadership", label: "Situational Leadership", icon: Compass },
      { to: "/framework/johari-window", label: "Johari Window", icon: Eye },
      { to: "/framework/culture-map", label: "Culture Map", icon: Heart },
      { to: "/framework/lencionis-5-dysfunctions", label: "Lencioni’s 5 Dysfunctions", icon: AlertTriangle },
      { to: "/framework/evp-canvas", label: "EVP Canvas", icon: Award },
      { to: "/framework/360-degree-feedback", label: "360-Degree Feedback", icon: RefreshCw },
      { to: "/framework/kirkpatrick-4-level-model", label: "Kirkpatrick 4-Level Model", icon: GraduationCap },
    ],
  },
  {
    title: "Sales, Pricing & Revenue Operations",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/meddpicc-framework", label: "MEDDPICC Framework", icon: Target },
      { to: "/framework/pricing-matrix-elasticity", label: "Pricing Matrix & Elasticity", icon: DollarSign },
      { to: "/framework/unit-economics-clvcac", label: "Unit Economics (CLV/CAC)", icon: Calculator },
      { to: "/framework/spin-selling-framework", label: "SPIN Selling Framework", icon: MessagesSquare },
      { to: "/framework/bant-framework", label: "BANT Framework", icon: CheckCircle2 },
      { to: "/framework/revenue-engine-flywheel", label: "Revenue Engine (Flywheel)", icon: Zap },
      { to: "/framework/value-based-pricing-canvas", label: "Value-Based Pricing Canvas", icon: Gem },
      { to: "/framework/churn-analysis-matrix", label: "Churn Analysis Matrix", icon: TrendingUp },
    ],
  },
  {
    title: "Deep Tech, Innovation & Future Studies",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/technology-readiness-trl", label: "Technology Readiness (TRL)", icon: Binary },
      { to: "/framework/horizon-scanning-futures", label: "Horizon Scanning (Futures)", icon: Compass },
      { to: "/framework/gartner-hype-cycle", label: "Gartner Hype Cycle", icon: LineChart },
      { to: "/framework/doblins-10-types-innovation", label: "Doblin’s 10 Types Innovation", icon: Sparkles },
      { to: "/framework/scamper-ideation-canvas", label: "SCAMPER Ideation Canvas", icon: Lightbulb },
      { to: "/framework/mvp-canvas", label: "MVP Canvas", icon: Briefcase },
      { to: "/framework/open-innovation-model", label: "Open Innovation Model", icon: Globe },
      { to: "/framework/value-proposition-testing", label: "Value Proposition Testing", icon: Target },
    ],
  },
  {
    title: "Public Relations, Crisis & Stakeholder Management",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/scr-framework-minto", label: "SCR Framework (Minto)", icon: FileText },
      { to: "/framework/crisis-communication-scct", label: "Crisis Communication (SCCT)", icon: ShieldAlert },
      { to: "/framework/brand-archetypes", label: "Brand Archetypes", icon: Award },
      { to: "/framework/peso-model", label: "PESO Model", icon: Megaphone },
      { to: "/framework/carrolls-csr-pyramid", label: "Carroll’s CSR Pyramid", icon: Building },
      { to: "/framework/issue-life-cycle", label: "Issue Life Cycle", icon: RefreshCw },
      { to: "/framework/stakeholder-engagement", label: "Stakeholder Engagement", icon: HeartHandshake },
      { to: "/framework/press-release-canvas", label: "Press Release Canvas", icon: PenTool },
    ],
  },

  // ============================================================================
  // 3. PRODUCTIVITY, OPERATIONS & OWNERSHIP (STANDALONE + GROUPED UTILITIES)
  // ============================================================================
  {
    title: "Productivity",
    isStandalone: true,
    parentCategory: "Productivity",
    items: [
      { to: "/task-manager", label: "Task Manager", icon: CheckSquare, isTemporaryWhiteMarker: true },
      { to: "/kalender", label: "Calendar", icon: CalendarDays, isTemporaryWhiteMarker: true },
      { to: "/proyek", label: "Project Manager", icon: FolderKanban, isTemporaryWhiteMarker: true },
      { to: "/planner", label: "Planner", icon: Clock, isTemporaryWhiteMarker: true },
      { to: "/reminder-manager", label: "Reminder Manager", icon: Bell, isTemporaryWhiteMarker: true },
      { to: "/habits", label: "Habit Tracker", icon: Activity, isTemporaryWhiteMarker: true },
      { to: "/pomodoro", label: "Focus Timer", icon: Timer, isTemporaryWhiteMarker: true },
      { to: "/eisenhower", label: "Eisenhower Matrix", icon: Grid2X2, isTemporaryWhiteMarker: true },
      { to: "/kanban", label: "Kanban Board", icon: LayoutGrid, isTemporaryWhiteMarker: true },
      { to: "/timeline", label: "Timeline Manager", icon: Compass, isTemporaryWhiteMarker: true },
      { to: "/countdown", label: "Countdown", icon: Timer, isTemporaryWhiteMarker: true },
      { to: "/meeting-manager", label: "Meeting Manager", icon: Users, isTemporaryWhiteMarker: true },
      { to: "/deliverable-manager", label: "Deliverable Manager", icon: PackageCheck, isTemporaryWhiteMarker: true },
      { to: "/workflow-manager", label: "Workflow Manager", icon: Workflow, isTemporaryWhiteMarker: true },
      { to: "/forms", label: "Forms", icon: FileText, isTemporaryWhiteMarker: true },
      { to: "/collaboration", label: "Collaboration", icon: ShieldCheck, isTemporaryWhiteMarker: true },
      { to: "/statistics", label: "Statistics", icon: LineChart, isTemporaryWhiteMarker: true },
      { to: "/search-manager", label: "Search Manager", icon: Search, isTemporaryWhiteMarker: true },
      { to: "/notification-center", label: "Notification Center", icon: BellRing, isTemporaryWhiteMarker: true },
      { to: "/approval-manager", label: "Approval Manager", icon: FileCheck2, isTemporaryWhiteMarker: true },
      { to: "/asset-manager", label: "Asset Manager", icon: HardDrive, isTemporaryWhiteMarker: true },
      { to: "/template-manager", label: "Template Manager", icon: FileCode2, isTemporaryWhiteMarker: true },
      { to: "/goal-manager", label: "Goal Manager", icon: Target, isTemporaryWhiteMarker: true },
      { to: "/milestone-manager", label: "Milestone Manager", icon: Flag, isTemporaryWhiteMarker: true },
      { to: "/time-tracker", label: "Time Tracker", icon: Timer, isTemporaryWhiteMarker: true },
      { to: "/resource-manager", label: "Resource Manager", icon: Layers, isTemporaryWhiteMarker: true },
      { to: "/people-manager", label: "People Manager", icon: Users, isTemporaryWhiteMarker: true },
      { to: "/interaction-manager", label: "Interaction Manager", icon: MessageSquare, isTemporaryWhiteMarker: true },
      { to: "/schedule-manager", label: "Schedule Manager", icon: CalendarDays, isTemporaryWhiteMarker: true },
      { to: "/subscription-manager", label: "Subscription Manager", icon: CreditCard, isTemporaryWhiteMarker: true },
      { to: "/expense-tracker", label: "Expense Tracker", icon: Receipt, isTemporaryWhiteMarker: true },
      { to: "/lainnya?app=roadmap", label: "Milestone & Roadmap", icon: Compass },
      { to: "/lainnya?app=retro", label: "Review & Retrospective", icon: RefreshCw },
      { to: "/lainnya?app=canvas", label: "Whiteboard & Canvas", icon: LayoutGrid },
      { to: "/lainnya?app=wiki", label: "Knowledge Base (Wiki)", icon: BookOpen },
      { to: "/lainnya?app=workload", label: "Workload & Capacity", icon: Scale },
      { to: "/lainnya?app=sop", label: "SOP & Prosedur Baku", icon: ShieldCheck },
      { to: "/lainnya?app=templates", label: "Template Dokumen Kerja", icon: FileText },
      { to: "/lainnya?app=vendors", label: "Vendor & Pemasok", icon: Truck },
      { to: "/lainnya?app=services-ratecard", label: "Daftar Tarif & Jasa", icon: ScrollText },
      { to: "/lainnya?app=mailroom", label: "Agenda Surat & Ekspedisi", icon: Mail },
      { to: "/lainnya?app=minutes", label: "Risalah Rapat (Minutes)", icon: ScrollText },
      { to: "/lainnya?app=access-matrix", label: "Access & Key Directory", icon: Shield },
    ],
  },
  {
    title: "Business",
    isStandalone: true,
    parentCategory: "Productivity",
    items: [
      { to: "/katalog-produk", label: "Katalog Produk", icon: Package },
      { to: "/inventory", label: "Inventory", icon: Archive },
      { to: "/portal/pesan", label: "Pesan Klien", icon: MessagesSquare },
      { to: "/contacts", label: "Kontak & CRM", icon: Users },
      { to: "/reports", label: "Laporan Khusus", icon: NotebookText },
    ],
  },
  {
    title: "Knowledge",
    isStandalone: true,
    parentCategory: "Productivity",
    items: [
      { to: "/notes", label: "Notes", icon: FileText, isTemporaryWhiteMarker: true },
      { to: "/documents", label: "Documents", icon: FileCheck, isTemporaryWhiteMarker: true },
      { to: "/database", label: "Database", icon: Database, isTemporaryWhiteMarker: true },
      { to: "/web-clipper", label: "Web Clipper", icon: Scissors, isTemporaryWhiteMarker: true },
      { to: "/research-manager", label: "Research Manager", icon: Compass, isTemporaryWhiteMarker: true },
      { to: "/knowledge-base", label: "Knowledge Base", icon: BookOpen, isTemporaryWhiteMarker: true },
      { to: "/wiki", label: "Wiki Engine", icon: BookOpen, isTemporaryWhiteMarker: true },
      { to: "/catatan", label: "Catatan Cepat", icon: NotebookText },
      { to: "/ideas", label: "Ideas & Ide", icon: Lightbulb },
      { to: "/bookmarks", label: "Bookmark Manager", icon: Bookmark, isTemporaryWhiteMarker: true },
      { to: "/incoterms", label: "Panduan Incoterms", icon: Navigation },
      { to: "/reading", label: "Reading List", icon: Book },
    ],
  },

  // ============================================================================
  // 4. PERSONAL, ESSENTIALS & HOUSEHOLD (GROUPED LIFESTYLE, VEHICLE & ESSENTIALS)
  // ============================================================================
  {
    title: "Personal",
    isStandalone: true,
    parentCategory: "Personal",
    items: [
      { to: "/proyek-personal", label: "Personal Projects", icon: Briefcase },
      { to: "/journal", label: "Journal Harian", icon: BookOpen },
      { to: "/journal?tab=gratitude", label: "Buku Syukur (Gratitude)", icon: Heart },
      { to: "/journal?tab=mood", label: "Mood dan Energi Harian", icon: Smile },
      { to: "/health", label: "Health", icon: Heart },
      { to: "/health?tab=workouts", label: "Workouts", icon: Dumbbell },
      { to: "/health?tab=water", label: "Water", icon: Droplet },
      { to: "/health?tab=medical-records", label: "Riwayat Rekam Medis", icon: Stethoscope },
      { to: "/health?tab=vitals", label: "Tekanan dan Gula Darah", icon: HeartPulse },
      { to: "/health?tab=body-metrics", label: "Pengukuran Tubuh dan Berat", icon: Scale },
      { to: "/health?tab=sleep", label: "Kualitas Tidur dan Istirahat", icon: Moon },
      { to: "/health?tab=skincare", label: "Skincare dan Grooming", icon: Sparkles },
      { to: "/vault", label: "Vault", icon: Vault },
      { to: "/vault?tab=ktp", label: "KTP dan Identitas Resmi", icon: Shield },
      { to: "/vault?tab=certificates", label: "Ijazah dan Sertifikat", icon: Award },
      { to: "/passwords", label: "Passwords", icon: Key },
      { to: "/kalkulator", label: "Kalkulator", icon: Calculator },
    ],
  },
  {
    title: "Essentials",
    isStandalone: false,
    parentCategory: "Personal",
    items: [
      { to: "/wallet", label: "Wallet dan Kas", icon: Wallet },
      { to: "/wallet?tab=price-compare", label: "Pembanding Harga", icon: TrendingDown },
      { to: "/wallet?tab=wishlist", label: "Rencana Belanja (Wishlist)", icon: ShoppingBag },
      { to: "/wallet?tab=warranty", label: "Garansi dan Bukti Nota", icon: ShieldCheck },
      { to: "/shopping", label: "Shopping", icon: ShoppingCart },
      { to: "/weather", label: "Weather", icon: CloudSun },
      { to: "/pocket", label: "Pocket", icon: Pocket },
      { to: "/pouch", label: "Pouch", icon: ShoppingBag },
    ],
  },
  {
    title: "Household",
    isStandalone: false,
    parentCategory: "Personal",
    items: [
      { to: "/recipes", label: "Recipes", icon: Utensils },
      { to: "/recipes?tab=pantry", label: "Inventaris Bahan Dapur", icon: Archive },
      { to: "/recipes?tab=cook-log", label: "Jurnal Memasak", icon: BookOpen },
      { to: "/recipes?tab=expiry", label: "Peringatan Kadaluarsa", icon: AlertTriangle },
      { to: "/recipes?tab=leftovers", label: "Manajemen Makanan Sisa", icon: RefreshCw },
      { to: "/recipes?tab=meal-planner", label: "Perencana Menu Mingguan", icon: CalendarDays },
      { to: "/trips", label: "Trips", icon: Plane },
      { to: "/trunk", label: "Trunk", icon: Luggage },
    ],
  },

  // ============================================================================
  // 5. PEOPLE, FAMILY, AND SOCIETY (GROUPED CIVIC, FAMILY & MEDIA)
  // ============================================================================
  {
    title: "People, Family, and Society",
    isStandalone: true,
    parentCategory: "Society",
    items: [
      { to: "/klien", label: "Klien & Partner", icon: Briefcase },
      { to: "/portal", label: "Portal Kolaborasi", icon: Building2 },
      { to: "/people-manager", label: "People Manager", icon: Users },
      { to: "/komunitas-warga", label: "Komunitas Warga", icon: Home },
      { to: "/zakat", label: "Zakat & Sedekah", icon: Coins },
      { to: "/lainnya?app=family-tree", label: "Silsilah Keluarga (Tree)", icon: GitFork },
      { to: "/lainnya?app=family-rules", label: "Aturan & Kesepakatan Rumah", icon: Scale },
      { to: "/lainnya?app=family-archive", label: "Arsip Akta & Dokumen KK", icon: Archive },
      { to: "/lainnya?app=medical-family", label: "Golongan Darah & Alergi", icon: HeartHandshake },
      { to: "/lainnya?app=circle-groups", label: "Lingkaran Relasi (Circles)", icon: Network },
      { to: "/lainnya?app=catchup-cadence", label: "Pengingat Silaturahmi", icon: PhoneCall },
      { to: "/lainnya?app=borrowed-items", label: "Pinjam Meminjam Barang", icon: ArrowRightLeft },
      { to: "/lainnya?app=gift-tracker", label: "Pencatat Kado & Hadiah", icon: Gift },
      { to: "/lainnya?app=reunion-planner", label: "Perencana Reuni & Arisan", icon: PartyPopper },
      { to: "/lainnya?app=family-anniversary", label: "Ulang Tahun & Hari Jadi", icon: CalendarDays },
      { to: "/lainnya?app=rt-rw-directory", label: "Buku Warga RT/RW", icon: Users },
      { to: "/lainnya?app=community-announcements", label: "Papan Pengumuman Warga", icon: Megaphone },
      { to: "/lainnya?app=membership-card", label: "KTA & Kartu Anggota", icon: CreditCard },
      { to: "/lainnya?app=meeting-resolutions", label: "Hasil Keputusan Rapat", icon: ScrollText },
      { to: "/lainnya?app=public-services-guide", label: "Panduan Layanan Publik", icon: Compass },
      { to: "/lainnya?app=civic-calendar", label: "Kalender Pemilu & Libur", icon: CalendarDays },
      { to: "/lainnya?app=civil-registry", label: "Administrasi Kependudukan", icon: FileCheck },
      { to: "/lainnya?app=tax-civic", label: "PBB, Retribusi & Iuran Warga", icon: Receipt },
      { to: "/lainnya?app=donation-tracker", label: "Catatan Infaq & Donasi", icon: Coins },
      { to: "/lainnya?app=volunteer-log", label: "Jam Relawan & Bakti Sosial", icon: Heart },
    ],
  },
  {
    title: "Entertainment",
    isStandalone: false,
    parentCategory: "Creative & Media",
    items: [
      { to: "/movies", label: "Movies & Film", icon: Film },
      { to: "/games", label: "Games & Hiburan", icon: Gamepad2 },
      { to: "/podcasts", label: "Podcasts", icon: Podcast },
      { to: "/music", label: "Music & Audio", icon: Music },
    ],
  },
  {
    title: "Creative",
    isStandalone: false,
    parentCategory: "Creative & Media",
    items: [
      { to: "/design", label: "Design Studio", icon: PenTool },
      { to: "/photography", label: "Photography", icon: Camera },
      { to: "/writing", label: "Writing & Editor", icon: Type },
      { to: "/code", label: "Code & Dev", icon: Code },
    ],
  },
  {
    title: "Academy & Learning",
    isStandalone: false,
    parentCategory: "Academy & Tools",
    items: [
      { to: "/courses", label: "Courses", icon: GraduationCap },
      { to: "/flashcards", label: "Flashcards", icon: Layers },
      { to: "/exams", label: "Exams", icon: FileCheck },
      { to: "/languages", label: "Languages", icon: Globe },
    ],
  },
];

export const otherNavGroups: NavGroup[] = [
  // 100 Strategic Management Frameworks (17 Groups)
  ...navKonsultan
    .filter((g) => g.parentCategory === "100 Tools")
    .map((g) => ({ ...g, sectionCategory: "100 Framework" })),

  // Financial Planning & Wealth Management (10 Groups)
  ...navKonsultan
    .filter((g) => g.parentCategory === "Finance" || g.parentCategory === "Phase Side")
    .map((g) => ({ ...g, sectionCategory: "Keuangan & Pasar" })),

  // Kesehatan & Gaya Hidup Pribadi (2 Groups)
  ...navKonsultan
    .filter((g) => g.title === "Essentials" || g.title === "Personal")
    .map((g) => ({ ...g, sectionCategory: "Kesehatan & Personal" })),

  // Media Kreatif & Akademi Pembelajaran (3 Groups)
  ...navKonsultan
    .filter((g) => g.parentCategory === "Creative & Media" || g.parentCategory === "Academy & Tools")
    .map((g) => ({ ...g, sectionCategory: "Kreatif & Akademi" })),

  // Knowledge & Bisnis Lanjutan (2 Groups)
  ...navKonsultan
    .filter((g) => g.title === "Knowledge" || g.title === "Business")
    .map((g) => ({ ...g, sectionCategory: "Knowledge & Bisnis" })),
];

export const navSidebar21WithSection: NavGroup[] = navSidebar21.map((g) => ({
  ...g,
  sectionCategory: "21 Kategori",
}));

export const navAllSidebar: NavGroup[] = [
  ...navSidebar21WithSection,
  ...otherNavGroups,
];

