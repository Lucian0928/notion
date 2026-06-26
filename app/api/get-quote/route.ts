import { NextResponse } from "next/server";

export interface QuoteDetail {
  symbol: string;
  shortName: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  marketState: string;
  sparkline: { price: number; ts: number }[];
}

export const dynamic = "force-dynamic";

// Instantiate once at module scope so the session/cookie is reused across requests
// eslint-disable-next-line @typescript-eslint/no-require-imports
const YF = require("yahoo-finance2").default;
const yf = new YF({ suppressNotices: ["yahooSurvey"] });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  try {
    const period1 = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [quote, chart] = await Promise.all([
      yf.quote(symbol),
      yf.chart(symbol, { interval: "5m", period1 }),
    ]);

    const sparkline = (chart.quotes ?? [])
      .filter((q: { close: number | null }) => q.close !== null && isFinite(q.close as number))
      .map((q: { close: number | null; date: Date }) => ({
        price: q.close as number,
        ts: new Date(q.date).getTime(),
      }));

    const price: number = quote.regularMarketPrice ?? 0;
    const change: number = quote.regularMarketChange ?? 0;
    const changePercent: number = quote.regularMarketChangePercent ?? 0;

    return NextResponse.json<QuoteDetail>({
      symbol: quote.symbol,
      shortName: quote.shortName ?? quote.displayName ?? symbol,
      price,
      change,
      changePercent,
      currency: quote.currency ?? "USD",
      marketState: quote.marketState ?? "CLOSED",
      sparkline,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("get-quote error:", symbol, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
