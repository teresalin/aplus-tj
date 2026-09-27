import "server-only";
import type { z } from "zod";
import { HttpError } from "../errors/custom-errors";
import { isUuid } from "../ids";

/** Validates a dynamic route segment that must be a UUID (400 otherwise). */
export function parseId(value: string): string {
  if (!isUuid(value)) throw new HttpError(400, "Invalid id");
  return value;
}

/** Reads the JSON request body and validates it against `schema`. */
export async function parseBody<S extends z.ZodType>(
  request: Request,
  schema: S,
): Promise<z.output<S>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new HttpError(400, "Request body must be valid JSON");
  }
  return schema.parse(body);
}
