import { z } from "zod";
import { dateField } from "@/lib/validation";

export const CreateAssignmentSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  classId: z.uuid(),
  description: z.string().trim().optional(),
  dueDate: dateField,
});

/** Updates replace the assignment details and its class (PUT). */
export const UpdateAssignmentSchema = CreateAssignmentSchema;

export type CreateAssignmentDTO = z.infer<typeof CreateAssignmentSchema>;
export type UpdateAssignmentDTO = z.infer<typeof UpdateAssignmentSchema>;
