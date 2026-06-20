"use client";

import { useQuery } from "@tanstack/react-query";
import type { CashflowResponse } from "@/types/notion";

async function fetchCashflow(): Promise<CashflowResponse> {
  const res = await fetch("/api/get-cashflow");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "讀取現金流資料失敗");
  }

  return data;
}

export function useCashflow() {
  return useQuery({ queryKey: ["cashflow"], queryFn: fetchCashflow });
}
