import { createFileRoute } from "@tanstack/react-router";
import { FlashcardsView } from "@/features/wira/components/views/FlashcardsView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Flashcards — Client OS" },
      { name: "description", content: "Study with flashcards." },
    ],
  }),
  component: FlashcardsViewPage,
});

function FlashcardsViewPage() {
  return (
    <AppShell title="Flashcards" subtitle="Study with flashcards.">
      <div className="w-full">
        <FlashcardsView />
      </div>
    </AppShell>
  );
}
