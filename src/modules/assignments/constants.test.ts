import { describe, expect, it } from "vitest";

import { dueDateFilter, parseAssignmentFilter } from "./constants";

describe("parseAssignmentFilter", () => {
  it("accepts known filters and defaults to all", () => {
    expect(parseAssignmentFilter("past due")).toBe("past due");
    expect(parseAssignmentFilter(["upcoming"])).toBe("upcoming");
    expect(parseAssignmentFilter("overdue")).toBe("all");
    expect(parseAssignmentFilter(undefined)).toBe("all");
  });
});

describe("dueDateFilter", () => {
  const now = new Date("2026-09-27T12:00:00.000Z");

  it("splits upcoming and past-due assignments at the current time", () => {
    expect(dueDateFilter("upcoming", now)).toEqual({ gt: now });
    expect(dueDateFilter("past due", now)).toEqual({ lte: now });
    expect(dueDateFilter("all", now)).toBeUndefined();
  });
});
