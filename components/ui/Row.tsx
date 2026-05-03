import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface RowProps {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  accent?: "positive" | "negative";
}

export function Row({ label, value, sub, accent }: RowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-stone-800/70 py-2.5">
      <div className="flex min-w-0 flex-col">
        <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-stone-300">
          {label}
        </span>
        {sub ? (
          <span className="mt-0.5 font-mono text-[10px] text-stone-400">{sub}</span>
        ) : null}
      </div>
      <span
        className={cn(
          "whitespace-nowrap font-mono text-base",
          accent === "positive" && "text-emerald-400",
          accent === "negative" && "text-rose-400",
          !accent && "text-stone-100",
        )}
      >
        {value}
      </span>
    </div>
  );
}
