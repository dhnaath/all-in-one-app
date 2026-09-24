import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { CornerUpRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/shortcut")({
  head: () => ({
    meta: [
      { title: "Shortcut — Client OS Konsultan" },
      {
        name: "description",
        content: "Fitur shortcut dan pintasan kerja.",
      },
    ],
  }),
  component: ShortcutPage,
});

function ShortcutPage() {
  return (
    <AppShell
      title="Shortcut"
      subtitle="Ruang pintasan cepat untuk alur kerja dan akses instan"
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-5 border border-primary/20 shadow-xs">
          <CornerUpRight className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
          Shortcut
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Halaman fitur shortcut ini siap digunakan. Saat ini masih kosong sesuai permintaan dan dapat diisi dengan kumpulan pintasan kustom, navigasi favorit, atau alur kerja Anda nantinya.
        </p>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted/60 border border-border text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Siap dikustomisasi</span>
        </div>
      </div>
    </AppShell>
  );
}
