"use client";

import { useState } from "react";
import { useCreateAccount } from "../hooks/useCreateAccount";

const BACKGROUND_OPTIONS = ["post-office"];

export function AddAccountModal({ onClose }: { onClose: () => void }) {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [background, setBackground] = useState(BACKGROUND_OPTIONS[0]);
  const { mutate, isPending, error } = useCreateAccount();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(
      { cardName, cardNumber, initialBalance: Number(initialBalance) || 0 },
      { onSuccess: onClose }
    );
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
        <h2 className="text-lg font-bold text-white">Add Account</h2>

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
            Background Image
          </label>
          <select
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/30"
          >
            {BACKGROUND_OPTIONS.map((option) => (
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
            {isPending ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
