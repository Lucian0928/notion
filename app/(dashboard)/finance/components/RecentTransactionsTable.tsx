"use client";

import { useRecentTransactions } from "../hooks/useRecentTransactions";

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

function formatDate(dateStr: string) {
  return dateStr.slice(0, 10);
}

const TYPE_BADGE_CLASS: Record<string, string> = {
  Income: "badge-pill badge-pill-success",
  Expense: "badge-pill badge-pill-danger",
  Transfer: "badge-pill badge-pill-warning",
};

export function RecentTransactionsTable() {
  const { data, isLoading, isError } = useRecentTransactions();

  return (
    <div className="card-liquid-glass p-6">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-neutral-400 tracking-widest uppercase opacity-80">
            Recent Transactions
          </span>
        </div>

        {isError ? (
          <div className="text-sm text-white">Failed to load</div>
        ) : isLoading || !data ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : data.transactions.length === 0 ? (
          <div className="py-8 text-center text-sm text-neutral-500">No transactions yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase tracking-wide">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((t) => (
                <tr key={t.id} className="border-t border-white/5">
                  <td className="py-3 text-white">{t.name || "—"}</td>
                  <td className="py-3 text-white">{formatCurrency(t.amount)}</td>
                  <td className="py-3 text-neutral-400">{formatDate(t.date)}</td>
                  <td className="py-3">
                    <span className={TYPE_BADGE_CLASS[t.type] ?? "badge-pill"}>
                      {t.type || "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
