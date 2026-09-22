import { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  fullScreen?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  fullScreen = false,
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black z-40 cursor-pointer"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-[#F7F8FC] z-50 rounded-t-3xl shadow-2xl flex flex-col",
              fullScreen ? "h-[90%]" : "max-h-[90%] pb-8",
            )}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
              <h2 className="text-xl font-bold text-foreground mx-auto">{title}</h2>
              <button
                onClick={onClose}
                className="absolute right-6 w-8 h-8 flex items-center justify-center bg-accent hover:bg-gray-300 rounded-full text-muted-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto px-6 pb-6 scrollbar-hide">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
