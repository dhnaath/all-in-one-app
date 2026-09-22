import { ShieldCheck } from "lucide-react";

export function ProfileSwitch() {
  return (
    <div className="flex max-w-[200px] items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 text-left">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ShieldCheck className="size-4" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-sm font-medium">Dhia Najmi</span>
        <span className="block truncate text-xs text-muted-foreground">
          Konsultan · Tim Praktik
        </span>
      </span>
    </div>
  );
}
