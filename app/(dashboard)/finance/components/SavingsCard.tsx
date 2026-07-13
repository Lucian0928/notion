"use client";

import { useSavings } from "../hooks/useSavings";

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export function SavingsCard() {
  const { data, isLoading, isError } = useSavings();

  return (
    <div className="relative card-premium-purple p-4 h-[160px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-white/50 tracking-widest uppercase">
            Savings
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
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
