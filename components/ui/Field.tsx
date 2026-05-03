import type { ReactNode } from "react";
import { Tooltip } from "./Tooltip";

interface FieldProps {
  label: string;
  hint?: ReactNode;
  tooltip?: string;
  htmlFor?: string;
  error?: string | null;
  children: ReactNode;
}

export function Field({ label, hint, tooltip, htmlFor, error, children }: FieldProps) {
  return (
    <div className="block">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.18em] text-stone-300"
        >
          {label}
          {tooltip ? <Tooltip content={tooltip} /> : null}
        </label>
        {hint ? (
          <span className="font-mono text-[10px] text-stone-400">{hint}</span>
        ) : null}
      </div>
      {children}
      {error ? (
        <div
          role="alert"
          className="mt-1 font-mono text-[10px] text-rose-400"
          id={htmlFor ? `${htmlFor}-error` : undefined}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}
