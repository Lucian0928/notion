"use client";

import { useQuery } from "@tanstack/react-query";
import type { NetWorthResponse } from "@/types/notion";

async function fetchNetWorth(): Promise<NetWorthResponse> {
  const res = await fetch("/api/get-net-worth");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load net worth data");
  }

  return data;
}

export function useNetWorth() {
  return useQuery({ queryKey: ["net-worth"], queryFn: fetchNetWorth });
}
