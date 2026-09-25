import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { WalletKasAppView } from "@/features/wira/components/views/WalletKasAppView";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet & Kas — All in One" },
      { name: "description", content: "Kendali arus kas, pembanding harga, rencana belanja wishlist, dan garansi resmi." },
    ],
  }),
  component: WalletPage,
});

function WalletPage() {
  return (
    <AppShell title="Wallet & Kas" subtitle="Kendali arus kas, pembanding harga, wishlist belanja, dan garansi">
      <div className="w-full">
        <WalletKasAppView />
      </div>
    </AppShell>
  );
}
