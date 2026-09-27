import { describe, expect, it } from "vitest";

import { buildAttendanceRows } from "./rows";
import { addWeeks, parseWeekParam, startOfWeek, weekDates } from "./week";

describe("week helpers", () => {
  it("starts weeks on Sunday (UTC)", () => {
    // 2026-09-26 is a Saturday; 2026-09-27 is a Sunday.
    expect(
      startOfWeek(new Date("2026-09-26T23:00:00.000Z")).toISOString(),
    ).toBe("2026-09-20T00:00:00.000Z");
    expect(
      startOfWeek(new Date("2026-09-27T05:00:00.000Z")).toISOString(),
    ).toBe("2026-09-27T00:00:00.000Z");
  });

  it("parses ?week= to the start of that week", () => {
    expect(parseWeekParam("2026-09-30").toISOString()).toBe(
      "2026-09-27T00:00:00.000Z",
    );
    expect(parseWeekParam(["2026-09-30", "2020-01-01"]).toISOString()).toBe(
      "2026-09-27T00:00:00.000Z",
    );
  });

  it("falls back to the current week for malformed input", () => {
    expect(parseWeekParam("not-a-date")).toEqual(startOfWeek(new Date()));
  });

  it("lists the week's days and navigates between weeks", () => {
    const dates = weekDates(new Date("2026-09-27T00:00:00.000Z"));
    expect(dates).toHaveLength(7);
    expect([dates[0], dates[6]]).toEqual(["2026-09-27", "2026-10-03"]);
    expect(addWeeks("2026-09-27", -1)).toBe("2026-09-20");
  });
});

describe("buildAttendanceRows", () => {
  const alice = { id: "alice", person: { name: "Chen Alice" } };
  const bob = { id: "bob", person: { name: "Lin Bob" } };
  const sessions = [
    {
      startTime: new Date("2026-09-28T10:00:00.000Z"),
      attendances: [{ studentId: "alice" }],
    },
    { startTime: new Date("2026-09-30T10:00:00.000Z"), attendances: [] },
  ];

  it("marks each student present or absent for each session day", () => {
    expect(buildAttendanceRows([alice, bob], sessions)).toEqual([
      {
        id: "alice",
        name: "Chen Alice",
        attendance: { "2026-09-28": "Present", "2026-09-30": "Absent" },
      },
      {
        id: "bob",
        name: "Lin Bob",
        attendance: { "2026-09-28": "Absent", "2026-09-30": "Absent" },
      },
    ]);
  });

  it("lists a student with several enrollments once", () => {
    expect(buildAttendanceRows([alice, alice], [])).toEqual([
      { id: "alice", name: "Chen Alice", attendance: {} },
    ]);
  });
});
