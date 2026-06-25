"use client";

import { useId, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTrend } from "../hooks/useTrend";

const DEFAULT_EXPENSE_COLOR = "#EC4899";
const DEFAULT_INCOME_COLOR = "#34D399";
const EXPENSE_COLOR_STORAGE_KEY = "trend-chart-expense-color";
const INCOME_COLOR_STORAGE_KEY = "trend-chart-income-color";

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

function getStoredColor(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) ?? fallback;
}

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const COLOR_SWATCH_CLASS =
  "h-6 w-6 cursor-pointer appearance-none rounded-full border border-white/10 bg-transparent p-0 " +
  "[&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none " +
  "[&::-webkit-color-swatch-wrapper]:rounded-full [&::-webkit-color-swatch-wrapper]:p-0 " +
  "[&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none";

function ColorPickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-neutral-400">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={COLOR_SWATCH_CLASS}
      />
      <span>{label}</span>
    </label>
  );
}

export function TrendChart() {
  const { data, isLoading, isError } = useTrend();
  const [expenseColor, setExpenseColor] = useState(() =>
    getStoredColor(EXPENSE_COLOR_STORAGE_KEY, DEFAULT_EXPENSE_COLOR)
  );
  const [incomeColor, setIncomeColor] = useState(() =>
    getStoredColor(INCOME_COLOR_STORAGE_KEY, DEFAULT_INCOME_COLOR)
  );
  const idPrefix = useId().replace(/:/g, "");

  function handleExpenseColorChange(value: string) {
    setExpenseColor(value);
    localStorage.setItem(EXPENSE_COLOR_STORAGE_KEY, value);
  }

  function handleIncomeColorChange(value: string) {
    setIncomeColor(value);
    localStorage.setItem(INCOME_COLOR_STORAGE_KEY, value);
  }

  if (isError) {
    return <div className="text-sm text-white">Failed to load</div>;
  }

  if (isLoading || !data) {
    return <div className="h-72 animate-pulse rounded-xl bg-white/5" />;
  }

  const gradientIncomeId = `${idPrefix}-gradient-income`;
  const gradientExpenseId = `${idPrefix}-gradient-expense`;
  const glowIncomeId = `${idPrefix}-glow-income`;
  const glowExpenseId = `${idPrefix}-glow-expense`;

  return (
    <div>
      <div className="flex items-center gap-4 mb-3">
        <ColorPickerField label="Expense" value={expenseColor} onChange={handleExpenseColorChange} />
        <ColorPickerField label="Income" value={incomeColor} onChange={handleIncomeColorChange} />
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.months} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradientExpenseId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={hexToRgba(expenseColor, 0.6)} />
                <stop offset="100%" stopColor={hexToRgba(expenseColor, 0)} />
              </linearGradient>
              <linearGradient id={gradientIncomeId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={hexToRgba(incomeColor, 0.6)} />
                <stop offset="100%" stopColor={hexToRgba(incomeColor, 0)} />
              </linearGradient>
              <filter id={glowExpenseId} x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="3"
                  floodColor={expenseColor}
                  floodOpacity="0.8"
                />
              </filter>
              <filter id={glowIncomeId} x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="3"
                  floodColor={incomeColor}
                  floodOpacity="0.8"
                />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                background: "#141417",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke={incomeColor}
              strokeWidth={2}
              fill={`url(#${gradientIncomeId})`}
              fillOpacity={1}
              filter={`url(#${glowIncomeId})`}
              dot={{ r: 3 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke={expenseColor}
              strokeWidth={2}
              fill={`url(#${gradientExpenseId})`}
              fillOpacity={1}
              filter={`url(#${glowExpenseId})`}
              dot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
