import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCheck,
  Clock,
  Download,
  FileText,
  Mail,
  MessageSquare,
  Paperclip,
  Phone,
  Search,
  Send,
  Sparkles,
  Tag,
  UserCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/app/app-shell";
import { Kosong, Panel, Pill } from "@/app/ui-bits";
import {
  type Message,
  type MessageAttachment,
  getInitialMessages,
  jamMenit,
  saveMessages,
  tanggal,
} from "@/lib/data";
import { useDataKlien } from "@/lib/portal";
import { useProfil } from "@/lib/profile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/pesan")({
  head: () => ({
    meta: [
      { title: "Pusat Diskusi & Pesan — Portal Klien Konsultansi" },
      {
        name: "description",
        content:
          "Kanal komunikasi resmi dengan tim konsultan penanggung jawab: klarifikasi data, tanya-jawab deliverable, dan arsip diskusi proyek.",
      },
      { property: "og:title", content: "Pusat Diskusi & Pesan Konsultansi" },
      {
        property: "og:description",
        content: "Diskusi transparan, tanya data, dan klarifikasi langsung dengan konsultan engagement Anda.",
      },
    ],
  }),
  component: PortalPesan,
});

const KATEGORI_TAGS = [
  "Semua",
  "Pemberitahuan",
  "Tanya Data",
  "Klarifikasi",
  "Masukan Review",
  "Konfirmasi Jadwal",
];

const TEMPLAT_CEPAT = [
  "Draf dokumen telah kami review, ada beberapa catatan kecil.",
  "Mohon lampirkan data pendukung atau matriks terkait.",
  "Jadwal pertemuan mendatang kami konfirmasi.",
  "Perlu klarifikasi lebih lanjut mengenai arsitektur sistem.",
];

