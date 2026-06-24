"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryBreakdownRange } from "@/types/notion";
import { useCategoryBreakdown } from "../hooks/useCategoryBreakdown";

const COLORS = ["#FF7A00", "#E460B0", "#56D6AA", "#5B9EE8", "#E8C95B", "#B07AE8", "#E85B5B"];

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

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="h-64 w-full md:w-1/2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.categories}
              dataKey="total"
              nameKey="name"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.categories.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                background: "#141417",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {data.categories.map((c, i) => (
          <div key={c.name} className="flex items-center gap-2 text-xs text-neutral-300">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="truncate">{c.name}</span>
            <span className="ml-auto text-neutral-500">{formatCurrency(c.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
