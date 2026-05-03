"use client";

import { Row } from "./ui/Row";
import { CCY_FMT, fmtBRL, fmtNum, fmtPct, fmtUSD, fmtEUR } from "@/lib/format";
import type { SimulationResult, SimulatorInputs } from "@/lib/simulator/types";

interface Props {
  inputs: SimulatorInputs;
  result: SimulationResult;
}

export function DecompositionPanel({ inputs, result }: Props) {
  const { currency, isAtm, mode, borrowDays, visaSpreadPct } = inputs;
  const fmtCcy = CCY_FMT[currency];

  const visaTaxa =
    result.visaConvertedUsd > 0 ? inputs.amount / result.visaConvertedUsd : 0;

  return (
    <section className="lg:border-l lg:border-stone-800/70 lg:pl-12">
      <div className="mb-8">
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-stone-400">
          §2 · Decomposição
        </span>
        <h2 className="mt-2 font-serif text-2xl font-normal text-stone-100">
          O que sai do seu vault
        </h2>
      </div>

      <div className="mb-10 border-b border-stone-800/70 pb-8" aria-live="polite">
        <div className="mb-3 font-sans text-[10px] uppercase tracking-[0.25em] text-stone-400">
          Custo efetivo líquido em BRL
          <span className="text-stone-500"> · após cashback</span>
        </div>
        <div
          className="font-serif text-5xl font-light leading-none text-amber-100 sm:text-6xl"
          style={{ fontVariationSettings: "'opsz' 144" }}
        >
          {fmtBRL(result.netCostBrl)}
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-stone-300">
          <span className="text-sm">
            overhead {result.overheadNet >= 0 ? "+" : ""}
            {fmtPct(result.overheadNet, 3)}
          </span>
          <span className="text-stone-600">·</span>
          <span className="text-xs">vault: {fmtUSD(result.netCostUsd)}</span>
          {currency !== "BRL" ? (
            <>
              <span className="text-stone-600">·</span>
              <span className="text-xs">nominal: {fmtCcy(inputs.amount)}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-3 font-sans text-[10px] uppercase tracking-[0.25em] text-stone-400">
          Cadeia de conversão
        </div>

        <Row
          label="1. Compra registrada pelo merchant"
          value={fmtCcy(inputs.amount)}
          sub={`o estabelecimento recebe esse valor em ${currency}`}
        />

        {currency === "BRL" ? (
          <Row
            label="2. Visa converte BRL → USD"
            value={fmtUSD(result.visaConvertedUsd)}
            sub={`taxa Visa ${fmtNum(visaTaxa, 4)} · spread ${visaSpreadPct}% sobre spot`}
          />
        ) : null}
        {currency === "USD" ? (
          <Row
            label="2. Sem conversão · cartão é USD-denominado"
            value={fmtUSD(result.visaConvertedUsd)}
            sub="0% FX, 0% spread Visa nesta etapa"
          />
        ) : null}
        {currency === "EUR" ? (
          <Row
            label="2. Visa converte EUR → USD a market rate"
            value={fmtUSD(result.visaConvertedUsd)}
            sub={`EUR/USD ${fmtNum(result.eurUsd, 4)} · sem markup`}
          />
        ) : null}

        <Row
          label={`3. ether.fi FX fee · ${(result.fxFeeRate * 100).toFixed(0)}%`}
          value={result.fxFeeRate === 0 ? fmtUSD(0) : `+ ${fmtUSD(result.fxFeeUsd)}`}
          sub={
            currency === "BRL"
              ? "1% sobre o USD pós-Visa, todos os tiers"
              : currency === "USD"
                ? "isento · transação na moeda do cartão"
                : "EUR é isento de FX markup (beta)"
          }
          accent={result.fxFeeRate > 0 ? "negative" : "positive"}
        />

        {isAtm ? (
          <Row
            label="4. ATM fee · 2%"
            value={`+ ${fmtUSD(result.atmFeeUsd)}`}
            sub="limite 250 USD · 3 tentativas / 24h"
            accent="negative"
          />
        ) : null}
        {mode === "Borrow" ? (
          <Row
            label={`${isAtm ? 5 : 4}. Juros Borrow · 4% APY contínuo`}
            value={`+ ${fmtUSD(result.borrowInterestUsd)}`}
            sub={`${borrowDays} dias · começa a contar no instante da compra`}
            accent="negative"
          />
        ) : null}
        <Row
          label="Subtotal debitado do vault"
          value={fmtUSD(result.vaultDebitUsd)}
          sub={`equivalente a ${fmtBRL(result.grossCostBrl)} ao spot`}
        />
        <Row
          label={`Cashback ${isAtm ? "(N/A em ATM)" : `· ${result.cashbackTable}`}`}
          value={
            isAtm
              ? fmtUSD(0)
              : `− ${
                  currency === "EUR"
                    ? fmtEUR(result.cashbackInTxCcy)
                    : fmtUSD(result.cashbackInTxCcy)
                }`
          }
          sub={
            isAtm
              ? "ATM e MCC 6011 não geram cashback"
              : `pago em wETH · efetivo ${fmtPct(result.effectiveCashbackRate, 2)} sobre o ${
                  currency === "EUR" ? "EUR" : "USD"
                } da compra`
          }
          accent={isAtm ? undefined : "positive"}
        />
      </div>
    </section>
  );
}
