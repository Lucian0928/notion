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

export interface IncomeResponse {
  total: number;
}

export interface RecentTransaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: string;
}

export interface RecentTransactionsResponse {
  transactions: RecentTransaction[];
}

export interface TrendMonth {
  month: string;
  income: number;
  expense: number;
}

export interface TrendResponse {
  months: TrendMonth[];
}

export interface CategoryBreakdownItem {
  name: string;
  total: number;
}

export interface CategoryBreakdownResponse {
  categories: CategoryBreakdownItem[];
}

export type CategoryBreakdownRange = "this_month" | "last_month" | "last_3_months";
