import { NextRequest, NextResponse } from "next/server";
import { getExpenseCategoryMap, getFirstRelationId, UNCATEGORIZED_LABEL } from "@/lib/categories";
import { getMonthRange, getYearRange } from "@/lib/dateRanges";
import { NotionApiError, queryNotionDatabase } from "@/lib/notion";
import type {
  ApiErrorResponse,
  CategoryBreakdownItem,
  CategoryBreakdownRange,
  CategoryBreakdownResponse,
} from "@/types/notion";

export const revalidate = 1800;

function rangeFor(range: CategoryBreakdownRange) {
  switch (range) {
    case "last_month":
      return getMonthRange(-1);
    case "last_3_months":
      return { start: getMonthRange(-2).start, end: getMonthRange(0).end };
    case "last_6_months":
      return { start: getMonthRange(-5).start, end: getMonthRange(0).end };
    case "this_year":
      return getYearRange(0);
    case "this_month":
    default:
      return getMonthRange(0);
  }
}

export async function GET(request: NextRequest) {
  const databaseId = process.env.transactions_database_id ?? "";
  const rangeParam = (request.nextUrl.searchParams.get("range") ??
    "this_month") as CategoryBreakdownRange;

  try {
    const { start, end } = rangeFor(rangeParam);

    const [pages, categoryMap] = await Promise.all([
      queryNotionDatabase(
        databaseId,
        {
          filter: {
            and: [
              { property: "Type", select: { equals: "Expense" } },
              { property: "Date", date: { on_or_after: start } },
              { property: "Date", date: { on_or_before: end } },
            ],
          },
        },
        { revalidate: 1800 }
      ),
      getExpenseCategoryMap(),
    ]);

    const totals = new Map<string, number>();
    for (const page of pages) {
      const amount = page.properties.Amount?.number ?? 0;
      const categoryId = getFirstRelationId(page, "Expense Categories");
      const name = (categoryId && categoryMap.get(categoryId)) || UNCATEGORIZED_LABEL;
      totals.set(name, (totals.get(name) ?? 0) + amount);
    }

    const categories: CategoryBreakdownItem[] = Array.from(totals.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    return NextResponse.json<CategoryBreakdownResponse>({ categories });
  } catch (error) {
    const status = error instanceof NotionApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("get-category-breakdown error:", message);
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status });
  }
}
