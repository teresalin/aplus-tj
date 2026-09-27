import { z } from "zod";

export const CreateSessionSchema = z.object({
  classId: z.uuid(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

/** Updates replace the session's class and times (PUT). */
export const UpdateSessionSchema = CreateSessionSchema;

export type CreateSessionDTO = z.infer<typeof CreateSessionSchema>;
export type UpdateSessionDTO = z.infer<typeof UpdateSessionSchema>;
