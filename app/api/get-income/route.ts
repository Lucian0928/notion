import { NextResponse } from "next/server";
import { getMonthRange } from "@/lib/dateRanges";
import { NotionApiError, queryNotionDatabase } from "@/lib/notion";
import type { ApiErrorResponse, IncomeResponse } from "@/types/notion";

export const revalidate = 300;

export async function GET() {
  const databaseId = process.env.transactions_database_id ?? "";

  try {
    const { start, end } = getMonthRange(0);

    const pages = await queryNotionDatabase(databaseId, {
      filter: {
        and: [
          { property: "Type", select: { equals: "Income" } },
          { property: "Date", date: { on_or_after: start } },
          { property: "Date", date: { on_or_before: end } },
        ],
      },
    });

    const total = pages.reduce((sum, page) => sum + (page.properties.Amount?.number ?? 0), 0);

    return NextResponse.json<IncomeResponse>({ total });
  } catch (error) {
    const status = error instanceof NotionApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "伺服器內部錯誤";
    console.error("get-income 錯誤:", message);
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status });
  }
}
