import { z } from "zod";

/**
 * A date sent as an ISO string. Unlike `z.coerce.date()`, which turns `null`
 * into 1970-01-01, missing or empty input is rejected.
 */
export const dateField = z
  .union([z.string().trim().min(1, "A date is required"), z.date()], {
    error: "A date is required",
  })
  .pipe(z.coerce.date({ error: "Invalid date" }));

/** An optional date that can be cleared by sending `null`. */
export const optionalDateField = dateField.nullish();
