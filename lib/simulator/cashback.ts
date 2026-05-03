import { CASHBACK } from "./constants";
import type { CashbackTable, Tier } from "./types";

/**
 * Calcula cashback ether.fi numa única transação aplicando os slabs progressivos
 * a partir de um cursor (`monthlyAcc`) que representa o spend já acumulado no mês.
 *
 * Bugfix histórico: a versão original (etherfi-simulador.jsx) executava
 * `cursor = slab.upTo` quando `room <= 0`, fazendo o cursor *retroceder*
 * caso `monthlyAcc` já estivesse além daquele slab. Isso aplicava a alíquota
 * do slab seguinte indevidamente. A versão corrigida apenas pula o slab
 * (`continue`), preservando o cursor.
 */
export function calcCashback(
  table: CashbackTable,
  tier: Tier,
  monthlyAcc: number,
  txAmount: number,
): number {
  if (txAmount <= 0) return 0;

  const slabs = CASHBACK[table][tier];
  let remaining = txAmount;
  let cursor = Math.max(0, monthlyAcc);
  let total = 0;

  for (const slab of slabs) {
    if (remaining <= 0) break;
    const room = Math.max(0, slab.upTo - cursor);
    if (room <= 0) continue;
    const used = Math.min(remaining, room);
    total += used * slab.rate;
    remaining -= used;
    cursor += used;
  }

  return total;
}
