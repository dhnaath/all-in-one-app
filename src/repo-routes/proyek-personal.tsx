import { createFileRoute } from "@tanstack/react-router";
import { ProjectsView } from "@/features/wira/components/views/ProjectsView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/proyek-personal")({
  head: () => ({
    meta: [
      { title: "Personal Projects — Client OS" },
      { name: "description", content: "Organize your work and personal projects." },
    ],
  }),
  component: ProjectsViewPage,
});

function ProjectsViewPage() {
  return (
    <AppShell title="Personal Projects" subtitle="Organize your work and personal projects.">
      <div className="w-full">
        <ProjectsView />
      </div>
    </AppShell>
  );
}
