"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SimulatorInputs } from "@/lib/simulator/types";
import {
  DEFAULT_INPUTS,
  decodeInputs,
  encodeInputs,
  simulatorInputsSchema,
} from "@/lib/url-state";

const STORAGE_KEY = "etherfi-sim:v1";

function loadFromLocalStorage(): SimulatorInputs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = simulatorInputsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function loadFromUrl(): SimulatorInputs | null {
  if (typeof window === "undefined") return null;
  const search = new URLSearchParams(window.location.search);
  if ([...search.keys()].length === 0) return null;
  return decodeInputs(search);
}

export function useSimulatorState() {
  // SSR/CSR consistente: começa sempre no DEFAULT, hidrata de URL/localStorage no efeito.
  const [inputs, setInputsState] = useState<SimulatorInputs>(DEFAULT_INPUTS);
  const [hydrated, setHydrated] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hidratação: prioridade URL > localStorage > defaults
  useEffect(() => {
    const fromUrl = loadFromUrl();
    if (fromUrl) {
      setInputsState(fromUrl);
      setHydrated(true);
      return;
    }
    const fromStorage = loadFromLocalStorage();
    if (fromStorage) {
      setInputsState(fromStorage);
    }
    setHydrated(true);
  }, []);

  // Sync para URL (replaceState, sem reload) e localStorage (debounced)
  useEffect(() => {
    if (!hydrated) return;
    const params = encodeInputs(inputs);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
      } catch {
        /* quota / privado: ignora */
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputs, hydrated]);

  const setInputs = useCallback(
    (updater: SimulatorInputs | ((prev: SimulatorInputs) => SimulatorInputs)) => {
      setInputsState((prev) =>
        typeof updater === "function"
          ? (updater as (p: SimulatorInputs) => SimulatorInputs)(prev)
          : updater,
      );
    },
    [],
  );

  const reset = useCallback(() => setInputsState(DEFAULT_INPUTS), []);

  const shareableUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    const params = encodeInputs(inputs);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [inputs]);

  return { inputs, setInputs, reset, shareableUrl, hydrated };
}
