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

/** A range spanning the last n calendar days, including today. */
export function getLastNDays(n: number, now: Date = new Date()): DateRange {
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (n - 1));
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

/** "YYYY-MM-DD" day keys for getLastNDays(n), oldest first, anchored on today. */
export function getLastNDayKeys(n: number, now: Date = new Date()): string[] {
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    keys.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    );
  }
  return keys;
}

/**
 * Notion stores Date property values as "YYYY-MM-DD" (or a full timestamp
 * starting with that). Slicing avoids re-parsing through a JS Date object,
 * which would risk shifting the calendar day across a timezone boundary.
 */
export function notionDateKey(notionDateString: string): string {
  return notionDateString.slice(0, 10);
}
