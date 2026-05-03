import { calcCashback } from "./cashback";
import { ATM_FEE_RATE, BORROW_APY, FX_FEE_RATE } from "./constants";
import type {
  CashbackTable,
  Currency,
  SimulationResult,
  SimulatorInputs,
} from "./types";

const ZERO_RESULT: SimulationResult = {
  visaConvertedUsd: 0,
  fxFeeRate: 0,
  fxFeeUsd: 0,
  atmFeeUsd: 0,
  borrowInterestUsd: 0,
  vaultDebitUsd: 0,
  cashbackInTxCcy: 0,
  cashbackUsd: 0,
  netCostUsd: 0,
  nominalBrl: 0,
  grossCostBrl: 0,
  netCostBrl: 0,
  overheadGross: 0,
  overheadNet: 0,
  brCardTotalBrl: 0,
  brCardOverhead: 0,
  cashbackTable: "Standard",
  effectiveCashbackRate: 0,
  eurUsd: 0,
};

export class InvalidRateError extends Error {
  constructor(field: string, value: number) {
    super(`Cotação inválida em "${field}": ${value}. Deve ser > 0.`);
    this.name = "InvalidRateError";
  }
}

/**
 * Modelo financeiro puro. Idêntico ao `useMemo` do JSX original, com:
 *   - Bug do cashback corrigido (ver cashback.ts).
 *   - Guards contra divisão por zero (amount=0 → todos zero, sem NaN).
 *   - Borrow days clamp em [0, ∞).
 *   - Erro explícito para cotações ≤ 0.
 *
 * Premissas auditadas (a confirmar contra docs ether.fi 2026):
 *   - FX fee BRL = 1%; USD = 0%; EUR = 0% (beta).
 *   - ATM = 2%, sem cashback.
 *   - Borrow: capitalização contínua a 4% APY (e^(0.04·d/365) − 1).
 *   - Cashback EUR 3º slab = 0,1% (vs 0,5% no Standard).
 */
export function simulate(inputs: SimulatorInputs): SimulationResult {
  const { rates } = inputs;

  if (rates.usdBrl <= 0) throw new InvalidRateError("rates.usdBrl", rates.usdBrl);
  if (rates.eurBrl <= 0) throw new InvalidRateError("rates.eurBrl", rates.eurBrl);

  const amount = Math.max(0, Number(inputs.amount) || 0);
  if (amount === 0) return ZERO_RESULT;

  const visaSpreadFraction = (Number(inputs.visaSpreadPct) || 0) / 100;
  const eurUsd = rates.eurBrl / rates.usdBrl;
  const spotToBrl = currencyToBrlFactor(inputs.currency, rates);

  const { visaConvertedUsd, cashbackTable, txAmountForCashback } =
    convertToVisaUsd(inputs, eurUsd, visaSpreadFraction);

  const fxFeeRate = FX_FEE_RATE[inputs.currency];
  const fxFeeUsd = visaConvertedUsd * fxFeeRate;

  const atmFeeUsd = inputs.isAtm ? visaConvertedUsd * ATM_FEE_RATE : 0;

  const totalUsdPreInterest = visaConvertedUsd + fxFeeUsd + atmFeeUsd;

  const borrowDays = Math.max(0, Number(inputs.borrowDays) || 0);
  const borrowInterestUsd =
    inputs.mode === "Borrow"
      ? totalUsdPreInterest * (Math.exp(BORROW_APY * (borrowDays / 365)) - 1)
      : 0;

  const vaultDebitUsd = totalUsdPreInterest + borrowInterestUsd;

  const cashbackInTxCcy = inputs.isAtm
    ? 0
    : calcCashback(
        cashbackTable,
        inputs.tier,
        Math.max(0, Number(inputs.monthlyAccumulated) || 0),
        txAmountForCashback,
      );

  const cashbackUsd =
    cashbackTable === "EUR" ? cashbackInTxCcy * eurUsd : cashbackInTxCcy;

  const netCostUsd = vaultDebitUsd - cashbackUsd;

  const nominalBrl = amount * spotToBrl;
  const grossCostBrl = vaultDebitUsd * rates.usdBrl;
  const netCostBrl = netCostUsd * rates.usdBrl;

  const overheadGross = nominalBrl > 0 ? (grossCostBrl - nominalBrl) / nominalBrl : 0;
  const overheadNet = nominalBrl > 0 ? (netCostBrl - nominalBrl) / nominalBrl : 0;

  const brCardOverheadFraction =
    (Number(inputs.brCard.iofPct) || 0) / 100 +
    (Number(inputs.brCard.spreadPct) || 0) / 100;
  const brCardTotalBrl = nominalBrl * (1 + brCardOverheadFraction);
  const brCardOverhead = brCardOverheadFraction;

  const effectiveCashbackRate =
    txAmountForCashback > 0 ? cashbackInTxCcy / txAmountForCashback : 0;

  return {
    visaConvertedUsd,
    fxFeeRate,
    fxFeeUsd,
    atmFeeUsd,
    borrowInterestUsd,
    vaultDebitUsd,
    cashbackInTxCcy,
    cashbackUsd,
    netCostUsd,
    nominalBrl,
    grossCostBrl,
    netCostBrl,
    overheadGross,
    overheadNet,
    brCardTotalBrl,
    brCardOverhead,
    cashbackTable,
    effectiveCashbackRate,
    eurUsd,
  };
}

function currencyToBrlFactor(currency: Currency, rates: SimulatorInputs["rates"]): number {
  if (currency === "BRL") return 1;
  if (currency === "USD") return rates.usdBrl;
  return rates.eurBrl;
}

function convertToVisaUsd(
  inputs: SimulatorInputs,
  eurUsd: number,
  visaSpreadFraction: number,
): { visaConvertedUsd: number; cashbackTable: CashbackTable; txAmountForCashback: number } {
  const v = inputs.amount;
  if (inputs.currency === "BRL") {
    const visaRate = inputs.rates.usdBrl * (1 + visaSpreadFraction);
    const usd = v / visaRate;
    return {
      visaConvertedUsd: usd,
      cashbackTable: "Standard",
      txAmountForCashback: usd,
    };
  }
  if (inputs.currency === "USD") {
    return {
      visaConvertedUsd: v,
      cashbackTable: "Standard",
      txAmountForCashback: v,
    };
  }
  return {
    visaConvertedUsd: v * eurUsd,
    cashbackTable: "EUR",
    txAmountForCashback: v,
  };
}
