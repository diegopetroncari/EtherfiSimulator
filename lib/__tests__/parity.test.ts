import { describe, expect, it } from "vitest";
import { simulate } from "../simulator/model";
import type { SimulatorInputs } from "../simulator/types";

/**
 * Paridade com a especificação documentada da ether.fi Cash.
 *
 * Originalmente este teste reproduzia a lógica do JSX legado (etherfi-simulador.jsx).
 * Após auditoria contra o Help Center oficial (2026-05), duas correções foram aplicadas
 * tanto ao modelo quanto a esta referência:
 *   1. Tabela EUR de cashback: thresholds atualizados (Core 800/1500, Luxe 2000/5000,
 *      Pinnacle 5000/20000).
 *   2. Borrow Mode: 4% APY efetivo via (1.04)^(d/365), não capitalização contínua.
 *
 * O bug histórico do cursor regressivo do cashback continua excluído (cases abaixo
 * usam monthlyAcc onde o bug não dispara).
 */

interface LegacyInputs {
  currency: "BRL" | "USD" | "EUR";
  amount: number;
  rates: { usdBrl: number; eurBrl: number };
  visaSpreadPct: number;
  tier: "Core" | "Luxe" | "Pinnacle";
  mode: "DirectPay" | "Borrow";
  borrowDays: number;
  monthlyAccumulated: number;
  isAtm: boolean;
}

const LEGACY_CASHBACK = {
  Standard: {
    Core: [
      { upTo: 2000, rate: 0.03 },
      { upTo: 3000, rate: 0.01 },
      { upTo: Infinity, rate: 0.005 },
    ],
    Luxe: [
      { upTo: 10000, rate: 0.03 },
      { upTo: 20000, rate: 0.01 },
      { upTo: Infinity, rate: 0.005 },
    ],
    Pinnacle: [
      { upTo: 50000, rate: 0.03 },
      { upTo: 80000, rate: 0.01 },
      { upTo: Infinity, rate: 0.005 },
    ],
  },
  EUR: {
    Core: [
      { upTo: 800, rate: 0.03 },
      { upTo: 1500, rate: 0.01 },
      { upTo: Infinity, rate: 0.001 },
    ],
    Luxe: [
      { upTo: 2000, rate: 0.03 },
      { upTo: 5000, rate: 0.01 },
      { upTo: Infinity, rate: 0.001 },
    ],
    Pinnacle: [
      { upTo: 5000, rate: 0.03 },
      { upTo: 20000, rate: 0.01 },
      { upTo: Infinity, rate: 0.001 },
    ],
  },
} as const;

function legacyCalcCashback(
  table: keyof typeof LEGACY_CASHBACK,
  tier: "Core" | "Luxe" | "Pinnacle",
  monthlyAcc: number,
  txAmount: number,
): number {
  const slabs = LEGACY_CASHBACK[table][tier];
  let remaining = txAmount;
  let cursor = monthlyAcc;
  let total = 0;
  for (const slab of slabs) {
    if (remaining <= 0) break;
    const room = Math.max(0, slab.upTo - cursor);
    if (room <= 0) {
      // BUG ORIGINAL: cursor regressivo
      cursor = slab.upTo;
      continue;
    }
    const used = Math.min(remaining, room);
    total += used * slab.rate;
    remaining -= used;
    cursor += used;
  }
  return total;
}

