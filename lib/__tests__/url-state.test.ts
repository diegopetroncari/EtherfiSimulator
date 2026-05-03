import { describe, expect, it } from "vitest";
import { DEFAULT_INPUTS, decodeInputs, encodeInputs } from "../url-state";
import type { SimulatorInputs } from "../simulator/types";

describe("url-state", () => {
  it("round-trip preserva todos os campos", () => {
    const sample: SimulatorInputs = {
      currency: "EUR",
      amount: 1234.56,
      rates: { usdBrl: 5.12, eurBrl: 5.78 },
      visaSpreadPct: 0.5,
      tier: "Luxe",
      mode: "Borrow",
      borrowDays: 45,
      monthlyAccumulated: 2500,
      isAtm: true,
      brCard: { iofPct: 3.5, spreadPct: 4.2 },
    };
    const encoded = encodeInputs(sample);
    const decoded = decodeInputs(new URLSearchParams(encoded.toString()));
    expect(decoded).toEqual(sample);
  });

  it("retorna defaults para query vazia", () => {
    expect(decodeInputs(new URLSearchParams())).toEqual(DEFAULT_INPUTS);
  });

  it("ignora valores inválidos e cai no default", () => {
    const decoded = decodeInputs(new URLSearchParams("c=XXX&v=NaN"));
    // currency inválido → schema rejeita inteiro e devolve DEFAULT
    expect(decoded).toEqual(DEFAULT_INPUTS);
  });

  it("DirectPay codifica como DP", () => {
    const encoded = encodeInputs(DEFAULT_INPUTS);
    expect(encoded.get("m")).toBe("DP");
  });

  it("Borrow codifica como BR", () => {
    const encoded = encodeInputs({ ...DEFAULT_INPUTS, mode: "Borrow" });
    expect(encoded.get("m")).toBe("BR");
  });
});
