import { createFileRoute } from "@tanstack/react-router";
import { WritingView } from "@/features/wira/components/views/WritingView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/writing")({
  head: () => ({
    meta: [
      { title: "Writing — Client OS" },
      { name: "description", content: "Write and manage documents." },
    ],
  }),
  component: WritingViewPage,
});

function WritingViewPage() {
  return (
    <AppShell title="Writing" subtitle="Write and manage documents.">
      <div className="w-full">
        <WritingView />
      </div>
    </AppShell>
  );
}
