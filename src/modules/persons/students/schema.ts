import { z } from "zod";
import {
  PersonCreateSchema,
  PersonUpdateSchema,
  validators,
} from "@/modules/persons/schema";

// ========================================
// INPUT VALIDATION (DTOs)
// ========================================
export const CreateStudentSchema = PersonCreateSchema.extend({
  currentSchool: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  gradeId: validators.uuid,
  textbookPublisher: z.string().trim().optional(),
  admissionDate: z.coerce.date(),
  departureDate: z.coerce.date().optional(),
}).refine(
  (data) => !data.departureDate || data.departureDate >= data.admissionDate,
  {
    path: ["departureDate"],
    message: "Departure date must be on or after admission date",
  },
);
export type CreateStudentDTO = z.infer<typeof CreateStudentSchema>;

export const UpdateStudentSchema = PersonUpdateSchema.extend({
  currentSchool: z.string().trim().optional(),
  gradeId: validators.uuid.optional(),
  textbookPublisher: z.string().trim().optional(),
  admissionDate: z.coerce.date().optional(),
  departureDate: z.coerce.date().optional(),
}).partial();
export type UpdateStudentDTO = z.infer<typeof UpdateStudentSchema>;
