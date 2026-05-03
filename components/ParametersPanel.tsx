"use client";

import { Field } from "./ui/Field";
import { NumberInput } from "./ui/NumberInput";
import { Pill, PillGroup } from "./ui/Pill";
import { fmtBRL } from "@/lib/format";
import { CCY_LABEL, CCY_SYMBOL } from "@/lib/format";
import type { Currency, Mode, SimulatorInputs, Tier } from "@/lib/simulator/types";

interface Props {
  inputs: SimulatorInputs;
  setInputs: (updater: (prev: SimulatorInputs) => SimulatorInputs) => void;
  nominalBrl: number;
  liveBadge: React.ReactNode;
}

const CURRENCIES: Currency[] = ["BRL", "USD", "EUR"];
const TIERS: Tier[] = ["Core", "Luxe", "Pinnacle"];

export function ParametersPanel({ inputs, setInputs, nominalBrl, liveBadge }: Props) {
  const update = <K extends keyof SimulatorInputs>(key: K, value: SimulatorInputs[K]) =>
    setInputs((p) => ({ ...p, [key]: value }));

  const updateRates = (key: "usdBrl" | "eurBrl", value: number) =>
    setInputs((p) => ({ ...p, rates: { ...p.rates, [key]: value } }));

  const updateBrCard = (key: "iofPct" | "spreadPct", value: number) =>
    setInputs((p) => ({ ...p, brCard: { ...p.brCard, [key]: value } }));

  const cashbackHint =
    inputs.currency === "EUR" ? `EUR table · ${inputs.tier}` : `Standard · ${inputs.tier}`;
  const monthlyHint = inputs.currency === "EUR" ? "EUR · acumulado" : "USD · acumulado";

  return (
    <section>
      <div className="mb-8">
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-stone-400">
          §1 · Parâmetros
        </span>
        <h2 className="mt-2 font-serif text-2xl font-normal text-stone-100">
          A transação
        </h2>
      </div>

      <div className="space-y-7">
        <Field label="Moeda da compra" hint={CCY_LABEL[inputs.currency]}>
          <PillGroup legend="Moeda da compra">
            {CURRENCIES.map((c) => (
              <Pill key={c} active={inputs.currency === c} onClick={() => update("currency", c)}>
                {c}
              </Pill>
            ))}
          </PillGroup>
        </Field>

        <Field label="Valor da compra" hint={inputs.currency} htmlFor="amount">
          <NumberInput
            id="amount"
            prefix={CCY_SYMBOL[inputs.currency]}
            value={inputs.amount}
            min={0}
            step={50}
            onValueChange={(v) => update("amount", Math.max(0, v))}
            invalid={inputs.amount < 0}
          />
          {inputs.currency !== "BRL" ? (
            <div className="mt-2 font-mono text-[10px] text-stone-400">
              ≈ {fmtBRL(nominalBrl)} ao spot
            </div>
          ) : null}
        </Field>

        <div className="grid grid-cols-2 gap-5">
          <Field
            label="Cotação USD/BRL"
            hint={liveBadge}
            htmlFor="usdBrl"
            tooltip="Cotação spot. Quando ao vivo, vem da AwesomeAPI cacheada por 1h. Editar passa para modo manual."
          >
            <NumberInput
              id="usdBrl"
              value={inputs.rates.usdBrl}
              step={0.01}
              min={0.01}
              onValueChange={(v) => updateRates("usdBrl", v)}
              invalid={inputs.rates.usdBrl <= 0}
            />
          </Field>
          <Field label="Cotação EUR/BRL" hint={liveBadge} htmlFor="eurBrl">
            <NumberInput
              id="eurBrl"
              value={inputs.rates.eurBrl}
              step={0.01}
              min={0.01}
              onValueChange={(v) => updateRates("eurBrl", v)}
              invalid={inputs.rates.eurBrl <= 0}
            />
          </Field>
        </div>

        {inputs.currency === "BRL" ? (
          <Field
            label="Spread Visa"
            hint="% sobre spot"
            htmlFor="visaSpread"
            tooltip="Markup que a Visa cobra na conversão BRL → USD na liquidação (1–2 dias após a compra). Tipicamente 0,1% a 0,5%."
          >
            <NumberInput
              id="visaSpread"
              value={inputs.visaSpreadPct}
              step={0.1}
              onValueChange={(v) => update("visaSpreadPct", v)}
            />
          </Field>
        ) : null}

        <Field
          label="Tier de membership"
          hint={cashbackHint}
          tooltip="Cashback é progressivo: 3% até o primeiro escalão, 1% no segundo, 0,5% (ou 0,1% em EUR) acima. Tier define os tetos."
        >
          <PillGroup legend="Tier de membership">
            {TIERS.map((t) => (
              <Pill key={t} active={inputs.tier === t} onClick={() => update("tier", t)}>
                {t}
              </Pill>
            ))}
          </PillGroup>
        </Field>

        <Field
          label="Spend acumulado no mês"
          hint={monthlyHint}
          htmlFor="monthlyAcc"
          tooltip="Valor já gasto no mês na moeda do regime (USD para Standard, EUR para EUR). Empurra a transação para faixas mais baixas de cashback."
        >
          <NumberInput
            id="monthlyAcc"
            value={inputs.monthlyAccumulated}
            step={100}
            min={0}
            onValueChange={(v) => update("monthlyAccumulated", Math.max(0, v))}
          />
        </Field>

        <Field
          label="Modo de pagamento"
          hint="vault vs colateral"
          tooltip="Direct Pay debita do vault na hora. Borrow Mode usa o vault como colateral e cobra juros contínuos a 4% APY até o repagamento."
        >
          <PillGroup legend="Modo de pagamento">
            <Pill active={inputs.mode === "DirectPay"} onClick={() => update("mode", "DirectPay")}>
              Direct Pay
            </Pill>
            <Pill active={inputs.mode === "Borrow"} onClick={() => update("mode", "Borrow")}>
              Borrow Mode
            </Pill>
          </PillGroup>
        </Field>

        {inputs.mode === "Borrow" ? (
          <Field label="Dias até quitar o borrow" hint="4% APY contínuo" htmlFor="borrowDays">
            <NumberInput
              id="borrowDays"
              value={inputs.borrowDays}
              step={1}
              min={0}
              onValueChange={(v) => update("borrowDays", Math.max(0, Math.round(v)))}
            />
          </Field>
        ) : null}

        <Field
          label="Tipo de operação"
          tooltip="Saques ATM somam 2% e nunca geram cashback. Limite de US$ 250 por saque, 3 tentativas a cada 24h."
        >
          <PillGroup legend="Tipo de operação">
            <Pill active={!inputs.isAtm} onClick={() => update("isAtm", false)}>
              Compra
            </Pill>
            <Pill active={inputs.isAtm} onClick={() => update("isAtm", true)}>
              Saque ATM (+2%)
            </Pill>
          </PillGroup>
        </Field>

        <div className="border-t border-stone-800/60 pt-4">
          <div className="mb-3 font-sans text-[10px] uppercase tracking-[0.25em] text-stone-400">
            Comparativo · cartão BR tradicional
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Field label="IOF" hint="% · vigente 2026" htmlFor="iof">
              <NumberInput
                id="iof"
                value={inputs.brCard.iofPct}
                step={0.1}
                onValueChange={(v) => updateBrCard("iofPct", v)}
              />
            </Field>
            <Field label="Spread do banco BR" hint="% típico" htmlFor="brSpread">
              <NumberInput
                id="brSpread"
                value={inputs.brCard.spreadPct}
                step={0.1}
                onValueChange={(v) => updateBrCard("spreadPct", v)}
              />
            </Field>
          </div>
        </div>
      </div>
    </section>
  );
}
