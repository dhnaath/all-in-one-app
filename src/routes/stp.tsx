import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/stp")({
  component: StpPage,
});

function StpPage() {
  return <FrameworkView frameworkName="STP Framework" />;
}
