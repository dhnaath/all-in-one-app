import { createFileRoute } from "@tanstack/react-router";
import { InventoryView } from "@/features/wira/components/views/InventoryView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Client OS" },
      { name: "description", content: "Manage your inventory." },
    ],
  }),
  component: InventoryViewPage,
});

function InventoryViewPage() {
  return (
    <AppShell title="Inventory" subtitle="Manage your inventory.">
      <div className="w-full">
        <InventoryView />
      </div>
    </AppShell>
  );
}
