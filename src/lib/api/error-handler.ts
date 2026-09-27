import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import {
  HttpError,
  NotFoundError,
  UniqueConstraintError,
} from "../errors/custom-errors";

/** Error body returned by every route handler: `{ error, details? }`. */
export interface ApiErrorBody {
  error: string;
  details?: { path: string; message: string }[];
}

function errorResponse(status: number, body: ApiErrorBody) {
  return NextResponse.json(body, { status });
}

export function handleApiError(error: unknown): NextResponse<ApiErrorBody> {
  if (error instanceof ZodError) {
    return errorResponse(400, {
      error: "Validation failed",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof HttpError) {
    return errorResponse(error.status, { error: error.message });
  }

  if (error instanceof UniqueConstraintError) {
    return errorResponse(409, { error: error.message });
  }

  if (error instanceof NotFoundError) {
    return errorResponse(404, { error: error.message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const target = error.meta?.target;
        const fields = Array.isArray(target) ? target.join(", ") : target;
        return errorResponse(409, {
          error: fields
            ? `A record with this ${fields} already exists`
            : "A record with these values already exists",
        });
      }
      case "P2025":
        return errorResponse(404, { error: "Record not found" });
      case "P2003":
        return errorResponse(400, {
          error: "Invalid reference to related record",
        });
    }
  }

  console.error("Unhandled API error:", error);
  return NextResponse.json(
    {
      error: "Internal server error",
      ...(process.env.NODE_ENV === "development" &&
        error instanceof Error && {
          details: [{ path: "", message: error.message }],
        }),
    },
    { status: 500 },
  );
}
