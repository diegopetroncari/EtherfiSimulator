"use client";

import { useEffect, useMemo } from "react";
import { useSimulatorState } from "@/hooks/useSimulatorState";
import { useLiveRates } from "@/hooks/useLiveRates";
import { simulate } from "@/lib/simulator/model";
import { fmtRelativeTime } from "@/lib/format";
import { DEFAULT_INPUTS } from "@/lib/url-state";
import { HeroV2 } from "./HeroV2";
import { InputBlock } from "./InputBlock";
import { CostBlock } from "./CostBlock";
import { ParamsColumn } from "./ParamsColumn";
import { DecompositionV2 } from "./DecompositionV2";
import { ScenariosV2 } from "./ScenariosV2";
import { ReferralBanner } from "./ReferralBanner";
import { NotesV2 } from "./NotesV2";

export function SimulatorV2() {
  const { inputs, setInputs, shareableUrl, hydrated } = useSimulatorState();
  const { rates: liveRates, isLoading } = useLiveRates();

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
      <span style={{ color: "var(--ink-soft)" }}>carregando…</span>
    ) : liveRates ? (
      <span
        style={{
          color: liveRates.source === "live" ? "var(--tijolo)" : "var(--ink-soft)",
        }}
        title={`Atualizado ${fmtRelativeTime(liveRates.fetchedAt)}`}
      >
        {liveRates.source === "live" ? "● ao vivo" : "○ fallback"}
      </span>
    ) : (
      <span style={{ color: "var(--ink-soft)" }}>manual</span>
    );

  return (
    <>
      <HeroV2 />

      <main className="mx-auto max-w-6xl px-6 pb-16 sm:px-12">
        {/* 01 · Input prominente · primeiro toque do usuário */}
        <div className="mb-10">
          <InputBlock
            inputs={inputs}
            setInputs={setInputs}
            nominalBrl={result.nominalBrl}
          />
        </div>

        {/* 02 · Resultado imediato · feedback do input acima */}
        <div className="mb-20">
          <CostBlock inputs={inputs} result={result} onCopyLink={shareableUrl} />
        </div>

        {/* 03 · Ajuste fino + Decomposição · grid assimétrico */}
        <div className="grid gap-x-16 gap-y-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="lg:pl-12">
            <ParamsColumn
              inputs={inputs}
              setInputs={setInputs}
              liveBadge={liveBadge}
            />
          </div>
          <div className="space-y-16 lg:pl-12">
            <DecompositionV2 inputs={inputs} result={result} />
            <ScenariosV2 inputs={inputs} result={result} />
          </div>
        </div>
      </main>

      {/* 04 · Referral banner · benefício oficial Luxe */}
      <div className="mx-auto max-w-6xl px-6 pb-16 sm:px-12">
        <ReferralBanner />
      </div>

      <NotesV2 />
    </>
  );
}
