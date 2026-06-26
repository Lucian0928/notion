"use client";

import { useBalance } from "../hooks/useBalance";

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export function BalanceCard() {
  const { data, isLoading, isError } = useBalance();

  return (
    <div className="relative card-premium-orange p-4 h-[160px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-white/50 tracking-widest uppercase">
            Available Balance
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div>
          {isError ? (
            <div className="text-xl font-black text-white tracking-tighter">Connection failed</div>
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
