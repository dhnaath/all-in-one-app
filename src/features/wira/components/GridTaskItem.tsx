import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Calendar, Flag, AlignLeft, GripVertical } from "lucide-react";
import { cn } from "../lib/utils";

interface Task {
  id: number;
  title: string;
  priority: string;
  date: string;
  group: string;
  completed: boolean;
  description?: string;
}

interface GridTaskItemProps {
  task: Task;
  selected: boolean;
  onClick: () => void;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export function GridTaskItem({ task, selected, onClick, onComplete }: GridTaskItemProps) {
  const [isChecked, setIsChecked] = useState(task.completed);

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isChecked) return;
    setIsChecked(true);
    setTimeout(() => {
      onComplete(task.id);
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selected) return;
      if (e.key === "e" || e.key === "E") {
        onClick();
      } else if (e.key === "d" || e.key === "D") {
        if (!isChecked) {
          setIsChecked(true);
          setTimeout(() => {
            onComplete(task.id);
          }, 500);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, task.id, isChecked, onComplete, onClick]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col p-4 rounded-xl cursor-pointer transition-all border outline-none overflow-hidden bg-card hover:shadow-sm",
        selected
          ? "border-primary ring-1 ring-primary"
          : "border-border hover:border-foreground/20",
        isChecked ? "opacity-50" : "opacity-100",
      )}
      tabIndex={0}
    >
      <div className="flex items-start justify-between mb-3">
        <button
          onClick={handleCheck}
          className="shrink-0 relative flex items-center justify-center w-5 h-5 rounded border-2 border-muted-foreground/30 hover:border-primary transition-colors bg-background focus:outline-none"
        >
          <AnimatePresence>
            {isChecked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute inset-0 bg-primary rounded-sm flex items-center justify-center"
              >
                <Check size={14} className="text-primary-foreground" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        <div className="flex items-center gap-2">
          {task.priority !== "none" && (
            <Flag
              size={14}
              className={cn(
                task.priority === "high"
                  ? "text-destructive fill-destructive/20"
                  : task.priority === "medium"
                    ? "text-amber-500 fill-amber-500/20"
                    : "text-primary fill-primary/20",
              )}
            />
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h4
          className={cn(
            "font-medium text-foreground leading-snug mb-1 line-clamp-2",
            isChecked && "line-through text-muted-foreground",
          )}
        >
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2 flex items-center gap-1">
            <AlignLeft size={12} />
            Has description
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs font-medium">
        <div className="flex items-center text-muted-foreground">
          <Calendar size={12} className="mr-1" />
          {task.date}
        </div>
      </div>

      {/* Drag handle area on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-1 text-muted-foreground hover:text-foreground rounded bg-background">
          <GripVertical size={14} />
        </div>
      </div>
    </motion.div>
  );
}
