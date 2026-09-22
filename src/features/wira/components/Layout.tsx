import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30 flex justify-center font-sans">
      <div
        className={cn(
          "w-full w-full max-w-6xl mx-auto bg-card min-h-screen border-x border-border shadow-sm relative overflow-hidden flex flex-col",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
