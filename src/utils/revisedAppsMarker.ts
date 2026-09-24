export const REVISED_APP_PATHS = [
  "/task-manager",
  "/tasks",
  "/kalender",
  "/calendar",
  "/events",
  "/project-manager",
  "/proyek",
  "/planner",
  "/daily-planner",
  "/reminder-manager",
  "/reminders",
  "/habits",
  "/habit-tracker",
  "/pomodoro",
  "/focus-timer",
  "/eisenhower",
  "/kanban",
  "/kanban-board",
  "/timeline",
  "/gantt",
  "/countdown",
  "/notes",
  "/documents",
  "/database",
  "/datasets",
  "/web-clipper",
  "/clipper",
  "/research-manager",
  "/research",
  "/knowledge-base",
  "/knowledge",
  "/wiki",
  "/knowledge-wiki",
  "/meeting-manager",
  "/meetings",
  "/deliverable-manager",
  "/deliverables",
  "/workflow-manager",
  "/workflows",
  "/forms",
  "/collaboration",
  "/statistics",
  "/stats",
  "/search-manager",
  "/search",
  "/bookmarks",
  "/bookmark-manager",
  "/notification-center",
  "/notifications",
  "/approval-manager",
  "/approvals",
  "/asset-manager",
  "/assets",
  "/template-manager",
  "/templates",
  "/goal-manager",
  "/goals",
  "/milestone-manager",
  "/milestones",
  "/time-tracker",
  "/timesheet",
  "/timesheets",
  "/resource-manager",
  "/resources",
  "/people-manager",
  "/people",
  "/interaction-manager",
  "/interactions",
  "/schedule-manager",
  "/schedules",
  "/roster",
  "/subscription-manager",
  "/expense-tracker",
  "/expenses",
];

/**
 * Checks if an application was newly revised in the latest ecosystem update.
 * Used to apply a clean white icon without color as a temporary identifier.
 */
export function isNewlyRevisedApp(toOrPath?: string, label?: string): boolean {
  if (!toOrPath && !label) return false;
  
  const path = (toOrPath || "").split("?")[0].toLowerCase();
  if (REVISED_APP_PATHS.some((p) => path === p || path.startsWith(p + "/"))) {
    return true;
  }
  
  if (label) {
    const l = label.toLowerCase();
    if (
      l.includes("task manager") ||
      l.includes("project manager") ||
      l.includes("proyek & tugas") ||
      l.includes("kalender") ||
      l.includes("calendar") ||
      l.includes("planner") ||
      l.includes("reminder") ||
      l.includes("habit") ||
      l.includes("focus timer") ||
      l.includes("pomodoro") ||
      l.includes("eisenhower") ||
      l.includes("kanban") ||
      l.includes("timeline") ||
      l.includes("countdown") ||
      l.includes("notes") ||
      l.includes("documents") ||
      l.includes("database") ||
      l.includes("web clipper") ||
      l.includes("research") ||
      l.includes("knowledge base") ||
      l.includes("wiki") ||
      l.includes("meeting") ||
      l.includes("deliverable") ||
      l.includes("workflow") ||
      l.includes("form") ||
      l.includes("collaboration") ||
      l.includes("statistic") ||
      l.includes("search manager") ||
      l.includes("bookmark") ||
      l.includes("notification") ||
      l.includes("approval") ||
      l.includes("asset") ||
      l.includes("template") ||
      l.includes("goal") ||
      l.includes("milestone") ||
      l.includes("time tracker") ||
      l.includes("timesheet") ||
      l.includes("resource") ||
      l.includes("people") ||
      l.includes("interaction") ||
      l.includes("schedule") ||
      l.includes("subscription") ||
      l.includes("expense")
    ) {
      return true;
    }
  }
  
  return false;
}
