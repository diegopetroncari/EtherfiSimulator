"use client";

import type { SimulatorInputs } from "@/lib/simulator/types";
import { CostByTierChart } from "./CostByTierChart";
import { BreakevenChart } from "./BreakevenChart";
import { SensitivityChart } from "./SensitivityChart";

interface Props {
  inputs: SimulatorInputs;
}

export function ChartsSection({ inputs }: Props) {
  return (
    <section className="mx-auto mt-16 max-w-5xl border-t border-stone-800/70 pt-10">
      <div className="mb-5 font-sans text-[10px] uppercase tracking-[0.25em] text-stone-400">
        §3.5 · Visualizações
      </div>
      <div className="grid gap-10 lg:grid-cols-2">
        <ChartCard
          title="Custo efetivo por tier"
          subtitle="custo líquido em BRL × spend acumulado no mês"
          description="Onde cada tier passa a valer a pena dado o volume mensal. As curvas mostram saturação quando o cashback de 3% se esgota e cai para 1%, depois 0,5%."
        >
          <CostByTierChart inputs={inputs} />
        </ChartCard>
        <ChartCard
          title="Breakeven da compra atual"
          subtitle="comparativo de custo total em BRL"
          description="Mesma transação rodada em ether.fi (com cashback aplicado) e cartão BR tradicional. Quanto menor a barra, melhor."
        >
          <BreakevenChart inputs={inputs} />
        </ChartCard>
      </div>

      <div className="mt-10">
        <ChartCard
          title="Sensibilidade ao spread Visa"
          subtitle="aplicável a compras em BRL · spread de 0% a 1%"
          description="Como o custo líquido reage à variação do spread Visa em torno do mid-market. A linha tracejada marca o valor atual usado nos cálculos."
        >
          <SensitivityChart inputs={inputs} />
        </ChartCard>
      </div>
    </section>
  );
}

interface ChartCardProps {
  title: string;
  subtitle: string;
  description: string;
  children: React.ReactNode;
}

function ChartCard({ title, subtitle, description, children }: ChartCardProps) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-serif text-xl font-normal text-stone-100">{title}</h3>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-stone-400">
          {subtitle}
        </div>
      </div>
      {children}
      <p className="mt-3 font-serif text-xs leading-relaxed text-stone-300">{description}</p>
    </div>
  );
}
