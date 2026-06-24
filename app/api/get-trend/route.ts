import { NextResponse } from "next/server";
import { getLastNMonthsLabels } from "@/lib/dateRanges";
import { NotionApiError, queryNotionDatabase } from "@/lib/notion";
import type { ApiErrorResponse, TrendMonth, TrendResponse } from "@/types/notion";

export const revalidate = 1800;

const TREND_MONTHS = 6;

function incomeExpenseFilter(start: string, end: string) {
  return {
    filter: {
      and: [
        {
          or: [
            { property: "Type", select: { equals: "Income" } },
            { property: "Type", select: { equals: "Expense" } },
          ],
        },
        { property: "Date", date: { on_or_after: start } },
        { property: "Date", date: { on_or_before: end } },
      ],
    },
  };
}

export async function GET() {
  const databaseId = process.env.transactions_database_id ?? "";

  try {
    const months = getLastNMonthsLabels(TREND_MONTHS);

    const results = await Promise.all(
      months.map((m) =>
        queryNotionDatabase(databaseId, incomeExpenseFilter(m.start, m.end), { revalidate: 1800 })
      )
    );

    const trendMonths: TrendMonth[] = months.map((m, i) => {
      let income = 0;
      let expense = 0;
      for (const page of results[i]) {
        const amount = page.properties.Amount?.number ?? 0;
        const type = page.properties.Type?.select?.name;
        if (type === "Income") income += amount;
        if (type === "Expense") expense += amount;
      }
      return { month: m.month, income, expense };
    });

    return NextResponse.json<TrendResponse>({ months: trendMonths });
  } catch (error) {
    const status = error instanceof NotionApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("get-trend error:", message);
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status });
  }
}
