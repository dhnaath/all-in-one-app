import { createFileRoute } from "@tanstack/react-router";
import { ReadingListView } from "@/features/wira/components/views/ReadingListView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/reading")({
  head: () => ({
    meta: [
      { title: "Reading List — Client OS" },
      { name: "description", content: "Books and articles to read." },
    ],
  }),
  component: ReadingListViewPage,
});

function ReadingListViewPage() {
  return (
    <AppShell title="Reading List" subtitle="Books and articles to read.">
      <div className="w-full">
        <ReadingListView />
      </div>
    </AppShell>
  );
}
