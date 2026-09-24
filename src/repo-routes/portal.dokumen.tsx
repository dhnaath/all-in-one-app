import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, FileText, Search } from "lucide-react";
import { AppShell } from "@/app/app-shell";
import { Kosong, Panel, Pill } from "@/app/ui-bits";
import { cn } from "@/lib/utils";
import { tanggal } from "@/lib/data";
import { useDataKlien } from "@/lib/portal";

export const Route = createFileRoute("/portal/dokumen")({
  head: () => ({
    meta: [
      { title: "Dokumen Engagement — Portal Klien Konsultansi" },
      {
        name: "description",
        content:
          "Semua laporan, notulen, dan lampiran yang dibagikan tim konsultan untuk engagement Anda, lengkap dengan versi dan tanggal unggah.",
      },
      { property: "og:title", content: "Dokumen Engagement" },
      {
        property: "og:description",
        content: "Kumpulan dokumen resmi yang dibagikan konsultan kepada Anda per proyek.",
      },
    ],
  }),
  component: PortalDokumen,
});

function PortalDokumen() {
  const { dokumen, proyek, namaProyek, memuat } = useDataKlien();
  const [cari, setCari] = useState("");
  const [proyekAktif, setProyekAktif] = useState<string | "semua">("semua");

  const daftar = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return dokumen.filter((d) => {
      const cocokProyek = proyekAktif === "semua" || d.project_id === proyekAktif;
      const cocokCari =
        !q || d.nama.toLowerCase().includes(q) || (d.jenis ?? "").toLowerCase().includes(q);
      return cocokProyek && cocokCari;
    });
  }, [dokumen, cari, proyekAktif]);

  return (
    <AppShell
      title="Dokumen"
      subtitle="Dokumen yang dibagikan tim konsultan untuk engagement Anda"
    >
      {/* Toolbar Filter Proyek & Pencarian Dokumen */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-border/80 bg-card/70 p-2.5 shadow-2xs">
        {proyek.length > 1 ? (
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setProyekAktif("semua")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                proyekAktif === "semua" ? "bg-primary text-primary-foreground font-semibold shadow-2xs" : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              Semua proyek
            </button>
            {proyek.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setProyekAktif(p.id)}
                className={cn(
                  "max-w-[12rem] truncate rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  proyekAktif === p.id ? "bg-primary text-primary-foreground font-semibold shadow-2xs" : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                {p.nama}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs font-semibold text-muted-foreground">Berkas Dokumen Engagement</div>
        )}

        <div className="relative shrink-0 sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari dokumen…"
            className="h-8 w-full rounded-lg border border-border bg-background pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground outline-none shadow-2xs focus-visible:ring-1 focus-visible:ring-primary"
          />
          {cari && (
            <button
              type="button"
              onClick={() => setCari("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <Panel>
        {daftar.length === 0 ? (
          <Kosong
            pesan={
              memuat ? "Memuat dokumen…" : "Tidak ada dokumen yang cocok dengan pencarian Anda."
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {daftar.map((d) => (
              <li
                key={d.id}
                className="flex flex-col gap-3 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <FileText className="size-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">{d.nama}</p>
                    <Pill value="aktif" label={d.versi ?? "v1"} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {namaProyek(d.project_id)} · {d.jenis ?? "dokumen"} · {d.ukuran ?? "—"} ·
                    diunggah {tanggal(d.created_at)} oleh {d.diunggah_oleh ?? "tim konsultan"}
                  </p>
                </div>
                <a
                  href={d.tautan ?? "#"}
                  target={d.tautan ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                >
                  <Download className="size-3.5" />
                  Unduh
                </a>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </AppShell>
  );
}
