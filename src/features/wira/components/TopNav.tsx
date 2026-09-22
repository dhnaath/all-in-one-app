import { User, Users, Smile, Banknote, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";

interface TopNavProps {
  onOpenTools: () => void;
}

export function TopNav({ onOpenTools }: TopNavProps) {
  return (
    <div className="px-6 pt-12 pb-4">
      <div className="flex items-center justify-between mb-8">
        <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
          <User size={20} />
        </button>

        <div className="flex bg-muted rounded-full p-1 border border-border/50">
          <button className="w-12 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Users size={18} />
          </button>
          <button className="w-12 h-8 rounded-full bg-card shadow-sm flex items-center justify-center text-foreground">
            <Smile size={18} />
          </button>
          <button className="w-12 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Banknote size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Today</h1>
          <p className="text-muted-foreground font-medium mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        <button
          onClick={onOpenTools}
          className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-card-foreground hover:bg-accent transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
