export interface DateRange {
  start: string;
  end: string;
}

/** offsetMonths: 0 = this month, -1 = last month, -2 = two months ago, etc. */
export function getMonthRange(offsetMonths = 0, now: Date = new Date()): DateRange {
  const start = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offsetMonths + 1, 0, 23, 59, 59);
  return { start: start.toISOString(), end: end.toISOString() };
}

export interface MonthLabel extends DateRange {
  /** e.g. "2026-01" */
  month: string;
}

/** The last n months, oldest first, including the current month. */
export function getLastNMonthsLabels(n: number, now: Date = new Date()): MonthLabel[] {
  const months: MonthLabel[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const { start, end } = getMonthRange(-i, now);
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ month, start, end });
  }
  return months;
}

