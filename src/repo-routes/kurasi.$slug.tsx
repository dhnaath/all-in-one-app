import { createFileRoute } from "@tanstack/react-router";
import CuratedApp from "@/features/curated/App";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/kurasi/$slug")({
  component: KurasiSlugPage,
});

function KurasiSlugPage() {
  const { slug } = Route.useParams();

  // map slug to id
  const slugMap: Record<string, number> = {
    ekonomi: 1,
    statistik: 2,
    manajemen: 3,
    komunikasi: 4,
    logistik: 5,
    bisnis: 6,
    administrasi: 7,
    akuntansi: 8,
    asuransi: 9,
    investasi: 10,
  };

  const id = slugMap[slug] || 1;

  // Title formatting
  const titleMap: Record<string, string> = {
    ekonomi: "Ekonomi",
    statistik: "Statistik",
    manajemen: "Manajemen",
    komunikasi: "Komunikasi",
    logistik: "Logistik",
    bisnis: "Bisnis",
    administrasi: "Administrasi",
    akuntansi: "Akuntansi",
    asuransi: "Asuransi",
    investasi: "Investasi",
  };

  const title = titleMap[slug] || "Value Treated";

  return (
    <AppShell title={title} subtitle="Kumpulan aset, alat, dan referensi desain">
      <div className="w-full -mt-8">
        <CuratedApp initialChapterId={id} />
      </div>
    </AppShell>
  );
}
