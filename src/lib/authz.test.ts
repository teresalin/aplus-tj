import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AppRole } from "@/lib/auth/roles";
import { HttpError } from "@/lib/errors/custom-errors";
import { authorize, requirePageAccess } from "./authz";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("next/navigation", () => ({
  // The real redirect() throws to stop rendering; mirror that.
  redirect: vi.fn((url: string) => {
    throw new Error(`redirect:${url}`);
  }),
}));

const mockedGetServerSession = vi.mocked(getServerSession);

function signInAs(role: AppRole | null) {
  const session: Session | null = role
    ? { user: { email: `${role}@school.test`, role }, expires: "2099-01-01" }
    : null;
  mockedGetServerSession.mockResolvedValue(session);
}

describe("authorize (route handlers)", () => {
  beforeEach(() => {
    mockedGetServerSession.mockReset();
  });

  it("rejects signed-out requests with 401", async () => {
    signInAs(null);
    await expect(authorize("admin")).rejects.toMatchObject({
      status: 401,
    });
  });

  it("rejects roles that are not allowed with 403", async () => {
    signInAs("teacher");
    const error = await authorize("admin").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({ status: 403, message: "Forbidden" });
  });

  it("returns the session for an allowed role", async () => {
    signInAs("admin");
    await expect(authorize("admin")).resolves.toMatchObject({ role: "admin" });
  });

  it("allows only staff roles by default", async () => {
    signInAs("teacher");
    await expect(authorize()).resolves.toMatchObject({ role: "teacher" });

    signInAs("user");
    await expect(authorize()).rejects.toMatchObject({ status: 403 });
  });
});

describe("requirePageAccess (pages)", () => {
  beforeEach(() => {
    mockedGetServerSession.mockReset();
  });

  it("sends signed-out visitors to sign in", async () => {
    signInAs(null);
    await expect(requirePageAccess()).rejects.toThrow(
      "redirect:/api/auth/signin",
    );
  });

  it("sends signed-in users without a staff role to /no-access", async () => {
    signInAs("user");
    await expect(requirePageAccess()).rejects.toThrow("redirect:/no-access");
  });

  it("lets staff through", async () => {
    signInAs("teacher");
    await expect(requirePageAccess()).resolves.toMatchObject({
      user: { role: "teacher" },
    });
  });
});
