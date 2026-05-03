"use client";

import useSWR from "swr";
import type { LiveRates } from "@/lib/rates";

const fetcher = async (url: string): Promise<LiveRates> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`status ${res.status}`);
  return res.json();
};

export function useLiveRates() {
  const { data, error, isLoading, mutate } = useSWR<LiveRates>("/api/rates", fetcher, {
    refreshInterval: 60 * 60 * 1000, // 1h
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 1000,
  });

  return {
    rates: data,
    error,
    isLoading,
    refresh: mutate,
  };
}
