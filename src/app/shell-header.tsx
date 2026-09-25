import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type ShellHeaderCtxValue = {
  setHasAppHeader: (has: boolean) => void;
};

const ShellHeaderCtx = createContext<ShellHeaderCtxValue | null>(null);

export const ShellHeaderProvider = ShellHeaderCtx.Provider;

/**
 * ShellHeader — Portals interactive actions, view switchers, tabs, and toolbars
 * directly into the main application header (in AppShell), completely removing
 * any duplicate headers or toolbars from the app body.
 */
export function ShellHeader({ children }: { children: ReactNode }) {
  const ctx = useContext(ShellHeaderCtx);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    ctx?.setHasAppHeader(true);

    const checkTarget = () => {
      const target = document.getElementById("app-header-actions-portal");
      if (target) {
        setPortalTarget(target);
      }
    };

    checkTarget();
    const timer = setTimeout(checkTarget, 50);

    return () => {
      clearTimeout(timer);
      ctx?.setHasAppHeader(false);
    };
  }, [ctx]);

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 shell-header-portal-actions">
      {children}
    </div>,
    portalTarget
  );
}
