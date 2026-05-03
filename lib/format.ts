import type { Currency } from "./simulator/types";

export function fmtMoney(n: number, ccy: Currency): string {
  return new Intl.NumberFormat(ccy === "BRL" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: ccy,
    minimumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
}

export const fmtBRL = (n: number) => fmtMoney(n, "BRL");
export const fmtUSD = (n: number) => fmtMoney(n, "USD");
export const fmtEUR = (n: number) => fmtMoney(n, "EUR");

export const CCY_FMT: Record<Currency, (n: number) => string> = {
  BRL: fmtBRL,
  USD: fmtUSD,
  EUR: fmtEUR,
};

export const CCY_LABEL: Record<Currency, string> = {
  BRL: "Real",
  USD: "Dólar",
  EUR: "Euro",
};

export const CCY_SYMBOL: Record<Currency, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "€",
};

export function fmtPct(fraction: number, digits = 2): string {
  if (!Number.isFinite(fraction)) return "—";
  return `${(fraction * 100).toFixed(digits).replace(".", ",")}%`;
}

export function fmtNum(n: number, digits = 4): string {
  return Number(Number.isFinite(n) ? n : 0).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function fmtRelativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  const diffMin = Math.round((Date.now() - t) / 60000);
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin} min atrás`;
  const h = Math.round(diffMin / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.round(h / 24);
  return `${d}d atrás`;
}
