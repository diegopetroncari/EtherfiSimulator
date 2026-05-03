import { z } from "zod";

export interface LiveRates {
  usdBrl: number;
  eurBrl: number;
  fetchedAt: string;
  source: "live" | "fallback";
}

const erApiSchema = z.object({
  result: z.literal("success"),
  base_code: z.literal("BRL"),
  rates: z.object({
    USD: z.number().positive(),
    EUR: z.number().positive(),
  }),
});

const awesomeApiSchema = z.object({
  USDBRL: z.object({ bid: z.string() }),
  EURBRL: z.object({ bid: z.string() }),
});

const FALLBACK_USD_BRL = Number(process.env.NEXT_PUBLIC_DEFAULT_USD_BRL) || 5.0;
const FALLBACK_EUR_BRL = Number(process.env.NEXT_PUBLIC_DEFAULT_EUR_BRL) || 5.45;

const REQUEST_HEADERS = {
  "User-Agent": "etherfi-simulator/1.0 (+https://etherfi-simulator.vercel.app)",
  Accept: "application/json",
};

/**
 * Busca cotações ao vivo. Estratégia: tenta open.er-api.com (atualização diária,
 * sem rate-limit em IPs cloud) → AwesomeAPI (intraday, mas rate-limita o pool da
 * Vercel) → constantes de fallback.
 *
 * Cache: o fetch usa `cache: "no-store"`; o cache real fica no CDN da Vercel via
 * `Cache-Control: s-maxage=3600, stale-while-revalidate=86400` na rota — assim
 * uma resposta de fallback (que envia `no-store`) não envenena a próxima hora.
 */
export async function fetchRates(): Promise<LiveRates> {
  const erApi = await tryErApi();
  if (erApi) return erApi;

  const awesome = await tryAwesomeApi();
  if (awesome) return awesome;

  return {
    usdBrl: FALLBACK_USD_BRL,
    eurBrl: FALLBACK_EUR_BRL,
    fetchedAt: new Date().toISOString(),
    source: "fallback",
  };
}

async function tryErApi(): Promise<LiveRates | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/BRL", {
      cache: "no-store",
      headers: REQUEST_HEADERS,
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const { rates } = erApiSchema.parse(await res.json());
    const usdBrl = 1 / rates.USD;
    const eurBrl = 1 / rates.EUR;
    if (!Number.isFinite(usdBrl) || !Number.isFinite(eurBrl) || usdBrl <= 0 || eurBrl <= 0) {
      throw new Error("invalid rates");
    }
    return { usdBrl, eurBrl, fetchedAt: new Date().toISOString(), source: "live" };
  } catch (err) {
    console.warn("[rates] open.er-api.com failed:", (err as Error)?.message);
    return null;
  }
}

async function tryAwesomeApi(): Promise<LiveRates | null> {
  try {
    const res = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL",
      { cache: "no-store", headers: REQUEST_HEADERS },
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = awesomeApiSchema.parse(await res.json());
    const usdBrl = parseFloat(json.USDBRL.bid);
    const eurBrl = parseFloat(json.EURBRL.bid);
    if (!Number.isFinite(usdBrl) || !Number.isFinite(eurBrl) || usdBrl <= 0 || eurBrl <= 0) {
      throw new Error("invalid bids");
    }
    return { usdBrl, eurBrl, fetchedAt: new Date().toISOString(), source: "live" };
  } catch (err) {
    console.warn("[rates] AwesomeAPI failed:", (err as Error)?.message);
    return null;
  }
}
