"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  children: ReactNode;
}

export function Pill({ active, children, className, ...rest }: PillProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      className={cn(
        "border px-3 py-1.5 font-sans text-[11px] uppercase tracking-[0.15em] transition-all",
        "focus-visible:ring-2 focus-visible:ring-amber-600/60 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950",
        active
          ? "border-amber-600/60 bg-amber-700/15 text-amber-200"
          : "border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

interface PillGroupProps {
  legend: string;
  children: ReactNode;
  className?: string;
}

export function PillGroup({ legend, children, className }: PillGroupProps) {
  return (
    <fieldset className={cn("border-0 p-0", className)}>
      <legend className="sr-only">{legend}</legend>
      <div role="radiogroup" aria-label={legend} className="flex flex-wrap gap-2">
        {children}
      </div>
    </fieldset>
  );
}
