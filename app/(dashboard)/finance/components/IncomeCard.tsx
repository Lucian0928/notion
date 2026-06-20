"use client";

import { useIncome } from "../hooks/useIncome";

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export function IncomeCard() {
  const { data, isLoading, isError } = useIncome();

  return (
    <div className="relative card-premium-teal p-6 min-h-[160px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[45%] h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[10px] bg-white/20 blur-[5px] rounded-full pointer-events-none z-10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30%] h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40px] h-[6px] bg-white/10 blur-[4px] rounded-full pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-1" />

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-white/50 tracking-widest uppercase">
            Monthly Income
          </span>
          <svg
            className="w-5 h-5 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941"
            />
          </svg>
        </div>

        <div>
          {isError ? (
            <div className="text-2xl font-black text-white tracking-tighter">讀取錯誤</div>
          ) : (
            <div
              className={`text-5xl font-black text-white tracking-tighter text-glow ${
                isLoading ? "animate-pulse" : ""
              }`}
            >
              {isLoading ? "Loading..." : formatCurrency(data!.total)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
