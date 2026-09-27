import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import {
  dateToTimeOfDay,
  formatDate,
  fromPickerDate,
  startOfUtcDay,
  timeOfDayToDate,
  toPickerDate,
} from "./dates";

// vitest.config.mts runs tests in Asia/Taipei (UTC+8).
const storedBirthday = new Date("2016-05-10T00:00:00.000Z");

describe("date-only values", () => {
  it("runs in a positive UTC offset", () => {
    expect(new Date(2020, 0, 1).getTimezoneOffset()).toBe(-480);
  });

  it("formats stored dates as the same calendar day", () => {
    expect(formatDate(storedBirthday)).toBe("2016-05-10");
    expect(formatDate("2016-05-10T00:00:00.000Z", "MMM DD")).toBe("May 10");
    expect(formatDate(null)).toBe("");
  });

  it("round-trips through a date picker without shifting a day", () => {
    const pickerValue = toPickerDate(storedBirthday);
    expect(pickerValue?.date()).toBe(10);
    expect(fromPickerDate(pickerValue)).toBe("2016-05-10");
  });

  it("sends the calendar day the user picked", () => {
    // A picker returns local midnight; converting via UTC would give 2024-03-14.
    expect(fromPickerDate(dayjs("2024-03-15"))).toBe("2024-03-15");
    expect(fromPickerDate(null)).toBeNull();
    expect(toPickerDate(undefined)).toBeNull();
  });
});

describe("time-of-day values", () => {
  it("round-trips HH:mm:ss through Prisma's TIME representation", () => {
    const stored = timeOfDayToDate("18:30:00");
    expect(stored.toISOString()).toBe("1970-01-01T18:30:00.000Z");
    expect(dateToTimeOfDay(stored)).toBe("18:30:00");
  });
});

describe("startOfUtcDay", () => {
  it("truncates to midnight UTC", () => {
    expect(
      startOfUtcDay(new Date("2026-09-28T23:59:00.000Z")).toISOString(),
    ).toBe("2026-09-28T00:00:00.000Z");
  });
});
