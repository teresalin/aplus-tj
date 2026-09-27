import { z } from "zod";

// ========================================
// SHARED VALIDATORS (used across modules)
// ========================================
export const validators = {
  email: z
    .string()
    .trim()
    .email()
    .transform((s) => s.toLowerCase()),
  phone: z.string().trim().optional(),
  // Compared at validation time (not module load) so long-running servers stay correct.
  pastDate: z.coerce
    .date()
    .refine((date) => date <= new Date(), "Date cannot be in the future"),
  futureDate: z.coerce
    .date()
    .refine((date) => date >= new Date(), "Date cannot be in the past"),
  /** Optional date that may be cleared by sending `null`. */
  optionalDate: z.coerce.date().nullish(),
  uuid: z.string().uuid(),
} as const;

// ========================================
// BASE PERSON SCHEMA (for reading from DB)
// ========================================
export const PersonSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
  preferredName: z.string().trim().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email(),
  dateOfBirth: z.coerce.date(),
  notes: z.string().optional(),
  active: z.boolean(),
});
export type Person = z.infer<typeof PersonSchema>;

// ========================================
// PERSON DTOs (for API inputs)
// ========================================
// Shared fields for creating ANY person (student, staff, parent)
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
