import { describe, expect, it } from "vitest";

import { CreateStudentSchema, UpdateStudentSchema } from "./schema";

const validStudent = {
  name: "Chen Alice",
  preferredName: "Alice",
  gender: "Female",
  dateOfBirth: "2016-05-10",
  email: "  Alice@Student.TEST ",
  phone: "0922",
  gradeId: "465c0f75-84d4-4651-af01-ea7f1e2d9cf0",
  currentSchool: "Da-An Elementary",
  admissionDate: "2025-01-01",
  departureDate: null,
};

function issuesOf(input: unknown) {
  const result = CreateStudentSchema.safeParse(input);
  return result.success
    ? []
    : result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
}

describe("CreateStudentSchema", () => {
  it("normalizes a valid student", () => {
    const student = CreateStudentSchema.parse({
      ...validStudent,
      preferredName: "",
    });
    expect(student.email).toBe("alice@student.test");
    expect(student.preferredName).toBeUndefined();
    expect(student.dateOfBirth.toISOString()).toBe("2016-05-10T00:00:00.000Z");
    expect(student.departureDate).toBeNull();
  });

  it("rejects a birth date in the future", () => {
    expect(issuesOf({ ...validStudent, dateOfBirth: "2999-01-01" })).toEqual([
      { path: "dateOfBirth", message: "Date cannot be in the future" },
    ]);
  });

  it("rejects a missing admission date instead of saving 1970-01-01", () => {
    expect(issuesOf({ ...validStudent, admissionDate: null })).toEqual([
      { path: "admissionDate", message: "A date is required" },
    ]);
  });

  it("rejects a departure before the admission date", () => {
    expect(issuesOf({ ...validStudent, departureDate: "2024-12-31" })).toEqual([
      {
        path: "departureDate",
        message: "Departure date must be on or after admission date",
      },
    ]);
  });

  it("accepts a student without an email", () => {
    const { email: _email, ...withoutEmail } = validStudent;
    expect(CreateStudentSchema.parse(withoutEmail).email).toBeUndefined();
    expect(
      CreateStudentSchema.parse({ ...validStudent, email: " " }).email,
    ).toBeNull();
  });

  it("rejects a malformed email", () => {
    expect(issuesOf({ ...validStudent, email: "alice" })).toEqual([
      expect.objectContaining({ path: "email" }),
    ]);
  });

  it("rejects an invalid grade id", () => {
    expect(issuesOf({ ...validStudent, gradeId: "grade-3" })).toEqual([
      expect.objectContaining({ path: "gradeId" }),
    ]);
  });
});

describe("UpdateStudentSchema", () => {
  it("accepts partial updates", () => {
    expect(UpdateStudentSchema.parse({ preferredName: "Ally" })).toEqual({
      preferredName: "Ally",
    });
  });

  it("clears the email when it is sent blank", () => {
    expect(UpdateStudentSchema.parse({ email: "" })).toEqual({ email: null });
  });

  it("allows clearing the departure date with null", () => {
    expect(UpdateStudentSchema.parse({ departureDate: null })).toEqual({
      departureDate: null,
    });
  });
});
