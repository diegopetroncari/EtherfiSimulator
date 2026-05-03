export { simulate, InvalidRateError } from "./model";
export { calcCashback } from "./cashback";
export {
  CASHBACK,
  FX_FEE_RATE,
  ATM_FEE_RATE,
  BORROW_APY,
  MCCS_WITHOUT_CASHBACK,
} from "./constants";
export type {
  Currency,
  Tier,
  Mode,
  CashbackTable,
  Rates,
  BrCardParams,
  SimulatorInputs,
  SimulationResult,
  CashbackSlab,
} from "./types";
