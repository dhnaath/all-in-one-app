import { useQueries } from "@tanstack/react-query";
import {
  activitiesQuery,
  clientsQuery,
  deliverablesQuery,
  documentsQuery,
  meetingsQuery,
  messagesQuery,
  projectsQuery,
  tasksQuery,
} from "@/lib/data";
import { useProfil } from "@/lib/profile";

export function useDataKlien() {
  const { clientId } = useProfil();
  const hasil = useQueries({
    queries: [
      clientsQuery,
      projectsQuery,
      tasksQuery,
      deliverablesQuery,
      activitiesQuery,
      messagesQuery,
      documentsQuery,
      meetingsQuery,
    ],
  });
  const [c, p, t, d, a, m, doc, mt] = hasil;

  const allClients = c.data ?? [];
  const klien = allClients.find((k) => k.id === clientId) ?? allClients[0] ?? null;
  const activeClientId = klien?.id ?? "c1";
  const proyek = (p.data ?? []).filter((x) => x.client_id === activeClientId);
  const idProyek = new Set(proyek.map((x) => x.id));

  return {
    memuat: hasil.some((q) => q.isLoading),
    klien,
    proyek,
    tugas: (t.data ?? []).filter((x) => x.project_id && idProyek.has(x.project_id)),
    deliverables: (d.data ?? []).filter((x) => x.project_id && idProyek.has(x.project_id)),
    aktivitas: (a.data ?? []).filter((x) => x.client_id === activeClientId),
    pesan: (m.data ?? []).filter((x) => x.client_id === activeClientId),
    dokumen: (doc.data ?? []).filter((x) => x.client_id === activeClientId && x.dibagikan_ke_klien),
    jadwal: (mt.data ?? []).filter((x) => x.client_id === activeClientId),
    namaProyek: (id: string | null) => proyek.find((x) => x.id === id)?.nama ?? (p.data ?? []).find((x) => x.id === id)?.nama ?? "Umum",
  };
}
