import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/lean-canvas")({
  component: LeanCanvasPage,
});

function LeanCanvasPage() {
  return <FrameworkView frameworkName="Lean Canvas" />;
}
