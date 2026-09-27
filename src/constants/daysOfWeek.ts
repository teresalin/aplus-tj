import type { day_of_week } from "@prisma/client";

export type DayOfWeek = day_of_week;

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const satisfies readonly DayOfWeek[];
