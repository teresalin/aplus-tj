/**
 * Browser-side helper for calling this app's route handlers. Route handlers
 * return the resource on success and `{ error, details? }` on failure.
 */

export type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

interface ErrorBody {
  error?: string;
  details?: { path: string; message: string }[];
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function describeError(body: ErrorBody | null, status: number): string {
  if (!body?.error) return `Request failed with status ${status}`;
  const detail = body.details?.[0];
  if (!detail) return body.error;
  return detail.path
    ? `${body.error}: ${detail.path} - ${detail.message}`
    : `${body.error}: ${detail.message}`;
}

export async function apiRequest<T = unknown>(
  url: string,
  method: HttpMethod,
  body?: unknown,
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      describeError(payload, response.status),
      response.status,
    );
  }
  return payload as T;
}

/** Message suitable for showing to the user in a snackbar. */
export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "An unexpected error occurred";
}
