import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/blue-ocean")({
  head: () => ({
    meta: [
      { title: "Blue Ocean Strategy (ERRC) — Client OS" },
      { name: "description", content: "Kerangka Inovasi Nilai ERRC: Eliminate, Reduce, Raise, dan Create." },
    ],
  }),
  component: () => <FrameworkView frameworkName="Blue Ocean Strategy (ERRC)" />,
});
