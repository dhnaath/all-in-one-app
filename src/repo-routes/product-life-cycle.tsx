import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/product-life-cycle")({
  component: ProductLifeCyclePage,
});

function ProductLifeCyclePage() {
  return <FrameworkView frameworkName="Product Life Cycle (PLC)" />;
}
