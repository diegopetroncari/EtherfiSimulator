"use client";

import { fmtBRL, fmtPct } from "@/lib/format";
import type { SimulationResult, SimulatorInputs } from "@/lib/simulator/types";

interface Props {
  inputs: SimulatorInputs;
  result: SimulationResult;
}

export function Scenarios({ inputs, result }: Props) {
  const { currency } = inputs;
  const helper =
    currency === "BRL"
      ? "Para compras domésticas em BRL, o cartão BR doméstico ainda é o mais barato no nominal. O ether.fi devolve em wETH parte do custo de FX. Em moeda estrangeira, a equação inverte."
      : currency === "USD"
        ? "Compras em USD são o cenário ideal do ether.fi: zero FX, cashback Standard cheio. O cartão BR tradicional perde IOF e spread sobre toda a transação."
        : "Compras em EUR têm o benefício 0% FX (beta). Cashback usa tabela EUR, mais conservadora a partir do segundo escalão. Vantagem clara contra cartão BR para sua viagem a Lisboa.";

  const cards = [
    {
      key: "etherfi",
      title: `ether.fi Cash · ${inputs.tier} · ${inputs.mode === "Borrow" ? "Borrow" : "Direct Pay"}`,
      value: result.netCostBrl,
      pct: result.overheadNet,
      bg: "var(--tijolo)",
      fg: "var(--concrete)",
      featured: true,
    },
    ...(currency === "BRL"
      ? [
          {
            key: "domestic",
            title: "Cartão BR · doméstico em BRL",
            value: result.nominalBrl,
            pct: 0,
            bg: "var(--concrete-warm)",
            fg: "var(--ink)",
            featured: false,
          },
        ]
      : []),
    {
      key: "intl",
      title: `Cartão BR · IOF ${inputs.brCard.iofPct}% + spread ${inputs.brCard.spreadPct}%`,
      value: result.brCardTotalBrl,
      pct: result.brCardOverhead,
      bg: "var(--concrete-warm)",
      fg: "var(--ink)",
      featured: false,
    },
  ];

  const min = Math.min(...cards.map((c) => c.value));
  const max = Math.max(...cards.map((c) => c.value));

  return (
    <section className="relative">
      <span className="v2-side-num hidden lg:block">§ três · cenários</span>
      <h2
        className="v2-display-sans mb-1 text-3xl"
        style={{ color: "var(--ink)", fontWeight: 600 }}
      >
        três cartões,
        <br />
        mesma compra
      </h2>
      <p
        className="mb-8 max-w-md text-sm"
        style={{ fontFamily: "var(--font-instrument-serif)", color: "var(--ink-soft)" }}
      >
        {helper}
      </p>

      <div className="space-y-4">
        {cards.map((c) => {
          const widthPct = max > 0 ? Math.max(15, (c.value / max) * 100) : 0;
          const isMin = c.value === min;
          return (
            <div key={c.key} className="relative">
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="v2-meta" style={{ color: "var(--ink-soft)" }}>
                  {c.title}
                  {isMin ? <span style={{ color: "var(--tijolo)" }}> · melhor</span> : null}
                </span>
                <span className="v2-mono text-[10px]" style={{ color: "var(--ink-soft)" }}>
                  {c.pct >= 0 ? "+" : ""}
                  {fmtPct(c.pct, 2)}
                </span>
              </div>
              <div
                className="flex items-baseline justify-between p-4 transition-all"
                style={{
                  background: c.bg,
                  color: c.fg,
                  width: `${widthPct}%`,
                  minWidth: "240px",
                  border: c.featured ? "0" : "1px solid var(--rule)",
                  borderTopRightRadius: c.featured ? "32px" : "0",
                }}
              >
                <span
                  className="v2-display text-3xl sm:text-4xl"
                  style={{ color: c.fg }}
                >
                  {fmtBRL(c.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
