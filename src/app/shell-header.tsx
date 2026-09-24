import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/**
 * ShellHeader — lets any feature app render its OWN header (icon, title, badge,
 * action buttons) into the global top header band of AppShell
 * (slot: #shellHeaderSlot).
 *
 * Usage inside a feature app:
 *   <ShellHeader>
 *     ...app-specific header content...
 *   </ShellHeader>
 *
 * Apps that do not register a header get a shell-generated contextual header
 * (icon + title + subtitle + category), so every app menu has its own header.
 */
type ShellHeaderCtxValue = {
  setHasAppHeader: (has: boolean) => void;
};

const ShellHeaderCtx = createContext<ShellHeaderCtxValue | null>(null);

export const ShellHeaderProvider = ShellHeaderCtx.Provider;

export function ShellHeader({ children }: { children: ReactNode }) {
  const ctx = useContext(ShellHeaderCtx);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSlot(document.getElementById("shellHeaderSlot"));
    ctx?.setHasAppHeader(true);
    return () => {
      ctx?.setHasAppHeader(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!slot) return null;
  return createPortal(
    <div className="flex w-full flex-col">{children}</div>,
    slot,
  );
}
