import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/value-proposition-canvas")({
  component: ValuePropositionCanvasPage,
});

function ValuePropositionCanvasPage() {
  return <FrameworkView frameworkName="Value Proposition Canvas" />;
}
