import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/bmc")({
  component: BmcPage,
});

function BmcPage() {
  return <FrameworkView frameworkName="Business Model Canvas (BMC)" />;
}
