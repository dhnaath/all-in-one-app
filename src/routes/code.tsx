import { createFileRoute } from "@tanstack/react-router";
import { CodeView } from "@/features/wira/components/views/CodeView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/code")({
  head: () => ({
    meta: [
      { title: "Code — Client OS" },
      { name: "description", content: "Code snippets and projects." },
    ],
  }),
  component: CodeViewPage,
});

function CodeViewPage() {
  return (
    <AppShell title="Code" subtitle="Code snippets and projects.">
      <div className="w-full">
        <CodeView />
      </div>
    </AppShell>
  );
}
