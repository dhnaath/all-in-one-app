import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Search,
  Plus,
  Star,
  Download,
  Upload,
  X,
  Check,
  Copy,
  ExternalLink,
  Edit2,
  Trash2,
  CalendarDays,
  Grid,
  List,
  ChevronRight,
  Building2,
  Tag,
  Share2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export type EventCategory =
  | "Klien & Rapat"
  | "Workshop & Training"
  | "Konferensi & Seminar"
  | "Advisory & Board"
  | "Keluarga & Personal"
  | "Lainnya";

export type EventLocationType = "online" | "offline" | "hybrid";
export type EventStatus = "upcoming" | "live" | "completed" | "cancelled";

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endDate?: string;
  endTime?: string;
  locationType: EventLocationType;
  locationVenue: string;
  locationUrl?: string;
  organizer: string;
  attendeesCount?: number;
  tags: string[];
  status: EventStatus;
  isStarred?: boolean;
  notes?: string;
}

const STORAGE_KEY = "wira_events_hub_v2";

const INITIAL_EVENTS: EventItem[] = [
  {
    id: "evt-1",
    title: "Kickoff Audit Tata Kelola & Transformasi Digital BUMN",
    description:
      "Pertemuan pembuka dengan Dewan Direksi dan Komite Audit untuk menyepakati lingkup kerja, jadwal wawancara, dan data request list.",
    category: "Klien & Rapat",
    startDate: "2026-03-24",
    startTime: "09:00",
    endDate: "2026-03-24",
    endTime: "11:30",
    locationType: "hybrid",
    locationVenue: "Menara Mandiri Lt. 18 & Zoom Boardroom",
    locationUrl: "https://zoom.us/j/9823412345",
    organizer: "PT Bank Mandiri (Persero) Tbk",
    attendeesCount: 14,
    tags: ["BUMN", "Audit", "Tata Kelola", "Client OS"],
    status: "upcoming",
    isStarred: true,
    notes: "Siapkan 5 eksemplar ringkasan eksekutif dan deck presentasi format PDF.",
  },
  {
    id: "evt-2",
    title: "Workshop Desain Organisasi & Restrukturisasi SDM",
    description:
      "Lokakarya pemetaan kompetensi unit bisnis logistik, perancangan matriks RACI baru, dan penyelarasan KPI tahunan.",
    category: "Workshop & Training",
    startDate: "2026-03-27",
    startTime: "13:30",
    endDate: "2026-03-27",
    endTime: "17:00",
    locationType: "offline",
    locationVenue: "Hotel Pullman Central Park, Grand Ballroom B, Jakarta Barat",
    organizer: "Kalla Group Logistics & Supply Chain",
    attendeesCount: 28,
    tags: ["Workshop", "Organisasi", "RACI", "SDM"],
    status: "upcoming",
    isStarred: true,
    notes: "Fasilitator membawa kartu post-it, flipchart, dan kuesioner evaluasi.",
  },
  {
    id: "evt-3",
    title: "Indonesia Strategy & Leadership Summit 2026",
    description:
      "Konferensi tahunan praktisi strategi korporasi membahas adopsi AI generatif, disrupsi geopolitik, dan dekarbonisasi industri.",
    category: "Konferensi & Seminar",
    startDate: "2026-04-05",
    startTime: "08:30",
    endDate: "2026-04-06",
    endTime: "16:30",
    locationType: "offline",
    locationVenue: "Jakarta International Convention Center (JICC) Senayan",
    locationUrl: "https://maps.google.com/?q=JICC+Senayan+Jakarta",
    organizer: "Asosiasi Konsultan Manajemen Indonesia (AKMI)",
    attendeesCount: 450,
    tags: ["Konferensi", "Kepemimpinan", "AI", "Networking"],
    status: "upcoming",
    isStarred: false,
    notes: "Tiket VIP atas nama Principal Consultant sudah terbit.",
  },
  {
    id: "evt-4",
    title: "Advisory Board Sync: Review Kinerja Portofolio Q1",
    description:
      "Paparan perkembangan EBITDA 4 entitas anak usaha, realisasi dividen interim, dan evaluasi rencana pendanaan seri B.",
    category: "Advisory & Board",
    startDate: "2026-03-31",
    startTime: "15:00",
    endDate: "2026-03-31",
    endTime: "17:00",
    locationType: "online",
    locationVenue: "Google Meet Private Room",
    locationUrl: "https://meet.google.com/abc-defg-hij",
    organizer: "Dewan Komisaris & Advisory Board",
    attendeesCount: 8,
    tags: ["Advisory", "Portofolio", "Q1 Review", "Dividen"],
    status: "upcoming",
    isStarred: true,
    notes: "Laporan neraca konsolidasi sudah diunggah di folder aman.",
  },
  {
    id: "evt-5",
    title: "Silaturahmi & Buka Puasa Bersama Keluarga Besar",
    description:
      "Pertemuan tahunan keluarga besar bani Wiraatmaja, temu kangen lintas generasi, dan koordinasi panitia zakat kerabat.",
    category: "Keluarga & Personal",
    startDate: "2026-04-02",
    startTime: "16:30",
    endDate: "2026-04-02",
    endTime: "20:00",
    locationType: "offline",
    locationVenue: "Rumah Utama Jl. Cikini Raya No. 42, Jakarta Pusat",
    organizer: "Keluarga Besar Wiraatmaja",
    attendeesCount: 40,
    tags: ["Keluarga", "Silaturahmi", "Zakat", "Ramadhan"],
    status: "upcoming",
    isStarred: false,
    notes: "Katering Nasi Tumpeng & Kolak Pisang sudah dipesan.",
  },
  {
    id: "evt-6",
    title: "Klinik Konsultansi 1-on-1: Penajaman Pitch Deck Startup",
    description:
      "Sesi mentoring mendalam bagi founder agritech tentang valuasi komparatif (DCF vs EV/Revenue) dan strategi negosiasi term sheet.",
    category: "Workshop & Training",
    startDate: "2026-03-20",
    startTime: "10:00",
    endDate: "2026-03-20",
    endTime: "11:30",
    locationType: "online",
    locationVenue: "Microsoft Teams Executive Link",
    locationUrl: "https://teams.microsoft.com/l/meetup-join/123",
    organizer: "Inkubator Bisnis Nusantara",
    attendeesCount: 3,
    tags: ["Mentoring", "Startup", "Valuasi", "Pitch Deck"],
    status: "completed",
    isStarred: false,
    notes: "Sesi selesai. Rekaman dan berkas ringkasan telah dikirim ke founder.",
  },
];

