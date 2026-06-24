"use client";

import { useQuery } from "@tanstack/react-query";
import type { RecentTransactionsResponse } from "@/types/notion";

async function fetchRecentTransactions(): Promise<RecentTransactionsResponse> {
  const res = await fetch("/api/get-recent-transactions");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load transactions");
  }

  return data;
}

export function useRecentTransactions() {
  return useQuery({ queryKey: ["recent-transactions"], queryFn: fetchRecentTransactions });
}
