import { NextResponse } from "next/server";
import { NotionApiError, queryNotionDatabase } from "@/lib/notion";
import type { ApiErrorResponse, NetWorthResponse } from "@/types/notion";

export const revalidate = 300;

// Instantiate once at module scope so the session/cookie is reused across requests
// eslint-disable-next-line @typescript-eslint/no-require-imports
const YF = require("yahoo-finance2").default;
const yf = new YF({ suppressNotices: ["yahooSurvey"] });

/** Live USD→TWD rate via Yahoo's TWD=X symbol; null when the quote fails. */
async function fetchUsdTwdRate(): Promise<number | null> {
  try {
    const quote = await yf.quote("TWD=X");
    const rate = quote?.regularMarketPrice;
    return typeof rate === "number" && rate > 0 ? rate : null;
  } catch (error) {
    console.error("get-net-worth rate error:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function GET() {
  const databaseId = process.env.accounts_database_id ?? "";

  try {
    // All accounts, every Status — balances are already signed by the Notion
    // formula (liabilities come back negative), so a plain sum is correct.
    const [pages, rate] = await Promise.all([
      queryNotionDatabase(databaseId, {}, { tags: ["accounts"] }),
      fetchUsdTwdRate(),
    ]);

    let twdTotal = 0;
    let usdTotal = 0;
    for (const page of pages) {
      const balance = page.properties["Current Balance"]?.formula?.number ?? 0;
      const currency = page.properties.Currency?.select?.name ?? "TWD";
      if (currency === "USD") usdTotal += balance;
      else twdTotal += balance;
    }

    const netWorthTWD = twdTotal + (rate !== null ? usdTotal * rate : 0);

    return NextResponse.json<NetWorthResponse>({ netWorthTWD, twdTotal, usdTotal, rate });
  } catch (error) {
    const status = error instanceof NotionApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("get-net-worth error:", message);
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status });
  }
}
