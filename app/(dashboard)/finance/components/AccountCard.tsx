import { forwardRef } from "react";
import type { Account } from "@/types/notion";

function formatBalance(amount: number, currency: string) {
  const prefix = currency === "USD" ? "USD " : "NTD ";
  return prefix + amount.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

export const AccountCard = forwardRef<
  HTMLButtonElement,
  { account: Account; onClick: () => void; isActive: boolean }
>(function AccountCard({ account, onClick, isActive }, ref) {
  const { id, cardName, cardNumber, currentBalance, background, currency } = account;

  return (
    <button
      ref={ref}
      data-account-id={id}
      onClick={onClick}
      className={`relative w-[380px] h-[240px] rounded-2xl shrink-0 snap-center text-left cursor-pointer appearance-none border-0 p-0 bg-transparent outline-none transition-transform duration-300 ease-out ${
        isActive ? "scale-100" : "scale-80"
      }`}
      style={{
        backgroundImage: `url(/cards/${background}.png)`,
        backgroundSize: "cover",
        backgroundPosition: "68% center",
      }}
    >
      <div
        className="absolute top-7 left-7 right-9 flex items-end justify-between gap-2"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
      >
        <span className="truncate font-card-mono font-semibold uppercase tracking-[0.15em] text-white">
          {cardName}
        </span>
        <span className="shrink-0 font-card-mono text-lg text-white">
          {formatBalance(currentBalance, currency)}
        </span>
      </div>

      <span className="absolute bottom-7 left-7 font-card-mono tracking-widest text-white">
        **** {cardNumber.slice(-4)}
      </span>
    </button>
  );
});