function PortalPesan() {
  const qc = useQueryClient();
  const { clientId } = useProfil();
  const { klien, proyek, pesan, namaProyek, memuat } = useDataKlien();

  const [proyekAktif, setProyekAktif] = useState<string | "semua">("semua");
  const [filterTag, setFilterTag] = useState<string>("Semua");
  const [kataKunci, setKataKunci] = useState<string>("");
  const [tagPilihan, setTagPilihan] = useState<string>("Tanya Data");
  const [lampiranNama, setLampiranNama] = useState<string | null>(null);
  const [teks, setTeks] = useState("");
  const akhir = useRef<HTMLDivElement | null>(null);

  const daftar = useMemo(() => {
    return pesan
      .filter((m) => (proyekAktif === "semua" ? true : m.project_id === proyekAktif))
      .filter((m) => (filterTag === "Semua" ? true : m.tag === filterTag))
      .filter((m) => {
        if (!kataKunci.trim()) return true;
        const q = kataKunci.toLowerCase();
        return (
          m.isi.toLowerCase().includes(q) ||
          m.nama_pengirim.toLowerCase().includes(q) ||
          (m.tag && m.tag.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [pesan, proyekAktif, filterTag, kataKunci]);

  useEffect(() => {
    akhir.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [daftar.length]);

  const kirim = useMutation({
    mutationFn: async (isi: string) => {
      const targetProject = proyekAktif === "semua" ? (proyek[0]?.id ?? null) : proyekAktif;
      
      let lampiran: MessageAttachment[] | undefined = undefined;
      if (lampiranNama) {
        lampiran = [
          {
            nama: lampiranNama,
            ukuran: "1.4 MB",
            tipe: "PDF",
            tautan: "#",
          },
        ];
      }

      const newMessage: Message = {
        id: "msg-" + Date.now(),
        client_id: clientId ?? "c1",
        project_id: targetProject,
        pengirim: "klien",
        nama_pengirim: klien?.pic ?? "Budi Santoso",
        jabatan_pengirim: "Perwakilan Klien",
        isi: isi.trim(),
        tag: tagPilihan,
        lampiran,
        dibaca: true,
        created_at: new Date().toISOString(),
      };

      const current = getInitialMessages();
      const updated = [...current, newMessage];
      saveMessages(updated);

      qc.setQueryData(["messages"], updated);
      return newMessage;
    },
    onSuccess: () => {
      setTeks("");
      setLampiranNama(null);
      toast.success("Pesan berhasil dikirim ke tim konsultan.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleKirimPesan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teks.trim()) return;
    kirim.mutate(teks);
  };

  const handlePilihTemplat = (t: string) => {
    setTeks(t);
  };

  return (
    <AppShell
      title="Pusat Diskusi & Pesan"
      subtitle="Kanal komunikasi terpusat dan klarifikasi berkas dengan konsultan All in One"
    >
      {/* Toolbar Filter & Pencarian */}
      <div className="mb-4 rounded-xl border border-border/80 bg-card/70 p-3 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Proyek Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Proyek:</span>
            {proyek.length > 0 ? (
              <select
                value={proyekAktif}
                onChange={(e) => setProyekAktif(e.target.value)}
                className="h-8 max-w-full sm:max-w-[240px] rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground outline-none shadow-2xs focus:ring-1 focus:ring-primary"
              >
                <option value="semua">Semua Proyek Engagement</option>
                {proyek.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          {/* Pencarian Pesan */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Cari kata kunci pesan…"
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              className="h-8 w-full rounded-lg border border-border bg-background pl-8 pr-7 text-xs outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            />
            {kataKunci && (
              <button
                type="button"
                onClick={() => setKataKunci("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Bar Filter Kategori Tag */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-border/60">
          <span className="text-xs font-medium text-muted-foreground shrink-0 mr-1 flex items-center gap-1">
            <Tag className="size-3" /> Topik:
          </span>
          {KATEGORI_TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setFilterTag(t)}
              className={`h-6.5 px-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterTag === t
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "border border-border/70 bg-background text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Kolom Kiri / Utama: Thread Percakapan & Composer (2 Kolom di Desktop) */}
        <div className="lg:col-span-2 space-y-4">

          {/* Area Pesan Chat Stream */}
          <div className="rounded-2xl border border-border bg-card shadow-2xs overflow-hidden flex flex-col h-[580px]">
            {/* Header Chat */}
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                  W
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">
                    Tim Konsultan All in One (Wira Pratama & Tim)
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {proyekAktif === "semua"
                      ? "Diskusi Seluruh Engagement"
                      : namaProyek(proyekAktif)}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online & Siap Membantu
              </span>
            </div>

            {/* Bubble Messages List */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              {daftar.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <Kosong
                    pesan={
                      memuat
                        ? "Memuat percakapan…"
                        : "Belum ada pesan untuk kriteria ini. Mulai percakapan melalui form di bawah."
                    }
                  />
                </div>
              ) : (
                daftar.map((m) => {
                  const dariKlien = m.pengirim === "klien";
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex flex-col gap-1.5 group",
                        dariKlien ? "items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[90%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-2xs leading-relaxed",
                          dariKlien
                            ? "bg-primary text-primary-foreground rounded-br-xs"
                            : "border border-border/80 bg-background text-foreground rounded-bl-xs",
                        )}
                      >
                        {/* Header Message di dalam bubble */}
                        <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-white/15 dark:border-border/40">
                          <span className="font-semibold text-[11px] opacity-95">
                            {m.nama_pengirim}{" "}
                            {m.jabatan_pengirim && (
                              <span className="opacity-75 font-normal">
                                · {m.jabatan_pengirim}
                              </span>
                            )}
                          </span>
                          {m.tag && (
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                                dariKlien
                                  ? "bg-black/20 text-white"
                                  : "bg-primary/10 text-primary",
                              )}
                            >
                              {m.tag}
                            </span>
                          )}
                        </div>

                        {/* Isi Pesan */}
                        <p className="whitespace-pre-line text-xs sm:text-sm">{m.isi}</p>

                        {/* Lampiran jika ada */}
                        {m.lampiran && m.lampiran.length > 0 && (
                          <div className="mt-2.5 space-y-1.5 pt-1.5 border-t border-white/10 dark:border-border/40">
                            {m.lampiran.map((att, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  "flex items-center justify-between gap-2 rounded-lg p-2 text-xs",
                                  dariKlien
                                    ? "bg-white/15 text-white"
                                    : "bg-muted/70 text-foreground border border-border/60",
                                )}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="size-4 shrink-0" />
                                  <span className="font-medium truncate">{att.nama}</span>
                                  <span className="text-[10px] opacity-75 shrink-0">
                                    ({att.ukuran})
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toast.success(`Membuka lampiran: ${att.nama}`)}
                                  className="rounded p-1 hover:bg-black/20 transition-colors"
                                  title="Unduh / Buka Berkas"
                                >
                                  <Download className="size-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer Info Waktu & Status */}
                      <div className="flex items-center gap-1.5 px-1 text-[10px] text-muted-foreground">
                        <span>{namaProyek(m.project_id)}</span>
                        <span>·</span>
                        <span>
                          {tanggal(m.created_at)}, {jamMenit(m.created_at)} WIB
                        </span>
                        {dariKlien && (
                          <CheckCheck className="size-3 text-primary inline ml-0.5" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={akhir} />
            </div>

            {/* Quick Templates / Balasan Cepat */}
            <div className="border-t border-border/60 bg-muted/20 px-3 py-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[11px] font-semibold text-muted-foreground shrink-0 flex items-center gap-1">
                  <Sparkles className="size-3 text-amber-500" /> Balasan Cepat:
                </span>
                {TEMPLAT_CEPAT.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePilihTemplat(t)}
                    className="h-6 rounded-md border border-border/70 bg-card/70 px-2 text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent whitespace-nowrap transition-colors"
                  >
                    {t.slice(0, 32)}…
                  </button>
                ))}
              </div>
            </div>

            {/* Composer Form */}
            <form onSubmit={handleKirimPesan} className="border-t border-border p-3 sm:p-4 bg-card">
              {/* Pill Kategori & Lampiran Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">Topik:</span>
                  <select
                    value={tagPilihan}
                    onChange={(e) => setTagPilihan(e.target.value)}
                    className="h-6 rounded border border-border/80 bg-background px-1.5 text-[11px] text-foreground outline-none font-medium"
                  >
                    <option value="Tanya Data">Tanya Data</option>
                    <option value="Klarifikasi">Klarifikasi</option>
                    <option value="Pemberitahuan">Pemberitahuan</option>
                    <option value="Masukan Review">Masukan Review</option>
                    <option value="Konfirmasi Jadwal">Konfirmasi Jadwal</option>
                  </select>
                </div>

                {lampiranNama ? (
                  <div className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                    <Paperclip className="size-3" />
                    <span className="truncate max-w-[150px]">{lampiranNama}</span>
                    <button
                      type="button"
                      onClick={() => setLampiranNama(null)}
                      className="hover:text-destructive ml-1"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setLampiranNama("Catatan_Tambahan_Spesifikasi_Klien.pdf");
                      toast.info("Lampiran contoh ditambahkan ke draf.");
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Paperclip className="size-3" />
                    <span>Lampirkan Dokumen</span>
                  </button>
                )}
              </div>

              <div className="flex items-end gap-2">
                <textarea
                  value={teks}
                  onChange={(e) => setTeks(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (teks.trim()) kirim.mutate(teks);
                    }
                  }}
                  rows={2}
                  placeholder="Ketik pesan atau pertanyaan untuk konsultan (Tekan Enter untuk mengirim)…"
                  className="min-h-[3rem] flex-1 resize-y rounded-xl border border-input bg-background p-2.5 text-xs sm:text-sm outline-none focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  disabled={kirim.isPending || !teks.trim()}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  <Send className="size-4" />
                  <span className="hidden sm:inline">Kirim</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Info Kontak Konsultan & SLA Portal */}
        <div className="space-y-6">
          {/* Card Profil Konsultan PIC */}
          <Panel title="Konsultan Penanggung Jawab">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                  WP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Wira Pratama, M.Sc.</h4>
                  <p className="text-[11px] text-primary font-medium">Lead Engagement Consultant</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Spesialis Transformasi Digital & Arsitektur ERP Enterprise
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/70 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-3.5 text-primary" /> Email Resmi:
                  </span>
                  <span className="font-medium text-foreground">wira@allinone.co.id</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="size-3.5 text-primary" /> Hotline WA:
                  </span>
                  <span className="font-medium text-foreground">+62 811-2345-6789</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" /> Jam Kerja:
                  </span>
                  <span className="font-medium text-foreground">Senin - Jumat (08.30 - 17.30)</span>
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground block mb-0.5">
                  Komitmen SLA Respons
                </span>
                Seluruh pesan melalui portal ini dipantau secara berkala dan direspons dalam kurun
                waktu maksimal 2 jam kerja.
              </div>
            </div>
          </Panel>

          {/* Card Panduan Komunikasi Efektif */}
          <Panel title="Topik & Panduan Diskusi">
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p>
                  <strong className="text-foreground">Tanya Data:</strong> Gunakan saat memerlukan
                  penjelasan angka finansial atau dokumen audit.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p>
                  <strong className="text-foreground">Klarifikasi:</strong> Untuk menyelaraskan
                  asumsi operasional sebelum deliverable difinalkan.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p>
                  <strong className="text-foreground">Masukan Review:</strong> Berikan poin revisi
                  spesifik setelah meninjau draf dokumen.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
