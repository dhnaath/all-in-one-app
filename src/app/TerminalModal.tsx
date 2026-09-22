import { useState, useRef, useEffect, FormEvent } from "react";
import {
  Terminal,
  X,
  Send,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Wallet,
  Bot,
  User,
} from "lucide-react";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "system" | "user" | "ai";
  text: string;
  time: string;
}

export function TerminalModal({ isOpen, onClose }: TerminalModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "system",
      text: "All in One Executive Terminal v2.4 siap. Anda dapat mengetik perintah cepat ('help', 'tugas', 'kas', 'jadwal') atau mengajukan pertanyaan analisis bisnis langsung ke AI.",
      time: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI / Terminal command evaluation
    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (lower === "help" || lower === "?") {
        reply =
          "Daftar Perintah Terminal:\n• tugas / tasks : Tampilkan prioritas tugas aktif\n• kas / finance : Ringkasan kesehatan kas dan transaksi\n• jadwal / meeting : Tampilkan agenda terdekat\n• clear : Bersihkan layar terminal\n• Pertanyaan bebas : Ketik langsung untuk analisis konsultasi AI";
      } else if (lower === "clear" || lower === "cls") {
        setMessages([
          {
            id: `init-${Date.now()}`,
            sender: "system",
            text: "Layar terminal telah dibersihkan. Sistem siap menerima perintah baru.",
            time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsTyping(false);
        return;
      } else if (lower.includes("tugas") || lower.includes("task")) {
        reply =
          "📋 Status Deliverable & Tugas Teratas:\n1. [Tinggi] Finalisasi Deck Presentasi Evaluasi Q4\n2. [Sedang] Rekonsiliasi Faktur Retainer Klien Utama\n3. [Normal] Review Analisis Arus Kas & Runway\n\nSemua tugas tersinkronisasi di Task Manager.";
      } else if (lower.includes("kas") || lower.includes("uang") || lower.includes("finance")) {
        reply =
          "💰 Ringkasan Arus Kas & Finansial:\n• Saldo Kas Operasional: Aman (Runway ~8.4 bulan)\n• Piutang Retainer Masuk: Rp 45.000.000 (Telah dikonfirmasi)\n• Estimasi Beban Tetap Bulan Ini: Rp 18.250.000\n\nRincian penuh dapat diakses di menu Finance.";
      } else if (lower.includes("jadwal") || lower.includes("meeting") || lower.includes("rapat")) {
        reply =
          "🗓️ Agenda Mendatang Hari Ini:\n• 10:00 WIB - Strategic Alignment Call dengan Klien Korporasi\n• 14:00 WIB - Internal Sprint & Review Deliverable\n• 16:30 WIB - Rekonsiliasi Anggaran & Outward Outlook";
      } else {
        reply = `Berdasarkan analisis konteks sistem operasi Anda: "${query}" berkaitan dengan optimalisasi kerja konsultan. Seluruh data proyek, metrik keuangan, dan catatan strategis Anda dalam status sinkron dan siap dieksekusi. Ada instruksi atau pencatatan spesifik yang ingin dijalankan?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: reply,
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const quickPrompts = [
    "Ringkas tugas hari ini",
    "Cek saldo & kas",
    "Jadwal rapat terdekat",
    "help",
  ];

  return (
    <>
      {/* Invisible backdrop (dismiss on outside click, just like switch profile / mode) */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Pop-up window positioned directly above dock */}
      <div
        className="fixed bottom-[88px] left-1/2 -translate-x-1/2 z-50 w-[92vw] sm:w-[420px] max-h-[calc(100vh-110px)] rounded-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-[30px] border border-white/60 dark:border-white/15 shadow-[0px_4px_21px_-8px_rgba(255,255,255,0.5),0_20px_50px_rgba(0,0,0,0.22)] liquid-glass-dock overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-200 select-none cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 border-b border-border/60 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Terminal className="size-3.5" />
            </span>
            <div>
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5 tracking-tight">
                <span>Terminal AI</span>
                <span className="inline-flex items-center gap-1 text-[9px] font-normal px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleSend("clear")}
              title="Bersihkan layar"
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            >
              <RotateCcw className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Message feed / Terminal output */}
        <div
          ref={scrollRef}
          className="p-3 space-y-2.5 overflow-y-auto no-scrollbar max-h-[46vh] font-mono text-xs"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user"
                  ? "items-end"
                  : "items-start"
              }`}
            >
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5 px-1">
                {msg.sender === "user" ? (
                  <>
                    <span>Anda</span>
                    <span>• {msg.time}</span>
                  </>
                ) : msg.sender === "ai" ? (
                  <>
                    <Bot className="size-3 text-emerald-500" />
                    <span>All in One AI</span>
                    <span>• {msg.time}</span>
                  </>
                ) : (
                  <span>Sistem • {msg.time}</span>
                )}
              </div>

              <div
                className={`p-2.5 rounded-2xl max-w-[92%] whitespace-pre-line leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : msg.sender === "ai"
                    ? "bg-neutral-100/90 dark:bg-zinc-800/90 text-foreground border border-neutral-200/60 dark:border-zinc-700/60 rounded-bl-sm font-sans text-xs"
                    : "bg-muted/60 text-muted-foreground border border-border/40 text-[11px] font-sans"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground p-1">
              <Sparkles className="size-3 text-emerald-500 animate-spin" />
              <span className="text-[11px] font-sans">AI sedang menganalisis...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 border-t border-border/40 bg-muted/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[10px] font-sans whitespace-nowrap px-2 py-1 rounded-lg bg-neutral-100/80 dark:bg-zinc-800/80 text-muted-foreground hover:text-foreground hover:bg-neutral-200/80 dark:hover:bg-zinc-700/80 transition-colors border border-neutral-200/40 dark:border-zinc-700/40 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-2.5 border-t border-border/60 bg-muted/20 flex items-center gap-2"
        >
          <div className="relative flex-1 flex items-center">
            <span className="absolute left-2.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik perintah atau tanya AI..."
              className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground/70"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-1.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            aria-label="Kirim"
          >
            <Send className="size-3.5" />
          </button>
        </form>
      </div>
    </>
  );
}
