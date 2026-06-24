import type { Account } from "@/types/notion";

function formatBalance(amount: number) {
  return "NTD " + amount.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

export function AccountCard({ cardName, cardNumber, currentBalance }: Account) {
  return (
    <div
      className="relative w-[380px] h-[240px] rounded-2xl shrink-0 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]"
      style={{
        backgroundImage: "url(/cards/post-office.png)",
        backgroundSize: "cover",
        backgroundPosition: "68% center",
      }}
    >
      <span
        className="absolute top-5 left-6 right-28 truncate font-card-display font-semibold uppercase tracking-[0.15em] text-white"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
      >
        {cardName}
      </span>

      <span className="absolute top-5 right-6 font-card-mono text-sm text-white">
        {formatBalance(currentBalance)}
      </span>

      <span className="absolute bottom-5 left-6 font-card-mono tracking-widest text-white">
        **** {cardNumber.slice(-4)}
      </span>
    </div>
  );
}
