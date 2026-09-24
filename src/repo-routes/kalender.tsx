import { createFileRoute } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/app/app-shell";
import { Kosong, Panel, Pill } from "@/app/ui-bits";
import { cn } from "@/lib/utils";
import {
  clientsQuery,
  deliverablesQuery,
  projectsQuery,
  statusProyek,
  tanggal,
  tasksQuery,
} from "@/lib/data";

export const Route = createFileRoute("/kalender")({
  head: () => ({
    meta: [
      { title: "Timeline & Kalender — Client OS Konsultan Manajemen" },
      {
        name: "description",
        content:
          "Kalender tenggat tugas dan deliverable serta timeline durasi seluruh proyek konsultansi.",
      },
      { property: "og:title", content: "Timeline & Kalender Proyek" },
      {
        property: "og:description",
        content: "Lihat tenggat bulanan dan rentang waktu setiap penugasan konsultansi.",
      },
    ],
  }),
  component: HalamanKalender,
});

const namaBulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const hari = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function kunci(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function HalamanKalender() {
  const [acuan, setAcuan] = useState(() => new Date(2026, 8, 1));
  const [tasks, deliverables, projects, clients] = useQueries({
    queries: [tasksQuery, deliverablesQuery, projectsQuery, clientsQuery],
  });

  const tahun = acuan.getFullYear();
  const bulan = acuan.getMonth();
  const pertama = new Date(tahun, bulan, 1);
  const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();
  const offset = (pertama.getDay() + 6) % 7;

  const agenda: Record<string, { label: string; tipe: string; prioritas: string }[]> = {};
  for (const t of tasks.data ?? []) {
    if (!t.tenggat) continue;
    (agenda[t.tenggat] ??= []).push({ label: t.judul, tipe: "tugas", prioritas: t.prioritas });
  }
  for (const d of deliverables.data ?? []) {
    if (!d.jatuh_tempo) continue;
    (agenda[d.jatuh_tempo] ??= []).push({
      label: d.judul,
      tipe: "deliverable",
      prioritas: "sedang",
    });
  }

  const sel: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: jumlahHari }, (_, i) => i + 1),
  ];

  const namaKlien = (id: string | null) =>
    (clients.data ?? []).find((k) => k.id === id)?.nama ?? "Internal";

  const proyekBertanggal = (projects.data ?? []).filter((p) => p.tanggal_mulai);
  const batasAwal = Math.min(...proyekBertanggal.map((p) => new Date(p.tanggal_mulai!).getTime()));
  const batasAkhir = Math.max(
    ...proyekBertanggal.map((p) => new Date(p.tanggal_selesai ?? p.tanggal_mulai!).getTime()),
  );
  const rentang = Math.max(1, batasAkhir - batasAwal);

  return (
    <AppShell
      title="Timeline & Kalender"
      subtitle="Tenggat bulanan dan rentang waktu seluruh penugasan"
    >
      <Panel>
        {/* Kalender Header / Navigasi Bulan */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              Agenda {namaBulan[bulan]} {tahun}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tinjauan tenggat deliverable dan batas penugasan tim konsultan
            </p>
          </div>

          <div className="flex items-center gap-1 self-start sm:self-center shrink-0 rounded-lg border border-border/70 bg-card p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setAcuan(new Date(tahun, bulan - 1, 1))}
              className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-3 text-center text-xs font-semibold whitespace-nowrap min-w-[100px] sm:min-w-[130px] text-foreground">
              {namaBulan[bulan]} {tahun}
            </span>
            <button
              type="button"
              onClick={() => setAcuan(new Date(tahun, bulan + 1, 1))}
              className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px text-center text-xs font-medium text-muted-foreground">
          {hari.map((h) => (
            <div key={h} className="pb-2">
              {h}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl bg-border">
          {sel.map((n, i) => {
            const tanggalKunci = n ? kunci(new Date(tahun, bulan, n)) : "";
            const isi = n ? (agenda[tanggalKunci] ?? []) : [];
            return (
              <div
                key={i}
                className={cn("min-h-24 bg-card p-1.5 text-left align-top", !n && "bg-muted/40")}
              >
                {n ? (
                  <>
                    <span className="text-xs font-medium tabular-nums text-muted-foreground">
                      {n}
                    </span>
                    <div className="mt-1 space-y-1">
                      {isi.slice(0, 3).map((e, idx) => (
                        <p
                          key={idx}
                          className={cn(
                            "truncate rounded px-1.5 py-0.5 text-[11px] leading-tight",
                            e.tipe === "deliverable"
                              ? "bg-primary/10 text-primary"
                              : e.prioritas === "tinggi"
                                ? "bg-rose-500/10 text-rose-700 dark:text-rose-400"
                                : "bg-muted text-muted-foreground",
                          )}
                          title={e.label}
                        >
                          {e.label}
                        </p>
                      ))}
                      {isi.length > 3 ? (
                        <p className="px-1.5 text-[11px] text-muted-foreground">
                          +{isi.length - 3} lainnya
                        </p>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Timeline proyek" className="mt-6">
        {proyekBertanggal.length === 0 ? (
          <Kosong pesan="Belum ada proyek berjadwal." />
        ) : (
          <div className="space-y-4">
            {proyekBertanggal.map((p) => {
              const mulai = new Date(p.tanggal_mulai!).getTime();
              const akhir = new Date(p.tanggal_selesai ?? p.tanggal_mulai!).getTime();
              const kiri = ((mulai - batasAwal) / rentang) * 100;
              const lebar = Math.max(3, ((akhir - mulai) / rentang) * 100);
              return (
                <div key={p.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{p.nama}</p>
                      <p className="text-xs text-muted-foreground">
                        {namaKlien(p.client_id)} · {tanggal(p.tanggal_mulai)} –{" "}
                        {tanggal(p.tanggal_selesai)}
                      </p>
                    </div>
                    <Pill value={p.status} label={statusProyek[p.status] ?? p.status} />
                  </div>
                  <div className="relative mt-2 h-2.5 w-full rounded-full bg-muted">
                    <div
                      className="absolute h-full rounded-full bg-primary/25"
                      style={{ left: `${kiri}%`, width: `${lebar}%` }}
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${p.progres}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </AppShell>
  );
}
