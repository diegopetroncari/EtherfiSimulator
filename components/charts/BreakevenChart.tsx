"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { simulate } from "@/lib/simulator/model";
import type { SimulatorInputs } from "@/lib/simulator/types";
import { fmtBRL } from "@/lib/format";

interface Props {
  inputs: SimulatorInputs;
}

export function BreakevenChart({ inputs }: Props) {
  const data = useMemo(() => {
    const r = simulate(inputs);
    const rows = [
      {
        name: `ether.fi · ${inputs.tier}`,
        value: r.netCostBrl,
        color: "#fbbf24",
      },
      {
        name: "Cartão BR · IOF + spread",
        value: r.brCardTotalBrl,
        color: "#78716c",
      },
    ];
    if (inputs.currency === "BRL") {
      rows.push({
        name: "Cartão BR · doméstico",
        value: r.nominalBrl,
        color: "#a8a29e",
      });
    }
    return rows;
  }, [inputs]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 4, left: 0 }}>
        <CartesianGrid stroke="#292524" strokeDasharray="2 4" horizontal={false} />
        <XAxis
          type="number"
          stroke="#a8a29e"
          tickFormatter={(v) => fmtBRL(v).replace("R$ ", "R$")}
          fontSize={10}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#a8a29e"
          width={180}
          fontSize={10}
        />
        <Tooltip
          contentStyle={{ background: "#1c1917", border: "1px solid #44403c", fontSize: 12 }}
          formatter={(v: number) => [fmtBRL(v), "custo"]}
        />
        <Bar dataKey="value" radius={[0, 2, 2, 0]} isAnimationActive={false}>
          {data.map((row, i) => (
            <Cell key={i} fill={row.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
