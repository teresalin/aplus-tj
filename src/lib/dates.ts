import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type DateValue = Date | string | null | undefined;

/**
 * Date-only fields (birthdays, due dates, enrollment dates) are stored as UTC
 * midnight, so they are always formatted in UTC. This keeps the calendar day
 * stable regardless of the viewer's (or the server's) timezone.
 */
export function formatDate(value: DateValue, format = "YYYY-MM-DD"): string {
  return value ? dayjs.utc(value).format(format) : "";
}

/** Converts a stored date-only value into a date-picker value (local midnight of that day). */
export function toPickerDate(value: DateValue): Dayjs | null {
  return value ? dayjs(dayjs.utc(value).format("YYYY-MM-DD")) : null;
}

/** Converts a date-picker value into the "YYYY-MM-DD" string the API expects. */
export function fromPickerDate(value: Dayjs | null | undefined): string | null {
  return value ? value.format("YYYY-MM-DD") : null;
}

/** Prisma represents `TIME` columns as Dates on 1970-01-01 UTC; the app uses "HH:mm:ss". */
export function timeOfDayToDate(time: string): Date {
  return new Date(`1970-01-01T${time}Z`);
}

export function dateToTimeOfDay(date: Date): string {
  return date.toISOString().slice(11, 19);
}

export function startOfUtcDay(date: Date = new Date()): Date {
  return dayjs.utc(date).startOf("day").toDate();
}
