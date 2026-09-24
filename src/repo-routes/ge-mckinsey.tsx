import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/ge-mckinsey")({
  head: () => ({
    meta: [
      { title: "GE-McKinsey Matrix — Client OS" },
      { name: "description", content: "Matriks Evaluasi Portofolio 3x3 Berdasarkan Daya Tarik Industri & Kekuatan Bisnis." },
    ],
  }),
  component: () => <FrameworkView frameworkName="GE-McKinsey Matrix" />,
});
