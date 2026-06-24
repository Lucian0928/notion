"use client";

import { useQuery } from "@tanstack/react-query";
import type { AccountsResponse } from "@/types/notion";

async function fetchAccounts(): Promise<AccountsResponse> {
  const res = await fetch("/api/get-accounts");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load account data");
  }

  return data;
}

export function useAccounts() {
  return useQuery({ queryKey: ["accounts"], queryFn: fetchAccounts });
}
