"use client";

import { useQuery } from "@tanstack/react-query";
import type { IncomeResponse } from "@/types/notion";

async function fetchIncome(): Promise<IncomeResponse> {
  const res = await fetch("/api/get-income");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load income data");
  }

  return data;
}

export function useIncome() {
  return useQuery({ queryKey: ["income"], queryFn: fetchIncome });
}
