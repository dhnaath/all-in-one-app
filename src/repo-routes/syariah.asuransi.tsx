import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/syariah/asuransi")({
  component: SyariahAsuransiPage,
});

function SyariahAsuransiPage() {
  return <Navigate to="/syariah/akad" search={{ app: "takaful" }} replace />;
}
