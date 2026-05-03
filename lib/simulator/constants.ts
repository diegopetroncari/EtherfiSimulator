import type { CashbackTables } from "./types";

/**
 * Tabelas progressivas de cashback ether.fi Cash.
 *
 * - `Standard` aplica para USD e qualquer moeda não-EUR (incluindo BRL após conversão Visa→USD).
 * - `EUR` aplica somente para compras nativas em EUR (programa beta com 0% FX).
 *
 * Cada slab é exclusivo: spend acima de `upTo` cai no próximo escalão.
 * O último slab é sempre `Infinity` para cobrir qualquer spend residual.
 */
export const CASHBACK: CashbackTables = {
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
};

export const FX_FEE_RATE = {
  BRL: 0.01,
  USD: 0,
  EUR: 0,
} as const;

export const ATM_FEE_RATE = 0.02;

/**
 * Rendimento anual efetivo do Borrow Mode.
 * Doc oficial: "4% APY" com exemplo `$100 → $104 em 1 ano`. Aplicar como
 * yield efetivo: V·((1 + APY)^(t/365) − 1).
 */
export const BORROW_APY = 0.04;

/** MCCs informativos que não geram cashback. Não é usado pelo modelo (apenas exposto à UI). */
export const MCCS_WITHOUT_CASHBACK = [
  { code: "6011", label: "Saques ATM" },
  { code: "6012", label: "Plataformas de investimento" },
  { code: "6211", label: "Corretoras" },
  { code: "6513", label: "Aluguéis e imobiliárias" },
  { code: "6532", label: "Instituições financeiras" },
  { code: "7995", label: "Jogos de azar" },
] as const;
