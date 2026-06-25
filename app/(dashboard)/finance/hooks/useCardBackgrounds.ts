"use client";

import { useQuery } from "@tanstack/react-query";
import type { CardBackgroundsResponse } from "@/types/notion";

async function fetchCardBackgrounds(): Promise<CardBackgroundsResponse> {
  const res = await fetch("/api/card-backgrounds");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load card backgrounds");
  }

  return data;
}

export function useCardBackgrounds() {
  return useQuery({ queryKey: ["card-backgrounds"], queryFn: fetchCardBackgrounds });
}
