"use client";

import { useExpense } from "../hooks/useExpense";
import { TrendIcon } from "./TrendIcon";

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export function ExpenseCard() {
  const { data, isLoading, isError } = useExpense();
  const mom = data?.mom ?? 0;
  const direction = mom > 0 ? "up" : "down";
  const momColor = mom > 0 ? "text-[#E460B0]" : "text-[#76A88A]";

  return (
    <div className="relative card-premium-pink p-4 h-[160px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-white/50 tracking-widest uppercase">
            Monthly Expense
          </span>
          {!isLoading && !isError && <TrendIcon direction={direction} />}
        </div>

        <div className="relative">
          {isError ? (
            <div className="text-xl font-black text-white tracking-tighter">
              Failed to load
            </div>
          ) : (
            <div
              className={`text-3xl font-black text-white tracking-tighter text-glow ${
                isLoading ? "animate-pulse" : ""
              }`}
            >
              {isLoading ? "Loading..." : formatCurrency(data!.total)}
            </div>
          )}
          {!isError && (
            <div
              className={`absolute right-0 bottom-0 text-xs font-bold tracking-wide ${
                isLoading ? "animate-pulse text-[#E460B0]" : momColor
              }`}
            >
              {isLoading
                ? "..."
                : `${mom > 0 ? "+" : "-"}${Math.abs(mom).toFixed(1)}% MoM`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
