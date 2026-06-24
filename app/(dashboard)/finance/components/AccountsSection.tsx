"use client";

import { useState } from "react";
import { useAccounts } from "../hooks/useAccounts";
import { AccountCard } from "./AccountCard";
import { AddAccountModal } from "./AddAccountModal";

export function AccountsSection() {
  const { data, isLoading, isError } = useAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section>
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {isError ? (
          <div className="text-sm text-white">Failed to load accounts</div>
        ) : isLoading || !data ? (
          <div className="w-[380px] h-[240px] rounded-2xl bg-white/5 animate-pulse shrink-0" />
        ) : (
          data.accounts.map((account) => <AccountCard key={account.id} {...account} />)
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 w-[160px] h-[240px] rounded-2xl border border-dashed border-white/20 text-sm font-bold text-neutral-400 hover:text-white hover:border-white/40 transition-colors"
        >
          + Add Account
        </button>
      </div>

      {isModalOpen ? <AddAccountModal onClose={() => setIsModalOpen(false)} /> : null}
    </section>
  );
}
