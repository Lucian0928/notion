"use client";

import { useIncome } from "../hooks/useIncome";

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export function IncomeCard() {
  const { data, isLoading, isError } = useIncome();

  return (
    <div className="relative card-premium-teal p-4 min-h-[120px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-white/50 tracking-widest uppercase">
            Monthly Income
          </span>
          <svg
            className="w-4 h-4 text-white/40"
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
            <div className="text-xl font-black text-white tracking-tighter">Failed to load</div>
          ) : (
            <div
              className={`text-3xl font-black text-white tracking-tighter text-glow ${
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
