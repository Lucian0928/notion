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
  /** "TWD" | "USD" — rows created before the Currency field default to "TWD". */
  currency: string;
}

export interface NetWorthResponse {
  /** twdTotal + usdTotal × rate; equals twdTotal when rate is unavailable. */
  netWorthTWD: number;
  /** Sum of all TWD account balances (signed — liabilities are negative). */
  twdTotal: number;
  /** Sum of all USD account balances, in USD. */
  usdTotal: number;
  /** Live USD→TWD rate, or null if the quote fetch failed. */
  rate: number | null;
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

export type CategoryBreakdownRange =
  | "this_month"
  | "last_month"
  | "last_3_months"
  | "last_6_months"
  | "this_year";

export interface Account {
  id: string;
  cardName: string;
  cardNumber: string;
  currentBalance: number;
  initialBalance: number;
  background: string;
  /** "TWD" | "USD" — accounts created before the Currency field default to "TWD". */
  currency: string;
}

export interface AccountsResponse {
  accounts: Account[];
}

export interface CreateAccountRequest {
  cardName: string;
  cardNumber: string;
  initialBalance: number;
  background: string;
  currency: string;
}

export interface CreateAccountResponse {
  id: string;
}

export interface UpdateAccountRequest {
  id: string;
  cardName: string;
  cardNumber: string;
  initialBalance: number;
  background: string;
  currency: string;
}

export interface UpdateAccountResponse {
  id: string;
}

export interface CardBackgroundsResponse {
  backgrounds: string[];
}
