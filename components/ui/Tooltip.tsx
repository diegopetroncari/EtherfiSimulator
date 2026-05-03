"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children?: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={200}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          {children ?? (
            <button
              type="button"
              aria-label="Mais informação"
              className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-stone-600 text-[9px] text-stone-400 hover:border-amber-600/60 hover:text-amber-300"
            >
              ?
            </button>
          )}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className="z-50 max-w-xs rounded border border-stone-700 bg-stone-900 px-3 py-2 font-serif text-xs text-stone-200 shadow-lg data-[state=delayed-open]:animate-in data-[state=closed]:animate-out"
            side="top"
            sideOffset={6}
          >
            {content}
            <RadixTooltip.Arrow className="fill-stone-700" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
