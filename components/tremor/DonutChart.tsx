"use client";

import { useId, useState } from "react";
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
  label?: string;
  className?: string;
  /**
   * Renders segments as separated, round-capped glowing arcs (Apple Watch
   * activity ring style) with a neon hex palette + per-segment SVG glow
   * filter, instead of a flat filled donut in the Tailwind chart colors.
   * Hand-drawn with raw SVG `<path>` arcs rather than Recharts' `Pie` —
   * Recharts doesn't reliably apply `strokeLinecap` to Pie/Cell, so it can't
   * produce the round arc end-caps this look needs.
   */
  glow?: boolean;
  /** Gap (in degrees) between segments. Ignored when `glow` is set, which uses its own fixed gap so the round stroke caps have room to render. */
  paddingAngle?: number;
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

// 14 distinct hues (Tailwind's 400 shades, so they share the same
// saturation/lightness family as the original 4) — covers the Expense
// Categories database's 13 categories with one to spare, so colors don't
// have to repeat (cycling the old 4-color palette meant e.g. category #5
// reused category #1's color).
export const GLOW_PALETTE = [
  { fill: "#60A5FA", glow: "rgba(96,165,250,0.7)" }, // blue
  { fill: "#34D399", glow: "rgba(52,211,153,0.7)" }, // emerald
  { fill: "#FBBF24", glow: "rgba(251,191,36,0.7)" }, // amber
  { fill: "#A78BFA", glow: "rgba(167,139,250,0.7)" }, // violet
  { fill: "#FB7185", glow: "rgba(251,113,133,0.7)" }, // rose
  { fill: "#22D3EE", glow: "rgba(34,211,238,0.7)" }, // cyan
  { fill: "#FB923C", glow: "rgba(251,146,60,0.7)" }, // orange
  { fill: "#A3E635", glow: "rgba(163,230,53,0.7)" }, // lime
  { fill: "#E879F9", glow: "rgba(232,121,249,0.7)" }, // fuchsia
  { fill: "#2DD4BF", glow: "rgba(45,212,191,0.7)" }, // teal
  { fill: "#38BDF8", glow: "rgba(56,189,248,0.7)" }, // sky
  { fill: "#818CF8", glow: "rgba(129,140,248,0.7)" }, // indigo
  { fill: "#FACC15", glow: "rgba(250,204,21,0.7)" }, // yellow
  { fill: "#F472B6", glow: "rgba(244,114,182,0.7)" }, // pink
];

// Viewport for the hand-drawn glow ring, plus the stroke width and ring
// radius (in the same units) — kept as plain numbers since the path math
// below needs to place real coordinates, not percentages. The viewBox is
// bigger than the ring itself (ring radius 74 vs. half-extent 120) so each
// segment's name/amount label has room to sit just outside the ring without
// getting clipped by the SVG's edge.
const GLOW_VIEWBOX_SIZE = 240;
const GLOW_CENTER = GLOW_VIEWBOX_SIZE / 2;
const GLOW_RADIUS = 74;
const GLOW_LABEL_RADIUS = 96;
const GLOW_LABEL_NAME_MAX_LENGTH = 8;
// Thinner stroke than a 2-category chart needs, because a real category
// breakdown can have 8-13 slices (see expense_categories database) with very
// uneven shares — a thick stroke's round-cap bulge is fixed in degrees
// regardless of how small a slice is, so on a small slice it can bulge
// past that slice's own half-width into its neighbor (the "stuck together"
// dots bug). Keeping the stroke thin keeps that bulge small enough to fit
// inside even the smallest real category's half-span.
const GLOW_STROKE_WIDTH = 12;
// `strokeLinecap="round"` extends each arc's visible stroke past its
// mathematical endpoint by strokeWidth/2 — convert that to degrees of arc at
// this radius, since the inset has to clear it before adding any visual gap.
const GLOW_CAP_BULGE_DEGREES = (GLOW_STROKE_WIDTH / 2 / GLOW_RADIUS) * (180 / Math.PI);
// Degrees trimmed off each end of a segment's raw angular span, so adjacent
// arcs (including their round end-caps) leave a real visible gap instead of
// overlapping or touching.
const GLOW_GAP_DEGREES = GLOW_CAP_BULGE_DEGREES + 2;

function polarToPoint(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: GLOW_CENTER + GLOW_RADIUS * Math.sin(rad),
    y: GLOW_CENTER - GLOW_RADIUS * Math.cos(rad),
  };
}

