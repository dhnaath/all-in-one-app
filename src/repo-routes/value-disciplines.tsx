import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/value-disciplines")({
  head: () => ({
    meta: [
      { title: "Value Disciplines Model — Client OS" },
      { name: "description", content: "Tiga Pilar Disiplin Nilai: Operational Excellence, Product Leadership, dan Customer Intimacy." },
    ],
  }),
  component: () => <FrameworkView frameworkName="Value Disciplines Model" />,
});
