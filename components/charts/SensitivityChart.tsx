"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { simulate } from "@/lib/simulator/model";
import type { SimulatorInputs } from "@/lib/simulator/types";
import { fmtBRL, fmtPct } from "@/lib/format";

interface Props {
  inputs: SimulatorInputs;
}

const POINTS = 30;

export function SensitivityChart({ inputs }: Props) {
  const isApplicable = inputs.currency === "BRL";

  const data = useMemo(() => {
    if (!isApplicable) return [];
    const rows = [];
    for (let i = 0; i <= POINTS; i++) {
      const visaSpreadPct = (i / POINTS) * 1; // 0% a 1%
      const r = simulate({ ...inputs, visaSpreadPct });
      rows.push({ spread: visaSpreadPct, cost: r.netCostBrl });
    }
    return rows;
  }, [inputs, isApplicable]);

  if (!isApplicable) {
    return (
      <div className="flex h-[220px] items-center justify-center font-serif text-xs text-stone-400">
        Aplicável apenas a compras em BRL.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 24, bottom: 4, left: 0 }}>
        <CartesianGrid stroke="#292524" strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey="spread"
          stroke="#a8a29e"
          tickFormatter={(v: number) => fmtPct(v / 100, 1)}
          fontSize={10}
          type="number"
          domain={[0, 1]}
        />
        <YAxis
          stroke="#a8a29e"
          tickFormatter={(v) => fmtBRL(v).replace("R$ ", "R$")}
          fontSize={10}
          width={80}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{ background: "#1c1917", border: "1px solid #44403c", fontSize: 12 }}
          labelFormatter={(v: number) => `Spread Visa · ${fmtPct(v / 100, 2)}`}
          formatter={(v: number) => [fmtBRL(v), "custo líquido"]}
        />
        <ReferenceLine
          x={inputs.visaSpreadPct}
          stroke="#fbbf24"
          strokeDasharray="3 3"
          label={{ value: "atual", fill: "#fbbf24", fontSize: 10, position: "top" }}
        />
        <Line
          type="monotone"
          dataKey="cost"
          stroke="#fde68a"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
