import { NextResponse } from "next/server";

interface Quote { symbol: string; shortName: string; price: number; change: number; changePercent: number; currency: string; marketState: string; }
interface QuotesResponse { quotes: Quote[]; fetchedAt: number; }

const SYMBOLS = [
  "2330.TW", "0050.TW", "0056.TW", "2454.TW",
  "SPY", "QQQ", "NVDA", "AAPL", "MSFT", "GOOGL",
];

const DISPLAY_NAMES: Record<string, string> = {
  "2330.TW": "台積電",
  "0050.TW": "元大台灣50",
  "0056.TW": "元大高股息",
  "2454.TW": "聯發科",
  "SPY":     "S&P 500 ETF",
  "QQQ":     "Nasdaq 100 ETF",
  "NVDA":    "NVIDIA",
  "AAPL":    "Apple",
  "MSFT":    "Microsoft",
  "GOOGL":   "Alphabet",
};

export const dynamic = "force-dynamic";

export async function GET() {
  const url =
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${SYMBOLS.join(",")}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Yahoo Finance ${res.status}`);

    const json = await res.json();
    const results: Record<string, unknown>[] = json?.quoteResponse?.result ?? [];

    const quotes: Quote[] = results.map((q) => ({
      symbol:        String(q.symbol ?? ""),
      shortName:     DISPLAY_NAMES[String(q.symbol)] ?? String(q.shortName ?? q.symbol),
      price:         Number(q.regularMarketPrice ?? 0),
      change:        Number(q.regularMarketChange ?? 0),
      changePercent: Number(q.regularMarketChangePercent ?? 0),
      currency:      String(q.currency ?? "USD"),
      marketState:   String(q.marketState ?? "CLOSED"),
    }));

    return NextResponse.json<QuotesResponse>({ quotes, fetchedAt: Date.now() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("get-quotes error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
