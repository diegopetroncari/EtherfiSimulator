"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

interface FieldProps {
  label: string;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
}

export function ParamField({ label, hint, htmlFor, children }: FieldProps) {
  return (
    <div className="block">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="v2-meta">
          {label}
        </label>
        {hint ? <span className="v2-mono text-[10px] opacity-70">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

interface NumProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  value: number;
  onValueChange: (n: number) => void;
  prefix?: string;
}

export function ParamNumber({ value, onValueChange, prefix, ...rest }: NumProps) {
  return (
    <div className="flex items-baseline gap-3">
      {prefix ? (
        <span aria-hidden className="v2-mono text-base opacity-60">
          {prefix}
        </span>
      ) : null}
      <input
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          onValueChange(Number.isFinite(n) ? n : 0);
        }}
        className="v2-input"
        {...rest}
      />
    </div>
  );
}