function legacyCalc(inp: LegacyInputs) {
  const v = Math.max(0, inp.amount);
  const taxaUsd = Math.max(0.01, inp.rates.usdBrl);
  const taxaEur = Math.max(0.01, inp.rates.eurBrl);
  const eurUsd = taxaEur / taxaUsd;
  const spreadPct = inp.visaSpreadPct / 100;
  const spotToBRL = inp.currency === "BRL" ? 1 : inp.currency === "USD" ? taxaUsd : taxaEur;

  let usdVisa: number;
  let fxFeeRate: number;
  let cashbackTable: "Standard" | "EUR";
  let txAmountForCashback: number;
  if (inp.currency === "BRL") {
    usdVisa = v / (taxaUsd * (1 + spreadPct));
    fxFeeRate = 0.01;
    cashbackTable = "Standard";
    txAmountForCashback = usdVisa;
  } else if (inp.currency === "USD") {
    usdVisa = v;
    fxFeeRate = 0;
    cashbackTable = "Standard";
    txAmountForCashback = v;
  } else {
    usdVisa = v * eurUsd;
    fxFeeRate = 0;
    cashbackTable = "EUR";
    txAmountForCashback = v;
  }

  const fxFeeUsd = usdVisa * fxFeeRate;
  let totalUsd = usdVisa + fxFeeUsd;
  const atmFeeUsd = inp.isAtm ? usdVisa * 0.02 : 0;
  totalUsd += atmFeeUsd;

  const cashbackAmount = inp.isAtm
    ? 0
    : legacyCalcCashback(cashbackTable, inp.tier, inp.monthlyAccumulated, txAmountForCashback);
  const cashbackUsd = inp.currency === "EUR" ? cashbackAmount * eurUsd : cashbackAmount;

  let interestUsd = 0;
  if (inp.mode === "Borrow") {
    interestUsd = totalUsd * (Math.pow(1.04, inp.borrowDays / 365) - 1);
  }
  const totalUsdComJuros = totalUsd + interestUsd;
  const liquidoUsd = totalUsdComJuros - cashbackUsd;
  const valorNominalBRL = v * spotToBRL;
  const custoBRLLiquido = liquidoUsd * taxaUsd;

  return { liquidoUsd, custoBRLLiquido, valorNominalBRL, totalUsdComJuros };
}

const closeTo = (a: number, b: number, eps = 1e-6) =>
  expect(Math.abs(a - b)).toBeLessThan(eps);

describe("paridade com legacy · cenários sem bug do cashback", () => {
  const cases: Array<{ name: string; inp: LegacyInputs }> = [
    {
      name: "BRL 500 default Core DirectPay",
      inp: {
        currency: "BRL",
        amount: 500,
        rates: { usdBrl: 5, eurBrl: 5.45 },
        visaSpreadPct: 0.3,
        tier: "Core",
        mode: "DirectPay",
        borrowDays: 30,
        monthlyAccumulated: 0,
        isAtm: false,
      },
    },
    {
      name: "USD 1000 Luxe Borrow 60d",
      inp: {
        currency: "USD",
        amount: 1000,
        rates: { usdBrl: 5, eurBrl: 5.45 },
        visaSpreadPct: 0,
        tier: "Luxe",
        mode: "Borrow",
        borrowDays: 60,
        monthlyAccumulated: 0,
        isAtm: false,
      },
    },
    {
      name: "EUR 200 Pinnacle DirectPay",
      inp: {
        currency: "EUR",
        amount: 200,
        rates: { usdBrl: 5.1, eurBrl: 5.5 },
        visaSpreadPct: 0,
        tier: "Pinnacle",
        mode: "DirectPay",
        borrowDays: 0,
        monthlyAccumulated: 1000,
        isAtm: false,
      },
    },
    {
      name: "BRL 250 Core ATM",
      inp: {
        currency: "BRL",
        amount: 250,
        rates: { usdBrl: 5, eurBrl: 5.45 },
        visaSpreadPct: 0.3,
        tier: "Core",
        mode: "DirectPay",
        borrowDays: 0,
        monthlyAccumulated: 500,
        isAtm: true,
      },
    },
  ];

  for (const { name, inp } of cases) {
    it(name, () => {
      const legacy = legacyCalc(inp);
      const modern: SimulatorInputs = {
        ...inp,
        brCard: { iofPct: 3.5, spreadPct: 4.0 },
      };
      const r = simulate(modern);
      closeTo(r.netCostUsd, legacy.liquidoUsd);
      closeTo(r.netCostBrl, legacy.custoBRLLiquido);
      closeTo(r.nominalBrl, legacy.valorNominalBRL);
      closeTo(r.vaultDebitUsd, legacy.totalUsdComJuros);
    });
  }
});
