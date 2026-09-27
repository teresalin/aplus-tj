import { describe, expect, it } from "vitest";

import { splitRosterByAttendance } from "./roster";

const student = (id: string) => ({ id, person: { name: `Student ${id}` } });
const enrolled = (id: string, startDate: string, endDate?: string) => ({
  startDate: new Date(startDate),
  endDate: endDate ? new Date(endDate) : null,
  student: student(id),
});

const sessionStart = new Date("2026-09-28T10:00:00.000Z");

describe("splitRosterByAttendance", () => {
  it("marks attendees present and other enrolled students absent", () => {
    const { present, absent } = splitRosterByAttendance(
      sessionStart,
      [enrolled("alice", "2025-01-01"), enrolled("bob", "2025-01-01")],
      [student("alice")],
    );
    expect(present).toEqual([{ id: "alice", name: "Student alice" }]);
    expect(absent).toEqual([{ id: "bob", name: "Student bob" }]);
  });

  it("ignores students who were not enrolled on the session date", () => {
    const { absent } = splitRosterByAttendance(
      sessionStart,
      [
        enrolled("left", "2025-01-01", "2026-06-01"),
        enrolled("joins-later", "2026-10-01"),
      ],
      [],
    );
    expect(absent).toEqual([]);
  });

  it("treats the enrollment end date as inclusive", () => {
    const { absent } = splitRosterByAttendance(
      sessionStart,
      [enrolled("last-day", "2025-01-01", "2026-09-28")],
      [],
    );
    expect(absent.map((s) => s.id)).toEqual(["last-day"]);
  });
});
