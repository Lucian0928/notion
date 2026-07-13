import { NextResponse } from "next/server";
import { fetchUsdTwdRate, sumBalancesTWD } from "@/lib/fx";
import { NotionApiError, queryNotionDatabase } from "@/lib/notion";
import type { ApiErrorResponse, BalanceResponse } from "@/types/notion";

export const revalidate = 300;

export async function GET() {
  const databaseId = process.env.accounts_database_id ?? "";

  try {
    const [pages, rate] = await Promise.all([
      queryNotionDatabase(databaseId, {
        filter: {
          property: "Status",
          select: { equals: "Spendable" },
        },
      }),
      fetchUsdTwdRate(),
    ]);

    const accounts = pages.map((page) => ({
      balance: page.properties["Current Balance"]?.formula?.number ?? 0,
      currency: page.properties.Currency?.select?.name ?? "TWD",
    }));
    const total = sumBalancesTWD(accounts, rate);

    return NextResponse.json<BalanceResponse>({ total });
  } catch (error) {
    const status = error instanceof NotionApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("get-balance error:", message);
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status });
  }
}
