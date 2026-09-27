import { z } from "zod";
import {
  CreatePersonSchema,
  UpdatePersonSchema,
  validators,
} from "@/modules/persons/schema";

// ========================================
// INPUT VALIDATION (DTOs)
// ========================================
export const CreateStudentSchema = CreatePersonSchema.extend({
  currentSchool: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  gradeId: validators.uuid,
  textbookPublisher: z.string().trim().optional(),
  admissionDate: z.coerce.date(),
  departureDate: validators.optionalDate,
}).refine(
  (data) => !data.departureDate || data.departureDate >= data.admissionDate,
  {
    path: ["departureDate"],
    message: "Departure date must be on or after admission date",
  },
);

export const UpdateStudentSchema = UpdatePersonSchema.extend({
  currentSchool: z.string().trim().optional(),
  gradeId: validators.uuid.optional(),
  textbookPublisher: z.string().trim().optional(),
  admissionDate: z.coerce.date().optional(),
  departureDate: validators.optionalDate,
}).partial();

export type CreateStudentDTO = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentDTO = z.infer<typeof UpdateStudentSchema>;
