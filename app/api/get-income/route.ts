import { NextResponse } from "next/server";
import { getAmountTWD } from "@/lib/amounts";
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

    const total = pages.reduce((sum, page) => sum + getAmountTWD(page), 0);

    return NextResponse.json<IncomeResponse>({ total });
  } catch (error) {
    const status = error instanceof NotionApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("get-income error:", message);
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status });
  }
}
