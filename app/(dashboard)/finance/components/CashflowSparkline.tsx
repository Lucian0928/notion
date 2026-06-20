"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { useCashflow } from "../hooks/useCashflow";

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

function formatShortDate(dateStr: string) {
  const [, month, day] = dateStr.split("-");
  return `${Number(month)}/${Number(day)}`;
}

export function CashflowSparkline() {
  const { data, isLoading, isError } = useCashflow();

  return (
    <div className="card-panel p-6 min-h-[220px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-neutral-400 tracking-widest uppercase opacity-80">
          近 7 天現金流
        </span>
      </div>

      {isError ? (
        <div className="text-sm text-white">讀取錯誤</div>
      ) : isLoading || !data ? (
        <div className="h-40 animate-pulse rounded-xl bg-white/5" />
      ) : (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.days} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => formatShortDate(String(label))}
                contentStyle={{
                  background: "#141417",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#FF7A00"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
