"use client";

import { ParamField, ParamNumber } from "./ParamField";
import { ParamPill, ParamPillGroup } from "./ParamPill";
import { CCY_LABEL, CCY_SYMBOL, fmtBRL } from "@/lib/format";
import type { Currency, SimulatorInputs, Tier } from "@/lib/simulator/types";

interface Props {
  inputs: SimulatorInputs;
  setInputs: (updater: (prev: SimulatorInputs) => SimulatorInputs) => void;
  nominalBrl: number;
  liveBadge: React.ReactNode;
}

const CURRENCIES: Currency[] = ["BRL", "USD", "EUR"];
const TIERS: Tier[] = ["Core", "Luxe", "Pinnacle"];

export function ParamsColumn({ inputs, setInputs, nominalBrl, liveBadge }: Props) {
  const update = <K extends keyof SimulatorInputs>(k: K, v: SimulatorInputs[K]) =>
    setInputs((p) => ({ ...p, [k]: v }));
  const updateRates = (k: "usdBrl" | "eurBrl", v: number) =>
    setInputs((p) => ({ ...p, rates: { ...p.rates, [k]: v } }));
  const updateBr = (k: "iofPct" | "spreadPct", v: number) =>
    setInputs((p) => ({ ...p, brCard: { ...p.brCard, [k]: v } }));

  return (
    <section className="relative">
      <span className="v2-side-num hidden lg:block">§ um · parâmetros</span>
      <h2
        className="v2-display-sans mb-1 text-3xl"
        style={{ color: "var(--ink)", fontWeight: 600 }}
      >
        a transação
      </h2>
      <p
        className="mb-10 text-sm"
        style={{
          fontFamily: "var(--font-instrument-serif)",
          fontStyle: "italic",
          color: "var(--ink-soft)",
        }}
      >
        Defina o que você gastaria na rua.
      </p>

      <div className="space-y-7">
        <ParamField label="moeda da compra" hint={CCY_LABEL[inputs.currency]}>
          <ParamPillGroup legend="Moeda da compra">
            {CURRENCIES.map((c) => (
              <ParamPill key={c} active={inputs.currency === c} onClick={() => update("currency", c)}>
                {c}
              </ParamPill>
            ))}
          </ParamPillGroup>
        </ParamField>

        <ParamField label="valor da compra" hint={inputs.currency} htmlFor="v2-amount">
          <ParamNumber
            id="v2-amount"
            prefix={CCY_SYMBOL[inputs.currency]}
            value={inputs.amount}
            min={0}
            step={50}
            onValueChange={(v) => update("amount", Math.max(0, v))}
          />
          {inputs.currency !== "BRL" ? (
            <div className="v2-mono mt-2 text-[10px] opacity-60">
              ≈ {fmtBRL(nominalBrl)} ao spot
            </div>
          ) : null}
        </ParamField>

        <div className="grid grid-cols-2 gap-5">
          <ParamField label="USD/BRL" hint={liveBadge} htmlFor="v2-usd">
            <ParamNumber
              id="v2-usd"
              value={inputs.rates.usdBrl}
              step={0.01}
              min={0.01}
              onValueChange={(v) => updateRates("usdBrl", v)}
            />
          </ParamField>
          <ParamField label="EUR/BRL" hint={liveBadge} htmlFor="v2-eur">
            <ParamNumber
              id="v2-eur"
              value={inputs.rates.eurBrl}
              step={0.01}
              min={0.01}
              onValueChange={(v) => updateRates("eurBrl", v)}
            />
          </ParamField>
        </div>

        {inputs.currency === "BRL" ? (
          <ParamField label="spread Visa" hint="% sobre spot" htmlFor="v2-spread">
            <ParamNumber
              id="v2-spread"
              value={inputs.visaSpreadPct}
              step={0.1}
              onValueChange={(v) => update("visaSpreadPct", v)}
            />
          </ParamField>
        ) : null}

        <ParamField
          label="tier"
          hint={inputs.currency === "EUR" ? `tabela EUR · ${inputs.tier}` : `Standard · ${inputs.tier}`}
        >
          <ParamPillGroup legend="Tier">
            {TIERS.map((t) => (
              <ParamPill key={t} active={inputs.tier === t} onClick={() => update("tier", t)}>
                {t}
              </ParamPill>
            ))}
          </ParamPillGroup>
        </ParamField>

        <ParamField
          label="spend acumulado no mês"
          hint={inputs.currency === "EUR" ? "EUR" : "USD"}
          htmlFor="v2-month"
        >
          <ParamNumber
            id="v2-month"
            value={inputs.monthlyAccumulated}
            step={100}
            min={0}
            onValueChange={(v) => update("monthlyAccumulated", Math.max(0, v))}
          />
        </ParamField>

        <ParamField label="modo de pagamento">
          <ParamPillGroup legend="Modo">
            <ParamPill active={inputs.mode === "DirectPay"} onClick={() => update("mode", "DirectPay")}>
              Direct Pay
            </ParamPill>
            <ParamPill active={inputs.mode === "Borrow"} onClick={() => update("mode", "Borrow")}>
              Borrow
            </ParamPill>
          </ParamPillGroup>
        </ParamField>

        {inputs.mode === "Borrow" ? (
          <ParamField label="dias até quitar" hint="4% APY" htmlFor="v2-days">
            <ParamNumber
              id="v2-days"
              value={inputs.borrowDays}
              step={1}
              min={0}
              onValueChange={(v) => update("borrowDays", Math.max(0, Math.round(v)))}
            />
          </ParamField>
        ) : null}

        <ParamField label="tipo de operação">
          <ParamPillGroup legend="Operação">
            <ParamPill active={!inputs.isAtm} onClick={() => update("isAtm", false)}>
              Compra
            </ParamPill>
            <ParamPill active={inputs.isAtm} onClick={() => update("isAtm", true)}>
              ATM +2%
            </ParamPill>
          </ParamPillGroup>
        </ParamField>

        <div className="pt-4" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="v2-meta mb-3" style={{ color: "var(--ink-soft)" }}>
            comparativo · cartão BR
          </div>
          <div className="grid grid-cols-2 gap-5">
            <ParamField label="IOF" hint="%" htmlFor="v2-iof">
              <ParamNumber
                id="v2-iof"
                value={inputs.brCard.iofPct}
                step={0.1}
                onValueChange={(v) => updateBr("iofPct", v)}
              />
            </ParamField>
            <ParamField label="spread banco" hint="%" htmlFor="v2-bsp">
              <ParamNumber
                id="v2-bsp"
                value={inputs.brCard.spreadPct}
                step={0.1}
                onValueChange={(v) => updateBr("spreadPct", v)}
              />
            </ParamField>
          </div>
        </div>
      </div>
    </section>
  );
}
