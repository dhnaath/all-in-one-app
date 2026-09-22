import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

interface PageLayoutProps {
  title: string;
  onBack: () => void;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageLayout({ title, onBack, children, action, className }: PageLayoutProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={cn("absolute inset-0 bg-[#F7F8FC] z-40 flex flex-col", className)}
    >
      <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-muted transition-colors text-card-foreground"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </motion.div>
  );
}
