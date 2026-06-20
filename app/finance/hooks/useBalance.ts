"use client";

import { useQuery } from "@tanstack/react-query";
import type { BalanceResponse } from "@/types/notion";

async function fetchBalance(): Promise<BalanceResponse> {
  const res = await fetch("/api/get-balance");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "讀取餘額資料失敗");
  }

  return data;
}

export function useBalance() {
  return useQuery({ queryKey: ["balance"], queryFn: fetchBalance });
}
