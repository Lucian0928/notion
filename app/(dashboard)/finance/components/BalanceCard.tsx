"use client";

import { useBalance } from "../hooks/useBalance";

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export function BalanceCard() {
  const { data, isLoading, isError } = useBalance();

  return (
    <div className="card-minimal p-5 h-[160px] flex flex-col justify-between">
      <span className="text-[11px] font-medium text-white/40 tracking-[0.08em] uppercase">
        Available Balance
      </span>

      {isError ? (
        <div className="text-lg font-medium text-white/70">Connection failed</div>
      ) : (
        <div
          className={`text-3xl font-semibold text-white tabular-nums tracking-tight ${
            isLoading ? "animate-pulse text-white/40" : ""
          }`}
        >
          {isLoading ? "—" : formatCurrency(data!.total)}
        </div>
      )}
    </div>
  );
}
