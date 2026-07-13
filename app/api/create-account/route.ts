import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { NotionApiError } from "@/lib/notion";
import type { ApiErrorResponse, CreateAccountRequest, CreateAccountResponse } from "@/types/notion";

const NOTION_VERSION = "2022-06-28";

export async function POST(request: Request) {
  const databaseId = process.env.accounts_database_id ?? "";
  const apiKey = process.env.notion_api_key;

  try {
    const body: CreateAccountRequest = await request.json();
    const cardName = body.cardName?.trim();
    const cardNumber = body.cardNumber?.trim();
    const initialBalance = body.initialBalance ?? 0;
    const background = body.background?.trim() || "post-office";
    const currency = body.currency === "USD" ? "USD" : "TWD";

    if (!cardName || !cardNumber) {
      throw new NotionApiError("Card Name and Card Number are required", 400);
    }
    if (!apiKey) {
      throw new NotionApiError("Missing Notion API key (notion_api_key)", 500);
    }
    if (!databaseId) {
      throw new NotionApiError("Missing Notion database ID", 500);
    }

    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Name: { title: [{ text: { content: cardName } }] },
          "Card Number": { rich_text: [{ text: { content: cardNumber } }] },
          Initial: { number: initialBalance },
          Status: { select: { name: "Spendable" } },
          Background: { select: { name: background } },
          Currency: { select: { name: currency } },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new NotionApiError(
        `Notion API error (${response.status}): ${data?.message ?? "Unknown error"}`,
        response.status
      );
    }

    revalidateTag("accounts", { expire: 0 });

    return NextResponse.json<CreateAccountResponse>({ id: data.id });
  } catch (error) {
    const status = error instanceof NotionApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("create-account error:", message);
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status });
  }
}
