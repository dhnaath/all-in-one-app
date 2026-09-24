import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/wallet")({
  component: WalletPage,
});

function WalletPage() {
  return (
    <AppShell title="Wallet" subtitle="Personal">
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
        <h2 className="text-3xl font-bold text-foreground">Wallet</h2>
      </div>
    </AppShell>
  );
}
