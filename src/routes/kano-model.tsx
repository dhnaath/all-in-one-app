import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";

export const Route = createFileRoute("/kano-model")({
  component: KanoModelPage,
});

function KanoModelPage() {
  return <FrameworkView frameworkName="Kano Model" />;
}
