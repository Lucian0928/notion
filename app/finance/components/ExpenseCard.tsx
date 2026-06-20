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
    <div className="relative card-premium-pink p-6 min-h-[160px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[45%] h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[10px] bg-white/20 blur-[5px] rounded-full pointer-events-none z-10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30%] h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40px] h-[6px] bg-white/10 blur-[4px] rounded-full pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-1" />

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-[#E5C3D5] tracking-widest uppercase opacity-80">
            Monthly Expense
          </span>
          {!isLoading && !isError && <TrendIcon direction={direction} />}
        </div>

        <div>
          {isError ? (
            <div className="text-2xl font-black text-white mb-1 tracking-tighter">讀取錯誤</div>
          ) : (
            <>
              <div
                className={`text-4xl font-black text-white mb-1 tracking-tighter text-glow ${
                  isLoading ? "animate-pulse" : ""
                }`}
              >
                {isLoading ? "Loading..." : formatCurrency(data!.total)}
              </div>
              <div
                className={`text-xs font-bold tracking-wide ${
                  isLoading ? "animate-pulse text-[#E460B0]" : momColor
                }`}
              >
                {isLoading
                  ? "Calculating..."
                  : `(${mom > 0 ? "+" : "-"}${Math.abs(mom).toFixed(1)}% MoM)`}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
