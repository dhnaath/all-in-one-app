import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarClock,
  FileCheck2,
  Gauge,
  MessagesSquare,
  Briefcase,
  MapPin,
  Video,
} from "lucide-react";
import { AppShell } from "@/app/app-shell";
import { Bar, Kosong, Panel, Pill } from "@/app/ui-bits";
import { jamMenit, statusProyek, statusTugas, tanggal, waktuRelatif } from "@/lib/data";
import { useDataKlien } from "@/lib/portal";

export const Route = createFileRoute("/portal/")({
  head: () => ({
    meta: [
      { title: "Portal Klien — Ringkasan Engagement Konsultansi" },
      {
        name: "description",
        content:
          "Ringkasan engagement konsultansi Anda: progres proyek, deliverable, jadwal pertemuan, dan komunikasi dengan tim konsultan.",
      },
      { property: "og:title", content: "Portal Klien — Ringkasan Engagement" },
      {
        property: "og:description",
        content: "Lihat progres proyek, deliverable terbaru, jadwal, dan pesan dari tim konsultan.",
      },
    ],
  }),
  component: PortalRingkasan,
});

function PortalRingkasan() {
  const { klien, proyek, tugas, deliverables, jadwal, pesan, aktivitas, namaProyek, memuat } =
    useDataKlien();

  const berjalan = proyek.filter((p) => p.status !== "selesai");
  const rataProgres = berjalan.length
    ? Math.round(berjalan.reduce((a, p) => a + p.progres, 0) / berjalan.length)
    : 0;
  const tugasTerbuka = tugas.filter((t) => t.status !== "selesai");
  const menungguReview = deliverables.filter((d) => d.status === "review");
  const jadwalMendatang = jadwal
    .filter((j) => new Date(j.mulai).getTime() >= Date.now() - 3600_000 && j.status !== "selesai")
    .slice(0, 4);
  const pesanTerbaru = [...pesan].reverse().slice(0, 3);

  return (
    <AppShell
      title={klien?.nama ?? (memuat ? "Memuat portal…" : "Portal Klien")}
      subtitle={
        klien
          ? `Portal engagement · ${klien.industri} · PIC ${klien.pic ?? "—"}`
          : "Ringkasan engagement konsultansi Anda"
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kartu
          ikon={<Briefcase className="size-4" />}
          label="Engagement aktif"
          nilai={`${berjalan.length}`}
          catatan={`${proyek.length} total proyek bersama kami`}
        />
        <Kartu
          ikon={<Gauge className="size-4" />}
          label="Rata-rata progres"
          nilai={`${rataProgres}%`}
          catatan={`${tugasTerbuka.length} pekerjaan masih berjalan`}
        />
        <Kartu
          ikon={<FileCheck2 className="size-4" />}
          label="Deliverable menunggu Anda"
          nilai={`${menungguReview.length}`}
          catatan={`${deliverables.length} deliverable dalam kontrak`}
        />
        <Kartu
          ikon={<CalendarClock className="size-4" />}
          label="Pertemuan mendatang"
          nilai={`${jadwalMendatang.length}`}
          catatan={
            jadwalMendatang[0]
              ? `Terdekat ${tanggal(jadwalMendatang[0].mulai)}`
              : "Belum ada jadwal baru"
          }
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Progres engagement"
          aksi={
            <Link to="/portal/progres" className="text-xs font-medium text-primary hover:underline">
              Detail progres
            </Link>
          }
        >
          {proyek.length === 0 ? (
            <Kosong pesan={memuat ? "Memuat data engagement…" : "Belum ada engagement aktif."} />
          ) : (
            <div className="space-y-4">
              {proyek.map((p) => (
                <div key={p.id} className="space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{p.nama}</p>
                      <p className="text-xs text-muted-foreground">
                        Konsultan {p.konsultan} · target {tanggal(p.tanggal_selesai)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill value={p.status} label={statusProyek[p.status] ?? p.status} />
                      <span className="text-xs font-medium tabular-nums">{p.progres}%</span>
                    </div>
                  </div>
                  <Bar value={p.progres} />
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Jadwal terdekat"
          aksi={
            <Link to="/portal/jadwal" className="text-xs font-medium text-primary hover:underline">
              Semua jadwal
            </Link>
          }
        >
          {jadwalMendatang.length === 0 ? (
            <Kosong pesan="Tidak ada pertemuan terjadwal." />
          ) : (
            <ul className="space-y-3.5">
              {jadwalMendatang.map((j) => (
                <li key={j.id} className="flex gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 flex-col items-center justify-center rounded-lg bg-muted text-[11px] font-medium leading-none">
                    <span>{new Date(j.mulai).getDate()}</span>
                    <span className="mt-0.5 text-muted-foreground">
                      {new Date(j.mulai).toLocaleDateString("id-ID", { month: "short" })}
                    </span>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{j.judul}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      {j.tipe === "online" ? (
                        <Video className="size-3" />
                      ) : (
                        <MapPin className="size-3" />
                      )}
                      {jamMenit(j.mulai)} · {j.lokasi ?? "—"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          className="xl:col-span-2"
          title="Deliverable terbaru"
          aksi={
            <Link to="/portal/dokumen" className="text-xs font-medium text-primary hover:underline">
              Dokumen
            </Link>
          }
        >
          {deliverables.length === 0 ? (
            <Kosong pesan="Belum ada deliverable." />
          ) : (
            <ul className="divide-y divide-border">
              {deliverables.slice(0, 5).map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.judul}</p>
                    <p className="text-xs text-muted-foreground">
                      {namaProyek(d.project_id)} · {d.versi} · jatuh tempo {tanggal(d.jatuh_tempo)}
                    </p>
                  </div>
                  <Pill value={d.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Pesan terbaru"
          aksi={
            <Link to="/portal/pesan" className="text-xs font-medium text-primary hover:underline">
              Buka pesan
            </Link>
          }
        >
          {pesanTerbaru.length === 0 ? (
            <Kosong pesan="Belum ada percakapan." />
          ) : (
            <ul className="space-y-3.5">
              {pesanTerbaru.map((m) => (
                <li key={m.id} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <MessagesSquare className="size-3.5 text-muted-foreground" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium">
                      {m.nama_pengirim}
                      <span className="ml-1.5 font-normal text-muted-foreground">
                        {waktuRelatif(m.created_at)}
                      </span>
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{m.isi}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="xl:col-span-3" title="Aktivitas engagement">
          {aktivitas.length === 0 ? (
            <Kosong pesan="Belum ada aktivitas tercatat." />
          ) : (
            <ol className="space-y-4 border-l border-border pl-4">
              {aktivitas.slice(0, 6).map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-primary" />
                  <p className="text-sm font-medium">{a.judul}</p>
                  <p className="text-xs text-muted-foreground">
                    {namaProyek(a.project_id)} · {waktuRelatif(a.waktu)}
                  </p>
                  {a.deskripsi ? (
                    <p className="mt-1 text-xs text-muted-foreground">{a.deskripsi}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        {tugasTerbuka.length > 0
          ? `Pekerjaan terdekat: ${tugasTerbuka[0]!.judul} — ${statusTugas[tugasTerbuka[0]!.status] ?? tugasTerbuka[0]!.status}.`
          : "Semua pekerjaan pada engagement Anda sudah selesai."}
      </p>
    </AppShell>
  );
}

function Kartu({
  ikon,
  label,
  nilai,
  catatan,
}: {
  ikon: React.ReactNode;
  label: string;
  nilai: string;
  catatan: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {ikon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{nilai}</p>
      <p className="mt-1 text-xs text-muted-foreground">{catatan}</p>
    </div>
  );
}
