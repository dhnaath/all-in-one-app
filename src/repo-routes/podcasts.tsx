import { createFileRoute } from "@tanstack/react-router";
import { PodcastsView } from "@/features/wira/components/views/PodcastsView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/podcasts")({
  head: () => ({
    meta: [
      { title: "Podcast & Audio Briefings — All in One" },
      { name: "description", content: "Kurasi episode podcast seputar strategi bisnis, M&A, dan kepemimpinan eksekutif." },
    ],
  }),
  component: PodcastsViewPage,
});

function PodcastsViewPage() {
  return (
    <AppShell title="Podcast & Audio Briefings" subtitle="Kurasi episode podcast dan executive briefings">
      <div className="w-full">
        <PodcastsView />
      </div>
    </AppShell>
  );
}
