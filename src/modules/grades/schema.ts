import { z } from "zod";

export const GradeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
});
export type Grade = z.infer<typeof GradeSchema>;
