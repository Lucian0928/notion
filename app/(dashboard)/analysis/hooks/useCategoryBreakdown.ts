"use client";

import { useQuery } from "@tanstack/react-query";
import type { CategoryBreakdownRange, CategoryBreakdownResponse } from "@/types/notion";

async function fetchCategoryBreakdown(
  range: CategoryBreakdownRange
): Promise<CategoryBreakdownResponse> {
  const res = await fetch(`/api/get-category-breakdown?range=${range}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load category data");
  }

  return data;
}

export function useCategoryBreakdown(range: CategoryBreakdownRange) {
  return useQuery({
    queryKey: ["category-breakdown", range],
    queryFn: () => fetchCategoryBreakdown(range),
  });
}
