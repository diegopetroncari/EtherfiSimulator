"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  children: ReactNode;
}

export function ParamPill({ active, children, ...rest }: Props) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      data-active={active}
      className="v2-pill"
      {...rest}
    >
      {children}
    </button>
  );
}

export function ParamPillGroup({
  legend,
  children,
}: {
  legend: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="sr-only">{legend}</legend>
      <div role="radiogroup" aria-label={legend} className="flex flex-wrap gap-2">
        {children}
      </div>
    </fieldset>
  );
}
