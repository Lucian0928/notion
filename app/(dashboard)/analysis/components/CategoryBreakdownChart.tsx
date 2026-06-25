"use client";

import { DonutChart, GLOW_PALETTE } from "@/components/tremor/DonutChart";
import type { CategoryBreakdownRange } from "@/types/notion";
import { useCategoryBreakdown } from "../hooks/useCategoryBreakdown";

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

export function CategoryBreakdownChart({ range }: { range: CategoryBreakdownRange }) {
  const { data, isLoading, isError } = useCategoryBreakdown(range);

  if (isError) {
    return <div className="text-sm text-white">Failed to load</div>;
  }

  if (isLoading || !data) {
    return <div className="h-64 animate-pulse rounded-xl bg-white/5" />;
  }

  if (data.categories.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-neutral-500">
        No expense data for this period
      </div>
    );
  }

  const total = data.categories.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="h-64 w-full md:w-1/2">
        <DonutChart
          data={data.categories}
          category="name"
          value="total"
          glow
          valueFormatter={formatCurrency}
          label={formatCurrency(total)}
          className="h-64"
        />
      </div>

      <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {data.categories.map((c, i) => {
          const segment = GLOW_PALETTE[i % GLOW_PALETTE.length];
          return (
            <div key={c.name} className="flex items-center gap-2 text-xs text-neutral-300">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: segment.fill,
                  boxShadow: `0 0 6px ${segment.glow}`,
                }}
              />
              <span className="truncate">{c.name}</span>
              <span className="ml-auto text-neutral-500">{formatCurrency(c.total)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
