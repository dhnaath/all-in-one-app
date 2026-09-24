import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/marketing-mix")({
  component: MarketingMixPage,
});

function MarketingMixPage() {
  return <FrameworkView frameworkName="4P/7P Marketing Mix" />;
}
