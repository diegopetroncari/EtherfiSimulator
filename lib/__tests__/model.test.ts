import { describe, expect, it } from "vitest";
import { InvalidRateError, simulate } from "../simulator/model";
import type { SimulatorInputs } from "../simulator/types";

const baseInputs: SimulatorInputs = {
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

const closeTo = (actual: number, expected: number, eps = 1e-6) =>
  expect(Math.abs(actual - expected)).toBeLessThan(eps);

describe("simulate · BRL purchase (default)", () => {
  it("calcula cadeia BRL→USD com spread Visa e 1% FX fee", () => {
    const r = simulate(baseInputs);
    // visaRate = 5.0 * 1.003 = 5.015 → usd = 500/5.015 = 99.7009...
    closeTo(r.visaConvertedUsd, 500 / 5.015);
    expect(r.fxFeeRate).toBe(0.01);
    closeTo(r.fxFeeUsd, r.visaConvertedUsd * 0.01);
    expect(r.atmFeeUsd).toBe(0);
    expect(r.borrowInterestUsd).toBe(0);
    expect(r.cashbackTable).toBe("Standard");
  });

  it("nominalBrl = amount em BRL puro", () => {
    expect(simulate(baseInputs).nominalBrl).toBe(500);
  });

  it("brCardTotalBrl = nominal × (1 + IOF + spread)", () => {
    closeTo(simulate(baseInputs).brCardTotalBrl, 500 * 1.075);
  });
});

describe("simulate · USD purchase", () => {
  it("não aplica FX fee nem spread Visa", () => {
    const r = simulate({ ...baseInputs, currency: "USD" });
    expect(r.visaConvertedUsd).toBe(500);
    expect(r.fxFeeRate).toBe(0);
    expect(r.fxFeeUsd).toBe(0);
    expect(r.cashbackTable).toBe("Standard");
  });

  it("nominalBrl converte ao spot USD/BRL", () => {
    const r = simulate({ ...baseInputs, currency: "USD" });
    closeTo(r.nominalBrl, 500 * 5.0);
  });

  it("cashback Core 3% inteiro (dentro do 1º slab)", () => {
    const r = simulate({ ...baseInputs, currency: "USD", amount: 100 });
    closeTo(r.cashbackInTxCcy, 3);
    closeTo(r.cashbackUsd, 3);
  });
});

describe("simulate · EUR purchase", () => {
  it("usa tabela EUR e 0% FX fee, com cross EUR/USD = eurBrl/usdBrl", () => {
    const r = simulate({ ...baseInputs, currency: "EUR", amount: 100 });
    expect(r.cashbackTable).toBe("EUR");
    expect(r.fxFeeRate).toBe(0);
    closeTo(r.eurUsd, 5.45 / 5.0);
    closeTo(r.visaConvertedUsd, 100 * (5.45 / 5.0));
  });

  it("cashback EUR é em EUR; cashbackUsd = EUR × eurUsd", () => {
    const r = simulate({ ...baseInputs, currency: "EUR", amount: 100 });
    closeTo(r.cashbackInTxCcy, 3); // 3% sobre €100
    closeTo(r.cashbackUsd, 3 * (5.45 / 5.0));
  });
});

describe("simulate · ATM operation", () => {
  it("adiciona 2% e zera cashback", () => {
    const r = simulate({ ...baseInputs, currency: "USD", amount: 200, isAtm: true });
    closeTo(r.atmFeeUsd, 200 * 0.02);
    expect(r.cashbackInTxCcy).toBe(0);
    expect(r.cashbackUsd).toBe(0);
  });
});

describe("simulate · Borrow Mode", () => {
  it("adiciona juros contínuos a 4% APY sobre vaultDebit pré-juros", () => {
    const r = simulate({ ...baseInputs, currency: "USD", amount: 1000, mode: "Borrow", borrowDays: 365 });
    const pre = 1000;
    closeTo(r.borrowInterestUsd, pre * (Math.exp(0.04) - 1));
  });

  it("borrowDays = 0 → juros = 0", () => {
    const r = simulate({ ...baseInputs, mode: "Borrow", borrowDays: 0 });
    expect(r.borrowInterestUsd).toBe(0);
  });

  it("borrowDays negativo é tratado como 0", () => {
    const r = simulate({ ...baseInputs, mode: "Borrow", borrowDays: -50 });
    expect(r.borrowInterestUsd).toBe(0);
  });
});

describe("simulate · edge cases", () => {
  it("amount=0 → resultado todo zerado, sem NaN no overhead", () => {
    const r = simulate({ ...baseInputs, amount: 0 });
    expect(r.netCostBrl).toBe(0);
    expect(r.overheadNet).toBe(0);
    expect(r.overheadGross).toBe(0);
    expect(Number.isFinite(r.overheadNet)).toBe(true);
  });

  it("amount negativo é tratado como 0", () => {
    const r = simulate({ ...baseInputs, amount: -100 });
    expect(r.vaultDebitUsd).toBe(0);
  });

  it("rates.usdBrl ≤ 0 → InvalidRateError", () => {
    expect(() => simulate({ ...baseInputs, rates: { usdBrl: 0, eurBrl: 5.45 } })).toThrow(
      InvalidRateError,
    );
    expect(() => simulate({ ...baseInputs, rates: { usdBrl: -1, eurBrl: 5.45 } })).toThrow(
      InvalidRateError,
    );
  });

  it("rates.eurBrl ≤ 0 → InvalidRateError", () => {
    expect(() => simulate({ ...baseInputs, rates: { usdBrl: 5, eurBrl: 0 } })).toThrow(
      InvalidRateError,
    );
  });
});

describe("simulate · cashback bug regression integrado", () => {
  it("USD 100, monthlyAcc=5000, Core → cashback $0,50 (não $1,00)", () => {
    const r = simulate({
      ...baseInputs,
      currency: "USD",
      amount: 100,
      monthlyAccumulated: 5000,
      tier: "Core",
    });
    closeTo(r.cashbackUsd, 0.5);
  });
});

describe("simulate · paridade visual com JSX original (caso default)", () => {
  it("BRL 500, USD/BRL 5.00, EUR/BRL 5.45, spread 0.3%, Core, DirectPay, sem ATM", () => {
    const r = simulate(baseInputs);
    // Snapshot dos valores numéricos chave com tolerância 1e-4
    closeTo(r.visaConvertedUsd, 99.70089730807577, 1e-4);
    closeTo(r.fxFeeUsd, 0.9970089730807577, 1e-4);
    closeTo(r.vaultDebitUsd, 100.69790628115653, 1e-4);
    // cashback: monthlyAcc=0, tx=99.7008..., Core/Standard → 3% inteiro
    closeTo(r.cashbackInTxCcy, 99.70089730807577 * 0.03, 1e-4);
    closeTo(r.netCostBrl, (r.vaultDebitUsd - r.cashbackUsd) * 5.0, 1e-4);
    closeTo(r.brCardTotalBrl, 500 * 1.075, 1e-9);
  });
});
