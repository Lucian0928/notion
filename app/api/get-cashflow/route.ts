import { NextResponse } from "next/server";
import { getLastNDayKeys, getLastNDays, notionDateKey } from "@/lib/dateRanges";
import { NotionApiError, queryNotionDatabase } from "@/lib/notion";
import type { ApiErrorResponse, CashflowDay, CashflowResponse } from "@/types/notion";

export const revalidate = 300;

const DAYS = 7;

export async function GET() {
  const databaseId = process.env.transactions_database_id ?? "";

  try {
    const { start, end } = getLastNDays(DAYS);

    const pages = await queryNotionDatabase(databaseId, {
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
    });

    const buckets = new Map<string, { income: number; expense: number }>();
    for (const key of getLastNDayKeys(DAYS)) {
      buckets.set(key, { income: 0, expense: 0 });
    }

    for (const page of pages) {
      const dateValue = page.properties.Date?.date?.start;
      if (!dateValue) continue;
      const bucket = buckets.get(notionDateKey(dateValue));
      if (!bucket) continue;

      const amount = page.properties.Amount?.number ?? 0;
      const type = page.properties.Type?.select?.name;
      if (type === "Income") bucket.income += amount;
      if (type === "Expense") bucket.expense += amount;
    }

    const days: CashflowDay[] = Array.from(buckets.entries()).map(
      ([date, { income, expense }]) => ({
        date,
        income,
        expense,
        net: income - expense,
      })
    );

    return NextResponse.json<CashflowResponse>({ days });
  } catch (error) {
    const status = error instanceof NotionApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "伺服器內部錯誤";
    console.error("get-cashflow 錯誤:", message);
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status });
  }
}
