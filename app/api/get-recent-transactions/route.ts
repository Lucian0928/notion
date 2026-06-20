import { NextResponse } from "next/server";
import { NotionApiError, queryNotionDatabasePage } from "@/lib/notion";
import type { ApiErrorResponse, RecentTransaction, RecentTransactionsResponse } from "@/types/notion";

export const revalidate = 300;

const RECENT_COUNT = 5;

export async function GET() {
  const databaseId = process.env.transactions_database_id ?? "";

  try {
    const pages = await queryNotionDatabasePage(databaseId, {
      sorts: [{ property: "Date", direction: "descending" }],
      page_size: RECENT_COUNT,
    });

    const transactions: RecentTransaction[] = pages.map((page) => ({
      id: page.id,
      name: page.properties.Name?.title?.[0]?.plain_text ?? "",
      amount: page.properties.Amount?.number ?? 0,
      date: page.properties.Date?.date?.start ?? "",
      type: page.properties.Type?.select?.name ?? "",
    }));

    return NextResponse.json<RecentTransactionsResponse>({ transactions });
  } catch (error) {
    const status = error instanceof NotionApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "伺服器內部錯誤";
    console.error("get-recent-transactions 錯誤:", message);
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status });
  }
}
