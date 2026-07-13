"use client";

import { useQuery } from "@tanstack/react-query";
import type { BalanceResponse } from "@/types/notion";

async function fetchSavings(): Promise<BalanceResponse> {
  const res = await fetch("/api/get-savings");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load savings data");
  }

  return data;
}

export function useSavings() {
  return useQuery({ queryKey: ["savings"], queryFn: fetchSavings });
}
