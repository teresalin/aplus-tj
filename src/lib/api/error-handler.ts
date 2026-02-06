import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import {
  MethodNotAllowedError,
  NotFoundError,
  UniqueConstraintError,
  ValidationError,
} from "../errors/custom-errors";

export function handleApiError(error: unknown): NextResponse {
  console.error("API error:", error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
      { status: 400 },
    );
  }

  // Custom errors
  if (error instanceof UniqueConstraintError) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof MethodNotAllowedError) {
    return NextResponse.json({ error: error.message }, { status: 405 });
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const fields = (error.meta?.target as string[]) || [];
      return NextResponse.json(
        { error: `A record with this ${fields.join(", ")} already exists` },
        { status: 409 },
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid reference to related record" },
        { status: 400 },
      );
    }
  }

  // Authorization errors
  if (error instanceof Error) {
    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Generic server error
  const errorMessage =
    error instanceof Error ? error.message : "Internal server error";
  return NextResponse.json(
    {
      error: "Internal server error",
      ...(process.env.NODE_ENV === "development" && {
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      }),
    },
    { status: 500 },
  );
}
