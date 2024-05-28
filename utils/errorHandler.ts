import { NextApiResponse } from "next";

export function handleError(
  res: NextApiResponse,
  error: Error,
  code: number = 500
) {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    level: "ERROR",
    message: error.message,
    stack: error.stack,
  };
  console.error("API error:", JSON.stringify(errorDetails)); // Structured logging

  res.status(code).json({
    status: "Error",
    error: {
      code,
      message: error.message || "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined, // Only include stack in dev mode
    },
  });
}
