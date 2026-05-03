import { z } from "zod";

export interface LiveRates {
  usdBrl: number;
  eurBrl: number;
  fetchedAt: string;
  source: "live" | "fallback";
}

const awesomeApiSchema = z.object({
  USDBRL: z.object({ bid: z.string() }),
  EURBRL: z.object({ bid: z.string() }),
});

const FALLBACK_USD_BRL = Number(process.env.NEXT_PUBLIC_DEFAULT_USD_BRL) || 5.0;
const FALLBACK_EUR_BRL = Number(process.env.NEXT_PUBLIC_DEFAULT_EUR_BRL) || 5.45;

/**
 * Busca cotações ao vivo via AwesomeAPI (gratuito, sem auth).
 * Em caso de falha (rede, parsing, status != 200) devolve fallback explícito.
 *
 * Cache: a chamada usa `next: { revalidate: 3600, tags: ['rates'] }` para
 * o data cache do Next.js. A rota também envia `Cache-Control: s-maxage=3600,
 * stale-while-revalidate=86400` para o CDN da Vercel.
 */
export async function fetchRates(): Promise<LiveRates> {
  try {
    const res = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL",
      { next: { revalidate: 3600, tags: ["rates"] } },
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = awesomeApiSchema.parse(await res.json());
    const usdBrl = parseFloat(json.USDBRL.bid);
    const eurBrl = parseFloat(json.EURBRL.bid);
    if (!Number.isFinite(usdBrl) || !Number.isFinite(eurBrl) || usdBrl <= 0 || eurBrl <= 0) {
      throw new Error("invalid bids");
    }
    return {
      usdBrl,
      eurBrl,
      fetchedAt: new Date().toISOString(),
      source: "live",
    };
  } catch (err) {
    console.warn("[rates] AwesomeAPI failed, using fallback:", (err as Error)?.message);
    return {
      usdBrl: FALLBACK_USD_BRL,
      eurBrl: FALLBACK_EUR_BRL,
      fetchedAt: new Date().toISOString(),
      source: "fallback",
    };
  }
}
