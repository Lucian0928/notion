"use client";

import { useNetWorth } from "../hooks/useNetWorth";

function formatTWD(amount: number) {
  return "NT$ " + amount.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatUSD(amount: number) {
  return "US$ " + amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export function NetWorthCard({ className = "" }: { className?: string }) {
  const { data, isLoading, isError } = useNetWorth();

  const hasUsd = Boolean(data && data.usdTotal !== 0);

  return (
    <div className={`card-liquid-glass px-6 py-5 flex flex-col gap-2 ${className}`}>
      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-neutral-400 tracking-widest uppercase opacity-80">
            Net Worth · All Accounts
          </span>
          {data?.rate ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white/40 bg-white/5">
              USD/TWD {data.rate.toFixed(2)}
            </span>
          ) : null}
        </div>

        {isError ? (
          <div className="text-xl font-black text-white tracking-tighter">Connection failed</div>
        ) : isLoading || !data ? (
          <div className="text-3xl font-black text-white tracking-tighter animate-pulse">
            Loading...
          </div>
        ) : (
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-3xl font-black text-white tracking-tighter text-glow">
              {formatTWD(data.netWorthTWD)}
            </span>
            {hasUsd ? (
              <span className="text-xs text-white/40">
                {formatTWD(data.twdTotal)} + {formatUSD(data.usdTotal)}
                {data.rate ? ` × ${data.rate.toFixed(2)}` : " (rate unavailable)"}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
