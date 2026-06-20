export interface NotionPage {
  id: string;
  // Notion property shapes vary by field type (formula/select/number/date/...),
  // so this stays loosely typed rather than modeling the full Notion API schema.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any>;
}

export interface NotionQueryResponse {
  results: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
}

export interface BalanceResponse {
  total: number;
}

export interface ExpenseResponse {
  total: number;
  mom: number;
}

export interface ApiErrorResponse {
  error: string;
}
