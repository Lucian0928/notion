import { BalanceCard } from "./components/BalanceCard";
import { ExpenseCard } from "./components/ExpenseCard";

export default function FinancePage() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 h-screen border-r border-white/5 p-6 flex flex-col justify-between sticky top-0 shrink-0 z-10 bg-[#08080a]/60 backdrop-blur-xl">
        <nav className="space-y-2 mt-4">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#141417]/80 text-brand border border-white/5 font-semibold shadow-[0_0_10px_rgba(255,122,0,0.02)]"
          >
            <svg
              className="w-5 h-5 text-brand"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"
              />
            </svg>
            <span>Overview</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-white/5 transition-all duration-200"
          >
            <svg
              className="w-5 h-5 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <span>Transactions</span>
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto relative z-10">
        <div className="space-y-12">
          <div className="max-w-4xl flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white tracking-tight">Finance Overview</h1>
          </div>

          <section className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <ExpenseCard />
            <BalanceCard />
          </section>
        </div>
      </main>
    </div>
  );
}
