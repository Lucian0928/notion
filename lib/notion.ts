import type { NotionPage } from "@/types/notion";

const NOTION_VERSION = "2022-06-28";

export class NotionApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "NotionApiError";
    this.status = status;
  }
}

/**
 * Queries a Notion database and follows has_more/next_cursor until every
 * page has been collected, so totals don't silently drop rows past the
 * default 100-result page.
 */
export async function queryNotionDatabase(
  databaseId: string,
  filterBody: Record<string, unknown>,
  options: { revalidate?: number } = {}
): Promise<NotionPage[]> {
  const apiKey = process.env.notion_api_key;
  if (!apiKey) {
    throw new NotionApiError("找不到 Notion 金鑰 (notion_api_key)", 500);
  }
  if (!databaseId) {
    throw new NotionApiError("找不到 Notion 資料庫 ID", 500);
  }

  const revalidate = options.revalidate ?? 300;
  const results: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          cursor ? { ...filterBody, start_cursor: cursor } : filterBody
        ),
        next: { revalidate },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new NotionApiError(
        `Notion API 錯誤 (${response.status}): ${data?.message ?? "未知錯誤"}`,
        response.status
      );
    }

    results.push(...(data.results ?? []));
    cursor = data.has_more ? data.next_cursor ?? undefined : undefined;
  } while (cursor);

  return results;
}
