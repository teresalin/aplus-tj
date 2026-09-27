import { z } from "zod";
import { dateField } from "@/lib/validation";

export const CreateSessionSchema = z.object({
  classId: z.uuid(),
  startTime: dateField,
  endTime: dateField,
});

/** Updates replace the session's class and times (PUT). */
export const UpdateSessionSchema = CreateSessionSchema;

export type CreateSessionDTO = z.infer<typeof CreateSessionSchema>;
export type UpdateSessionDTO = z.infer<typeof UpdateSessionSchema>;
