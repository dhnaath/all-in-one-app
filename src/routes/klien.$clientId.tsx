import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/app/app-shell";
import { Bar, Kosong, Panel, Pill } from "@/app/ui-bits";
import {
  activitiesQuery,
  clientsQuery,
  deliverablesQuery,
  notesQuery,
  projectsQuery,
  rupiah,
  statusProyek,
  statusTugas,
  tanggal,
  tasksQuery,
  waktuRelatif,
} from "@/lib/data";

export const Route = createFileRoute("/klien/$clientId")({
  head: () => ({
    meta: [
      { title: "Detail Klien — Client OS Konsultan Manajemen" },
      {
        name: "description",
        content:
          "Ruang kerja satu klien: profil, proyek, tugas, deliverable, catatan, dan riwayat aktivitas.",
      },
      { property: "og:title", content: "Detail Klien" },
      {
        property: "og:description",
        content: "Semua proyek, tugas, catatan, dan aktivitas untuk satu akun klien.",
      },
    ],
  }),
  component: DetailKlien,
});

function DetailKlien() {
  const { clientId } = Route.useParams();
  const [clients, projects, tasks, deliverables, notes, activities] = useQueries({
    queries: [
      clientsQuery,
      projectsQuery,
      tasksQuery,
      deliverablesQuery,
      notesQuery,
      activitiesQuery,
    ],
  });

  const klien = (clients.data ?? []).find((k) => k.id === clientId);
  const proyek = (projects.data ?? []).filter((p) => p.client_id === clientId);
  const idProyek = new Set(proyek.map((p) => p.id));
  const tugas = (tasks.data ?? []).filter((t) => t.project_id && idProyek.has(t.project_id));
  const deliv = (deliverables.data ?? []).filter((d) => d.project_id && idProyek.has(d.project_id));
  const catatan = (notes.data ?? []).filter((n) => n.client_id === clientId);
  const aktivitas = (activities.data ?? []).filter((a) => a.client_id === clientId);

  if (clients.isLoading) {
    return (
      <AppShell title="Memuat klien…">
        <Kosong pesan="Sedang memuat data klien." />
      </AppShell>
    );
  }

  if (!klien) {
    return (
      <AppShell title="Klien tidak ditemukan">
        <Kosong pesan="Data klien ini tidak tersedia." />
      </AppShell>
    );
  }

  return (
    <AppShell
      title={klien.nama}
      subtitle={`${klien.industri} · KBLI ${klien.kbli} · ${klien.kota}`}
      actions={
        <Link
          to="/klien"
          className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-lg border border-border/70 bg-card/60 hover:bg-accent text-xs font-medium text-foreground transition-colors shrink-0 whitespace-nowrap shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="size-3.5" /> Kembali
        </Link>
      }
    >
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Proyek klien">
            {proyek.length === 0 ? (
              <Kosong pesan="Belum ada proyek untuk klien ini." />
            ) : (
              <div className="space-y-5">
                {proyek.map((p) => (
                  <div key={p.id} className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{p.nama}</p>
                        <p className="text-xs text-muted-foreground">{p.ringkasan}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill value={p.status} label={statusProyek[p.status]} />
                        <span className="text-xs tabular-nums">{p.progres}%</span>
                      </div>
                    </div>
                    <Bar value={p.progres} />
                    <p className="text-xs text-muted-foreground">
                      {tanggal(p.tanggal_mulai)} – {tanggal(p.tanggal_selesai)} · {p.konsultan} ·{" "}
                      {rupiah(Number(p.nilai))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Tugas terkait">
            {tugas.length === 0 ? (
              <Kosong pesan="Belum ada tugas." />
            ) : (
              <ul className="divide-y divide-border">
                {tugas.map((t) => (
                  <li
                    key={t.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{t.judul}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.penanggung_jawab} · tenggat {tanggal(t.tenggat)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill value={t.prioritas} />
                      <Pill value={t.status} label={statusTugas[t.status]} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Deliverable">
            {deliv.length === 0 ? (
              <Kosong pesan="Belum ada deliverable." />
            ) : (
              <ul className="divide-y divide-border">
                {deliv.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium">{d.judul}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.jenis} · {d.versi} · jatuh tempo {tanggal(d.jatuh_tempo)}
                      </p>
                    </div>
                    <Pill value={d.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Profil akun">
            <dl className="space-y-2.5 text-sm">
              <Baris label="PIC" nilai={klien.pic ?? "—"} />
              <Baris label="Email" nilai={klien.email ?? "—"} />
              <Baris label="Telepon" nilai={klien.telepon ?? "—"} />
              <Baris label="Status" nilai={klien.status} />
              <Baris label="Nilai kontrak" nilai={rupiah(Number(klien.nilai_kontrak))} />
            </dl>
            {klien.catatan ? (
              <p className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                {klien.catatan}
              </p>
            ) : null}
          </Panel>

          <Panel title="Catatan klien">
            {catatan.length === 0 ? (
              <Kosong pesan="Belum ada catatan." />
            ) : (
              <ul className="space-y-3">
                {catatan.map((n) => (
                  <li key={n.id} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">{n.judul}</p>
                    <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{n.isi}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Riwayat aktivitas">
            {aktivitas.length === 0 ? (
              <Kosong pesan="Belum ada aktivitas." />
            ) : (
              <ol className="relative space-y-4 border-l border-border pl-4">
                {aktivitas.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-primary" />
                    <p className="text-sm font-medium">{a.judul}</p>
                    <p className="text-xs text-muted-foreground">{a.deskripsi}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{waktuRelatif(a.waktu)}</p>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function Baris({ label, nilai }: { label: string; nilai: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium capitalize">{nilai}</dd>
    </div>
  );
}
