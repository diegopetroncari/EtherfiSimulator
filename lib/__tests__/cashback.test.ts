import { describe, expect, it } from "vitest";
import { calcCashback } from "../simulator/cashback";

const closeTo = (actual: number, expected: number, eps = 1e-9) =>
  expect(Math.abs(actual - expected)).toBeLessThan(eps);

describe("calcCashback · Standard / Core", () => {
  it("retorna 3% inteiro dentro do primeiro slab", () => {
    closeTo(calcCashback("Standard", "Core", 0, 100), 3);
    closeTo(calcCashback("Standard", "Core", 1500, 400), 12);
  });

  it("transiciona corretamente entre slab 1 (3%) e slab 2 (1%)", () => {
    // monthlyAcc = 1900, tx = 200 → 100 a 3% + 100 a 1% = 3 + 1 = 4
    closeTo(calcCashback("Standard", "Core", 1900, 200), 4);
  });

  it("transiciona corretamente entre slab 2 (1%) e slab 3 (0,5%)", () => {
    // monthlyAcc = 2900, tx = 200 → 100 a 1% + 100 a 0,5% = 1 + 0,5 = 1,5
    closeTo(calcCashback("Standard", "Core", 2900, 200), 1.5);
  });

  it("BUG REGRESSION: monthlyAcc=5000 (já no 3º slab) deve aplicar 0,5%, não 1%", () => {
    // Bug histórico (etherfi-simulador.jsx): retornava $1,00 (1%) em vez de $0,50 (0,5%).
    closeTo(calcCashback("Standard", "Core", 5000, 100), 0.5);
  });

  it("aplica apenas 3º slab quando monthlyAcc já passou todos os anteriores", () => {
    closeTo(calcCashback("Standard", "Core", 100000, 1000), 5);
  });

  it("retorna 0 para tx <= 0", () => {
    expect(calcCashback("Standard", "Core", 0, 0)).toBe(0);
    expect(calcCashback("Standard", "Core", 0, -50)).toBe(0);
  });

  it("trata monthlyAcc negativo como 0", () => {
    closeTo(calcCashback("Standard", "Core", -500, 100), 3);
  });
});

describe("calcCashback · Standard / Luxe e Pinnacle", () => {
  it("Luxe: 10000 a 3% + 10000 a 1% + 0 (3º slab cobre o resto a 0,5%)", () => {
    // monthlyAcc=0, tx=20000 → 10000·0,03 + 10000·0,01 = 300 + 100 = 400
    closeTo(calcCashback("Standard", "Luxe", 0, 20000), 400);
  });

  it("Luxe: monthlyAcc=0, tx=10000 → exatamente $300 (todo no 1º slab)", () => {
    closeTo(calcCashback("Standard", "Luxe", 0, 10000), 300);
  });

  it("Pinnacle: cruza os três slabs em uma única tx", () => {
    // monthlyAcc=0, tx=100000 → 50000·0,03 + 30000·0,01 + 20000·0,005 = 1500 + 300 + 100 = 1900
    closeTo(calcCashback("Standard", "Pinnacle", 0, 100000), 1900);
  });
});

describe("calcCashback · EUR table", () => {
  it("Core EUR: 1º slab termina em €800 a 3%", () => {
    closeTo(calcCashback("EUR", "Core", 0, 800), 24);
  });

  it("Core EUR: cruza os três slabs em uma única tx", () => {
    // monthlyAcc=0, tx=2000 → 800·0,03 + 700·0,01 + 500·0,001 = 24 + 7 + 0,5 = 31,5
    closeTo(calcCashback("EUR", "Core", 0, 2000), 31.5);
  });

  it("Core EUR: 3º slab cai para 0,1%", () => {
    closeTo(calcCashback("EUR", "Core", 1600, 100), 0.1);
  });

  it("Luxe EUR: spend 2000 cai inteiro no primeiro slab a 3%", () => {
    closeTo(calcCashback("EUR", "Luxe", 0, 2000), 60);
  });

  it("Luxe EUR: cruza slab 1→2→3", () => {
    // monthlyAcc=0, tx=6000 → 2000·0,03 + 3000·0,01 + 1000·0,001 = 60 + 30 + 1 = 91
    closeTo(calcCashback("EUR", "Luxe", 0, 6000), 91);
  });

  it("Pinnacle EUR: spend 5000 inteiro no 1º slab a 3%", () => {
    closeTo(calcCashback("EUR", "Pinnacle", 0, 5000), 150);
  });
});
