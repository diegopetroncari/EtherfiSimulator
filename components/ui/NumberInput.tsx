"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  value: number;
  onValueChange: (value: number) => void;
  prefix?: string;
  invalid?: boolean;
}

export function NumberInput({
  value,
  onValueChange,
  prefix,
  invalid,
  className,
  step,
  min,
  ...rest
}: NumberInputProps) {
  return (
    <div className="flex items-baseline gap-3">
      {prefix ? (
        <span aria-hidden className="font-mono text-lg text-stone-400">
          {prefix}
        </span>
      ) : null}
      <input
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          onValueChange(Number.isFinite(n) ? n : 0);
        }}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full border-b bg-transparent py-1.5 font-mono text-lg text-stone-100 transition-colors focus:outline-none",
          invalid
            ? "border-rose-700 focus:border-rose-500"
            : "border-stone-700 hover:border-amber-700/60 focus:border-amber-600",
          className,
        )}
        {...rest}
      />
    </div>
  );
}
