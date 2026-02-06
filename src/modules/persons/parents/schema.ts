import { z } from "zod";
import {
  CreatePersonSchema,
  UpdatePersonSchema,
} from "@/modules/persons/schema";

// ========================================
// PARENT DTOs (Input Validation)
// ========================================
export const CreateParentSchema = CreatePersonSchema.extend({
  // TODO: Add parent-specific fields if needed (e.g. relationship to student)
});
export type CreateParentDTO = z.infer<typeof CreateParentSchema>;

export const UpdateParentSchema = UpdatePersonSchema.extend({
  // TODO: Add parent-specific fields if needed (e.g. relationship to student)
}).partial();
export type UpdateParentDTO = z.infer<typeof UpdateParentSchema>;
