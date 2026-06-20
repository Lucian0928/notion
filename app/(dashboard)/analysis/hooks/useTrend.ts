"use client";

import { useQuery } from "@tanstack/react-query";
import type { TrendResponse } from "@/types/notion";

async function fetchTrend(): Promise<TrendResponse> {
  const res = await fetch("/api/get-trend");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "讀取趨勢資料失敗");
  }

  return data;
}

export function useTrend() {
  return useQuery({ queryKey: ["trend"], queryFn: fetchTrend });
}