function arcPath(startAngle: number, endAngle: number) {
  const start = polarToPoint(startAngle);
  const end = polarToPoint(endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${GLOW_RADIUS} ${GLOW_RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

function computeArcs<T extends object>(
  data: T[],
  category: keyof T & string,
  value: keyof T & string
) {
  const total = data.reduce((sum, entry) => sum + (Number(entry[value]) || 0), 0);

  const arcs: {
    key: string;
    percent: number;
    startAngle: number;
    endAngle: number;
    paletteIndex: number;
  }[] = [];
  let cumulativeAngle = 0;
  for (const [index, entry] of data.entries()) {
    const raw = Number(entry[value]) || 0;
    const percent = total > 0 ? raw / total : 0;
    const rawStart = cumulativeAngle;
    const rawEnd = cumulativeAngle + percent * 360;
    cumulativeAngle = rawEnd;

    const span = rawEnd - rawStart;
    const inset = Math.max(0, Math.min(GLOW_GAP_DEGREES, span / 2 - 0.01));

    arcs.push({
      key: String(entry[category]),
      percent: percent * 100,
      startAngle: rawStart + inset,
      endAngle: rawEnd - inset,
      paletteIndex: index % GLOW_PALETTE.length,
    });
  }

  return arcs;
}

function truncateLabel(name: string) {
  if (name.length <= GLOW_LABEL_NAME_MAX_LENGTH) return name;
  return `${name.slice(0, GLOW_LABEL_NAME_MAX_LENGTH - 1)}…`;
}

function GlowDonut<T extends object>({
  data,
  category,
  value,
  filterIdPrefix,
}: {
  data: T[];
  category: keyof T & string;
  value: keyof T & string;
  filterIdPrefix: string;
}) {
  const arcs = computeArcs(data, category, value);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <svg
      viewBox={`0 0 ${GLOW_VIEWBOX_SIZE} ${GLOW_VIEWBOX_SIZE}`}
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        {GLOW_PALETTE.map((segment, i) => (
          <filter
            key={segment.fill}
            id={`${filterIdPrefix}-glow-${i}`}
            filterUnits="userSpaceOnUse"
            x={-GLOW_VIEWBOX_SIZE}
            y={-GLOW_VIEWBOX_SIZE}
            width={GLOW_VIEWBOX_SIZE * 3}
            height={GLOW_VIEWBOX_SIZE * 3}
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              floodColor={segment.fill}
              floodOpacity="0.85"
            />
          </filter>
        ))}
      </defs>
      {arcs.map((arc) => {
        if (arc.endAngle <= arc.startAngle) return null;
        const segment = GLOW_PALETTE[arc.paletteIndex];
        return (
          <path
            key={arc.key}
            d={arcPath(arc.startAngle, arc.endAngle)}
            fill="none"
            stroke={segment.fill}
            strokeWidth={GLOW_STROKE_WIDTH}
            strokeLinecap="round"
            filter={`url(#${filterIdPrefix}-glow-${arc.paletteIndex})`}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredKey(arc.key)}
            onMouseLeave={() => setHoveredKey(null)}
          />
        );
      })}
      {arcs.map((arc) => {
        if (arc.endAngle <= arc.startAngle) return null;
        if (arc.key !== hoveredKey) return null;
        const midAngle = (arc.startAngle + arc.endAngle) / 2;
        const rad = (midAngle * Math.PI) / 180;
        const x = GLOW_CENTER + GLOW_LABEL_RADIUS * Math.sin(rad);
        const y = GLOW_CENTER - GLOW_LABEL_RADIUS * Math.cos(rad);
        const dx = x - GLOW_CENTER;
        const anchor = dx > 8 ? "start" : dx < -8 ? "end" : "middle";

        return (
          <text
            key={arc.key}
            x={x}
            y={y}
            textAnchor={anchor}
            fontSize="10"
            pointerEvents="none"
          >
            <tspan x={x} dy="-2" fontWeight="700" fill="rgba(255,255,255,0.92)">
              {truncateLabel(arc.key)}
            </tspan>
            <tspan x={x} dy="12" fill="rgba(255,255,255,0.55)">
              {Math.round(arc.percent)}%
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}

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
  label,
  className,
  glow = false,
  paddingAngle = 0,
}: DonutChartProps<T>) {
  const categories = data.map((d) => String(d[category]));
  const categoryColors = constructCategoryColors(categories, colors);
  const filterIdPrefix = useId().replace(/:/g, "");

  return (
    <div className={cx("relative h-56 w-full min-w-0", className)}>
      {label ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-lg font-bold text-white">{label}</span>
        </div>
      ) : null}

      {glow ? (
        <GlowDonut data={data} category={category} value={value} filterIdPrefix={filterIdPrefix} />
      ) : (
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
              paddingAngle={paddingAngle}
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
      )}
    </div>
  );
}
