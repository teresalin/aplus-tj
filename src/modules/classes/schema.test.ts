import { describe, expect, it } from "vitest";

import { CreateClassSchema } from "./schema";

const validClass = {
  name: "3rd Grade English",
  gradeId: "465c0f75-84d4-4651-af01-ea7f1e2d9cf0",
  teacherId: "df11e70b-e392-4a1f-89d5-23e3da68b1f5",
  capacity: "12",
  schedules: [
    { dayOfWeek: "Monday", startTime: "18:00:00", endTime: "20:00:00" },
  ],
};

function failedPaths(input: unknown) {
  const result = CreateClassSchema.safeParse(input);
  return result.success
    ? []
    : result.error.issues.map((issue) => issue.path.join("."));
}

describe("CreateClassSchema", () => {
  it("parses the capacity the form sends as text", () => {
    expect(CreateClassSchema.parse(validClass).capacity).toBe(12);
  });

  it("defaults to no schedules", () => {
    const { schedules: _schedules, ...withoutSchedules } = validClass;
    expect(CreateClassSchema.parse(withoutSchedules).schedules).toEqual([]);
  });

  it("rejects a non-numeric or fractional capacity", () => {
    expect(failedPaths({ ...validClass, capacity: "ten" })).toEqual([
      "capacity",
    ]);
    expect(failedPaths({ ...validClass, capacity: "1.5" })).toEqual([
      "capacity",
    ]);
  });

  it("requires HH:mm:ss times and a real weekday", () => {
    expect(
      failedPaths({
        ...validClass,
        schedules: [{ dayOfWeek: "Funday", startTime: "9:00", endTime: "" }],
      }),
    ).toEqual([
      "schedules.0.dayOfWeek",
      "schedules.0.startTime",
      "schedules.0.endTime",
    ]);
  });
});
