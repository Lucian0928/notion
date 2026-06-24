"use client";

import { useQuery } from "@tanstack/react-query";
import type { TrendResponse } from "@/types/notion";

async function fetchTrend(): Promise<TrendResponse> {
  const res = await fetch("/api/get-trend");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load trend data");
  }

  return data;
}

export function useTrend() {
  return useQuery({ queryKey: ["trend"], queryFn: fetchTrend });
}
