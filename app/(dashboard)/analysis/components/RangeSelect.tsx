"use client";

import type { CategoryBreakdownRange } from "@/types/notion";

const OPTIONS: { value: CategoryBreakdownRange; label: string }[] = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "last_3_months", label: "Last 3 Months" },
  { value: "last_6_months", label: "Last 6 Months" },
  { value: "this_year", label: "This Year" },
];

export function RangeSelect({
  value,
  onChange,
}: {
  value: CategoryBreakdownRange;
  onChange: (range: CategoryBreakdownRange) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CategoryBreakdownRange)}
      className="bg-[#141417] text-xs text-neutral-300 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
