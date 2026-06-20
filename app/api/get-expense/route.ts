import { NextResponse } from "next/server";
import { NotionApiError, queryNotionDatabase } from "@/lib/notion";
import type { ApiErrorResponse, ExpenseResponse } from "@/types/notion";
import type { NotionPage } from "@/types/notion";

export const revalidate = 300;

function sumAmount(pages: NotionPage[]) {
  return pages.reduce((sum, page) => sum + (page.properties.Amount?.number ?? 0), 0);
}

function expenseFilter(start: string, end: string) {
  return {
    filter: {
      and: [
        { property: "Type", select: { equals: "Expense" } },
        { property: "Date", date: { on_or_after: start } },
        { property: "Date", date: { on_or_before: end } },
      ],
    },
  };
}

export async function GET() {
  const databaseId = process.env.transactions_database_id ?? "";

  try {
    const now = new Date();
    // 本月範圍
    const firstDayThis = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDayThis = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    // 上月範圍
    const firstDayLast = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lastDayLast = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

    const [pagesThis, pagesLast] = await Promise.all([
      queryNotionDatabase(databaseId, expenseFilter(firstDayThis, lastDayThis)),
      queryNotionDatabase(databaseId, expenseFilter(firstDayLast, lastDayLast)),
    ]);

    const totalThis = sumAmount(pagesThis);
    const totalLast = sumAmount(pagesLast);

    let mom = 0;
    if (totalLast !== 0) {
      mom = ((totalThis - totalLast) / totalLast) * 100;
    } else if (totalThis > 0) {
      mom = 100;
    }

    return NextResponse.json<ExpenseResponse>({ total: totalThis, mom });
  } catch (error) {
    const status = error instanceof NotionApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "伺服器內部錯誤";
    console.error("get-expense 錯誤:", message);
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status });
  }
}
