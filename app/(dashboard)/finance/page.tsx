import { AccountsSection } from "./components/AccountsSection";
import { BalanceCard } from "./components/BalanceCard";
import { ExpenseCard } from "./components/ExpenseCard";
import { IncomeCard } from "./components/IncomeCard";
import { MonthlyCategoryDonut } from "./components/MonthlyCategoryDonut";
import { RecentTransactionsTable } from "./components/RecentTransactionsTable";

export default function FinancePage() {
  return (
    <main className="flex-1 p-10 overflow-y-auto relative z-10">
      <div className="space-y-12" style={{ zoom: 0.8 }}>
        <AccountsSection />

        <section className="max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <BalanceCard />
          <ExpenseCard />
          <IncomeCard />
        </section>

        <section className="max-w-5xl flex flex-col lg:flex-row items-stretch gap-8">
          <RecentTransactionsTable className="lg:basis-2/3 min-w-0" />
          <MonthlyCategoryDonut className="lg:basis-1/3 min-w-0" />
        </section>
      </div>
    </main>
  );
}
