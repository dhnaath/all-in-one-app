import { createFileRoute } from "@tanstack/react-router";
import { ContactsView } from "@/features/wira/components/views/ContactsView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Kontak & CRM — Client OS" },
      { name: "description", content: "Manajemen jaringan relasi, klien, vendor, dan prospek bisnis." },
    ],
  }),
  component: ContactsViewPage,
});

function ContactsViewPage() {
  return (
    <AppShell title="Kontak & CRM" subtitle="Buku relasi profesional, klien, vendor, dan manajemen prospek bisnis.">
      <div className="w-full">
        <ContactsView />
      </div>
    </AppShell>
  );
}
