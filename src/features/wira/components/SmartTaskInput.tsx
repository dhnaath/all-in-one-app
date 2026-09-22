import { useState, FormEvent } from "react";
import { Calendar, Flag, Clock, Plus, CornerDownLeft } from "lucide-react";
import { cn } from "../lib/utils";

export function SmartTaskInput({ onAdd }: { onAdd?: (task: any) => void }) {
  const [text, setText] = useState("");

  const renderHighlighted = (inputText: string) => {
    if (!inputText)
      return (
        <span className="text-muted-foreground">Add task: "Meeting besok jam 2 siang !1"</span>
      );

    const regex =
      /(besok|hari ini|lusa|minggu depan|jam \d+(?:\s?(?:siang|malam|pagi|sore))?|![1-3])/gi;
    const parts = inputText.split(regex);

    return parts.map((part, i) => {
      const lower = part.toLowerCase();
      if (["besok", "hari ini", "lusa", "minggu depan"].includes(lower)) {
        return (
          <span key={i} className="text-primary bg-primary/20 rounded px-1.5 py-0.5 font-medium">
            {part}
          </span>
        );
      }
      if (lower.startsWith("jam ")) {
        return (
          <span key={i} className="text-purple-600 bg-purple-100 rounded px-1.5 py-0.5 font-medium">
            {part}
          </span>
        );
      }
      if (/^![1-3]$/.test(part)) {
        const colors = {
          "!1": "text-rose-600 bg-rose-100",
          "!2": "text-amber-600 bg-amber-100",
          "!3": "text-emerald-600 bg-emerald-100",
        };
        return (
          <span
            key={i}
            className={cn(
              "rounded px-1.5 py-0.5 font-bold",
              colors[part as keyof typeof colors] || "",
            )}
          >
            {part}
          </span>
        );
      }
      return (
        <span key={i} className="text-foreground">
          {part}
        </span>
      );
    });
  };

  const parsed = parseTask(text);

  return (
    <div className="w-full max-w-3xl mb-8 relative">
      <div className="relative font-sans text-base w-full shadow-sm rounded-xl bg-background border border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all flex items-center">
        <div className="pl-4 pr-2 text-muted-foreground">
          <Plus size={20} />
        </div>

        <div className="relative flex-1 h-14 overflow-hidden">
          <div
            className="absolute inset-0 py-4 pointer-events-none whitespace-nowrap overflow-hidden flex items-center"
            aria-hidden="true"
          >
            {renderHighlighted(text)}
          </div>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && text.trim()) {
                onAdd?.(parsed);
                setText("");
              }
            }}
            className="w-full h-full py-4 bg-transparent text-transparent caret-foreground outline-none whitespace-nowrap"
            spellCheck={false}
            autoFocus
          />
        </div>

        <div className="pr-4 pl-2 flex items-center">
          <button
            onClick={() => {
              if (text.trim()) {
                onAdd?.(parsed);
                setText("");
              }
            }}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              text.trim()
                ? "bg-primary/100 text-white hover:bg-primary/90"
                : "bg-secondary text-muted-foreground",
            )}
          >
            <CornerDownLeft size={16} />
          </button>
        </div>
      </div>

      {/* Parsed Output Display (for demo purposes) */}
      {text.trim() && (
        <div className="absolute top-full left-0 mt-2 bg-background border border-border shadow-lg rounded-lg p-3 flex flex-wrap gap-2 text-sm animate-in fade-in slide-in-from-top-2 z-10">
          <div className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded text-foreground font-medium">
            <span className="truncate max-w-[200px]">{parsed.title || "Untitled Task"}</span>
          </div>
          {parsed.date && (
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-1 rounded capitalize">
              <Calendar size={14} /> {parsed.date}
            </div>
          )}
          {parsed.time && (
            <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2 py-1 rounded capitalize">
              <Clock size={14} /> {parsed.time}
            </div>
          )}
          {parsed.priority !== "Normal" && (
            <div
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded",
                parsed.priority === "High"
                  ? "bg-rose-50 text-rose-700"
                  : parsed.priority === "Medium"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-emerald-50 text-emerald-700",
              )}
            >
              <Flag size={14} /> {parsed.priority}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function parseTask(input: string) {
  let title = input;
  let date = null;
  let time = null;
  let priority = "Normal";

  const dateMatch = input.match(/\b(besok|hari ini|lusa|minggu depan)\b/i);
  if (dateMatch) {
    date = dateMatch[1];
    title = title.replace(dateMatch[0], "");
  }

  const timeMatch = input.match(/\b(jam \d+(?:\s?(?:siang|malam|pagi|sore))?)\b/i);
  if (timeMatch) {
    time = timeMatch[1];
    title = title.replace(timeMatch[0], "");
  }

  const priorityMatch = input.match(/!([1-3])/);
  if (priorityMatch) {
    if (priorityMatch[1] === "1") priority = "High";
    if (priorityMatch[1] === "2") priority = "Medium";
    if (priorityMatch[1] === "3") priority = "Low";
    title = title.replace(priorityMatch[0], "");
  }

  return {
    title: title.replace(/\s+/g, " ").trim(),
    date,
    time,
    priority,
  };
}
