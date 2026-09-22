import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/bcg")({
  head: () => ({
    meta: [
      { title: "BCG Matrix — Client OS" },
      { name: "description", content: "Matriks Portofolio Produk: Stars, Cash Cows, Question Marks, dan Dogs." },
    ],
  }),
  component: () => <FrameworkView frameworkName="BCG Matrix" />,
});
