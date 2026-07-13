"use client";

import { useState } from "react";
import type { Account } from "@/types/notion";
import { useCardBackgrounds } from "../hooks/useCardBackgrounds";
import { useCreateAccount } from "../hooks/useCreateAccount";
import { useUpdateAccount } from "../hooks/useUpdateAccount";

export function AccountModal({ account, onClose }: { account?: Account; onClose: () => void }) {
  const isEdit = Boolean(account);
  const [cardName, setCardName] = useState(account?.cardName ?? "");
  const [cardNumber, setCardNumber] = useState(account?.cardNumber ?? "");
  const [initialBalance, setInitialBalance] = useState(
    account ? String(account.initialBalance) : ""
  );
  const { data: backgroundsData } = useCardBackgrounds();
  const backgroundOptions = backgroundsData?.backgrounds ?? [];
  const [background, setBackground] = useState(account?.background ?? "");
  const [currency, setCurrency] = useState(account?.currency ?? "TWD");

  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const { isPending, error } = isEdit ? updateAccount : createAccount;

  const resolvedBackground = background || backgroundOptions[0] || "post-office";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEdit && account) {
      updateAccount.mutate(
        {
          id: account.id,
          cardName,
          cardNumber,
          initialBalance: Number(initialBalance) || 0,
          background: resolvedBackground,
          currency,
        },
        { onSuccess: onClose }
      );
    } else {
      createAccount.mutate(
        {
          cardName,
          cardNumber,
          initialBalance: Number(initialBalance) || 0,
          background: resolvedBackground,
          currency,
        },
        { onSuccess: onClose }
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="card-panel w-full max-w-sm p-6 space-y-4"
      >
        <h2 className="text-lg font-bold text-white">{isEdit ? "Edit Account" : "Add Account"}</h2>

        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-400 tracking-widest uppercase">
            Card Name
          </label>
          <input
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/30"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-400 tracking-widest uppercase">
            Card Number
          </label>
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/30"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-400 tracking-widest uppercase">
            Initial Balance
          </label>
          <input
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            placeholder="0"
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/30"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-400 tracking-widest uppercase">
            Currency
          </label>
          <div className="flex gap-2">
            {["TWD", "USD"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCurrency(option)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                  currency === option
                    ? "border-white/40 bg-white/15 text-white"
                    : "border-white/10 bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-400 tracking-widest uppercase">
            Background Image
          </label>
          <select
            value={resolvedBackground}
            onChange={(e) => setBackground(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/30"
          >
            {backgroundOptions.map((option) => (
              <option key={option} value={option} className="bg-neutral-900">
                {option}
              </option>
            ))}
          </select>
        </div>

        {error ? <div className="text-sm text-red-400">{error.message}</div> : null}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-brand text-white disabled:opacity-50"
          >
            {isPending ? "Saving..." : isEdit ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
