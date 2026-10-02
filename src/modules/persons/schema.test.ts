import { describe, expect, it } from "vitest";

import { CreateParentSchema } from "./parents/schema";
import { CreateStaffSchema } from "./staffs/schema";

// The database allows a person without an email (young students); the app
// still requires one for the people the school contacts.
const person = {
  name: "Chen Mei",
  gender: "Female",
  dateOfBirth: "1985-03-02",
};

const staff = {
  ...person,
  roleId: "465c0f75-84d4-4651-af01-ea7f1e2d9cf0",
  hireDate: "2024-08-01",
};

describe("email is required for parents and staff", () => {
  it.each([
    ["parent", CreateParentSchema, person],
    ["staff", CreateStaffSchema, staff],
  ] as const)("rejects a %s without an email", (_role, schema, input) => {
    for (const email of [undefined, ""]) {
      const result = schema.safeParse({ ...input, email });
      expect(result.success).toBe(false);
      expect(result.error?.issues.map((issue) => issue.path.join("."))).toEqual(
        ["email"],
      );
    }
  });

  it.each([
    ["parent", CreateParentSchema, person],
    ["staff", CreateStaffSchema, staff],
  ] as const)("accepts a %s with an email", (_role, schema, input) => {
    expect(schema.parse({ ...input, email: "Mei@Example.TEST" }).email).toBe(
      "mei@example.test",
    );
  });
});
