import { describe, expect, it } from "vitest";

import { sessionTimeChange } from "./history";

const previous = {
  startTime: new Date("2026-10-10T09:00:00.000Z"),
  endTime: new Date("2026-10-10T10:30:00.000Z"),
};

describe("sessionTimeChange", () => {
  it("returns null when neither time changed", () => {
    expect(
      sessionTimeChange(previous, {
        startTime: new Date(previous.startTime),
        endTime: new Date(previous.endTime),
      }),
    ).toBeNull();
  });

  it("records the previous and new times when the session moves", () => {
    const next = {
      startTime: new Date("2026-10-12T09:00:00.000Z"),
      endTime: new Date("2026-10-12T10:30:00.000Z"),
    };
    expect(sessionTimeChange(previous, next)).toEqual({
      previousStartTime: previous.startTime,
      previousEndTime: previous.endTime,
      newStartTime: next.startTime,
      newEndTime: next.endTime,
    });
  });

  it("records a change to the end time alone", () => {
    const next = {
      startTime: previous.startTime,
      endTime: new Date("2026-10-10T11:00:00.000Z"),
    };
    expect(sessionTimeChange(previous, next)).toMatchObject({
      previousEndTime: previous.endTime,
      newEndTime: next.endTime,
    });
  });
});
