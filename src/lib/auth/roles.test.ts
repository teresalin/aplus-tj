import { afterEach, describe, expect, it, vi } from "vitest";

import { resolveRole } from "./roles";

describe("resolveRole", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("gives the no-access role when there is no email", () => {
    vi.stubEnv("AUTH_ADMIN_EMAILS", "owner@school.test");
    expect(resolveRole(undefined)).toBe("user");
    expect(resolveRole(null)).toBe("user");
    expect(resolveRole("")).toBe("user");
  });

  it("matches admin emails exactly, ignoring case and whitespace", () => {
    vi.stubEnv("AUTH_ADMIN_EMAILS", " Owner@School.test , second@school.test");
    expect(resolveRole("owner@school.test")).toBe("admin");
    expect(resolveRole("SECOND@school.test")).toBe("admin");
    expect(resolveRole("owner@school.test.evil.com")).toBe("user");
  });

  it("matches a whole domain with an @domain entry", () => {
    vi.stubEnv("AUTH_TEACHER_EMAILS", "@school.test");
    expect(resolveRole("teacher@school.test")).toBe("teacher");
    expect(resolveRole("teacher@notschool.test")).toBe("user");
    expect(resolveRole("teacher@sub.school.test")).toBe("user");
  });

  it("prefers admin when an email is on both lists", () => {
    vi.stubEnv("AUTH_ADMIN_EMAILS", "owner@school.test");
    vi.stubEnv("AUTH_TEACHER_EMAILS", "@school.test");
    expect(resolveRole("owner@school.test")).toBe("admin");
  });

  it("grants nothing when the allowlists are unset or blank", () => {
    vi.stubEnv("AUTH_ADMIN_EMAILS", " , ");
    expect(resolveRole("owner@school.test")).toBe("user");
  });
});
