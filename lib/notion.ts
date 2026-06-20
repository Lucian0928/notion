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

interface NotionQueryPage {
  results: NotionPage[];
  has_more: boolean;
  next_cursor?: string | null;
}

async function notionQueryRequest(
  databaseId: string,
  body: Record<string, unknown>,
  revalidate: number
): Promise<NotionQueryPage> {
  const apiKey = process.env.notion_api_key;
  if (!apiKey) {
    throw new NotionApiError("找不到 Notion 金鑰 (notion_api_key)", 500);
  }
  if (!databaseId) {
    throw new NotionApiError("找不到 Notion 資料庫 ID", 500);
  }

  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    next: { revalidate },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new NotionApiError(
      `Notion API 錯誤 (${response.status}): ${data?.message ?? "未知錯誤"}`,
      response.status
    );
  }

  return data;
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
  const revalidate = options.revalidate ?? 300;
  const results: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const data = await notionQueryRequest(
      databaseId,
      cursor ? { ...filterBody, start_cursor: cursor } : filterBody,
      revalidate
    );

    results.push(...(data.results ?? []));
    cursor = data.has_more ? data.next_cursor ?? undefined : undefined;
  } while (cursor);

  return results;
}

/**
 * Single-page Notion database query — for callers that already cap the
 * result set themselves (e.g. page_size + sorts), where looping through
 * has_more would just waste requests fetching rows that get thrown away.
 */
export async function queryNotionDatabasePage(
  databaseId: string,
  body: Record<string, unknown>,
  options: { revalidate?: number } = {}
): Promise<NotionPage[]> {
  const revalidate = options.revalidate ?? 300;
  const data = await notionQueryRequest(databaseId, body, revalidate);
  return data.results ?? [];
}
