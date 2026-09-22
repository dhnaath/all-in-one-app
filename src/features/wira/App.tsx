import { useState } from "react";
import { ZohoSoloLayout } from "./components/ZohoSoloLayout";
import { BottomSheet } from "./components/BottomSheet";
import { AddNewGrid } from "./components/AddNewGrid";
import { NotionLayout } from "./components/NotionLayout";
import { NotesView } from "./components/views/NotesView";
import { ContactsView } from "./components/views/ContactsView";
import { IncomeView } from "./components/views/IncomeView";
import { ExpensesView } from "./components/views/ExpensesView";
import { HabitsView } from "./components/views/HabitsView";
import { GoalsView } from "./components/views/GoalsView";
import { JournalView } from "./components/views/JournalView";
import { BookmarksView } from "./components/views/BookmarksView";
import { IdeasView } from "./components/views/IdeasView";
import { PasswordsView } from "./components/views/PasswordsView";
import { WorkoutsView } from "./components/views/WorkoutsView";
import { RecipesView } from "./components/views/RecipesView";
import { ProjectsView } from "./components/views/ProjectsView";
import { MusicView } from "./components/views/MusicView";
import { WeatherView } from "./components/views/WeatherView";
import { BudgetView } from "./components/views/BudgetView";
import { ReadingListView } from "./components/views/ReadingListView";
import { TripsView } from "./components/views/TripsView";
import { ShoppingListView } from "./components/views/ShoppingListView";
import { HealthView } from "./components/views/HealthView";
import { InventoryView } from "./components/views/InventoryView";
import { SubscriptionsView } from "./components/views/SubscriptionsView";
import { CoursesView } from "./components/views/CoursesView";
import { FlashcardsView } from "./components/views/FlashcardsView";
import { ExamsView } from "./components/views/ExamsView";
import { LanguagesView } from "./components/views/LanguagesView";
import { MoviesView } from "./components/views/MoviesView";
import { GamesView } from "./components/views/GamesView";
import { PodcastsView } from "./components/views/PodcastsView";
import { EventsView } from "./components/views/EventsView";
import { DesignView } from "./components/views/DesignView";
import { PhotographyView } from "./components/views/PhotographyView";
import { WritingView } from "./components/views/WritingView";
import { CodeView } from "./components/views/CodeView";

export default function WiraApp() {
  const [currentApp, setCurrentApp] = useState<string>("goals");
  const [notionSubView, setNotionSubView] = useState("notes");
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const handleQuickAction = (id: string) => {
    setIsAddMenuOpen(false);
    if (id === "habit") {
      setCurrentApp("habits");
    } else if (id === "goal") {
      setCurrentApp("goals");
    } else if (id === "journal") {
      setCurrentApp("journal");
    } else if (id === "bookmark") {
      setCurrentApp("bookmarks");
    } else if (id === "idea") {
      setCurrentApp("ideas");
    } else if (id === "password") {
      setCurrentApp("passwords");
    } else if (id === "workout") {
      setCurrentApp("workouts");
    } else if (id === "recipe") {
      setCurrentApp("recipes");
    } else if (id === "project") {
      setCurrentApp("projects");
    } else if (id === "music") {
      setCurrentApp("music");
    } else if (id === "weather") {
      setCurrentApp("weather");
    } else if (id === "budget") {
      setCurrentApp("budget");
    } else if (id === "reading") {
      setCurrentApp("reading");
    } else if (id === "trip") {
      setCurrentApp("trips");
    } else if (id === "shopping") {
      setCurrentApp("shopping");
    } else if (id === "health") {
      setCurrentApp("health");
    } else if (id === "inventory") {
      setCurrentApp("inventory");
    } else if (id === "subscription") {
      setCurrentApp("subscriptions");
    } else if (id === "course") {
      setCurrentApp("courses");
    } else if (id === "flashcard") {
      setCurrentApp("flashcards");
    } else if (id === "exam") {
      setCurrentApp("exams");
    } else if (id === "language") {
      setCurrentApp("languages");
    } else if (id === "movie") {
      setCurrentApp("movies");
    } else if (id === "game") {
      setCurrentApp("games");
    } else if (id === "podcast") {
      setCurrentApp("podcasts");
    } else if (id === "event") {
      setCurrentApp("events");
    } else if (id === "design") {
      setCurrentApp("design");
    } else if (id === "photography") {
      setCurrentApp("photography");
    } else if (id === "writing") {
      setCurrentApp("writing");
    } else if (id === "code") {
      setCurrentApp("code");
    }
  };

  const renderApp = () => {
    switch (currentApp) {
      case "goals":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <GoalsView />
          </div>
        );
      case "habits":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <HabitsView />
          </div>
        );
      case "recipes":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <RecipesView />
          </div>
        );
      case "music":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <MusicView />
          </div>
        );
      case "weather":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <WeatherView />
          </div>
        );
      case "reading":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <ReadingListView />
          </div>
        );
      case "trips":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <TripsView />
          </div>
        );
      case "shopping":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <ShoppingListView />
          </div>
        );
      case "health":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <HealthView />
          </div>
        );
      case "inventory":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <InventoryView />
          </div>
        );
      case "subscriptions":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <SubscriptionsView />
          </div>
        );
      case "courses":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <CoursesView />
          </div>
        );
      case "flashcards":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <FlashcardsView />
          </div>
        );
      case "exams":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <ExamsView />
          </div>
        );
      case "languages":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <LanguagesView />
          </div>
        );
      case "movies":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <MoviesView />
          </div>
        );
      case "games":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <GamesView />
          </div>
        );
      case "podcasts":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <PodcastsView />
          </div>
        );
      case "events":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <EventsView />
          </div>
        );
      case "design":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <DesignView />
          </div>
        );
      case "photography":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <PhotographyView />
          </div>
        );
      case "writing":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <WritingView />
          </div>
        );
      case "code":
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <CodeView />
          </div>
        );
      case "notes":
        return (
          <NotionLayout activeId={notionSubView} onNavigate={setNotionSubView}>
            {notionSubView.startsWith("notes") ? <NotesView /> : null}
            {notionSubView.startsWith("docs") ? (
              <div className="text-muted-foreground/70 text-center mt-10">
                Documentation view coming soon
              </div>
            ) : null}
          </NotionLayout>
        );
      case "contacts":
        return (
          <div className="h-full w-full overflow-y-auto bg-muted/50">
            <ContactsView />
          </div>
        );
      case "finances":
        return (
          <div className="h-full w-full overflow-y-auto bg-muted/50 p-6 md:p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8 max-w-7xl mx-auto">Finances</h1>
            <div className="max-w-7xl mx-auto space-y-8">
              <IncomeView />
              <ExpensesView />
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full w-full bg-muted/50 overflow-y-auto">
            <GoalsView />
          </div>
        );
    }
  };

  return (
    <>
      <ZohoSoloLayout
        activeApp={currentApp}
        onNavigate={setCurrentApp}
        onQuickAdd={() => setIsAddMenuOpen(true)}
      >
        {renderApp()}
      </ZohoSoloLayout>

      <BottomSheet
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        title="What would you like to add?"
      >
        <AddNewGrid onActionClick={handleQuickAction} />
      </BottomSheet>
    </>
  );
}
