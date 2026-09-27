import { z } from "zod";
import { daysOfWeek } from "@/constants";

const timeOfDay = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
    "Times must use the HH:mm:ss format",
  );

export const ScheduleInputSchema = z.object({
  dayOfWeek: z.enum(daysOfWeek),
  startTime: timeOfDay,
  endTime: timeOfDay,
});

export const CreateClassSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  gradeId: z.uuid(),
  teacherId: z.uuid(),
  capacity: z.coerce.number().int().nonnegative(),
  schedules: z.array(ScheduleInputSchema).default([]),
});

/** Updates replace the class details and its whole weekly schedule (PUT). */
export const UpdateClassSchema = CreateClassSchema;

export type ScheduleInput = z.infer<typeof ScheduleInputSchema>;
export type CreateClassDTO = z.infer<typeof CreateClassSchema>;
export type UpdateClassDTO = z.infer<typeof UpdateClassSchema>;
