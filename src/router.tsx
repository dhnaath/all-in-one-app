
import {
  ShariaIndicesView,
  ShariaDashboardView,
  ShariaAkadView,
  ShariaTerlarangView,
  ShariaAsuransiView,
  ZakatAppView,
  TaxAppView,
  InvestmentAppView,
  ValuationView,
  CommodityView,
  IncotermsView,
  WaterView,
  MatrixAssetView,
  MatrixEarningView,
  MatrixLiabilityView,
  MatrixExpenseView,
  MatrixFinancialHealthView,
  MatrixSwotView,
  MatrixTowsView,
  SpectrumStageView,
  SocietyView,
  WiraView,
  FrameworkByNameView,
  LainnyaView,
  KlienWorkspaceView,
  CatatanView,
} from "./features/nonWhiteApps/NonWhiteAppRenderer";
import { StandaloneAppView } from "./features/standalone/StandaloneAppView";
import { STANDALONE_APPS } from "./features/standalone/standaloneAppsData";

import React, { useState } from "react";
import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  useParams,
  useNavigate,
  useRouterState,
  Link,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Launcher } from "./routes/index";
import CreditApp from "./features/credit/App";
import CuratedApp from "./features/curated/App";
import { TaskManagerApp } from "./features/task-manager/TaskManagerApp";
import { ProjectManagerApp } from "./features/project-manager/ProjectManagerApp";
import { CalendarApp } from "./features/calendar/CalendarApp";
import { PlannerApp } from "./features/planner/PlannerApp";
import { ReminderManagerApp } from "./features/reminder-manager/ReminderManagerApp";
import { HabitTrackerApp } from "./features/habit-tracker/HabitTrackerApp";
import { FocusTimerApp } from "./features/focus-timer/FocusTimerApp";
import { EisenhowerApp } from "./features/eisenhower/EisenhowerApp";
import { KanbanApp } from "./features/kanban/KanbanApp";
import { TimelineApp } from "./features/timeline/TimelineApp";
import { CountdownApp } from "./features/countdown/CountdownApp";
import { NotesApp } from "./features/notes/NotesApp";
import { DocumentsApp } from "./features/documents/DocumentsApp";
import { DatabaseApp } from "./features/database/DatabaseApp";
import { WebClipperApp } from "./features/web-clipper/WebClipperApp";
import { ResearchManagerApp } from "./features/research-manager/ResearchManagerApp";
import { KnowledgeBaseApp } from "./features/knowledge-base/KnowledgeBaseApp";
import { WikiApp } from "./features/wiki/WikiApp";
import { MeetingManagerApp } from "./features/meeting-manager/MeetingManagerApp";
import { DeliverableManagerApp } from "./features/deliverable-manager/DeliverableManagerApp";
import { WorkflowManagerApp } from "./features/workflow-manager/WorkflowManagerApp";
import { FormsApp } from "./features/forms/FormsApp";
import { CollaborationApp } from "./features/collaboration/CollaborationApp";
import { StatisticsApp } from "./features/statistics/StatisticsApp";
import { SearchManagerApp } from "./features/search-manager/SearchManagerApp";
import { BookmarkManagerApp } from "./features/bookmark-manager/BookmarkManagerApp";
import { NotificationCenterApp } from "./features/notification-center/NotificationCenterApp";
import { ApprovalManagerApp } from "./features/approval-manager/ApprovalManagerApp";
import { AssetManagerApp } from "./features/asset-manager/AssetManagerApp";
import { TemplateManagerApp } from "./features/template-manager/TemplateManagerApp";
import { GoalManagerApp } from "./features/goal-manager/GoalManagerApp";
import { MilestoneManagerApp } from "./features/milestone-manager/MilestoneManagerApp";
import { TimeTrackerApp } from "./features/time-tracker/TimeTrackerApp";
import { ResourceManagerApp } from "./features/resource-manager/ResourceManagerApp";
import { PeopleManagerApp } from "./features/people-manager/PeopleManagerApp";
import { InteractionManagerApp } from "./features/interaction-manager/InteractionManagerApp";
import { ScheduleManagerApp } from "./features/schedule-manager/ScheduleManagerApp";
import { SubscriptionManagerApp } from "./features/subscription-manager/SubscriptionManagerApp";
import { ExpenseTrackerApp } from "./features/expense-tracker/ExpenseTrackerApp";
import { ShariaIndexApp } from "./features/sharia-index/ShariaIndexApp";
import { getFramework } from "./frameworkData";
import { AppShell } from "./app/app-shell";
import { ShellSections } from "./app/shell-sections";
import { navKonsultan, type NavItem } from "./config/nav";
import { COMMODITY_DATA } from "./commodityData";
import {
  ArrowLeft,
  Search,
  ExternalLink,
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
  FileText,
  TrendingUp,
  Table,
} from "lucide-react";

// 1. Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// 2. Index route (Launcher)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Launcher,
});

// 3. Kredit route
function KreditView() {
  return (
    <AppShell title="Kredit & Utang" subtitle="Manajemen utang dan kartu kredit">
      <div className="w-full max-w-[1720px] mx-auto p-4 md:p-6 -mt-4">
        <CreditApp />
      </div>
    </AppShell>
  );
}

const kreditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kredit",
  component: KreditView,
});

// 4. Kurasi route
function KurasiView() {
  const params = useParams({ strict: false }) as { slug?: string };
  const slug = params.slug || "";
  const slugChapterMap: Record<string, number> = {
    ekonomi: 1,
    statistik: 2,
    manajemen: 3,
    komunikasi: 4,
    logistik: 5,
    bisnis: 6,
    administrasi: 7,
    akuntansi: 8,
    asuransi: 9,
    investasi: 10,
  };
  const chapterId = (slug && slugChapterMap[slug.toLowerCase()]) || 1;

  return (
    <AppShell
      title="Kurasi Pengetahuan Bisnis"
      subtitle={`Chapter ${chapterId} — Panduan & Framework Kurasi`}
    >
      <div className="w-full max-w-[1720px] mx-auto p-4 md:p-6">
        <CuratedApp initialChapterId={chapterId} />
      </div>
    </AppShell>
  );
}

const kurasiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kurasi",
  component: KurasiView,
});

const kurasiSlugRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kurasi/$slug",
  component: KurasiView,
});

// 5. Framework detail route
function FrameworkDetailView() {
  const params = useParams({ strict: false }) as { slug?: string };
  const navigate = useNavigate();
  const slug = params.slug || "";
  const cleanName = slug ? decodeURIComponent(slug).replace(/-/g, " ") : "SWOT Analysis";
  const fw = getFramework(slug || cleanName);

  const [activeTab, setActiveTab] = useState<"teori" | "draft" | "action">("teori");
  const [worksheetData, setWorksheetData] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`worksheet_${slug}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleFieldChange = (key: string, value: string) => {
    setWorksheetData((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(`worksheet_${slug}`, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const frameworkSections = [
    { id: "teori", label: "Teori & Konsep", active: activeTab === "teori", onSelect: () => setActiveTab("teori" as const) },
    { id: "draft", label: "Lembar Kerja", active: activeTab === "draft", onSelect: () => setActiveTab("draft" as const) },
    { id: "action", label: "Rencana Aksi", active: activeTab === "action", onSelect: () => setActiveTab("action" as const) },
  ];

  return (
    <AppShell
      title={fw ? cleanName.toUpperCase() : "Framework"}
      subtitle={fw?.layout.tipe || "Strategic Framework & Consulting Tool"}
    >
      <ShellSections sections={frameworkSections} />
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation & Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-card border border-border rounded-[1.25rem] p-4 sm:p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/" })}
              className="p-2.5 rounded-xl border border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Kembali ke Launcher"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                  100 Frameworks
                </span>
                <span className="text-xs text-muted-foreground">
                  {fw?.layout.visualType || "Interactive Tool"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-1 capitalize">
                {cleanName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("teori")}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "teori"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              Teori & Konsep
            </button>
            <button
              onClick={() => setActiveTab("draft")}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "draft"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              Lembar Kerja (Worksheet)
            </button>
            <button
              onClick={() => setActiveTab("action")}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "action"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              Rencana Aksi
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === "teori" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-[1.25rem] p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <BookOpen className="size-4" />
                <span>Deskripsi & Dasar Teori</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {fw?.teori.deskripsi || "Informasi deskripsi sedang dimuat."}
              </p>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
                  <Sparkles className="size-4" />
                  <span>Manfaat Strategis</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {fw?.teori.manfaat || "Membantu pengambilan keputusan terstruktur dan berbasis data."}
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-[1.25rem] p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Layers className="size-4" />
                <span>Komponen & Elemen Kanvas</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {fw?.layout.elemen.map((el, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-accent/40 border border-border text-xs font-medium text-foreground"
                  >
                    {el}
                  </span>
                ))}
              </div>

              {fw?.tutorial && fw.tutorial.length > 0 && (
                <div className="pt-4 border-t border-border space-y-3">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Langkah Implementasi
                  </h4>
                  <div className="space-y-2">
                    {fw.tutorial.map((tut, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                          {i + 1}
                        </span>
                        <div>
                          <strong className="text-foreground">{tut.step}:</strong> {tut.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "draft" && (
          <div className="bg-card border border-border rounded-[1.25rem] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Lembar Kerja Interaktif
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Isi analisis Anda langsung di bawah. Data otomatis tersimpan di penyimpanan lokal peramban.
                </p>
              </div>
              <button
                onClick={() => {
                  setWorksheetData({});
                  localStorage.removeItem(`worksheet_${slug}`);
                }}
                className="text-xs text-rose-500 hover:underline cursor-pointer"
              >
                Reset Isian
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fw?.draft.map((d, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-background space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    {d.bagian}
                  </label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {d.hint}
                  </p>
                  <textarea
                    rows={4}
                    value={worksheetData[d.bagian] || ""}
                    onChange={(e) => handleFieldChange(d.bagian, e.target.value)}
                    placeholder={`Tulis catatan atau temuan untuk ${d.bagian}...`}
                    className="w-full text-sm bg-card border border-border rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "action" && (
          <div className="bg-card border border-border rounded-[1.25rem] p-6 space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              Rekomendasi Rencana Aksi
            </h3>
            <p className="text-xs text-muted-foreground">
              Langkah-langkah taktis yang direkomendasikan untuk menindaklanjuti hasil analisis framework ini:
            </p>
            <div className="space-y-3 pt-2">
              {fw?.actionPlan.map((act, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-background"
                >
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/90">{act}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

const frameworkSlugRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/framework/$slug",
  component: FrameworkDetailView,
});

// 7. Task Manager route (#01 Standalone App Ecosystem)
function TaskManagerView() {
  return (
    <AppShell title="Task Manager" subtitle="Standalone App Ecosystem #01 • Single Source of Truth for Tasks">
      <TaskManagerApp />
    </AppShell>
  );
}

const taskManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/task-manager",
  component: TaskManagerView,
});

// 8. Project Manager route (#03 Standalone App Ecosystem)
function ProjectManagerView() {
  return (
    <AppShell title="Project Manager" subtitle="Standalone App Ecosystem #03 • Single Source of Truth for Projects">
      <ProjectManagerApp />
    </AppShell>
  );
}

const proyekRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/proyek",
  component: ProjectManagerView,
});

const projectManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/project-manager",
  component: ProjectManagerView,
});

// 9. Calendar route (#02 Standalone App Ecosystem)
function CalendarView() {
  return (
    <AppShell title="Calendar" subtitle="Standalone App Ecosystem #02 • Single Source of Truth for Events & Schedule View Layer">
      <CalendarApp />
    </AppShell>
  );
}

const kalenderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kalender",
  component: CalendarView,
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: CalendarView,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: CalendarView,
});

// 10. Planner route (#04 Standalone App Ecosystem)
function PlannerView() {
  return (
    <AppShell title="Planner" subtitle="Standalone App Ecosystem #04 • Time Allocation Layer & Deterministic Auto-Planning">
      <PlannerApp />
    </AppShell>
  );
}

const plannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/planner",
  component: PlannerView,
});

const dailyPlannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/daily-planner",
  component: PlannerView,
});

// 11. Reminder Manager route (#05 Standalone App Ecosystem)
function ReminderManagerView() {
  return (
    <AppShell title="Reminder Manager" subtitle="Standalone App Ecosystem #05 • Centralized Execution & Notification Engine">
      <ReminderManagerApp />
    </AppShell>
  );
}

const reminderManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reminder-manager",
  component: ReminderManagerView,
});

const remindersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reminders",
  component: ReminderManagerView,
});

// 12. Habit Tracker route (#06 Standalone App Ecosystem)
function HabitTrackerView() {
  return (
    <AppShell title="Habit Tracker" subtitle="Standalone App Ecosystem #06 • Single Source of Truth for Habits & Streaks">
      <HabitTrackerApp />
    </AppShell>
  );
}

const habitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/habits",
  component: HabitTrackerView,
});

const habitTrackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/habit-tracker",
  component: HabitTrackerView,
});

// 13. Focus Timer route (#07 Standalone App Ecosystem)
function FocusTimerView() {
  return (
    <AppShell title="Focus Timer" subtitle="Standalone App Ecosystem #07 • Real-Time Focus Session Execution & Interruption Log">
      <FocusTimerApp />
    </AppShell>
  );
}

const pomodoroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pomodoro",
  component: FocusTimerView,
});

const focusTimerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/focus-timer",
  component: FocusTimerView,
});

// 14. Eisenhower Matrix route (#08 Standalone App Ecosystem)
function EisenhowerView() {
  return (
    <AppShell title="Eisenhower Matrix" subtitle="Standalone App Ecosystem #08 • Decision-Oriented Classification Layer">
      <EisenhowerApp />
    </AppShell>
  );
}

const eisenhowerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/eisenhower",
  component: EisenhowerView,
});

// 15. Kanban Board route (#09 Standalone App Ecosystem)
function KanbanView() {
  return (
    <AppShell title="Kanban Board" subtitle="Standalone App Ecosystem #09 • Workflow Visualization, WIP Limits & Swimlanes">
      <KanbanApp />
    </AppShell>
  );
}

const kanbanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kanban",
  component: KanbanView,
});

const kanbanBoardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kanban-board",
  component: KanbanView,
});

// 16. Timeline Manager route (#10 Standalone App Ecosystem)
function TimelineView() {
  return (
    <AppShell title="Timeline Manager" subtitle="Standalone App Ecosystem #10 • Gantt Chart, Dependency Violations & Critical Path (CPM)">
      <TimelineApp />
    </AppShell>
  );
}

const timelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/timeline",
  component: TimelineView,
});

const ganttRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gantt",
  component: TimelineView,
});

// 17. Countdown route (#11 Standalone App Ecosystem)
function CountdownView() {
  return (
    <AppShell title="Countdown" subtitle="Standalone App Ecosystem #11 • Single Source of Truth for Countdown, Event & Milestone Targets">
      <CountdownApp />
    </AppShell>
  );
}

const countdownRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/countdown",
  component: CountdownView,
});

// 18. Notes route (#12 Standalone App Ecosystem)
function NotesView() {
  return (
    <AppShell title="Notes" subtitle="Standalone App Ecosystem #12 • Single Source of Truth for Notes, Block Content & Knowledge Network">
      <NotesApp />
    </AppShell>
  );
}

const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notes",
  component: NotesView,
});

// 19. Documents route (#13 Standalone App Ecosystem)
function DocumentsView() {
  return (
    <AppShell title="Documents" subtitle="Standalone App Ecosystem #13 • Single Source of Truth for Formal Documents, Versioning & Approvals">
      <DocumentsApp />
    </AppShell>
  );
}

const documentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/documents",
  component: DocumentsView,
});

// 20. Database route (#14 Standalone App Ecosystem)
function DatabaseView() {
  return (
    <AppShell title="Database" subtitle="Standalone App Ecosystem #14 • Custom Fields, Formulas, Multi-View Grid & Summary Aggregations">
      <DatabaseApp />
    </AppShell>
  );
}

const databaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/database",
  component: DatabaseView,
});

const datasetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/datasets",
  component: DatabaseView,
});

// 21. Web Clipper route (#15 Standalone App Ecosystem)
function WebClipperView() {
  return (
    <AppShell title="Web Clipper" subtitle="Standalone App Ecosystem #15 • Full Article Extraction, Highlighting & Workflow Promotion">
      <WebClipperApp />
    </AppShell>
  );
}

const webClipperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/web-clipper",
  component: WebClipperView,
});

const clipperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clipper",
  component: WebClipperView,
});

// 22. Research Manager route (#16 Standalone App Ecosystem)
function ResearchManagerView() {
  return (
    <AppShell title="Research Manager" subtitle="Standalone App Ecosystem #16 • Hypothesis Tracking, Multi-Source Evidence & Knowledge Promotion">
      <ResearchManagerApp />
    </AppShell>
  );
}

const researchManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/research-manager",
  component: ResearchManagerView,
});

const researchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/research",
  component: ResearchManagerView,
});

// 23. Knowledge Base route (#17 Standalone App Ecosystem)
function KnowledgeBaseView() {
  return (
    <AppShell title="Knowledge Base" subtitle="Standalone App Ecosystem #17 • Verified Articles, Structured Metadata, Review Workflow & Source Citations">
      <KnowledgeBaseApp />
    </AppShell>
  );
}

const knowledgeBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/knowledge-base",
  component: KnowledgeBaseView,
});

const knowledgeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/knowledge",
  component: KnowledgeBaseView,
});

// 24. Wiki route (#18 Standalone App Ecosystem)
function WikiView() {
  return (
    <AppShell title="Wiki Engine" subtitle="Standalone App Ecosystem #18 • Wikilinks, Knowledge Graph, Automatic Backlinks & Broken Link Detection">
      <WikiApp />
    </AppShell>
  );
}

const wikiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wiki",
  component: WikiView,
});

const knowledgeWikiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/knowledge-wiki",
  component: WikiView,
});

// 25. Meeting Manager route (#19 Standalone App Ecosystem)
function MeetingManagerView() {
  return (
    <AppShell title="Meeting Manager" subtitle="Standalone App Ecosystem #19 • Structured Meeting Lifecycle, Real-Time Notes & Decision Log">
      <MeetingManagerApp />
    </AppShell>
  );
}

const meetingManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/meeting-manager",
  component: MeetingManagerView,
});

const meetingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/meetings",
  component: MeetingManagerView,
});

// 26. Deliverable Manager route (#20 Standalone App Ecosystem)
function DeliverableManagerView() {
  return (
    <AppShell title="Deliverable Manager" subtitle="Standalone App Ecosystem #20 • Definition of Done, Multi-Stage Approvals & Version Submissions">
      <DeliverableManagerApp />
    </AppShell>
  );
}

const deliverableManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deliverable-manager",
  component: DeliverableManagerView,
});

const deliverablesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deliverables",
  component: DeliverableManagerView,
});

// 27. Workflow Manager route (#21 Standalone App Ecosystem)
function WorkflowManagerView() {
  return (
    <AppShell title="Workflow Manager" subtitle="Standalone App Ecosystem #21 • Formal Process Engine, Stages, Transitions & SLA Audits">
      <WorkflowManagerApp />
    </AppShell>
  );
}

const workflowManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workflow-manager",
  component: WorkflowManagerView,
});

const workflowsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workflows",
  component: WorkflowManagerView,
});

// 28. Forms route (#22 Standalone App Ecosystem)
function FormsView() {
  return (
    <AppShell title="Forms" subtitle="Standalone App Ecosystem #22 • Structured Data Collection, Conditional Logic & ActionMapping Pipeline">
      <FormsApp />
    </AppShell>
  );
}

const formsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forms",
  component: FormsView,
});

// 29. Collaboration route (#23 Standalone App Ecosystem)
function CollaborationView() {
  return (
    <AppShell title="Collaboration" subtitle="Standalone App Ecosystem #23 • Workspace RBAC, Teams, Generic Comments, Sharing & Unified Feed">
      <CollaborationApp />
    </AppShell>
  );
}

const collaborationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collaboration",
  component: CollaborationView,
});

// 30. Statistics route (#24 Standalone App Ecosystem)
function StatisticsView() {
  return (
    <AppShell title="Statistics" subtitle="Standalone App Ecosystem #24 • Cross-App Metric Aggregator, Time Series, Trends & Threshold Alerts">
      <StatisticsApp />
    </AppShell>
  );
}

const statisticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/statistics",
  component: StatisticsView,
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats",
  component: StatisticsView,
});

// 31. Search Manager route (#25 Standalone App Ecosystem)
function SearchManagerView() {
  return (
    <AppShell title="Search Manager" subtitle="Standalone App Ecosystem #25 • Universal Discovery & Indexing Layer across all 90 Apps">
      <SearchManagerApp />
    </AppShell>
  );
}

const searchManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search-manager",
  component: SearchManagerView,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchManagerView,
});

// 32. Bookmark Manager route (#26 Standalone App Ecosystem)
function BookmarkManagerView() {
  return (
    <AppShell title="Bookmark Manager" subtitle="Standalone App Ecosystem #26 • Single Source of Truth for URLs, Collections, Tags & Broken Link Audits">
      <BookmarkManagerApp />
    </AppShell>
  );
}

const bookmarksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bookmarks",
  component: BookmarkManagerView,
});

const bookmarkManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bookmark-manager",
  component: BookmarkManagerView,
});

// 33. Notification Center route (#27 Standalone App Ecosystem)
function NotificationCenterView() {
  return (
    <AppShell title="Notification Center" subtitle="Standalone App Ecosystem #27 • Unified Cross-App Inbound Alert Inbox, Quick Actions & Channel Preferences">
      <NotificationCenterApp />
    </AppShell>
  );
}

const notificationCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notification-center",
  component: NotificationCenterView,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: NotificationCenterView,
});

// 34. Approval Manager route (#28 Standalone App Ecosystem)
function ApprovalManagerView() {
  return (
    <AppShell title="Approval Manager" subtitle="Standalone App Ecosystem #28 • Multi-Stage Sequential & Parallel Approval Engine, Delegation & SLA Escalations">
      <ApprovalManagerApp />
    </AppShell>
  );
}

const approvalManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/approval-manager",
  component: ApprovalManagerView,
});

const approvalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/approvals",
  component: ApprovalManagerView,
});

// 35. Asset Manager route (#29 Standalone App Ecosystem)
function AssetManagerView() {
  return (
    <AppShell title="Asset Manager" subtitle="Standalone App Ecosystem #29 • Centralized Storage Layer, File Versioning, Orphan Detection & Broken Link Guard">
      <AssetManagerApp />
    </AppShell>
  );
}

const assetManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/asset-manager",
  component: AssetManagerView,
});

const assetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/assets",
  component: AssetManagerView,
});

function TemplateManagerView() {
  return (
    <AppShell title="Template Manager" subtitle="Repository Template Dokumen & Formulir Baku">
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <TemplateManagerApp />
      </div>
    </AppShell>
  );
}

const templateManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/template-manager",
  component: TemplateManagerView,
});

const templatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/templates",
  component: TemplateManagerView,
});

function GoalManagerView() {
  return (
    <AppShell title="Goal Manager" subtitle="Puncak Hierarki Motivasi & Agregasi Metrik">
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <GoalManagerApp />
      </div>
    </AppShell>
  );
}

const goalManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/goal-manager",
  component: GoalManagerView,
});

const goalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/goals",
  component: GoalManagerView,
});

function MilestoneManagerView() {
  return (
    <AppShell title="Milestone Manager" subtitle="Checkpoint Strategis Lintas-Project & Readiness Status">
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <MilestoneManagerApp />
      </div>
    </AppShell>
  );
}

const milestoneManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/milestone-manager",
  component: MilestoneManagerView,
});

const milestonesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/milestones",
  component: MilestoneManagerView,
});

function TimeTrackerView() {
  return (
    <AppShell title="Time Tracker" subtitle="Catatan Waktu Resmi/Legal-Grade • Timesheet & Billing">
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <TimeTrackerApp />
      </div>
    </AppShell>
  );
}

const timeTrackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/time-tracker",
  component: TimeTrackerView,
});

const timesheetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/timesheet",
  component: TimeTrackerView,
});

const timesheetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/timesheets",
  component: TimeTrackerView,
});

function ResourceManagerView() {
  return (
    <AppShell title="Resource Manager" subtitle="Source of Truth Kapasitas & Alokasi Lintas-Proyek">
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <ResourceManagerApp />
      </div>
    </AppShell>
  );
}

const resourceManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resource-manager",
  component: ResourceManagerView,
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resources",
  component: ResourceManagerView,
});

function PeopleManagerView() {
  return (
    <AppShell title="People Manager" subtitle="Identity Layer • Rujukan Identitas Tunggal Seluruh Ekosistem">
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <PeopleManagerApp />
      </div>
    </AppShell>
  );
}

const peopleManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people-manager",
  component: PeopleManagerView,
});

const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  component: PeopleManagerView,
});

function InteractionManagerView() {
  return (
    <AppShell title="Interaction Manager" subtitle="Relationship Timeline • Histori Komunikasi & Follow-up Eksekutif">
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <InteractionManagerApp />
      </div>
    </AppShell>
  );
}

const interactionManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/interaction-manager",
  component: InteractionManagerView,
});

const interactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/interactions",
  component: InteractionManagerView,
});

function ScheduleManagerView() {
  return (
    <AppShell title="Schedule Manager" subtitle="Source of Truth WorkSchedule • Pola Jam Kerja, Shift & Ketersediaan">
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <ScheduleManagerApp />
      </div>
    </AppShell>
  );
}

const scheduleManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedule-manager",
  component: ScheduleManagerView,
});

const schedulesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedules",
  component: ScheduleManagerView,
});

const rosterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/roster",
  component: ScheduleManagerView,
});

function SubscriptionManagerView() {
  return (
    <AppShell title="Subscription Manager" subtitle="Recurring Cost & Billing Lifecycle Manager">
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <SubscriptionManagerApp />
      </div>
    </AppShell>
  );
}

const subscriptionManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subscription-manager",
  component: SubscriptionManagerView,
});

function ExpenseTrackerView() {
  return (
    <AppShell title="Expense Tracker" subtitle="Pencatatan Biaya, Akun, Merchant & Kepatuhan Bukti Struk">
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <ExpenseTrackerApp />
      </div>
    </AppShell>
  );
}

const expenseTrackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/expense-tracker",
  component: ExpenseTrackerView,
});

const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/expenses",
  component: ExpenseTrackerView,
});


// Non-White Market & Syariah Routes
const syariahIndeksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/syariah/indeks",
  component: ShariaIndicesView,
});

const syariahAkadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/syariah/akad",
  component: ShariaAkadView,
});

const syariahTerlarangRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/syariah/terlarang",
  component: ShariaTerlarangView,
});

const syariahAsuransiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/syariah/asuransi",
  component: ShariaAsuransiView,
});

const syariahRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/syariah",
  component: ShariaDashboardView,
});

const zakatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/zakat",
  component: ZakatAppView,
});

// Tax & Investment & Valuation
const pajakRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pajak",
  component: TaxAppView,
});

const investasiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/investasi",
  component: InvestmentAppView,
});

const valuasiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/valuasi",
  component: ValuationView,
});

const komoditas100Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/100-komoditas",
  component: CommodityView,
});

const commodityDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/commodity-dashboard",
  component: CommodityView,
});

const incotermsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/incoterms",
  component: IncotermsView,
});

const waterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/water",
  component: WaterView,
});

// Quadrants & Matrices
const assetMatrixRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/asset",
  component: MatrixAssetView,
});

const earningMatrixRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/earning",
  component: MatrixEarningView,
});

const liabilityMatrixRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/liability",
  component: MatrixLiabilityView,
});

const expenseMatrixRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/expense",
  component: MatrixExpenseView,
});

const financialHealthMatrixRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/financial-health",
  component: MatrixFinancialHealthView,
});

const swotMatrixRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/swot",
  component: MatrixSwotView,
});

const towsMatrixRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tows",
  component: MatrixTowsView,
});

// Spectrum Stages
const growStageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/grow",
  component: () => <SpectrumStageView stage="grow" />,
});

const flowStageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flow",
  component: () => <SpectrumStageView stage="flow" />,
});

const buildStageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/build",
  component: () => <SpectrumStageView stage="build" />,
});

const legacyStageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legacy",
  component: () => <SpectrumStageView stage="legacy" />,
});

const suretyStageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/surety",
  component: () => <SpectrumStageView stage="surety" />,
});

// Society Views
const devSocietyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/development",
  component: () => <SocietyView type="development" />,
});

const improveSocietyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/improvement",
  component: () => <SocietyView type="improvement" />,
});

const relianceSocietyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reliance",
  component: () => <SocietyView type="reliance" />,
});

const sufficientSocietyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sufficient",
  component: () => <SocietyView type="sufficient" />,
});

const interactSocietyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/interact",
  component: () => <SocietyView type="interact" />,
});

const interdependenceSocietyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/interdependence",
  component: () => <SocietyView type="interdependence" />,
});

const interestSocietyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/interest",
  component: () => <SocietyView type="interest" />,
});

const intersectSocietyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/intersect",
  component: () => <SocietyView type="intersect" />,
});

const insiderSocietyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/insider",
  component: () => <SocietyView type="insider" />,
});

const outwardSocietyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/outward",
  component: () => <SocietyView type="outward" />,
});

// Client & Notes & Custom Workspace
const klienPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/klien",
  component: KlienWorkspaceView,
});

const catatanPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catatan",
  component: CatatanView,
});

const lainnyaPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lainnya",
  component: LainnyaView,
});

// Wira Personal & Productivity Views
const budgetRoute = createRoute({ getParentRoute: () => rootRoute, path: "/budget", component: () => <WiraView type="budget" /> });
const codeRoute = createRoute({ getParentRoute: () => rootRoute, path: "/code", component: () => <WiraView type="code" /> });
const contactsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/contacts", component: () => <WiraView type="contacts" /> });
const coursesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/courses", component: () => <WiraView type="courses" /> });
const designRoute = createRoute({ getParentRoute: () => rootRoute, path: "/design", component: () => <WiraView type="design" /> });
const examsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/exams", component: () => <WiraView type="exams" /> });
const flashcardsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/flashcards", component: () => <WiraView type="flashcards" /> });
const gamesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/games", component: () => <WiraView type="games" /> });
const healthRoute = createRoute({ getParentRoute: () => rootRoute, path: "/health", component: () => <WiraView type="health" /> });
const ideasRoute = createRoute({ getParentRoute: () => rootRoute, path: "/ideas", component: () => <WiraView type="ideas" /> });
const inventoryRoute = createRoute({ getParentRoute: () => rootRoute, path: "/inventory", component: () => <WiraView type="inventory" /> });
const journalRoute = createRoute({ getParentRoute: () => rootRoute, path: "/journal", component: () => <WiraView type="journal" /> });
const kalkulatorRoute = createRoute({ getParentRoute: () => rootRoute, path: "/kalkulator", component: () => <WiraView type="kalkulator" /> });
const languagesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/languages", component: () => <WiraView type="languages" /> });
const moviesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/movies", component: () => <WiraView type="movies" /> });
const musicRoute = createRoute({ getParentRoute: () => rootRoute, path: "/music", component: () => <WiraView type="music" /> });
const passwordsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/passwords", component: () => <WiraView type="passwords" /> });
const photographyRoute = createRoute({ getParentRoute: () => rootRoute, path: "/photography", component: () => <WiraView type="photography" /> });
const podcastsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/podcasts", component: () => <WiraView type="podcasts" /> });
const proyekPersonalRoute = createRoute({ getParentRoute: () => rootRoute, path: "/proyek-personal", component: () => <WiraView type="proyek-personal" /> });
const readingRoute = createRoute({ getParentRoute: () => rootRoute, path: "/reading", component: () => <WiraView type="reading" /> });
const recipesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/recipes", component: () => <WiraView type="recipes" /> });
const shoppingRoute = createRoute({ getParentRoute: () => rootRoute, path: "/shopping", component: () => <WiraView type="shopping" /> });
const subscriptionsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/subscriptions", component: () => <WiraView type="subscriptions" /> });
const tripsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/trips", component: () => <WiraView type="trips" /> });
const weatherRoute = createRoute({ getParentRoute: () => rootRoute, path: "/weather", component: () => <WiraView type="weather" /> });
const workoutsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/workouts", component: () => <WiraView type="workouts" /> });
const writingRoute = createRoute({ getParentRoute: () => rootRoute, path: "/writing", component: () => <WiraView type="writing" /> });

// Framework Routes
const bcgRoute = createRoute({ getParentRoute: () => rootRoute, path: "/bcg", component: () => <FrameworkByNameView name="BCG Matrix" /> });
const pestelRoute = createRoute({ getParentRoute: () => rootRoute, path: "/pestel", component: () => <FrameworkByNameView name="PESTEL Analysis" /> });
const porterRoute = createRoute({ getParentRoute: () => rootRoute, path: "/porter", component: () => <FrameworkByNameView name="Porter's Five Forces" /> });
const geMckinseyRoute = createRoute({ getParentRoute: () => rootRoute, path: "/ge-mckinsey", component: () => <FrameworkByNameView name="GE McKinsey Matrix" /> });
const ansoffRoute = createRoute({ getParentRoute: () => rootRoute, path: "/ansoff", component: () => <FrameworkByNameView name="Ansoff Matrix" /> });
const blueOceanRoute = createRoute({ getParentRoute: () => rootRoute, path: "/blue-ocean", component: () => <FrameworkByNameView name="Blue Ocean Strategy" /> });
const bmcRoute = createRoute({ getParentRoute: () => rootRoute, path: "/bmc", component: () => <FrameworkByNameView name="Business Model Canvas (BMC)" /> });
const leanCanvasRoute = createRoute({ getParentRoute: () => rootRoute, path: "/lean-canvas", component: () => <FrameworkByNameView name="Lean Canvas" /> });
const vpcRoute = createRoute({ getParentRoute: () => rootRoute, path: "/value-proposition-canvas", component: () => <FrameworkByNameView name="Value Proposition Canvas" /> });
const cjmRoute = createRoute({ getParentRoute: () => rootRoute, path: "/customer-journey-map", component: () => <FrameworkByNameView name="Customer Journey Map" /> });
const empathyMapRoute = createRoute({ getParentRoute: () => rootRoute, path: "/empathy-map", component: () => <FrameworkByNameView name="Empathy Map" /> });
const kanoRoute = createRoute({ getParentRoute: () => rootRoute, path: "/kano-model", component: () => <FrameworkByNameView name="Kano Model" /> });
const marketingMixRoute = createRoute({ getParentRoute: () => rootRoute, path: "/marketing-mix", component: () => <FrameworkByNameView name="Marketing Mix (7P/4P)" /> });
const plcRoute = createRoute({ getParentRoute: () => rootRoute, path: "/product-life-cycle", component: () => <FrameworkByNameView name="Product Life Cycle" /> });
const stpRoute = createRoute({ getParentRoute: () => rootRoute, path: "/stp", component: () => <FrameworkByNameView name="STP (Segmentation, Targeting, Positioning)" /> });
const valueChainRoute = createRoute({ getParentRoute: () => rootRoute, path: "/value-chain", component: () => <FrameworkByNameView name="Value Chain Analysis" /> });
const valueDisciplinesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/value-disciplines", component: () => <FrameworkByNameView name="Value Disciplines" /> });
const vrioRoute = createRoute({ getParentRoute: () => rootRoute, path: "/vrio", component: () => <FrameworkByNameView name="VRIO Framework" /> });
const framework100Route = createRoute({ getParentRoute: () => rootRoute, path: "/100-framework", component: () => <FrameworkByNameView name="Katalog 100 Framework" /> });


// 6. Dynamic catch-all route for any standalone app / nav path
function DynamicAppView() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const pathname = routerState.location.pathname.replace(/\/$/, "");
  const search = (routerState.location.search || {}) as Record<string, any>;
  const currentAppParam = typeof search?.app === "string" ? search.app : "";

  // 1. Sharia routes
  if (pathname === "/syariah/indeks") return <ShariaIndicesView />;
  if (pathname === "/syariah/akad") return <ShariaAkadView />;
  if (pathname === "/syariah/terlarang") return <ShariaTerlarangView />;
  if (pathname === "/syariah/asuransi") return <ShariaAsuransiView />;
  if (pathname === "/syariah" || pathname === "") return <ShariaDashboardView />;
  if (pathname === "/zakat") return <ZakatAppView />;

  // 2. Value Treated & Finance
  if (pathname === "/pajak") return <TaxAppView />;
  if (pathname === "/investasi") return <InvestmentAppView />;
  if (pathname === "/valuasi") return <ValuationView />;
  if (pathname === "/100-komoditas" || pathname === "/commodity-dashboard") return <CommodityView />;
  if (pathname === "/incoterms") return <IncotermsView />;
  if (pathname === "/water") return <WaterView />;

  // 3. Matrix & Quadrants
  if (pathname === "/asset") return <MatrixAssetView />;
  if (pathname === "/earning") return <MatrixEarningView />;
  if (pathname === "/liability") return <MatrixLiabilityView />;
  if (pathname === "/expense") return <MatrixExpenseView />;
  if (pathname === "/financial-health") return <MatrixFinancialHealthView />;
  if (pathname === "/swot") return <MatrixSwotView />;
  if (pathname === "/tows") return <MatrixTowsView />;

  // 4. Spectrum Stages
  if (pathname === "/grow") return <SpectrumStageView stage="grow" />;
  if (pathname === "/flow") return <SpectrumStageView stage="flow" />;
  if (pathname === "/build") return <SpectrumStageView stage="build" />;
  if (pathname === "/legacy") return <SpectrumStageView stage="legacy" />;
  if (pathname === "/surety") return <SpectrumStageView stage="surety" />;

  // 5. Society Views
  if (pathname === "/development") return <SocietyView type="development" />;
  if (pathname === "/improvement") return <SocietyView type="improvement" />;
  if (pathname === "/reliance") return <SocietyView type="reliance" />;
  if (pathname === "/sufficient") return <SocietyView type="sufficient" />;
  if (pathname === "/interact") return <SocietyView type="interact" />;
  if (pathname === "/interdependence") return <SocietyView type="interdependence" />;
  if (pathname === "/interest") return <SocietyView type="interest" />;
  if (pathname === "/intersect") return <SocietyView type="intersect" />;
  if (pathname === "/insider") return <SocietyView type="insider" />;
  if (pathname === "/outward") return <SocietyView type="outward" />;

  // 6. Framework Views
  const frameworkMap: Record<string, string> = {
    "/bcg": "BCG Matrix",
    "/pestel": "PESTEL Analysis",
    "/porter": "Porter's Five Forces",
    "/ge-mckinsey": "GE McKinsey Matrix",
    "/ansoff": "Ansoff Matrix",
    "/blue-ocean": "Blue Ocean Strategy",
    "/bmc": "Business Model Canvas (BMC)",
    "/lean-canvas": "Lean Canvas",
    "/value-proposition-canvas": "Value Proposition Canvas",
    "/customer-journey-map": "Customer Journey Map",
    "/empathy-map": "Empathy Map",
    "/kano-model": "Kano Model",
    "/marketing-mix": "Marketing Mix (7P/4P)",
    "/product-life-cycle": "Product Life Cycle",
    "/stp": "STP (Segmentation, Targeting, Positioning)",
    "/value-chain": "Value Chain Analysis",
    "/value-disciplines": "Value Disciplines",
    "/vrio": "VRIO Framework",
    "/100-framework": "Katalog 100 Framework",
  };
  if (frameworkMap[pathname]) {
    return <FrameworkByNameView name={frameworkMap[pathname]} />;
  }

  // 7. Wira personal & productivity views
  const wiraKeys = [
    "budget", "code", "contacts", "courses", "design", "exams",
    "flashcards", "games", "health", "ideas", "inventory", "journal",
    "kalkulator", "languages", "movies", "music", "passwords", "photography",
    "podcasts", "proyek-personal", "reading", "recipes", "shopping",
    "subscriptions", "trips", "weather", "workouts", "writing"
  ];
  const matchedWira = wiraKeys.find((k) => pathname === "/" + k);
  if (matchedWira) {
    return <WiraView type={matchedWira} />;
  }

  // 8. Client & Notes & Custom Workspace
  if (pathname === "/klien") return <KlienWorkspaceView />;
  if (pathname === "/catatan") return <CatatanView />;
  if (pathname === "/lainnya") return <LainnyaView />;

  // 9. Standalone app requested via query or path
  const effectiveAppKey = currentAppParam || (pathname.startsWith("/") ? pathname.slice(1) : pathname);
  if (effectiveAppKey && STANDALONE_APPS[effectiveAppKey]) {
    const standaloneConfig = STANDALONE_APPS[effectiveAppKey];
    return (
      <AppShell title={standaloneConfig.title} subtitle={standaloneConfig.subtitle}>
        <div className="w-full">
          <StandaloneAppView appId={effectiveAppKey} />
        </div>
      </AppShell>
    );
  }

  // Fallback: search nav for matching metadata
  let matchedItem: NavItem | undefined;
  let matchedGroupTitle = "Workspace";
  for (const group of navKonsultan) {
    for (const item of group.items) {
      if (item.to === pathname || (currentAppParam && item.to.includes(currentAppParam))) {
        matchedItem = item;
        matchedGroupTitle = group.title;
        break;
      }
    }
    if (matchedItem) break;
  }

  const title = matchedItem?.label || currentAppParam || pathname.replace("/", "").replace(/-/g, " ");

  return (
    <AppShell title={title} subtitle={matchedGroupTitle + " — All in One Workspace"}>
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-card border border-border rounded-[1.25rem] p-4 sm:p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/" })}
              className="p-2.5 rounded-xl border border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Kembali ke Launcher"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                {matchedGroupTitle}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground capitalize mt-1">
                {title}
              </h1>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
          >
            Beranda Launcher
          </button>
        </div>
      </div>
    </AppShell>
  );
}

const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$",
  component: DynamicAppView,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  kreditRoute,
  kurasiRoute,
  kurasiSlugRoute,
  frameworkSlugRoute,
  taskManagerRoute,
  proyekRoute,
  projectManagerRoute,
  kalenderRoute,
  eventsRoute,
  calendarRoute,
  plannerRoute,
  dailyPlannerRoute,
  reminderManagerRoute,
  remindersRoute,
  habitsRoute,
  habitTrackerRoute,
  pomodoroRoute,
  focusTimerRoute,
  eisenhowerRoute,
  kanbanRoute,
  kanbanBoardRoute,
  timelineRoute,
  ganttRoute,
  countdownRoute,
  notesRoute,
  documentsRoute,
  databaseRoute,
  datasetsRoute,
  webClipperRoute,
  clipperRoute,
  researchManagerRoute,
  researchRoute,
  knowledgeBaseRoute,
  knowledgeRoute,
  wikiRoute,
  knowledgeWikiRoute,
  meetingManagerRoute,
  meetingsRoute,
  deliverableManagerRoute,
  deliverablesRoute,
  workflowManagerRoute,
  workflowsRoute,
  formsRoute,
  collaborationRoute,
  statisticsRoute,
  statsRoute,
  searchManagerRoute,
  searchRoute,
  bookmarksRoute,
  bookmarkManagerRoute,
  notificationCenterRoute,
  notificationsRoute,
  approvalManagerRoute,
  approvalsRoute,
  assetManagerRoute,
  assetsRoute,
  templateManagerRoute,
  templatesRoute,
  goalManagerRoute,
  goalsRoute,
  milestoneManagerRoute,
  milestonesRoute,
  timeTrackerRoute,
  timesheetRoute,
  timesheetsRoute,
  resourceManagerRoute,
  resourcesRoute,
  peopleManagerRoute,
  peopleRoute,
  interactionManagerRoute,
  interactionsRoute,
  scheduleManagerRoute,
  schedulesRoute,
  rosterRoute,
  subscriptionManagerRoute,
  expenseTrackerRoute,
  expensesRoute,
  
  syariahIndeksRoute,
  syariahAkadRoute,
  syariahTerlarangRoute,
  syariahAsuransiRoute,
  syariahRoute,
  zakatRoute,
  pajakRoute,
  investasiRoute,
  valuasiRoute,
  komoditas100Route,
  commodityDashboardRoute,
  incotermsRoute,
  waterRoute,
  assetMatrixRoute,
  earningMatrixRoute,
  liabilityMatrixRoute,
  expenseMatrixRoute,
  financialHealthMatrixRoute,
  swotMatrixRoute,
  towsMatrixRoute,
  growStageRoute,
  flowStageRoute,
  buildStageRoute,
  legacyStageRoute,
  suretyStageRoute,
  devSocietyRoute,
  improveSocietyRoute,
  relianceSocietyRoute,
  sufficientSocietyRoute,
  interactSocietyRoute,
  interdependenceSocietyRoute,
  interestSocietyRoute,
  intersectSocietyRoute,
  insiderSocietyRoute,
  outwardSocietyRoute,
  klienPageRoute,
  catatanPageRoute,
  lainnyaPageRoute,
  budgetRoute,
  codeRoute,
  contactsRoute,
  coursesRoute,
  designRoute,
  examsRoute,
  flashcardsRoute,
  gamesRoute,
  healthRoute,
  ideasRoute,
  inventoryRoute,
  journalRoute,
  kalkulatorRoute,
  languagesRoute,
  moviesRoute,
  musicRoute,
  passwordsRoute,
  photographyRoute,
  podcastsRoute,
  proyekPersonalRoute,
  readingRoute,
  recipesRoute,
  shoppingRoute,
  subscriptionsRoute,
  tripsRoute,
  weatherRoute,
  workoutsRoute,
  writingRoute,
  bcgRoute,
  pestelRoute,
  porterRoute,
  geMckinseyRoute,
  ansoffRoute,
  blueOceanRoute,
  bmcRoute,
  leanCanvasRoute,
  vpcRoute,
  cjmRoute,
  empathyMapRoute,
  kanoRoute,
  marketingMixRoute,
  plcRoute,
  stpRoute,
  valueChainRoute,
  valueDisciplinesRoute,
  vrioRoute,
  framework100Route,
  catchAllRoute,

]);

// Export router factory
export function getRouter(queryClient?: QueryClient) {
  return createRouter({
    routeTree,
    context: {
      queryClient: queryClient ?? (null as any),
    },
    defaultPreload: "intent",
    scrollRestoration: true,
  });
}

export type AppRouter = ReturnType<typeof getRouter>;

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
  }
}
