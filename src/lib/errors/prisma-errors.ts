import { Prisma } from "@prisma/client";
import { UniqueConstraintError } from "./custom-errors";

/**
 * Translates a Prisma unique-constraint violation into a domain error with a
 * user-facing message; any other error is rethrown unchanged.
 */
export function rethrowUniqueViolation(error: unknown, message: string): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new UniqueConstraintError(message);
  }
  throw error;
}
