import { z } from "zod";
import { CreatePersonSchema } from "@/modules/persons/schema";

// ========================================
// PARENT DTOs (Input Validation)
// ========================================
export const CreateParentSchema = CreatePersonSchema.extend({
  // TODO: Add parent-specific fields if needed (e.g. relationship to student)
});
export type CreateParentDTO = z.infer<typeof CreateParentSchema>;
