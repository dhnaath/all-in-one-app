import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/pestel")({
  head: () => ({
    meta: [
      { title: "PESTEL Analysis — Client OS" },
      { name: "description", content: "Analisis Makro-Lingkungan Eksternal (Political, Economic, Social, Technological, Environmental, Legal)." },
    ],
  }),
  component: () => <FrameworkView frameworkName="PESTEL Analysis" />,
});