const CATEGORIES: { label: EventCategory; color: string }[] = [
  { label: "Klien & Rapat", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { label: "Workshop & Training", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { label: "Konferensi & Seminar", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  { label: "Advisory & Board", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { label: "Keluarga & Personal", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
  { label: "Lainnya", color: "bg-muted-foreground/30/10 text-muted-foreground dark:text-muted-foreground border-border/20" },
];

export function EventsView() {
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_EVENTS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [viewMode, setViewMode] = useState<"agenda" | "grid">("agenda");
  const [activeEventModal, setActiveEventModal] = useState<EventItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState<EventCategory>("Klien & Rapat");
  const [formStartDate, setFormStartDate] = useState("");
  const [formStartTime, setFormStartTime] = useState("09:00");
  const [formEndDate, setFormEndDate] = useState("");
  const [formEndTime, setFormEndTime] = useState("10:30");
  const [formLocationType, setFormLocationType] = useState<EventLocationType>("offline");
  const [formLocationVenue, setFormLocationVenue] = useState("");
  const [formLocationUrl, setFormLocationUrl] = useState("");
  const [formOrganizer, setFormOrganizer] = useState("");
  const [formAttendees, setFormAttendees] = useState<number | "">("");
  const [formTags, setFormTags] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formStarred, setFormStarred] = useState(false);
  const [formStatus, setFormStatus] = useState<EventStatus>("upcoming");

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        if (selectedCategory !== "Semua" && evt.category !== selectedCategory) return false;
        if (statusFilter === "upcoming" && evt.status !== "upcoming" && evt.status !== "live") return false;
        if (statusFilter === "completed" && evt.status !== "completed") return false;
        if (statusFilter === "starred" && !evt.isStarred) return false;

        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          evt.title.toLowerCase().includes(q) ||
          evt.description.toLowerCase().includes(q) ||
          evt.organizer.toLowerCase().includes(q) ||
          evt.locationVenue.toLowerCase().includes(q) ||
          evt.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        const dateA = `${a.startDate} ${a.startTime || "00:00"}`;
        const dateB = `${b.startDate} ${b.startTime || "00:00"}`;
        return dateA.localeCompare(dateB);
      });
  }, [events, selectedCategory, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = events.length;
    const upcoming = events.filter((e) => e.status === "upcoming" || e.status === "live").length;
    const starred = events.filter((e) => e.isStarred).length;
    const clients = events.filter((e) => e.category === "Klien & Rapat" || e.category === "Advisory & Board").length;
    return { total, upcoming, starred, clients };
  }, [events]);

  // Handlers
  const handleToggleStar = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? { ...evt, isStarred: !evt.isStarred } : evt))
    );
  };

  const handleToggleStatus = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== id) return evt;
        const nextStatus: EventStatus = evt.status === "completed" ? "upcoming" : "completed";
        return { ...evt, status: nextStatus };
      })
    );
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm("Hapus acara ini dari jadwal?")) {
      setEvents((prev) => prev.filter((evt) => evt.id !== id));
      if (activeEventModal?.id === id) setActiveEventModal(null);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    const today = new Date().toISOString().split("T")[0];
    setFormTitle("");
    setFormDesc("");
    setFormCategory("Klien & Rapat");
    setFormStartDate(today);
    setFormStartTime("09:00");
    setFormEndDate(today);
    setFormEndTime("10:30");
    setFormLocationType("offline");
    setFormLocationVenue("");
    setFormLocationUrl("");
    setFormOrganizer("");
    setFormAttendees("");
    setFormTags("");
    setFormNotes("");
    setFormStarred(false);
    setFormStatus("upcoming");
    setIsFormOpen(true);
  };

  const openEditModal = (evt: EventItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingEvent(evt);
    setFormTitle(evt.title);
    setFormDesc(evt.description);
    setFormCategory(evt.category);
    setFormStartDate(evt.startDate);
    setFormStartTime(evt.startTime);
    setFormEndDate(evt.endDate || evt.startDate);
    setFormEndTime(evt.endTime || "");
    setFormLocationType(evt.locationType);
    setFormLocationVenue(evt.locationVenue);
    setFormLocationUrl(evt.locationUrl || "");
    setFormOrganizer(evt.organizer);
    setFormAttendees(evt.attendeesCount || "");
    setFormTags(evt.tags.join(", "));
    setFormNotes(evt.notes || "");
    setFormStarred(!!evt.isStarred);
    setFormStatus(evt.status);
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const eventPayload: EventItem = {
      id: editingEvent ? editingEvent.id : `evt-${Date.now()}`,
      title: formTitle.trim(),
      description: formDesc.trim(),
      category: formCategory,
      startDate: formStartDate,
      startTime: formStartTime,
      endDate: formEndDate || formStartDate,
      endTime: formEndTime,
      locationType: formLocationType,
      locationVenue: formLocationVenue.trim() || (formLocationType === "online" ? "Online Meeting" : "Lokasi Ditentukan"),
      locationUrl: formLocationUrl.trim(),
      organizer: formOrganizer.trim() || "Internal",
      attendeesCount: formAttendees ? Number(formAttendees) : undefined,
      tags: tagsArray.length > 0 ? tagsArray : ["Acara"],
      status: formStatus,
      isStarred: formStarred,
      notes: formNotes.trim(),
    };

    if (editingEvent) {
      setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? eventPayload : e)));
    } else {
      setEvents((prev) => [eventPayload, ...prev]);
    }

    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleExportICS = (evt?: EventItem) => {
    const items = evt ? [evt] : events;
    if (items.length === 0) return;

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ClientOS//Events//ID\nCALSCALE:GREGORIAN\n";
    items.forEach((item) => {
      const cleanStart = `${item.startDate.replace(/-/g, "")}T${(item.startTime || "09:00").replace(/:/g, "")}00`;
      const cleanEnd = item.endTime
        ? `${(item.endDate || item.startDate).replace(/-/g, "")}T${item.endTime.replace(/:/g, "")}00`
        : cleanStart;
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:${item.id}@clientos.internal\n`;
      icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z\n`;
      icsContent += `DTSTART:${cleanStart}\n`;
      icsContent += `DTEND:${cleanEnd}\n`;
      icsContent += `SUMMARY:${item.title.replace(/,/g, "\\,")}\n`;
      icsContent += `DESCRIPTION:${item.description.replace(/,/g, "\\,").replace(/\n/g, "\\n")}\n`;
      icsContent += `LOCATION:${item.locationVenue.replace(/,/g, "\\,")}\n`;
      icsContent += "STATUS:CONFIRMED\n";
      icsContent += "END:VEVENT\n";
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = evt ? `${evt.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.ics` : "jadwal-acara-clientos.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `events-backup-${new Date().toISOString().split("T")[0]}.json`);
    dl.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setEvents(parsed);
          alert(`Berhasil mengimpor ${parsed.length} acara.`);
        }
      } catch {
        alert("Gagal membaca berkas JSON. Format tidak sesuai.");
      }
    };
    reader.readAsText(file);
  };

  const copyEventInfo = (evt: EventItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const text = `📌 ${evt.title}\n📅 Tanggal: ${formatDateID(evt.startDate)} (${evt.startTime || "09:00"} WIB)\n📍 Lokasi: ${evt.locationVenue}${evt.locationUrl ? `\n🔗 Link: ${evt.locationUrl}` : ""}\n👤 Penyelenggara: ${evt.organizer}\n📝 Keterangan: ${evt.description}`;
    navigator.clipboard.writeText(text);
    setCopiedId(evt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDateID = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getRelativeDayBadge = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const target = new Date(y, m - 1, d);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const diffTime = target.getTime() - now.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return { label: "Hari Ini", className: "bg-rose-500/10 text-rose-600 border-rose-500/20 font-semibold" };
      if (diffDays === 1) return { label: "Besok", className: "bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold" };
      if (diffDays === 2) return { label: "2 Hari Lagi", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
      if (diffDays > 2 && diffDays <= 7) return { label: `${diffDays} Hari Lagi`, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
      if (diffDays < 0) return { label: "Terlewati", className: "bg-muted text-muted-foreground border-border" };
      return { label: formatDateID(dateStr), className: "bg-muted/60 text-muted-foreground border-border" };
    } catch {
      return { label: dateStr, className: "bg-muted text-muted-foreground border-border" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Counters Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="text-xs font-medium text-muted-foreground">Total Acara</div>
          <div className="text-2xl font-bold tracking-tight text-foreground mt-1">{stats.total}</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Mendatang</div>
          <div className="text-2xl font-bold tracking-tight text-foreground mt-1">{stats.upcoming}</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400">Pertemuan Klien</div>
          <div className="text-2xl font-bold tracking-tight text-foreground mt-1">{stats.clients}</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="text-xs font-medium text-purple-600 dark:text-purple-400">Acara Berbintang</div>
          <div className="text-2xl font-bold tracking-tight text-foreground mt-1">{stats.starred}</div>
        </div>
      </div>

      {/* Action & Filter Toolbar */}
      <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari acara, lokasi, penyelenggara, atau tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Controls & CTA buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="Semua">Semua Status</option>
              <option value="upcoming">Mendatang</option>
              <option value="completed">Selesai</option>
              <option value="starred">⭐ Berbintang</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40">
              <button
                onClick={() => setViewMode("agenda")}
                className={cn(
                  "p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                  viewMode === "agenda" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                )}
                title="Agenda Timeline"
              >
                <List className="size-4" />
                <span className="hidden sm:inline">Agenda</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                  viewMode === "grid" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                )}
                title="Grid Kartu"
              >
                <Grid className="size-4" />
                <span className="hidden sm:inline">Kartu</span>
              </button>
            </div>

            {/* ICS / JSON Export */}
            <button
              onClick={() => handleExportICS()}
              className="px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground flex items-center gap-1.5 transition-colors"
              title="Ekspor seluruh acara ke iCalendar (.ics)"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span className="hidden md:inline">Kalender .ics</span>
            </button>

            <label className="cursor-pointer px-2.5 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground flex items-center gap-1.5 transition-colors" title="Impor Berkas JSON">
              <Upload className="size-3.5 text-muted-foreground" />
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleExportJSON}
              className="px-2.5 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground flex items-center gap-1.5 transition-colors"
              title="Cadangkan Berkas JSON"
            >
              <Share2 className="size-3.5 text-muted-foreground" />
            </button>

            {/* Primary Add Button */}
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="size-4" />
              <span>Tambah Acara</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-border/60">
          <button
            onClick={() => setSelectedCategory("Semua")}
            className={cn(
              "px-3 py-1 rounded-md transition-colors whitespace-nowrap font-medium",
              selectedCategory === "Semua"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            Semua ({events.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = events.filter((e) => e.category === cat.label).length;
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors whitespace-nowrap font-medium border",
                  isSelected
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                )}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Section: Agenda vs Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-xl bg-card/40">
          <Calendar className="size-10 text-muted-foreground/50 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-foreground">Tidak ada acara ditemukan</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "Coba ubah kata kunci pencarian atau sesuaikan filter kategori Anda."
              : "Belum ada agenda acara tersimpan. Klik tombol Tambah Acara untuk membuat jadwal baru."}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
          >
            <Plus className="size-3.5" />
            Tambah Acara Pertama
          </button>
        </div>
      ) : viewMode === "agenda" ? (
        <div className="space-y-3">
          {filteredEvents.map((evt) => {
            const relBadge = getRelativeDayBadge(evt.startDate);
            const isFinished = evt.status === "completed";
            const categoryObj = CATEGORIES.find((c) => c.label === evt.category);

            return (
              <div
                key={evt.id}
                onClick={() => setActiveEventModal(evt)}
                className={cn(
                  "group relative p-4 rounded-xl border border-border bg-card hover:border-foreground/30 transition-all cursor-pointer shadow-xs",
                  isFinished && "opacity-75 bg-card/60"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left Column: Date badge + Details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Date Block */}
                    <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-muted/70 border border-border text-center">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                        {new Date(evt.startDate).toLocaleDateString("id-ID", { month: "short" })}
                      </span>
                      <span className="text-lg font-extrabold text-foreground leading-none">
                        {evt.startDate.split("-")[2]}
                      </span>
                      <span className="text-[9px] text-muted-foreground font-medium">
                        {evt.startTime || "09:00"}
                      </span>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("text-[11px] px-2 py-0.5 rounded-md border font-medium", categoryObj?.color)}>
                          {evt.category}
                        </span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded border", relBadge.className)}>
                          {relBadge.label}
                        </span>
                        {evt.status === "completed" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded border border-muted bg-muted text-muted-foreground font-medium">
                            Selesai
                          </span>
                        )}
                      </div>

                      <h3 className={cn("text-base font-semibold text-foreground truncate", isFinished && "line-through text-muted-foreground")}>
                        {evt.title}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {evt.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-0.5 flex-wrap">
                        <div className="flex items-center gap-1">
                          {evt.locationType === "online" ? (
                            <Video className="size-3.5 text-blue-500 shrink-0" />
                          ) : (
                            <MapPin className="size-3.5 text-rose-500 shrink-0" />
                          )}
                          <span className="truncate max-w-[220px]">{evt.locationVenue}</span>
                        </div>
                        {evt.organizer && (
                          <div className="flex items-center gap-1">
                            <Building2 className="size-3.5 shrink-0" />
                            <span className="truncate max-w-[180px]">{evt.organizer}</span>
                          </div>
                        )}
                        {evt.attendeesCount && (
                          <div className="flex items-center gap-1">
                            <Users className="size-3.5 shrink-0" />
                            <span>{evt.attendeesCount} Peserta</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50 justify-end">
                    {/* Status Checkbox toggle */}
                    <button
                      onClick={(e) => handleToggleStatus(evt.id, e)}
                      className={cn(
                        "p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1",
                        isFinished
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "border-border hover:bg-muted text-muted-foreground"
                      )}
                      title={isFinished ? "Tandai Belum Selesai" : "Tandai Selesai"}
                    >
                      <Check className="size-3.5" />
                      <span className="hidden md:inline">{isFinished ? "Selesai" : "Tandai"}</span>
                    </button>

                    {/* Star Button */}
                    <button
                      onClick={(e) => handleToggleStar(evt.id, e)}
                      className={cn(
                        "p-2 rounded-lg border transition-colors",
                        evt.isStarred
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "border-border hover:bg-muted text-muted-foreground"
                      )}
                      title={evt.isStarred ? "Hapus Bintang" : "Beri Bintang"}
                    >
                      <Star className="size-3.5 fill-current" />
                    </button>

                    {/* Copy Info */}
                    <button
                      onClick={(e) => copyEventInfo(evt, e)}
                      className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors"
                      title="Salin Rincian Acara"
                    >
                      {copiedId === evt.id ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    </button>

                    {/* Direct Meeting link if online */}
                    {evt.locationUrl && (
                      <a
                        href={evt.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg border border-border hover:bg-muted text-blue-600 dark:text-blue-400 transition-colors"
                        title="Buka Tautan Rapat / Peta"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}

                    {/* Download individual .ics */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportICS(evt);
                      }}
                      className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors"
                      title="Unduh Kalender (.ics)"
                    >
                      <CalendarDays className="size-3.5" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={(e) => openEditModal(evt, e)}
                      className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors"
                      title="Edit Acara"
                    >
                      <Edit2 className="size-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => handleDelete(evt.id, e)}
                      className="p-2 rounded-lg border border-border hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 hover:border-rose-500/20 transition-colors"
                      title="Hapus Acara"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((evt) => {
            const relBadge = getRelativeDayBadge(evt.startDate);
            const isFinished = evt.status === "completed";
            const categoryObj = CATEGORIES.find((c) => c.label === evt.category);

            return (
              <div
                key={evt.id}
                onClick={() => setActiveEventModal(evt)}
                className={cn(
                  "p-5 rounded-xl border border-border bg-card hover:border-foreground/30 transition-all cursor-pointer flex flex-col justify-between shadow-xs relative group",
                  isFinished && "opacity-75 bg-card/60"
                )}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={cn("text-[11px] px-2 py-0.5 rounded-md border font-medium", categoryObj?.color)}>
                      {evt.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded border", relBadge.className)}>
                        {relBadge.label}
                      </span>
                      <button
                        onClick={(e) => handleToggleStar(evt.id, e)}
                        className={cn(
                          "p-1 rounded text-muted-foreground hover:text-foreground",
                          evt.isStarred && "text-amber-500 fill-current"
                        )}
                      >
                        <Star className="size-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className={cn("text-base font-semibold text-foreground line-clamp-2 mb-2", isFinished && "line-through text-muted-foreground")}>
                    {evt.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                {/* Card Meta & Actions */}
                <div className="space-y-3 pt-3 border-t border-border/60">
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-muted-foreground shrink-0" />
                      <span>{formatDateID(evt.startDate)} • {evt.startTime || "09:00"} {evt.endTime ? `- ${evt.endTime}` : ""} WIB</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {evt.locationType === "online" ? (
                        <Video className="size-3.5 text-blue-500 shrink-0" />
                      ) : (
                        <MapPin className="size-3.5 text-rose-500 shrink-0" />
                      )}
                      <span className="truncate">{evt.locationVenue}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-1">
                      {evt.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportICS(evt);
                        }}
                        className="p-1.5 rounded-md border border-border hover:bg-muted text-muted-foreground"
                        title="Unduh .ics"
                      >
                        <Download className="size-3" />
                      </button>
                      <button
                        onClick={(e) => openEditModal(evt, e)}
                        className="p-1.5 rounded-md border border-border hover:bg-muted text-muted-foreground"
                        title="Edit"
                      >
                        <Edit2 className="size-3" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(evt.id, e)}
                        className="p-1.5 rounded-md border border-border hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600"
                        title="Hapus"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Detail Modal */}
      <AnimatePresence>
        {activeEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-border flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs px-2.5 py-0.5 rounded-md border font-medium", CATEGORIES.find(c => c.label === activeEventModal.category)?.color)}>
                      {activeEventModal.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded border border-border bg-muted/60 text-muted-foreground font-medium">
                      {activeEventModal.locationType.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mt-2">
                    {activeEventModal.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveEventModal(null)}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-sm">
                {/* Time & Venue Info Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      Waktu Pelaksanaan
                    </div>
                    <div className="font-medium text-foreground">
                      {formatDateID(activeEventModal.startDate)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activeEventModal.startTime || "09:00"} {activeEventModal.endTime ? `- ${activeEventModal.endTime}` : ""} WIB
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      Lokasi / Ruang
                    </div>
                    <div className="font-medium text-foreground truncate">
                      {activeEventModal.locationVenue}
                    </div>
                    {activeEventModal.locationUrl && (
                      <a
                        href={activeEventModal.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Buka Tautan Acara <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Organizer & Attendees */}
                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-3">
                  <div>
                    Penyelenggara: <span className="font-semibold text-foreground">{activeEventModal.organizer}</span>
                  </div>
                  {activeEventModal.attendeesCount && (
                    <div>
                      Estimasi Peserta: <span className="font-semibold text-foreground">{activeEventModal.attendeesCount} orang</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Deskripsi Acara</h4>
                  <p className="text-foreground leading-relaxed whitespace-pre-line text-sm">
                    {activeEventModal.description}
                  </p>
                </div>

                {/* Notes */}
                {activeEventModal.notes && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-semibold block mb-1">Catatan Persiapan:</span>
                    {activeEventModal.notes}
                  </div>
                )}

                {/* Tags */}
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activeEventModal.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportICS(activeEventModal)}
                    className="px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium flex items-center gap-1.5"
                  >
                    <Download className="size-3.5" />
                    Unduh .ics
                  </button>
                  <button
                    onClick={() => copyEventInfo(activeEventModal)}
                    className="px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium flex items-center gap-1.5"
                  >
                    <Copy className="size-3.5" />
                    Salin Info
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const target = activeEventModal;
                      setActiveEventModal(null);
                      openEditModal(target);
                    }}
                    className="px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium flex items-center gap-1.5"
                  >
                    <Edit2 className="size-3.5" />
                    Ubah
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(activeEventModal.id);
                    }}
                    className="px-3 py-2 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-medium flex items-center gap-1.5"
                  >
                    <Trash2 className="size-3.5" />
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  {editingEvent ? "Ubah Jadwal Acara" : "Tambah Acara Baru"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Judul Acara *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rapat Evaluasi Portofolio Kuartal II..."
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Kategori
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as EventCategory)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.label} value={c.label}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Status Pelaksanaan
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as EventStatus)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="upcoming">Mendatang (Upcoming)</option>
                      <option value="live">Sedang Berlangsung (Live)</option>
                      <option value="completed">Selesai (Completed)</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>
                </div>

                {/* Dates & Times */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Tanggal Mulai *
                    </label>
                    <input
                      type="date"
                      required
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Waktu Mulai
                    </label>
                    <input
                      type="time"
                      value={formStartTime}
                      onChange={(e) => setFormStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Waktu Selesai
                    </label>
                    <input
                      type="time"
                      value={formEndTime}
                      onChange={(e) => setFormEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Location Type & Venue */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Tipe Lokasi
                    </label>
                    <select
                      value={formLocationType}
                      onChange={(e) => setFormLocationType(e.target.value as EventLocationType)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="offline">Tatap Muka (Offline)</option>
                      <option value="online">Pertemuan Daring (Online)</option>
                      <option value="hybrid">Hibrida (Hybrid)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium text-foreground mb-1">
                      Nama Lokasi / Ruangan / Platform *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Zoom Meeting ID / Menara Sudirman Lt. 12"
                      value={formLocationVenue}
                      onChange={(e) => setFormLocationVenue(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Location URL */}
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Tautan Pertemuan / Google Maps
                  </label>
                  <input
                    type="url"
                    placeholder="https://zoom.us/j/... atau https://meet.google.com/..."
                    value={formLocationUrl}
                    onChange={(e) => setFormLocationUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Organizer & Attendees */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Penyelenggara / Klien
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: PT Bank Mandiri / Komite Audit"
                      value={formOrganizer}
                      onChange={(e) => setFormOrganizer(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Estimasi Jumlah Peserta
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 12"
                      value={formAttendees}
                      onChange={(e) => setFormAttendees(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Deskripsi & Agenda
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan tujuan pertemuan, agenda pembahasan, atau keluaran yang diharapkan..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Notes & Prep */}
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Catatan Internal / Dokumen Persiapan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Bawa 3 hardcopy proposal, cetak NDA, dsb."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Tags & Star */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Tagar (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Audit, BUMN, Strategi, Q2"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formStarred}
                        onChange={(e) => setFormStarred(e.target.checked)}
                        className="rounded border-border size-4 text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Star className="size-3.5 text-amber-500 fill-current" />
                        Tandai sebagai Acara Prioritas / Berbintang
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium shadow-xs"
                  >
                    {editingEvent ? "Simpan Perubahan" : "Buat Jadwal Acara"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
