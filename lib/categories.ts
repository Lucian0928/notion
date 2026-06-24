import { queryNotionDatabase } from "@/lib/notion";
import type { NotionPage } from "@/types/notion";

export const UNCATEGORIZED_LABEL = "Uncategorized";

/** id -> category name, built from the linked Expense Categories database. */
export async function getExpenseCategoryMap(): Promise<Map<string, string>> {
  const databaseId = process.env.expense_categories_database_id ?? "";
  const pages = await queryNotionDatabase(databaseId, {}, { revalidate: 3600 });

  const map = new Map<string, string>();
  for (const page of pages) {
    const titleProp = Object.values(page.properties).find(
      (prop) => (prop as { type?: string })?.type === "title"
    ) as { title?: { plain_text?: string }[] } | undefined;
    const name = titleProp?.title?.[0]?.plain_text;
    if (name) {
      map.set(page.id, name);
    }
  }
  return map;
}

/** First related page id for a relation property, e.g. "Expense Categories". */
export function getFirstRelationId(page: NotionPage, propertyName: string): string | undefined {
  return page.properties[propertyName]?.relation?.[0]?.id;
}
