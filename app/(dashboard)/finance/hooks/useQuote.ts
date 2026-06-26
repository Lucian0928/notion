"use client";

import { useQuery } from "@tanstack/react-query";
import type { QuoteDetail } from "@/types/finance";

async function fetchQuote(symbol: string): Promise<QuoteDetail> {
  const res = await fetch(`/api/get-quote?symbol=${encodeURIComponent(symbol)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "Failed to load quote");
  return data;
}

export function useQuote(symbol: string) {
  return useQuery({
    queryKey: ["quote", symbol],
    queryFn: () => fetchQuote(symbol),
    refetchInterval: 60_000,
    staleTime: 55_000,
    enabled: Boolean(symbol),
  });
}
