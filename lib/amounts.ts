import type { NotionPage } from "@/types/notion";

/**
 * Blended-TWD amount for a transaction row.
 *
 * Reads the "Amount (TWD)" Notion formula (Amount × Rate, where Rate is the
 * USD→TWD rate stamped at entry time and defaults to 1 for TWD rows), so
 * USD and TWD spending can be summed honestly. Falls back to the raw Amount
 * for rows created before the multi-currency fields existed.
 */
export function getAmountTWD(page: NotionPage): number {
  return page.properties["Amount (TWD)"]?.formula?.number ?? page.properties.Amount?.number ?? 0;
}
