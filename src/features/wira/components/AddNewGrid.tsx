import {
  User,
  CheckSquare,
  Banknote,
  Receipt,
  Calendar,
  Clock,
  Edit3,
  FileText,
  Package,
  Activity,
  Target,
  BookOpen,
  Bookmark,
  Lightbulb,
  Key,
  Dumbbell,
  Utensils,
  Briefcase,
  Music,
  CloudSun,
  Wallet,
  Book,
  Plane,
  ShoppingCart,
  Heart,
  Archive,
  CreditCard,
  GraduationCap,
  Layers,
  FileCheck,
  Globe,
  Film,
  Gamepad2,
  Podcast,
  Ticket,
  PenTool,
  Camera,
  Type,
  Code,
} from "lucide-react";
import { cn } from "../lib/utils";

const CATEGORIES = [
  {
    id: "productivity",
    label: "Productivity",
    items: [
      { id: "project", label: "Project", icon: Briefcase, color: "text-indigo-500" },
      { id: "note", label: "Note", icon: Edit3, color: "text-yellow-500" },
      { id: "file", label: "File", icon: FileText, color: "text-purple-500" },
      { id: "timer", label: "Timer", icon: Clock, color: "text-green-500" },
      { id: "goal", label: "Goal", icon: Target, color: "text-indigo-400" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      { id: "invoice", label: "Invoice", icon: Banknote, color: "text-green-500" },
      { id: "expense", label: "Expense", icon: Receipt, color: "text-red-400" },
      { id: "budget", label: "Budget", icon: Wallet, color: "text-emerald-600" },
      { id: "subscription", label: "Subscription", icon: CreditCard, color: "text-blue-600" },
    ],
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    items: [
      { id: "journal", label: "Journal", icon: BookOpen, color: "text-teal-400" },
      { id: "bookmark", label: "Bookmark", icon: Bookmark, color: "text-sky-400" },
      { id: "idea", label: "Idea", icon: Lightbulb, color: "text-yellow-400" },
      { id: "reading", label: "Reading", icon: Book, color: "text-amber-600" },
      { id: "music", label: "Music", icon: Music, color: "text-pink-500" },
      { id: "trip", label: "Trip", icon: Plane, color: "text-sky-500" },
      { id: "weather", label: "Weather", icon: CloudSun, color: "text-blue-400" },
      { id: "password", label: "Password", icon: Key, color: "text-card-foreground" },
    ],
  },
  {
    id: "health",
    label: "Health",
    items: [
      { id: "habit", label: "Habit", icon: Activity, color: "text-rose-400" },
      { id: "workout", label: "Workout", icon: Dumbbell, color: "text-emerald-500" },
      { id: "recipe", label: "Recipe", icon: Utensils, color: "text-orange-500" },
      { id: "health", label: "Health", icon: Heart, color: "text-rose-500" },
    ],
  },
  {
    id: "education",
    label: "Education",
    items: [
      { id: "course", label: "Course", icon: GraduationCap, color: "text-blue-500" },
      { id: "flashcard", label: "Flashcard", icon: Layers, color: "text-yellow-500" },
      { id: "exam", label: "Exam", icon: FileCheck, color: "text-red-500" },
      { id: "language", label: "Language", icon: Globe, color: "text-green-500" },
    ],
  },
  {
    id: "management",
    label: "Management",
    items: [
      { id: "shopping", label: "Shopping", icon: ShoppingCart, color: "text-amber-500" },
      { id: "contact", label: "Contact", icon: User, color: "text-blue-500" },
      { id: "item", label: "Item", icon: Package, color: "text-amber-700" },
      { id: "inventory", label: "Inventory", icon: Archive, color: "text-muted-foreground" },
    ],
  },
  {
    id: "entertainment",
    label: "Entertainment",
    items: [
      { id: "movie", label: "Movie", icon: Film, color: "text-purple-600" },
      { id: "game", label: "Game", icon: Gamepad2, color: "text-indigo-500" },
      { id: "podcast", label: "Podcast", icon: Podcast, color: "text-orange-600" },
      { id: "event", label: "Event", icon: Ticket, color: "text-pink-500" },
    ],
  },
  {
    id: "creative",
    label: "Creative",
    items: [
      { id: "design", label: "Design", icon: PenTool, color: "text-pink-400" },
      { id: "photography", label: "Photography", icon: Camera, color: "text-cyan-500" },
      { id: "writing", label: "Writing", icon: Type, color: "text-card-foreground" },
      { id: "code", label: "Code", icon: Code, color: "text-sky-500" },
    ],
  },
];

interface AddNewGridProps {
  onActionClick: (id: string) => void;
}

export function AddNewGrid({ onActionClick }: AddNewGridProps) {
  return (
    <div className="w-full flex flex-col h-full overflow-y-auto scrollbar-hide py-4 px-0 gap-6 pb-20">
      {CATEGORIES.map((category) => (
        <div key={category.id} className="w-full">
          <h3 className="px-5 text-sm font-semibold text-foreground mb-4">{category.label}</h3>
          <div className="grid grid-cols-4 gap-y-6 gap-x-4 px-4 w-full place-items-center">
            {category.items.map((action) => (
              <button
                key={action.id}
                onClick={() => onActionClick(action.id)}
                className="flex flex-col items-center justify-start gap-2 sm:gap-3 group w-full"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-card shadow-sm flex items-center justify-center border border-border group-active:scale-95 transition-transform">
                  <action.icon className={cn("w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5]", action.color)} />
                </div>
                <span className="text-[11px] sm:text-[13px] font-medium text-card-foreground text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
