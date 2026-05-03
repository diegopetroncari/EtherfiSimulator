"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { simulate } from "@/lib/simulator/model";
import type { SimulatorInputs, Tier } from "@/lib/simulator/types";
import { fmtBRL } from "@/lib/format";

const TIERS: Tier[] = ["Core", "Luxe", "Pinnacle"];
const TIER_COLOR: Record<Tier, string> = {
  Core: "#fbbf24",
  Luxe: "#a3a3a3",
  Pinnacle: "#fde68a",
};
const POINTS = 25;

interface Props {
  inputs: SimulatorInputs;
}

export function CostByTierChart({ inputs }: Props) {
  const data = useMemo(() => {
    const max = inputs.currency === "EUR" ? 60000 : 100000;
    const rows: Array<Record<string, number>> = [];
    for (let i = 0; i <= POINTS; i++) {
      const monthly = (i / POINTS) * max;
      const point: Record<string, number> = { spend: monthly };
      for (const tier of TIERS) {
        const r = simulate({ ...inputs, tier, monthlyAccumulated: monthly, isAtm: false });
        point[tier] = r.netCostBrl;
      }
      rows.push(point);
    }
    return rows;
  }, [inputs]);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 24, bottom: 4, left: 0 }}>
        <CartesianGrid stroke="#292524" strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey="spend"
          stroke="#a8a29e"
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          fontSize={10}
        />
        <YAxis
          stroke="#a8a29e"
          tickFormatter={(v) => fmtBRL(v).replace("R$ ", "R$")}
          fontSize={10}
          width={80}
        />
        <Tooltip
          contentStyle={{ background: "#1c1917", border: "1px solid #44403c", fontSize: 12 }}
          labelFormatter={(v: number) => `Spend acumulado · ${fmtBRL(Number(v))}`}
          formatter={(v: number, name: string) => [fmtBRL(v), name]}
        />
        <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
        {TIERS.map((tier) => (
          <Line
            key={tier}
            type="monotone"
            dataKey={tier}
            stroke={TIER_COLOR[tier]}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
