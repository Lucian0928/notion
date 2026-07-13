import { AccountsSection } from "./components/AccountsSection";
import { BalanceCard } from "./components/BalanceCard";
import { ExpenseCard } from "./components/ExpenseCard";
import { IncomeCard } from "./components/IncomeCard";
import { SavingsCard } from "./components/SavingsCard";
import { StocksCard } from "./components/StocksCard";
import { MonthlyCategoryDonut } from "./components/MonthlyCategoryDonut";
import { RecentTransactionsTable } from "./components/RecentTransactionsTable";

export default function FinancePage() {
  return (
    <main className="flex-1 p-10 overflow-y-auto relative z-10">
      <div className="space-y-12" style={{ zoom: 0.8 }}>
        <AccountsSection />

        <section className="max-w-5xl flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:basis-2/3 min-w-0 grid grid-cols-2 gap-4">
              <BalanceCard />
              <SavingsCard />
              <ExpenseCard />
              <IncomeCard />
            </div>
            <StocksCard className="lg:basis-1/3 min-w-0" />
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-8">
            <RecentTransactionsTable className="lg:basis-2/3 min-w-0" />
            <MonthlyCategoryDonut className="lg:basis-1/3 min-w-0" />
          </div>
        </section>
      </div>
    </main>
  );
}
