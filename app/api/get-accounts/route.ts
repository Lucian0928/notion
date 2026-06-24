import { NextResponse } from "next/server";
import { NotionApiError, queryNotionDatabase } from "@/lib/notion";
import type { Account, AccountsResponse, ApiErrorResponse } from "@/types/notion";

export const revalidate = 300;

export async function GET() {
  const databaseId = process.env.accounts_database_id ?? "";

  try {
    const pages = await queryNotionDatabase(
      databaseId,
      { filter: { property: "Status", select: { equals: "Spendable" } } },
      { tags: ["accounts"] }
    );

    const accounts: Account[] = pages.map((page) => ({
      id: page.id,
      cardName: page.properties.Name?.title?.[0]?.plain_text ?? "",
      cardNumber: page.properties["Card Number"]?.rich_text?.[0]?.plain_text ?? "",
      currentBalance: page.properties["Current Balance"]?.formula?.number ?? 0,
    }));

    return NextResponse.json<AccountsResponse>({ accounts });
  } catch (error) {
    const status = error instanceof NotionApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("get-accounts error:", message);
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status });
  }
}
