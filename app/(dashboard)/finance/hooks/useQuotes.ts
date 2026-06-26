"use client";

import { useQuery } from "@tanstack/react-query";
interface QuotesResponse { quotes: unknown[]; fetchedAt: number; }

async function fetchQuotes(): Promise<QuotesResponse> {
  const res = await fetch("/api/get-quotes");
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "Failed to load quotes");
  return data;
}

export function useQuotes() {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: fetchQuotes,
    refetchInterval: 60_000,
    staleTime: 55_000,
  });
}
