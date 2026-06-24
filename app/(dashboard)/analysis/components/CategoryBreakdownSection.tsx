"use client";

import { useState } from "react";
import type { CategoryBreakdownRange } from "@/types/notion";
import { CategoryBreakdownChart } from "./CategoryBreakdownChart";
import { RangeSelect } from "./RangeSelect";

export function CategoryBreakdownSection() {
  const [range, setRange] = useState<CategoryBreakdownRange>("this_month");

  return (
    <div className="card-panel p-6 min-h-[320px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-neutral-400 tracking-widest uppercase opacity-80">
          Spending by Category
        </span>
        <RangeSelect value={range} onChange={setRange} />
      </div>
      <CategoryBreakdownChart range={range} />
    </div>
  );
}
