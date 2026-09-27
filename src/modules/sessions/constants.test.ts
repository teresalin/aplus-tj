import { describe, expect, it } from "vitest";

import { parseSessionRange, sessionStartTimeFilter } from "./constants";

describe("parseSessionRange", () => {
  it("accepts known ranges", () => {
    expect(parseSessionRange("last7Days")).toBe("last7Days");
    expect(parseSessionRange(["all", "thisMonth"])).toBe("all");
  });

  it("falls back to this month for missing or unknown values", () => {
    expect(parseSessionRange(undefined)).toBe("thisMonth");
    expect(parseSessionRange("forever")).toBe("thisMonth");
  });
});

describe("sessionStartTimeFilter", () => {
  const now = new Date("2026-09-27T15:30:00.000Z");

  it("covers the whole current UTC month", () => {
    expect(sessionStartTimeFilter("thisMonth", now)).toEqual({
      gte: new Date("2026-09-01T00:00:00.000Z"),
      lt: new Date("2026-10-01T00:00:00.000Z"),
    });
  });

  it("covers the seven days up to now", () => {
    expect(sessionStartTimeFilter("last7Days", now)).toEqual({
      gte: new Date("2026-09-20T15:30:00.000Z"),
      lt: now,
    });
  });

  it("starts year to date on January 1st", () => {
    expect(sessionStartTimeFilter("yearToDate", now)).toEqual({
      gte: new Date("2026-01-01T00:00:00.000Z"),
    });
  });

  it("applies no limit for all sessions", () => {
    expect(sessionStartTimeFilter("all", now)).toBeUndefined();
  });
});
