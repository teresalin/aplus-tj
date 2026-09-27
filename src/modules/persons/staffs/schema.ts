import { z } from "zod";
import { dateField } from "@/lib/validation";
import {
  CreatePersonSchema,
  UpdatePersonSchema,
  validators,
} from "@/modules/persons/schema";

// ========================================
// STAFF DTOs (Input Validation)
// ========================================
export const CreateStaffSchema = CreatePersonSchema.extend({
  roleId: validators.uuid,
  hireDate: dateField,
  leaveDate: validators.optionalDate,
}).refine((data) => !data.leaveDate || data.leaveDate >= data.hireDate, {
  path: ["leaveDate"],
  message: "Leave date must be on or after hire date",
});

export const UpdateStaffSchema = UpdatePersonSchema.extend({
  roleId: validators.uuid.optional(),
  hireDate: dateField.optional(),
  leaveDate: validators.optionalDate,
}).partial();

export type CreateStaffDTO = z.infer<typeof CreateStaffSchema>;
export type UpdateStaffDTO = z.infer<typeof UpdateStaffSchema>;
