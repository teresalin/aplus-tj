import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const DATE_PARAM = /^\d{4}-\d{2}-\d{2}$/;

/** Sunday (UTC) of the week containing `date`. Independent of the dayjs locale. */
export function startOfWeek(date: Date = new Date()): Date {
  const day = dayjs.utc(date).startOf("day");
  return day.subtract(day.day(), "day").toDate();
}

/** Parses a `?week=YYYY-MM-DD` search param into the start of that week (defaults to this week). */
export function parseWeekParam(raw?: string | string[]): Date {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  const parsed =
    candidate && DATE_PARAM.test(candidate) ? dayjs.utc(candidate) : null;
  return startOfWeek(parsed?.isValid() ? parsed.toDate() : new Date());
}

export function addWeeks(weekStart: string, weeks: number): string {
  return dayjs.utc(weekStart).add(weeks, "week").format("YYYY-MM-DD");
}

/** The seven days of the week starting at `weekStart`, as "YYYY-MM-DD". */
export function weekDates(weekStart: Date): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    dayjs.utc(weekStart).add(i, "day").format("YYYY-MM-DD"),
  );
}
