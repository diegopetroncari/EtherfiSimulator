"use client";

import { useState } from "react";
import { fmtBRL, fmtEUR, fmtPct, fmtUSD } from "@/lib/format";
import type { SimulationResult, SimulatorInputs } from "@/lib/simulator/types";

interface Props {
  inputs: SimulatorInputs;
  result: SimulationResult;
  onCopyLink: () => string;
}

export function ScenariosPanel({ inputs, result, onCopyLink }: Props) {
  const { currency, tier, mode } = inputs;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = onCopyLink();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const helperText =
    currency === "BRL"
      ? "Para compras domésticas em BRL, o cartão BR doméstico ainda é o mais barato no nominal. O ether.fi devolve em wETH parte do custo de FX. Em moeda estrangeira, a equação inverte."
      : currency === "USD"
        ? "Compras em USD são o cenário ideal do ether.fi: zero FX, cashback Standard cheio. O cartão BR tradicional perde IOF e spread sobre toda a transação."
        : "Compras em EUR têm o benefício 0% FX (beta). Cashback usa tabela EUR, mais conservadora a partir do segundo escalão. Vantagem clara contra cartão BR para sua viagem a Lisboa.";

  return (
    <div className="border-t border-stone-800/70 pt-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="font-sans text-[10px] uppercase tracking-[0.25em] text-stone-400">
          §3 · Comparativo · três cenários, mesma compra
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone-300 underline-offset-4 hover:text-amber-300 hover:underline"
        >
          {copied ? "✓ link copiado" : "copiar link"}
        </button>
      </div>
      <p className="mb-5 font-serif text-xs leading-relaxed text-stone-300">{helperText}</p>

      <div className="space-y-3">
        <div className="border border-amber-700/40 bg-amber-900/5 p-4">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-amber-600/90">
              ether.fi Cash · {tier} · {mode === "Borrow" ? "Borrow" : "Direct Pay"}
            </div>
            <div className="whitespace-nowrap font-mono text-[10px] text-stone-400">
              {result.overheadNet >= 0 ? "+" : ""}
              {fmtPct(result.overheadNet, 2)}
            </div>
          </div>
          <div className="font-serif text-2xl font-light text-amber-100">
            {fmtBRL(result.netCostBrl)}
          </div>
          <div className="mt-1 font-mono text-[11px] text-stone-400">
            bruto {fmtBRL(result.grossCostBrl)} − cashback{" "}
            {currency === "EUR"
              ? fmtEUR(result.cashbackInTxCcy)
              : fmtUSD(result.cashbackInTxCcy)}{" "}
            em wETH
          </div>
        </div>

        {currency === "BRL" ? (
          <div className="border border-stone-800 bg-stone-900/40 p-4">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone-300">
                Cartão BR · doméstico em BRL
              </div>
              <div className="font-mono text-[10px] text-stone-400">+0,00%</div>
            </div>
            <div className="font-serif text-2xl font-light text-stone-100">
              {fmtBRL(result.nominalBrl)}
            </div>
            <div className="mt-1 font-serif text-[11px] text-stone-400">
              sem FX, sem IOF, sem cashback em cripto
            </div>
          </div>
        ) : null}

        <div className="border border-stone-800 bg-stone-900/40 p-4">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone-300">
              Cartão BR · IOF {inputs.brCard.iofPct}% + spread {inputs.brCard.spreadPct}%
            </div>
            <div className="whitespace-nowrap font-mono text-[10px] text-stone-400">
              +{fmtPct(result.brCardOverhead, 2)}
            </div>
          </div>
          <div className="font-serif text-2xl font-light text-stone-100">
            {fmtBRL(result.brCardTotalBrl)}
          </div>
          <div className="mt-1 font-serif text-[11px] text-stone-400">
            {currency === "BRL"
              ? "cenário internacional · referência para Lisboa, EUA"
              : currency === "USD"
                ? "compra em USD com cartão BR tradicional"
                : "compra em EUR com cartão BR tradicional"}
          </div>
        </div>
      </div>

      <div className="mt-5 border-l-2 border-amber-700/60 bg-amber-900/5 p-4 font-serif">
        <div className="mb-2 font-sans text-[10px] uppercase tracking-[0.2em] text-amber-600/90">
          Diferenças relativas
        </div>
        <div className="space-y-1 text-sm text-stone-200">
          {currency === "BRL" ? (
            <div>
              vs cartão BR doméstico:{" "}
              <span
                className={
                  result.netCostBrl > result.nominalBrl
                    ? "font-mono text-rose-300"
                    : "font-mono text-emerald-300"
                }
              >
                {result.netCostBrl > result.nominalBrl ? "+" : "−"}
                {fmtBRL(Math.abs(result.netCostBrl - result.nominalBrl))}
              </span>
            </div>
          ) : null}
          <div>
            vs cartão BR internacional:{" "}
            <span
              className={
                result.brCardTotalBrl > result.netCostBrl
                  ? "font-mono text-emerald-300"
                  : "font-mono text-rose-300"
              }
            >
              {result.brCardTotalBrl > result.netCostBrl ? "−" : "+"}
              {fmtBRL(Math.abs(result.brCardTotalBrl - result.netCostBrl))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
