import React, { useState, useRef, useEffect } from "react";
import { Utang } from "../types";
import { X, Send, Bot, Sparkles, Loader2 } from "lucide-react";
import { hitungSisaUtang, formatRupiah } from "../utils";

interface Message {
  role: "user" | "model";
  text: string;
}

export function ChatPanel({ utangList, onClose }: { utangList: Utang[]; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Halo! Saya asisten finansial Anda. Ada yang bisa saya bantu terkait pengelolaan utang ini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user" as const, text: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 450));

      const totalOutstanding = utangList.reduce(
        (total, utang) => total + hitungSisaUtang(utang),
        0,
      );
      const nextMessage =
        utangList.length === 0
          ? "Belum ada data utang yang tersimpan. Tambahkan akun utang terlebih dahulu agar saya bisa membantu membuat ringkasan."
          : `Saat ini ada ${utangList.length} akun utang dengan total sisa ${formatRupiah(totalOutstanding)}. Saya bisa membantu membuat ringkasan, tetapi koneksi AI belum diaktifkan pada versi frontend ini.`;

      setMessages([...newMessages, { role: "model", text: nextMessage }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "model", text: "Maaf, saya belum bisa memproses pertanyaan itu." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-card shadow-2xl flex flex-col z-50">
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-foreground">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-emerald-400" />
          <h2 className="font-bold tracking-tight">AI Asisten Keuangan</h2>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground/70 hover:text-foreground transition-colors bg-card/10 hover:bg-card/20 p-1.5 rounded-lg"
        >
          <X size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-blue-600 text-foreground rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm shadow-sm"}`}
            >
              <div
                dangerouslySetInnerHTML={{ __html: formatMessage(m.text) }}
                className="whitespace-pre-wrap leading-relaxed space-y-1"
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-card border border-border text-foreground rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-2 shadow-sm">
              <Loader2 size={16} className="animate-spin text-muted-foreground/70" />
              <span className="text-xs text-muted-foreground font-medium">
                Bentar ya menganalisa...
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-card border-t border-border">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya tentang sisa utang..."
            className="w-full pl-4 pr-12 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 text-blue-600 disabled:text-muted-foreground/50 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="mt-2 text-xs text-center text-muted-foreground/70 flex items-center justify-center gap-1">
          <Sparkles size={10} className="text-blue-400" />
          <span>Analisis didukung oleh AI Gemini</span>
        </div>
      </div>
    </div>
  );
}

// Bantuan formatting teks untuk tebal
function formatMessage(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
}
