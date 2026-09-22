import {
  Users,
  CheckSquare,
  TrendingUp,
  Receipt,
  FileEdit,
  FolderOpen,
  Package,
  CalendarDays,
} from "lucide-react";
import { cn } from "../lib/utils";

const TOOLS = [
  {
    id: "contacts",
    label: "Contacts",
    icon: Users,
    bgClass: "bg-gradient-to-br from-blue-50 to-cyan-100",
    iconColor: "text-blue-500",
    decoration: "absolute -right-4 -bottom-4 w-24 h-24 bg-blue-400/10 rounded-full blur-xl",
  },
  {
    id: "income",
    label: "Income",
    icon: TrendingUp,
    bgClass: "bg-gradient-to-br from-emerald-50 to-green-100",
    iconColor: "text-emerald-500",
    decoration: "absolute -right-4 -bottom-4 w-24 h-24 bg-green-400/10 rounded-full blur-xl",
  },
  {
    id: "expenses",
    label: "Expenses",
    icon: Receipt,
    bgClass: "bg-gradient-to-br from-rose-50 to-pink-100",
    iconColor: "text-rose-500",
    decoration: "absolute -right-4 -bottom-4 w-24 h-24 bg-rose-400/10 rounded-full blur-xl",
  },
  {
    id: "notes",
    label: "Notes",
    icon: FileEdit,
    bgClass: "bg-gradient-to-br from-yellow-50 to-amber-100",
    iconColor: "text-yellow-600",
    decoration: "absolute -right-4 -bottom-4 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl",
  },
  {
    id: "files",
    label: "Files",
    icon: FolderOpen,
    bgClass: "bg-gradient-to-br from-indigo-50 to-purple-100",
    iconColor: "text-indigo-500",
    decoration: "absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl",
  },
  {
    id: "items",
    label: "Items",
    icon: Package,
    bgClass: "bg-gradient-to-br from-orange-50 to-orange-100",
    iconColor: "text-orange-700",
    decoration: "absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl",
  },
];

interface ToolsGridProps {
  onToolClick: (id: string) => void;
}

export function ToolsGrid({ onToolClick }: ToolsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 pb-8">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolClick(tool.id)}
          className={cn(
            "relative flex flex-col items-start justify-between p-5 h-44 rounded-3xl overflow-hidden text-left group transition-transform active:scale-95 shadow-sm border border-white/50",
            tool.bgClass,
          )}
        >
          <div className={tool.decoration} />

          <div className="relative z-10 w-12 h-12 bg-card/60 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm">
            <tool.icon className={cn("w-6 h-6", tool.iconColor)} />
          </div>

          <span className="relative z-10 text-lg font-bold text-foreground tracking-tight mt-auto">
            {tool.label}
          </span>
        </button>
      ))}
    </div>
  );
}
