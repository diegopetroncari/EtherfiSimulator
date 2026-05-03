"use client";

import { useEffect, useMemo } from "react";
import { useSimulatorState } from "@/hooks/useSimulatorState";
import { useLiveRates } from "@/hooks/useLiveRates";
import { simulate } from "@/lib/simulator/model";
import { fmtRelativeTime } from "@/lib/format";
import { Header } from "./Header";
import { ParametersPanel } from "./ParametersPanel";
import { DecompositionPanel } from "./DecompositionPanel";
import { ScenariosPanel } from "./ScenariosPanel";
import { ChartsSection } from "./charts/ChartsSection";
import { TechnicalNotes } from "./TechnicalNotes";
import { DEFAULT_INPUTS } from "@/lib/url-state";

export function Simulator() {
  const { inputs, setInputs, shareableUrl, hydrated } = useSimulatorState();
  const { rates: liveRates, isLoading } = useLiveRates();

  // Aplica cotações ao vivo apenas se o usuário ainda não personalizou (tem defaults).
  useEffect(() => {
    if (!hydrated || !liveRates) return;
    const isUntouched =
      inputs.rates.usdBrl === DEFAULT_INPUTS.rates.usdBrl &&
      inputs.rates.eurBrl === DEFAULT_INPUTS.rates.eurBrl;
    if (isUntouched) {
      setInputs((p) => ({
        ...p,
        rates: { usdBrl: liveRates.usdBrl, eurBrl: liveRates.eurBrl },
      }));
    }
  }, [liveRates, hydrated, setInputs, inputs.rates.usdBrl, inputs.rates.eurBrl]);

  const result = useMemo(() => {
    try {
      return simulate(inputs);
    } catch {
      return simulate({ ...inputs, rates: DEFAULT_INPUTS.rates });
    }
  }, [inputs]);

  const liveBadge =
    isLoading && !liveRates ? (
      <span className="text-stone-400">carregando…</span>
    ) : liveRates ? (
      <span
        className={
          liveRates.source === "live"
            ? "text-emerald-300/80"
            : "text-stone-400"
        }
        title={`Atualizado ${fmtRelativeTime(liveRates.fetchedAt)}`}
      >
        {liveRates.source === "live" ? "● ao vivo" : "○ fallback"}
      </span>
    ) : (
      <span className="text-stone-400">manual</span>
    );

  return (
    <div className="min-h-screen bg-stone-950 px-5 py-8 font-sans text-stone-200 sm:px-10 sm:py-14">
      <Header />
      <main className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <ParametersPanel
          inputs={inputs}
          setInputs={setInputs}
          nominalBrl={result.nominalBrl}
          liveBadge={liveBadge}
        />
        <div>
          <DecompositionPanel inputs={inputs} result={result} />
          <ScenariosPanel inputs={inputs} result={result} onCopyLink={shareableUrl} />
        </div>
      </main>
      <ChartsSection inputs={inputs} />
      <TechnicalNotes />
    </div>
  );
}
