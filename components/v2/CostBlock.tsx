"use client";

import { useState } from "react";
import { fmtBRL, fmtPct, fmtUSD } from "@/lib/format";
import type { SimulationResult, SimulatorInputs } from "@/lib/simulator/types";

interface Props {
  inputs: SimulatorInputs;
  result: SimulationResult;
  onCopyLink: () => string;
}

export function CostBlock({ inputs, result, onCopyLink }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(onCopyLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="v2-card-curved relative overflow-hidden p-8 sm:p-12" aria-live="polite">
      <div className="flex items-start justify-between">
        <div className="v2-meta">
          custo efetivo líquido
          <br />
          em <span style={{ color: "var(--tijolo)" }}>BRL</span> · após cashback
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="v2-meta hover:underline"
          style={{ color: "var(--tijolo)", paddingTop: "2px" }}
        >
          {copied ? "✓ copiado" : "copiar link →"}
        </button>
      </div>

      <div
        className="v2-display mt-6 leading-[0.9]"
        style={{
          color: "var(--tijolo)",
          fontSize: "clamp(4rem, 14vw, 9.5rem)",
        }}
      >
        {fmtBRL(result.netCostBrl)}
      </div>

      <hr className="v2-rule mt-6" style={{ width: "120px" }} />

      <div className="mt-5 grid grid-cols-3 gap-x-6 gap-y-2 sm:max-w-md">
        <Stat
          label="overhead"
          value={`${result.overheadNet >= 0 ? "+" : ""}${fmtPct(result.overheadNet, 2)}`}
        />
        <Stat label="vault" value={fmtUSD(result.netCostUsd)} />
        <Stat
          label="vs cartão BR"
          value={
            result.brCardTotalBrl > result.netCostBrl
              ? `−${fmtBRL(result.brCardTotalBrl - result.netCostBrl)}`
              : `+${fmtBRL(result.netCostBrl - result.brCardTotalBrl)}`
          }
          accent={result.brCardTotalBrl > result.netCostBrl ? "positive" : "negative"}
        />
      </div>

      <div
        className="v2-meta mt-8 flex items-center gap-3"
        style={{ color: "var(--ink-soft)" }}
      >
        <span style={{ background: "var(--ink-soft)", width: "20px", height: "1px" }} />
        compra nominal · {inputs.currency} {inputs.amount.toLocaleString("pt-BR")}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "positive" | "negative";
}) {
  const color =
    accent === "positive"
      ? "var(--ink)"
      : accent === "negative"
        ? "var(--tijolo-deep)"
        : "var(--ink)";
  return (
    <div className="flex flex-col">
      <span className="v2-meta" style={{ color: "var(--ink-soft)" }}>
        {label}
      </span>
      <span className="v2-mono mt-1 text-base" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
