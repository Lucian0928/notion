"use client";

import { useQuery } from "@tanstack/react-query";
import type { AccountsResponse } from "@/types/notion";

async function fetchSavings(): Promise<AccountsResponse> {
  const res = await fetch("/api/get-savings");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load savings data");
  }

  return data;
}

export function useSavings() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["savings"],
    queryFn: fetchSavings,
  });

  const savings = data?.accounts[0];

  return { savings, isLoading, isError };
}
