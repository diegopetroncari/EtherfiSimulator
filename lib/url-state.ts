import { z } from "zod";
import type { SimulatorInputs } from "./simulator/types";

export const simulatorInputsSchema = z.object({
  currency: z.enum(["BRL", "USD", "EUR"]),
  amount: z.number().nonnegative().finite(),
  rates: z.object({
    usdBrl: z.number().positive().finite(),
    eurBrl: z.number().positive().finite(),
  }),
  visaSpreadPct: z.number().min(-10).max(20),
  tier: z.enum(["Core", "Luxe", "Pinnacle"]),
  mode: z.enum(["DirectPay", "Borrow"]),
  borrowDays: z.number().int().nonnegative().max(365 * 5),
  monthlyAccumulated: z.number().nonnegative().finite(),
  isAtm: z.boolean(),
  brCard: z.object({
    iofPct: z.number().min(-10).max(50),
    spreadPct: z.number().min(-10).max(50),
  }),
});

export const DEFAULT_INPUTS: SimulatorInputs = {
  currency: "BRL",
  amount: 500,
  rates: { usdBrl: 5.0, eurBrl: 5.45 },
  visaSpreadPct: 0.3,
  tier: "Core",
  mode: "DirectPay",
  borrowDays: 30,
  monthlyAccumulated: 0,
  isAtm: false,
  brCard: { iofPct: 3.5, spreadPct: 4.0 },
};

const MODE_SHORT = { DirectPay: "DP", Borrow: "BR" } as const;
const MODE_LONG = { DP: "DirectPay", BR: "Borrow" } as const;

/** Encoda inputs em URLSearchParams compactos (chaves curtas para URL legível). */
export function encodeInputs(inputs: SimulatorInputs): URLSearchParams {
  const p = new URLSearchParams();
  p.set("c", inputs.currency);
  p.set("v", String(inputs.amount));
  p.set("u", String(inputs.rates.usdBrl));
  p.set("e", String(inputs.rates.eurBrl));
  p.set("vs", String(inputs.visaSpreadPct));
  p.set("t", inputs.tier);
  p.set("m", MODE_SHORT[inputs.mode]);
  p.set("d", String(inputs.borrowDays));
  p.set("ma", String(inputs.monthlyAccumulated));
  p.set("atm", inputs.isAtm ? "1" : "0");
  p.set("iof", String(inputs.brCard.iofPct));
  p.set("sp", String(inputs.brCard.spreadPct));
  return p;
}

/** Decoda URLSearchParams para inputs validados. Campos ausentes/ inválidos caem no default. */
export function decodeInputs(search: URLSearchParams): SimulatorInputs {
  const num = (key: string, fallback: number) => {
    const raw = search.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const candidate: unknown = {
    currency: search.get("c") ?? DEFAULT_INPUTS.currency,
    amount: num("v", DEFAULT_INPUTS.amount),
    rates: {
      usdBrl: num("u", DEFAULT_INPUTS.rates.usdBrl),
      eurBrl: num("e", DEFAULT_INPUTS.rates.eurBrl),
    },
    visaSpreadPct: num("vs", DEFAULT_INPUTS.visaSpreadPct),
    tier: search.get("t") ?? DEFAULT_INPUTS.tier,
    mode: MODE_LONG[(search.get("m") as keyof typeof MODE_LONG) ?? "DP"] ?? DEFAULT_INPUTS.mode,
    borrowDays: Math.round(num("d", DEFAULT_INPUTS.borrowDays)),
    monthlyAccumulated: num("ma", DEFAULT_INPUTS.monthlyAccumulated),
    isAtm: search.get("atm") === "1",
    brCard: {
      iofPct: num("iof", DEFAULT_INPUTS.brCard.iofPct),
      spreadPct: num("sp", DEFAULT_INPUTS.brCard.spreadPct),
    },
  };

  const result = simulatorInputsSchema.safeParse(candidate);
  return result.success ? result.data : DEFAULT_INPUTS;
}
