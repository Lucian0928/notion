"use client";

import { useEffect, useRef, useState } from "react";
import type { Account } from "@/types/notion";
import { useAccounts } from "../hooks/useAccounts";
import { AccountCard } from "./AccountCard";
import { AccountModal } from "./AccountModal";

export function AccountsSection() {
  const { data, isLoading, isError } = useAccounts();
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !data) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestId: string | null = null;
        let bestRatio = 0;

        for (const entry of entries) {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestId = entry.target.getAttribute("data-account-id");
          }
        }

        if (bestId) setActiveId(bestId);
      },
      {
        root: container,
        rootMargin: "0px -45% 0px -45%",
        threshold: Array.from({ length: 21 }, (_, i) => i / 20),
      }
    );

    cardRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [data]);

  return (
    <section>
      <div
        ref={containerRef}
        className="flex items-center gap-4 overflow-x-auto pb-2 px-[calc((100%-380px)/2)] scrollbar-hide snap-x snap-mandatory"
      >
        {isError ? (
          <div className="text-sm text-white">Failed to load accounts</div>
        ) : isLoading || !data ? (
          <div className="w-[380px] h-[240px] rounded-2xl bg-white/5 animate-pulse shrink-0" />
        ) : (
          data.accounts.map((account) => (
            <AccountCard
              key={account.id}
              ref={(el) => {
                if (el) cardRefs.current.set(account.id, el);
                else cardRefs.current.delete(account.id);
              }}
              account={account}
              isActive={activeId === account.id}
              onClick={() => setEditingAccount(account)}
            />
          ))
        )}

        <button
          onClick={() => setIsAddingAccount(true)}
          className="shrink-0 w-[160px] h-[240px] rounded-2xl border border-dashed border-white/20 text-sm font-bold text-neutral-400 hover:text-white hover:border-white/40 transition-colors snap-center"
        >
          + Add Account
        </button>
      </div>

      {isAddingAccount ? <AccountModal onClose={() => setIsAddingAccount(false)} /> : null}
      {editingAccount ? (
        <AccountModal account={editingAccount} onClose={() => setEditingAccount(null)} />
      ) : null}
    </section>
  );
}
