import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import IncotermsApp from "@/features/incoterms/App";

export const Route = createFileRoute("/incoterms")({
  head: () => ({
    meta: [
      { title: "Panduan Incoterms — Client OS" },
      { name: "description", content: "Panduan aturan perdagangan internasional Incoterms 2020." },
    ],
  }),
  component: IncotermsPage,
});

function IncotermsPage() {
  return (
    <AppShell title="Panduan Incoterms" subtitle="Aturan perdagangan internasional">
      <div className="w-full h-full">
        <IncotermsApp />
      </div>
    </AppShell>
  );
}
