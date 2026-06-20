"use client";

import { useQuery } from "@tanstack/react-query";
import type { ExpenseResponse } from "@/types/notion";

async function fetchExpense(): Promise<ExpenseResponse> {
  const res = await fetch("/api/get-expense");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "讀取支出資料失敗");
  }

  return data;
}

export function useExpense() {
  return useQuery({ queryKey: ["expense"], queryFn: fetchExpense });
}
