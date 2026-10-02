import { describe, expect, it } from "vitest";

import { CreateSessionSchema, UpdateSessionSchema } from "./schema";

const classId = "465c0f75-84d4-4651-af01-ea7f1e2d9cf0";
const teacherId = "0b8f6a7e-2f41-4c1e-9a55-3d2f0e6c1b77";
const times = {
  startTime: "2026-10-10T09:00:00.000Z",
  endTime: "2026-10-10T10:30:00.000Z",
};

describe("CreateSessionSchema", () => {
  it("leaves the teacher unset so the class's teacher is used", () => {
    expect(
      CreateSessionSchema.parse({ classId, ...times }).teacherId,
    ).toBeUndefined();
  });

  it("accepts a substitute teacher", () => {
    expect(
      CreateSessionSchema.parse({ classId, teacherId, ...times }).teacherId,
    ).toBe(teacherId);
  });
});

describe("UpdateSessionSchema", () => {
  const update = { teacherId, ...times, status: "Scheduled" };

  it("ignores a class id, since a session's class can't change", () => {
    expect(
      UpdateSessionSchema.parse({ ...update, classId }),
    ).not.toHaveProperty("classId");
  });

  it("treats blank reasons as not given", () => {
    const parsed = UpdateSessionSchema.parse({
      ...update,
      status: "Cancelled",
      cancellationReason: "  ",
      changeReason: "",
    });
    expect(parsed.cancellationReason).toBeUndefined();
    expect(parsed.changeReason).toBeUndefined();
  });

  it("rejects the retired Rescheduled status", () => {
    const result = UpdateSessionSchema.safeParse({
      ...update,
      status: "Rescheduled",
    });
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toEqual([
      "status",
    ]);
  });

  it("requires a teacher", () => {
    const { teacherId: _teacherId, ...withoutTeacher } = update;
    expect(UpdateSessionSchema.safeParse(withoutTeacher).success).toBe(false);
  });
});
