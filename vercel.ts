import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "next build",
  regions: ["gru1"],
  headers: [
    {
      source: "/api/rates",
      headers: [
        {
          key: "Cache-Control",
          value: "s-maxage=3600, stale-while-revalidate=86400",
        },
      ],
    },
  ],
};

export default config;
