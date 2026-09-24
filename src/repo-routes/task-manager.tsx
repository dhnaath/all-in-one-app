import { createFileRoute } from "@tanstack/react-router";
import TasksApp from "@/features/tasks/App";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/task-manager")({
  head: () => ({
    meta: [
      { title: "Task Manager — Client OS" },
      { name: "description", content: "Kelola tugas harian." },
    ],
  }),
  component: TaskManagerPage,
});

function TaskManagerPage() {
  return (
    <AppShell title="Task Manager" subtitle="Kelola daftar tugas harian Anda">
      <div className="w-full -mt-8">
        <TasksApp />
      </div>
    </AppShell>
  );
}
