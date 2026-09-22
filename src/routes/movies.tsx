import { createFileRoute } from "@tanstack/react-router";
import { MoviesView } from "@/features/wira/components/views/MoviesView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/movies")({
  head: () => ({
    meta: [
      { title: "Movies & Executive Cinema — All in One" },
      { name: "description", content: "Kurasi film analitis, drama korporat, dokumenter teknologi, dan studi kasus krisis." },
    ],
  }),
  component: MoviesViewPage,
});

function MoviesViewPage() {
  return (
    <AppShell title="Movies & Executive Cinema" subtitle="Watchlist film analitis dan studi kasus korporat">
      <div className="w-full">
        <MoviesView />
      </div>
    </AppShell>
  );
}
