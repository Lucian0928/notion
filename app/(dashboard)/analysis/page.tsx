import { CategoryBreakdownSection } from "./components/CategoryBreakdownSection";
import { TrendChart } from "./components/TrendChart";

export default function AnalysisPage() {
  return (
    <main className="flex-1 p-10 overflow-y-auto relative z-10">
      <div className="space-y-12">
        <div className="max-w-5xl flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white tracking-tight">Analysis</h1>
        </div>

        <section className="max-w-5xl">
          <div className="card-panel p-6 min-h-[320px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-neutral-400 tracking-widest uppercase opacity-80">
                收支趨勢（近 6 個月）
              </span>
            </div>
            <TrendChart />
          </div>
        </section>

        <section className="max-w-5xl">
          <CategoryBreakdownSection />
        </section>
      </div>
    </main>
  );
}
