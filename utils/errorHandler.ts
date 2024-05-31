import { NextApiResponse } from "next";
import { UniqueConstraintError, ValidationError } from "./CustomError";

export function handleError(
  res: NextApiResponse,
  error: Error,
  statusCodeOverride?: number,
  publicMessageOverride?: string
) {
  console.error("API error:", error);

  let statusCode = statusCodeOverride || 500;
  let publicMessage = publicMessageOverride || "Internal server error";

  if (error instanceof UniqueConstraintError) {
    statusCode = 409;
    publicMessage = error.message;
  } else if (error instanceof ValidationError) {
    statusCode = 400;
    publicMessage = error.message;
  }

  res.status(statusCode).json({
    status: "Error",
    error: {
      code: statusCode,
      message: publicMessage,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    },
  });
}
