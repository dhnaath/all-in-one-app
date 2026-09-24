import { createFileRoute } from "@tanstack/react-router";
import { PasswordsView } from "@/features/wira/components/views/PasswordsView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/passwords")({
  head: () => ({
    meta: [
      { title: "Brankas Kata Sandi — Client OS" },
      { name: "description", content: "Manajemen kredensial aman, generator sandi acak, dan brankas akun." },
    ],
  }),
  component: PasswordsViewPage,
});

function PasswordsViewPage() {
  return (
    <AppShell title="Brankas Kata Sandi" subtitle="Penyimpanan kredensial aman, audit kekuatan sandi, dan generator otomatis.">
      <div className="w-full">
        <PasswordsView />
      </div>
    </AppShell>
  );
}
