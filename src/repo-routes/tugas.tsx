import { createFileRoute } from "@tanstack/react-router";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Clock, Flag } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/app/app-shell";
import { Kosong, Pill } from "@/app/ui-bits";
import { cn } from "@/lib/utils";
import {
  clientsQuery,
  projectsQuery,
  sisaHari,
  statusTugas,
  tanggal,
  tasksQuery,
  type Task,
} from "@/lib/data";

export const Route = createFileRoute("/tugas")({
  head: () => ({
    meta: [
      { title: "Manajemen Tugas — Client OS Konsultan Manajemen" },
      {
        name: "description",
        content:
          "Papan tugas konsultansi dengan status, prioritas, penanggung jawab, dan tenggat yang jelas.",
      },
      { property: "og:title", content: "Manajemen Tugas Konsultansi" },
      {
        property: "og:description",
        content: "Kelola tugas tim konsultan per status: belum mulai, dikerjakan, review, selesai.",
      },
    ],
  }),
  component: HalamanTugas,
});

const kolom = ["todo", "berjalan", "review", "selesai"] as const;

function HalamanTugas() {
  const qc = useQueryClient();
  const [filterPrioritas, setFilterPrioritas] = useState<string>("semua");
  const [tasks, projects, clients] = useQueries({
    queries: [tasksQuery, projectsQuery, clientsQuery],
  });

  const ubahStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // MOCK: Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state directly for demonstration
      qc.setQueryData(["tasks"], (old: any) => {
        return (old || []).map((t: Task) => (t.id === id ? { ...t, status } : t));
      });
    },
    onSuccess: () => {
      toast.success("Status tugas diperbarui");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const daftar = (tasks.data ?? []).filter(
    (t) => filterPrioritas === "semua" || t.prioritas === filterPrioritas,
  );

  const konteks = (t: Task) => {
    const p = (projects.data ?? []).find((x) => x.id === t.project_id);
    const k = (clients.data ?? []).find((x) => x.id === p?.client_id);
    return [k?.nama, p?.nama].filter(Boolean).join(" · ");
  };

  const berikutnya = (status: string) => {
    const i = kolom.indexOf(status as (typeof kolom)[number]);
    return kolom[Math.min(i + 1, kolom.length - 1)] ?? "selesai";
  };

  return (
    <AppShell
      title="Manajemen Tugas"
      subtitle="Papan kerja tim konsultan dengan prioritas dan tenggat"
    >
      {/* Toolbar Filter Prioritas */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-border/80 bg-card/70 p-2.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Filter Prioritas:</span>
          <div className="hidden sm:flex items-center gap-1 rounded-lg border border-border/70 bg-background/80 p-0.5 shadow-2xs">
            {["semua", "tinggi", "sedang", "rendah"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFilterPrioritas(p)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors whitespace-nowrap cursor-pointer",
                  filterPrioritas === p
                    ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="sm:hidden">
            <select
              value={filterPrioritas}
              onChange={(e) => setFilterPrioritas(e.target.value)}
              className="h-8 rounded-lg border border-border/70 bg-background px-2.5 text-xs font-medium text-foreground outline-none shadow-2xs"
            >
              {["semua", "tinggi", "sedang", "rendah"].map((p) => (
                <option key={p} value={p}>
                  {p === "semua" ? "Semua Prioritas" : `Prioritas ${p}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-xs text-muted-foreground">
          Total <strong>{daftar.length}</strong> tugas ditampilkan
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {kolom.map((k) => {
          const isi = daftar.filter((t) => t.status === k);
          return (
            <div key={k} className="rounded-2xl border border-border bg-card/60 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold">{statusTugas[k]}</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                  {isi.length}
                </span>
              </div>
              {isi.length === 0 ? (
                <Kosong pesan="Kosong" />
              ) : (
                <ul className="space-y-2.5">
                  {isi.map((t) => {
                    const sisa = sisaHari(t.tenggat);
                    return (
                      <li
                        key={t.id}
                        className="rounded-xl border border-border bg-card p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug">{t.judul}</p>
                          <Pill value={t.prioritas} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{konteks(t)}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            {tanggal(t.tenggat)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flag className="size-3.5" />
                            {t.penanggung_jawab}
                          </span>
                          {sisa !== null && sisa < 0 && t.status !== "selesai" ? (
                            <span className="font-medium text-destructive">terlambat</span>
                          ) : null}
                        </div>
                        {t.status !== "selesai" ? (
                          <button
                            onClick={() =>
                              ubahStatus.mutate({ id: t.id, status: berikutnya(t.status) })
                            }
                            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          >
                            <Check className="size-3.5" />
                            Pindah ke {statusTugas[berikutnya(t.status)]}
                          </button>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
