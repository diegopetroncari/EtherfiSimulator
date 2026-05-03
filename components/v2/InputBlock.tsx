"use client";

import { useId } from "react";
import { ParamPill, ParamPillGroup } from "./ParamPill";
import { CCY_LABEL, CCY_SYMBOL, fmtBRL } from "@/lib/format";
import type { Currency, SimulatorInputs } from "@/lib/simulator/types";

interface Props {
  inputs: SimulatorInputs;
  setInputs: (updater: (prev: SimulatorInputs) => SimulatorInputs) => void;
  nominalBrl: number;
}

const CURRENCIES: Currency[] = ["BRL", "USD", "EUR"];

export function InputBlock({ inputs, setInputs, nominalBrl }: Props) {
  const inputId = useId();
  const update = <K extends keyof SimulatorInputs>(k: K, v: SimulatorInputs[K]) =>
    setInputs((p) => ({ ...p, [k]: v }));

  return (
    <section
      aria-labelledby={`${inputId}-heading`}
      className="relative overflow-hidden p-6 sm:p-10"
      style={{
        background: "var(--concrete-warm)",
        border: `1.5px solid var(--ink)`,
        borderTopLeftRadius: "24px",
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span
            className="v2-mono text-xs"
            style={{ color: "var(--tijolo)", letterSpacing: "0.2em" }}
          >
            01
          </span>
          <h2
            id={`${inputId}-heading`}
            className="v2-display-sans text-2xl sm:text-3xl"
            style={{ color: "var(--ink)", fontWeight: 600 }}
          >
            quanto você vai gastar?
          </h2>
        </div>
        <span className="v2-meta" style={{ color: "var(--ink-soft)" }}>
          escolha moeda · digite o valor
        </span>
      </div>

      <div className="mt-8 grid items-end gap-8 lg:grid-cols-[auto_1fr]">
        <ParamPillGroup legend="Moeda da compra">
          {CURRENCIES.map((c) => (
            <ParamPill
              key={c}
              active={inputs.currency === c}
              onClick={() => update("currency", c)}
            >
              {c} <span className="ml-2 opacity-60">{CCY_LABEL[c].toLowerCase()}</span>
            </ParamPill>
          ))}
        </ParamPillGroup>

        <label
          htmlFor={inputId}
          className="flex items-baseline gap-4"
          style={{ borderBottom: "2px solid var(--ink)", paddingBottom: "8px" }}
        >
          <span
            aria-hidden
            className="v2-mono text-3xl sm:text-4xl"
            style={{ color: "var(--ink-soft)" }}
          >
            {CCY_SYMBOL[inputs.currency]}
          </span>
          <input
            id={inputId}
            type="number"
            inputMode="decimal"
            value={Number.isFinite(inputs.amount) ? inputs.amount : 0}
            min={0}
            step={50}
            onChange={(e) => {
              const n = parseFloat(e.target.value);
              update("amount", Math.max(0, Number.isFinite(n) ? n : 0));
            }}
            className="v2-mono w-full bg-transparent outline-none"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              color: "var(--ink)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              border: "0",
              padding: 0,
            }}
            aria-label="Valor da compra"
          />
        </label>
      </div>

      {inputs.currency !== "BRL" ? (
        <div
          className="v2-meta mt-4 flex items-center gap-2"
          style={{ color: "var(--ink-soft)" }}
        >
          <span style={{ background: "var(--tijolo)", width: "16px", height: "1.5px" }} />
          equivale a{" "}
          <span className="v2-mono" style={{ color: "var(--ink)" }}>
            {fmtBRL(nominalBrl)}
          </span>{" "}
          ao spot
        </div>
      ) : null}
    </section>
  );
}
