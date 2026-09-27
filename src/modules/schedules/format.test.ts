import { describe, expect, it } from "vitest";

import { formatScheduleDays } from "./format";

describe("formatScheduleDays", () => {
  it("abbreviates scheduled days in week order", () => {
    expect(
      formatScheduleDays([
        { dayOfWeek: "Friday" },
        { dayOfWeek: "Monday" },
        { dayOfWeek: "Wednesday" },
      ]),
    ).toBe("MWF");
  });

  it("is empty when nothing is scheduled", () => {
    expect(formatScheduleDays([])).toBe("");
  });
});
