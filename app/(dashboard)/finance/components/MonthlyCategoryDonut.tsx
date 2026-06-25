"use client";

import { DonutChart, GLOW_PALETTE } from "@/components/tremor/DonutChart";
import { useCategoryBreakdown } from "../../analysis/hooks/useCategoryBreakdown";

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

export function MonthlyCategoryDonut({ className = "" }: { className?: string }) {
  const { data, isLoading, isError } = useCategoryBreakdown("this_month");
  const total = data?.categories.reduce((sum, c) => sum + c.total, 0) ?? 0;

  return (
    <div className={`card-liquid-glass p-6 flex flex-col ${className}`}>
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-neutral-400 tracking-widest uppercase opacity-80">
            Monthly Categories
          </span>
        </div>

        {isError ? (
          <div className="text-sm text-white">Failed to load</div>
        ) : isLoading || !data ? (
          <div className="h-56 animate-pulse rounded-xl bg-white/5" />
        ) : data.categories.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-sm text-neutral-500">
            No expenses this month
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 gap-2">
            <DonutChart
              data={data.categories}
              category="name"
              value="total"
              glow
              valueFormatter={formatCurrency}
              label={formatCurrency(total)}
            />
            <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-1 gap-2 content-start">
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
        )}
      </div>
    </div>
  );
}
