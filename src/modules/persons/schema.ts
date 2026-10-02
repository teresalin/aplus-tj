import { z } from "zod";
import { dateField, optionalDateField } from "@/lib/validation";

// ========================================
// SHARED VALIDATORS (used across modules)
// ========================================
const email = z
  .string()
  .trim()
  .email()
  .transform((s) => s.toLowerCase());

export const validators = {
  email,
  /** Email for people who may not have one (students); blank input becomes `null`, which clears it. */
  optionalEmail: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? null : value,
    email.nullish(),
  ),
  phone: z.string().trim().optional(),
  // Compared at validation time (not module load) so long-running servers stay correct.
  pastDate: dateField.refine(
    (date) => date <= new Date(),
    "Date cannot be in the future",
  ),
  /** Optional date that may be cleared by sending `null`. */
  optionalDate: optionalDateField,
  uuid: z.string().uuid(),
} as const;

// ========================================
// PERSON DTOs (for API inputs)
// ========================================
// Shared fields for creating ANY person (student, staff, parent). Email is
// required here; the student schemas override it with `validators.optionalEmail`.
export const CreatePersonSchema = z.object({
  name: z.string().trim().min(1),
  preferredName: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  gender: z.enum(["Male", "Female", "Other"]), // required for creation
  dateOfBirth: validators.pastDate,
  phone: validators.phone,
  email: validators.email,
  notes: z.string().optional(),
});

export const UpdatePersonSchema = CreatePersonSchema.partial();

export type CreatePersonDTO = z.infer<typeof CreatePersonSchema>;
export type UpdatePersonDTO = z.infer<typeof UpdatePersonSchema>;
