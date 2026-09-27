import { Prisma } from "@prisma/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import {
  HttpError,
  NotFoundError,
  UniqueConstraintError,
} from "@/lib/errors/custom-errors";
import { handleApiError } from "./error-handler";

async function toResult(error: unknown) {
  const response = handleApiError(error);
  return { status: response.status, body: await response.json() };
}

function prismaError(code: string, meta?: Record<string, unknown>) {
  return new Prisma.PrismaClientKnownRequestError("database error", {
    code,
    clientVersion: Prisma.prismaVersion.client,
    meta,
  });
}

describe("handleApiError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports validation failures as 400 with the failing fields", async () => {
    const result = z.object({ name: z.string().min(1) }).safeParse({});
    expect(result.success).toBe(false);

    const { status, body } = await toResult(result.error);
    expect(status).toBe(400);
    expect(body.error).toBe("Validation failed");
    expect(body.details).toEqual([expect.objectContaining({ path: "name" })]);
  });

  it("uses the status of an HttpError", async () => {
    expect(await toResult(new HttpError(403, "Forbidden"))).toEqual({
      status: 403,
      body: { error: "Forbidden" },
    });
  });

  it("maps domain errors to 409 and 404", async () => {
    expect(await toResult(new UniqueConstraintError("Name taken"))).toEqual({
      status: 409,
      body: { error: "Name taken" },
    });
    expect(await toResult(new NotFoundError("Student not found"))).toEqual({
      status: 404,
      body: { error: "Student not found" },
    });
  });

  it("names the conflicting field for Prisma unique violations", async () => {
    const { status, body } = await toResult(
      prismaError("P2002", { target: ["email"] }),
    );
    expect(status).toBe(409);
    expect(body.error).toBe("A record with this email already exists");
  });

  it("maps a missing Prisma record to 404", async () => {
    const { status } = await toResult(prismaError("P2025"));
    expect(status).toBe(404);
  });

  it("hides unexpected errors behind a generic 500", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { status, body } = await toResult(
      new Error("connection string with secrets"),
    );
    expect(status).toBe(500);
    expect(body).toEqual({ error: "Internal server error" });
  });
});
