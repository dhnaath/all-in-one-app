import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/value-chain")({
  head: () => ({
    meta: [
      { title: "Value Chain Analysis — Client OS" },
      { name: "description", content: "Analisis Rantai Nilai & Proses Margin Operasional Perusahaan." },
    ],
  }),
  component: () => <FrameworkView frameworkName="Value Chain Analysis" />,
});
