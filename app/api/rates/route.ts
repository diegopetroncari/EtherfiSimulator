import { fetchRates } from "@/lib/rates";

export const revalidate = 3600;

export async function GET() {
  const rates = await fetchRates();
  return Response.json(rates, {
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
