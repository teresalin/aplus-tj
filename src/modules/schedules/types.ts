import type { DayOfWeek } from "@/constants";

/** A weekly class time slot. Times are "HH:mm:ss" strings. */
export interface Schedule {
  id?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}
