import { z } from "zod";
import { dateField } from "@/lib/validation";
import { SESSION_STATUSES } from "./constants";

/** Optional free text; blank input counts as not given. */
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

export const CreateSessionSchema = z.object({
  classId: z.uuid(),
  /** Defaults to the class's teacher. */
  teacherId: z.uuid().optional(),
  startTime: dateField,
  endTime: dateField,
});

/**
 * Updates replace the session's teacher, times, and status (PUT). A session's
 * class can't change, since its attendance belongs to that class.
 */
export const UpdateSessionSchema = z.object({
  teacherId: z.uuid(),
  startTime: dateField,
  endTime: dateField,
  status: z.enum(SESSION_STATUSES),
  /** Kept only while the session is cancelled. */
  cancellationReason: optionalText,
  /** Recorded in the session's history when its time changes. */
  changeReason: optionalText,
});

export type CreateSessionDTO = z.infer<typeof CreateSessionSchema>;
export type UpdateSessionDTO = z.infer<typeof UpdateSessionSchema>;
