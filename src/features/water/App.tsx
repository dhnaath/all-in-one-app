import React from "react";
import { Droplet } from "lucide-react";
import { HabitTracker } from "../wira/components/HabitTracker";

export default function WaterApp() {
  return (
    <div className="flex flex-col pb-16">
      {/* Header */}
      <header className="sticky top-0 z-20">
        <div className="border-b border-border bg-background/85 backdrop-blur">
          <div className="max-w-7xl mx-auto py-6 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Kesehatan
              </span>
              <div className="flex items-center gap-3">
                <Droplet className="w-8 h-8 text-blue-500" />
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                  Water Tracker
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto mt-8 space-y-8 max-w-lg">
        <HabitTracker />

        <footer className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
          <div>© 2024 Water Tracker</div>
          <div>Kesehatan & Produktivitas</div>
        </footer>
      </main>
    </div>
  );
}
