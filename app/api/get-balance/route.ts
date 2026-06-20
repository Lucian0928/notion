import { NextResponse } from "next/server";
import { NotionApiError, queryNotionDatabase } from "@/lib/notion";
import type { ApiErrorResponse, BalanceResponse } from "@/types/notion";

export const revalidate = 300;

export async function GET() {
  const databaseId = process.env.accounts_database_id ?? "";

  try {
    const pages = await queryNotionDatabase(databaseId, {
      filter: {
        property: "Status",
        select: { equals: "Spendable" },
      },
    });

    const total = pages.reduce((sum, page) => {
      const balance = page.properties["Current Balance"]?.formula?.number ?? 0;
      return sum + balance;
    }, 0);

    return NextResponse.json<BalanceResponse>({ total });
  } catch (error) {
    const status = error instanceof NotionApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "伺服器內部錯誤";
    console.error("get-balance 錯誤:", message);
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status });
  }
}
