import React from "react";
import { Briefcase } from "lucide-react";

export function ProjectsView() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Organize your work and personal projects.
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">
          New Project
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-card/50 p-8">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Briefcase size={32} className="text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No active projects</h3>
        <p className="text-muted-foreground mt-2 max-w-md text-center">
          Start a new project to get things done.
        </p>
      </div>
    </div>
  );
}
