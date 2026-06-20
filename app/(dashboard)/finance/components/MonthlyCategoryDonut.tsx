"use client";

import { DonutChart } from "@/components/tremor/DonutChart";
import { useCategoryBreakdown } from "../../analysis/hooks/useCategoryBreakdown";

const COLORS = ["blue", "emerald", "amber", "pink", "violet", "cyan", "lime"] as const;

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

const LEGEND_DOT_CLASS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-lime-500",
];

export function MonthlyCategoryDonut() {
  const { data, isLoading, isError } = useCategoryBreakdown("this_month");

  return (
    <div className="card-panel p-6 min-h-[320px] flex flex-col min-w-0">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-neutral-400 tracking-widest uppercase opacity-80">
          本月消費分類佔比
        </span>
      </div>

      {isError ? (
        <div className="text-sm text-white">讀取錯誤</div>
      ) : isLoading || !data ? (
        <div className="h-56 animate-pulse rounded-xl bg-white/5" />
      ) : data.categories.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-sm text-neutral-500">
          這個月還沒有支出資料
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <DonutChart
            data={data.categories}
            category="name"
            value="total"
            colors={[...COLORS]}
            valueFormatter={formatCurrency}
          />
          <div className="grid grid-cols-1 gap-2">
            {data.categories.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs text-neutral-300">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${LEGEND_DOT_CLASS[i % LEGEND_DOT_CLASS.length]}`}
                />
                <span className="truncate">{c.name}</span>
                <span className="ml-auto text-neutral-500">{formatCurrency(c.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
