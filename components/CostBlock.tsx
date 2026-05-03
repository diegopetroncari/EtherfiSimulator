"use client";

import { useId, useState } from "react";
import { fmtBRL, fmtPct, fmtUSD } from "@/lib/format";
import { REFERRAL } from "@/lib/referral";
import type { SimulationResult, SimulatorInputs } from "@/lib/simulator/types";

interface Props {
  inputs: SimulatorInputs;
  result: SimulationResult;
  onCopyLink: () => string;
}

export function CostBlock({ inputs, result, onCopyLink }: Props) {
  const headingId = useId();
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
    <section
      aria-labelledby={headingId}
      aria-live="polite"
      className="relative overflow-hidden p-6 sm:p-10"
      style={{
        background: "var(--concrete-warm)",
        border: "1.5px solid var(--ink)",
        borderTopRightRadius: "24px",
      }}
    >
      {/* Header espelhado ao InputBlock · marker 02 · titulo · meta à direita */}
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span
            className="v2-mono text-xs"
            style={{ color: "var(--tijolo)", letterSpacing: "0.2em" }}
          >
            02
          </span>
          <h2
            id={headingId}
            className="v2-display-sans text-2xl sm:text-3xl"
            style={{ color: "var(--ink)", fontWeight: 600 }}
          >
            o custo efetivo
          </h2>
        </div>
        <div className="flex items-baseline gap-4">
          <span className="v2-meta" style={{ color: "var(--ink-soft)" }}>
            em BRL · após cashback
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="v2-meta hover:underline"
            style={{ color: "var(--tijolo)" }}
          >
            {copied ? "✓ copiado" : "copiar link →"}
          </button>
        </div>
      </div>

      {/* Número herói · mesmo lugar visual que o input gigante do bloco 01 */}
      <div className="mt-8 grid items-end gap-8 lg:grid-cols-[auto_1fr]">
        <div
          className="v2-display leading-[0.9]"
          style={{
            color: "var(--tijolo)",
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            letterSpacing: "-0.02em",
            borderBottom: "2px solid var(--ink)",
            paddingBottom: "8px",
          }}
        >
          {fmtBRL(result.netCostBrl)}
        </div>

        <div
          className="v2-meta flex items-baseline gap-3 pb-3"
          style={{ color: "var(--ink-soft)" }}
        >
          <span style={{ background: "var(--tijolo)", width: "16px", height: "1.5px" }} />
          a partir de{" "}
          <span className="v2-mono" style={{ color: "var(--ink)" }}>
            {inputs.currency} {inputs.amount.toLocaleString("pt-BR")}
          </span>{" "}
          em compras
        </div>
      </div>

      {/* Stats · mesma grade triplicada do InputBlock-style */}
      <div className="mt-6 grid grid-cols-3 gap-x-6 gap-y-2 sm:max-w-md">
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

      {/* CTA referral · alinhado com a borda direita */}
      <div
        className="mt-8 flex flex-wrap items-center justify-end gap-4 pt-4"
        style={{ borderTop: "1px solid var(--rule)" }}
      >
        <a
          href={REFERRAL.url}
          target="_blank"
          rel="noopener noreferrer"
          className="v2-mono inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all hover:gap-3"
          style={{
            background: "var(--ink)",
            color: "var(--concrete)",
            borderRadius: "0 16px 0 0",
          }}
          aria-label="Abrir conta ether.fi com link de referral"
        >
          abrir conta com bônus Luxe
          <span aria-hidden style={{ color: "var(--ochre)" }}>
            →
          </span>
        </a>
      </div>
    </section>
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
