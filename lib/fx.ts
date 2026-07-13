// Instantiate once at module scope so the session/cookie is reused across requests
// eslint-disable-next-line @typescript-eslint/no-require-imports
const YF = require("yahoo-finance2").default;
const yf = new YF({ suppressNotices: ["yahooSurvey"] });

/** Live USD→TWD rate via Yahoo's TWD=X symbol; null when the quote fails. */
export async function fetchUsdTwdRate(): Promise<number | null> {
  try {
    const quote = await yf.quote("TWD=X");
    const rate = quote?.regularMarketPrice;
    return typeof rate === "number" && rate > 0 ? rate : null;
  } catch (error) {
    console.error("fetchUsdTwdRate error:", error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Sums account balances into one TWD figure: TWD accounts add directly,
 * USD accounts convert via the live rate first. If the rate is unavailable,
 * USD accounts are dropped from the total rather than silently mixing raw
 * USD and TWD numbers together.
 */
export function sumBalancesTWD(
  accounts: { balance: number; currency: string }[],
  rate: number | null
): number {
  let twdTotal = 0;
  let usdTotal = 0;
  for (const { balance, currency } of accounts) {
    if (currency === "USD") usdTotal += balance;
    else twdTotal += balance;
  }
  return twdTotal + (rate !== null ? usdTotal * rate : 0);
}
