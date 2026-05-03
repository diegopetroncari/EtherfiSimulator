"use client";

import { CCY_FMT, fmtBRL, fmtEUR, fmtNum, fmtPct, fmtUSD } from "@/lib/format";
import type { SimulationResult, SimulatorInputs } from "@/lib/simulator/types";

interface Props {
  inputs: SimulatorInputs;
  result: SimulationResult;
}

export function Decomposition({ inputs, result }: Props) {
  const { currency, isAtm, mode, borrowDays, visaSpreadPct } = inputs;
  const fmtCcy = CCY_FMT[currency];
  const visaTaxa =
    result.visaConvertedUsd > 0 ? inputs.amount / result.visaConvertedUsd : 0;

  const steps = ([
    {
      n: 1,
      label: "Compra registrada pelo merchant",
      value: fmtCcy(inputs.amount),
      sub: `o estabelecimento recebe esse valor em ${currency}`,
    },
    currency === "BRL"
      ? {
          n: 2,
          label: "Visa converte BRL → USD",
          value: fmtUSD(result.visaConvertedUsd),
          sub: `taxa Visa ${fmtNum(visaTaxa, 4)} · spread ${visaSpreadPct}% sobre spot`,
        }
      : currency === "USD"
        ? {
            n: 2,
            label: "Cartão é USD-denominado",
            value: fmtUSD(result.visaConvertedUsd),
            sub: "0% FX, 0% spread Visa",
          }
        : {
            n: 2,
            label: "Visa converte EUR → USD",
            value: fmtUSD(result.visaConvertedUsd),
            sub: `EUR/USD ${fmtNum(result.eurUsd, 4)} · sem markup`,
          },
    {
      n: 3,
      label: `ether.fi FX fee · ${(result.fxFeeRate * 100).toFixed(0)}%`,
      value: result.fxFeeRate === 0 ? fmtUSD(0) : `+ ${fmtUSD(result.fxFeeUsd)}`,
      sub:
        currency === "BRL"
          ? "1% sobre o USD pós-Visa"
          : currency === "USD"
            ? "isento · transação na moeda do cartão"
            : "EUR é isento de FX markup (beta)",
      tone: result.fxFeeRate > 0 ? "negative" : "neutral",
    },
    isAtm
      ? {
          n: 4,
          label: "ATM fee · 2%",
          value: `+ ${fmtUSD(result.atmFeeUsd)}`,
          sub: "limite 250 USD · 3 tentativas / 24h",
          tone: "negative",
        }
      : null,
    mode === "Borrow"
      ? {
          n: isAtm ? 5 : 4,
          label: "Juros Borrow · 4% APY contínuo",
          value: `+ ${fmtUSD(result.borrowInterestUsd)}`,
          sub: `${borrowDays} dias · começa no instante da compra`,
          tone: "negative",
        }
      : null,
    {
      n: "Σ",
      label: "Subtotal debitado do vault",
      value: fmtUSD(result.vaultDebitUsd),
      sub: `equivalente a ${fmtBRL(result.grossCostBrl)} ao spot`,
      strong: true,
    },
    {
      n: "✓",
      label: `Cashback · ${isAtm ? "N/A em ATM" : result.cashbackTable}`,
      value: isAtm
        ? fmtUSD(0)
        : `− ${
            currency === "EUR" ? fmtEUR(result.cashbackInTxCcy) : fmtUSD(result.cashbackInTxCcy)
          }`,
      sub: isAtm
        ? "ATM e MCC 6011 não geram cashback"
        : `pago em wETH · efetivo ${fmtPct(result.effectiveCashbackRate, 2)}`,
      tone: isAtm ? "neutral" : "positive",
    },
  ] as Array<Step | null>).filter((s): s is Step => s !== null);

  return (
    <section className="relative">
      <span className="v2-side-num hidden lg:block">§ dois · decomposição</span>
      <h2
        className="v2-display-sans mb-1 text-3xl"
        style={{ color: "var(--ink)", fontWeight: 600 }}
      >
        cadeia de
        <br />
        conversão
      </h2>
      <p
        className="mb-8 text-sm"
        style={{
          fontFamily: "var(--font-instrument-serif)",
          fontStyle: "italic",
          color: "var(--ink-soft)",
        }}
      >
        Cada etapa, um passo da liquidação.
      </p>

      <ol className="space-y-0">
        {steps.map((s, i) => (
          <StepRow key={i} step={s} last={i === steps.length - 1} />
        ))}
      </ol>
    </section>
  );
}

interface Step {
  n: number | string;
  label: string;
  value: string;
  sub: string;
  tone?: "negative" | "positive" | "neutral";
  strong?: boolean;
}

function StepRow({ step, last }: { step: Step; last: boolean }) {
  const valueColor =
    step.tone === "negative"
      ? "var(--tijolo-deep)"
      : step.tone === "positive"
        ? "var(--ochre)"
        : "var(--ink)";
  return (
    <li
      className="grid grid-cols-[2.2rem_1fr_auto] items-baseline gap-4 py-3.5"
      style={{ borderBottom: last ? "0" : "1px solid var(--rule)" }}
    >
      <span
        className="v2-mono text-[11px]"
        style={{
          color: typeof step.n === "string" ? "var(--tijolo)" : "var(--ink-soft)",
          paddingTop: "2px",
        }}
      >
        {step.n}
      </span>
      <div className="flex min-w-0 flex-col">
        <span
          className="text-sm"
          style={{
            fontFamily: "var(--font-bricolage)",
            color: "var(--ink)",
            fontWeight: step.strong ? 600 : 500,
          }}
        >
          {step.label}
        </span>
        <span
          className="mt-0.5 text-[11px]"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            fontStyle: "italic",
            color: "var(--ink-soft)",
          }}
        >
          {step.sub}
        </span>
      </div>
      <span
        className="v2-mono whitespace-nowrap text-base"
        style={{
          color: valueColor,
          fontWeight: step.strong ? 600 : 400,
        }}
      >
        {step.value}
      </span>
    </li>
  );
}
