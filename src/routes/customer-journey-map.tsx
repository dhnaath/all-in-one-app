import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/customer-journey-map")({
  component: CustomerJourneyMapPage,
});

function CustomerJourneyMapPage() {
  return <FrameworkView frameworkName="Customer Journey Map (CJM)" />;
}
