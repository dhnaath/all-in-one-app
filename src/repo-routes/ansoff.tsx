import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/ansoff")({
  head: () => ({
    meta: [
      { title: "Ansoff Matrix — Client OS" },
      { name: "description", content: "Matriks Perencanaan Pertumbuhan: Penetrasi Pasar, Pengembangan Produk & Pasar, serta Diversifikasi." },
    ],
  }),
  component: () => <FrameworkView frameworkName="Ansoff Matrix" />,
});
