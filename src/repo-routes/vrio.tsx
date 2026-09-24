import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/vrio")({
  head: () => ({
    meta: [
      { title: "VRIO Framework — Client OS" },
      { name: "description", content: "Evaluasi Sumber Daya & Keunggulan Kompetitif Berkelanjutan Perusahaan." },
    ],
  }),
  component: () => <FrameworkView frameworkName="VRIO Framework" />,
});
