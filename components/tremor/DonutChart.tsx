"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  type AvailableChartColorsKeys,
  constructCategoryColors,
  getColorClassName,
} from "./chartColors";
import { cx } from "./utils";

export interface DonutChartProps<T extends object> {
  data: T[];
  category: keyof T & string;
  value: keyof T & string;
  colors?: AvailableChartColorsKeys[];
  variant?: "donut" | "pie";
  valueFormatter?: (value: number) => string;
  className?: string;
}

const DEFAULT_COLORS: AvailableChartColorsKeys[] = [
  "blue",
  "emerald",
  "amber",
  "pink",
  "violet",
  "cyan",
  "lime",
];

/**
 * Minimal donut/pie chart in the spirit of Tremor Raw's DonutChart API
 * (props, color-name system, variant prop), written from scratch rather
 * than vendored verbatim. The one behavior intentionally different from
 * Tremor's actual component: stroke is hardcoded to "none" with no
 * light/dark className, since Tremor's own default draws a visible
 * stroke-white / dark:stroke-gray-950 border between segments.
 */
export function DonutChart<T extends object>({
  data,
  category,
  value,
  colors = DEFAULT_COLORS,
  variant = "donut",
  valueFormatter = (v) => v.toString(),
  className,
}: DonutChartProps<T>) {
  const categories = data.map((d) => String(d[category]));
  const categoryColors = constructCategoryColors(categories, colors);

  return (
    <div className={cx("h-56 w-full min-w-0", className)}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <PieChart>
          <Pie
            data={data}
            nameKey={category}
            dataKey={value}
            cx="50%"
            cy="50%"
            innerRadius={variant === "donut" ? "65%" : "0%"}
            outerRadius="100%"
            stroke="none"
            isAnimationActive
          >
            {data.map((entry) => {
              const key = String(entry[category]);
              const color = categoryColors.get(key) ?? "gray";
              return <Cell key={key} className={getColorClassName(color, "fill")} />;
            })}
          </Pie>
          <Tooltip
            formatter={(val) => valueFormatter(Number(val))}
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
  );
}
