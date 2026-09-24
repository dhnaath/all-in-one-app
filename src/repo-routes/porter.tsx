import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/porter")({
  head: () => ({
    meta: [
      { title: "Porter's Five Forces — Client OS" },
      { name: "description", content: "Analisis Struktur Kompetisi Industri dan Profitabilitas Pasar." },
    ],
  }),
  component: () => <FrameworkView frameworkName="Porter's Five Forces" />,
});
