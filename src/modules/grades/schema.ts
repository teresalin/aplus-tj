import { z } from "zod";

export const CreateGradeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});
export type CreateGradeDTO = z.infer<typeof CreateGradeSchema>;
