import { daysOfWeek } from "@/constants";
import type { Schedule } from "./types";

/** Abbreviates the scheduled days in week order, e.g. "MWF". */
export function formatScheduleDays(schedules: Pick<Schedule, "dayOfWeek">[]) {
  const scheduledDays = new Set(schedules.map((s) => s.dayOfWeek));
  return daysOfWeek
    .filter((day) => scheduledDays.has(day))
    .map((day) => day.charAt(0))
    .join("");
}
