import { fetchRates } from "@/lib/rates";

export const dynamic = "force-dynamic";

export async function GET() {
  const rates = await fetchRates();
  const isFallback = rates.source === "fallback";
  return Response.json(rates, {
    headers: {
      "Cache-Control": isFallback
        ? "no-store"
        : "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
