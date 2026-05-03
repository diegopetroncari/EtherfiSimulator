export type Currency = "BRL" | "USD" | "EUR";
export type Tier = "Core" | "Luxe" | "Pinnacle";
export type Mode = "DirectPay" | "Borrow";
export type CashbackTable = "Standard" | "EUR";

export interface Rates {
  usdBrl: number;
  eurBrl: number;
}

export interface BrCardParams {
  iofPct: number;
  spreadPct: number;
}

export interface SimulatorInputs {
  currency: Currency;
  amount: number;
  rates: Rates;
  visaSpreadPct: number;
  tier: Tier;
  mode: Mode;
  borrowDays: number;
  monthlyAccumulated: number;
  isAtm: boolean;
  brCard: BrCardParams;
}

export interface SimulationResult {
  visaConvertedUsd: number;
  fxFeeRate: number;
  fxFeeUsd: number;
  atmFeeUsd: number;
  borrowInterestUsd: number;

  vaultDebitUsd: number;
  cashbackInTxCcy: number;
  cashbackUsd: number;
  netCostUsd: number;

  nominalBrl: number;
  grossCostBrl: number;
  netCostBrl: number;
  overheadGross: number;
  overheadNet: number;

  brCardTotalBrl: number;
  brCardOverhead: number;

  cashbackTable: CashbackTable;
  effectiveCashbackRate: number;
  eurUsd: number;
}

export interface CashbackSlab {
  upTo: number;
  rate: number;
}

export type CashbackTables = Record<CashbackTable, Record<Tier, readonly CashbackSlab[]>>;
